"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Package, MapPin, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickupAddress: "",
    dropoffAddress: "",
    itemDescription: "",
    itemCategory: "PARCEL",
    paymentMethod: "CASH",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/orders', {
        ...formData,
        // Mock coordinates for now
        pickupLat: 30.0444,
        pickupLng: 31.2357,
        dropoffLat: 30.0500,
        dropoffLng: 31.2400,
      });
      // Redirect to tracking page with the new order ID
      router.push(`/tracking/${res.data.id}`);
    } catch (error: any) {
      console.error("Order creation failed", error);
      if (error.response?.status === 401) {
        alert("يرجى تسجيل الدخول أولاً");
        router.push('/auth/login');
      } else {
        alert("فشل إنشاء الطلب. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 pt-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-black text-white">إنشاء طلب جديد</h1>
          <Link href="/dashboard" className="text-muted hover:text-white transition-colors">
            إلغاء
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Addresses */}
          <div className="bg-surface border border-white/10 p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="text-gold w-5 h-5" />
              العناوين
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">عنوان الاستلام</label>
              <input 
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                placeholder="مثال: المعادي، شارع 9"
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">عنوان التسليم</label>
              <input 
                name="dropoffAddress"
                value={formData.dropoffAddress}
                onChange={handleChange}
                placeholder="مثال: مدينة نصر، مكرم عبيد"
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-all"
                required
              />
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-surface border border-white/10 p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Package className="text-gold w-5 h-5" />
              تفاصيل الشحنة
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">وصف الشحنة</label>
              <textarea 
                name="itemDescription"
                value={formData.itemDescription}
                onChange={handleChange}
                placeholder="ماذا تريد أن نرسل لك؟"
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-all resize-none h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">الفئة</label>
              <select 
                name="itemCategory"
                value={formData.itemCategory}
                onChange={handleChange}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-all"
              >
                <option value="PARCEL">طرد</option>
                <option value="FOOD">طعام</option>
                <option value="DOCUMENTS">مستندات</option>
                <option value="SHOPPING">تسوق</option>
              </select>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-surface border border-white/10 p-6 rounded-3xl space-y-4">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CreditCard className="text-gold w-5 h-5" />
              طريقة الدفع
            </h2>
            
            <select 
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition-all"
            >
              <option value="CASH">كاش عند الاستلام</option>
              <option value="CARD">بطاقة ائتمانية</option>
              <option value="WALLET">المحفظة</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-glow transition-all glow-effect mt-8 group disabled:opacity-50"
          >
            {loading ? "جاري الإرسال..." : "تأكيد الطلب"}
            {!loading && <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
}
