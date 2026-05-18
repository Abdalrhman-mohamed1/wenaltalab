"use client";

import { motion } from "framer-motion";
import { UserCheck, Briefcase, Mail, Phone, Save, AlertCircle, CheckCircle, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

export default function BusinessProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        companyName: (user as any).companyName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: (user as any).phone || "",
        email: (user as any).email || "",
      });
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await api.put("/business/profile", formData);
      setSuccess(true);
      // Update local storage user data if needed
      const existingUserStr = localStorage.getItem("user");
      if (existingUserStr) {
        const u = JSON.parse(existingUserStr);
        const updated = { ...u, ...res.data };
        localStorage.setItem("user", JSON.stringify(updated));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "تعذر تحديث الملف التعريفي للشركة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <UserCheck className="text-gold w-7 h-7" />
          الملف التعريفي للشركة (Company Profile)
        </h1>
        <p className="text-xs text-muted mt-1">تحديث بيانات المؤسسة ومعلومات الاتصال المباشرة</p>
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
          <span>تم حفظ وتحديث بيانات الشركة بنجاح!</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 bg-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="grid sm:grid-cols-2 gap-6 relative z-10">
          <div className="col-span-2 space-y-2">
            <label className="text-xs font-bold text-muted flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold" />
              اسم الشركة / المؤسسة *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="مثال: شركة النور للاستيراد والتصدير..."
              required
              className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-gold shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gold" />
              الاسم الأول لمدير الحساب *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="الاسم الأول..."
              required
              className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gold" />
              اسم العائلة *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="اسم العائلة..."
              required
              className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold" />
              رقم هاتف الشركة / التواصل *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01xxxxxxxxx"
              required
              className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-gold text-left"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-muted flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold" />
              البريد الإلكتروني للشركة *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="company@example.com"
              required
              className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-gold text-left"
              dir="ltr"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-end z-10 relative">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gold hover:bg-gold-glow text-black font-black rounded-2xl flex items-center gap-2 transition-all glow-effect text-sm disabled:opacity-50 shadow-xl"
          >
            <Save className="w-5 h-5" />
            {loading ? "جاري حفظ التحديثات..." : "حفظ التغييرات في الملف التعريفي"}
          </button>
        </div>
      </form>
    </div>
  );
}
