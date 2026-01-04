"use client";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import Script from "next/script";

export function GoogleAnalytics() {
    const { consent } = useCookieConsent();

    if (!consent?.analytics) {
        return null;
    }

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=G-HZHXYJTPBQ`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-HZHXYJTPBQ');
          `,
                }}
            />
        </>
    );
}
