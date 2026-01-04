"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { GoogleAnalytics } from "./GoogleAnalytics";
import { GoogleTagManager } from "./GoogleTagManager";
import { MetaPixel } from "./MetaPixel";
import { Mixpanel } from "./Mixpanel";
import { trackEvent } from "@/lib/analytics";

export function AnalyticsProvider() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { consent } = useCookieConsent();

    useEffect(() => {
        console.log("[Analytics Debug] Provider Mounted");
        console.log("[Analytics Debug] Env Vars:", {
            GA: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
            Meta: process.env.NEXT_PUBLIC_META_PIXEL_ID,
            Mixpanel: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
            GTM: process.env.NEXT_PUBLIC_GTM_ID
        });
        console.log("[Analytics Debug] Consent:", consent);
    }, [consent]);

    // Track Page Views on Route Change
    useEffect(() => {
        if (pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

            // 1. GA4 (via gtag)
            if (typeof window.gtag === "function") {
                window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-HZHXYJTPBQ", {
                    page_path: url,
                });
            }

            // 2. Meta Pixel (Standard Event)
            if (typeof window.fbq === "function" && consent?.marketing) {
                window.fbq("track", "PageView");
            }

            // 3. Mixpanel
            // Note: Mixpanel tracks automatically if implemented, but we set track_pageview: false 
            // in init to have control. So we track it here.
            // trackEvent checks for opt-in status internally.
            trackEvent("page_view", { path: url });

        }
    }, [pathname, searchParams, consent]);

    return (
        <>
            <GoogleTagManager />
            <GoogleAnalytics />
            <MetaPixel />
            <Mixpanel />
        </>
    );
}
