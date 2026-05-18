"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Users, Truck, Settings, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { name: "لوحة التحكم", href: "/admin", icon: LayoutDashboard },
  { name: "المستخدمين", href: "/admin/users", icon: Users },
  { name: "المناديب", href: "/admin/drivers", icon: Truck },
  { name: "الشركات والمؤسسات", href: "/admin/businesses", icon: Users },
  { name: "مراقبة الطلبات المباشرة", href: "/admin/orders", icon: Truck },
  { name: "الإعدادات", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <div className="min-h-screen bg-background flex flex-col md:flex-row text-white selection:bg-gold selection:text-black">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-surface z-50">
        <div className="text-xl font-black tracking-tighter">
          وين<span className="text-gold">الطلب</span> <span className="text-xs text-red-500 font-normal">| الإدارة</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2">
          <Menu className="w-6 h-6 text-gold" />
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:sticky top-0 right-0 h-screen w-64 bg-surface border-l border-white/10 z-40 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 hidden md:block border-b border-white/5">
          <div className="text-3xl font-black tracking-tighter mb-1">
            وين<span className="text-gold">الطلب</span>
          </div>
          <div className="text-xs text-red-500 font-bold tracking-widest">لوحة الإدارة</div>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} onClick={() => setSidebarOpen(false)}>
                <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-gold/10 text-gold shadow-[0_0_15px_rgba(255,215,0,0.1)]' : 'text-muted hover:bg-white/5 hover:text-white'}`}>
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={logout} className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-bold">تسجيل الخروج</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      </div>
    </ProtectedRoute>
  );
}
