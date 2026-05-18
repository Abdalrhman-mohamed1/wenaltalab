"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Package, Check, Activity, TrendingUp, RefreshCw, AlertCircle, Clock, DollarSign, ListFilter } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface Order {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  totalFare: number;
  distanceKm?: number;
  packageType?: string;
  notes?: string;
  createdAt: string;
  customer?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}

interface DashboardData {
  earnings: number;
  availableOrdersCount: number;
  activeOrdersCount: number;
  completedOrdersCount: number;
  driverProfile?: any;
}

export default function DriverDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashRes, availRes] = await Promise.all([
        api.get("/driver/dashboard"),
        api.get("/driver/available"),
      ]);
      setData(dashRes.data);
      setAvailableOrders(availRes.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "تعذر تحميل بيانات لوحة تحكم المندوب. يرجى التأكد من تسجيل الدخول بحساب مندوب.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcceptOrder = async (orderId: string) => {
    setAcceptingId(orderId);
    try {
      await api.post(`/driver/accept/${orderId}`);
      alert("تم قبول الطلب بنجاح! الانتقال إلى صفحة التوصيل النشط...");
      router.push("/driver/active");
    } catch (err: any) {
      alert(err.response?.data?.message || "فشل قبول الطلب، قد يكون تم قبوله من مندوب آخر.");
      fetchData();
    } finally {
      setAcceptingId(null);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await api.post(`/driver/reject/${orderId}`);
      setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Failed to reject order", err);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">لوحة تحكم المندوب</h1>
          <p className="text-xs text-muted mt-1">مرحباً بك! تصفح الطلبات المتاحة للتوصيل في منطقتك</p>
        </div>
        <button
          onClick={fetchData}
          className="p-2.5 rounded-xl border border-white/10 bg-surface text-muted hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-xs font-bold shadow-md"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold' : ''}`} />
          تحديث البيانات
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-16 h-16 bg-gold/5 rounded-full filter blur-xl"></div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-muted text-xs font-semibold">إجمالي الأرباح</span>
            <DollarSign className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl font-black text-white">
            {data?.earnings ?? "0"} <span className="text-sm text-gold font-bold">ج.م</span>
          </div>
          <Link href="/driver/earnings" className="text-[10px] text-gold hover:underline block mt-2">عرض كشف الحساب ⟵</Link>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-muted text-xs font-semibold">الطلبات المتاحة حالياً</span>
            <Package className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400">{availableOrders.length}</div>
          <span className="text-[10px] text-muted block mt-2">طلبات بانتظار التوصيل</span>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-muted text-xs font-semibold">الطلبات النشطة (معك)</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{data?.activeOrdersCount ?? "0"}</div>
          <Link href="/driver/active" className="text-[10px] text-amber-400 hover:underline block mt-2">إدارة التوصيل المباشر ⟵</Link>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-muted text-xs font-semibold">الرحلات المكتملة</span>
            <Check className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-black text-green-500">{data?.completedOrdersCount ?? "0"}</div>
          <span className="text-[10px] text-muted block mt-2">تم تسليمها بنجاح</span>
        </div>
      </div>

      {/* Available Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <ListFilter className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-bold text-white">الطلبات المتاحة في منطقتك بانتظار القبول</h2>
          </div>
          <span className="text-xs bg-gold/10 text-gold px-3 py-1 rounded-full font-bold">
            {availableOrders.length} طلبات متاحة
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-32 rounded-2xl bg-surface border border-white/10 animate-pulse p-6"></div>
            ))}
          </div>
        ) : availableOrders.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-white/10 rounded-3xl p-8 shadow-xl">
            <Activity className="w-16 h-16 text-muted mx-auto mb-4 opacity-50 animate-pulse" />
            <h3 className="text-lg font-bold mb-2 text-white">لا توجد طلبات جديدة متاحة حالياً</h3>
            <p className="text-sm text-muted mb-4 max-w-sm mx-auto">
              أنت متصل بالإنترنت. ابق مستعداً، سيظهر هنا أي طلب جديد يتم إنشاؤه من العملاء أو الشركات فوراً.
            </p>
            <button onClick={fetchData} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all border border-white/10">
              إعادة فحص الطلبات
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {availableOrders.map((order, i) => {
              const dateStr = new Date(order.createdAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

              return (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={order.id}
                  className="bg-surface border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl hover:border-gold/30 transition-all flex flex-col justify-between relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full filter blur-2xl group-hover:bg-gold/10 transition-all pointer-events-none"></div>

                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">#{order.id.slice(-6).toUpperCase()}</span>
                        {order.packageType && (
                          <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gold font-semibold">
                            {order.packageType}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        <span>منذ {dateStr}</span>
                      </div>
                    </div>

                    <div className="space-y-3 relative">
                      <div className="absolute right-4 top-4 bottom-4 w-0.5 bg-white/10"></div>

                      <div className="flex items-start gap-3 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-background border border-white/10 flex items-center justify-center shrink-0 text-gold shadow-md">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="bg-background/80 border border-white/5 rounded-xl px-3 py-2 flex-1">
                          <div className="text-[10px] text-muted mb-0.5">الاستلام</div>
                          <div className="text-xs font-bold text-white">{order.pickupAddress}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-background border border-gold/30 flex items-center justify-center shrink-0 text-red-500 shadow-md">
                          <Navigation className="w-4 h-4" />
                        </div>
                        <div className="bg-background/80 border border-gold/20 rounded-xl px-3 py-2 flex-1 shadow-[0_0_10px_rgba(255,215,0,0.05)]">
                          <div className="text-[10px] text-gold mb-0.5">التسليم</div>
                          <div className="text-xs font-bold text-white">{order.dropoffAddress}</div>
                        </div>
                      </div>
                    </div>

                    {order.customer && (
                      <div className="text-xs text-muted/80 bg-black/20 p-2.5 rounded-xl border border-white/5 flex items-center justify-between font-semibold">
                        <span>العميل: {order.customer.firstName} {order.customer.lastName}</span>
                        {order.notes && <span className="text-gold truncate max-w-[150px]">ملاحظة: {order.notes}</span>}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center gap-3 z-10 relative">
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-[10px] text-muted block mb-0.5">أجرة التوصيل</span>
                      <span className="text-xl font-black text-white">{order.totalFare} <span className="text-xs text-gold">ج.م</span></span>
                    </div>

                    <button
                      onClick={() => handleAcceptOrder(order.id)}
                      disabled={acceptingId === order.id}
                      className="flex-1 bg-gold hover:bg-gold-glow text-black py-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all glow-effect text-xs disabled:opacity-50 shadow-lg"
                    >
                      <Check className="w-4 h-4" />
                      {acceptingId === order.id ? "جاري..." : "قبول التوصيل"}
                    </button>

                    <button
                      onClick={() => handleRejectOrder(order.id)}
                      className="px-4 py-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500 hover:text-white text-red-400 font-bold rounded-xl transition-all text-xs"
                    >
                      رفض
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
