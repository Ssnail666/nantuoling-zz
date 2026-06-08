import Image from "next/image";
import { WECHAT_GROUP } from "@/lib/supabase";

export function WeChatGroupEntry() {
  return (
    <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#3C7355] via-[#5D8D63] to-[#A7B97E] p-[1px] shadow-card">
      <div className="rounded-[31px] bg-[#FCFBF7] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-moss/80">
              Community Group
            </p>
            <h2 className="text-2xl font-extrabold text-ink">{WECHAT_GROUP.title}</h2>
            <p className="text-sm leading-6 text-stone-600">{WECHAT_GROUP.description}</p>
          </div>
          <span className="rounded-full bg-moss px-3 py-1 text-xs font-semibold text-white">
            邻里通知
          </span>
        </div>
        <div className="mt-5 grid grid-cols-[110px,1fr] gap-4 rounded-[26px] bg-oat/80 p-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-white">
            <Image
              src={WECHAT_GROUP.image}
              alt="微信群二维码"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-2 text-sm leading-6 text-stone-600">
            <p className="font-semibold text-ink">进群后可以更快看到新上闲置，也方便互相通知成交和求购信息。</p>
            <p>操作方式：截图二维码，打开微信扫一扫或长按识别。</p>
            <p className="rounded-2xl bg-white px-3 py-2 text-xs text-stone-500">
              {WECHAT_GROUP.fallbackText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
