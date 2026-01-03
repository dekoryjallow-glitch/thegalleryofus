"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type CookieConsent = {
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
};

type CookieConsentContextType = {
    consent: CookieConsent | null;
    setConsent: (consent: CookieConsent) => void;
    acceptAll: () => void;
    declineAll: () => void;
    isBannerOpen: boolean;
    setBannerOpen: (isOpen: boolean) => void;
    isSettingsOpen: boolean;
    setSettingsOpen: (isOpen: boolean) => void;
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const CONSENT_KEY = "gallery-cookie-consent-v1";

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
    const [consent, setConsentState] = useState<CookieConsent | null>(null);
    const [isBannerOpen, setBannerOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedConsent = localStorage.getItem(CONSENT_KEY);
        if (storedConsent) {
            setConsentState(JSON.parse(storedConsent));
        } else {
            setBannerOpen(true);
        }
    }, []);

    const saveConsent = (newConsent: CookieConsent) => {
        setConsentState(newConsent);
        localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
        setBannerOpen(false);
        setSettingsOpen(false);
    };

    const acceptAll = () => {
        saveConsent({ essential: true, analytics: true, marketing: true });
    };

    const declineAll = () => {
        saveConsent({ essential: true, analytics: false, marketing: false });
    };

    // Safe wrapper for setting consent manually (e.g. from settings modal)
    const setConsent = (newConsent: CookieConsent) => {
        saveConsent(newConsent);
    };

    if (!isMounted) {
        return null; // or simplified loading state
    }

    return (
        <CookieConsentContext.Provider
            value={{
                consent,
                setConsent,
                acceptAll,
                declineAll,
                isBannerOpen,
                setBannerOpen,
                isSettingsOpen,
                setSettingsOpen,
            }}
        >
            {children}
        </CookieConsentContext.Provider>
    );
}

export function useCookieConsent() {
    const context = useContext(CookieConsentContext);
    if (context === undefined) {
        throw new Error("useCookieConsent must be used within a CookieConsentProvider");
    }
    return context;
}
