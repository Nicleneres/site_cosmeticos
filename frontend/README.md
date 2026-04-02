# Bella Aura Atelier - Sistema de E-commerce Real (Next.js + PostgreSQL + Prisma)

Projeto full stack pronto para producao com:

- Next.js (App Router) no frontend e backend (Route Handlers)
- PostgreSQL (Supabase ou Neon)
- Prisma ORM
- Autenticacao com NextAuth (email/senha)
- Upload real de imagens com Cloudinary
- Painel admin protegido
- Pedidos persistidos no banco com status real
- Catalogo e CRUD reais (sem localStorage, sem mocks em runtime)

---

## 1) Requisitos

- Node.js 20+
- NPM 10+
- Conta no Vercel
- Conta no Supabase **ou** Neon
- Conta no Cloudinary

---

## 2) Variaveis de ambiente

Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

Variaveis obrigatorias:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## 3) Rodando localmente

1. Instale dependencias:

```powershell
cd C:\Users\Nilcle\Documents\Playground\frontend
npm.cmd install
```

2. Gere o client do Prisma:

```powershell
npm.cmd run prisma:generate
```

3. Aplique schema no banco:

```powershell
npm.cmd run prisma:push
```

4. Rode seed inicial (admin + dados base):

```powershell
npm.cmd run prisma:seed
```

5. Suba o projeto:

```powershell
npm.cmd run dev
```

Acesse:

- Site: `http://127.0.0.1:3000`
- Admin: `http://127.0.0.1:3000/admin`

Login admin seed:

- Email: `admin@bellaaura.com`
- Senha: `123456`

---

## 4) Estrutura de banco (Prisma)

O schema esta em:

- `prisma/schema.prisma`

Modelos principais:

- `User` (admin)
- `Product`
- `Category`
- `Brand`
- `Order`
- `OrderItem`
- `Testimonial`
- `Setting`

Modelos auxiliares:

- `Promotion`
- `NewsletterLead`
- `ContactMessage`

---

## 5) APIs reais implementadas

### Produtos
- `GET /api/products` (listagem + filtros)
- `POST /api/products` (criar, admin)
- `PATCH /api/products/:id` (editar, admin)
- `DELETE /api/products/:id` (deletar, admin)

### Categorias
- `GET /api/categories`
- `POST /api/categories` (admin)
- `PATCH /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

### Marcas
- `GET /api/brands`
- `POST /api/brands` (admin)
- `PATCH /api/brands/:id` (admin)
- `DELETE /api/brands/:id` (admin)

### Promocoes
- `GET /api/promotions`
- `POST /api/promotions` (admin)
- `PATCH /api/promotions/:id` (admin)
- `DELETE /api/promotions/:id` (admin)

### Depoimentos
- `GET /api/testimonials`
- `POST /api/testimonials` (admin)
- `PATCH /api/testimonials/:id` (admin)
- `DELETE /api/testimonials/:id` (admin)

### Pedidos
- `POST /api/orders` (cria pedido real)
- `GET /api/orders` (lista pedidos, admin)
- `PATCH /api/orders/:id` (status: novo/em-andamento/finalizado, admin)

### Configuracoes
- `GET /api/settings`
- `PATCH /api/settings` (admin)

### Outros
- `GET /api/store` (bootstrap completo da loja)
- `POST /api/newsletter`
- `POST /api/contact-messages`
- `POST /api/upload` (Cloudinary, admin)
- `POST /api/admin/login` (validacao de credenciais)
- `GET/POST /api/auth/[...nextauth]` (sessao NextAuth)

---

## 6) Deploy na Vercel (passo a passo)

### 6.1 Criar conta Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em `Sign Up`
3. Entre com GitHub, GitLab ou Bitbucket

### 6.2 Subir o projeto
1. Suba este projeto no GitHub
2. No painel Vercel clique `Add New` -> `Project`
3. Selecione o repositorio
4. Configure `Root Directory` como `frontend`
5. Build command: `npm run build`
6. Install command: `npm install`
7. Clique em `Deploy`

### 6.3 Configurar variaveis de ambiente na Vercel
No projeto Vercel:
1. `Settings` -> `Environment Variables`
2. Adicione:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (URL final da Vercel, ex: `https://seu-site.vercel.app`)
   - `NEXTAUTH_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Salve e redeploy

### 6.4 Conectar banco (Supabase ou Neon)

#### Supabase
1. Crie projeto em [supabase.com](https://supabase.com)
2. Copie a connection string PostgreSQL
3. Cole em `DATABASE_URL` na Vercel

#### Neon
1. Crie projeto em [neon.tech](https://neon.tech)
2. Copie a connection string
3. Cole em `DATABASE_URL` na Vercel

### 6.5 Rodar Prisma migrate em producao

Opcao recomendada:
1. No seu terminal local, com `DATABASE_URL` de producao:

```powershell
npx prisma migrate deploy
npx prisma db seed
```

2. Alternativa: executar em CI/CD apos deploy.

### 6.6 Site online
Apos deploy e migrate, seu site ja estara online na URL da Vercel.

### 6.7 Dominio proprio (opcional)
1. Na Vercel: `Settings` -> `Domains`
2. Adicione seu dominio (`www.sualoja.com.br`)
3. Configure DNS no seu provedor (Registro.br, Cloudflare etc.)
4. Aguarde propagacao

---

## 7) Login admin em producao

Depois de rodar seed:

- Email: `admin@bellaaura.com`
- Senha: `123456`

Altere a senha no banco assim que publicar em producao.

---

## 8) Comandos uteis

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run start
npm.cmd run prisma:generate
npm.cmd run prisma:push
npm.cmd run prisma:migrate
npm.cmd run prisma:seed
npm.cmd run prisma:studio
```

---

## 9) SEO

- Metadata por pagina
- Metadata dinamica em produto (`/produtos/[slug]`)
- `robots.txt`
- `sitemap.xml`

---

## 10) Observacao legal

Loja de revenda independente. As marcas citadas pertencem a seus respectivos proprietarios.
