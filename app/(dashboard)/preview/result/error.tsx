"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Etwas ist schief gelaufen</h2>
        <p className="text-gray-500 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  );
}





