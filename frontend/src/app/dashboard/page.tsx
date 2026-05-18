"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Plus, LogOut } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoadingOrders(false);
      }
    };
    if (user) {
      fetchOrders();
    }
  }, [user, logout]);

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'BUSINESS']}>
      <div className="min-h-screen bg-background p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-black text-white">لوحة التحكم</h1>
              {user && <p className="text-muted mt-2">مرحباً، {user.firstName} {user.lastName}</p>}
            </div>
            <div className="flex gap-4">
              <Link href="/customer/request" className="bg-gold text-black px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-gold-glow transition-all glow-effect">
                <Plus className="w-5 h-5" />
                طلب جديد
              </Link>
              <button onClick={logout} className="bg-white/5 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10">
                <LogOut className="w-5 h-5" />
                خروج
              </button>
            </div>
          </div>

          {loadingOrders ? (
            <div className="text-center text-muted py-12">جاري التحميل...</div>
          ) : orders.length === 0 ? (
            <div className="text-center bg-surface border border-white/10 rounded-3xl p-12">
              <Package className="w-16 h-16 text-muted mx-auto mb-4" />
              <p className="text-lg text-white mb-2">لا توجد طلبات</p>
              <p className="text-muted mb-6">لم تقم بإنشاء أي طلبات بعد.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order: any) => (
                <div key={order.id} className="bg-surface border border-white/10 rounded-2xl p-6 hover:border-gold/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm text-muted">رقم التتبع: <span className="text-white font-mono">{order.id.slice(0,8)}</span></div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'DELIVERED' ? 'bg-green-500/20 text-green-400' :
                      order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-muted mb-1">من</div>
                    <div className="text-white font-medium">{order.pickupAddress}</div>
                  </div>
                  <div className="mb-6">
                    <div className="text-sm text-muted mb-1">إلى</div>
                    <div className="text-white font-medium">{order.dropoffAddress}</div>
                  </div>
                  <Link href={`/tracking/${order.id}`} className="block w-full text-center bg-white/5 hover:bg-white/10 text-white py-2 rounded-xl text-sm transition-colors">
                    تتبع الطلب
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
