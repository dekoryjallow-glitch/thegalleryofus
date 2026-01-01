import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';

import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === 'dekory@onvisimedia.com';

  return (
    <main className="min-h-screen bg-cream-50 flex flex-col selection:bg-terracotta-500/30 selection:text-terracotta-900">
      {/* Navigation / Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center bg-cream-50/80 backdrop-blur-md fixed top-0 z-50 border-b border-cream-200/50 transition-all duration-300">
        <div className="font-serif text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 bg-terracotta-500 rounded-full flex items-center justify-center text-white text-xs font-serif italic text-sm">G</span>
          Gallery Test 123
        </div>
        <nav className="hidden md:flex gap-10 text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase">
          <a href="#" className="hover:text-terracotta-500 transition-colors">Visit</a>
          <a href="#" className="hover:text-terracotta-500 transition-colors">Exhibitions</a>
          <a href="#" className="hover:text-terracotta-500 transition-colors">Shop</a>
          {isAdmin && (
            <Link href="/admin" className="text-terracotta-500 hover:text-terracotta-600 font-bold underline decoration-2 underline-offset-4">
              Admin Panel
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {!user ? (
            <Link href="/login" className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-terracotta-500 transition-colors">
              Login
            </Link>
          ) : (
            <Link href="/orders" className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase hover:text-terracotta-500 transition-colors">
              Meine Bestellungen
            </Link>
          )}
          <Button href="/create" variant="primary" className="btn-premium bg-terracotta-500 hover:bg-terracotta-600 text-white !px-8">
            Create Art
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-gold-400/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-[700px] h-[700px] bg-terracotta-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-6 h-full flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          {/* Text Content */}
          <div className="lg:w-1/2 space-y-10 text-center lg:text-left">
            <div className="space-y-4">
              <span className="inline-block text-terracotta-600 font-serif italic text-2xl animate-fade-in">
                Where love meets fine art
              </span>
              <h1 className="font-serif text-6xl lg:text-8xl font-bold text-gray-900 leading-[0.95] tracking-tighter">
                Two Souls. <br />
                <span className="italic text-gray-400/80 font-normal">One Line.</span>
              </h1>
            </div>

            <p className="text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Experience the magic of connection. Our AI transforms your shared moments into
              <span className="text-gray-900 font-medium italic"> timeless one-line masterpieces</span>
              crafted for the modern home.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4">
              <Button href="/create" className="btn-premium bg-terracotta-500 hover:bg-terracotta-600 text-white text-lg !px-12 py-5 shadow-2xl shadow-terracotta-500/20">
                Start Creating
              </Button>
              <div className="flex items-center">
                <CheckoutButton />
              </div>
            </div>

            {/* Stats / Trust */}
            <div className="pt-10 flex gap-12 justify-center lg:justify-start border-t border-cream-200/60 mt-4">
              <div className="group cursor-default">
                <p className="font-serif text-4xl text-gray-900 group-hover:text-terracotta-500 transition-colors">50k+</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-1">Portraits Created</p>
              </div>
              <div className="group cursor-default">
                <p className="font-serif text-4xl text-gray-900 group-hover:text-gold-500 transition-colors">4.9</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image / Viz */}
          <div className="lg:w-1/2 relative w-full flex items-center justify-center lg:justify-end">
            <div className="relative z-20 w-full max-w-md gallery-frame animate-float">
              <div className="relative w-full aspect-[3/4] bg-cream-50 overflow-hidden">
                <Image
                  src="/hero-gallery.jpg"
                  alt="Gallery of Us Hero"
                  fill
                  className="object-cover transition-transform duration-1000 hover:scale-110"
                  priority
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-8 -left-8 bg-white p-8 shadow-2xl max-w-[220px] hidden md:block border-l-4 border-terracotta-500">
                <p className="font-serif text-2xl text-terracotta-500 mb-2 leading-tight">The 2026 Collection</p>
                <p className="text-[11px] text-gray-400 leading-relaxed font-medium uppercase tracking-wider">Hand-curated AI masterpieces, merging nature&apos;s grace.</p>
              </div>
            </div>

            {/* Background Decorative Frame */}
            <div className="absolute top-12 right-12 w-full max-w-md aspect-[3/4] border border-gold-400/20 z-10 hidden lg:block transform translate-x-8 translate-y-8"></div>
          </div>
        </div>
      </section>
    </main>
  );
}
