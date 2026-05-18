"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { socket } from "@/lib/socket";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, MapPin, Package, Truck, Clock, Navigation } from "lucide-react";
import Link from "next/link";

export default function TrackingDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err: any) {
        console.error(err);
        setError("لم يتم العثور على الطلب. يرجى التأكد من رقم التتبع.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();

      const token = localStorage.getItem("token");
      if (token) {
        socket.auth = { token };
        socket.connect();
        socket.emit("join_room", `order_${id}`);

        socket.on("status_updated", (data: { orderId: string; status: string }) => {
          if (data.orderId === id) {
            setOrder((prev: any) => (prev ? { ...prev, status: data.status } : null));
          }
        });

        socket.on("location_updated", (data: { orderId: string; lat: number; lng: number }) => {
          if (data.orderId === id) {
            setLiveLocation({ lat: data.lat, lng: data.lng });
          }
        });
      }
    }

    const interval = setInterval(fetchOrder, 10000);
    return () => {
      clearInterval(interval);
      socket.off("status_updated");
      socket.off("location_updated");
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Package className="w-12 h-12 text-gold mb-4" />
          <div className="text-white">جاري البحث عن الشحنة...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="bg-surface border border-red-500/20 p-8 rounded-3xl text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">خطأ في التتبع</h2>
          <p className="text-muted mb-6">{error}</p>
          <Link href="/tracking" className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-colors">
            حاول مرة أخرى
          </Link>
        </div>
      </div>
    );
  }

  // Define steps
  const steps = [
    { key: "REQUESTED", label: "تم الطلب", icon: Clock },
    { key: "ASSIGNED", label: "تم التعيين لمندوب", icon: Truck },
    { key: "PICKED_UP", label: "تم الاستلام من المرسل", icon: Package },
    { key: "IN_TRANSIT", label: "في الطريق إليك", icon: Truck },
    { key: "DELIVERED", label: "تم التسليم", icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status) || 0;

  return (
    <div className="min-h-screen bg-background p-6 pt-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              تتبع الشحنة
              <span className="text-sm font-mono bg-gold/20 text-gold px-3 py-1 rounded-lg">
                #{order.id.slice(0, 8)}
              </span>
            </h1>
            <p className="text-muted mt-2">آخر تحديث: {new Date(order.updatedAt).toLocaleTimeString('ar-EG')}</p>
          </div>
          <Link href="/dashboard" className="text-sm text-muted hover:text-white transition-colors">
            العودة للوحة التحكم
          </Link>
        </div>

        {/* Timeline */}
        <div className="bg-surface border border-white/10 p-8 rounded-3xl mb-8">
          <div className="relative">
            <div className="absolute top-1/2 right-0 w-full h-1 bg-white/5 -translate-y-1/2 z-0 hidden md:block"></div>
            <div 
              className="absolute top-1/2 right-0 h-1 bg-gold -translate-y-1/2 z-0 hidden md:block transition-all duration-1000"
              style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
            ></div>

            <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.key} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-surface shrink-0 transition-colors duration-500
                      ${isCompleted ? 'bg-gold text-black' : 'bg-white/5 text-muted'}
                      ${isCurrent ? 'shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-110' : ''}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-right md:text-center">
                      <div className={`font-bold text-sm md:text-base ${isCompleted ? 'text-white' : 'text-muted'}`}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface border border-white/10 p-6 rounded-3xl">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="text-gold w-5 h-5" />
              مسار الشحنة
            </h3>
            <div className="space-y-6">
              <div className="relative pl-6 border-r-2 border-dashed border-white/10 pr-6">
                <div className="absolute top-0 -right-[9px] w-4 h-4 rounded-full bg-gold"></div>
                <div className="text-sm text-muted mb-1">من</div>
                <div className="text-white">{order.pickupAddress}</div>
              </div>
              <div className="relative pl-6 pr-6">
                <div className="absolute top-0 -right-[9px] w-4 h-4 rounded-full border-2 border-gold bg-surface"></div>
                <div className="text-sm text-muted mb-1">إلى</div>
                <div className="text-white">{order.dropoffAddress}</div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-white/10 p-6 rounded-3xl">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Package className="text-gold w-5 h-5" />
              معلومات إضافية
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-muted text-sm">التكلفة</span>
                <span className="text-white font-bold">{order.totalFare || 0} ج.م</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-muted text-sm">طريقة الدفع</span>
                <span className="text-white font-bold">{order.paymentMethod}</span>
              </div>
              {order.driver && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-muted text-sm">المندوب</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center text-gold font-bold text-xs">
                      {order.driver.user?.firstName?.[0] || 'D'}
                    </div>
                    <span className="text-white font-bold">{order.driver.user?.firstName || 'جاري التعيين'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Map Feed / Live Location Display */}
        <div className="mt-6 bg-background border border-white/10 rounded-3xl p-6 text-center space-y-2 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-gold">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            موقع المندوب المباشر (Live GPS)
          </div>
          {liveLocation ? (
            <p className="text-xs text-white/90 font-mono" dir="ltr">
              Lat: {liveLocation.lat.toFixed(5)}, Lng: {liveLocation.lng.toFixed(5)}
            </p>
          ) : (
            <p className="text-xs text-muted">سيتم تحديث إحداثيات المندوب على الخريطة بمجرد تحركه</p>
          )}
        </div>

      </div>
    </div>
  );
}
