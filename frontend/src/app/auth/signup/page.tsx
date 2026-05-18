"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role')?.toUpperCase() || "CUSTOMER";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    role: initialRole,
  });

  useEffect(() => {
    const roleParam = searchParams.get('role')?.toUpperCase();
    if (roleParam && ["CUSTOMER", "DRIVER", "BUSINESS"].includes(roleParam)) {
      setFormData((prev) => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      const role = res.data.user.role;
      switch (role) {
        case 'DRIVER': router.push('/driver'); break;
        case 'BUSINESS': router.push('/business'); break;
        default: router.push('/customer'); break;
      }
    } catch (error) {
      console.error("Signup failed", error);
      alert("فشل التسجيل. ربما رقم الهاتف مستخدم بالفعل.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl mix-blend-screen opacity-50"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-black text-white tracking-tighter mb-2 hover:opacity-80 transition-opacity">
            وين<span className="text-gold">الطلب</span>
          </Link>
          <p className="text-sm text-muted">إنشاء حساب جديد</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">الاسم الأول</label>
              <input 
                name="firstName"
                onChange={handleChange}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">الاسم الأخير</label>
              <input 
                name="lastName"
                onChange={handleChange}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">رقم الهاتف</label>
            <input 
              name="phone"
              type="tel"
              onChange={handleChange}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold transition-all text-right"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">كلمة المرور</label>
            <input 
              name="password"
              type="password"
              onChange={handleChange}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold transition-all text-right"
              dir="ltr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">نوع الحساب</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-gold transition-all"
            >
              <option value="CUSTOMER">عميل</option>
              <option value="DRIVER">سائق</option>
              <option value="BUSINESS">شركة / أعمال</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold-glow transition-all glow-effect mt-6 group disabled:opacity-50"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
            {!loading && <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted">
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/login" className="text-gold hover:underline font-bold">
            تسجيل الدخول
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-gold">جاري التحميل...</div>}>
      <SignupForm />
    </Suspense>
  );
}

