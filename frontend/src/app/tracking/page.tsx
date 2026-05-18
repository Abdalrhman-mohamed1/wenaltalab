"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package } from "lucide-react";
import Link from "next/link";

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      router.push(`/tracking/${trackingId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl mix-blend-screen opacity-50"></div>
      
      <div className="w-full max-w-lg bg-surface/80 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl relative z-10 text-center">
        <div className="mx-auto w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-gold" />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-2">تتبع شحنتك</h1>
        <p className="text-muted mb-8">أدخل رقم التتبع لمعرفة حالة طلبك لحظة بلحظة</p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <input 
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="مثال: abc123def456"
              className="w-full bg-background border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-gold transition-all text-center text-lg font-mono"
              dir="ltr"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-gold text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-glow transition-all glow-effect group"
          >
            بحث
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </form>

        <div className="mt-8">
          <Link href="/" className="text-sm text-muted hover:text-white transition-colors">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
