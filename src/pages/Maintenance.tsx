import { useTranslation } from "react-i18next";
import { Wrench } from "lucide-react";

export default function Maintenance() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#040507] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-cyan-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-10 h-10 text-cyan-400 animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-[#E8ECF1] mb-4">{t("maintenance.title")}</h1>
        <p className="text-[#7A8299] leading-relaxed">{t("maintenance.message")}</p>
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
