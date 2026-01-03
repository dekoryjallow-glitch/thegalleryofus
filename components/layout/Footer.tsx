import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { CookieSettingsTrigger } from '@/components/cookie/CookieSettingsTrigger';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-20">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <Link href="/" className="transition-opacity hover:opacity-80 inline-block mb-4">
                            <Logo className="h-10 w-auto" variant="light" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">Verbindung. Kunst. Gefühl. Handgefertigt für das moderne Zuhause.</p>
                    </div>

                    <div className="space-y-6">
                        <h5 className="font-serif text-lg font-bold">Shop</h5>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link href="/create" className="hover:text-white transition-colors">Kunst erschaffen</Link></li>
                            {/* <li><Link href="#" className="hover:text-white transition-colors">Gutscheine</Link></li> */}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="font-serif text-lg font-bold">Support</h5>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link href="#" className="hover:text-white transition-colors">Versandinfo</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Rückgabe</Link></li>
                            <li><Link href="mailto:support@thegalleryofus.com" className="hover:text-white transition-colors">Kontakt</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h5 className="font-serif text-lg font-bold">Legal</h5>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
                            <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link></li>
                            <li><Link href="/agb" className="hover:text-white transition-colors">AGB</Link></li>
                            <li>
                                <CookieSettingsTrigger className="hover:text-white transition-colors text-left">
                                    Cookie-Einstellungen
                                </CookieSettingsTrigger>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest">&copy; {new Date().getFullYear()} The Gallery Of Us. Art & Print Excellence.</p>
                    <div className="flex gap-6 grayscale opacity-30">
                        <span className="text-[10px] font-bold tracking-tighter">STRIPE</span>
                        <span className="text-[10px] font-bold tracking-tighter">GELATO</span>
                        <span className="text-[10px] font-bold tracking-tighter">VISA</span>
                        <span className="text-[10px] font-bold tracking-tighter">PAYPAL</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
