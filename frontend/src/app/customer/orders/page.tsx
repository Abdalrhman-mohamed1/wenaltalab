"use client";

import { motion } from "framer-motion";
import { Package, MapPin, CheckCircle, Clock, AlertCircle, Eye, RefreshCw, Navigation } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalFare: number;
  pickupAddress: string;
  dropoffAddress: string;
  receiverName?: string;
  packageType?: string;
  driver?: {
    user?: {
      firstName: string;
      lastName: string;
      phone: string;
    };
  };
}

const statusMap: Record<string, { label: string; color: string; badge: string }> = {
  REQUESTED: { label: "قيد المراجعة", color: "text-amber-400", badge: "bg-amber-400/20 text-amber-400" },
  PENDING: { label: "قيد الانتظار", color: "text-amber-400", badge: "bg-amber-400/20 text-amber-400" },
  ASSIGNED: { label: "تم التعيين", color: "text-blue-400", badge: "bg-blue-400/20 text-blue-400" },
  ACCEPTED: { label: "قيد التنفيذ (مقبول)", color: "text-blue-400", badge: "bg-blue-400/20 text-blue-400" },
  PICKED_UP: { label: "تم الاستلام من المرسل", color: "text-purple-400", badge: "bg-purple-400/20 text-purple-400" },
  IN_TRANSIT: { label: "في الطريق للمستلم", color: "text-sky-400", badge: "bg-sky-400/20 text-sky-400" },
  ON_THE_WAY: { label: "في الطريق للمستلم", color: "text-sky-400", badge: "bg-sky-400/20 text-sky-400" },
  DELIVERED: { label: "تم التوصيل بنجاح", color: "text-green-500", badge: "bg-green-500/20 text-green-500" },
  CANCELED: { label: "ملغي", color: "text-red-500", badge: "bg-red-500/20 text-red-500" },
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "حدث خطأ أثناء تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-black">الطلبات السابقة والحالية</h2>
          <p className="text-xs text-muted mt-1">قائمة بجميع طلبات التوصيل الخاصة بك وحالتها المباشرة</p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2 rounded-xl border border-white/10 bg-surface text-muted hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-xs font-bold"
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
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-surface border border-white/10 animate-pulse p-6"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-white/10 rounded-3xl p-8">
          <Package className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">لا توجد طلبات توصيل حتى الآن</h3>
          <p className="text-sm text-muted mb-6">لم تقم بإنشاء أي طلبات توصيل بعد.</p>
          <Link href="/customer/request">
            <button className="bg-gold text-black px-6 py-3 rounded-xl font-bold hover:bg-gold-glow transition-all glow-effect">
              طلب مندوب جديد الآن
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const statusInfo = statusMap[order.status] || { label: order.status, color: "text-muted", badge: "bg-white/10 text-muted" };
            const isActive = !['DELIVERED', 'CANCELED'].includes(order.status);
            const dateStr = new Date(order.createdAt).toLocaleDateString("ar-EG", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={order.id}
                className={`p-6 rounded-2xl border transition-all shadow-lg ${
                  isActive ? "bg-gold/5 border-gold/30 shadow-[0_0_15px_rgba(255,215,0,0.05)]" : "bg-surface border-white/10"
                } flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      isActive ? "bg-gold/20 text-gold shadow-[0_0_10px_rgba(255,215,0,0.2)] animate-pulse" : "bg-white/5 text-muted"
                    }`}
                  >
                    {isActive ? <Navigation className="w-5 h-5 rotate-45" /> : <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm tracking-wide text-white">
                        رقم الطلب: #{order.id.slice(-6).toUpperCase()}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${statusInfo.badge}`}>
                        {statusInfo.label}
                      </span>
                      {order.packageType && (
                        <span className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted font-semibold">
                          {order.packageType}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-muted flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>من: {order.pickupAddress}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>إلى: {order.dropoffAddress}</span>
                      </div>
                    </div>

                    {order.driver?.user && (
                      <div className="text-xs text-muted bg-black/20 p-2 rounded-lg border border-white/5 flex items-center gap-2">
                        <span className="text-gold font-bold">المندوب:</span>
                        <span>{order.driver.user.firstName} {order.driver.user.lastName}</span>
                        <span dir="ltr" className="text-gold">({order.driver.user.phone})</span>
                      </div>
                    )}

                    <div className="text-xs text-muted/60 flex items-center gap-2 pt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
                  <div className="text-right px-4 md:border-r md:border-white/10">
                    <div className="text-xs text-muted">التكلفة</div>
                    <div className="font-black text-lg text-white">
                      {order.totalFare} <span className="text-xs text-gold">ج.م</span>
                    </div>
                  </div>
                  <Link href={`/tracking/${order.id}`}>
                    <button className="px-4 py-2 bg-white/10 hover:bg-gold hover:text-black transition-all rounded-xl text-xs font-bold flex items-center gap-2 border border-white/10">
                      <Eye className="w-4 h-4" />
                      تتبع مباشر
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
