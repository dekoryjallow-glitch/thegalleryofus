"use client";

import { useEffect, useState } from "react";
import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import Script from "next/script";

// Extend window interface for Facebook Pixel
declare global {
    interface Window {
        fbq: any;
        _fbq: any;
    }
}

export function MetaPixel() {
    const { consent } = useCookieConsent();
    const [loaded, setLoaded] = useState(false);

    // TODO: Founder to replace this with real ID
    const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

    // Moves check inside effect or renders null at logic end, 
    // BUT we need the Hook to run unconditionally.

    useEffect(() => {
        if (!PIXEL_ID) {
            console.warn("[Analytics Debug] Meta Pixel ID missing");
            return;
        }

        if (!loaded) return;

        if (consent?.marketing) {
            window.fbq("consent", "grant");
            window.fbq("track", "PageView");
        } else {
            window.fbq("consent", "revoke");
        }
    }, [consent, loaded, PIXEL_ID]);

    if (!PIXEL_ID) return null;

    return (
        <Script
            id="meta-pixel"
            strategy="afterInteractive"
            onLoad={() => setLoaded(true)}
            dangerouslySetInnerHTML={{
                __html: `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        // Default to revoked until consent
        fbq('consent', 'revoke');
        fbq('init', '${PIXEL_ID}');
        `,
            }}
        />
    );
}
