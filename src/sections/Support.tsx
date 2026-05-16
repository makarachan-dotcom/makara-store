import { useLanguage } from "@/hooks/use-language";
import { MessageCircle, BookOpen, ArrowRight } from "lucide-react";

export default function Support() {
  const { t } = useLanguage();

  return (
    <section id="support" className="py-20 lg:py-28 bg-[#06080D] relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,183,92,0.03)_0%,transparent_70%)]" />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <span className="text-[#E5B75C] text-sm font-medium uppercase tracking-widest">
          {t("24/7 Support", "គាំទ្រ 24/7")}
        </span>
        <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-6">
          {t("Need Help?", "ត្រូវការជំនួយ?")}
        </h2>
        <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          {t(
            "Our dedicated support team is always ready to assist you. Reach out via Telegram for instant help.",
            "ក្រុមគាំទ្រដ៏ខ្ជាប់ខ្ជួនរបស់យើងតែងត្រៀមខ្លួនជានិច្ចដើម្បីជួយអ្នក។ ទាក់ទងតាម Telegram សម្រាប់ជំនួយបន្ទាន់។"
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://t.me/makaraadmin"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-8 py-4 bg-[#E5B75C] text-[#0A1628] rounded-lg font-semibold hover:bg-[#F0C975] hover:scale-[1.03] transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            {t("Contact Admin", "ទាក់ទងអេតមីន")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://t.me/makarastore"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-lg font-medium hover:border-[#E5B75C]/40 hover:text-[#E5B75C] transition-all"
          >
            <BookOpen className="w-5 h-5" />
            {t("View Guide", "មើលការណែនាំ")}
          </a>
        </div>
      </div>
    </section>
  );
}
