import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import { createClient } from '@/lib/supabase/server';
import { UserMenu } from '@/components/UserMenu';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === 'dekory@onvisimedia.com';

  return (
    <main className="min-h-screen bg-cream-50 flex flex-col selection:bg-terracotta-500/30 selection:text-terracotta-900 overflow-x-hidden">
      {/* Navigation / Header */}
      <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-cream-50/90 backdrop-blur-md fixed top-0 z-50 border-b border-cream-200/40 transition-all duration-300">
        <div className="font-serif text-xl md:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 bg-terracotta-500 rounded-full flex items-center justify-center text-white text-sm font-serif italic">G</span>
          <span className="hidden xs:inline">The Gallery Of Us</span>
        </div>

        <nav className="hidden lg:flex gap-10 text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase">
          <a href="#how-it-works" className="hover:text-terracotta-500 transition-colors">So funktioniert&apos;s</a>
          <a href="#gallery" className="hover:text-terracotta-500 transition-colors">Galerie</a>
          <a href="#quality" className="hover:text-terracotta-500 transition-colors">Qualität</a>
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
            <UserMenu />
          )}
          <Button href="/create" variant="primary" className="bg-terracotta-500 hover:bg-terracotta-600 text-white !px-5 md:!px-8 !py-2 md:!py-3 text-[10px] md:text-[11px] uppercase tracking-widest font-bold rounded-full">
            Erstellen
          </Button>
        </div>
      </header>

      {/* Hero Section - Mobile First Stacked Layout */}
      <section className="relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center pt-24 lg:pt-0 pb-12 lg:pb-0 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-20 -left-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gold-400/10 rounded-full blur-[80px] md:blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-terracotta-500/10 rounded-full blur-[100px] md:blur-[140px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-6 h-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <span className="inline-block text-terracotta-600 font-serif italic text-lg md:text-2xl animate-fade-in">
                Eure Liebe. Als Kunstwerk.
              </span>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[1.1] md:leading-[0.95] tracking-tighter">
                Zwei Seelen. <br />
                <span className="italic text-gray-400/80 font-normal">Eine Linie.</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Erlebe die Magie der Verbundenheit. Unsere KI verwandelt eure gemeinsamen Momente in
              <span className="text-gray-900 font-medium italic"> zeitlose One-Line-Meisterwerke</span> –
              perfekt kuratiert für dein Zuhause.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button href="/create" className="bg-terracotta-500 hover:bg-terracotta-600 text-white text-lg !px-10 py-4 shadow-xl shadow-terracotta-500/20 rounded-full transition-transform hover:scale-105 active:scale-95">
                Jetzt gestalten
              </Button>
              <div className="flex items-center justify-center">
                <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Bereits 12.400+ Unikate</p>
              </div>
            </div>

            {/* Stats / Trust - Hidden on very small screens, visible from sm */}
            <div className="hidden sm:flex pt-10 gap-12 justify-center lg:justify-start border-t border-cream-200/60 mt-8">
              <div className="group cursor-default">
                <p className="font-serif text-4xl text-gray-900 group-hover:text-terracotta-500 transition-colors">4.9</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-gold-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Bewertung</p>
                </div>
              </div>
              <div className="group cursor-default">
                <p className="font-serif text-4xl text-gray-900 group-hover:text-terracotta-500 transition-colors">Global</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mt-1 shadow-sm">Versandbereit</p>
              </div>
            </div>
          </div>

          {/* Hero Image - Top on Mobile, Right on Desktop */}
          <div className="w-full lg:w-1/2 relative flex items-center justify-center lg:justify-end order-1 lg:order-2 px-4 md:px-0">
            <div className="relative z-20 w-full max-w-sm md:max-w-md gallery-frame animate-float shadow-2xl">
              <div className="relative w-full aspect-[3/4] bg-white overflow-hidden p-6 md:p-12 border-[16px] md:border-[24px] border-white shadow-inner">
                <Image
                  src="/hero-gallery.jpg"
                  alt="Gallery of Us Hero"
                  width={800}
                  height={1000}
                  className="w-full h-full object-contain transition-transform duration-1000 hover:scale-105"
                  priority
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-4 md:-bottom-8 md:-left-8 bg-white p-4 md:p-8 shadow-2xl max-w-[160px] md:max-w-[220px] border-l-4 border-terracotta-500 text-left">
                <p className="font-serif text-xl md:text-2xl text-terracotta-500 mb-1 md:mb-2 leading-tight">2026 Edition</p>
                <p className="text-[9px] md:text-[11px] text-gray-400 leading-relaxed font-medium uppercase tracking-wider">Handkuratiert. KI-gezeichnet. Ein Unikat für die Ewigkeit.</p>
              </div>
            </div>

            {/* Background Decorative Frame */}
            <div className="absolute -top-4 -right-4 w-full max-w-sm md:max-w-md aspect-[3/4] border border-gold-400/20 z-10 hidden md:block transform translate-x-8 translate-y-8"></div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">In 3 Schritten zu deinem Unikat</h2>
            <div className="w-20 h-1 bg-terracotta-500 mx-auto rounded-full"></div>
            <p className="text-gray-500 font-light text-lg">Einfacher als du denkst. Komplexer als du glaubst.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {/* Step 1 */}
            <div className="space-y-6 text-center group">
              <div className="w-16 h-16 bg-cream-50 rounded-full flex items-center justify-center mx-auto border border-cream-100 group-hover:bg-terracotta-500 group-hover:text-white transition-all duration-300">
                <span className="font-serif text-2xl font-bold">1</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 transition-colors group-hover:text-terracotta-500">Fotos wählen</h3>
              <p className="text-gray-500 leading-relaxed">Lade zwei Porträts von dir und deinem Lieblingsmenschen hoch. Unsere KI erkennt eure markantesten Merkmale.</p>
            </div>

            {/* Step 2 */}
            <div className="space-y-6 text-center group">
              <div className="w-16 h-16 bg-cream-50 rounded-full flex items-center justify-center mx-auto border border-cream-100 group-hover:bg-terracotta-500 group-hover:text-white transition-all duration-300">
                <span className="font-serif text-2xl font-bold">2</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 transition-colors group-hover:text-terracotta-500">KI-Magie</h3>
              <p className="text-gray-500 leading-relaxed">Innerhalb von Sekunden berechnet unser Algorithmus eine fließende, endlose Linie, die eure Gesichter zu einem harmonischen Ganzen verschmilzt.</p>
            </div>

            {/* Step 3 */}
            <div className="space-y-6 text-center group">
              <div className="w-16 h-16 bg-cream-50 rounded-full flex items-center justify-center mx-auto border border-cream-100 group-hover:bg-terracotta-500 group-hover:text-white transition-all duration-300">
                <span className="font-serif text-2xl font-bold">3</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 transition-colors group-hover:text-terracotta-500">Galerie-Druck</h3>
              <p className="text-gray-500 leading-relaxed">Wähle deinen Rahmen und erhalte dein Kunstwerk in Galeriequalität direkt nach Hause geliefert.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery / Inspiration Section */}
      <section id="gallery" className="py-24 bg-cream-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-xl space-y-4">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">Inspirations-Galerie</h2>
              <p className="text-gray-500 font-light text-lg">Ein Blick in die Wohnzimmer unserer Kunden. Jedes Stück erzählt eine eigene, unendliche Geschichte.</p>
            </div>
            <Link href="/create" className="text-terracotta-600 font-bold uppercase tracking-widest text-xs border-b-2 border-terracotta-500 pb-1 hover:text-terracotta-700 transition-colors">
              Eigene Erfassung starten
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Example Artwork Cards */}
            <div className="group overflow-hidden rounded-sm shadow-xl bg-white p-4 transition-transform hover:-translate-y-2">
              <div className="aspect-[4/5] bg-cream-50 relative overflow-hidden mb-4">
                <Image src="/hero-gallery.jpg" alt="Inspiration 1" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <p className="font-serif text-center italic text-gray-800">&quot;The Connection&quot;</p>
            </div>
            <div className="group overflow-hidden rounded-sm shadow-xl bg-white p-4 transition-transform hover:-translate-y-2 lg:mt-12">
              <div className="aspect-[4/5] bg-cream-50 relative overflow-hidden mb-4">
                <Image src="/hero-gallery.jpg" alt="Inspiration 2" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <p className="font-serif text-center italic text-gray-800">&quot;Shared Path&quot;</p>
            </div>
            <div className="group overflow-hidden rounded-sm shadow-xl bg-white p-4 transition-transform hover:-translate-y-2 lg:mt-24">
              <div className="aspect-[4/5] bg-cream-50 relative overflow-hidden mb-4">
                <Image src="/hero-gallery.jpg" alt="Inspiration 3" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <p className="font-serif text-center italic text-gray-800">&quot;One Soul&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section id="quality" className="py-24 bg-white border-y border-cream-200/50">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 rounded-2xl overflow-hidden shadow-2xl">
            <div className="relative aspect-video lg:aspect-square">
              <Image src="/hero-gallery.jpg" alt="Printing Detail" fill className="object-cover" />
              <div className="absolute inset-0 bg-gray-900/10"></div>
            </div>
          </div>
          <div className="lg:w-1/2 space-y-10">
            <div className="space-y-4">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Handgefertigt. <br />Handverlesen.</h2>
              <p className="text-gray-500 font-light text-lg">Wir glauben, dass Kunst Bestand haben muss. Deshalb machen wir keine Kompromisse bei der Auswahl unserer Materialien.</p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-gold-400/10 rounded-full flex items-center justify-center text-gold-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold mb-2">Papiere mit Charakter</h4>
                  <p className="text-gray-500 text-sm">Schweres 200g Museums-Papier mit feiner Textur, säurefrei und lichtbeständig für Jahrzehnte.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 bg-gold-400/10 rounded-full flex items-center justify-center text-gold-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                </div>
                <div>
                  <h4 className="font-serif text-xl font-bold mb-2">Echtholz-Rahmung</h4>
                  <p className="text-gray-500 text-sm">Unsere Rahmen werden in lokaler Handarbeit aus nachhaltigem Massivholz (Eiche, Esche, Kiefer) gefertigt.</p>
                </div>
              </div>
            </div>

            <Button href="/create" variant="primary" className="bg-gray-900 border-none hover:bg-black text-white px-10 rounded-full">
              Qualität erleben
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ / Trust */}
      <section className="py-24 bg-cream-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-4xl font-bold">Häufige Fragen</h2>
            <p className="text-gray-500">Alles, was du über dDeine Bestellung wissen musst.</p>
          </div>

          <div className="space-y-6">
            {[
              { q: "Wie lange dauert der Versand?", a: "Innerhalb der EU liefern wir in der Regel in 3-5 Werktagen. Jedes Bild wird nach deiner Bestellung individuell gedruckt und gerahmt." },
              { q: "Welche Fotos eignen sich am besten?", a: "Klare Porträtaufnahmen mit frontalem Gesicht funktionieren am besten. Aber keine Sorge: Unsere KI kommt mit fast jedem Foto zurecht." },
              { q: "Kann ich das Bild vor dem Druck sehen?", a: "Absolut! Du erstellst dein Kunstwerk in unserer Vorschau und gibst es erst dann in den Druck, wenn du zu 100% zufrieden bist." },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-sm border border-cream-200/50">
                <h4 className="font-serif text-lg font-bold mb-3">{faq.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-16">
            <div className="col-span-1 md:col-span-1 space-y-6">
              <div className="font-serif text-2xl font-bold tracking-tight flex items-center gap-2">
                <span className="w-8 h-8 bg-terracotta-500 rounded-full flex items-center justify-center text-white text-sm font-serif italic">G</span>
                The Gallery Of Us
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Merging human emotion with AI precision. Hand-crafted for the modern minimalist gallery.</p>
            </div>

            <div className="space-y-6">
              <h5 className="font-serif text-lg font-bold">Shop</h5>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link href="/create" className="hover:text-white transition-colors">Kunst erschaffen</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Gutscheine</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="font-serif text-lg font-bold">Support</h5>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Versandinfo</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Rückgabe</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Kontakt</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h5 className="font-serif text-lg font-bold">Legal</h5>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">AGB</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Datenschutz</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Impressum</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-[10px] uppercase tracking-widest">&copy; 2026 The Gallery Of Us. AI & Print Excellence.</p>
            <div className="flex gap-6 grayscale opacity-30">
              <span className="text-[10px] font-bold tracking-tighter">STRIPE</span>
              <span className="text-[10px] font-bold tracking-tighter">GELATO</span>
              <span className="text-[10px] font-bold tracking-tighter">VISA</span>
              <span className="text-[10px] font-bold tracking-tighter">PAYPAL</span>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
