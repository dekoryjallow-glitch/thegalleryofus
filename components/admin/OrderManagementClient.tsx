"use client";

import { Copy, Check, ExternalLink, Search, Filter, Truck, X } from "lucide-react";
import { useState } from "react";

interface ShippingAddress {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    zipCode: string;
    state?: string;
    country: string;
    email?: string;
    phone?: string;
}

interface Order {
    id: string;
    status: string;
    amount_cents: number;
    currency: string;
    created_at: string;
    shipping_address: ShippingAddress | null;
    gelato_product_uid: string | null;
    image_url: string | null;
    user_email?: string; // We'll try to get this from the joined profile if available
}

export default function OrderManagementClient({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [trackingUrl, setTrackingUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shipping_address?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.shipping_address?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleCopy = (text: string, fieldId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
        }).format(cents / 100);
    };

    const handleShipOrder = async () => {
        if (!selectedOrder || !trackingNumber) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/admin/orders/ship", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    orderId: selectedOrder.id,
                    trackingNumber,
                    trackingUrl,
                }),
            });

            if (!response.ok) throw new Error("Failed to ship order");

            // Update local state
            setOrders(orders.map(o =>
                o.id === selectedOrder.id
                    ? { ...o, status: "fulfilled" }
                    : o
            ));

            setSelectedOrder(null);
            setTrackingNumber("");
            setTrackingUrl("");
        } catch (error) {
            console.error(error);
            alert("Fehler beim Versenden der Bestellung.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Bestellungen verwalten</h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Suche nach ID, Name oder E-Mail..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 w-full md:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Alle Status</option>
                        <option value="paid">Bezahlt</option>
                        <option value="pending">Ausstehend</option>
                        <option value="fulfilled">Abgeschlossen</option>
                        <option value="cancelled">Storniert</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Bestellung / Datum</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Kunde / Versand</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Betrag</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Fulfillment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors align-top">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">#{order.id.substring(0, 8)}</div>
                                        <div className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString("de-DE")}</div>
                                        {order.image_url && (
                                            <a href={order.image_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[10px] text-terracotta-500 hover:underline">
                                                <ExternalLink className="w-3 h-3" /> Bild öffnen
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.shipping_address ? (
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium text-gray-900">{order.shipping_address.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {order.shipping_address.addressLine1}, {order.shipping_address.zipCode} {order.shipping_address.city}
                                                </div>
                                                <div className="text-[10px] text-gray-400 capitalize">{order.shipping_address.country}</div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Keine Adresse</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {formatCurrency(order.amount_cents)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const statusStyles: Record<string, string> = {
                                                paid: "bg-green-100 text-green-700 border-green-200",
                                                pending: "bg-amber-100 text-amber-700 border-amber-200",
                                                fulfilled: "bg-blue-100 text-blue-700 border-blue-200",
                                                cancelled: "bg-red-100 text-red-700 border-red-200",
                                            };
                                            const statusLabels: Record<string, string> = {
                                                paid: "Bezahlt",
                                                pending: "Ausstehend",
                                                fulfilled: "Abgeschlossen",
                                                cancelled: "Storniert",
                                            };
                                            const style = statusStyles[order.status] || "bg-gray-100 text-gray-700 border-gray-200";
                                            const label = statusLabels[order.status] || order.status;

                                            return (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${style}`}>
                                                    {label}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end gap-2">
                                            {order.shipping_address && (
                                                <button
                                                    onClick={() => {
                                                        const addr = order.shipping_address!;
                                                        const text = `${addr.name}\n${addr.addressLine1}${addr.addressLine2 ? '\n' + addr.addressLine2 : ''}\n${addr.zipCode} ${addr.city}\n${addr.country}`;
                                                        handleCopy(text, `addr-${order.id}`);
                                                    }}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${copiedField === `addr-${order.id}` ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {copiedField === `addr-${order.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                    Adresse
                                                </button>
                                            )}
                                            {order.gelato_product_uid && (
                                                <button
                                                    onClick={() => handleCopy(order.gelato_product_uid!, `uid-${order.id}`)}
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-all ${copiedField === `uid-${order.id}` ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {copiedField === `uid-${order.id}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                    Gelato UID
                                                </button>
                                            )}
                                            {order.status === "paid" && (
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium bg-terracotta-500 text-white hover:bg-terracotta-600 transition-all"
                                                >
                                                    <Truck className="w-3 h-3" />
                                                    Versenden
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Keine Bestellungen gefunden.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Tracking Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-width-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-serif font-bold text-lg text-gray-900">Versand bestätigen</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                    Sendungsnummer *
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                                    placeholder="z.B. 00340434... (DHL)"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                                    Tracking-URL (optional)
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                                    placeholder="https://www.dhl.de/..."
                                    value={trackingUrl}
                                    onChange={(e) => setTrackingUrl(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed italic">
                                Beim Bestätigen wird der Status auf &quot;Abgeschlossen&quot; gesetzt und der Kunde erhält automatisch eine Versandbestätigung per E-Mail.
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-white transition-colors"
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={handleShipOrder}
                                disabled={!trackingNumber || isSubmitting}
                                className="flex-1 px-4 py-2 bg-terracotta-500 text-white rounded-lg text-sm font-medium hover:bg-terracotta-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {isSubmitting ? "Wird gesendet..." : "Jetzt versenden"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
