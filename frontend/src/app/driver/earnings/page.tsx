"use client";

import { DollarSign, Download, RefreshCw, AlertCircle, ArrowRight, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface CompletedOrder {
  id: string;
  totalFare: number;
  updatedAt: string;
  pickupAddress: string;
  dropoffAddress: string;
}

interface EarningsData {
  driverId: string;
  earnings: number;
  totalDelivered: number;
  totalCalculatedEarnings: number;
  history: CompletedOrder[];
}

export default function DriverEarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEarnings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/driver/earnings");
      setData(res.data);
    } catch (err: any) {
      console.error(err);
      setError("تعذر تحميل ملخص الأرباح. يرجى التأكد من تسجيل الدخول بحساب المندوب.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/driver" className="p-2 rounded-xl bg-surface border border-white/10 text-muted hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-white">ملخص الأرباح والمستحقات</h2>
            <p className="text-xs text-muted mt-1">كشف حساب فوري ومباشر لجميع عمليات التوصيل الناجحة</p>
          </div>
        </div>
        <button
          onClick={fetchEarnings}
          className="p-2.5 rounded-xl border border-white/10 bg-surface text-muted hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold' : ''}`} />
          تحديث
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="h-48 rounded-3xl bg-surface border border-white/10 animate-pulse"></div>
          <div className="h-64 rounded-3xl bg-surface border border-white/10 animate-pulse"></div>
        </div>
      ) : (
        <>
          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface border border-gold/40 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_35px_rgba(255,215,0,0.1)] flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gold/10 rounded-full filter blur-2xl pointer-events-none"></div>
              <div>
                <div className="text-xs text-muted font-bold mb-2">الرصيد الكلي المستحق للمندوب</div>
                <div className="text-4xl font-black text-white">
                  {data?.earnings ?? "0"} <span className="text-xl text-gold font-bold">ج.م</span>
                </div>
              </div>

              <button
                onClick={() => alert("تم إرسال طلب سحب الأرباح إلى الإدارة بنجاح! سيتم تحويل المبلغ قريباً.")}
                className="mt-8 w-full bg-gold text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-glow transition-all glow-effect text-sm shadow-lg"
              >
                طلب سحب فوري للرصيد
              </button>
            </div>

            <div className="bg-surface border border-white/10 rounded-3xl p-8 flex flex-col justify-center space-y-5 shadow-xl">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-muted text-sm font-semibold">إجمالي الطلبات المكتملة</span>
                <span className="font-bold text-white text-base flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {data?.totalDelivered ?? "0"} طلب
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <span className="text-muted text-sm font-semibold">إجمالي أجور التوصيل المحتسبة</span>
                <span className="font-bold text-green-500 text-base">
                  + {data?.totalCalculatedEarnings ?? "0"} ج.م
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted/80">
                <span>يتم إضافة الأجرة فور تأكيد التسليم للمستلم</span>
                <span>تحديث تلقائي</span>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">سجل عمليات التوصيل والأرباح المكتسبة</h3>

            {(!data?.history || data.history.length === 0) ? (
              <div className="text-center py-16 bg-surface border border-white/10 rounded-3xl p-8 text-muted">
                <DollarSign className="w-12 h-12 mx-auto opacity-30 mb-2" />
                <p className="text-sm font-bold">لا يوجد سجل عمليات مكتملة حتى الآن</p>
              </div>
            ) : (
              <div className="bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl divide-y divide-white/10">
                {data.history.map((item) => {
                  const dateStr = new Date(item.updatedAt).toLocaleString("ar-EG", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div key={item.id} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 flex items-center justify-center shrink-0 shadow-md">
                          <DollarSign className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-sm text-white">توصيل طلب #{item.id.slice(-6).toUpperCase()}</div>
                          <div className="text-xs text-muted flex items-center gap-3 font-medium">
                            <span className="truncate max-w-[200px] sm:max-w-xs">إلى: {item.dropoffAddress}</span>
                            <span className="text-white/60">({dateStr})</span>
                          </div>
                        </div>
                      </div>
                      <div className="font-black text-green-400 text-base shrink-0 bg-green-500/10 px-3.5 py-1.5 rounded-xl border border-green-500/20">
                        + {item.totalFare} <span className="text-xs">ج.م</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
