import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "public-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type ItemStatus = "active" | "sold";

export type Item = {
  id: number;
  title: string;
  age_group: string;
  category: string;
  price: number | null;
  description: string;
  images: string[];
  community: string;
  building: string;
  contact: string;
  status: ItemStatus;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export const AGE_GROUPS = [
  { key: "all", label: "全部" },
  { key: "0-2岁", label: "0-2岁" },
  { key: "3-6岁", label: "3-6岁" },
  { key: "6岁+", label: "6岁+" }
] as const;

export const CATEGORIES = [
  "推车座椅",
  "玩具绘本",
  "衣服鞋帽",
  "喂养用品",
  "学习用品",
  "出行工具",
  "其他"
] as const;

export const COMMUNITIES = [
  process.env.NEXT_PUBLIC_DEFAULT_COMMUNITY || "南托岭社区",
  "北塘小区",
  "南城印象",
  "碧桂园",
  "其他周边"
] as const;

export const DEFAULT_COMMUNITY =
  process.env.NEXT_PUBLIC_DEFAULT_COMMUNITY || "南托岭社区";

export const WECHAT_GROUP = {
  title: "进邻里互助群",
  description: "看新上闲置、邻里拼单和社区通知。截图二维码，到微信里识别即可进群。",
  image: "/wechat-group-placeholder.svg",
  fallbackText: "如果二维码失效或群满，请在站内发布页留下微信号，后续可手动拉群。"
};

export function formatPrice(price: number | null) {
  if (price === null || Number.isNaN(price)) {
    return "免费送";
  }

  return `¥${price}`;
}

export function formatRelativeTime(input: string) {
  const diff = Date.now() - new Date(input).getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < hour) {
    return `${Math.max(1, Math.floor(diff / minute))}分钟前`;
  }

  if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`;
  }

  if (diff < day * 7) {
    return `${Math.floor(diff / day)}天前`;
  }

  return new Date(input).toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric"
  });
}

export function getStoredItemIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem("my_items");
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is number => typeof item === "number")
      : [];
  } catch {
    return [];
  }
}

export function storeItemId(id: number) {
  if (typeof window === "undefined") {
    return;
  }

  const ids = new Set(getStoredItemIds());
  ids.add(id);
  window.localStorage.setItem("my_items", JSON.stringify(Array.from(ids)));
}

export function removeStoredItemId(id: number) {
  if (typeof window === "undefined") {
    return;
  }

  const ids = getStoredItemIds().filter((itemId) => itemId !== id);
  window.localStorage.setItem("my_items", JSON.stringify(ids));
}
