"use client";

import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  MapPin, 
  DollarSign, 
  User, 
  LogOut,
  Bell,
  Menu,
  CheckCircle2,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { name: "لوحة التحكم", href: "/driver", icon: LayoutDashboard },
  { name: "التوصيلة الحالية", href: "/driver/active", icon: MapPin },
  { name: "الأرباح والتاريخ", href: "/driver/earnings", icon: DollarSign },
  { name: "حسابي والمستندات", href: "/driver/profile", icon: User },
];

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['DRIVER']}>
      <div className="min-h-screen bg-background flex flex-col md:flex-row text-white selection:bg-gold selection:text-black">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-surface z-50">
        <div className="text-xl font-black tracking-tighter">
          وين<span className="text-gold">الطلب</span> <span className="text-xs text-muted font-normal">| كابتن</span>
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
          <div className="text-xs text-muted">بوابة الكابتن</div>
        </div>

        {/* Online Toggle */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between bg-background p-1 rounded-full border border-white/10">
            <button 
              onClick={() => setIsOnline(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold transition-all ${!isOnline ? 'bg-surface text-white shadow-md' : 'text-muted'}`}
            >
              <XCircle className="w-4 h-4" /> غير متاح
            </button>
            <button 
              onClick={() => setIsOnline(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-bold transition-all ${isOnline ? 'bg-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'text-muted'}`}
            >
              <CheckCircle2 className="w-4 h-4" /> متاح الآن
            </button>
          </div>
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
        {/* Topbar for Desktop */}
        <header className="hidden md:flex items-center justify-between p-6 border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <h2 className="text-xl font-bold flex items-center gap-3">
            {NAV_ITEMS.find(i => i.href === pathname)?.name || 'اللوحة'}
            {isOnline && <span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>}
          </h2>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-muted hover:text-gold transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-bold text-white">{user ? `كابتن ${user.firstName}` : 'كابتن'}</div>
                <div className="text-xs text-gold flex items-center justify-end gap-1">★ 4.9</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface border border-gold flex items-center justify-center text-gold font-bold">
                {user ? user.firstName.charAt(0) : 'م'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
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

      {/* Mobile Overlay */}
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
