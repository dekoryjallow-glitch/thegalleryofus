"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut, User as UserIcon, Settings, Package, LayoutDashboard } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function UserMenu({ initialUser = null }: { initialUser?: any }) {
    const [user, setUser] = useState<any>(initialUser);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const [supabase] = useState(() => createClient());
    const router = useRouter();

    const [credits, setCredits] = useState<number | null>(null);
    const [lastDate, setLastDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('daily_generation_count, last_generation_date')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    const today = new Date().toISOString().split('T')[0];
                    if (profile.last_generation_date === today) {
                        setCredits(Math.max(0, 3 - (profile.daily_generation_count || 0)));
                    } else {
                        setCredits(3);
                    }
                } else {
                    setCredits(3);
                }
            }
        };

        // Fetch to keep it fresh
        fetchUser();

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [supabase]); // Removed router from dependencies

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm hover:scale-105 transition-all border border-gray-200/10 shadow-sm"
            >
                {user.email?.charAt(0).toUpperCase()}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 animate-dropdown origin-top-right">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Eingeloggt als</p>
                        <p className="text-sm font-semibold truncate text-gray-900">{user.email}</p>

                        {credits !== null && (
                            <div className="mt-3 pt-3 border-t border-gray-100/50">
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tagesguthaben</p>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${credits > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {credits} / 3
                                    </span>
                                </div>
                                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${credits === 0 ? 'bg-red-400' : 'bg-terracotta-400'}`}
                                        style={{ width: `${(credits / 3) * 100}%` }}
                                    />
                                </div>
                                <p className="text-[9px] text-gray-400 mt-1 italic">Täglich 3 Generierungen geschenkt</p>
                            </div>
                        )}
                    </div>

                    <div className="p-2">
                        {user.email === 'dekory@onvisimedia.com' && (
                            <Link
                                href="/admin"
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-terracotta-600 font-bold hover:bg-terracotta-50 rounded-lg transition-colors group mb-1 border border-terracotta-100"
                                onClick={() => setIsOpen(false)}
                            >
                                <LayoutDashboard className="w-4 h-4 text-terracotta-500" />
                                Admin Dashboard
                            </Link>
                        )}

                        <Link
                            href="/orders"
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                            onClick={() => setIsOpen(false)}
                        >
                            <Package className="w-4 h-4 text-gray-400 group-hover:text-black" />
                            Meine Bestellungen
                        </Link>

                        <Link
                            href="/profile"
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                            onClick={() => setIsOpen(false)}
                        >
                            <UserIcon className="w-4 h-4 text-gray-400 group-hover:text-black" />
                            Mein Profil
                        </Link>

                        <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                            onClick={() => {
                                alert("Einstellungen kommen bald!");
                                setIsOpen(false);
                            }}
                        >
                            <Settings className="w-4 h-4 text-gray-400 group-hover:text-black" />
                            Einstellungen
                        </button>

                        <div className="my-2 border-t border-gray-100" />

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
                        >
                            <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                            Abmelden
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
