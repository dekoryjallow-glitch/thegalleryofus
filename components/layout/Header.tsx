import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { UserMenu } from '@/components/UserMenu';
import { createClient } from '@/lib/supabase/server';

export async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email === 'dekory@onvisimedia.com';

    return (
        <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-cream-50/90 backdrop-blur-md fixed top-0 z-50 border-b border-cream-200/40 transition-all duration-300">
            <Link href="/" className="transition-opacity hover:opacity-80">
                <Logo className="h-8 md:h-10 w-auto" />
            </Link>

            <nav className="hidden lg:flex gap-10 text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                <Link href="/#how-it-works" className="hover:text-terracotta-500 transition-colors">Der Prozess</Link>
                <Link href="/#gallery" className="hover:text-terracotta-500 transition-colors">Inspiration</Link>
                <Link href="/#quality" className="hover:text-terracotta-500 transition-colors">Manufaktur</Link>
                {isAdmin && (
                    <Link href="/admin" className="text-terracotta-600 hover:text-terracotta-700 font-bold underline decoration-2 underline-offset-4">
                        Admin
                    </Link>
                )}
            </nav>

            <div className="flex items-center gap-3 md:gap-6">
                {!user ? (
                    <Link href="/login" className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase hover:text-terracotta-500 transition-colors">
                        Login
                    </Link>
                ) : (
                    <UserMenu initialUser={user} />
                )}
                <Button href="/create" variant="primary" className="bg-terracotta-500 hover:bg-terracotta-600 text-white !px-5 md:!px-8 !py-2 md:!py-3 text-[10px] md:text-[11px] uppercase tracking-widest font-bold rounded-full">
                    Erstellen
                </Button>
            </div>
        </header>
    );
}
