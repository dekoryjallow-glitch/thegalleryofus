"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check, ArrowLeft, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import ShippingAddressModal from "@/components/preview/ShippingAddressModal";
import { Logo } from "@/components/Logo";
import { UserMenu } from "@/components/UserMenu";

const GELATO_PRODUCT_UID = "framed_poster_mounted_premium_400x400-mm-16x16-inch_black_wood_w20xt20-mm_plexiglass_400x400-mm-16x16-inch_200-gsm-80lb-coated-silk_4-0_hor";

function PreviewContent() {
  const searchParams = useSearchParams();
  const imgParam = searchParams.get("img");
  const imgUrl = imgParam ? decodeURIComponent(imgParam) : null;

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmCheckout = async (addressData: any) => {
    if (!imgUrl) return;
    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imgUrl,
          gelatoProductUid: GELATO_PRODUCT_UID,
          shippingAddress: {
            name: addressData.name,
            addressLine1: addressData.addressLine1,
            addressLine2: addressData.addressLine2,
            city: addressData.city,
            postal_code: addressData.postalCode, // Note snake_case for consistency with Stripe-like objects if needed, or mapping later
            country: addressData.country,
            state: "" // Optional/Auto-detected usually
          },
          customerEmail: addressData.email
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = `/login?redirect=${encodeURIComponent(window.location.href)}`;
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Checkout fehlgeschlagen");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Keine Checkout-URL erhalten.");
      }
    } catch (error: any) {
      console.error("[Checkout] Error:", error);
      // Hier könnte man ein schöneres Toast-UI nutzen
      alert(`Entschuldigung, es gab ein Problem beim Starten des Bezahlvorgangs: ${error.message}. Bitte versuche es erneut.`);
      setIsCheckingOut(false);
    }
  };

  if (!imgUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-terracotta-500" />
          <p className="font-serif italic text-gray-500">Dein Unikat wird vorbereitet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 text-gray-900 font-sans selection:bg-terracotta-500/30 selection:text-terracotta-900">
      <header className="p-6 md:px-12 flex items-center justify-between sticky top-0 bg-cream-50/80 backdrop-blur-md z-40 border-b border-cream-200/50">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo className="h-6 md:h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-6">
          <UserMenu />
          <Link href="/create" className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-terracotta-500 transition-colors flex items-center gap-2">
            <ArrowLeft className="w-3 h-3" /> Zurück
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* VISUAL PREVIEW - Mobile First (Top) */}
          <div className="space-y-8 animate-fade-in group">
            <div className="relative w-full aspect-square bg-white shadow-2xl overflow-hidden rounded-sm border-[12px] md:border-[20px] border-gray-900 ring-1 ring-black/5">
              {/* Inner White Matte */}
              <div className="absolute inset-0 border-[20px] md:border-[40px] border-white flex items-center justify-center">
                <div className="relative w-full h-full bg-cream-50 overflow-hidden shadow-inner">
                  <Image
                    src={imgUrl}
                    alt="Dein Kunstwerk"
                    fill
                    className="object-contain p-4 md:p-8 transition-transform duration-1000 group-hover:scale-110"
                    unoptimized
                  />
                  {/* Subtle Glass Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-40 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Thumbnails removed for focus */}
          </div>

          {/* PRODUCT INFOS */}
          <div className="space-y-10 lg:pt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-terracotta-600 font-bold text-[10px] uppercase tracking-[0.3em]">
                <Sparkles className="w-3 h-3" /> Einzigartiges Meisterwerk
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 leading-[1.1]">
                Die Ewige <br /><span className="italic text-gray-400 font-normal">Verbindung.</span>
              </h1>
              <p className="text-gray-500 text-lg font-light leading-relaxed">
                Handkuratiertes One-Line Kunstwerk, basierend auf euren Merkmalen. Ein minimalistisches Statement für dein Zuhause.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 py-8 border-y border-cream-200">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Format</p>
                <p className="text-lg font-serif">40 x 40 cm</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Druck</p>
                <p className="text-lg font-serif">Museumsqualität</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Rahmen</p>
                <p className="text-lg font-serif">Echtholz (Schwarz)</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Material</p>
                <p className="text-lg font-serif">200g Archivpapier</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Preis inkl. MwSt.</p>
                  <p className="text-4xl md:text-5xl font-serif font-bold">74,90 €</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-terracotta-500 font-bold uppercase tracking-widest">Kostenloser Versand</p>
                  <p className="text-xs text-gray-400">Lieferzeit: 3-5 Werktage</p>
                </div>
              </div>

              <Button
                onClick={() => setIsModalOpen(true)}
                disabled={isCheckingOut}
                className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white h-16 rounded-full text-xl shadow-2xl shadow-terracotta-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Bereite Versand vor...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Jetzt bestellen</span>
                  </>
                )}
              </Button>

              <div className="text-center">
                <Link href="/create" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-terracotta-600 transition-colors py-2">
                  <span>Neu generieren</span>
                </Link>
              </div>

              <ShippingAddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleConfirmCheckout}
                isLoading={isCheckingOut}
              />

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <ShieldCheck className="w-5 h-5 text-gray-400" />
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Sicher Zahlen</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Schneller Druck</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Globaler Versand</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta-500" />
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}