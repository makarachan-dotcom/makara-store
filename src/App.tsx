import { Routes, Route } from "react-router";
import { Suspense, lazy } from "react";
import { TRPCProvider } from "./providers/trpc";
import { ThemeProvider } from "./providers/theme";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ChatBot } from "./components/chat/ChatBot";
import { IntroOverlay } from "./components/IntroOverlay";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "./components/cart/CartProvider";
import CartDrawer from "@/sections/CartDrawer";

// Pages
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const ChatGPTUpgrade = lazy(() => import("./pages/ChatGPTUpgrade"));
const Instructions = lazy(() => import("./pages/Instructions"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#06080D]">
      <div className="w-8 h-8 border-2 border-[#E5B75C] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-[#040507] text-[#E8ECF1]">
      <IntroOverlay />
      <Navbar />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/chatgpt-upgrade" element={<ChatGPTUpgrade />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ChatBot />
      <CartDrawer />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0A1628",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="makara-theme">
      <TRPCProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </TRPCProvider>
    </ThemeProvider>
  );
}
