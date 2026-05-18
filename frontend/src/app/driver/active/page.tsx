"use client";

import { motion } from "framer-motion";
import { Navigation, Phone, MessageSquare, CheckCircle, Navigation2, RefreshCw, AlertCircle, Package, MapPin, ArrowRight, Truck, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { socket } from "@/lib/socket";

interface Order {
  id: string;
  status: string;
  pickupAddress: string;
  dropoffAddress: string;
  totalFare: number;
  receiverName?: string;
  receiverPhone?: string;
  packageType?: string;
  notes?: string;
  customer?: {
    firstName: string;
    lastName: string;
    phone: string;
    companyName?: string;
  };
}

const nextStatusMap: Record<string, { nextStatus: string; buttonLabel: string; desc: string }> = {
  ASSIGNED: { nextStatus: "PICKED_UP", buttonLabel: "تأكيد استلام الشحنة من المرسل", desc: "أنت الآن في الطريق لنقطة الاستلام" },
  ACCEPTED: { nextStatus: "PICKED_UP", buttonLabel: "تأكيد استلام الشحنة من المرسل", desc: "أنت الآن في الطريق لنقطة الاستلام" },
  PICKED_UP: { nextStatus: "ON_THE_WAY", buttonLabel: "بدء التوجه إلى موقع التسليم (في الطريق)", desc: "تم استلام الشحنة وهي بحوزتك الآن" },
  IN_TRANSIT: { nextStatus: "DELIVERED", buttonLabel: "تأكيد تسليم الشحنة للعميل بنجاح", desc: "أنت في الطريق إلى وجهة التسليم" },
  ON_THE_WAY: { nextStatus: "DELIVERED", buttonLabel: "تأكيد تسليم الشحنة للعميل بنجاح", desc: "أنت في الطريق إلى وجهة التسليم" },
};

const statusDisplayMap: Record<string, string> = {
  ASSIGNED: "متوجه للاستلام",
  ACCEPTED: "متوجه للاستلام",
  PICKED_UP: "تم الاستلام وبحوزتك",
  IN_TRANSIT: "في الطريق للتسليم",
  ON_THE_WAY: "في الطريق للتسليم",
  DELIVERED: "مكتمل التسليم",
};

export default function ActiveDeliveryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState({ lat: 30.0444, lng: 31.2357 });

  const fetchActiveOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/driver/active");
      setOrders(res.data);
      if (res.data.length > 0 && !selectedOrder) {
        setSelectedOrder(res.data[0]);
      } else if (selectedOrder) {
        const updated = res.data.find((o: Order) => o.id === selectedOrder.id);
        setSelectedOrder(updated || res.data[0] || null);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "تعذر تحميل الطلبات النشطة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveOrders();

    // Setup periodic location update simulator
    const interval = setInterval(() => {
      setCoords((prev) => {
        const nextLat = prev.lat + (Math.random() - 0.5) * 0.002;
        const nextLng = prev.lng + (Math.random() - 0.5) * 0.002;
        if (selectedOrder && socket?.connected) {
          socket.emit("update_location", {
            orderId: selectedOrder.id,
            lat: nextLat,
            lng: nextLng,
            driverId: "self",
          });
        }
        return { lat: nextLat, lng: nextLng };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedOrder?.id]);

  const handleUpdateStatus = async (orderId: string, currentStatus: string) => {
    const nextConfig = nextStatusMap[currentStatus];
    if (!nextConfig) return;

    setUpdating(true);
    try {
      await api.patch(`/driver/status/${orderId}`, { status: nextConfig.nextStatus });
      if (socket?.connected) {
        socket.emit("update_status", { orderId, status: nextConfig.nextStatus });
      }
      alert(
        nextConfig.nextStatus === "DELIVERED"
          ? "تم التوصيل بنجاح وإضافة الأرباح إلى رصيدك!"
          : "تم تحديث حالة الطلب بنجاح!"
      );
      fetchActiveOrders();
    } catch (err: any) {
      alert("حدث خطأ أثناء تحديث الحالة");
    } finally {
      setUpdating(false);
    }
  };

  const handleSetExplicitStatus = async (orderId: string, targetStatus: string) => {
    setUpdating(true);
    try {
      await api.patch(`/driver/status/${orderId}`, { status: targetStatus });
      if (socket?.connected) {
        socket.emit("update_status", { orderId, status: targetStatus });
      }
      alert(
        targetStatus === "DELIVERED"
          ? "تم التوصيل بنجاح وإضافة الأرباح إلى رصيدك!"
          : "تم تحديث حالة الطلب بنجاح!"
      );
      fetchActiveOrders();
    } catch (err: any) {
      alert("حدث خطأ أثناء تحديث الحالة");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/driver" className="p-2 rounded-xl bg-surface border border-white/10 text-muted hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">شاشـة التوصيـل المباشـر (الطلبات النشطة)</h1>
            <p className="text-xs text-muted mt-1">تتبع مسار التوصيل وقم بتحديث حالات الاستلام والتسليم خطوة بخطوة</p>
          </div>
        </div>
        <button
          onClick={fetchActiveOrders}
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
        <div className="h-[500px] rounded-3xl bg-surface border border-white/10 animate-pulse flex items-center justify-center">
          <p className="text-muted font-bold text-sm">جاري تحميل الطلبات النشطة...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-24 bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl space-y-4">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto opacity-80" />
          <h3 className="text-xl font-bold text-white">ليس لديك أي طلبات نشطة قيد التوصيل حالياً</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            جميع الطلبات التي قبلتها تم توصيلها بنجاح. يمكنك استعراض الطلبات المتاحة في لوحة التحكم لقبول طلبات جديدة.
          </p>
          <Link href="/driver">
            <button className="px-8 py-3.5 bg-gold text-black rounded-xl font-bold hover:bg-gold-glow transition-all glow-effect shadow-xl text-sm">
              استعراض الطلبات المتاحة ⟵
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 min-h-[600px]">
          {/* Order Selector List */}
          <div className="lg:col-span-1 bg-surface border border-white/10 rounded-3xl p-5 flex flex-col space-y-4 shadow-xl">
            <div className="text-sm font-bold text-white px-2 flex items-center justify-between border-b border-white/10 pb-3">
              <span>الطلبات النشطة ({orders.length})</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {orders.map((o) => {
                const isSelected = selectedOrder?.id === o.id;
                const statusName = statusDisplayMap[o.status] || o.status;

                return (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOrder(o)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3 ${
                      isSelected
                        ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(255,215,0,0.15)] text-white"
                        : "bg-background/60 border-white/10 text-muted hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className="text-white tracking-wide">#{o.id.slice(-6).toUpperCase()}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] ${isSelected ? "bg-gold text-black font-black" : "bg-white/10 text-white"}`}>
                        {statusName}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span className="truncate">استلام: {o.pickupAddress}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">تسليم: {o.dropoffAddress}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Delivery Detail & Interactive Map */}
          {selectedOrder && (
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Control Panel */}
              <div className="bg-surface border border-gold/40 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gold font-bold">الطلب المحدد للتوصيل</span>
                      <span className="text-xs bg-white/10 border border-white/10 px-2 py-0.5 rounded text-white font-mono">
                        #{selectedOrder.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xl font-black text-white">
                      {statusDisplayMap[selectedOrder.status] || selectedOrder.status}
                    </div>
                  </div>

                  <div className="text-left md:text-right bg-background/80 border border-white/10 px-6 py-3 rounded-2xl shadow-inner">
                    <div className="text-xs text-muted">الأجرة الإجمالية</div>
                    <div className="text-2xl font-black text-gold">{selectedOrder.totalFare} <span className="text-xs text-white">ج.م</span></div>
                  </div>
                </div>

                {/* Customer and Receiver Info */}
                <div className="grid md:grid-cols-2 gap-4 relative z-10">
                  {selectedOrder.customer && (
                    <div className="bg-background border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-md">
                      <div>
                        <div className="text-[10px] text-muted font-bold mb-0.5">بيانات العميل (المرسل)</div>
                        <div className="text-sm font-bold text-white">
                          {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}
                        </div>
                      </div>
                      <a href={`tel:${selectedOrder.customer.phone}`} className="p-3 rounded-xl bg-gold/10 border border-gold text-gold hover:bg-gold hover:text-black transition-all">
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  <div className="bg-background border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-md">
                    <div>
                      <div className="text-[10px] text-muted font-bold mb-0.5">بيانات المستلم</div>
                      <div className="text-sm font-bold text-white">
                        {selectedOrder.receiverName || "عميل غير مسمى"}
                      </div>
                      <div className="text-xs text-muted" dir="ltr">{selectedOrder.receiverPhone || "غير متوفر"}</div>
                    </div>
                    {selectedOrder.receiverPhone && (
                      <a href={`tel:${selectedOrder.receiverPhone}`} className="p-3 rounded-xl bg-green-500/10 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition-all">
                        <Phone className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Route Addresses */}
                <div className="bg-background/50 border border-white/10 rounded-2xl p-5 space-y-4 relative z-10">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted">عنوان الاستلام</div>
                      <div className="text-sm font-bold text-white">{selectedOrder.pickupAddress}</div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/10"></div>

                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-gold">عنوان التسليم النهائي</div>
                      <div className="text-sm font-bold text-white">{selectedOrder.dropoffAddress}</div>
                    </div>
                  </div>
                </div>

                {/* Status Progression Button */}
                {nextStatusMap[selectedOrder.status] && (
                  <div className="pt-2 z-10 relative space-y-3">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status)}
                      disabled={updating}
                      className="w-full py-4 bg-gold hover:bg-gold-glow text-black font-black rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all glow-effect text-sm disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                      {updating ? "جاري التحديث وبث الحالة..." : nextStatusMap[selectedOrder.status].buttonLabel}
                    </button>
                    <p className="text-center text-xs text-muted">
                      {nextStatusMap[selectedOrder.status].desc}
                    </p>
                  </div>
                )}

                {/* Explicit Quick Actions */}
                <div className="pt-4 border-t border-white/10 z-10 relative space-y-2">
                  <div className="text-xs font-bold text-muted">تحديث الحالة اليدوي السريع:</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "PENDING", label: "قيد الانتظار" },
                      { key: "ACCEPTED", label: "تم القبول" },
                      { key: "PICKED_UP", label: "تم الاستلام" },
                      { key: "ON_THE_WAY", label: "في الطريق" },
                      { key: "DELIVERED", label: "تم التسليم" },
                    ].map((st) => (
                      <button
                        key={st.key}
                        onClick={() => handleSetExplicitStatus(selectedOrder.id, st.key)}
                        disabled={updating || selectedOrder.status === st.key}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedOrder.status === st.key
                            ? "bg-gold text-black border-gold shadow-md font-black"
                            : "bg-background border-white/10 hover:border-white/30 text-muted hover:text-white"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Simulator */}
              <div className="h-72 bg-surface border border-white/10 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center p-6">
                <div className="absolute inset-0 bg-[#0A0A0A] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                <div className="absolute top-4 left-4 bg-background/80 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 z-10">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  بث الموقع المباشر مفعل (WebSocket)
                </div>

                <div className="w-16 h-16 bg-gold/10 border-2 border-gold rounded-full flex items-center justify-center text-gold shadow-[0_0_20px_rgba(255,215,0,0.4)] animate-bounce z-10 mb-3">
                  <Truck className="w-8 h-8" />
                </div>

                <h4 className="font-bold text-white z-10 text-sm">نظام الملاحة وتتبع المركبة المباشر</h4>
                <p className="text-xs text-muted max-w-md mt-1.5 z-10" dir="ltr">
                  Current GPS Fix: Lat {coords.lat.toFixed(4)}, Lng {coords.lng.toFixed(4)}
                </p>
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-4 z-10">
                  <div className="w-full h-full bg-gold animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
