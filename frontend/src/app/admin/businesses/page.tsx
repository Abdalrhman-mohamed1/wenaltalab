"use client";

import { useEffect, useState } from "react";
import { Building2, Package, CheckCircle, RefreshCw, AlertCircle, Phone, Mail, Search } from "lucide-react";
import api from "@/lib/api";

interface BusinessOrder {
  id: string;
  status: string;
  totalFare: number;
}

interface BusinessUser {
  id: string;
  companyName?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  businessOrders?: BusinessOrder[];
}

export default function AdminBusinessesPage() {
  const [businesses, setBusinesses] = useState<BusinessUser[]>([]);
  const [filtered, setFiltered] = useState<BusinessUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchBusinesses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/businesses");
      setBusinesses(res.data);
      setFiltered(res.data);
    } catch (err: any) {
      console.error(err);
      setError("تعذر تحميل قائمة الشركات. تأكد من صلاحيات حسابك.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(businesses);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        businesses.filter(
          (b) =>
            b.companyName?.toLowerCase().includes(q) ||
            `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
            b.phone.includes(q) ||
            b.email?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, businesses]);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Building2 className="text-gold w-7 h-7" />
            إدارة الشركات والمؤسسات ({businesses.length})
          </h1>
          <p className="text-xs text-muted mt-1">مراجعة الحسابات التجارية ومعدلات الطلبات وحجم الإيرادات الصادرة من كل شركة</p>
        </div>
        <button
          onClick={fetchBusinesses}
          className="p-2.5 rounded-xl border border-white/10 bg-surface text-muted hover:text-white hover:border-white/20 transition-all flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold' : ''}`} />
          تحديث القائمة
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500 text-red-500 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl flex items-center gap-2 max-w-md">
        <Search className="w-5 h-5 text-gold shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث باسم الشركة، المدير، رقم الهاتف أو البريد..."
          className="bg-transparent w-full text-xs text-white focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="h-96 rounded-3xl bg-surface border border-white/10 animate-pulse flex items-center justify-center">
          <p className="text-muted font-bold text-sm">جاري تحميل بيانات الشركات...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-white/10 rounded-3xl p-8 text-muted shadow-xl">
          <Building2 className="w-16 h-16 mx-auto mb-3 opacity-30 text-gold" />
          <h3 className="text-lg font-bold text-white mb-1">لا توجد شركات مطابقة للبحث</h3>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => {
            const orders = b.businessOrders || [];
            const totalRevenue = orders.reduce((sum, o) => sum + (o.totalFare || 0), 0);
            const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
            const dateStr = new Date(b.createdAt).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });

            return (
              <div
                key={b.id}
                className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl space-y-5 hover:border-gold/40 transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full filter blur-2xl group-hover:bg-gold/10 transition-all pointer-events-none"></div>

                <div className="space-y-3 relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-white tracking-tight">
                        {b.companyName || "مؤسسة بدون اسم"}
                      </h3>
                      <div className="text-xs text-muted font-semibold flex items-center gap-1">
                        <span>المدير:</span>
                        <strong className="text-white">{b.firstName} {b.lastName}</strong>
                      </div>
                    </div>
                    <span className="w-10 h-10 rounded-2xl bg-gold/10 text-gold border border-gold/20 flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                      🏢
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs text-muted font-medium">
                    <div className="flex items-center gap-2" dir="ltr">
                      <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                      <span className="text-white">{b.phone}</span>
                    </div>
                    <div className="flex items-center gap-2" dir="ltr">
                      <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="text-white truncate">{b.email || "بدون بريد"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 relative z-10 text-center">
                  <div className="bg-background/80 border border-white/5 p-3 rounded-2xl space-y-1 shadow-inner">
                    <div className="text-[10px] text-muted font-bold flex items-center justify-center gap-1">
                      <Package className="w-3 h-3 text-gold" />
                      إجمالي الطلبات
                    </div>
                    <div className="text-lg font-black text-white">{orders.length}</div>
                    <div className="text-[9px] text-green-400">{deliveredOrders} مكتمل</div>
                  </div>

                  <div className="bg-background/80 border border-white/5 p-3 rounded-2xl space-y-1 shadow-inner">
                    <div className="text-[10px] text-muted font-bold flex items-center justify-center gap-1">
                      💰 الإيرادات
                    </div>
                    <div className="text-lg font-black text-gold">{totalRevenue} <span className="text-xs">ج.م</span></div>
                    <div className="text-[9px] text-muted">انضمام: {dateStr}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
