"use client";

import { motion } from "framer-motion";
import { Briefcase, Package, Clock, CheckCircle, DollarSign, Plus, Layers, BarChart3, RefreshCw, AlertCircle, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  inTransitOrders: number;
  deliveredOrders: number;
  totalSpent: number;
}

export default function BusinessDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/business/dashboard");
      setData(res.data);
    } catch (err: any) {
      console.error(err);
      setError("تعذر تحميل بيانات لوحة أعمال الشركة. تأكد من تسجيل الدخول بحساب الشركات.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-surface border border-gold/40 rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2">
          <div className="text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded-full w-fit border border-gold/20">
            لوحة أعمال الشركات الفورية
          </div>
          <h1 className="text-3xl font-black text-white">إدارة وتتبع الخدمات اللوجستية للمؤسسة</h1>
          <p className="text-xs text-muted max-w-lg">
            قم بإنشاء طلبات التوصيل الفردية والمجمعة لعملائك، وتتبع مسار المندوبين لحظياً، وراجع تقارير الأداء المالي والتشغيلي لشركتك.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <Link href="/business/bulk">
            <button className="bg-gold hover:bg-gold-glow text-black px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 transition-all glow-effect shadow-xl text-sm">
              <Layers className="w-5 h-5" />
              إنشاء طلبات مجمعة (Bulk)
            </button>
          </Link>
          <button
            onClick={fetchDashboard}
            className="p-3.5 bg-background border border-white/10 rounded-2xl text-muted hover:text-white hover:border-white/20 transition-all shadow-md"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-gold' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-sky-500/50 transition-all">
          <div className="absolute top-0 left-0 w-20 h-20 bg-sky-500/5 rounded-full filter blur-xl group-hover:bg-sky-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-3 text-sky-400">
            <span className="text-xs font-bold text-muted">إجمالي الشحنات المنشأة</span>
            <Package className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-white mb-1">
            {loading ? <span className="animate-pulse">...</span> : data?.totalOrders ?? "0"}
          </div>
          <span className="text-[10px] text-muted block">كل الطلبات في حساب الشركة</span>
        </div>

        <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-amber-400/50 transition-all">
          <div className="absolute top-0 left-0 w-20 h-20 bg-amber-400/5 rounded-full filter blur-xl group-hover:bg-amber-400/10 transition-all"></div>
          <div className="flex items-center justify-between mb-3 text-amber-400">
            <span className="text-xs font-bold text-muted">طلبات قيد الانتظار</span>
            <Clock className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-amber-400 mb-1">
            {loading ? <span className="animate-pulse">...</span> : data?.pendingOrders ?? "0"}
          </div>
          <span className="text-[10px] text-muted block">بانتظار قبول المندوب</span>
        </div>

        <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-blue-400/50 transition-all">
          <div className="absolute top-0 left-0 w-20 h-20 bg-blue-400/5 rounded-full filter blur-xl group-hover:bg-blue-400/10 transition-all"></div>
          <div className="flex items-center justify-between mb-3 text-blue-400">
            <span className="text-xs font-bold text-muted">شحنات قيد التوصيل الآن</span>
            <Package className="w-6 h-6 animate-bounce" />
          </div>
          <div className="text-3xl font-black text-blue-400 mb-1">
            {loading ? <span className="animate-pulse">...</span> : data?.inTransitOrders ?? "0"}
          </div>
          <Link href="/business/orders" className="text-[10px] text-blue-400 hover:underline block">تتبع مواقع المندوبين ⟵</Link>
        </div>

        <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-green-500/50 transition-all">
          <div className="absolute top-0 left-0 w-20 h-20 bg-green-500/5 rounded-full filter blur-xl group-hover:bg-green-500/10 transition-all"></div>
          <div className="flex items-center justify-between mb-3 text-green-500">
            <span className="text-xs font-bold text-muted">الشحنات المسلمة بنجاح</span>
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="text-3xl font-black text-green-500 mb-1">
            {loading ? <span className="animate-pulse">...</span> : data?.deliveredOrders ?? "0"}
          </div>
          <span className="text-[10px] text-muted block">تم تسليمها للمستلمين</span>
        </div>
      </div>

      {/* Financial Overview Card */}
      <div className="bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 text-gold flex items-center justify-center shrink-0 shadow-lg">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <div className="text-xs font-bold text-muted mb-1">إجمالي التكاليف وأجور الشحن المدفوعة</div>
            <div className="text-3xl font-black text-white">
              {loading ? "..." : data?.totalSpent ?? "0"} <span className="text-base text-gold font-bold">ج.م</span>
            </div>
          </div>
        </div>

        <Link href="/business/analytics">
          <button className="px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-2xl transition-all flex items-center gap-2 text-xs">
            <BarChart3 className="w-4 h-4 text-gold" />
            استعراض التحليلات المالية الكاملة
          </button>
        </Link>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-surface to-background border border-white/10 rounded-3xl p-8 space-y-4 shadow-xl">
          <div className="w-12 h-12 bg-gold/10 border border-gold/20 text-gold rounded-2xl flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">إنشاء شحنات مجمعة (Bulk Upload)</h3>
          <p className="text-xs text-muted leading-relaxed">
            هل لديك عشرات الطلبات اليومية؟ وفر الوقت واستخدم نظام الإدخال السريع لإنشاء شحنات متعددة بضغطة زر واحدة وتوزيعها على أسطول المندوبين.
          </p>
          <Link href="/business/bulk" className="block pt-2">
            <button className="flex items-center gap-2 text-xs font-bold text-gold hover:underline">
              <span>بدء إدخال الطلبات المجمعة الآن</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        <div className="bg-gradient-to-br from-surface to-background border border-white/10 rounded-3xl p-8 space-y-4 shadow-xl">
          <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">سجل شحنات المؤسسة ومتابعتها المباشرة</h3>
          <p className="text-xs text-muted leading-relaxed">
            استعرض جميع الطلبات النشطة والسابقة، تابع تقدم المندوب على الخريطة التفاعلية، وتواصل مع فريق التوصيل لحظياً لضمان أعلى جودة خدمة.
          </p>
          <Link href="/business/orders" className="block pt-2">
            <button className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:underline">
              <span>عرض جميع الشحنات والتتبع</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
