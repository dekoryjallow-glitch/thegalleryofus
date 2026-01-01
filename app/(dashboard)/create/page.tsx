"use client";

import { useState, useRef, useEffect } from "react";
// Wir nutzen hier einfache HTML-Elemente statt Icons, falls lucide Probleme macht
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

export default function CreatePage() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [replicateId, setReplicateId] = useState<string | null>(null);
  const router = useRouter();

  const handleFile = (file: File, slot: 1 | 2) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    if (slot === 1) {
      setFile1(file);
      setPreview1(url);
    } else {
      setFile2(file);
      setPreview2(url);
    }
  };

  const handleGenerate = async () => {
    if (!file1 || !file2) return;
    setIsLoading(true);
    setLoadingProgress(5); // Start progress
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:31', message: 'handleGenerate started', data: { hasFile1: !!file1, hasFile2: !!file2, file1Size: file1?.size, file2Size: file2?.size }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
    // #endregion

    try {
      const formData = new FormData();
      formData.append("selfie1", file1);
      formData.append("selfie2", file2);
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:38', message: 'FormData created, starting fetch to /api/generate', data: {}, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion

      // 1. Upload starten
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:42', message: 'Starting fetch to /api/generate', data: { url: '/api/generate', method: 'POST', file1Size: file1?.size, file2Size: file2?.size }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      const fetchStartTime = Date.now();

      // Erstelle einen AbortController für Timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 Sekunden Timeout

      let res;
      try {
        res = await fetch("/api/generate", {
          method: "POST",
          body: formData,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:52', message: 'Fetch to /api/generate failed', data: { error: fetchError?.message, errorName: fetchError?.name, isAbort: fetchError?.name === 'AbortError', timeElapsed: Date.now() - fetchStartTime }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
        // #endregion
        if (fetchError.name === 'AbortError') {
          throw new Error("Request timeout: Der Server hat nicht innerhalb von 60 Sekunden geantwortet. Bitte prüfe, ob der Server läuft.");
        }
        throw new Error(`Network error: ${fetchError.message || "Failed to fetch"}`);
      }
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:50', message: 'Fetch to /api/generate completed', data: { status: res.status, statusText: res.statusText, ok: res.ok, timeElapsed: Date.now() - fetchStartTime }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion

      if (!res.ok) {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:44', message: 'Fetch response not ok', data: { status: res.status, statusText: res.statusText }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
        // #endregion
        let errorData: any = {};
        try {
          errorData = await res.json();
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:47', message: 'Error data parsed from response', data: { error: errorData.error, errorName: errorData.errorName }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
          // #endregion
        } catch (parseError) {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:49', message: 'Failed to parse error response', data: { parseError: (parseError as any)?.message }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
          // #endregion
          // Ignore parse error
        }
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:54', message: 'Response data parsed', data: { hasGenerationId: !!data.generationId, hasReplicateId: !!data.replicateId, generationId: data.generationId, replicateId: data.replicateId }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      const { generationId, replicateId } = data;

      if (!replicateId) {
        throw new Error("Replicate ID nicht erhalten");
      }

      // Speichere replicateId im State für Fallback-Link
      setReplicateId(replicateId);

      console.log("✅ Generation started. Replicate ID:", replicateId);
      console.log("🔗 Check status on Replicate: https://replicate.com/p/" + replicateId);

      setLoadingProgress(15); // Upload done, generation starting

      // 2. Polling starten (Warten auf Ergebnis)
      const maxAttempts = 600; // 20 Minuten max (600 * 2s = 1200s) - nano-banana-pro kann sehr lange dauern
      let attempts = 0;

      const pollInterval = setInterval(async () => {
        attempts++;

        // Fake progress logic: Slowly increment to 90% while waiting
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          // Increment smaller amounts as we get higher to simulate "almost there"
          const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.2;
          return Math.min(90, prev + increment);
        });

        try {
          const pollRes = await fetch(`/api/poll?id=${replicateId}&t=${Date.now()}`);
          if (!pollRes.ok) {
            throw new Error("Fehler beim Abrufen des Status");
          }

          const pollData = await pollRes.json();

          // Prüfe ob Output verfügbar ist
          let imageUrl = null;

          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:77', message: 'Poll response received', data: { status: pollData.status, hasOutput: !!pollData.output, outputType: typeof pollData.output, completedAt: pollData.completed_at, allKeys: Object.keys(pollData) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
          // #endregion

          if (pollData.output !== null && pollData.output !== undefined) {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:82', message: 'Output is not null, extracting URL', data: { outputValue: pollData.output, outputIsArray: Array.isArray(pollData.output) }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
            // #endregion

            // Extrahiere Image URL aus Output (unabhängig vom Status)
            if (Array.isArray(pollData.output)) {
              // Output ist ein Array
              if (pollData.output.length > 0) {
                const firstOutput = pollData.output[0];
                if (typeof firstOutput === 'string') {
                  imageUrl = firstOutput;
                } else if (firstOutput && typeof firstOutput === 'object') {
                  imageUrl = firstOutput.url || firstOutput.image || firstOutput[0];
                }
              }
            } else if (typeof pollData.output === 'string') {
              // Output ist direkt ein String
              imageUrl = pollData.output;
            } else if (pollData.output && typeof pollData.output === 'object') {
              // Output ist ein Objekt
              imageUrl = pollData.output.url || pollData.output.image || pollData.output[0];
            }
          }
          // WICHTIG: Wir verwenden NUR pollData.output als Bild-URL!
          // urls.get ist die API-URL, NICHT die Bild-URL!
          // urls.stream ist ein Stream-Endpoint, NICHT die finale Bild-URL!
          // Wir warten, bis pollData.output verfügbar ist (wenn die Generierung fertig ist)

          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:118', message: 'After URL extraction', data: { extractedImageUrl: imageUrl?.substring(0, 100) || null, status: pollData.status, isCompleted: pollData.status === "succeeded" || pollData.status === "completed" || !!pollData.completed_at }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
          // #endregion

          // Nur alle 10 Versuche detailliert loggen, um die Konsole nicht zu überfluten
          if (attempts % 10 === 0 || attempts <= 5 || pollData.status === "succeeded" || pollData.status === "completed" || pollData.completed_at) {
            console.log(`[Poll #${attempts}] Status: "${pollData.status}", Has output: ${!!pollData.output}, Output type: ${typeof pollData.output}, Completed at: ${pollData.completed_at || 'null'}`);
            console.log("Raw output value:", pollData.output);
            if (pollData.output) {
              console.log("Full pollData.output:", JSON.stringify(pollData.output, null, 2));
            } else {
              console.log("⚠️ OUTPUT IS NULL/UNDEFINED - Full pollData keys:", Object.keys(pollData));
              if (pollData.urls) {
                console.log("⚠️ Checking urls field:", pollData.urls);
              }
            }
          }
          console.log("Extracted imageUrl:", imageUrl?.substring(0, 100) || "null");

          // Weiterleitung wenn:
          // 1. Output vorhanden ist UND (Status succeeded/completed ODER completed_at gesetzt)
          // WICHTIG: Wenn Output vorhanden ist, ist die Generierung fertig, auch wenn Status noch "processing" ist
          const isCompleted = pollData.status === "succeeded" || pollData.status === "completed" || !!pollData.completed_at;
          const hasOutput = !!imageUrl;

          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/c4b693a6-e4ee-4d58-9f0a-6cb5db0f1fcc', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'create/page.tsx:141', message: 'Checking completion status', data: { hasOutput: hasOutput, isCompleted: isCompleted, status: pollData.status, completedAt: pollData.completed_at, imageUrl: imageUrl?.substring(0, 100) || null }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
          // #endregion

          if (imageUrl && isCompleted) {
            console.log("✅ SUCCESS: Generierung abgeschlossen und imageUrl gefunden. Weiterleitung...");
            console.log("✅ ImageUrl:", imageUrl);
            clearInterval(pollInterval);
            setIsLoading(false);
            const encodedUrl = encodeURIComponent(imageUrl);

            try {
              router.push(`/preview/result?img=${encodedUrl}`);
              console.log("Router.push erfolgreich aufgerufen");
            } catch (routerError) {
              console.error("Router.push Fehler:", routerError);
              // Fallback: window.location verwenden
              window.location.href = `/preview/result?img=${encodedUrl}`;
            }
            return;
          } else if (imageUrl && !isCompleted) {
            // Fallback: Wenn Output vorhanden ist, aber Status noch nicht aktualisiert wurde
            // Das kann passieren, wenn die Generierung gerade fertig geworden ist
            // WICHTIG: Wenn Output vorhanden ist, ist die Generierung definitiv fertig!
            console.log("✅ Output vorhanden, aber Status noch nicht aktualisiert. Weiterleitung trotzdem...");
            console.log("✅ Status:", pollData.status, "Completed_at:", pollData.completed_at, "ImageUrl:", imageUrl?.substring(0, 100));
            clearInterval(pollInterval);
            setIsLoading(false);
            const encodedUrl = encodeURIComponent(imageUrl);

            try {
              router.push(`/preview/result?img=${encodedUrl}`);
              console.log("Router.push erfolgreich aufgerufen (mit Output vorhanden, aber Status noch processing)");
            } catch (routerError) {
              console.error("Router.push Fehler:", routerError);
              window.location.href = `/preview/result?img=${encodedUrl}`;
            }
            return;
          } else if (pollData.status === "failed" || pollData.error) {
            clearInterval(pollInterval);
            setIsLoading(false);
            console.error("❌ Generierung fehlgeschlagen:", pollData.error || "Unbekannter Fehler");
            alert(`Generierung fehlgeschlagen: ${pollData.error || "Unbekannter Fehler"}. Bitte versuche es erneut.`);
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setIsLoading(false);
            console.error("Timeout reached. Last pollData:", pollData);
            alert(`Timeout: Die Generierung dauert zu lange (${maxAttempts * 2} Sekunden). Bitte versuche es erneut oder prüfe die Generierung direkt auf Replicate.`);
          }
        } catch (err) {
          clearInterval(pollInterval);
          setIsLoading(false);
          console.error("Polling error:", err);
          alert("Fehler beim Polling. Bitte versuche es erneut.");
        }
      }, 2000);

    } catch (error) {
      console.error(error);
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : "Fehler beim Upload. Bitte versuche es erneut.";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black p-10 font-sans">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-xl">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">The Gallery of Us</h1>
          <p className="text-gray-500 text-xl">Zwei Bilder hochladen. Ein Kunstwerk erhalten.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          {/* Upload 1 */}
          <UploadSlot
            label="Partner 1"
            file={file1}
            preview={preview1}
            onChange={(f: File) => handleFile(f, 1)}
          />

          {/* Upload 2 */}
          <UploadSlot
            label="Partner 2"
            file={file2}
            preview={preview2}
            onChange={(f: File) => handleFile(f, 2)}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleGenerate}
            disabled={!file1 || !file2 || isLoading}
            className="bg-black text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-gray-800 disabled:bg-gray-300 transition-all"
          >
            {isLoading ? "Wird verarbeitet..." : "Kunstwerk generieren →"}
          </button>

          {isLoading && replicateId && (
            <div className="text-center text-sm text-gray-500">
              <p>Generierung läuft... Falls die Weiterleitung nicht automatisch erfolgt:</p>
              <a
                href={`https://replicate.com/p/${replicateId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Prüfe Status auf Replicate →
              </a>
            </div>
          )}
        </div>

      </div>


      {/* Loading Overlay */}
      {isLoading && <LoadingScreen progress={loadingProgress} />}
    </div>
  );
}

// Einfache Upload Komponente
interface UploadSlotProps {
  label: string;
  file: File | null;
  preview: string | null;
  onChange: (file: File) => void;
}

function UploadSlot({ label, file, preview, onChange }: UploadSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => {
        inputRef.current?.click();
      }}
      className="border-2 border-dashed border-gray-300 rounded-xl aspect-[3/4] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden"
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          e.target.files?.[0] && onChange(e.target.files[0]);
        }}
      />

      {preview ? (
        <Image src={preview} alt="Preview" fill className="object-cover" />
      ) : (
        <div className="text-center p-4">
          <p className="font-bold text-lg mb-2">{label}</p>
          <p className="text-gray-400 text-sm">Hier klicken zum Hochladen</p>
        </div>
      )}
    </div>
  );
}
