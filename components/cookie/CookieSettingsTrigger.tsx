"use client";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";

interface CookieSettingsTriggerProps {
    className?: string;
    children?: React.ReactNode;
}

export function CookieSettingsTrigger({ className, children }: CookieSettingsTriggerProps) {
    const { setSettingsOpen } = useCookieConsent();

    return (
        <button
            onClick={() => setSettingsOpen(true)}
            className={className}
        >
            {children || "Cookie-Einstellungen"}
        </button>
    );
}
