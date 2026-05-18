"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Truck, Package, Bike, User, Phone, FileText, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RequestDeliveryPage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState("motorcycle");
  const [pickupAddress, setPickupAddress] = useState("المعادي، شارع 9");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [packageType, setPackageType] = useState("طرد عادي");
  const [packageDescription, setPackageDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [priorityOption, setPriorityOption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!pickupAddress || !dropoffAddress || !receiverName || !receiverPhone) {
      setError("يرجى تعبئة جميع الحقول المطلوبة (موقع الاستلام، موقع التسليم، اسم ورقم المستلم)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/orders", {
        pickupAddress,
        pickupLat: 30.0444 + (Math.random() - 0.5) * 0.05,
        pickupLng: 31.2357 + (Math.random() - 0.5) * 0.05,
        dropoffAddress,
        dropoffLat: 30.0131 + (Math.random() - 0.5) * 0.05,
        dropoffLng: 31.4243 + (Math.random() - 0.5) * 0.05,
        receiverName,
        receiverPhone,
        packageType,
        notes: `${priorityOption ? "[URGENT] " : ""}${notes}`,
        paymentMethod: "CASH",
        itemDescription: `${packageType}${packageDescription ? ` - ${packageDescription}` : ""}`,
        itemCategory: "PARCEL",
      });

      alert("تم إنشاء طلب التوصيل بنجاح!");
      router.push("/customer/orders");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || "حدث خطأ أثناء إرسال الطلب. تأكد من صحة البيانات المسجلة."
      );
    } finally {
      setLoading(false);
    }
  };

  const baseCost = vehicle === "motorcycle" ? 45 : 75;
  const totalCost = priorityOption ? baseCost + 25 : baseCost;

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-120px)] pb-12">
      {/* Form Area */}
      <div className="lg:col-span-1 bg-surface border border-white/10 rounded-3xl p-6 flex flex-col overflow-y-auto space-y-6 shadow-xl">
        <h2 className="text-xl font-bold">طلب مندوب توصيل جديد</h2>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-bold">
            {error}
          </div>
        )}

        <div className="space-y-6 flex-1">
          {/* Addresses */}
          <div className="space-y-4">
            <div className="relative flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-full bg-background border border-white/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1 bg-background border border-white/10 rounded-xl px-4 py-3">
                <div className="text-xs text-muted mb-1">موقع الاستلام *</div>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="حدد موقع الاستلام بالتفصيل..."
                  className="bg-transparent w-full focus:outline-none text-sm font-medium text-white"
                />
              </div>
            </div>

            <div className="relative flex items-center gap-4 z-10">
              <div className="w-12 h-12 rounded-full bg-background border border-white/10 flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1 bg-background border border-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.1)] rounded-xl px-4 py-3">
                <div className="text-xs text-gold mb-1">موقع التسليم *</div>
                <input
                  type="text"
                  value={dropoffAddress}
                  onChange={(e) => setDropoffAddress(e.target.value)}
                  placeholder="إلى أين تريد التوصيل؟ (مثال: التجمع الخامس، الحي الثاني)"
                  className="bg-transparent w-full focus:outline-none text-sm font-medium text-white"
                />
              </div>
            </div>
          </div>

          {/* Receiver Info */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="text-sm font-bold text-muted">بيانات المستلم</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-background border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <User className="w-4 h-4 text-muted shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-muted">اسم المستلم *</div>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="الاسم الكامل"
                    className="bg-transparent w-full focus:outline-none text-sm font-medium text-white"
                  />
                </div>
              </div>

              <div className="bg-background border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-muted">رقم هاتف المستلم *</div>
                  <input
                    type="tel"
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="bg-transparent w-full focus:outline-none text-sm font-medium text-white text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Package Type & Description */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div className="text-sm font-bold text-muted">تفاصيل الشحنة</div>
            <div className="grid grid-cols-3 gap-2">
              {["مستندات / أوراق", "طرد عادي", "أطعمة / مشروبات"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPackageType(type)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    packageType === type
                      ? "border-gold bg-gold/10 text-gold shadow-[0_0_10px_rgba(255,215,0,0.1)]"
                      : "border-white/10 bg-background text-muted hover:border-white/20"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="bg-background border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <FileText className="w-4 h-4 text-muted shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-muted">وصف الشحنة (اختياري)</div>
                <input
                  type="text"
                  value={packageDescription}
                  onChange={(e) => setPackageDescription(e.target.value)}
                  placeholder="مثال: جهاز لابتوب مغلف بعناية في كرتونة..."
                  className="bg-transparent w-full focus:outline-none text-sm font-medium text-white"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Selection */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="text-sm font-bold text-muted">نوع المركبة المطلوبة</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVehicle("motorcycle")}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  vehicle === "motorcycle"
                    ? "border-gold bg-gold/10 text-gold shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                    : "border-white/10 bg-background text-muted hover:border-white/20"
                }`}
              >
                <Bike className="w-6 h-6" />
                <span className="text-sm font-bold">دراجة نارية (أسرع)</span>
              </button>
              <button
                type="button"
                onClick={() => setVehicle("car")}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  vehicle === "car"
                    ? "border-gold bg-gold/10 text-gold shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                    : "border-white/10 bg-background text-muted hover:border-white/20"
                }`}
              >
                <Truck className="w-6 h-6" />
                <span className="text-sm font-bold">سيارة / فان (أحجام كبيرة)</span>
              </button>
            </div>
          </div>

          {/* Priority Option */}
          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setPriorityOption(!priorityOption)}
              className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
                priorityOption
                  ? "border-amber-500 bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                  : "border-white/10 bg-background text-muted hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${priorityOption ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-muted"}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${priorityOption ? "text-amber-400" : "text-white"}`}>
                    توصيل فوري / سريع جداً (Express Priority)
                  </div>
                  <div className="text-xs text-muted">تخصيص أسرع مندوب متاح للشحنات الطارئة (+25 ج.م)</div>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${priorityOption ? "border-amber-400 bg-amber-400 text-black font-black" : "border-white/20"}`}>
                {priorityOption ? "✓" : ""}
              </div>
            </button>
          </div>

          {/* Notes */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="text-sm font-bold text-muted">ملاحظات للمندوب</div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="تعليمات إضافية للتوصيل، رقم الشقة، أوقات التواجد..."
              className="w-full bg-background border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-gold transition-colors resize-none h-20 text-white"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">التكلفة التقديرية</span>
            <span className="text-2xl font-black text-white">
              {totalCost} <span className="text-sm text-gold">ج.م</span>
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gold text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-glow transition-all glow-effect disabled:opacity-50"
          >
            {loading ? "جاري إرسال الطلب..." : "تأكيد وإرسال الطلب"}
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="lg:col-span-2 bg-surface border border-white/10 rounded-3xl relative overflow-hidden hidden lg:block shadow-xl">
        <div className="absolute inset-0 bg-[#0A0A0A] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/80 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl flex flex-col items-center text-center max-w-sm shadow-2xl">
            <MapPin className="w-8 h-8 text-gold mb-2 animate-bounce" />
            <h3 className="font-bold mb-1">الخريطة التفاعلية لتتبع المسار</h3>
            <p className="text-xs text-muted mb-3">
              من {pickupAddress || "نقطة الاستلام"} ⇢ إلى {dropoffAddress || "نقطة التسليم"}
            </p>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-gold animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Mock Route Line */}
        <svg className="absolute inset-0 w-full h-full z-0" style={{ filter: "drop-shadow(0 0 8px rgba(255,215,0,0.5))" }}>
          <path
            d="M 200 400 Q 400 200 600 300 T 800 100"
            fill="transparent"
            stroke="#D4AF37"
            strokeWidth="4"
            strokeDasharray="8 8"
            className="animate-[dash_20s_linear_infinite]"
          />
        </svg>
      </div>
    </div>
  );
}

