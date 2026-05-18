"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl mix-blend-screen opacity-50"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black text-white tracking-tighter mb-2 hover:opacity-80 transition-opacity">
            وين<span className="text-gold">الطلب</span>
          </Link>
          <p className="text-sm text-muted">استعادة كلمة المرور</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <p className="text-white font-medium">تم إرسال رمز الاستعادة</p>
            <p className="text-muted text-sm">يرجى التحقق من هاتفك للحصول على رمز إعادة تعيين كلمة المرور.</p>
            <Link href="/auth/login" className="inline-block mt-4 text-gold hover:underline">
              العودة لتسجيل الدخول
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">رقم الهاتف</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold transition-all text-right"
                placeholder="01xxxxxxxxx"
                dir="ltr"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-glow transition-all glow-effect mt-6 group disabled:opacity-50"
            >
              {loading ? "جاري الإرسال..." : "إرسال رمز الاستعادة"}
              {!loading && <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-muted">
          تذكرت كلمة المرور؟{" "}
          <Link href="/auth/login" className="text-gold hover:underline font-bold">
            تسجيل الدخول
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
