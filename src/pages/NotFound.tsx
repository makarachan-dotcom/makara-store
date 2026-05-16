import { useLanguage } from "@/hooks/use-language";
import { Link } from "react-router";
import { Home } from "lucide-react";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#06080D] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#E5B75C]/20 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">
          {t("Page Not Found", "រកមិនឃើញទំព័រ")}
        </h2>
        <p className="text-white/40 mb-8">
          {t("The page you're looking for doesn't exist.", "ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមានទេ។")}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#E5B75C] text-[#0A1628] rounded-lg font-semibold hover:bg-[#F0C975] transition-all"
        >
          <Home className="w-4 h-4" />
          {t("Go Home", "ទៅទំព័រដើម")}
        </Link>
      </div>
    </div>
  );
}
