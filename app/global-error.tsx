"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold">Da ist etwas schief gelaufen.</h2>
                        <p className="text-gray-600">{error.message || "Ein unerwarteter Fehler ist aufgetreten."}</p>
                        <button
                            onClick={() => reset()}
                            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Erneut versuchen
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
