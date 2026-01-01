"use client";

import { Copy, Check, ExternalLink, Search, Filter } from "lucide-react";
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
                        <option value="all">Alle Stati</option>
                        <option value="paid">Bezahlt</option>
                        <option value="pending">Pending</option>
                        <option value="fulfilled">Fulfilled</option>
                        <option value="cancelled">Cancelled</option>
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
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {order.status}
                                        </span>
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
        </div>
    );
}
