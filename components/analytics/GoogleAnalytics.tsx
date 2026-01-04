"use client";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import Script from "next/script";
import { useEffect } from "react";

export function GoogleAnalytics() {
    const { consent } = useCookieConsent();
    const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-HZHXYJTPBQ';

    useEffect(() => {
        if (consent) {
            window.gtag('consent', 'update', {
                'analytics_storage': consent.analytics ? 'granted' : 'denied',
                'ad_storage': consent.marketing ? 'granted' : 'denied',
            });
        }
    }, [consent]);

    return (
        <>
            <Script
                id="google-consent-mode"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `,
                }}
            />
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
            />
        </>
    );
}

// Add gtag to window type
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}
