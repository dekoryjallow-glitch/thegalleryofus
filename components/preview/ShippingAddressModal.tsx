'use client';

import { useState } from 'react';
import { X, Lock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ShippingAddress {
    name: string;
    email: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    country: string;
}

interface ShippingAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (address: ShippingAddress) => void;
    isLoading: boolean;
}

export default function ShippingAddressModal({ isOpen, onClose, onSubmit, isLoading }: ShippingAddressModalProps) {
    const [formData, setFormData] = useState<ShippingAddress>({
        name: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        postalCode: '',
        country: 'DE',
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-cream-50/50">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-gray-900">Versandinformationen</h2>
                        <p className="text-sm text-gray-500 mt-1">Wohin soll dein Unikat geliefert werden?</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Vollständiger Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all"
                                    placeholder="Max Mustermann"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">E-Mail Adresse</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all"
                                    placeholder="max@beispiel.de"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Straße & Hausnummer</label>
                            <input
                                type="text"
                                name="addressLine1"
                                required
                                value={formData.addressLine1}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all"
                                placeholder="Musterstraße 123"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Adresszusatz (Optional)</label>
                            <input
                                type="text"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all"
                                placeholder="z.B. Hinterhaus, 2. Etage"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2 col-span-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">PLZ</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    required
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all"
                                    placeholder="12345"
                                />
                            </div>
                            <div className="space-y-2 col-span-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Stadt</label>
                                <input
                                    type="text"
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all"
                                    placeholder="Musterstadt"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Land</label>
                            <select
                                name="country"
                                required
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 outline-none transition-all bg-white"
                            >
                                <option value="DE">Deutschland</option>
                                <option value="AT">Österreich</option>
                                <option value="CH">Schweiz</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-terracotta-500 hover:bg-terracotta-600 text-white"
                        >
                            {isLoading ? (
                                'Einen Moment...'
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>Sicher zur Zahlung</span>
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" /> SSL-Verschlüsselte Übertragung
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
}
