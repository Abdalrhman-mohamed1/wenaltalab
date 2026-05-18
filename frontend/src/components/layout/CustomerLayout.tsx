"use client";

import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  PackagePlus, 
  Clock, 
  Wallet, 
  User, 
  LogOut,
  Bell,
  Menu
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { name: "الرئيسية", href: "/customer", icon: LayoutDashboard },
  { name: "طلب توصيل", href: "/customer/request", icon: PackagePlus },
  { name: "الطلبات السابقة", href: "/customer/orders", icon: Clock },
  { name: "المحفظة", href: "/customer/wallet", icon: Wallet },
  { name: "حسابي", href: "/customer/profile", icon: User },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-white selection:bg-gold selection:text-black">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-surface z-50">
        <div className="text-xl font-black tracking-tighter">
          وين<span className="text-gold">الطلب</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2">
          <Menu className="w-6 h-6 text-gold" />
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:sticky top-0 right-0 h-screen w-64 bg-surface border-l border-white/10 z-40 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 hidden md:block">
          <div className="text-3xl font-black tracking-tighter mb-2">
            وين<span className="text-gold">الطلب</span>
          </div>
          <div className="text-xs text-muted">منصة العميل</div>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2">
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
          <button className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-bold">تسجيل الخروج</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar for Desktop */}
        <header className="hidden md:flex items-center justify-between p-6 border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <h2 className="text-xl font-bold">
            {NAV_ITEMS.find(i => i.href === pathname)?.name || 'لوحة التحكم'}
          </h2>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-muted hover:text-gold transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-bold text-white">أحمد محمد</div>
                <div className="text-xs text-muted">عميل مميز</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface border border-gold flex items-center justify-center text-gold font-bold">
                أ
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
  );
}
