import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminReportsPage from "./pages/AdminReportsPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import { useAuth } from "./context/AuthContext";
const PrivateShell = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-slate-700">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const AdminOnly = () => {
  const { user } = useAuth();
  if (user?.role !== "admin") return <Navigate to="/products" replace />;
  return <Outlet />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<PrivateShell />}>
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route element={<AdminOnly />}>
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
