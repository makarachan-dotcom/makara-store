import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import {
  Users, ShoppingBag, DollarSign, Clock,
  TrendingUp, Package, Settings, Bell,
  ChevronRight, BarChart3, ShieldCheck, AlertTriangle
} from "lucide-react";

export default function Admin() {
  const { user, isLoggedIn, isAdmin, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || !isAdmin)) {
      navigate("/");
    }
  }, [isLoading, isLoggedIn, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#06080D] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#E5B75C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#06080D] flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-[#E5B75C] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{t("Access Denied", "បដិសេធការចូលប្រើ")}</h1>
          <p className="text-white/50">{t("You don't have permission to access this page.", "អ្នកមិនមានសិទ្ធិចូលប្រើទំព័រនេះទេ។")}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-[#E5B75C] text-[#0A1628] rounded-lg font-semibold hover:bg-[#F0C975] transition-all"
          >
            {t("Go Home", "ទៅទំព័រដើម")}
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: t("Total Users", "អ្នកប្រើប្រាស់សរុប"), value: "1,234", icon: Users, color: "#00D4C8" },
    { label: t("Total Orders", "ការកម្មង់សរុប"), value: "567", icon: ShoppingBag, color: "#E5B75C" },
    { label: t("Revenue", "ចំណូល"), value: "$12,450", icon: DollarSign, color: "#5ED4F4" },
    { label: t("Pending", "កំពុងរង់ចាំ"), value: "23", icon: Clock, color: "#FF4D6A" },
  ];

  const menuItems = [
    { label: t("Products", "ផលិតផល"), icon: Package, desc: t("Manage products & inventory", "គ្រប់គ្រងផលិតផល និងស្តុក") },
    { label: t("Orders", "ការកម្មង់"), icon: ShoppingBag, desc: t("View and process orders", "មើល និងដំណើរការការកម្មង់") },
    { label: t("Analytics", "វិភាគ"), icon: BarChart3, desc: t("Sales reports & insights", "របាយការណ៍ និងព័ត៌មានលម្អិត") },
    { label: t("Announcements", "សេចក្តីប្រកាស"), icon: Bell, desc: t("Manage announcement banners", "គ្រប់គ្រងបដាសេចក្តីប្រកាស") },
    { label: t("Payment Config", "ការកំណត់ទូទាត់"), icon: DollarSign, desc: t("KHQR codes & bank settings", "កូដ KHQR និងការកំណត់ធនាគារ") },
    { label: t("Settings", "ការកំណត់"), icon: Settings, desc: t("Site settings & maintenance", "ការកំណត់គេហទំព័រ និងការថែទាំ") },
  ];

  return (
    <div className="min-h-screen bg-[#06080D] pt-20 pb-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-6 h-6 text-[#E5B75C]" />
          <h1 className="text-3xl font-bold text-white">{t("Admin Dashboard", "ផ្ទាំងគ្រប់គ្រងអេតមីន")}</h1>
        </div>
        <p className="text-white/40 mb-8">
          {t("Welcome back", "សូមស្វាគមន៍")}, {user?.name || "Admin"}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  <TrendingUp className="w-4 h-4 text-white/20" />
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/40 text-xs">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <h2 className="text-xl font-bold text-white mb-4">{t("Management", "ការគ្រប់គ្រង")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="flex items-center gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#E5B75C]/30 hover:bg-[#E5B75C]/5 transition-all group text-left"
              >
                <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E5B75C]/10 transition-all">
                  <Icon className="w-5 h-5 text-[#E5B75C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm">{item.label}</h3>
                  <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#E5B75C] group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
