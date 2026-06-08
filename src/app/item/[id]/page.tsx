"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import {
  Item,
  formatPrice,
  formatRelativeTime,
  getStoredItemIds,
  isSupabaseConfigured,
  removeStoredItemId,
  supabase
} from "@/lib/supabase";

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [relatedItems, setRelatedItems] = useState<Item[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadItem() {
      if (!isSupabaseConfigured) {
        setMessage("请先配置 Supabase 环境变量。");
        setLoading(false);
        return;
      }

      const itemId = Number(params.id);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("id", itemId)
        .single();

      if (cancelled) {
        return;
      }

      if (error || !data) {
        setMessage(error?.message || "没有找到这个物品。");
        setLoading(false);
        return;
      }

      const currentItem = data as Item;
      setItem(currentItem);
      setIsOwner(getStoredItemIds().includes(currentItem.id));
      setLoading(false);

      void supabase
        .from("items")
        .update({ view_count: (currentItem.view_count || 0) + 1 })
        .eq("id", currentItem.id);

      const { data: related } = await supabase
        .from("items")
        .select("*")
        .neq("id", currentItem.id)
        .eq("status", "active")
        .or(`age_group.eq.${currentItem.age_group},category.eq.${currentItem.category}`)
        .limit(4)
        .order("created_at", { ascending: false });

      if (!cancelled) {
        setRelatedItems((related ?? []) as Item[]);
      }
    }

    void loadItem();

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const imageList = useMemo(() => {
    if (!item?.images.length) {
      return ["/wechat-group-placeholder.svg"];
    }

    return item.images;
  }, [item]);

  const canCall = useMemo(() => {
    if (!item) {
      return false;
    }

    return /^(\+?\d[\d\s-]{5,})$/.test(item.contact.trim());
  }, [item]);

  async function markAsSold() {
    if (!item) {
      return;
    }

    const confirmed = window.confirm("确认标记为已出吗？");
    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("items")
      .update({ status: "sold" })
      .eq("id", item.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setItem({ ...item, status: "sold" });
    router.refresh();
  }

  async function copyContact() {
    if (!item) {
      return;
    }

    try {
      await navigator.clipboard.writeText(item.contact);
      setMessage("联系方式已复制。");
    } catch {
      setMessage("复制失败，请手动复制。");
    }
  }

  async function deleteItem() {
    if (!item) {
      return;
    }

    const confirmed = window.confirm("确认删除这条信息吗？");
    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from("items").delete().eq("id", item.id);
    if (error) {
      setMessage(error.message);
      return;
    }

    removeStoredItemId(item.id);
    router.push("/my");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="rounded-[30px] bg-white px-6 py-16 text-center text-stone-500 shadow-card">
        正在加载物品详情...
      </div>
    );
  }

  if (!item) {
    return (
      <EmptyState
        title="这件物品不存在或已被移除"
        description={message || "你可以返回首页看看其他邻里正在转让的物品。"}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-4 z-20 rounded-[26px] bg-white/92 px-4 py-3 shadow-card backdrop-blur">
        <Link href="/" className="text-sm font-semibold text-moss">
          ← 返回首页
        </Link>
      </div>

      <section className="overflow-hidden rounded-[34px] bg-white shadow-card">
        <div className="relative aspect-[1.05] bg-oat">
          <Image
            src={imageList[currentImageIndex]}
            alt={item.title}
            fill
            className="object-cover"
          />
          {item.status === "sold" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/38">
              <span className="rotate-[-12deg] rounded-xl border border-white/60 bg-clay px-5 py-2 text-lg font-bold text-white">
                已出
              </span>
            </div>
          ) : null}
        </div>
        {imageList.length > 1 ? (
          <div className="flex justify-center gap-2 px-4 py-3">
            {imageList.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2.5 rounded-full transition ${
                  index === currentImageIndex ? "w-8 bg-moss" : "w-2.5 bg-stone-300"
                }`}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className="rounded-[34px] bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-3xl font-extrabold text-clay">{formatPrice(item.price)}</p>
            <h1 className="mt-2 text-2xl font-extrabold text-ink">{item.title}</h1>
          </div>
          <div className="rounded-full bg-mist px-4 py-2 text-sm font-semibold text-moss">
            {item.status === "sold" ? "已成交" : "在售中"}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-oat px-3 py-1.5 text-sm font-medium text-ink">
            {item.age_group}
          </span>
          <span className="rounded-full bg-oat px-3 py-1.5 text-sm font-medium text-ink">
            {item.category}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 rounded-[24px] bg-mist p-4 text-sm text-stone-600">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">位置</p>
            <p className="mt-1 font-semibold text-ink">
              {item.community}
              {item.building ? ` · ${item.building}` : ""}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">发布时间</p>
            <p className="mt-1 font-semibold text-ink">{formatRelativeTime(item.created_at)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">浏览次数</p>
            <p className="mt-1 font-semibold text-ink">{item.view_count + 1}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400">联系方式</p>
            <p className="mt-1 font-semibold text-ink">{item.contact}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[34px] bg-white p-5 shadow-card">
        <h2 className="text-lg font-bold text-ink">物品描述</h2>
        <p className="mt-3 rounded-[24px] bg-oat/70 p-4 text-sm leading-7 text-stone-600">
          {item.description || "卖家暂时还没有补充描述，可以先联系确认成色和交易地点。"}
        </p>
        <p className="mt-4 rounded-[22px] border border-moss/15 bg-moss/5 px-4 py-3 text-sm leading-6 text-moss">
          为了更安心，建议和邻居约在小区门口、物业附近等熟悉地点，当面验货后再交易。
        </p>
      </section>

      {message ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {message}
        </div>
      ) : null}

      <section className="grid grid-cols-1 gap-3">
        {canCall ? (
          <a
            href={`tel:${item.contact}`}
            className="tap-active rounded-[24px] bg-moss px-5 py-4 text-center text-base font-bold text-white shadow-lg shadow-moss/20"
          >
            拨号联系卖家
          </a>
        ) : (
          <button
            type="button"
            onClick={copyContact}
            className="tap-active rounded-[24px] bg-moss px-5 py-4 text-center text-base font-bold text-white shadow-lg shadow-moss/20"
          >
            复制联系方式并去微信联系
          </button>
        )}
        <button
          type="button"
          onClick={copyContact}
          className="tap-active rounded-[24px] bg-white px-5 py-4 text-base font-bold text-ink shadow-card"
        >
          复制联系方式
        </button>
        {isOwner ? (
          <>
            <button
              type="button"
              onClick={markAsSold}
              className="tap-active rounded-[24px] bg-oat px-5 py-4 text-base font-bold text-clay"
            >
              标记已出
            </button>
            <button
              type="button"
              onClick={deleteItem}
              className="tap-active rounded-[24px] border border-stone-200 bg-white px-5 py-4 text-base font-bold text-stone-500"
            >
              删除这条信息
            </button>
          </>
        ) : null}
      </section>

      {relatedItems.length ? (
        <section className="rounded-[34px] bg-white p-5 shadow-card">
          <h2 className="text-lg font-bold text-ink">同龄段也有人在转</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {relatedItems.map((relatedItem) => (
              <Link
                key={relatedItem.id}
                href={`/item/${relatedItem.id}`}
                className="rounded-[24px] bg-oat/60 p-3"
              >
                <p className="line-clamp-2 text-sm font-semibold text-ink">
                  {relatedItem.title}
                </p>
                <p className="mt-2 text-xs text-stone-500">
                  {relatedItem.community}
                  {relatedItem.building ? ` · ${relatedItem.building}` : ""}
                </p>
                <p className="mt-2 text-sm font-bold text-clay">
                  {formatPrice(relatedItem.price)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
