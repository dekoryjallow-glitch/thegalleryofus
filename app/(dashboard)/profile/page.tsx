"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User as UserIcon, Mail, Calendar, Package, ArrowLeft, LogOut, Settings, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserMenu } from "@/components/UserMenu";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        async function fetchUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login?returnTo=/profile");
                return;
            }
            setUser(user);
            setLoading(false);
        }
        fetchUser();
    }, [router, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <p className="text-lg">Lade Profil...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-black font-sans">
            <header className="py-4 px-6 md:px-12 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-[#FDFBF7]/80 backdrop-blur-md z-40">
                <Link href="/" className="font-serif text-xl font-bold flex items-center gap-2 group">
                    <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-serif italic transition-transform group-hover:rotate-12">G</span>
                    <span className="hidden sm:inline">The Gallery of Us</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/create" className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-black transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-3 h-3" /> Dashboard
                    </Link>
                    <UserMenu />
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-8 md:p-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif mb-4 text-gradient">Mein Profil</h1>
                    <p className="text-gray-500 max-w-lg">Verwalte deine Kontoeinstellungen und sieh dir deine Aktivitäten an.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Info Card */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                                <UserIcon className="w-5 h-5 text-gray-400" />
                                Persönliche Informationen
                            </h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">E-Mail Adresse</label>
                                        <div className="flex items-center gap-3 text-gray-900 font-medium">
                                            <Mail className="w-4 h-4 text-gray-300" />
                                            {user.email}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Mitglied seit</label>
                                        <div className="flex items-center gap-3 text-gray-900 font-medium">
                                            <Calendar className="w-4 h-4 text-gray-300" />
                                            {new Date(user.created_at).toLocaleDateString("de-DE", { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-50">
                                    <Link
                                        href="/orders"
                                        className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-all active:scale-95"
                                    >
                                        <Package className="w-4 h-4" />
                                        Meine Bestellungen ansehen
                                    </Link>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                            <h2 className="text-xl font-serif mb-6 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-gray-400" />
                                Sicherheit & Einstellungen
                            </h2>

                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                                            <Settings className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium">Passwort ändern</p>
                                            <p className="text-xs text-gray-400">Aktualisiere dein Passwort regelmäßig</p>
                                        </div>
                                    </div>
                                    <ArrowLeft className="w-4 h-4 rotate-180 text-gray-300" />
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-50/50 flex items-center justify-center text-red-400">
                                            <LogOut className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-medium text-red-600">Abmelden</p>
                                            <p className="text-xs text-red-400">Beende deine aktuelle Sitzung</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="bg-black text-white rounded-2xl p-8 shadow-xl">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl font-serif mb-6 italic">G</div>
                            <h3 className="text-xl font-serif mb-3 leading-tight">Willkommen in deinem persönlichen Atelier.</h3>
                            <p className="text-gray-400 text-sm font-light leading-relaxed">
                                Schön, dass du wieder da bist. Wir hoffen, deine Kunstwerke bringen dir und deinen Liebsten viel Freude.
                            </p>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Benötigst du Hilfe?</p>
                            <p className="text-sm mb-4">Unser Support ist für dich da.</p>
                            <a href="mailto:support@thegalleryofus.com" className="text-sm font-semibold hover:underline">support@thegalleryofus.com</a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
