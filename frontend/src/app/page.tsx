"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, Package, MapPin, Truck, ShieldCheck, Clock, Zap, 
  Briefcase, UserCheck, Phone, Mail, CheckCircle2, ChevronLeft, 
  Building2, Star, Send, PhoneCall, Check, Navigation, Award
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const [activeRegion, setActiveRegion] = useState(0);

  const coverageRegions = [
    {
      name: "القاهرة الكبرى",
      cities: ["القاهرة", "الجيزة", "القاهرة الجديدة", "الشيخ زايد", "6 أكتوبر", "المعادي", "مصر الجديدة", "الشروق"],
      time: "نفس اليوم (2-4 ساعات)",
      desc: "تغطية شاملة لجميع أحياء القاهرة الكبرى مع خدمة التوصيل الفوري والشحن السريع في نفس اليوم.",
      activeCaptains: "+650 كابتن"
    },
    {
      name: "الإسكندرية والساحل",
      cities: ["الإسكندرية", "برج العرب", "الساحل الشمالي", "العلمين الجديدة", "سموحة", "سيدي بشر"],
      time: "24 ساعة (توصيل سريع)",
      desc: "رحلات منتظمة يومياً بين القاهرة والإسكندرية مع توصيل داخل المحافظة خلال ساعات معدودة.",
      activeCaptains: "+250 كابتن"
    },
    {
      name: "محافظات الدلتا",
      cities: ["طنطا", "المنصورة", "الزقازيق", "بنها", "دمياط", "شبين الكوم", "دمنهور"],
      time: "24 - 48 ساعة",
      desc: "شبكة توزيع واسعة ومجهزة تغطي كافة مدن ومراكز الوجه البحري بأعلى معايير الأمان.",
      activeCaptains: "+320 كابتن"
    },
    {
      name: "صعيد مصر والبحر الأحمر",
      cities: ["أسيوط", "سوهاج", "المنيا", "الفيوم", "بني سويف", "الغردقة", "شرم الشيخ"],
      time: "48 - 72 ساعة",
      desc: "خطوط شحن مباشرة ومنتظمة إلى كافة محافظات الوجه القبلي والمدن الساحلية.",
      activeCaptains: "+180 كابتن"
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactForm({ name: "", phone: "", email: "", message: "" });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-gold selection:text-black font-arabic">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-background/85 backdrop-blur-lg shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black text-white tracking-tighter flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center shadow-lg shadow-gold/20">
              <Package className="w-5 h-5 text-black" />
            </div>
            <span>وين<span className="text-gold">الطلب</span></span>
          </motion.div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-bold text-muted">
            <Link href="#services" className="hover:text-gold transition-colors">الخدمات</Link>
            <Link href="#coverage" className="hover:text-gold transition-colors">مناطق التغطية</Link>
            <Link href="#how-it-works" className="hover:text-gold transition-colors">كيف نعمل</Link>
            <Link href="#business" className="hover:text-gold transition-colors">للأعمال</Link>
            <Link href="#driver-join" className="hover:text-gold transition-colors">انضم كسائق</Link>
            <Link href="#contact" className="hover:text-gold transition-colors">اتصل بنا</Link>
            <Link href="/tracking" className="hover:text-gold transition-colors flex items-center gap-1.5 text-gold bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20">
              <Package className="w-4 h-4" /> تتبع الشحنة
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link href="/auth/login" className="text-sm font-bold text-white hover:text-gold transition-colors px-4 py-2">
              تسجيل الدخول
            </Link>
            <Link href="/auth/signup" className="bg-gold text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gold/90 transition-all glow-effect shadow-lg shadow-gold/20">
              حساب جديد
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-gold/15 via-background to-background"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-4 py-1.5 rounded-full text-xs font-bold mb-8 glow-effect">
              <Zap className="w-4 h-4" /> المنصة اللوجستية الأسرع نمواً في التوصيل السريع
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
              طلبك... <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#FFD700] to-yellow-200">يوصل أسرع</span>
            </h1>
            <p className="text-lg text-muted mb-10 max-w-lg leading-relaxed font-normal">
              المنصة اللوجستية الأسرع والأكثر أماناً. 
              سواء كنت فرداً أو شركة، نوفر لك تجربة توصيل استثنائية مع تتبع حي لحظي وإدارة متكاملة لطلباتك.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/customer/request" className="bg-gold text-black px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold/90 transition-all glow-effect shadow-xl shadow-gold/20 group">
                اطلب مندوب الآن
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link href="/tracking" className="bg-surface border border-white/10 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                تتبع شحنتك
                <Package className="w-5 h-5 text-gold" />
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white mb-1">24/7</span>
                <span className="text-xs text-muted">خدمة متواصلة</span>
              </div>
              <div className="flex flex-col border-r border-white/5 pr-6">
                <span className="text-3xl font-black text-gold mb-1">+1000</span>
                <span className="text-xs text-muted">مندوب متاح</span>
              </div>
              <div className="flex flex-col border-r border-white/5 pr-6">
                <span className="text-3xl font-black text-white mb-1">99.8%</span>
                <span className="text-xs text-muted">نسبة التوصيل الناجح</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative h-[500px] w-full rounded-3xl border border-white/10 bg-surface/50 backdrop-blur-3xl overflow-hidden flex items-center justify-center shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent"></div>
            
            {/* Animated UI Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 right-10 bg-surface border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 z-20"
            >
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-gold" />
              </div>
              <div>
                <div className="text-xs text-muted">تم استلام الطلب</div>
                <div className="text-sm font-bold text-white">المعادي، القاهرة</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute bottom-20 left-10 bg-surface border border-white/10 p-4 rounded-2xl shadow-2xl flex flex-col gap-2 z-20 w-48"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted">الوقت المتوقع</span>
                <span className="text-xs font-bold text-gold">15 دقيقة</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "70%" }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="h-full bg-gold glow-effect"
                ></motion.div>
              </div>
            </motion.div>

            {/* Central glowing element */}
            <div className="relative w-64 h-64 rounded-full border border-gold/20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gold/5 animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="w-48 h-48 rounded-full border border-gold/40 flex items-center justify-center bg-background/80 backdrop-blur-sm shadow-xl shadow-gold/10">
                <Package className="w-16 h-16 text-gold drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 relative bg-surface/30 border-y border-white/5">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gold mb-3">الخدمات اللوجستية</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-white mb-6">حلول شحن وتوصيل تناسب جميع احتياجاتك</h3>
            <p className="text-muted leading-relaxed">
              نجمع بين أحدث التقنيات وأسرع شبكة مندوبين لنقدم لك تجربة شحن لا مثيل لها، من الطرود الفردية وحتى إدارة شحنات المتاجر الكبرى.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-surface/80 border border-white/10 rounded-3xl p-8 hover:border-gold/40 transition-all hover:-translate-y-2 group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full -z-10 group-hover:bg-gold/10 transition-colors"></div>
              <div className="w-14 h-14 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-gold" />
              </div>
              <h4 className="text-xl font-black text-white mb-3">الطرود الفورية (ساعتين)</h4>
              <p className="text-sm text-muted leading-relaxed mb-6">
                أسرع خدمة توصيل في نفس اليوم للطرود العاجلة والمستندات الهامة داخل المدينة مع تتبع مباشر.
              </p>
              <ul className="space-y-2 text-xs font-medium text-muted/90 border-t border-white/5 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /> استلام من باب المنزل</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /> تأمين شامل للشحنة</li>
              </ul>
            </div>

            <div className="bg-surface/80 border border-white/10 rounded-3xl p-8 hover:border-gold/40 transition-all hover:-translate-y-2 group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full -z-10 group-hover:bg-gold/10 transition-colors"></div>
              <div className="w-14 h-14 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-7 h-7 text-gold" />
              </div>
              <h4 className="text-xl font-black text-white mb-3">حلول المتاجر (COD)</h4>
              <p className="text-sm text-muted leading-relaxed mb-6">
                إدارة متكاملة لطلبات المتاجر الإلكترونية مع تحصيل الدفع عند الاستلام وإيداع سريع للأرباح.
              </p>
              <ul className="space-y-2 text-xs font-medium text-muted/90 border-t border-white/5 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /> تحصيل سريع للأموال</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /> لوحة تحكم وإحصائيات متطورة</li>
              </ul>
            </div>

            <div className="bg-surface/80 border border-white/10 rounded-3xl p-8 hover:border-gold/40 transition-all hover:-translate-y-2 group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full -z-10 group-hover:bg-gold/10 transition-colors"></div>
              <div className="w-14 h-14 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7 text-gold" />
              </div>
              <h4 className="text-xl font-black text-white mb-3">الشحنات الثقيلة والتجارية</h4>
              <p className="text-sm text-muted leading-relaxed mb-6">
                نقل البضائع والشحنات الكبيرة بين المستودعات والفروع بأسطول سيارات نقل مجهزة وآمنة.
              </p>
              <ul className="space-y-2 text-xs font-medium text-muted/90 border-t border-white/5 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /> سيارات نقل متعددة الأحجام</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /> أسعار خاصة للعقود التجارية</li>
              </ul>
            </div>

            <div className="bg-surface/80 border border-white/10 rounded-3xl p-8 hover:border-gold/40 transition-all hover:-translate-y-2 group shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full -z-10 group-hover:bg-gold/10 transition-colors"></div>
              <div className="w-14 h-14 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-gold" />
              </div>
              <h4 className="text-xl font-black text-white mb-3">توصيل خاص VIP</h4>
              <p className="text-sm text-muted leading-relaxed mb-6">
                خدمة مخصصة للشحنات الحساسة والعالية القيمة مع مندوب مخصص وحماية أمنية مضاعفة.
              </p>
              <ul className="space-y-2 text-xs font-medium text-muted/90 border-t border-white/5 pt-4">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /> أولوية قصوى بالتوصيل</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-gold" /> سرية تامة وتوثيق استلام يدوي</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Areas Section */}
      <section id="coverage" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gold mb-3">شبكة التغطية</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-white mb-6">تغطية واسعة تصلك أينما كنت</h3>
            <p className="text-muted leading-relaxed">
              أسطولنا يغطي كافة المحافظات والمدن الرئيسية برحلات يومية وشبكة توزيع تضمن سرعة وصول شحناتك.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {/* Interactive Region Selector */}
            <div className="space-y-4 lg:col-span-1">
              {coverageRegions.map((region, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveRegion(idx)}
                  className={`w-full text-right p-6 rounded-2xl border transition-all flex items-center justify-between ${
                    activeRegion === idx 
                      ? "bg-gold/10 border-gold text-white glow-effect" 
                      : "bg-surface border-white/5 text-muted hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="font-black text-lg mb-1 flex items-center gap-2">
                      <MapPin className={`w-5 h-5 ${activeRegion === idx ? "text-gold" : "text-muted"}`} />
                      {region.name}
                    </div>
                    <div className="text-xs opacity-80">{region.time}</div>
                  </div>
                  <ChevronLeft className={`w-5 h-5 transition-transform ${activeRegion === idx ? "text-gold -translate-x-1" : "opacity-40"}`} />
                </button>
              ))}
            </div>

            {/* Region Details Display */}
            <div className="lg:col-span-2 bg-surface/80 border border-white/10 rounded-3xl p-8 lg:p-12 relative overflow-hidden min-h-[400px] flex flex-col justify-between">
              <div className="absolute top-0 left-0 w-72 h-72 bg-gold/5 rounded-br-full -z-10"></div>
              
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
                  <div>
                    <span className="text-xs font-bold px-3 py-1 bg-gold/20 text-gold rounded-full mb-2 inline-block">نشط الآن</span>
                    <h4 className="text-3xl font-black text-white">{coverageRegions[activeRegion].name}</h4>
                  </div>
                  <div className="flex items-center gap-3 bg-background/80 px-5 py-3 rounded-2xl border border-white/5">
                    <Truck className="w-6 h-6 text-gold" />
                    <div>
                      <div className="text-xs text-muted">الكباتن المتاحين</div>
                      <div className="text-sm font-bold text-white">{coverageRegions[activeRegion].activeCaptains}</div>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-muted mb-8 leading-relaxed font-normal">
                  {coverageRegions[activeRegion].desc}
                </p>

                <div className="mb-8">
                  <h5 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-gold" /> أهم المدن والمناطق المغطاة:
                  </h5>
                  <div className="flex flex-wrap gap-2.5">
                    {coverageRegions[activeRegion].cities.map((city, cIdx) => (
                      <span key={cIdx} className="bg-background border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:border-gold/50 transition-colors">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-muted">
                  هل تبحث عن تغطية لمدينة أخرى؟
                </div>
                <Link href="#contact" className="text-gold font-bold hover:underline flex items-center gap-1.5 text-sm">
                  تواصل مع خدمة العملاء للتغطية المخصصة <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-surface/30 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gold mb-3">آلية العمل</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-white mb-6">4 خطوات بسيطة لتوصيل شحنتك</h3>
            <p className="text-muted leading-relaxed">
              صممنا نظامنا ليكون الأسهل والأسرع، من لحظة إدخال تفاصيل الطلب وحتى وصوله لباب المستلم.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="bg-surface border border-white/10 rounded-3xl p-8 relative hover:border-gold/40 transition-all">
              <div className="absolute -top-6 right-8 w-12 h-12 bg-gold text-black font-black text-xl rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20 glow-effect">
                1
              </div>
              <div className="mt-4 mb-6">
                <Package className="w-10 h-10 text-gold" />
              </div>
              <h4 className="text-xl font-black text-white mb-3">سجل الشحنة</h4>
              <p className="text-sm text-muted leading-relaxed font-normal">
                أدخل تفاصيل الشحنة وعناوين الاستلام والتسليم عبر موقعنا أو لوحة تحكم الأعمال.
              </p>
            </div>

            <div className="bg-surface border border-white/10 rounded-3xl p-8 relative hover:border-gold/40 transition-all">
              <div className="absolute -top-6 right-8 w-12 h-12 bg-gold text-black font-black text-xl rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20 glow-effect">
                2
              </div>
              <div className="mt-4 mb-6">
                <Truck className="w-10 h-10 text-gold" />
              </div>
              <h4 className="text-xl font-black text-white mb-3">استلام فوري</h4>
              <p className="text-sm text-muted leading-relaxed font-normal">
                يتوجه إليك أقرب كابتن متاح لاستلام الشحنة وتأكيد الكود الأمني في النظام.
              </p>
            </div>

            <div className="bg-surface border border-white/10 rounded-3xl p-8 relative hover:border-gold/40 transition-all">
              <div className="absolute -top-6 right-8 w-12 h-12 bg-gold text-black font-black text-xl rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20 glow-effect">
                3
              </div>
              <div className="mt-4 mb-6">
                <MapPin className="w-10 h-10 text-gold" />
              </div>
              <h4 className="text-xl font-black text-white mb-3">تتبع حي ومباشر</h4>
              <p className="text-sm text-muted leading-relaxed font-normal">
                تابع حركة الكابتن على الخريطة لحظة بلحظة مع إشعارات مستمرة حتى الوصول.
              </p>
            </div>

            <div className="bg-surface border border-white/10 rounded-3xl p-8 relative hover:border-gold/40 transition-all">
              <div className="absolute -top-6 right-8 w-12 h-12 bg-gold text-black font-black text-xl rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20 glow-effect">
                4
              </div>
              <div className="mt-4 mb-6">
                <CheckCircle2 className="w-10 h-10 text-gold" />
              </div>
              <h4 className="text-xl font-black text-white mb-3">توصيل وتحصيل</h4>
              <p className="text-sm text-muted leading-relaxed font-normal">
                تسليم آمن باليد مع تحصيل مبالغ COD وإيداعها مباشرة في محفظتك الإلكترونية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business CTA Banner */}
      <section id="business" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gold/20 via-surface to-background border border-gold/30 rounded-3xl p-8 lg:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="grid lg:grid-cols-3 gap-12 items-center relative z-10">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold px-4 py-1.5 rounded-full text-xs font-bold mb-6">
                  <Building2 className="w-4 h-4" /> للمتاجر الإلكترونية والشركات
                </div>
                <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                  شريكك اللوجستي المثالي لنمو وتوسيع أعمالك
                </h3>
                <p className="text-lg text-muted mb-8 leading-relaxed font-normal max-w-2xl">
                  نقدم للشركات والمتاجر لوحة تحكم متطورة لإدارة مئات الطلبات بضغطة زر، أسعار شحن مخفضة للكميات، وتحصيل سريع وفوري لأموال الدفع عند الاستلام COD.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                  <div className="flex items-center gap-3 text-sm font-bold text-white">
                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0" /> أسعار شحن تنافسية للعقود
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-white">
                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0" /> إيداع أسبوعي أو فوري للـ COD
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-white">
                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0" /> ربط API مباشر مع متجرك
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-white">
                    <CheckCircle2 className="w-5 h-5 text-gold shrink-0" /> مدير حسابات مخصص لدعمك 24/7
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/auth/signup?role=BUSINESS" className="bg-gold text-black px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold/90 transition-all glow-effect shadow-xl shadow-gold/20">
                    سجل شركتك الآن
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                  <Link href="#contact" className="bg-background/80 border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all">
                    تواصل مع فريق المبيعات
                  </Link>
                </div>
              </div>

              <div className="bg-background/80 border border-white/10 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl">
                <Award className="w-16 h-16 text-gold mx-auto mb-4" />
                <h4 className="text-2xl font-black text-white mb-2">+500 متجر وشركة</h4>
                <p className="text-sm text-muted mb-6">يعتمدون على وين الطلب في توصيل منتجاتهم لعملائهم يومياً</p>
                <div className="border-t border-white/10 pt-6">
                  <div className="text-xs text-gold font-bold uppercase mb-1">نسبة رضا العملاء</div>
                  <div className="text-4xl font-black text-white flex items-center justify-center gap-1">
                    4.9 <Star className="w-6 h-6 text-gold fill-gold" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Driver Join CTA Banner */}
      <section id="driver-join" className="py-24 px-6 bg-surface/40 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-4 py-1.5 rounded-full text-xs font-bold mb-6">
                <UserCheck className="w-4 h-4" /> انضم لأسطولنا
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                انضم لأسطول كباتن وين الطلب وحقق دخلاً مميزاً
              </h3>
              <p className="text-lg text-muted mb-8 leading-relaxed font-normal">
                كن شريكاً في نجاحنا واستفد من مرونة كاملة في ساعات العمل، عوائد مالية مجزية أسبوعياً، ومكافآت مستمرة للكباتن المتميزين.
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 mt-1">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h5 className="text-lg font-bold text-white mb-1">مرونة تامة في أوقات العمل</h5>
                    <p className="text-sm text-muted">اختر الوقت الذي يناسبك للعمل دون أي قيود أو ساعات ملزمة.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h5 className="text-lg font-bold text-white mb-1">أعلى عمولة في السوق</h5>
                    <p className="text-sm text-muted">حقق دخلاً متزايداً مع صرف منتظم للأرباح والمكافآت.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0 mt-1">
                    <PhoneCall className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h5 className="text-lg font-bold text-white mb-1">دعم فني متواصل لك على مدار الساعة</h5>
                    <p className="text-sm text-muted">فريق دعم الكباتن متاح دائماً لمساعدتك وحل أي مشكلة أثناء التوصيل.</p>
                  </div>
                </div>
              </div>

              <Link href="/auth/signup?role=DRIVER" className="bg-gold text-black px-8 py-4 rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:bg-gold/90 transition-all glow-effect shadow-xl shadow-gold/20">
                سجل كسائق الآن
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent rounded-3xl blur-2xl"></div>
              <div className="bg-surface border border-white/10 rounded-3xl p-8 lg:p-12 relative z-10 shadow-2xl">
                <h4 className="text-2xl font-black text-white mb-6">متطلبات الانضمام السريعة</h4>
                <ul className="space-y-4 text-muted/90 font-medium">
                  <li className="flex items-center gap-3 bg-background p-4 rounded-2xl border border-white/5">
                    <Check className="w-5 h-5 text-gold shrink-0" /> رخصة قيادة سارية المفعول
                  </li>
                  <li className="flex items-center gap-3 bg-background p-4 rounded-2xl border border-white/5">
                    <Check className="w-5 h-5 text-gold shrink-0" /> سيارة، دراجة نارية، أو فان بحالة جيدة
                  </li>
                  <li className="flex items-center gap-3 bg-background p-4 rounded-2xl border border-white/5">
                    <Check className="w-5 h-5 text-gold shrink-0" /> هاتف ذكي يدعم نظام تحديد المواقع GPS
                  </li>
                  <li className="flex items-center gap-3 bg-background p-4 rounded-2xl border border-white/5">
                    <Check className="w-5 h-5 text-gold shrink-0" /> حسن السيرة والسلوك والالتزام بالمواعيد
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 relative border-t border-white/5">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gold mb-3">تواصل معنا</h2>
              <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                نحن هنا لمساعدتك والإجابة على كافة استفساراتك
              </h3>
              <p className="text-lg text-muted mb-12 leading-relaxed font-normal">
                سواء كان لديك استفسار عن شحنتك، رغبة في عقد شراكة تجارية، أو اقتراح لتطوير الخدمة، يسعدنا تواصلك معنا في أي وقت.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-6 bg-surface/60 border border-white/10 p-6 rounded-2xl shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Phone className="w-7 h-7 text-gold" />
                  </div>
                  <div>
                    <div className="text-xs text-muted mb-1 font-bold">الدعم الهاتفي (24/7)</div>
                    <div className="text-xl font-black text-white" dir="ltr">+20 100 000 0000</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-surface/60 border border-white/10 p-6 rounded-2xl shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Mail className="w-7 h-7 text-gold" />
                  </div>
                  <div>
                    <div className="text-xs text-muted mb-1 font-bold">البريد الإلكتروني</div>
                    <div className="text-xl font-bold text-white">support@wenaltalab.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 bg-surface/60 border border-white/10 p-6 rounded-2xl shadow-lg">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <MapPin className="w-7 h-7 text-gold" />
                  </div>
                  <div>
                    <div className="text-xs text-muted mb-1 font-bold">المقر الرئيسي</div>
                    <div className="text-xl font-bold text-white">المعادي، القاهرة، جمهورية مصر العربية</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-surface/80 border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative">
              <h4 className="text-2xl font-black text-white mb-6">أرسل رسالة مباشرة</h4>
              
              {contactSent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gold/10 border border-gold text-gold p-8 rounded-2xl text-center space-y-3"
                >
                  <CheckCircle2 className="w-12 h-12 text-gold mx-auto" />
                  <h5 className="text-xl font-bold text-white">تم إرسال رسالتك بنجاح!</h5>
                  <p className="text-sm text-muted">سيتواصل معك فريق خدمة العملاء في أقرب وقت ممكن.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">الاسم الكامل</label>
                    <input 
                      type="text" 
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-gold transition-all"
                      placeholder="أدخل اسمك"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">رقم الهاتف</label>
                      <input 
                        type="tel" 
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-gold transition-all text-right"
                        placeholder="01xxxxxxxxx"
                        dir="ltr"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">البريد الإلكتروني</label>
                      <input 
                        type="email" 
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-gold transition-all text-right"
                        placeholder="name@example.com"
                        dir="ltr"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">نص الرسالة</label>
                    <textarea 
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-gold transition-all resize-none"
                      placeholder="كيف يمكننا مساعدتك؟"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gold text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gold/90 transition-all glow-effect mt-6 group"
                  >
                    إرسال الرسالة
                    <Send className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface/90 border-t border-white/10 pt-16 pb-12 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block text-3xl font-black text-white tracking-tighter flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center shadow-lg shadow-gold/20">
                <Package className="w-5 h-5 text-black" />
              </div>
              <span>وين<span className="text-gold">الطلب</span></span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-sm font-normal">
              المنصة اللوجستية المتطورة لتوصيل الشحنات والطرود بسرعة وأمان. نربط الأفراد والمتاجر بشبكة واسعة من الكباتن المحترفين على مدار الساعة.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-muted font-bold">جميع الأنظمة تعمل بكفاءة 100%</span>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-lg mb-6">روابط سريعة</h5>
            <ul className="space-y-3.5 text-sm font-medium text-muted">
              <li><Link href="#services" className="hover:text-gold transition-colors">الخدمات</Link></li>
              <li><Link href="#coverage" className="hover:text-gold transition-colors">مناطق التغطية</Link></li>
              <li><Link href="#how-it-works" className="hover:text-gold transition-colors">آلية العمل</Link></li>
              <li><Link href="#contact" className="hover:text-gold transition-colors">تواصل معنا</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-lg mb-6">الحسابات والأعمال</h5>
            <ul className="space-y-3.5 text-sm font-medium text-muted">
              <li><Link href="/auth/login" className="hover:text-gold transition-colors">تسجيل الدخول</Link></li>
              <li><Link href="/auth/signup" className="hover:text-gold transition-colors">إنشاء حساب عميل</Link></li>
              <li><Link href="/auth/signup?role=BUSINESS" className="hover:text-gold transition-colors">سجل شركتك / متجرك</Link></li>
              <li><Link href="/auth/signup?role=DRIVER" className="hover:text-gold transition-colors">انضم لفريق السائقين</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-lg mb-6">تتبع الطلبات</h5>
            <p className="text-xs text-muted leading-relaxed mb-4">
              يمكنك تتبع حالة شحنتك وموقع المندوب مباشرة باستخدام رقم التتبع الخاص بك.
            </p>
            <Link href="/tracking" className="inline-flex items-center gap-2 bg-gold text-black px-5 py-3 rounded-xl font-bold text-sm hover:bg-gold/90 transition-all glow-effect">
              <Package className="w-4 h-4" /> تتبع شحنتك الآن
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-muted">
          <div>
            جميع الحقوق محفوظة © 2026 وين الطلب.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-gold transition-colors cursor-pointer">سياسة الخصوصية</span>
            <span className="hover:text-gold transition-colors cursor-pointer">الشروط والأحكام</span>
            <span className="hover:text-gold transition-colors cursor-pointer">الأسئلة الشائعة</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

