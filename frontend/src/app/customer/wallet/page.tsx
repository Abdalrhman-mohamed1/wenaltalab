"use client";

import { CreditCard, ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";

export default function CustomerWalletPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-black mb-6">المحفظة</h2>
      
      {/* Balance Card */}
      <div className="bg-surface border border-gold/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.05)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl mix-blend-screen opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-sm text-muted mb-2">الرصيد المتاح</div>
            <div className="text-5xl font-black text-white">1,250 <span className="text-xl text-gold">ج.م</span></div>
          </div>
          <button className="bg-gold text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gold-glow transition-all glow-effect w-full md:w-auto justify-center">
            <Plus className="w-5 h-5" />
            شحن المحفظة
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold mt-8 mb-4">أحدث العمليات</h3>
      <div className="bg-surface border border-white/10 rounded-2xl p-2">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">دفع طلب توصيل #ORD-9711</div>
              <div className="text-xs text-muted">أمس, 10:15 ص</div>
            </div>
          </div>
          <div className="font-bold text-red-500 text-sm">- 35 ج.م</div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">شحن المحفظة (بطاقة ائتمان)</div>
              <div className="text-xs text-muted">14 مايو, 02:00 م</div>
            </div>
          </div>
          <div className="font-bold text-green-500 text-sm">+ 500 ج.م</div>
        </div>
      </div>
    </div>
  );
}
