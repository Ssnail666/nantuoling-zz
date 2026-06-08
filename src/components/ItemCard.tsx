import Image from "next/image";
import Link from "next/link";
import { Item, formatPrice, formatRelativeTime } from "@/lib/supabase";

type ItemCardProps = {
  item: Item;
};

export function ItemCard({ item }: ItemCardProps) {
  const firstImage = item.images[0] || "/wechat-group-placeholder.svg";

  return (
    <Link
      href={`/item/${item.id}`}
      className="tap-active group overflow-hidden rounded-[28px] bg-white shadow-card transition"
    >
      <div className="relative aspect-[0.95] overflow-hidden bg-oat">
        <Image
          src={firstImage}
          alt={item.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1 text-sm font-semibold text-clay">
          {formatPrice(item.price)}
        </div>
        <div className="absolute bottom-3 left-3 rounded-full bg-ink/78 px-3 py-1 text-xs font-medium text-white">
          {item.age_group}
        </div>
        {item.status === "sold" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/38">
            <span className="rotate-[-12deg] rounded-xl border border-white/60 bg-clay px-5 py-2 text-lg font-bold text-white">
              已出
            </span>
          </div>
        ) : null}
      </div>
      <div className="space-y-2 p-3">
        <h3 className="line-clamp-2 min-h-[44px] text-[15px] font-semibold text-ink">
          {item.title}
        </h3>
        <p className="text-sm text-stone-500">
          {item.community}
          {item.building ? ` · ${item.building}` : ""}
        </p>
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span>{item.category}</span>
          <span>{formatRelativeTime(item.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
