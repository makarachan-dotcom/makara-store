import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/providers/trpc";
import { Package, Key, MessageCircle, Clock, CheckCircle, XCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: orders } = trpc.order.list.useQuery(undefined, { retry: false });

  if (!user) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-[#040507] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#7A8299] mb-4">Please sign in to view your dashboard</p>
          <Link to="/login">
            <Button className="bg-cyan-400 text-[#040507]">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "cancelled": return <XCircle className="w-4 h-4 text-red-400" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <Loader className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#040507]">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#E8ECF1] mb-8">{t("dashboard.title")}</h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link to="/products" className="bg-[#0A0C10] rounded-xl p-5 border border-[#141821] hover:border-cyan-400/30 transition-colors group">
            <Package className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-medium text-[#E8ECF1]">{t("nav.store")}</h3>
            <p className="text-xs text-[#7A8299]">Browse games</p>
          </Link>
          <Link to="/chatgpt-upgrade" className="bg-[#0A0C10] rounded-xl p-5 border border-[#141821] hover:border-cyan-400/30 transition-colors group">
            <Key className="w-8 h-8 text-[#FFD600] mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-medium text-[#E8ECF1]">{t("dashboard.upgradeChatgpt")}</h3>
            <p className="text-xs text-[#7A8299]">Upgrade your account</p>
          </Link>
          <div className="bg-[#0A0C10] rounded-xl p-5 border border-[#141821] relative">
            <Key className="w-8 h-8 text-[#7A8299] mb-3" />
            <h3 className="text-sm font-medium text-[#E8ECF1]">{t("dashboard.apiKey")}</h3>
            <p className="text-xs text-[#7A8299]">{t("dashboard.apiKeySoon")}</p>
            <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#141821] text-[10px] text-[#7A8299] rounded-full">Soon</span>
          </div>
          <Link to="/instructions" className="bg-[#0A0C10] rounded-xl p-5 border border-[#141821] hover:border-cyan-400/30 transition-colors group">
            <MessageCircle className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-sm font-medium text-[#E8ECF1]">{t("dashboard.support")}</h3>
            <p className="text-xs text-[#7A8299]">Get help</p>
          </Link>
        </div>

        {/* Orders */}
        <div className="bg-[#0A0C10] rounded-xl border border-[#141821] overflow-hidden">
          <div className="p-5 border-b border-[#141821]">
            <h2 className="text-lg font-semibold text-[#E8ECF1]">{t("dashboard.myOrders")}</h2>
          </div>
          {orders && orders.length > 0 ? (
            <div className="divide-y divide-[#141821]">
              {orders.map((order) => (
                <div key={order.id} className="p-5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {statusIcon(order.status || "pending")}
                      <span className="text-sm font-medium text-[#E8ECF1]">{order.orderNumber}</span>
                    </div>
                    <p className="text-xs text-[#7A8299]">{(order.paymentMethod || "").toUpperCase()} · {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-cyan-400">${order.total}</span>
                    <span className={`block text-xs ${order.status === "completed" ? "text-green-400" : "text-yellow-400"} capitalize`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#7A8299]">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
