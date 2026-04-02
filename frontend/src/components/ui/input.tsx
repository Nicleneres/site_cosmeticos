import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
      <input
        id={id}
        className={cn(
          "h-11 rounded-xl border border-blush-200 bg-white px-3 text-sm text-ink placeholder:text-muted outline-none transition focus:border-blush-300 focus:ring-2 focus:ring-blush-200",
          error && "border-red-300 focus:border-red-400 focus:ring-red-200",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
      <textarea
        id={id}
        className={cn(
          "min-h-28 rounded-xl border border-blush-200 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted outline-none transition focus:border-blush-300 focus:ring-2 focus:ring-blush-200",
          error && "border-red-300 focus:border-red-400 focus:ring-red-200",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export function Select({ label, error, className, id, children, ...props }: SelectProps) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      {label && <span className="text-sm font-medium text-ink">{label}</span>}
      <select
        id={id}
        className={cn(
          "h-11 rounded-xl border border-blush-200 bg-white px-3 text-sm text-ink outline-none transition focus:border-blush-300 focus:ring-2 focus:ring-blush-200",
          error && "border-red-300 focus:border-red-400 focus:ring-red-200",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}
