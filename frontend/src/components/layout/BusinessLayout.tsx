"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Layers,
  BarChart3,
  Package,
  UserCheck,
  LogOut,
  Bell,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { name: "لوحة أعمال الشركات", href: "/business", icon: Briefcase },
  { name: "إنشاء طلبات مجمعة", href: "/business/bulk", icon: Layers },
  { name: "التحليلات والتقارير", href: "/business/analytics", icon: BarChart3 },
  { name: "جميع شحنات الشركة", href: "/business/orders", icon: Package },
  { name: "الملف التعريفي للشركة", href: "/business/profile", icon: UserCheck },
];

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-white selection:bg-gold selection:text-black">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-surface z-50">
        <div className="text-xl font-black tracking-tighter">
          وين<span className="text-gold">الطلب</span> <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded">للأعمال</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2">
          <Menu className="w-6 h-6 text-gold" />
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside
        className={`fixed md:sticky top-0 right-0 h-screen w-64 bg-surface border-l border-white/10 z-40 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 hidden md:block">
          <div className="text-3xl font-black tracking-tighter mb-1">
            وين<span className="text-gold">الطلب</span>
          </div>
          <div className="text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded-full w-fit mt-1 border border-gold/20">
            حساب الشركات والأعمال
          </div>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}>
                <div
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
                    isActive
                      ? "bg-gold text-black shadow-[0_0_20px_rgba(255,215,0,0.3)] font-black"
                      : "text-muted hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm border border-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج من الحساب</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar for Desktop */}
        <header className="hidden md:flex items-center justify-between p-6 border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <h2 className="text-xl font-black text-white">
            {NAV_ITEMS.find((i) => i.href === pathname)?.name || "لوحة أعمال الشركات"}
          </h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-surface border border-white/10 px-4 py-2 rounded-2xl shadow-inner">
              <div className="text-right">
                <div className="text-sm font-bold text-white">{user ? `${user.firstName} ${user.lastName}` : "مدير الشركة"}</div>
                <div className="text-xs text-gold font-semibold">{user?.companyName || "مؤسسة تجارية"}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center text-gold font-black text-lg shadow-md">
                {user?.firstName ? user.firstName[0] : "ش"}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
