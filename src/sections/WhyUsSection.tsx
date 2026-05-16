import { useTranslation } from "react-i18next";
import { Zap, Tag, Headset } from "lucide-react";

export function WhyUsSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      title: t("whyUs.instant.title"),
      desc: t("whyUs.instant.desc"),
    },
    {
      icon: Tag,
      title: t("whyUs.price.title"),
      desc: t("whyUs.price.desc"),
    },
    {
      icon: Headset,
      title: t("whyUs.support.title"),
      desc: t("whyUs.support.desc"),
    },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-[#040507]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-5xl font-bold text-[#E8ECF1] text-center mb-16">
          {t("whyUs.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group feature-card relative p-8 md:p-10 rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(26, 31, 46, 0.6) 0%, rgba(14, 17, 24, 0.4) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(122, 130, 153, 0.1)",
              }}
            >
              {/* Border Shimmer */}
              <div
                className="absolute inset-0 rounded-2xl p-px opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, rgba(0,229,255,0) 0%, rgba(0,229,255,0.4) 50%, rgba(0,229,255,0) 100%)",
                  backgroundSize: "100% 200%",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                  animation: "border-shimmer 3s ease infinite",
                  padding: "1px",
                }}
              />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-[#E8ECF1] mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#7A8299] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes border-shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 200%; }
        }
      `}</style>
    </section>
  );
}
