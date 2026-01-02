'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Download, ExternalLink, RefreshCw, Save, Truck, Check, AlertTriangle, Copy } from 'lucide-react';
import Link from 'next/link';
import { updateOrderStatus, updateOrderGelatoId } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';

interface OrderDetailClientProps {
    order: any;
}

export default function OrderDetailClient({ order }: OrderDetailClientProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(order.fulfillment_status);
    const [gelatoId, setGelatoId] = useState(order.gelato_order_id || '');

    const handleStatusChange = async (newStatus: string) => {
        setIsLoading(true);
        try {
            await updateOrderStatus(order.id, newStatus);
            setStatus(newStatus);
            alert('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGelatoUpdate = async () => {
        setIsLoading(true);
        try {
            await updateOrderGelatoId(order.id, gelatoId, 'manual_entry');
            alert('Gelato Order ID updated');
        } catch (error) {
            console.error('Error updating Gelato ID:', error);
            alert('Failed to update Gelato ID');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'in_review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'fulfilled': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-slate-900">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-500" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                    Order #{order.id.slice(0, 8)}
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                                        {status?.toUpperCase()}
                                    </span>
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {new Date(order.created_at).toLocaleString('de-DE')}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={isLoading}
                                className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                            >
                                <option value="unfulfilled">Unfulfilled</option>
                                <option value="paid">Paid</option>
                                <option value="in_review">In Review</option>
                                <option value="approved">Approved</option>
                                <option value="fulfilled">Fulfilled</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content: Image & Customer Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Print Asset Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900">Print Asset</h2>
                                <a
                                    href={order.print_image_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download High-Res
                                </a>
                            </div>
                            <div className="p-6 bg-gray-50 flex justify-center">
                                {order.print_image_url ? (
                                    <div className="relative w-full max-w-xl aspect-square shadow-lg rounded-lg overflow-hidden bg-white">
                                        <Image
                                            src={order.print_image_url}
                                            alt="Print Asset"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center py-20 text-gray-500">
                                        <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
                                        No print asset available
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex justify-between">
                                <span>Storage Path: {order.print_image_storage_path}</span>
                                <span>Gelato Product: {order.gelato_product_uid}</span>
                            </div>
                        </div>

                        {/* Manual Fulfillment Steps */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Manual Fulfillment Guide</h2>
                            <ol className="list-decimal list-inside space-y-3 text-gray-600 text-sm">
                                <li>Download the &quot;Print Asset&quot; image above.</li>
                                <li>Log in to <a href="https://gelato.com" target="_blank" className="text-indigo-600 hover:underline">Gelato Dashboard</a>.</li>
                                <li>Create a new &quot;Manual Order&quot;.</li>
                                <li>Select Product: <strong>Framed Poster (16x16&quot; / 40x40cm)</strong>.</li>
                                <li>Upload the downloaded image. Ensure 1:1 aspect ratio matches.</li>
                                <li>Enter the Shipping Details (see right panel).</li>
                                <li>Submit Order in Gelato.</li>
                                <li>Copy the Gelato Order ID and paste it below.</li>
                                <li>Mark this order as &quot;Fulfilled&quot;.</li>
                            </ol>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gelato Order ID</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={gelatoId}
                                        onChange={(e) => setGelatoId(e.target.value)}
                                        className="flex-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        placeholder="e.g. 123456789"
                                    />
                                    <button
                                        onClick={handleGelatoUpdate}
                                        disabled={isLoading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save ID
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Sidebar: Details */}
                    <div className="space-y-8">

                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Shipping Address</h3>
                            {order.shipping_address ? (
                                <div className="text-sm text-gray-900 space-y-1 relative group">
                                    <button
                                        onClick={() => copyToClipboard(JSON.stringify(order.shipping_address, null, 2))}
                                        className="absolute top-0 right-0 p-1 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Copy JSON"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <p className="font-semibold">{order.shipping_address.name}</p>
                                    <p>{order.shipping_address.addressLine1}</p>
                                    {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                                    <p>{order.shipping_address.zipCode} {order.shipping_address.city}</p>
                                    <p>{order.shipping_address.state}</p>
                                    <p className="font-semibold">{order.shipping_address.country}</p>
                                </div>
                            ) : (
                                <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
                                    Shipping address missing! Check Stripe Dashboard.
                                </div>
                            )}
                        </div>

                        {/* Order Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Order Details</h3>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Amount</dt>
                                    <dd className="font-medium text-gray-900">{(order.amount_cents / 100).toFixed(2)} {order.currency.toUpperCase()}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Stripe ID</dt>
                                    <dd className="font-mono text-xs text-gray-600 truncate max-w-[150px]" title={order.stripe_checkout_id}>{order.stripe_checkout_id}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500">Payment Intent</dt>
                                    <dd className="font-mono text-xs text-gray-600 truncate max-w-[150px]" title={order.stripe_payment_intent_id}>{order.stripe_payment_intent_id || 'N/A'}</dd>
                                </div>
                            </dl>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
