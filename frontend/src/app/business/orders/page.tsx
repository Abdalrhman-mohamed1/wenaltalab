"use client";

import { motion } from "framer-motion";
import { Package, MapPin, CheckCircle, Clock, Navigation, AlertCircle, Eye, RefreshCw, Search, ListFilter, Truck } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface DriverInfo {
  user?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}

interface OrderItem {
  id: string;
  status: string;
  createdAt: string;
  totalFare: number;
  pickupAddress: string;
  dropoffAddress: string;
  receiverName?: string;
  receiverPhone?: string;
  packageType?: string;
  notes?: string;
  driver?: DriverInfo;
}

const statusMap: Record<string, { label: string; color: string; badge: string }> = {
  REQUESTED: { label: "قيد المراجعة", color: "text-amber-400", badge: "bg-amber-400/20 text-amber-400 border border-amber-400/30" },
  PENDING: { label: "قيد الانتظار", color: "text-amber-400", badge: "bg-amber-400/20 text-amber-400 border border-amber-400/30" },
  ASSIGNED: { label: "تم التعيين", color: "text-blue-400", badge: "bg-blue-400/20 text-blue-400 border border-blue-400/30" },
  ACCEPTED: { label: "قيد التنفيذ (مقبول)", color: "text-blue-400", badge: "bg-blue-400/20 text-blue-400 border border-blue-400/30" },
  PICKED_UP: { label: "تم الاستلام من الشركة", color: "text-purple-400", badge: "bg-purple-400/20 text-purple-400 border border-purple-400/30" },
  IN_TRANSIT: { label: "في الطريق للمستلم", color: "text-sky-400", badge: "bg-sky-400/20 text-sky-400 border border-sky-400/30" },
  ON_THE_WAY: { label: "في الطريق للمستلم", color: "text-sky-400", badge: "bg-sky-400/20 text-sky-400 border border-sky-400/30" },
  DELIVERED: { label: "تم التوصيل بنجاح", color: "text-green-500", badge: "bg-green-500/20 text-green-500 border border-green-500/30 font-black" },
  CANCELED: { label: "ملغي", color: "text-red-500", badge: "bg-red-500/20 text-red-500 border border-red-500/30" },
};

export default function BusinessOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/business/orders");
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "تعذر تحميل شحنات الشركة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    if (filter !== "ALL") {
      if (filter === "ACTIVE") {
        result = result.filter((o) => !["DELIVERED", "CANCELED"].includes(o.status));
      } else if (filter === "DELIVERED") {
        result = result.filter((o) => o.status === "DELIVERED");
      }
    }

    if (search.trim() !== "") {
      const query = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(query) ||
          o.dropoffAddress.toLowerCase().includes(query) ||
          (o.receiverName && o.receiverName.toLowerCase().includes(query)) ||
          (o.receiverPhone && o.receiverPhone.includes(query))
      );
    }

    setFilteredOrders(result);
  }, [filter, search, orders]);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Package className="text-gold w-7 h-7" />
            سجل شحنات الشركة والتتبع المباشر للمندوبين
          </h1>
          <p className="text-xs text-muted mt-1">
            قائمة بجميع الشحنات الفردية والمجمعة وحالة توصيلها ومعلومات المندوبين
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/business/bulk">
            <button className="bg-gold text-black px-4 py-2 rounded-xl font-bold text-xs hover:bg-gold-glow transition-all glow-effect">
              + إنشاء شحنات مجمعة
            </button>
          </Link>
          <button
            onClick={fetchOrders}
            className="p-2 rounded-xl border border-white/10 bg-surface text-muted hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5 text-xs font-bold shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold' : ''}`} />
            تحديث
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto bg-background border border-white/10 rounded-2xl px-4 py-2.5">
          <Search className="w-4 h-4 text-muted shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الطلب، المستلم، الهاتف، أو العنوان..."
            className="bg-transparent w-full sm:w-80 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {[
            { key: "ALL", label: "جميع الشحنات" },
            { key: "ACTIVE", label: "الشحنات النشطة (قيد التوصيل)" },
            { key: "DELIVERED", label: "المسلمة بنجاح" },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filter === btn.key
                  ? "bg-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.3)] font-black"
                  : "bg-background border border-white/10 text-muted hover:border-white/20 hover:text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid/List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => <div key={n} className="h-36 rounded-3xl bg-surface border border-white/10 animate-pulse"></div>)}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-white/10 rounded-3xl p-8 shadow-xl text-muted">
          <Package className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <h3 className="text-lg font-bold text-white mb-1">لا توجد شحنات مطابقة للبحث أو التصفية</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            تأكد من كلمات البحث أو قم بإنشاء طلبات توصيل جديدة للشركة ليتم عرضها هنا.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order, i) => {
            const statusInfo = statusMap[order.status] || { label: order.status, color: "text-muted", badge: "bg-white/10 text-muted" };
            const isActive = !["DELIVERED", "CANCELED"].includes(order.status);
            const dateStr = new Date(order.createdAt).toLocaleString("ar-EG", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={order.id}
                className={`bg-surface border rounded-3xl p-6 transition-all shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden ${
                  isActive ? "border-gold/40 shadow-[0_0_20px_rgba(255,215,0,0.05)]" : "border-white/10"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full filter blur-2xl pointer-events-none"></div>
                )}

                <div className="flex items-start gap-4 flex-1 relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                      isActive ? "bg-gold/20 text-gold border border-gold/40 animate-pulse" : "bg-background border border-white/10 text-muted"
                    }`}
                  >
                    {isActive ? <Navigation className="w-6 h-6 rotate-45" /> : <CheckCircle className="w-6 h-6 text-green-500 font-bold" />}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-black text-sm text-white tracking-wider">
                        #{order.id.slice(-6).toUpperCase()}
                      </span>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${statusInfo.badge}`}>
                        {statusInfo.label}
                      </span>
                      {order.packageType && (
                        <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-gold font-semibold">
                          {order.packageType}
                        </span>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2 text-xs font-semibold text-muted pt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>من: {order.pickupAddress}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Navigation className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>إلى: {order.dropoffAddress}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-white/5 font-semibold text-muted/80">
                      <div>المستلم: <strong className="text-white">{order.receiverName || "غير محدد"}</strong> ({order.receiverPhone || "بدون هاتف"})</div>
                      {order.driver?.user && (
                        <div className="bg-black/30 border border-white/5 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-gold">
                          <Truck className="w-3.5 h-3.5" />
                          <span>المندوب: {order.driver.user.firstName} {order.driver.user.lastName} ({order.driver.user.phone})</span>
                        </div>
                      )}
                      {order.notes && <div className="text-white/70">ملاحظة: {order.notes}</div>}
                    </div>

                    <div className="text-[10px] text-muted/60 flex items-center gap-1.5 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10 shrink-0 relative z-10">
                  <div className="text-right px-4 lg:border-r lg:border-white/10">
                    <div className="text-xs text-muted font-bold">إجمالي الأجرة</div>
                    <div className="font-black text-xl text-white">
                      {order.totalFare} <span className="text-xs text-gold">ج.م</span>
                    </div>
                  </div>

                  <Link href={`/tracking/${order.id}`}>
                    <button className="px-5 py-3 bg-gold hover:bg-gold-glow text-black font-black transition-all rounded-2xl text-xs flex items-center gap-2 shadow-lg glow-effect">
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
