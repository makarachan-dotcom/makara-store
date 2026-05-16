import { trpc } from "@/providers/trpc";

export function useAuth() {
  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.reload();
    },
  });

  const isAdmin = user?.role === "admin";

  function getOAuthUrl() {
    const appID = import.meta.env.VITE_APP_ID;
    const authURL = import.meta.env.VITE_KIMI_AUTH_URL;
    const redirectUri = `${window.location.origin}/api/oauth/callback`;
    const state = btoa(redirectUri);

    const url = new URL(`${authURL}/api/oauth/authorize`);
    url.searchParams.set("client_id", appID);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "profile");
    url.searchParams.set("state", state);

    return url.toString();
  }

  return {
    user,
    isLoading,
    isAdmin,
    isLoggedIn: !!user,
    logout: logoutMutation.mutate,
    getOAuthUrl,
  };
}
