import BusinessLayout from "@/components/layout/BusinessLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["BUSINESS"]}>
      <BusinessLayout>{children}</BusinessLayout>
    </ProtectedRoute>
  );
}
