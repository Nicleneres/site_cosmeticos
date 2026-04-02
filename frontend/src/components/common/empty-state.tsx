import { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-blush-300 bg-white/80 p-8 text-center">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
