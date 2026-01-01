"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, CheckCircle, Clock, XCircle } from "lucide-react";

interface Order {
  id: string;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  gelato_order_status: string | null;
  amount_cents: number;
  currency: string;
  image_url: string | null;
  shipping_address: any;
  created_at: string;
  paid_at: string | null;
  gelato_order_id: string | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError("Bitte melde dich an, um deine Bestellungen zu sehen.");
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setOrders(data || []);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Fehler beim Laden der Bestellungen");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "fulfilled":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-600" />;
    }
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
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <p className="text-lg">Lade Bestellungen...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <Link href="/create" className="text-blue-500 hover:underline">
            Zurück zum Start
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black font-sans">
      <header className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-[#FDFBF7]/80 backdrop-blur-md z-10">
        <span className="font-serif text-2xl font-bold tracking-tighter">The Gallery of Us</span>
        <Link href="/create" className="text-sm font-medium hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Zurück zum Start
        </Link>
      </header>

      <main className="max-w-6xl mx-auto p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-serif mb-8">Meine Bestellungen</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">Noch keine Bestellungen</p>
            <Link
              href="/create"
              className="inline-block bg-black text-white px-8 py-3 rounded-none font-medium hover:bg-gray-800 transition-all"
            >
              Erstelle dein erstes Kunstwerk
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Bild */}
                  {order.image_url && (
                    <div className="relative w-full aspect-square bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={order.image_url}
                        alt="Bestelltes Kunstwerk"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-serif mb-2">
                          Bestellung #{order.id.substring(0, 8)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-serif mb-2">
                          {formatPrice(order.amount_cents, order.currency)}
                        </p>
                        <div className="flex items-center gap-2 justify-end">
                          {getStatusIcon(order.status)}
                          <span className="text-sm font-medium">
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Gelato Status */}
                    {order.gelato_order_id && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <p className="text-sm text-blue-900">
                          <strong>Gelato Order:</strong> {order.gelato_order_id}
                        </p>
                        {order.gelato_order_status && (
                          <p className="text-sm text-blue-700 mt-1">
                            Status: {order.gelato_order_status}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Versandadresse */}
                    {order.shipping_address && (
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm font-semibold mb-2">Versandadresse:</p>
                        <p className="text-sm text-gray-600">
                          {order.shipping_address.name}
                          <br />
                          {order.shipping_address.addressLine1}
                          {order.shipping_address.addressLine2 && (
                            <>
                              <br />
                              {order.shipping_address.addressLine2}
                            </>
                          )}
                          <br />
                          {order.shipping_address.zipCode} {order.shipping_address.city}
                          {order.shipping_address.state && (
                            <>
                              <br />
                              {order.shipping_address.state}
                            </>
                          )}
                          <br />
                          {order.shipping_address.country}
                        </p>
                      </div>
                    )}

                    {order.paid_at && (
                      <p className="text-xs text-gray-500">
                        Bezahlt am: {formatDate(order.paid_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


