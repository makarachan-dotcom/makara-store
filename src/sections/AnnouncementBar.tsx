import { useLanguage } from "@/hooks/use-language";
import { Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  const { t } = useLanguage();

  const announcements = [
    t("New products added weekly", "ផលិតផលថ្មីបន្ថែមរៀងរាល់សប្តាហ៍"),
    t("All orders processed within 24 hours", "ការកម្មង់ទាំងអស់ត្រូវបានដំណើរការក្នុងរយៈពេល 24 ម៉ោង"),
    t("Secure payments via ABA, ACLEDA, and Wing", "ការទូទាត់សុវត្ថិភាពតាម ABA, ACLEDA, និង Wing"),
    t("24/7 customer support available", "មានការគាំទ្រអតិថិជន 24/7"),
  ];

  const text = announcements.join("  \u2022  ");

  return (
    <div className="bg-[#1B2838] border-y border-white/5 relative overflow-hidden">
      <div className="flex items-center h-10">
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 border-r border-white/5">
          <Sparkles className="w-3 h-3 text-[#E5B75C]" />
          <span className="text-[#E5B75C] text-xs font-medium uppercase tracking-wider">
            {t("News", "ព័ត៌មាន")}
          </span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="whitespace-nowrap animate-marquee text-white/60 text-sm">
            <span className="inline-block pr-16">{text}</span>
            <span className="inline-block pr-16">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
