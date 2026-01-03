"use client";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CookieBanner() {
    const { isBannerOpen, acceptAll, declineAll, setSettingsOpen } = useCookieConsent();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isBannerOpen) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6 animate-slide-up">
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md border border-cream-200 shadow-2xl rounded-sm p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center">

                <div className="flex-1 space-y-3">
                    <h4 className="font-serif text-lg font-bold text-gray-900">Deine Privatsphäre</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Wir nutzen Cookies, um dir ein funktionierendes und schönes Erlebnis in unserer Galerie zu ermöglichen.
                        Einige sind essenziell, andere helfen uns, &quot;The Gallery of Us&quot; besser zu verstehen.
                        Du entscheidest, was wir speichern dürfen.
                        <br />
                        <Link href="/datenschutz" className="text-terracotta-600 underline underline-offset-2 hover:text-terracotta-700 mt-1 inline-block">
                            Mehr in der Datenschutzerklärung
                        </Link>
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                    <button
                        onClick={() => setSettingsOpen(true)}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 rounded-sm hover:border-gray-400"
                    >
                        Einstellungen
                    </button>

                    <button
                        onClick={declineAll}
                        className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-900 hover:text-terracotta-600 transition-colors border border-gray-300 rounded-sm hover:border-terracotta-500"
                    >
                        Ablehnen
                    </button>

                    <Button
                        onClick={acceptAll}
                        variant="primary"
                        className="bg-gray-900 hover:bg-black text-white text-xs !px-6 !py-2 uppercase tracking-widest rounded-sm"
                    >
                        Alle akzeptieren
                    </Button>
                </div>
            </div>
        </div>
    );
}
