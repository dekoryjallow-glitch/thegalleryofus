"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
    progress: number; // 0 to 100
}

const ART_QUOTES = [
    "Kunst wäscht den Staub des Alltags von der Seele.",
    "Jedes Bild erzählt eine Geschichte.",
    "Schönheit liegt im Auge des Betrachters.",
    "Große Kunst entsteht aus dem Herzen.",
    "Kreativität erfordert Mut."
];

const STATUS_MESSAGES = [
    "Analysiere Gesichtszüge...",
    "Mische digitale Farben...",
    "Skizziere Konturen...",
    "Füge Banksy-Stil hinzu...",
    "Setze den finalen Farbakzent...",
    "Trockne die Tinte..."
];

export default function LoadingScreen({ progress }: LoadingScreenProps) {
    const [quote, setQuote] = useState("");
    const [status, setStatus] = useState(STATUS_MESSAGES[0]);

    useEffect(() => {
        // Zufälliges Zitat beim Start
        setQuote(ART_QUOTES[Math.floor(Math.random() * ART_QUOTES.length)]);
    }, []);

    useEffect(() => {
        // Status basierend auf Progress aktualisieren
        if (progress < 20) setStatus(STATUS_MESSAGES[0]);
        else if (progress < 40) setStatus(STATUS_MESSAGES[1]);
        else if (progress < 60) setStatus(STATUS_MESSAGES[2]);
        else if (progress < 80) setStatus(STATUS_MESSAGES[3]);
        else if (progress < 95) setStatus(STATUS_MESSAGES[4]);
        else setStatus(STATUS_MESSAGES[5]);
    }, [progress]);

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 transition-opacity duration-500">
            <div className="max-w-md w-full text-center space-y-12">

                {/* Logo / Brand Area */}
                <div className="space-y-2 animate-pulse">
                    <h2 className="text-3xl md:text-4xl font-serif text-black tracking-wider">
                        Gallery of Us
                    </h2>
                    <div className="h-0.5 w-24 bg-[#D4AF37] mx-auto rounded-full" />
                </div>

                {/* Progress Visualization */}
                <div className="space-y-4">
                    <div className="relative h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-[#D4AF37] transition-all duration-700 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 font-medium tracking-widest uppercase">
                        <span>{status}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* Inspirational Quote */}
                <div className="pt-8 opacity-80">
                    <p className="font-serif italic text-gray-500 text-lg leading-relaxed">
                        &ldquo;{quote}&rdquo;
                    </p>

                </div>

            </div>
        </div>
    );
}
