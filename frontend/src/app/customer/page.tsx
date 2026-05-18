"use client";

import { motion } from "framer-motion";
import { Package, ArrowLeft, Clock, MapPin, Navigation, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export default function CustomerDashboard() {
  const [user, setUser] = useState<{ firstName?: string; lastName?: string } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      const res = await api.get("/orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch customer dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const activeOrders = orders.filter(
    (o) => !["DELIVERED", "CANCELED", "FAILED"].includes(o.status)
  );
  const activeOrder = activeOrders[0];

  const statusMap: Record<string, string> = {
    REQUESTED: "قيد المراجعة",
    PENDING: "قيد الانتظار",
    ASSIGNED: "تم التعيين",
    ACCEPTED: "المندوب في الطريق للاستلام",
    PICKED_UP: "تم الاستلام من المرسل",
    IN_TRANSIT: "في الطريق للمستلم",
    ON_THE_WAY: "في الطريق للمستلم",
    NEAR_DESTINATION: "بالقرب من موقع التسليم",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & CTA Card */}
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-white/10 p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl mix-blend-screen opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">
              أهلاً بك، {user?.firstName || "عميلنا العزيز"}! 👋
            </h1>
            <p className="text-muted text-sm max-w-md">
              ماذا تود أن توصل اليوم؟ منصة وين الطلب توفر لك أسرع خدمة توصيل مع تتبع حي ومباشر.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchDashboardData}
              className="p-3 bg-surface border border-white/10 text-muted hover:text-white rounded-xl transition-all"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin text-gold" : ""}`} />
            </button>
            <Link
              href="/customer/request"
              className="shrink-0 bg-gold text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-gold-glow transition-all glow-effect group"
            >
              طلب مندوب جديد
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active Order Card */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-surface border border-gold/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.05)] relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl"></div>

          {activeOrder ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    طلب نشط حالياً
                  </h3>
                  <span className="text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded-full font-mono">
                    #{activeOrder.id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  <div className="flex-1 space-y-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                          <Package className="w-4 h-4 text-gold" />
                        </div>
                        <div className="w-0.5 h-10 bg-white/10 my-1"></div>
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-red-500" />
                        </div>
                      </div>
                      <div className="flex flex-col justify-between py-1 flex-1">
                        <div>
                          <div className="text-xs text-muted">نقطة الاستلام</div>
                          <div className="text-sm font-bold text-white">{activeOrder.pickupAddress}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted">نقطة التسليم</div>
                          <div className="text-sm font-bold text-white">{activeOrder.dropoffAddress}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-56 bg-background rounded-2xl p-4 border border-white/10 flex flex-col justify-center items-center text-center shadow-inner">
                    <div className="text-xs text-muted mb-1">الحالة المباشرة</div>
                    <div className="text-sm font-black text-gold mb-3">
                      {statusMap[activeOrder.status] || activeOrder.status}
                    </div>
                    <div className="text-xs text-white/80 font-semibold mb-3">
                      التكلفة: {activeOrder.totalFare} ج.م
                    </div>
                    <Link href={`/tracking/${activeOrder.id}`} className="w-full">
                      <button className="w-full py-2.5 bg-surface hover:bg-white/10 transition-colors rounded-xl text-xs font-bold border border-gold/40 text-gold shadow-md flex items-center justify-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 rotate-45" />
                        تتبع مباشر
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted/60 border-t border-white/10 pt-3 flex justify-between">
                <span>تاريخ الطلب: {new Date(activeOrder.createdAt).toLocaleString("ar-EG")}</span>
                <span>الشحنة: {activeOrder.packageType || "طرد عادي"}</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center my-auto">
              <Package className="w-16 h-16 text-muted mb-4 opacity-40" />
              <h3 className="text-lg font-bold text-white mb-2">لا توجد طلبات نشطة حالياً</h3>
              <p className="text-sm text-muted mb-6">
                يمكنك طلب مندوب توصيل جديد في أي وقت وسنقوم بتوصيل شحنتك فوراً.
              </p>
              <Link href="/customer/request">
                <button className="bg-gold/20 border border-gold text-gold px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-gold hover:text-black transition-all">
                  إنشاء طلب توصيل الآن
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="bg-surface border border-white/10 rounded-3xl p-6 flex flex-col justify-center gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-md">
              <Clock className="w-7 h-7 text-gold" />
            </div>
            <div>
              <div className="text-3xl font-black text-white">{orders.length}</div>
              <div className="text-sm text-muted font-semibold">إجمالي الطلبات</div>
            </div>
          </div>
          <div className="h-px w-full bg-white/10"></div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center shadow-md animate-pulse">
              <Package className="w-7 h-7 text-gold" />
            </div>
            <div>
              <div className="text-3xl font-black text-gold">{activeOrders.length}</div>
              <div className="text-sm text-muted font-semibold">طلبات قيد التوصيل</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

