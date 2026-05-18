"use client";

import { useEffect, useState } from "react";
import { Truck, CheckCircle, XCircle, RefreshCw, AlertCircle, ShieldCheck, FileText, UserCheck } from "lucide-react";
import api from "@/lib/api";

interface Vehicle {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
}

interface Document {
  docType: string;
  fileUrl: string;
  status: string;
}

interface DriverProfile {
  id: string;
  licenseNumber: string;
  kycStatus: string;
  vehicle?: Vehicle;
  documents?: Document[];
}

interface DriverUser {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  driverProfile?: DriverProfile;
}

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<DriverUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchDrivers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/drivers");
      setDrivers(res.data);
    } catch (err: any) {
      console.error(err);
      setError("تعذر تحميل قائمة الكباتن. تأكد من صلاحيات حسابك.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleVerifyDriver = async (driverId: string) => {
    setVerifyingId(driverId);
    try {
      await api.patch(`/admin/drivers/${driverId}/verify`);
      alert("تم توثيق وتفعيل حساب الكابتن بنجاح!");
      fetchDrivers();
    } catch (err: any) {
      alert("حدث خطأ أثناء توثيق حساب الكابتن");
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Truck className="text-sky-400 w-7 h-7" />
            توثيق وإدارة كباتن التوصيل ({drivers.length})
          </h1>
          <p className="text-xs text-muted mt-1">مراجعة أوراق التوثيق (KYC) ومعلومات المركبة وتفعيل الحسابات للعمل على المنصة</p>
        </div>
        <button
          onClick={fetchDrivers}
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

      {loading ? (
        <div className="h-96 rounded-3xl bg-surface border border-white/10 animate-pulse flex items-center justify-center">
          <p className="text-muted font-bold text-sm">جاري تحميل بيانات الكباتن والمركبات...</p>
        </div>
      ) : drivers.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-white/10 rounded-3xl p-8 text-muted">
          <Truck className="w-16 h-16 mx-auto mb-3 opacity-30" />
          <h3 className="text-lg font-bold text-white mb-1">لا يوجد مناديب مسجلين في قاعدة البيانات</h3>
        </div>
      ) : (
        <div className="grid gap-6">
          {drivers.map((driver) => {
            const profile = driver.driverProfile;
            const vehicle = profile?.vehicle;
            const kycStatus = profile?.kycStatus || (driver.isActive ? "APPROVED" : "PENDING");
            const isApproved = kycStatus === "APPROVED" && driver.isActive;

            return (
              <div
                key={driver.id}
                className={`bg-surface border rounded-3xl p-6 shadow-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden ${
                  isApproved ? "border-green-500/30" : "border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.05)]"
                }`}
              >
                {!isApproved && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full filter blur-2xl pointer-events-none"></div>
                )}

                <div className="flex items-start gap-5 flex-1 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 shadow-md ${
                    isApproved ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-amber-400/10 text-amber-400 border border-amber-400/30 animate-pulse"
                  }`}>
                    {driver.firstName[0]}
                  </div>

                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-black text-lg text-white">{driver.firstName} {driver.lastName}</h3>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                        isApproved ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-amber-400/20 text-amber-400 border border-amber-400/30 font-black"
                      }`}>
                        {isApproved ? "✓ كابتن موثق وفعال" : "⏳ بانتظار التوثيق (KYC)"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted">
                      <span dir="ltr">📱 {driver.phone}</span>
                      <span dir="ltr">✉️ {driver.email}</span>
                      {profile?.licenseNumber && <span>رخصة القيادة: <strong className="text-white font-mono">{profile.licenseNumber}</strong></span>}
                    </div>

                    {vehicle ? (
                      <div className="bg-background/80 border border-white/5 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs mt-2">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-sky-400" />
                          <span className="text-white font-bold">{vehicle.make} {vehicle.model} ({vehicle.year})</span>
                        </div>
                        <span className="bg-sky-500/10 text-sky-400 px-3 py-1 rounded-xl border border-sky-500/20 font-bold font-mono">
                          لوحة رقم: {vehicle.licensePlate}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-muted/70 italic pt-1">لم يقم الكابتن بتسجيل بيانات المركبة بعد</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-white/10 relative z-10">
                  {!isApproved ? (
                    <button
                      onClick={() => handleVerifyDriver(driver.id)}
                      disabled={verifyingId === driver.id}
                      className="px-6 py-3 bg-gold hover:bg-gold-glow text-black font-black text-xs rounded-2xl flex items-center gap-2 shadow-lg glow-effect transition-all disabled:opacity-50"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {verifyingId === driver.id ? "جاري التوثيق..." : "وثق الكابتن الآن (Approve KYC)"}
                    </button>
                  ) : (
                    <span className="text-xs text-green-400 font-bold bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4" />
                      الحساب جاهز للعمل
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
