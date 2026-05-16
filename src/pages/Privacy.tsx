import { useTranslation } from "react-i18next";
import { Shield } from "lucide-react";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#040507]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#E8ECF1]">{t("privacy.title")}</h1>
          <p className="text-sm text-[#7A8299] mt-2">{t("privacy.lastUpdated")}: May 16, 2025</p>
        </div>

        <div className="space-y-8 prose prose-invert max-w-none">
          <section>
            <h2 className="text-xl font-semibold text-[#E8ECF1] mb-3">1. Information We Collect</h2>
            <p className="text-[#7A8299] leading-relaxed">
              We collect information you provide directly to us, such as your name, email address, 
              and payment information when you create an account, make a purchase, or contact us for support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E8ECF1] mb-3">2. How We Use Your Information</h2>
            <p className="text-[#7A8299] leading-relaxed">
              We use your information to process transactions, deliver game keys, provide customer support, 
              send important updates, and improve our services. We do not sell your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E8ECF1] mb-3">3. Payment Security</h2>
            <p className="text-[#7A8299] leading-relaxed">
              All payments are processed through secure KHQR codes from ABA Bank, ACLEDA Bank, and Wing Bank. 
              We store payment receipts securely and only use them for order verification purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E8ECF1] mb-3">4. Data Retention</h2>
            <p className="text-[#7A8299] leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide services. 
              You can request deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E8ECF1] mb-3">5. Your Rights</h2>
            <p className="text-[#7A8299] leading-relaxed">
              You have the right to access, correct, or delete your personal information. 
              Contact us at chanmakara672@gmail.com for any privacy-related requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E8ECF1] mb-3">6. Contact Us</h2>
            <p className="text-[#7A8299] leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:chanmakara672@gmail.com" className="text-cyan-400 hover:underline">chanmakara672@gmail.com</a>{" "}
              or via Telegram at <a href="https://t.me/makara_admin" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">@makara_admin</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
