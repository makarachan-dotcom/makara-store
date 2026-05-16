import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Zap, Mail, MessageCircle, Shield } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0A0C10] border-t border-[#141821]">
      {/* Newsletter */}
      <div className="max-w-[1400px] mx-auto px-4 py-16 border-b border-[#141821]">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-2xl font-bold text-[#E8ECF1] mb-2">{t("newsletter.title")}</h3>
          <div className="flex gap-2 mt-6">
            <input
              type="email"
              placeholder={t("newsletter.placeholder")}
              className="flex-1 bg-[#141821] border border-[#1A1F2E] rounded-lg py-3 px-4 text-[#E8ECF1] placeholder-[#7A8299] focus:outline-none focus:border-cyan-400/50"
            />
            <button className="px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-[#040507] font-semibold rounded-lg transition-colors">
              {t("newsletter.subscribe")}
            </button>
          </div>
          <p className="text-xs text-[#7A8299] mt-3">{t("newsletter.privacy")}</p>
        </div>
      </div>

      {/* Footer Links */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-lg">
                <span className="text-cyan-400">M</span>AKARA
              </span>
            </div>
            <p className="text-sm text-[#7A8299]">Premium game keys at unbeatable prices. Instant delivery, 24/7 support.</p>
          </div>

          <div>
            <h4 className="font-semibold text-[#E8ECF1] mb-4">{t("footer.store")}</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm text-[#7A8299] hover:text-cyan-400 transition-colors">All Games</Link></li>
              <li><Link to="/products" className="text-sm text-[#7A8299] hover:text-cyan-400 transition-colors">New Releases</Link></li>
              <li><Link to="/products" className="text-sm text-[#7A8299] hover:text-cyan-400 transition-colors">Top Sellers</Link></li>
              <li><Link to="/products" className="text-sm text-[#7A8299] hover:text-cyan-400 transition-colors">On Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#E8ECF1] mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2">
              <li><Link to="/instructions" className="text-sm text-[#7A8299] hover:text-cyan-400 transition-colors">{t("instructions.title")}</Link></li>
              <li><Link to="/chatgpt-upgrade" className="text-sm text-[#7A8299] hover:text-cyan-400 transition-colors">ChatGPT Upgrade</Link></li>
              <li><Link to="/dashboard" className="text-sm text-[#7A8299] hover:text-cyan-400 transition-colors">{t("nav.dashboard")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[#E8ECF1] mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-[#7A8299] hover:text-cyan-400 transition-colors flex items-center gap-1"><Shield className="w-3 h-3" /> {t("privacy.title")}</Link></li>
              <li><a href="mailto:chanmakara672@gmail.com" className="text-sm text-[#7A8299] hover:text-cyan-400 transition-colors flex items-center gap-1"><Mail className="w-3 h-3" /> Email Us</a></li>
              <li><a href="https://t.me/makara_admin" target="_blank" rel="noopener noreferrer" className="text-sm text-[#7A8299] hover:text-cyan-400 transition-colors flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Telegram</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#141821] py-6">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#7A8299]">{t("footer.rights")}</p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#7A8299]">Visa</span>
            <span className="text-xs text-[#7A8299]">Mastercard</span>
            <span className="text-xs text-[#7A8299]">PayPal</span>
            <span className="text-xs text-[#7A8299]">Crypto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
