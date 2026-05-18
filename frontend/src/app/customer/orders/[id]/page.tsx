"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Truck, User, Phone, CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { socket } from "@/lib/socket";

interface Order {
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
  driver?: {
    user?: {
      firstName: string;
      lastName: string;
      phone: string;
    };
    vehicle?: {
      make: string;
      model: string;
      licensePlate: string;
    };
  };
}

const statusProgression = ["REQUESTED", "ACCEPTED", "PICKED_UP", "ON_THE_WAY", "DELIVERED"];

const statusMap: Record<string, { label: string; step: number; desc: string }> = {
  REQUESTED: { label: "قيد المراجعة", step: 0, desc: "تم استلام الطلب وبانتظار موافقة المندوب" },
  PENDING: { label: "قيد الانتظار", step: 0, desc: "تم استلام الطلب وبانتظار موافقة المندوب" },
  ASSIGNED: { label: "تم التعيين", step: 1, desc: "تم تعيين مندوب التوصيل وهو في طريقه للاستلام" },
  ACCEPTED: { label: "تم القبول", step: 1, desc: "وافق المندوب على التوصيل وفي طريقه لنقطة الاستلام" },
  PICKED_UP: { label: "تم الاستلام", step: 2, desc: "استلم المندوب الشحنة بنجاح من المرسل" },
  IN_TRANSIT: { label: "في الطريق للمستلم", step: 3, desc: "الشحنة الآن في الطريق إلى موقع التسليم المختار" },
  ON_THE_WAY: { label: "في الطريق للمستلم", step: 3, desc: "الشحنة الآن في الطريق إلى موقع التسليم المختار" },
  NEAR_DESTINATION: { label: "بالقرب من المستلم", step: 3, desc: "المندوب يقترب من موقع التسليم" },
  DELIVERED: { label: "تم التوصيل", step: 4, desc: "تم تسليم الشحنة للمستلم بنجاح" },
};

export default function LiveOrderTrackingPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liveStatus, setLiveStatus] = useState("");
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
        setLiveStatus(res.data.status);
      } catch (err: any) {
        setError("تعذر تحميل تفاصيل الطلب");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Setup Socket
    const token = localStorage.getItem("token");
    if (token && id) {
      socket.auth = { token };
      socket.connect();

      socket.emit("join_room", `order_${id}`);

      socket.on("status_updated", (data: { orderId: string; status: string }) => {
        if (data.orderId === id) {
          setLiveStatus(data.status);
          if (order) {
            setOrder((prev) => (prev ? { ...prev, status: data.status } : null));
          }
        }
      });

      socket.on("location_updated", (data: { orderId: string; lat: number; lng: number }) => {
        if (data.orderId === id) {
          setLiveLocation({ lat: data.lat, lng: data.lng });
        }
      });
    }

    return () => {
      socket.off("status_updated");
      socket.off("location_updated");
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-muted font-bold text-sm">جاري تحميل تفاصيل الطلب والتتبع المباشر...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-surface border border-white/10 rounded-3xl space-y-4">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h3 className="text-xl font-bold">الطلب غير موجود أو حدث خطأ</h3>
        <button onClick={() => router.push("/customer/orders")} className="bg-gold text-black px-6 py-2 rounded-xl font-bold">
          العودة للطلبات
        </button>
      </div>
    );
  }

  const currentStatusInfo = statusMap[liveStatus] || { label: liveStatus, step: 0, desc: "تحديث مباشر للحالة" };
  const currentStep = currentStatusInfo.step;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link href="/customer/orders" className="flex items-center gap-2 text-muted hover:text-white transition-colors">
          <ArrowRight className="w-5 h-5" />
          <span className="font-bold text-sm">العودة للطلبات السابقة</span>
        </Link>
        <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-gold tracking-widest">
          LIVE TRACKING 🔴
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-surface border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="text-xs text-muted mb-1">طلب توصيل</div>
            <h1 className="text-2xl font-black tracking-wider text-white">#{order.id.slice(-6).toUpperCase()}</h1>
            <p className="text-xs text-muted mt-1">{new Date(order.createdAt).toLocaleString("ar-EG")}</p>
          </div>

          <div className="flex items-center gap-4 bg-background px-6 py-4 rounded-2xl border border-white/10">
            <div className="w-12 h-12 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center text-gold animate-pulse">
              <Navigation className="w-6 h-6 rotate-45" />
            </div>
            <div>
              <div className="text-xs text-muted">الحالة المباشرة الآن</div>
              <div className="text-lg font-bold text-gold">{currentStatusInfo.label}</div>
              <div className="text-xs text-muted/80">{currentStatusInfo.desc}</div>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="pt-6 border-t border-white/10">
          <div className="relative">
            {/* Background Line */}
            <div className="absolute top-1/2 right-0 left-0 h-1.5 bg-white/10 -translate-y-1/2 rounded-full z-0"></div>

            {/* Active Line */}
            <div
              className="absolute top-1/2 right-0 h-1.5 bg-gold -translate-y-1/2 rounded-full transition-all duration-700 z-0 shadow-[0_0_15px_rgba(255,215,0,0.5)]"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>

            {/* Steps */}
            <div className="relative z-10 flex justify-between">
              {[
                { title: "الطلب", desc: "قيد المراجعة" },
                { title: "القبول", desc: "تم التعيين" },
                { title: "الاستلام", desc: "من المرسل" },
                { title: "في الطريق", desc: "للتسليم" },
                { title: "التوصيل", desc: "مكتمل" },
              ].map((stepItem, index) => {
                const isPassed = index <= currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div key={stepItem.title} className="flex flex-col items-center text-center w-20">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 mb-2 shadow-lg ${
                        isCurrent
                          ? "bg-gold text-black scale-125 ring-4 ring-gold/20 shadow-[0_0_20px_rgba(255,215,0,0.8)]"
                          : isPassed
                          ? "bg-gold text-black"
                          : "bg-surface border-2 border-white/20 text-muted"
                      }`}
                    >
                      {isPassed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                    </div>
                    <span className={`text-xs font-bold ${isCurrent ? "text-gold" : isPassed ? "text-white" : "text-muted"}`}>
                      {stepItem.title}
                    </span>
                    <span className="text-[10px] text-muted/80 hidden sm:block">{stepItem.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Addresses & Items */}
        <div className="bg-surface border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl">
          <h3 className="text-lg font-bold border-b border-white/10 pb-3">مسار التوصيل</h3>

          <div className="space-y-6 relative">
            <div className="absolute right-6 top-6 bottom-6 w-0.5 bg-white/10"></div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 bg-background border border-white/10 rounded-full flex items-center justify-center shrink-0 text-gold shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="bg-background border border-white/10 rounded-2xl p-4 flex-1">
                <div className="text-xs text-muted mb-1">موقع الاستلام</div>
                <div className="text-sm font-bold text-white">{order.pickupAddress}</div>
              </div>
            </div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-12 h-12 bg-background border border-gold/30 rounded-full flex items-center justify-center shrink-0 text-red-500 shadow-md">
                <Navigation className="w-5 h-5" />
              </div>
              <div className="bg-background border border-gold/40 rounded-2xl p-4 flex-1 shadow-[0_0_15px_rgba(255,215,0,0.05)]">
                <div className="text-xs text-gold mb-1">موقع التسليم</div>
                <div className="text-sm font-bold text-white">{order.dropoffAddress}</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-muted">تفاصيل الشحنة</h4>
            <div className="bg-background p-4 rounded-2xl border border-white/10 grid grid-cols-2 gap-4 text-xs font-bold">
              <div>
                <span className="text-muted block mb-1">نوع الشحنة</span>
                <span className="text-white">{order.packageType || "طرد عادي"}</span>
              </div>
              <div>
                <span className="text-muted block mb-1">التكلفة الإجمالية</span>
                <span className="text-gold font-black text-sm">{order.totalFare} ج.م</span>
              </div>
              <div className="col-span-2">
                <span className="text-muted block mb-1">ملاحظات التوصيل</span>
                <span className="text-white/80">{order.notes || "لا توجد ملاحظات إضافية"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Driver & Receiver Info */}
        <div className="bg-surface border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold border-b border-white/10 pb-3 mb-6">بيانات المندوب والمستلم</h3>

            {order.driver?.user ? (
              <div className="bg-background border border-white/10 rounded-2xl p-6 space-y-4 mb-6 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-surface border-2 border-gold rounded-full flex items-center justify-center text-gold text-xl font-bold">
                    {order.driver.user.firstName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gold font-bold mb-0.5">مندوب التوصيل المعين</div>
                    <div className="text-lg font-bold text-white">
                      {order.driver.user.firstName} {order.driver.user.lastName}
                    </div>
                  </div>
                  <a href={`tel:${order.driver.user.phone}`} className="p-3 bg-gold/10 border border-gold text-gold rounded-xl hover:bg-gold hover:text-black transition-colors">
                    <Phone className="w-5 h-5" />
                  </a>
                </div>

                {order.driver.vehicle && (
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-muted">
                    <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-gold" /> المركبة: {order.driver.vehicle.make} {order.driver.vehicle.model}</span>
                    <span className="bg-white/5 px-2.5 py-1 rounded-md border border-white/10">{order.driver.vehicle.licensePlate}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-background border border-white/10 rounded-2xl p-8 text-center text-muted mb-6">
                <Clock className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-bold">جاري البحث عن أقرب مندوب متاح...</p>
              </div>
            )}

            <div className="bg-background border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="text-xs text-muted font-bold">المستلم</div>
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="flex items-center gap-2 text-white">
                  <User className="w-4 h-4 text-gold" />
                  {order.receiverName || "عميل غير مسمى"}
                </span>
                <span dir="ltr" className="text-muted">{order.receiverPhone || "غير متوفر"}</span>
              </div>
            </div>
          </div>

          {/* Interactive Map Feed / Live Location Display */}
          <div className="bg-background border border-white/10 rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-gold">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              موقع المندوب المباشر
            </div>
            {liveLocation ? (
              <p className="text-xs text-white/80" dir="ltr">Lat: {liveLocation.lat.toFixed(4)}, Lng: {liveLocation.lng.toFixed(4)}</p>
            ) : (
              <p className="text-xs text-muted">سيتم تحديث إحداثيات المندوب على الخريطة بمجرد تحركه</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
