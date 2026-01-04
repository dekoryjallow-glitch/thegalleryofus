"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/Button";
import { Lock, Camera, RefreshCw, UploadCloud } from "lucide-react";

import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";

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
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo className="h-6 md:h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-6">
          <UserMenu />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 md:py-16">

        {/* Header Section - Emotional & Clear */}
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Erschaffe euer Unikat
          </h1>
          <p className="text-gray-500 font-light text-lg md:text-xl max-w-xl mx-auto">
            Zwei Fotos. Ein Kunstwerk. In wenigen Sekunden bereit.
          </p>
        </div>

        {/* Upload Grid - Structured Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">

          <div className="space-y-3">
            <UploadSlot
              number={1}
              label="Partner 1"
              file={file1}
              preview={preview1}
              onChange={(f: File) => handleFile(f, 1)}
            />
            <p className="text-center text-xs text-gray-400 font-medium">
              Ein einfaches Selfie reicht völlig aus.
            </p>
          </div>

          <div className="space-y-3">
            <UploadSlot
              number={2}
              label="Partner 2"
              file={file2}
              preview={preview2}
              onChange={(f: File) => handleFile(f, 2)}
            />
            <p className="text-center text-xs text-gray-400 font-medium">
              Hintergrund & Licht sind egal.
            </p>
          </div>

        </div>

        {/* CTA Section - Trust & Action */}
        <div className="flex flex-col items-center gap-6 max-w-md mx-auto">

          {/* Trust Signal */}
          <div className="flex items-center gap-2 text-gray-400">
            <Lock className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Fotos werden privat verarbeitet
            </span>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!file1 || !file2 || isLoading}
            className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white h-auto py-4 px-8 rounded-full shadow-2xl shadow-terracotta-500/20 disabled:bg-cream-200 disabled:text-gray-400 disabled:shadow-none transition-all active:scale-95 group relative overflow-hidden"
          >
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">
                {isLoading ? "Verbindung wird aufgebaut..." : "Meisterwerk erschaffen"}
              </span>
              {!isLoading && (
                <span className="text-[10px] opacity-80 font-normal mt-0.5">
                  Dauer: ca. 60 Sekunden
                </span>
              )}
            </div>
            {!isLoading && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            )}
          </Button>

        </div>
      </main>

      {/* Mobile Sticky CTA */}
      {(!file1 || !file2) && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-30 animate-fade-in-up">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-cream-200 text-center">
            <p className="text-xs font-bold text-gray-900 mb-1">
              Schritt {file1 ? '2' : '1'} von 2
            </p>
            <p className="text-[10px] text-gray-500 font-medium">
              {!file1 ? 'Wähle das erste Foto aus.' : 'Wähle das zweite Foto aus.'}
            </p>
          </div>
        </div>
      )}

      {isLoading && <LoadingScreen progress={loadingProgress} />}
    </div>
  );
}

interface UploadSlotProps {
  number: number;
  label: string;
  file: File | null;
  preview: string | null;
  onChange: (file: File) => void;
}

function UploadSlot({ number, label, file, preview, onChange }: UploadSlotProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={`group relative w-full aspect-[4/5] rounded-[2rem] transition-all duration-300 cursor-pointer overflow-hidden ${preview
          ? 'ring-4 ring-terracotta-500/10 shadow-lg'
          : 'bg-white border-2 border-dashed border-cream-200 hover:border-terracotta-300 hover:bg-cream-50'
        }`}
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

      {/* Step Badge */}
      <div className={`absolute top-4 left-4 z-20 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${preview ? 'bg-white text-terracotta-500' : 'bg-cream-100 text-gray-400 group-hover:bg-terracotta-100 group-hover:text-terracotta-600'
        }`}>
        {number}
      </div>

      {preview ? (
        <>
          <Image
            src={preview}
            alt="Upload Preview"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Overlay confirming success & allowing change */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
            <RefreshCw className="w-8 h-8 mb-2 drop-shadow-md" />
            <span className="font-bold text-sm tracking-wide">Foto wechseln</span>
          </div>
          <div className="absolute bottom-4 right-4 bg-terracotta-500 text-white p-2 rounded-full shadow-lg md:hidden">
            <RefreshCw className="w-4 h-4" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-cream-100 mb-4 flex items-center justify-center text-terracotta-400 group-hover:scale-110 group-hover:bg-terracotta-100 group-hover:text-terracotta-600 transition-all duration-300">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
            {label}
          </h3>
          <span className="text-xs font-bold text-terracotta-500 uppercase tracking-widest opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            Foto wählen
          </span>
        </div>
      )}
    </div>
  );
}

