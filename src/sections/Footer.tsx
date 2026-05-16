import { useLanguage } from "@/hooks/use-language";
import { Link } from "react-router";
import { MessageCircle, ExternalLink } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1B2838] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E5B75C] to-[#00D4C8] flex items-center justify-center">
                <span className="text-[#0A1628] font-bold text-sm">M</span>
              </div>
              <span className="text-[#E5B75C] font-bold text-xl">Makara Store</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-4">
              {t(
                "Your trusted digital marketplace for premium subscriptions and services.",
                "ទីផ្សារឌីជីថលដែលអ្នកទុកចិត្តសម្រាប់ការជាវពិសេស និងសេវាកម្ម។"
              )}
            </p>
            <a
              href="https://t.me/makaraadmin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/50 hover:text-[#00D4C8] text-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              @makaraadmin
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t("Quick Links", "តំណភ្ជាប់លឿន")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { labelEn: "Products", labelKh: "ផលិតផល", href: "#products" },
                { labelEn: "How to Order", labelKh: "វិធីកម្មង់", href: "#howtoorder" },
                { labelEn: "Support", labelKh: "ជំនួយ", href: "#support" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/40 hover:text-[#E5B75C] text-sm transition-colors"
                  >
                    {t(link.labelEn, link.labelKh)}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/admin" className="text-white/40 hover:text-[#E5B75C] text-sm transition-colors">
                  {t("Admin Panel", "ផ្ទាំងគ្រប់គ្រង")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t("Payment Methods", "វិធីទូទាត់")}
            </h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {["ABA Bank", "ACLEDA Bank", "Wing Bank"].map((bank) => (
                <span
                  key={bank}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-white/50 text-xs"
                >
                  {bank}
                </span>
              ))}
            </div>
            <p className="text-white/30 text-xs">
              {t("Secure payments with KHQR code scanning.", "ការទូទាត់សុវត្ថិភាពជាមួយការស្កេនកូដ KHQR។")}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; 2025 Makara Store. {t("All rights reserved.", "រក្សាសិទ្ធិគ្រប់យ៉ាង។")}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/30 hover:text-[#E5B75C] text-xs transition-colors">
              {t("Privacy Policy", "គោលការភាពឯកជន")}
            </a>
            <a href="#" className="text-white/30 hover:text-[#E5B75C] text-xs transition-colors">
              {t("Terms", "លក្ខខណ្ឌ")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
