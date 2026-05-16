import { useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/use-auth";
import { Key, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatGPTUpgrade() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("ChatGPT Plus");
  const [submitted, setSubmitted] = useState(false);

  const createMutation = trpc.chatgpt.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setEmail("");
      setPassword("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ accountEmail: email, accountPassword: password, upgradeType: type });
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-[#040507] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#7A8299] mb-4">Please sign in to upgrade your ChatGPT account.</p>
          <Button onClick={() => window.location.href = "/login"} className="bg-cyan-400 text-[#040507]">Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#040507]">
      <div className="max-w-[600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FFD600]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-[#FFD600]" />
          </div>
          <h1 className="text-2xl font-bold text-[#E8ECF1]">{t("chatgpt.title")}</h1>
        </div>

        {/* Warning */}
        <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4 mb-6 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-400/80">{t("chatgpt.warning")}</p>
        </div>

        {submitted ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#E8ECF1] mb-2">{t("chatgpt.success")}</h2>
            <p className="text-[#7A8299] text-sm">We will process your request and notify you when complete.</p>
            <Button onClick={() => setSubmitted(false)} className="mt-6 bg-cyan-400 text-[#040507]">
              Submit Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#0A0C10] rounded-xl border border-[#141821] p-6 space-y-4">
            <div>
              <label className="block text-sm text-[#7A8299] mb-1">{t("chatgpt.email")}</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full bg-[#141821] border border-[#1A1F2E] rounded-lg py-2.5 px-4 text-[#E8ECF1] placeholder-[#7A8299] focus:outline-none focus:border-cyan-400/50"
                placeholder="you@openai.com"
              />
            </div>
            <div>
              <label className="block text-sm text-[#7A8299] mb-1">{t("chatgpt.password")}</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full bg-[#141821] border border-[#1A1F2E] rounded-lg py-2.5 px-4 text-[#E8ECF1] placeholder-[#7A8299] focus:outline-none focus:border-cyan-400/50"
                placeholder="Your OpenAI password"
              />
            </div>
            <div>
              <label className="block text-sm text-[#7A8299] mb-1">{t("chatgpt.type")}</label>
              <select
                value={type} onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#141821] border border-[#1A1F2E] rounded-lg py-2.5 px-4 text-[#E8ECF1] focus:outline-none focus:border-cyan-400/50"
              >
                <option>ChatGPT Plus</option>
                <option>ChatGPT Enterprise</option>
              </select>
            </div>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-[#FFD600] hover:bg-[#FFE600] text-[#040507] font-semibold h-12"
            >
              {createMutation.isPending ? "Submitting..." : t("chatgpt.submit")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
