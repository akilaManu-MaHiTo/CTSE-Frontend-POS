import { Routes, Route, Navigate, Outlet } from "react-router";
import Home from "./views/Home/HomePage";
import Login from "./views/Login/LoginPage";
import Orders from "./views/Orders";
import useCurrentUser from "./hooks/useCurrentUser";
import PageLoader from "./components/PageLoader";
import InventoryPage from "./views/Inventory/InventoryPage";
import PaymentsPage from "./views/PaymentsPage";
import CustomerDetailsPage from "./views/CustomerDetailsPage";
import Layout from "./components/Layout";

const ProtectedRoute = () => {
  const { user, status } = useCurrentUser();

  if (status === "loading" || status === "idle" || status === "pending") {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<InventoryPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/customers" element={<CustomerDetailsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
