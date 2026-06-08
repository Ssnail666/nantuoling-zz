export function TrustPanel() {
  return (
    <section className="soft-panel rounded-[30px] border border-white/80 p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-moss text-xl text-white">
          ✓
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-ink">邻里之间，当面交易更安心</h2>
          <ul className="space-y-1.5 text-sm leading-6 text-stone-600">
            <li>仅服务社区及周边邻里，适合宝妈和年轻家庭转让闲置。</li>
            <li>不做线上支付，建议约在小区门口或熟悉地点验货后交易。</li>
            <li>发布时尽量写清成色、瑕疵、楼栋和联系方式，信息越完整越容易成交。</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
