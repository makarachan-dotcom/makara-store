import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Search, ShoppingCart, Upload, Gift, ChevronRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    titleEn: "Choose Your Product",
    titleKh: "ជ្រើសរើសផលិតផលរបស់អ្នក",
    descEn: "Browse our catalog and select the subscription or service you need.",
    descKh: "រកមើលកាតាឡុករបស់យើង និងជ្រើសរើសការជាវ ឬសេវាកម្មដែលអ្នកត្រូវការ។",
  },
  {
    icon: ShoppingCart,
    titleEn: "Add to Cart & Checkout",
    titleKh: "បន្ថែមទៅកន្ត្រក និងពិនិត្យចេញ",
    descEn: "Review your items and proceed to secure checkout.",
    descKh: "ពិនិត្យមើលទំនិញរបស់អ្នក ហើយបន្តទៅការពិនិត្យចេញដោយសុវត្ថិភាព។",
  },
  {
    icon: Upload,
    titleEn: "Upload Payment Receipt",
    titleKh: "ផ្ទុកវិក្កយបត្រទូទាត់",
    descEn: "Pay via your preferred method and upload the receipt for verification.",
    descKh: "ទូទាត់តាមវិធីដែលអ្នកចូលចិត្ត ហើយផ្ទុកវិក្កយបត្រសម្រាប់ផ្ទៀងផ្ទាត់។",
  },
  {
    icon: Gift,
    titleEn: "Receive Your Product",
    titleKh: "ទទួលផលិតផលរបស់អ្នក",
    descEn: "Get your product delivered automatically within minutes.",
    descKh: "ទទួលបានផលិតផលរបស់អ្នកដោយស្វ័យប្រវត្តិក្នុងរយៈពេលប៉ុន្មាននាទី។",
  },
];

export default function HowToOrder() {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="howtoorder" className="py-20 lg:py-28 bg-[#06080D] relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="text-[#E5B75C] text-sm font-medium uppercase tracking-widest">
              {t("Easy Process", "ដំណើរការងាយស្រួល")}
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mt-3 mb-10">
              {t("How to Order", "វិធីកម្មង់")}
            </h2>

            <div className="space-y-4">
              {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = activeStep === i;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-300 ${
                      isActive
                        ? "bg-[#E5B75C]/10 border border-[#E5B75C]/20"
                        : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        isActive ? "bg-[#E5B75C] text-[#0A1628]" : "bg-white/5 text-white/40"
                      }`}
                    >
                      <span className="font-bold text-sm">0{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-base mb-1 flex items-center gap-2 ${isActive ? "text-[#E5B75C]" : "text-white"}`}>
                        <Icon className="w-4 h-4" />
                        {t(step.titleEn, step.titleKh)}
                      </h3>
                      <p className={`text-sm transition-all duration-300 ${isActive ? "text-white/60 max-h-20 opacity-100" : "text-white/30 max-h-0 opacity-0 overflow-hidden"}`}>
                        {t(step.descEn, step.descKh)}
                      </p>
                    </div>
                    <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-all ${isActive ? "text-[#E5B75C] translate-x-0" : "text-white/20 -translate-x-2"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#E5B75C]/10 blur-3xl rounded-full scale-75" />
              <div className="relative w-full max-w-md aspect-square rounded-2xl bg-gradient-to-br from-[#0A1628] to-[#06080D] border border-white/8 p-8 flex flex-col items-center justify-center">
                {(() => {
                  const ActiveIcon = steps[activeStep].icon;
                  return (
                    <>
                      <div className="w-20 h-20 rounded-2xl bg-[#E5B75C]/10 flex items-center justify-center mb-6 animate-pulse">
                        <ActiveIcon className="w-10 h-10 text-[#E5B75C]" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 text-center">
                        {t(steps[activeStep].titleEn, steps[activeStep].titleKh)}
                      </h3>
                      <p className="text-white/50 text-center leading-relaxed max-w-sm">
                        {t(steps[activeStep].descEn, steps[activeStep].descKh)}
                      </p>
                      <div className="flex gap-2 mt-8">
                        {steps.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ${
                              i === activeStep ? "w-8 bg-[#E5B75C]" : "w-2 bg-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
