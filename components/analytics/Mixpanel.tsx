"use client";

import { useEffect } from "react";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import mixpanel from "mixpanel-browser";

export function Mixpanel() {
    const { consent } = useCookieConsent();

    // TODO: Founder to replace this with real Token
    const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || "";

    // Logging side-effect must be inside useEffect or just plain console log (if strictly needed)
    // But since this is a component, let's keep it clean and just log if missing during render is fine, 
    // BUT hooks must be below.

    // Better: Just log once in effect
    useEffect(() => {
        if (!MIXPANEL_TOKEN) {
            console.warn("[Analytics Debug] Mixpanel Token missing");
        }
    }, [MIXPANEL_TOKEN]);

    useEffect(() => {
        if (!MIXPANEL_TOKEN) return;

        // Initialize Mixpanel
        mixpanel.init(MIXPANEL_TOKEN, {
            debug: process.env.NODE_ENV === "development",
            track_pageview: false, // We track manually to ensure control
            persistence: "localStorage",
            ignore_dnt: true, // We handle consent manually
        });
    }, [MIXPANEL_TOKEN]);

    useEffect(() => {
        if (!MIXPANEL_TOKEN) return;

        if (consent?.analytics) {
            mixpanel.opt_in_tracking();
        } else {
            mixpanel.opt_out_tracking();
        }
    }, [consent, MIXPANEL_TOKEN]);

    return null;
}
