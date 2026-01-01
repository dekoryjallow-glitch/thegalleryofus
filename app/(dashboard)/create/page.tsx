"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/Button";

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
    setLoadingProgress(5);

    try {
      const formData = new FormData();
      formData.append("selfie1", file1);
      formData.append("selfie2", file2);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

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
        if (fetchError.name === 'AbortError') {
          throw new Error("Timeout: Der Server antwortet nicht.");
        }
        throw new Error(`Netzwerkfehler: ${fetchError.message}`);
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Upload fehlgeschlagen");
      }

      const data = await res.json();
      const { replicateId } = data;

      if (!replicateId) {
        throw new Error("Replicate ID nicht erhalten");
      }

      setReplicateId(replicateId);
      setLoadingProgress(15);

      const maxAttempts = 600;
      let attempts = 0;

      const pollInterval = setInterval(async () => {
        attempts++;
        setLoadingProgress(prev => {
          if (prev >= 90) return prev;
          return Math.min(90, prev + (prev < 50 ? 2 : prev < 80 ? 1 : 0.2));
        });

        try {
          const pollRes = await fetch(`/api/poll?id=${replicateId}&t=${Date.now()}`);
          if (!pollRes.ok) throw new Error("Status-Abruf fehlgeschlagen");

          const pollData = await pollRes.json();
          let imageUrl = null;

          if (pollData.output) {
            if (Array.isArray(pollData.output)) {
              imageUrl = pollData.output[0];
            } else {
              imageUrl = pollData.output;
            }
          }

          const isCompleted = pollData.status === "succeeded" || pollData.status === "completed" || !!pollData.completed_at;

          if (imageUrl && isCompleted) {
            clearInterval(pollInterval);
            setIsLoading(false);
            router.push(`/preview/result?img=${encodeURIComponent(imageUrl)}`);
          } else if (pollData.status === "failed" || pollData.error) {
            clearInterval(pollInterval);
            setIsLoading(false);
            alert(`Fehler: ${pollData.error || "Generierung fehlgeschlagen"}`);
          } else if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setIsLoading(false);
            alert("Timeout erreicht.");
          }
        } catch (err) {
          clearInterval(pollInterval);
          setIsLoading(false);
          alert("Fehler beim Abrufen des Status.");
        }
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setIsLoading(false);
      alert(error.message || "Fehler beim Erstellen.");
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 text-gray-900 font-sans selection:bg-terracotta-500/30 selection:text-terracotta-900">
      <header className="py-6 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-cream-50/80 backdrop-blur-md z-40">
        <Link href="/" className="font-serif text-xl font-bold flex items-center gap-2 group">
          <span className="w-8 h-8 bg-terracotta-500 rounded-full flex items-center justify-center text-white text-sm font-serif italic transition-transform group-hover:rotate-12">G</span>
          <span className="hidden sm:inline">The Gallery of Us</span>
        </Link>
        <Link href="/" className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-terracotta-500 transition-colors">
          Abbrechen
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Euer Unikat beginnt hier
          </h1>
          <p className="text-gray-500 font-light text-lg md:text-xl max-w-xl mx-auto">
            Lade zwei Porträts hoch, um eure Geschichte in einer einzigen Linie zu verewigen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
          <UploadSlot
            label="Partner 1"
            file={file1}
            preview={preview1}
            onChange={(f: File) => handleFile(f, 1)}
          />
          <UploadSlot
            label="Partner 2"
            file={file2}
            preview={preview2}
            onChange={(f: File) => handleFile(f, 2)}
          />
        </div>

        <div className="flex flex-col items-center gap-8">
          <Button
            onClick={handleGenerate}
            disabled={!file1 || !file2 || isLoading}
            className="bg-terracotta-500 hover:bg-terracotta-600 text-white !px-16 !py-5 rounded-full text-xl shadow-2xl shadow-terracotta-500/20 disabled:bg-cream-200 disabled:text-gray-400 transition-all active:scale-95 flex items-center gap-3"
          >
            {isLoading ? "Verbindung wird aufgebaut..." : "Meisterwerk erschaffen"}
            {!isLoading && (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            )}
          </Button>

          <div className="flex items-center gap-4 py-4 px-6 bg-white/50 rounded-full border border-cream-200">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                  <div className="w-full h-full bg-terracotta-100" />
                </div>
              ))}
            </div>
            <p className="text-[10px] md:text-xs text-gray-500 font-medium uppercase tracking-[0.1em]">Über 12k Kunstwerke generiert</p>
          </div>
        </div>
      </main>

      {/* Mobile Sticky CTA for better UX on small screens */}
      {(!file1 || !file2) && (
        <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-full px-6 z-30 transition-all duration-500 animate-bounce">
          <div className="bg-white p-4 rounded-2xl shadow-2xl border border-cream-200 text-center">
            <p className="text-[10px] text-terracotta-500 font-bold uppercase tracking-widest mb-1">Upload erforderlich</p>
            <p className="text-xs text-gray-400">Bitte wähle zwei Fotos aus.</p>
          </div>
        </div>
      )}

      {isLoading && <LoadingScreen progress={loadingProgress} />}
    </div>
  );
}

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
      onClick={() => inputRef.current?.click()}
      className={`group relative overflow-hidden rounded-2xl aspect-[3/4] transition-all duration-500 cursor-pointer border-2 ${preview
        ? 'border-terracotta-500/30'
        : 'border-dashed border-cream-200 bg-white hover:bg-cream-50 hover:border-terracotta-400/50'
        }`}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        capture="user"
        onChange={(e) => {
          e.target.files?.[0] && onChange(e.target.files[0]);
        }}
      />

      {preview ? (
        <>
          <Image src={preview} alt="Upload Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-white text-black px-4 py-2 rounded-full text-xs font-bold uppercase transition-all transform translate-y-4 group-hover:translate-y-0">
              Bild ändern
            </span>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4 transition-transform group-hover:scale-105">
          <div className="w-12 h-12 rounded-full bg-cream-50 flex items-center justify-center text-terracotta-500 group-hover:bg-terracotta-500 group-hover:text-white transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </div>
          <div className="space-y-1">
            <p className="font-serif text-xl font-bold">{label}</p>
            <p className="text-gray-400 text-xs">Foto hochladen</p>
          </div>
        </div>
      )}

      {/* Label Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${preview ? 'bg-terracotta-500 text-white shadow-lg' : 'bg-cream-100 text-gray-500'
          }`}>
          {preview ? 'Bereit' : slotLabel(label)}
        </span>
      </div>
    </div>
  );
}

function slotLabel(label: string) {
  return label === "Partner 1" ? "Eins" : "Zwei";
}
