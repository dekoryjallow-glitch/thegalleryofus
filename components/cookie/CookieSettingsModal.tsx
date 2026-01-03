"use client";

import { useCookieConsent } from "@/components/providers/CookieConsentProvider";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function CookieSettingsModal() {
    const { isSettingsOpen, setSettingsOpen, consent, setConsent } = useCookieConsent();

    const [localPreferences, setLocalPreferences] = useState({
        analytics: false,
        marketing: false
    });

    // Sync local state with global consent when modal opens
    useEffect(() => {
        if (isSettingsOpen && consent) {
            setLocalPreferences({
                analytics: consent.analytics,
                marketing: consent.marketing
            });
        } else if (isSettingsOpen && !consent) {
            // Default if null
            setLocalPreferences({
                analytics: false,
                marketing: false
            })
        }
    }, [isSettingsOpen, consent]);

    const handleSave = () => {
        setConsent({
            essential: true,
            analytics: localPreferences.analytics,
            marketing: localPreferences.marketing
        });
    };

    if (!isSettingsOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-cream-100 bg-cream-50/50">
                    <h3 className="font-serif text-2xl font-bold text-gray-900">Cookie-Einstellungen</h3>
                    <button
                        onClick={() => setSettingsOpen(false)}
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-8 max-h-[60vh] overflow-y-auto">

                    <p className="text-gray-500 text-sm">
                        Hier kannst du im Detail entscheiden, welche Cookies wir setzen dürfen.
                        Wir speichern deine Auswahl für deinen nächsten Besuch.
                    </p>

                    {/* Essential */}
                    <div className="flex gap-4 items-start">
                        <div className="shrink-0 mt-1">
                            <input
                                type="checkbox"
                                checked={true}
                                disabled
                                className="w-5 h-5 text-gray-400 border-gray-300 rounded focus:ring-gray-500 cursor-not-allowed opacity-50"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="font-bold text-gray-900 block">Essenziell (Immer aktiv)</span>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Diese Cookies sind notwendig, damit die Website funktioniert (z.B. Warenkorb, Login, Sicherheit, Stripe-Zahlungen). Ohne diese Cookies können wir unsere Dienste nicht anbieten.
                            </p>
                        </div>
                    </div>

                    {/* Analytics */}
                    <div className="flex gap-4 items-start bg-cream-50/30 p-2 -m-2 rounded-md hover:bg-cream-50/60 transition-colors">
                        <div className="shrink-0 mt-1">
                            <input
                                type="checkbox"
                                checked={localPreferences.analytics}
                                onChange={(e) => setLocalPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                                className="w-5 h-5 text-terracotta-600 border-gray-300 rounded focus:ring-terracotta-500 cursor-pointer"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="font-bold text-gray-900 block">Statistik & Analyse</span>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Helfen uns zu verstehen, wie Besucher mit der Website interagieren (anonymisiert).
                                Das ermöglicht es uns, Fehler zu finden und das Nutzererlebnis zu verbessern.
                            </p>
                        </div>
                    </div>

                    {/* Marketing */}
                    <div className="flex gap-4 items-start p-2 -m-2 rounded-md hover:bg-cream-50/60 transition-colors">
                        <div className="shrink-0 mt-1">
                            <input
                                type="checkbox"
                                checked={localPreferences.marketing}
                                onChange={(e) => setLocalPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                                className="w-5 h-5 text-terracotta-600 border-gray-300 rounded focus:ring-terracotta-500 cursor-pointer"
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="font-bold text-gray-900 block">Marketing</span>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Werden genutzt, um dir relevantere Inhalte anzuzeigen. Aktuell nutzen wir keine externen Marketing-Pixel, aber diese Einstellung gilt für zukünftige Dienste.
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-cream-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={() => setSettingsOpen(false)}
                        className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Abbrechen
                    </button>
                    <Button
                        onClick={handleSave}
                        className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-sm shadow-lg"
                    >
                        Einstellungen speichern
                    </Button>
                </div>

            </div>
        </div>
    );
}
