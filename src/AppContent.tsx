import { useSelector } from "react-redux";
import { RootState } from "./store";
import Login from "./components/auth/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import SADashboard from "./components/sa/SADashboard";
import CustomerDashboard from "./components/customer/CustomerDashboard";

export default function AppContent() {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!user) {
    return <Login />;
  }

  return (
    <DashboardLayout>
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "service_advisor" && <SADashboard />}
      {user.role === "customer" && <CustomerDashboard />}
    </DashboardLayout>
  );
}
