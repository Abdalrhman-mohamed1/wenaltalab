"use client";

import { useEffect, useState } from "react";
import { Users, CheckCircle, XCircle, RefreshCw, AlertCircle, Shield, Building2, Search, ListFilter } from "lucide-react";
import api from "@/lib/api";

interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const roleMap: Record<string, { label: string; badge: string }> = {
  CUSTOMER: { label: "عميل فردي", badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" },
  DRIVER: { label: "كابتن توصيل", badge: "bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold" },
  BUSINESS: { label: "حساب تجاري / شركة", badge: "bg-gold/20 text-gold border border-gold/30 font-black" },
  ADMIN: { label: "مدير النظام", badge: "bg-red-500/20 text-red-400 border border-red-500/30" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err: any) {
      console.error(err);
      setError("تعذر تحميل قائمة المستخدمين. تأكد من صلاحيات حسابك.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    setUpdatingId(userId);
    try {
      const res = await api.patch(`/admin/users/${userId}/active`, { isActive: !currentActive });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: res.data?.isActive ?? !currentActive } : u))
      );
    } catch (err: any) {
      alert("حدث خطأ أثناء تغيير حالة المستخدم");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filterRole !== "ALL" && u.role !== filterRole) return false;
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      const name = `${u.firstName} ${u.lastName}`.toLowerCase();
      return name.includes(q) || u.email?.toLowerCase().includes(q) || u.phone.includes(q) || u.companyName?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="text-gold w-7 h-7" />
            إدارة وحسابات المستخدمين والشركات ({users.length})
          </h1>
          <p className="text-xs text-muted mt-1">تفعيل أو إيقاف حسابات العملاء والكباتن والشركات المسجلة في النظام</p>
        </div>
        <button
          onClick={fetchUsers}
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

      {/* Search and Role Filter */}
      <div className="bg-surface border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-80 bg-background border border-white/10 rounded-2xl px-4 py-2.5">
          <Search className="w-4 h-4 text-muted shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم، البريد، الهاتف، الشركة..."
            className="bg-transparent w-full text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[
            { key: "ALL", label: "جميع الحسابات" },
            { key: "CUSTOMER", label: "العملاء" },
            { key: "DRIVER", label: "المناديب" },
            { key: "BUSINESS", label: "الشركات" },
            { key: "ADMIN", label: "الإدارة" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterRole(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterRole === tab.key
                  ? "bg-gold text-black shadow-[0_0_15px_rgba(255,215,0,0.3)] font-black"
                  : "bg-background border border-white/10 text-muted hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="h-96 rounded-3xl bg-surface border border-white/10 animate-pulse flex items-center justify-center">
          <p className="text-muted font-bold text-sm">جاري تحميل قائمة المستخدمين...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-white/10 rounded-3xl p-8 text-muted">
          <Users className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <h3 className="text-lg font-bold text-white mb-1">لا يوجد مستخدمين مطابقين للبحث أو التصفية</h3>
        </div>
      ) : (
        <div className="bg-surface border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-background/80 border-b border-white/10 text-muted font-bold">
                <tr>
                  <th className="p-4 font-semibold">المستخدم / الشركة</th>
                  <th className="p-4 font-semibold">البريد الإلكتروني</th>
                  <th className="p-4 font-semibold">رقم الهاتف</th>
                  <th className="p-4 font-semibold">نوع الحساب (الدور)</th>
                  <th className="p-4 font-semibold">تاريخ التسجيل</th>
                  <th className="p-4 font-semibold">حالة التفعيل</th>
                  <th className="p-4 font-semibold text-center">إجراء الإدارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredUsers.map((user) => {
                  const roleInfo = roleMap[user.role] || { label: user.role, badge: "bg-white/10 text-white" };
                  const dateStr = new Date(user.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span>{user.firstName} {user.lastName}</span>
                        </div>
                        {user.companyName && (
                          <div className="text-[10px] text-gold font-semibold flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            <span>{user.companyName}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-muted" dir="ltr">{user.email}</td>
                      <td className="p-4 text-white" dir="ltr">{user.phone}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] ${roleInfo.badge}`}>
                          {roleInfo.label}
                        </span>
                      </td>
                      <td className="p-4 text-muted">{dateStr}</td>
                      <td className="p-4">
                        {user.isActive ? (
                          <span className="text-green-400 font-bold flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            نشط وفعال
                          </span>
                        ) : (
                          <span className="text-red-400 font-bold flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-red-500" />
                            حساب معطل
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          disabled={updatingId === user.id || user.role === "ADMIN"}
                          className={`px-4 py-1.5 rounded-xl font-bold text-[10px] transition-all border ${
                            user.isActive
                              ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white"
                              : "bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black font-black"
                          } disabled:opacity-30`}
                        >
                          {updatingId === user.id
                            ? "جاري..."
                            : user.isActive
                            ? "إيقاف الحساب"
                            : "تفعيل الحساب"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
