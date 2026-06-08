"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import {
  Item,
  formatPrice,
  getStoredItemIds,
  isSupabaseConfigured,
  removeStoredItemId,
  supabase
} from "@/lib/supabase";

export default function MyPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMyItems() {
      if (!isSupabaseConfigured) {
        setMessage("请先配置 Supabase 环境变量。");
        setLoading(false);
        return;
      }

      const ids = getStoredItemIds();
      if (!ids.length) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .in("id", ids)
        .order("created_at", { ascending: false });

      if (cancelled) {
        return;
      }

      if (error) {
        setMessage(error.message);
      } else {
        setItems((data ?? []) as Item[]);
      }

      setLoading(false);
    }

    void loadMyItems();

    return () => {
      cancelled = true;
    };
  }, []);

  async function markAsSold(id: number) {
    const { error } = await supabase.from("items").update({ status: "sold" }).eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }

    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, status: "sold" } : item))
    );
  }

  async function removeItem(id: number) {
    const confirmed = window.confirm("确认删除这条发布信息吗？");
    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }

    removeStoredItemId(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[32px] bg-white px-5 py-6 shadow-card">
        <h1 className="text-2xl font-extrabold text-ink">我的发布</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          这里只会显示当前设备发布过的物品。换手机或清空缓存后，需要重新发布或重新记录。
        </p>
      </section>

      {message ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {message}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[30px] bg-white px-6 py-16 text-center text-stone-500 shadow-card">
          正在加载你的发布...
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="你还没有发布过闲置"
          description="去发布一件宝宝暂时用不上的物品，让它在邻里之间继续发挥价值。"
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <section
              key={item.id}
              className="rounded-[28px] bg-white p-4 shadow-card"
            >
              <div className="flex gap-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-oat">
                  <Image
                    src={item.images[0] || "/wechat-group-placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/item/${item.id}`} className="line-clamp-2 font-bold text-ink">
                      {item.title}
                    </Link>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "sold"
                          ? "bg-clay/10 text-clay"
                          : "bg-moss/10 text-moss"
                      }`}
                    >
                      {item.status === "sold" ? "已出" : "在售"}
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-extrabold text-clay">
                    {formatPrice(item.price)}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {item.community}
                    {item.building ? ` · ${item.building}` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => markAsSold(item.id)}
                  className="tap-active rounded-[20px] bg-oat px-4 py-3 text-sm font-semibold text-clay"
                >
                  标记已出
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="tap-active rounded-[20px] border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-500"
                >
                  删除
                </button>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
