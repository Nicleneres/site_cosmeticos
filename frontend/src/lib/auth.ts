import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

const isProduction = process.env.NODE_ENV === "production";
const authSecret =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  (isProduction ? undefined : "dev-only-secret-change-me");

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: authSecret,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/admin"
  },
  providers: [
    Credentials({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!process.env.DATABASE_URL) {
          if (!isProduction) {
            console.warn(
              "[auth] DATABASE_URL não configurado. Login administrativo ficará indisponível até configurar o banco."
            );
          }
          return null;
        }

        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString();

        if (!email || !password) return null;

        const { prisma } = await import("@/lib/prisma");

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) return null;

        const passwordValid = await compare(password, user.passwordHash);
        if (!passwordValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN";
      }
      return session;
    }
  },
  trustHost: true
});
