"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check, ArrowLeft, Loader2 } from "lucide-react";
import { useState, Suspense } from "react";

// Die exakte UID für das Fulfillment später
const GELATO_PRODUCT_UID = "framed_poster_mounted_premium_400x400-mm-16x16-inch_black_wood_w20xt20-mm_plexiglass_400x400-mm-16x16-inch_200-gsm-80lb-coated-silk_4-0_hor";

function PreviewContent() {
  const searchParams = useSearchParams();
  // Wir unterstützen Fallback, falls Nano-Banana mal ein Array oder String liefert
  const imgParam = searchParams.get("img"); 
  const imgUrl = imgParam ? decodeURIComponent(imgParam) : null;
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!imgUrl) {
      alert("Kein Bild gefunden. Bitte gehe zurück und erstelle ein neues Kunstwerk.");
      return;
    }

    setIsCheckingOut(true);

    try {
      console.log("[Checkout] Starting checkout process...", { imageUrl: imgUrl?.substring(0, 50), gelatoProductUid: GELATO_PRODUCT_UID });
      
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: imgUrl,
          gelatoProductUid: GELATO_PRODUCT_UID,
        }),
      });

      console.log("[Checkout] Response status:", response.status, response.statusText);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
          console.error("[Checkout] Error response:", errorData);
        } catch (parseError) {
          console.error("[Checkout] Could not parse error response");
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        // Wenn Unauthorized, leite zum Login weiter
        if (response.status === 401 || errorData.error === "Unauthorized") {
          console.log("[Checkout] User not authenticated, redirecting to login");
          const currentUrl = encodeURIComponent(window.location.href);
          window.location.href = `/login?redirect=${currentUrl}`;
          return;
        }
        
        // Wenn 404, zeige spezifische Fehlermeldung
        if (response.status === 404) {
          console.error("[Checkout] 404 Error - Route not found");
          alert("Die Checkout-Route wurde nicht gefunden. Bitte kontaktiere den Support oder versuche es später erneut.");
          setIsCheckingOut(false);
          return;
        }
        
        throw new Error(errorData.error || errorData.details || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("[Checkout] Success response:", { hasUrl: !!data.url, sessionId: data.sessionId });
      
      if (data.url) {
        // Zeige Ladeanzeige während der Weiterleitung
        console.log("[Checkout] Redirecting to Stripe Checkout:", data.url);
        
        // Kurze Verzögerung für bessere UX (zeigt "Weiterleitung zu Stripe..." an)
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Redirect zu Stripe Checkout - Stripe leitet nach Zahlung automatisch zur Success Page weiter
        window.location.href = data.url;
      } else {
        console.error("[Checkout] No URL in response:", data);
        throw new Error("Keine Checkout-URL erhalten. Bitte versuche es erneut.");
      }
    } catch (error: any) {
      console.error("[Checkout] Error:", error);
      const errorMessage = error.message || "Unbekannter Fehler";
      alert(`Fehler beim Checkout: ${errorMessage}`);
      setIsCheckingOut(false);
    }
  };

  if (!imgUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <p className="text-lg mb-4">Lade Kunstwerk...</p>
          <Link href="/create" className="text-blue-500 hover:underline">
            Zurück zum Start
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans selection:bg-black selection:text-white">
      {/* Simple Header */}
      <header className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-[#FDFBF7]/80 backdrop-blur-md z-10">
        <span className="font-serif text-2xl font-bold tracking-tighter">The Gallery of Us</span>
        <Link href="/create" className="text-sm font-medium hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Zurück zum Start
        </Link>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-12 lg:p-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* MOCKUP SECTION - Der visuelle Hero */}
          <div className="relative w-full flex justify-center bg-white p-12 rounded-sm shadow-sm border border-gray-100">
            {/* Der Rahmen-Simulator */}
            <div className="relative w-full max-w-[500px] aspect-square bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border-[16px] border-[#1a1a1a]">
              {/* Passepartout (Weißer Innenrand) */}
              <div className="absolute inset-0 border-[24px] border-white">
                {/* Das Kunstwerk */}
                <div className="relative w-full h-full bg-gray-50 overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt="Dein personalisiertes Kunstwerk"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {/* Leichter Glanz-Effekt für das Plexiglas */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-30 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="space-y-8">
            <div>
              <div className="inline-block bg-black text-white text-xs px-2 py-1 mb-4 tracking-widest uppercase font-bold">Unikat</div>
              <h1 className="text-4xl md:text-6xl font-serif leading-[1.1] mb-4">
                The Connected Soul
              </h1>
              <p className="text-xl text-gray-500 font-light">
                Abstract Continuous Line Art
              </p>
            </div>

            <div className="border-t border-b border-gray-200 py-6 space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span>Format</span>
                <span className="font-medium">40 x 40 cm</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span>Rahmen</span>
                <span className="font-medium">Echtholz (Schwarz)</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span>Papier</span>
                <span className="font-medium">200g/m² Premium Silk</span>
              </div>
            </div>

            <div className="flex items-end justify-between">
               <div>
                 <p className="text-sm text-gray-400 mb-1">Preis inkl. MwSt.</p>
                 <p className="text-4xl font-serif">49,00 €</p>
               </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-black text-white h-16 rounded-none text-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 relative overflow-hidden"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Weiterleitung zu Stripe...</span>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div className="h-full bg-white animate-pulse" style={{ width: '100%' }} />
                  </div>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Jetzt bestellen
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-2">
              <Check className="w-3 h-3" /> Kostenloser Versand innerhalb Deutschlands
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <p>Lädt...</p>
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
}