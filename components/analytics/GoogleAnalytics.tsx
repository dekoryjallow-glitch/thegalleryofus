"use client";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { useEffect } from "react";

export function GoogleAnalytics() {
    const { consent } = useCookieConsent();

    useEffect(() => {
        if (consent?.analytics) {
            // Placeholder for Google Analytics initialization
            // e.g., window.gtag('config', 'MEASUREMENT_ID');
            console.log("[CookieConsent] Analytics Cookies allowed -> Loading GA Scripts...");
        }
    }, [consent]);

    return null;
}
