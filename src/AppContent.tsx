import { useSelector } from "react-redux";
import { RootState } from "./store";
import AuthPage from "./components/auth/AuthPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import SADashboard from "./components/sa/SADashboard";
import CustomerDashboard from "./components/customer/CustomerDashboard";

export default function AppContent() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <AuthPage />;
  }

  return (
    <DashboardLayout>
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "service_advisor" && <SADashboard />}
      {user.role === "customer" && <CustomerDashboard />}
    </DashboardLayout>
  );
}
