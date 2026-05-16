import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Instructions() {
  const { t } = useTranslation();

  const guides = [
    { title: "How to Purchase", desc: "Browse our store, add games to your cart, and checkout using ABA, ACLEDA, or Wing Bank KHQR payment. Upload your receipt for verification." },
    { title: "How to Activate Game Keys", desc: "After your order is confirmed, go to your dashboard to find your game keys. Follow the platform-specific instructions (Steam, Epic, etc.) to activate them." },
    { title: "ChatGPT Upgrade Process", desc: "Enter your OpenAI credentials in the ChatGPT Upgrade section. Our team will process the upgrade within 24 hours. Do not change your password during this time." },
    { title: "Payment Receipt Upload", desc: "After scanning the KHQR code and making payment, take a clear screenshot of your receipt and upload it in the checkout page or your order details." },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#040507]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#E8ECF1] mb-8">{t("instructions.title")}</h1>

        {/* Video Section */}
        <div className="bg-[#0A0C10] rounded-xl border border-[#141821] p-8 mb-8 text-center">
          <div className="aspect-video bg-[#141821] rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <p className="text-[#7A8299] mb-4">{t("instructions.noVideo")}</p>
              <Button
                onClick={() => window.open("https://t.me/makara_admin", "_blank")}
                className="bg-cyan-400 text-[#040507]"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t("instructions.contactTelegram")}
              </Button>
            </div>
          </div>
        </div>

        {/* Text Guides */}
        <div className="space-y-4">
          {guides.map((guide, i) => (
            <div key={i} className="bg-[#0A0C10] rounded-xl border border-[#141821] p-6">
              <h3 className="text-lg font-semibold text-[#E8ECF1] mb-2">{guide.title}</h3>
              <p className="text-sm text-[#7A8299] leading-relaxed">{guide.desc}</p>
            </div>
          ))}
        </div>

        {/* Telegram CTA */}
        <div className="mt-8 text-center">
          <p className="text-[#7A8299] mb-4">Need more help?</p>
          <Button
            onClick={() => window.open("https://t.me/makara_admin", "_blank")}
            variant="outline"
            className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {t("support.telegram")}: @makara_admin
          </Button>
        </div>
      </div>
    </div>
  );
}
