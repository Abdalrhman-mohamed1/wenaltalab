"use client";

import { motion } from "framer-motion";
import { Layers, Plus, Trash2, CheckCircle, AlertCircle, MapPin, Navigation, User, Phone, Package, Send } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface BulkOrderItem {
  pickupAddress: string;
  dropoffAddress: string;
  receiverName: string;
  receiverPhone: string;
  packageType: string;
  packageDetails: string;
  notes: string;
  priority: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
}

const initialItem: BulkOrderItem = {
  pickupAddress: "المركز الرئيسي للشركة - التجمع",
  dropoffAddress: "",
  receiverName: "",
  receiverPhone: "",
  packageType: "طرد قياسي",
  packageDetails: "طرد تجاري مغلف",
  notes: "توصيل سريع للعميل",
  priority: "STANDARD",
};

export default function BulkOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<BulkOrderItem[]>([{ ...initialItem }]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const addRow = () => {
    setOrders((prev) => [...prev, { ...initialItem }]);
  };

  const removeRow = (index: number) => {
    if (orders.length <= 1) return;
    setOrders((prev) => prev.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: keyof BulkOrderItem, value: string) => {
    setOrders((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleBulkSubmit = async () => {
    // Validate
    for (let i = 0; i < orders.length; i++) {
      const o = orders[i];
      if (!o.pickupAddress || !o.dropoffAddress || !o.receiverName || !o.receiverPhone) {
        setError(`يرجى استكمال جميع الحقول المطلوبة (موقع الاستلام، موقع التسليم، اسم ورقم المستلم) في الصف رقم ${i + 1}`);
        return;
      }
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload = orders.map((o) => ({
        ...o,
        pickupLat: 30.0444 + (Math.random() - 0.5) * 0.05,
        pickupLng: 31.2357 + (Math.random() - 0.5) * 0.05,
        dropoffLat: 30.0131 + (Math.random() - 0.5) * 0.05,
        dropoffLng: 31.4243 + (Math.random() - 0.5) * 0.05,
      }));

      const res = await api.post("/business/orders/bulk", { orders: payload });
      setSuccess(true);
      alert(`تم إنشاء عدد ${res.data?.count || orders.length} طلبات توصيل مجمعة بنجاح!`);
      router.push("/business/orders");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "حدث خطأ أثناء إرسال الطلبات المجمعة. تأكد من تسجيل الدخول بحساب شركة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Layers className="text-gold w-7 h-7" />
            إنشاء طلبات توصيل مجمعة (Bulk Delivery Creation)
          </h1>
          <p className="text-xs text-muted mt-1">
            أدخل تفاصيل شحنات متعددة دفعة واحدة لإرسالها لأسطول المندوبين بضغطة زر واحدة
          </p>
        </div>
        <button
          onClick={addRow}
          className="bg-gold hover:bg-gold-glow text-black font-black px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all glow-effect text-xs shadow-lg"
        >
          <Plus className="w-4 h-4" />
          إضافة شحنة جديدة للجدول
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500 text-green-400 text-sm font-bold flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>تم إرسال جميع الشحنات بنجاح إلى النظام وتوزيعها على المندوبين!</span>
        </div>
      )}

      <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-sm font-bold text-white">جدول الشحنات ({orders.length} شحنة)</span>
          <span className="text-xs text-muted font-mono">يتم احتساب الأجرة والمسافة تلقائياً لكل شحنة</span>
        </div>

        <div className="space-y-6">
          {orders.map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className="p-6 rounded-2xl bg-background/80 border border-white/10 space-y-4 shadow-md relative"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                <span className="font-black text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                  شحنة رقم #{i + 1}
                </span>
                {orders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف الشحنة
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    موقع الاستلام *
                  </label>
                  <input
                    type="text"
                    value={item.pickupAddress}
                    onChange={(e) => updateField(i, "pickupAddress", e.target.value)}
                    placeholder="عنوان الاستلام..."
                    className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted font-bold flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-red-500" />
                    موقع التسليم النهائي *
                  </label>
                  <input
                    type="text"
                    value={item.dropoffAddress}
                    onChange={(e) => updateField(i, "dropoffAddress", e.target.value)}
                    placeholder="وجهة التسليم (مثال: المعادي)..."
                    className="w-full bg-surface border border-gold/40 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold shadow-[0_0_10px_rgba(255,215,0,0.05)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted font-bold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    اسم المستلم *
                  </label>
                  <input
                    type="text"
                    value={item.receiverName}
                    onChange={(e) => updateField(i, "receiverName", e.target.value)}
                    placeholder="اسم العميل المستلم..."
                    className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted font-bold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    رقم هاتف المستلم *
                  </label>
                  <input
                    type="tel"
                    value={item.receiverPhone}
                    onChange={(e) => updateField(i, "receiverPhone", e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold text-left"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted font-bold flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-purple-400" />
                    نوع الشحنة
                  </label>
                  <select
                    value={item.packageType}
                    onChange={(e) => updateField(i, "packageType", e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold h-9"
                  >
                    <option value="طرد قياسي">طرد قياسي</option>
                    <option value="مستندات وأوراق">مستندات وأوراق</option>
                    <option value="أجهزة إلكترونية">أجهزة إلكترونية</option>
                    <option value="أطعمة ومشروبات">أطعمة ومشروبات</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted font-bold">تفاصيل المحتوى (Package Details)</label>
                  <input
                    type="text"
                    value={item.packageDetails}
                    onChange={(e) => updateField(i, "packageDetails", e.target.value)}
                    placeholder="وصف تفصيلي لمحتوى الشحنة..."
                    className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted font-bold">أولوية التوصيل (Priority)</label>
                  <select
                    value={item.priority}
                    onChange={(e) => updateField(i, "priority", e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold h-9 font-bold"
                  >
                    <option value="STANDARD">قياسي (Standard)</option>
                    <option value="EXPRESS">عاجل (+25 ج.م Express)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted font-bold">ملاحظات التوصيل</label>
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateField(i, "notes", e.target.value)}
                    placeholder="ملاحظات للمندوب..."
                    className="w-full bg-surface border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-gold h-9"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-muted flex items-center gap-2">
            <span className="w-2 h-2 bg-gold rounded-full"></span>
            <span>عدد الطلبات المجهزة للإرسال: <strong className="text-white font-bold">{orders.length} شحنة</strong></span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={addRow}
              className="px-5 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 font-bold rounded-xl text-xs transition-all w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-gold" />
              إضافة سطر إضافي
            </button>
            <button
              onClick={handleBulkSubmit}
              disabled={loading}
              className="px-8 py-3.5 bg-gold hover:bg-gold-glow text-black font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all glow-effect w-full sm:w-auto disabled:opacity-50 shadow-xl"
            >
              <Send className="w-4 h-4" />
              {loading ? "جاري المعالجة والإرسال..." : `اعتماد وإرسال (${orders.length}) طلبات مجمعة`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
