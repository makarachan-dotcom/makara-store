import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { TRPCProvider } from "@/providers/trpc";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "@/components/ui/sonner";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <LanguageProvider>
            <CartProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "#0A1628",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  },
                }}
              />
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>
);
