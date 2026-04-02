import { cn } from "@/lib/utils/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  center,
  className
}: SectionHeadingProps) {
  return (
    <div className={cn(center && "text-center", className)}>
      {eyebrow && (
        <span className="inline-flex rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-2xl font-semibold leading-tight text-ink sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 max-w-3xl text-sm text-muted sm:text-base">{description}</p>}
    </div>
  );
}
