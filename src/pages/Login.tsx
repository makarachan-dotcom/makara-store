import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { Zap, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.localAuth.login.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#040507] flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#E8ECF1]">{t("auth.loginTitle")}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-[#7A8299] mb-1">{t("auth.email")}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8299]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#141821] border border-[#1A1F2E] rounded-lg py-2.5 pl-10 pr-4 text-[#E8ECF1] placeholder-[#7A8299] focus:outline-none focus:border-cyan-400/50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#7A8299] mb-1">{t("auth.password")}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8299]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#141821] border border-[#1A1F2E] rounded-lg py-2.5 pl-10 pr-4 text-[#E8ECF1] placeholder-[#7A8299] focus:outline-none focus:border-cyan-400/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-cyan-400 hover:bg-cyan-500 text-[#040507] font-semibold h-11"
          >
            {loginMutation.isPending ? "..." : t("auth.loginBtn")}
          </Button>
        </form>

        <p className="text-center text-sm text-[#7A8299] mt-6">
          {t("auth.noAccount")}{" "}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            {t("auth.registerTitle")}
          </Link>
        </p>
      </div>
    </div>
  );
}
