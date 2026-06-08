"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AGE_GROUPS,
  CATEGORIES,
  COMMUNITIES,
  DEFAULT_COMMUNITY,
  isSupabaseConfigured,
  storeItemId,
  supabase
} from "@/lib/supabase";

type UploadedImage = {
  file: File;
  preview: string;
};

const maxImages = 9;

export default function PostPage() {
  const router = useRouter();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    age_group: "3-6岁",
    category: "玩具绘本",
    price: "",
    description: "",
    community: DEFAULT_COMMUNITY,
    building: "",
    contact: ""
  });

  const canSubmit = useMemo(() => {
    return Boolean(form.title.trim() && form.contact.trim() && !submitting);
  }, [form.contact, form.title, submitting]);

  function onSelectImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    const available = maxImages - images.length;
    const nextFiles = files.slice(0, available).map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages((current) => [...current, ...nextFiles]);
    event.target.value = "";
  }

  function removeImage(index: number) {
    setImages((current) => {
      const target = current[index];
      if (target) {
        URL.revokeObjectURL(target.preview);
      }

      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  }

  async function uploadImages() {
    const urls: string[] = [];

    for (const image of images) {
      const ext = image.file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("item-images")
        .upload(filePath, image.file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("item-images").getPublicUrl(filePath);
      urls.push(data.publicUrl);
    }

    return urls;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (!isSupabaseConfigured) {
      setMessage("请先配置 Supabase 环境变量和数据表。");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const uploadedUrls = await uploadImages();
      const { data, error } = await supabase
        .from("items")
        .insert({
          title: form.title.trim(),
          age_group: form.age_group,
          category: form.category,
          price: form.price.trim() ? Number(form.price) : null,
          description: form.description.trim(),
          images: uploadedUrls,
          community: form.community,
          building: form.building.trim(),
          contact: form.contact.trim()
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      if (data?.id) {
        storeItemId(data.id);
      }

      router.push("/");
      router.refresh();
    } catch (submitError) {
      setMessage(
        submitError instanceof Error ? submitError.message : "发布失败，请稍后重试。"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-[32px] bg-white px-5 py-6 shadow-card">
        <h1 className="text-2xl font-extrabold text-ink">发布闲置</h1>
        <p className="mt-2 text-sm leading-6 text-stone-500">
          信息写得越清楚，邻居越容易放心来问。建议写明成色、品牌、瑕疵和常用联系方式。
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="rounded-[32px] bg-white p-4 shadow-card">
          <h2 className="mb-3 text-lg font-bold text-ink">1. 上传图片</h2>
          <div className="grid grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div key={image.preview} className="relative aspect-square overflow-hidden rounded-2xl bg-oat">
                <img
                  src={image.preview}
                  alt={`预览图 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-2 top-2 rounded-full bg-ink/70 px-2 py-1 text-xs text-white"
                >
                  删除
                </button>
              </div>
            ))}

            {images.length < maxImages ? (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-oat text-sm text-stone-500">
                <span className="text-3xl text-moss">＋</span>
                <span>最多9张</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onSelectImages}
                  className="hidden"
                />
              </label>
            ) : null}
          </div>
        </section>

        <section className="space-y-4 rounded-[32px] bg-white p-4 shadow-card">
          <h2 className="text-lg font-bold text-ink">2. 物品信息</h2>
          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">物品名称</label>
            <input
              className="field"
              placeholder="例如：九成新儿童滑板车，带闪光轮"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">适用年龄</label>
              <select
                className="field"
                value={form.age_group}
                onChange={(event) =>
                  setForm({ ...form, age_group: event.target.value })
                }
              >
                {AGE_GROUPS.filter((group) => group.key !== "all").map((group) => (
                  <option key={group.key} value={group.key}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">价格</label>
              <input
                className="field"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="不填表示免费送"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">分类</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const active = form.category === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setForm({ ...form, category })}
                    className={`chip ${active ? "chip-active" : ""}`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">所在小区</label>
              <select
                className="field"
                value={form.community}
                onChange={(event) =>
                  setForm({ ...form, community: event.target.value })
                }
              >
                {COMMUNITIES.map((community) => (
                  <option key={community} value={community}>
                    {community}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">楼栋</label>
              <input
                className="field"
                placeholder="例如：3栋 / 南门附近"
                value={form.building}
                onChange={(event) => setForm({ ...form, building: event.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">描述</label>
            <textarea
              className="field min-h-[120px] resize-none"
              placeholder="建议写明品牌、购买时间、使用时长、有无瑕疵、是否缺件。"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">联系方式</label>
            <input
              className="field"
              placeholder="建议留常用微信号或手机号"
              value={form.contact}
              onChange={(event) => setForm({ ...form, contact: event.target.value })}
              required
            />
          </div>
        </section>

        {message ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="tap-active w-full rounded-[26px] bg-moss px-5 py-4 text-base font-bold text-white shadow-lg shadow-moss/20 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none"
        >
          {submitting ? "正在发布..." : "发布闲置"}
        </button>
      </form>
    </div>
  );
}
