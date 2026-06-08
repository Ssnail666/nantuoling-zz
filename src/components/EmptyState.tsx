type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[30px] border border-dashed border-stone-300 bg-white/80 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mist text-3xl">
        📦
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-stone-500">{description}</p>
    </div>
  );
}
