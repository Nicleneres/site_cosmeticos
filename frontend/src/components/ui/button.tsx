import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "whatsapp" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-white shadow-soft hover:bg-[#2f2633] focus-visible:ring-2 focus-visible:ring-ink/35",
  secondary:
    "bg-gradient-to-r from-blush-200 to-nude-200 text-ink hover:from-blush-300 hover:to-nude-300 focus-visible:ring-2 focus-visible:ring-blush-300",
  ghost: "bg-transparent text-ink hover:bg-blush-100 focus-visible:ring-2 focus-visible:ring-blush-300",
  outline:
    "border border-blush-300 bg-white text-ink hover:bg-blush-50 focus-visible:ring-2 focus-visible:ring-blush-300",
  whatsapp:
    "bg-[#25D366] text-white shadow-soft hover:bg-[#1fb95a] focus-visible:ring-2 focus-visible:ring-[#25D366]/30",
  danger: "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-2 focus-visible:ring-red-300"
};

export function Button({
  className,
  variant = "primary",
  fullWidth,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
}
