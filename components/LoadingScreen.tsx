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
    "Kreativität erfordert Mut.",
    "Jeder Mensch ist ein Künstler.",
];

const STATUS_MESSAGES = [
    "Berühre die Leinwand...",
    "Analysiere eure Merkmale...",
    "Ziehe die endlose Linie...",
    "Verschmelze eure Seelen...",
    "Setze das Unikat zusammen...",
    "Finalisiere dein Meisterwerk...",
];

export default function LoadingScreen({ progress }: LoadingScreenProps) {
    const [quote, setQuote] = useState("");
    const [status, setStatus] = useState(STATUS_MESSAGES[0]);

    useEffect(() => {
        setQuote(ART_QUOTES[Math.floor(Math.random() * ART_QUOTES.length)]);
    }, []);

    useEffect(() => {
        if (progress < 15) setStatus(STATUS_MESSAGES[0]);
        else if (progress < 35) setStatus(STATUS_MESSAGES[1]);
        else if (progress < 55) setStatus(STATUS_MESSAGES[2]);
        else if (progress < 75) setStatus(STATUS_MESSAGES[3]);
        else if (progress < 90) setStatus(STATUS_MESSAGES[4]);
        else setStatus(STATUS_MESSAGES[5]);
    }, [progress]);

    return (
        <div className="fixed inset-0 z-[100] bg-cream-50 flex flex-col items-center justify-center p-8 transition-opacity duration-500">
            <div className="max-w-md w-full text-center space-y-16">

                {/* Animated Logo */}
                <div className="space-y-4">
                    <div className="w-16 h-16 bg-terracotta-500 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-serif italic animate-pulse shadow-lg shadow-terracotta-500/20">
                        G
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
                        The Gallery of Us
                    </h2>
                </div>

                {/* Progress Area */}
                <div className="space-y-6">
                    <div className="relative h-[2px] w-full bg-cream-200 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-terracotta-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(193,124,92,0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] text-terracotta-600 font-bold tracking-[0.3em] uppercase animate-pulse">{status}</span>
                        <span className="text-4xl font-serif font-light text-gray-300">{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* Quote */}
                <div className="opacity-60 max-w-sm mx-auto">
                    <p className="font-serif italic text-gray-500 text-lg leading-relaxed">
                        &ldquo;{quote}&rdquo;
                    </p>
                </div>

            </div>
        </div>
    );
}
