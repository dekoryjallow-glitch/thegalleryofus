"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowLeft, Package, Clock, Truck, CheckCircle2, Circle } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  status: string;
  amount_cents: number;
  currency: string;
  image_url: string | null;
  shipping_address: any;
  gelato_order_id: string | null;
  gelato_order_status: string | null;
  created_at: string;
  paid_at: string | null;
}

import { Logo } from "@/components/Logo";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError("Bitte melde dich an, um deine Bestellung zu sehen.");
          setLoading(false);
          return;
        }

        // Hole Order basierend auf stripe_checkout_id (session_id)
        const { data, error: fetchError } = await supabase
          .from("orders")
          .select("*")
          .eq("stripe_checkout_id", sessionId)
          .eq("user_id", user.id)
          .single();

        if (fetchError) {
          console.error("Error fetching order:", fetchError);
          setError("Bestellung nicht gefunden.");
        } else {
          setOrder(data);
        }
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || "Fehler beim Laden der Bestellung");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [sessionId]);

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Ausstehend";
      case "paid":
        return "Bezahlt";
      case "fulfilled":
        return "Erfüllt";
      case "cancelled":
        return "Storniert";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans">
      <header className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-[#FDFBF7]/80 backdrop-blur-md z-10">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo className="h-6 md:h-8 w-auto" />
        </Link>
      </header>

      <main className="max-w-4xl mx-auto p-8 md:p-12">
        <div className="space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-serif mb-4">
                Bestellung erfolgreich!
              </h1>
              <p className="text-xl text-gray-600">
                Vielen Dank für deine Bestellung.
              </p>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Lade Bestelldetails...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {order && (
            <div className="space-y-6">
              {/* Order Details Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-serif mb-6">Bestelldetails</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Order Info */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Bestellnummer</p>
                      <p className="font-mono text-lg font-semibold">#{order.id.substring(0, 8).toUpperCase()}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      <p className="text-lg font-medium">{getStatusText(order.status)}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Bestelldatum</p>
                      <p className="text-lg">{formatDate(order.created_at)}</p>
                    </div>

                    {order.paid_at && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Bezahlt am</p>
                        <p className="text-lg">{formatDate(order.paid_at)}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Gesamtbetrag</p>
                      <p className="text-3xl font-serif">{formatPrice(order.amount_cents, order.currency)}</p>
                    </div>
                  </div>

                  {/* Right: Image Preview */}
                  {order.image_url && (
                    <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={order.image_url}
                        alt="Dein Kunstwerk"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shipping_address && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Versandadresse
                  </h3>
                  <div className="text-gray-700">
                    <p className="font-semibold mb-2">{order.shipping_address.name}</p>
                    <p>{order.shipping_address.addressLine1}</p>
                    {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                    <p>{order.shipping_address.zipCode} {order.shipping_address.city}</p>
                    {order.shipping_address.state && <p>{order.shipping_address.state}</p>}
                    <p className="mt-2">{order.shipping_address.country}</p>
                  </div>
                </div>
              )}

              {/* Gelato Status */}
              {order.gelato_order_id && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-xl font-serif mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Produktionsstatus
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Gelato Order ID:</strong> {order.gelato_order_id}
                    </p>
                    {order.gelato_order_status && (
                      <p className="text-sm text-gray-600">
                        <strong>Status:</strong> {order.gelato_order_status}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Zeitplan
                </h3>
                <div className="space-y-4">
                  {/* Step 1: Order Received */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Bestellung erhalten</p>
                      <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                      <p className="text-sm text-gray-500 mt-1">Deine Bestellung wurde erfolgreich entgegengenommen.</p>
                    </div>
                  </div>

                  {/* Step 2: Payment */}
                  {order.paid_at && (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Zahlung erhalten</p>
                        <p className="text-sm text-gray-600">{formatDate(order.paid_at)}</p>
                        <p className="text-sm text-gray-500 mt-1">Deine Zahlung wurde erfolgreich verarbeitet.</p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Production */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.gelato_order_id ? "bg-blue-100" : "bg-gray-100"
                        }`}>
                        {order.gelato_order_id ? (
                          <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Produktion gestartet</p>
                      {order.gelato_order_id ? (
                        <>
                          <p className="text-sm text-gray-600">In Bearbeitung</p>
                          <p className="text-sm text-gray-500 mt-1">Dein Kunstwerk wird jetzt produziert.</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">Wird in Kürze gestartet...</p>
                      )}
                    </div>
                  </div>

                  {/* Step 4: Shipping */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Circle className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-400">Versand vorbereitet</p>
                      <p className="text-sm text-gray-500 mt-1">Nach der Produktion wird dein Kunstwerk verpackt und versendet.</p>
                    </div>
                  </div>

                  {/* Step 5: Delivered */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Circle className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-400">Zugestellt</p>
                      <p className="text-sm text-gray-500 mt-1">Dein Kunstwerk wird in 5-7 Werktagen bei dir ankommen.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <Package className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="text-left">
                    <h3 className="font-semibold text-blue-900 mb-2">Was passiert jetzt?</h3>
                    <p className="text-sm text-blue-800">
                      Deine Bestellung wurde erfolgreich entgegengenommen. Wir bereiten dein personalisiertes Kunstwerk vor und senden es dir in Kürze zu. Du erhältst eine E-Mail-Bestätigung mit allen Details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <Link
              href="/orders"
              className="flex-1 bg-black text-white px-8 py-4 rounded-none text-lg font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Meine Bestellungen
            </Link>
            <Link
              href="/create"
              className="flex-1 bg-white text-black border-2 border-black px-8 py-4 rounded-none text-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Neues Kunstwerk erstellen
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <p>Lädt...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

