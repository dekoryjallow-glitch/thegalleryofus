"use client";
// Sehr simple Preview Page für den Test
export default function PreviewPage({ params }: { params: { generationId: string } }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-white text-black">
      <h1 className="text-4xl font-serif mb-8">Dein Kunstwerk</h1>
      <div className="p-4 border-2 border-black rounded-lg">
        <p>Generierung erfolgreich! (Bild-Anzeige folgt im nächsten Schritt)</p>
        <p className="text-sm text-gray-500 mt-2">ID: {params.generationId}</p>
      </div>
      <a href="/create" className="mt-8 underline">Neues erstellen</a>
    </div>
  );
}
