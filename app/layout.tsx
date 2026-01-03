import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CookieConsentProvider } from "@/components/providers/CookieConsentProvider";
import { CookieBanner } from "@/components/cookie/CookieBanner";
import { CookieSettingsModal } from "@/components/cookie/CookieSettingsModal";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

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
        <CookieConsentProvider>
          {children}
          <CookieBanner />
          <CookieSettingsModal />
          <GoogleAnalytics />
        </CookieConsentProvider>
      </body>
    </html>
  );
}

