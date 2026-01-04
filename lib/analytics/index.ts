import mixpanel from "mixpanel-browser";

// Standardized Event Properties
type EventProps = Record<string, any>;

/**
 * Central Analytics Dispatcher
 * Sends events to all active and consented analytics tools.
 */
export const trackEvent = (eventName: string, props?: EventProps) => {
    // 1. Log to console in development
    if (process.env.NODE_ENV === "development") {
        console.log(`[Analytics] ${eventName}`, props);
    }

    // 2. Mixpanel (Checks opt-in internal state automatically)
    if (typeof window !== "undefined" && mixpanel.has_opted_in_tracking()) {
        mixpanel.track(eventName, props);
    }

    // 3. Google Analytics 4 (Handled globally via GTM/gtag if loaded)
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, props);
    }

    // 4. Meta Pixel (Handled if fbq is loaded)
    if (typeof window !== "undefined" && window.fbq) {
        // Meta uses specific standard event names, otherwise CustomEvent
        const standardEvents = [
            "ViewContent", "Search", "AddToCart", "InitiateCheckout",
            "AddPaymentInfo", "Purchase", "Lead", "CompleteRegistration"
        ];

        if (standardEvents.includes(eventName)) {
            window.fbq("track", eventName, props);
        } else {
            window.fbq("trackCustom", eventName, props);
        }
    }
};
