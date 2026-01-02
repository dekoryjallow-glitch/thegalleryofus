import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle, AlertCircle, ShoppingBag, Eye, Download, Truck, Archive } from "lucide-react";
import Image from "next/image";
import OrdersFilterBar from "./OrdersFilterBar";
import OrderRowActions from "./OrderRowActions";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams?: {
        q?: string;
        status?: string;
        archived?: string;
    };
}) {
    const supabase = createAdminClient();

    const queryTerm = searchParams?.q || '';
    const statusFilter = searchParams?.status || 'all';
    const showArchived = searchParams?.archived === 'true';

    // Build Query
    let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (!showArchived) {
        query = query.eq('is_archived', false);
    } else {
        query = query.eq('is_archived', true);
    }

    if (statusFilter !== 'all') {
        if (statusFilter === 'paid') {
            // Special case for 'To Fulfill' view which matches our new manual flow 'paid' status
            query = query.eq('fulfillment_status', 'paid');
        } else {
            query = query.eq('fulfillment_status', statusFilter);
        }
    }

    // Since we don't have full text search easily set up on all columns without extensions, 
    // we fetch and filter in memory if queryTerm is present, or use OR syntax if safe.
    // For simplicity/performance on small datasets, OR syntax on ID/Metadata might work.
    // user_id is a UUID, so we can't search text there easily unless we join.
    // Let's assume for now we filter in memory for complex search or just search ID.
    // Actually, simple text filter on ID is good enough for now.

    // Fetch data
    const { data: ordersData, error } = await query;

    if (error) {
        console.error("Error fetching orders:", error);
        return <div className="p-8 text-red-500">Error fetching orders: {error.message}</div>;
    }

    // In-Memory filtering for Search Term (searching shipping_address JSONB is tricky via simple OR)
    const orders = ordersData?.filter(order => {
        if (!queryTerm) return true;
        const term = queryTerm.toLowerCase();
        const idMatch = order.id.toLowerCase().includes(term);
        const nameMatch = order.shipping_address?.name?.toLowerCase().includes(term);
        const emailMatch = order.shipping_address?.email?.toLowerCase().includes(term);
        return idMatch || nameMatch || emailMatch;
    }) || [];


    // Helper to format currency
    const formatCurrency = (amountCents: number, currency: string) => {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: currency }).format(amountCents / 100);
    };

    // Helper for status badges
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Paid</span>;
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
            case 'failed':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Failed</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    const getFulfillmentBadge = (status: string) => {
        switch (status) {
            case 'fulfilled':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Truck className="w-3 h-3 mr-1" /> Fulfilled</span>;
            case 'approved':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
            case 'in_review':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Eye className="w-3 h-3 mr-1" /> Review</span>;
            case 'paid': // Initial paid state for manual flow
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"><Archive className="w-3 h-3 mr-1" /> To Fulfill</span>;
            case 'unfulfilled':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unfulfilled</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <h1 className="text-3xl font-serif font-bold text-gray-900">Orders</h1>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                        <span className="text-sm font-medium text-gray-500">Total: {orders?.length || 0}</span>
                    </div>
                </div>

                <OrdersFilterBar />

                {/* Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-black">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fulfillment</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders?.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        {/* ACTION COLUMN - MOVED TO LEFT */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-terracotta-600 hover:text-terracotta-800 font-semibold"
                                            >
                                                Manage
                                            </Link>
                                            <OrderRowActions orderId={order.id} isArchived={order.is_archived || false} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono text-xs text-gray-500" title={order.id}>{order.id.substring(0, 8)}...</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString('de-DE', {
                                                day: '2-digit', month: '2-digit', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {/* Fallback if user data join missing */}
                                            {order.shipping_address?.name || "Unknown"}
                                            <div className="text-xs text-gray-400">{order.shipping_address?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getFulfillmentBadge(order.fulfillment_status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {formatCurrency(order.amount_cents, order.currency)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {order.print_image_url ? (
                                                <div className="w-10 h-10 relative bg-gray-100 rounded overflow-hidden border border-gray-200 group cursor-pointer">
                                                    <Image
                                                        src={order.print_image_url}
                                                        alt="Print Asset"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No Asset</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {(!orders || orders.length === 0) && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                            No orders found matching your criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
