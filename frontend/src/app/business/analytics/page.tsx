"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, RefreshCw, AlertCircle, Package, PieChart, Calendar, CheckCircle, Clock, XCircle, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

interface AnalyticsData {
  totalCount: number;
  statusBreakdown: {
    pending: number;
    in_progress: number;
    delivered: number;
    canceled: number;
  };
  packageTypes: Record<string, number>;
  dailyTrend: {
    date: string;
    orders: number;
    spent: number;
  }[];
}

export default function BusinessAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/business/analytics");
      setData(res.data);
    } catch (err: any) {
      console.error(err);
      setError("تعذر تحميل التقارير والتحليلات. تأكد من تسجيل الدخول بحساب الشركات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalOrders = data?.totalCount || 1; // avoid div by 0

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BarChart3 className="text-gold w-7 h-7" />
            التقارير والتحليلات الشاملة للأعمال (Analytics Dashboard)
          </h1>
          <p className="text-xs text-muted mt-1">
            مؤشرات الأداء التشغيلي والمالي وتوزيع أنواع الشحنات لآخر 7 أيام
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2.5 rounded-xl border border-white/10 bg-surface text-muted hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold' : ''}`} />
          تحديث التقرير
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => <div key={n} className="h-32 rounded-3xl bg-surface border border-white/10 animate-pulse"></div>)}
          </div>
          <div className="h-80 rounded-3xl bg-surface border border-white/10 animate-pulse"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Status Breakdown Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="text-xs text-muted mb-2 font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                قيد الانتظار والمراجعة
              </div>
              <div className="text-3xl font-black text-amber-400 mb-1">{data?.statusBreakdown?.pending ?? 0}</div>
              <div className="text-[10px] text-muted">من إجمالي الشحنات</div>
            </div>

            <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="text-xs text-muted mb-2 font-semibold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                شحنات قيد التوصيل (في الطريق)
              </div>
              <div className="text-3xl font-black text-blue-400 mb-1">{data?.statusBreakdown?.in_progress ?? 0}</div>
              <div className="text-[10px] text-muted">يتم توصيلها الآن</div>
            </div>

            <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="text-xs text-muted mb-2 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                الشحنات المسلمة بنجاح
              </div>
              <div className="text-3xl font-black text-green-500 mb-1">{data?.statusBreakdown?.delivered ?? 0}</div>
              <div className="text-[10px] text-muted">مكتملة 100%</div>
            </div>

            <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="text-xs text-muted mb-2 font-semibold flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-500" />
                الطلبات الملغاة
              </div>
              <div className="text-3xl font-black text-red-500 mb-1">{data?.statusBreakdown?.canceled ?? 0}</div>
              <div className="text-[10px] text-muted">تم إلغاؤها من النظام</div>
            </div>
          </div>

          {/* Daily Trend Chart Simulation */}
          <div className="bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-bold text-white">حجم الطلبات والإنفاق اليومي (آخر 7 أيام)</h3>
              </div>
              <span className="text-xs bg-white/5 border border-white/10 px-3 py-1 rounded text-muted font-bold">
                إجمالي الأيام: 7
              </span>
            </div>

            <div className="grid grid-cols-7 gap-4 pt-4 h-64 items-end">
              {data?.dailyTrend?.map((day, idx) => {
                const maxOrders = Math.max(...data.dailyTrend.map(d => d.orders), 1);
                const heightPercent = Math.max((day.orders / maxOrders) * 100, 10);
                const dateLabel = new Date(day.date).toLocaleDateString("ar-EG", { weekday: "short", day: "numeric" });

                return (
                  <div key={idx} className="flex flex-col items-center justify-end h-full gap-2 group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-background border border-gold/40 px-2 py-1 rounded text-gold font-bold text-center absolute -translate-y-16 z-20 shadow-xl pointer-events-none">
                      <div>{day.orders} طلب</div>
                      <div>{day.spent} ج.م</div>
                    </div>

                    <div className="w-full bg-surface border border-white/10 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                      <div
                        className="bg-gold hover:bg-gold-glow transition-all duration-500 rounded-t-lg shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>

                    <span className="text-[10px] text-muted font-semibold truncate w-full text-center mt-1">{dateLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Package Types Breakdown */}
          <div className="bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <PieChart className="w-5 h-5 text-gold" />
              <h3 className="text-lg font-bold text-white">توزيع أنواع الشحنات والطرود</h3>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(data?.packageTypes || {}).map(([typeName, count]) => {
                const percent = Math.round((count / (data?.totalCount || 1)) * 100);

                return (
                  <div key={typeName} className="bg-background border border-white/10 rounded-2xl p-5 space-y-3 shadow-md">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{typeName}</span>
                      <span className="text-gold font-black">{count} شحنة</span>
                    </div>

                    <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    <div className="text-[10px] text-muted text-left font-mono">{percent}% من إجمالي الشحنات</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
