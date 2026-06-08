"use client";

import { useEffect, useMemo, useState } from "react";
import { AgeTabs } from "@/components/AgeTabs";
import { EmptyState } from "@/components/EmptyState";
import { ItemCard } from "@/components/ItemCard";
import { TrustPanel } from "@/components/TrustPanel";
import { WeChatGroupEntry } from "@/components/WeChatGroupEntry";
import {
  DEFAULT_COMMUNITY,
  Item,
  isSupabaseConfigured,
  supabase
} from "@/lib/supabase";

export default function HomePage() {
  const [selectedAge, setSelectedAge] = useState("all");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadItems() {
      setLoading(true);
      setError("");

      if (!isSupabaseConfigured) {
        setLoading(false);
        setError("请先配置 Supabase 环境变量，网站就能开始使用。");
        return;
      }

      const { data, error: queryError } = await supabase
        .from("items")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (cancelled) {
        return;
      }

      if (queryError) {
        setError(queryError.message);
        setItems([]);
      } else {
        setItems((data ?? []) as Item[]);
      }

      setLoading(false);
    }

    void loadItems();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedAge === "all") {
      return items;
    }

    return items.filter((item) => item.age_group === selectedAge);
  }, [items, selectedAge]);

  const recentCount = useMemo(() => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return items.filter((item) => new Date(item.created_at).getTime() >= oneDayAgo)
      .length;
  }, [items]);

  return (
    <div className="space-y-5 pb-4">
      <section className="overflow-hidden rounded-[34px] bg-gradient-to-br from-[#264233] via-[#427A5B] to-[#C56B49] px-5 py-6 text-white shadow-card">
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">
          Nantuoling Neighbors
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight">
          南托岭 · 邻里闲置
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-white/82">
          给宝妈和年轻家庭一个更省心的闲置流转角。看得见位置，约得成面交，东西更容易放心买。
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-white/85">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
            默认社区：{DEFAULT_COMMUNITY}
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
            今日新上 {recentCount} 件
          </span>
        </div>
      </section>

      <TrustPanel />
      <WeChatGroupEntry />

      <section className="soft-panel rounded-[30px] border border-white/80 p-4 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-ink">最新闲置</h2>
            <p className="text-sm text-stone-500">先按年龄段看，更适合家长快速筛选。</p>
          </div>
          <div className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-moss">
            持续更新
          </div>
        </div>
        <AgeTabs value={selectedAge} onChange={setSelectedAge} />
      </section>

      {loading ? (
        <div className="rounded-[30px] bg-white px-6 py-16 text-center text-stone-500 shadow-card">
          正在加载邻里闲置...
        </div>
      ) : error ? (
        <div className="rounded-[30px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-700">
          {error}
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="还没有物品，快来发布第一件闲置吧"
          description="婴童用品、绘本、玩具、推车都很适合在邻里之间流转。"
        />
      ) : (
        <section className="grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </section>
      )}
    </div>
  );
}
