"use client";

import { motion } from "framer-motion";
import { Settings as SettingsIcon, Save, ShieldCheck, Bell, Database, Globe, DollarSign, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    platformFee: "15",
    baseFare: "20",
    perKmRate: "5",
    expressSurcharge: "25",
    maintenanceMode: false,
    autoAssignDrivers: true,
    smsNotifications: true,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <SettingsIcon className="text-gold w-7 h-7" />
          إعدادات وضوابط المنصة المركزية
        </h1>
        <p className="text-xs text-muted mt-1">
          تعديل تسعيرة التوصيل، عمولة المنصة، وتفعيل أو إيقاف الخدمات التلقائية
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500 text-green-400 text-sm font-bold flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>تم حفظ تحديثات إعدادات المنصة بنجاح وتطبيقها على جميع العمليات الحية!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 bg-gold/5 rounded-full filter blur-3xl pointer-events-none"></div>

        {/* Pricing Settings */}
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-2 text-gold font-black text-base border-b border-white/5 pb-2">
            <DollarSign className="w-5 h-5" />
            <h3>تسعير وعمولات التوصيل (Pricing & Fees)</h3>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted">سعر فتح العداد الأساسي (Base Fare - ج.م)</label>
              <input
                type="number"
                value={settings.baseFare}
                onChange={(e) => setSettings({ ...settings, baseFare: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted">سعر الكيلومتر الواحد (Rate per Km - ج.م)</label>
              <input
                type="number"
                value={settings.perKmRate}
                onChange={(e) => setSettings({ ...settings, perKmRate: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted">علاوة التوصيل العاجل (Express Surcharge - ج.م)</label>
              <input
                type="number"
                value={settings.expressSurcharge}
                onChange={(e) => setSettings({ ...settings, expressSurcharge: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted">نسبة عمولة المنصة من المناديب (%)</label>
              <input
                type="number"
                value={settings.platformFee}
                onChange={(e) => setSettings({ ...settings, platformFee: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold font-mono"
              />
            </div>
          </div>
        </div>

        {/* Operational Toggles */}
        <div className="space-y-6 relative z-10 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-sky-400 font-black text-base border-b border-white/5 pb-2">
            <Globe className="w-5 h-5" />
            <h3>ضوابط التشغيل التلقائي (Operational Rules)</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-white/5 cursor-pointer hover:border-white/10 transition-all">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>تعيين المناديب الأقرب جغرافياً تلقائياً</span>
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold">موصى به</span>
                </div>
                <div className="text-xs text-muted">توزيع الطلبات فوراً باستخدام لوغاريتم المسافات الذكي</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoAssignDrivers}
                onChange={(e) => setSettings({ ...settings, autoAssignDrivers: e.target.checked })}
                className="w-5 h-5 accent-gold rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-white/5 cursor-pointer hover:border-white/10 transition-all">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-white">إرسال إشعارات SMS فورية للمستلمين عند تحرك المندوب</div>
                <div className="text-xs text-muted">تنبيه العملاء برابط التتبع المباشر عبر رسائل الهاتف</div>
              </div>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                className="w-5 h-5 accent-gold rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/20 cursor-pointer hover:border-red-500/30 transition-all">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-red-400">تفعيل وضع الصيانة وإيقاف استقبال طلبات جديدة</div>
                <div className="text-xs text-red-500/70">تنبيه: سيتم إيقاف الواجهة البرمجية للمستخدمين مؤقتاً</div>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 accent-red-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-end z-10 relative">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gold hover:bg-gold-glow text-black font-black rounded-2xl flex items-center gap-2 transition-all glow-effect text-sm disabled:opacity-50 shadow-xl"
          >
            <Save className="w-5 h-5" />
            {loading ? "جاري الحفظ والتطبيق..." : "حفظ إعدادات المنصة وتطبيقها"}
          </button>
        </div>
      </form>
    </div>
  );
}
