"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their respective dashboard if they don't have access
        switch (user.role) {
          case 'ADMIN': router.push('/admin'); break;
          case 'DRIVER': router.push('/driver'); break;
          case 'BUSINESS': router.push('/business'); break;
          default: router.push('/dashboard'); break;
        }
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gold">جاري التحميل...</div>;
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
