"use client";

import { Users, Truck, Package, DollarSign, Briefcase, CheckCircle, RefreshCw, AlertCircle, Eye, Clock, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalFare: number;
  pickupAddress: string;
  dropoffAddress: string;
  packageType?: string;
  customer?: { firstName: string; lastName: string; phone: string; companyName?: string };
  driver?: { user?: { firstName: string; lastName: string; phone: string } };
}

const statusMap: Record<string, { label: string; badge: string }> = {
  REQUESTED: { label: "قيد المراجعة", badge: "bg-amber-400/20 text-amber-400 border border-amber-400/30" },
  PENDING: { label: "قيد الانتظار", badge: "bg-amber-400/20 text-amber-400 border border-amber-400/30" },
  ASSIGNED: { label: "تم التعيين", badge: "bg-blue-400/20 text-blue-400 border border-blue-400/30" },
  ACCEPTED: { label: "قيد التنفيذ (مقبول)", badge: "bg-blue-400/20 text-blue-400 border border-blue-400/30" },
  PICKED_UP: { label: "تم الاستلام", badge: "bg-purple-400/20 text-purple-400 border border-purple-400/30" },
  IN_TRANSIT: { label: "في الطريق للمستلم", badge: "bg-sky-400/20 text-sky-400 border border-sky-400/30" },
  ON_THE_WAY: { label: "في الطريق للمستلم", badge: "bg-sky-400/20 text-sky-400 border border-sky-400/30" },
  DELIVERED: { label: "تم التوصيل بنجاح", badge: "bg-green-500/20 text-green-500 border border-green-500/30 font-black" },
  CANCELED: { label: "ملغي", badge: "bg-red-500/20 text-red-500 border border-red-500/30" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalDrivers: 0, totalBusinesses: 0, totalOrders: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/orders"),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data.slice(0, 10)); // Top 10 recent orders
    } catch (err: any) {
      console.error(err);
      setError("تعذر تحميل إحصائيات الإدارة. يرجى التأكد من صلاحيات حسابك (ADMIN).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-black text-white">لوحة الإدارة المركزية (Admin Portal)</h1>
          <p className="text-xs text-muted mt-1">مراقبة حية لجميع إحصائيات وعمليات منصة وين الطلب</p>
        </div>
        <button
          onClick={fetchData}
          className="p-2.5 rounded-xl border border-white/10 bg-surface text-muted hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold' : ''}`} />
          تحديث المنصة
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between group hover:border-gold/40 transition-all">
          <div>
            <div className="text-muted text-xs font-semibold mb-1">العملاء الأفراد</div>
            <div className="text-3xl font-black text-white">{loading ? "..." : stats.totalUsers}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shadow-md">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between group hover:border-sky-400/40 transition-all">
          <div>
            <div className="text-muted text-xs font-semibold mb-1">المناديب والكباتن</div>
            <div className="text-3xl font-black text-white">{loading ? "..." : stats.totalDrivers}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-400/10 text-sky-400 flex items-center justify-center shadow-md">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between group hover:border-amber-400/40 transition-all">
          <div>
            <div className="text-muted text-xs font-semibold mb-1">الشركات والأعمال</div>
            <div className="text-3xl font-black text-white">{loading ? "..." : stats.totalBusinesses}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center shadow-md">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between group hover:border-blue-400/40 transition-all">
          <div>
            <div className="text-muted text-xs font-semibold mb-1">إجمالي الطلبات والشحنات</div>
            <div className="text-3xl font-black text-white">{loading ? "..." : stats.totalOrders}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-400/10 text-blue-400 flex items-center justify-center shadow-md">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface border border-green-500/40 rounded-3xl p-6 shadow-[0_0_25px_rgba(34,197,94,0.1)] flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="text-muted text-xs font-semibold mb-1">إجمالي إيرادات التوصيل</div>
            <div className="text-3xl font-black text-green-400">{loading ? "..." : stats.totalRevenue} <span className="text-xs text-white">ج.م</span></div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center shadow-md">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Monitoring Orders Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-gold" />
            مراقبة حية لأحدث 10 طلبات في المنصة
          </h2>
          <span className="text-xs text-muted">تحديث فوري</span>
        </div>

        {loading ? (
          <div className="h-64 rounded-3xl bg-surface border border-white/10 animate-pulse flex items-center justify-center">
            <p className="text-muted font-bold text-sm">جاري تحميل أحدث الطلبات...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-white/10 rounded-3xl p-8 text-muted">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-bold">لا يوجد أي طلبات توصيل في قاعدة البيانات بعد</p>
          </div>
        ) : (
          <div className="bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-background/80 border-b border-white/10 text-muted font-bold">
                  <tr>
                    <th className="p-4 font-semibold">رقم الطلب</th>
                    <th className="p-4 font-semibold">المرسل</th>
                    <th className="p-4 font-semibold">المندوب</th>
                    <th className="p-4 font-semibold">خط السير</th>
                    <th className="p-4 font-semibold">التكلفة</th>
                    <th className="p-4 font-semibold">الحالة</th>
                    <th className="p-4 font-semibold text-center">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {orders.map((order) => {
                    const st = statusMap[order.status] || { label: order.status, badge: "bg-white/10 text-muted" };
                    const custName = order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "عميل";

                    return (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-white">#{order.id.slice(-6).toUpperCase()}</td>
                        <td className="p-4">
                          <div className="text-white font-bold">{custName}</div>
                          {order.customer?.companyName && <div className="text-[10px] text-gold">{order.customer.companyName}</div>}
                        </td>
                        <td className="p-4">
                          {order.driver?.user ? (
                            <div className="text-sky-400 font-bold">{order.driver.user.firstName} {order.driver.user.lastName}</div>
                          ) : (
                            <span className="text-muted">لم يُعين</span>
                          )}
                        </td>
                        <td className="p-4 max-w-xs truncate" title={`من: ${order.pickupAddress} | إلى: ${order.dropoffAddress}`}>
                          <div className="flex items-center gap-1"><span className="text-gold">من:</span> {order.pickupAddress}</div>
                          <div className="flex items-center gap-1 text-muted"><span className="text-red-400">إلى:</span> {order.dropoffAddress}</div>
                        </td>
                        <td className="p-4 font-bold text-gold">{order.totalFare} ج.م</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${st.badge}`}>
                            {st.label}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <Link href={`/tracking/${order.id}`}>
                            <button className="px-3 py-1 bg-white/10 hover:bg-gold hover:text-black transition-all rounded-lg text-[10px] font-bold border border-white/10">
                              تتبع مباشر ⟵
                            </button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
