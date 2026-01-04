import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CookieConsentProvider } from "@/components/providers/CookieConsentProvider";
import { CookieBanner } from "@/components/cookie/CookieBanner";
import { CookieSettingsModal } from "@/components/cookie/CookieSettingsModal";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Galleryofus - Your Art. Your Story.",
  description: "Personalized Continuous-Line Art from your photos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased text-gray-900 bg-cream-50`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W4Z6P3MJ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <CookieConsentProvider>
          {children}
          <CookieBanner />
          <CookieSettingsModal />
          <AnalyticsProvider />
        </CookieConsentProvider>
      </body>
    </html>
  );
}

