"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { phone, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      const role = res.data.user.role;
      switch (role) {
        case 'ADMIN': router.push('/admin'); break;
        case 'DRIVER': router.push('/driver'); break;
        case 'BUSINESS': router.push('/business'); break;
        default: router.push('/customer'); break;
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("فشل تسجيل الدخول. يرجى التحقق من بياناتك.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl mix-blend-screen opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl mix-blend-screen opacity-50"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black text-white tracking-tighter mb-2 hover:opacity-80 transition-opacity">
            وين<span className="text-gold">الطلب</span>
          </Link>
          <p className="text-sm text-muted">تسجيل الدخول إلى حسابك</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">رقم الهاتف</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-right"
              placeholder="01xxxxxxxxx"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1.5 flex justify-between">
              <span>كلمة المرور</span>
              <Link href="/auth/forgot-password" className="text-gold hover:underline text-xs">نسيت كلمة المرور؟</Link>
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-right"
              placeholder="••••••••"
              dir="ltr"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-glow transition-all glow-effect mt-8 group disabled:opacity-50"
          >
            {loading ? "جاري الدخول..." : "دخول"}
            {!loading && <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted">
          ليس لديك حساب؟{" "}
          <Link href="/auth/signup" className="text-gold hover:underline font-bold">
            سجل الآن
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
