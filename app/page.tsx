import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import CheckoutButton from '@/components/CheckoutButton';
import { createClient } from '@/lib/supabase/server';
import { Logo } from '@/components/Logo';
import { UserMenu } from '@/components/UserMenu';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === 'dekory@onvisimedia.com';

  return (
    <main className="min-h-screen bg-cream-50 flex flex-col selection:bg-terracotta-500/30 selection:text-terracotta-900 overflow-x-hidden">
      {/* Navigation / Header */}
      <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center bg-cream-50/90 backdrop-blur-md fixed top-0 z-50 border-b border-cream-200/40 transition-all duration-300">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo className="h-8 md:h-10 w-auto" />
        </Link>

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
            <UserMenu initialUser={user} />
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
              Erlebe die Magie der Verbundenheit. Unsere <span className="text-gray-900 font-medium italic">Design-Manufaktur</span> verwandelt eure gemeinsamen Momente in
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
          {/* Hero Image - Top on Mobile, Right on Desktop */}
          <div className="w-full lg:w-1/2 relative flex items-center justify-center lg:justify-end order-1 lg:order-2 px-4 md:px-0">
            {/* Visual Transformation Container */}
            <div className="relative z-20 w-full max-w-xl mx-auto lg:mr-0 flex items-center justify-center">

              {/* Input: Selfies (Floating LEFT of the main frame) */}
              <div className="absolute -left-4 lg:-left-12 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 md:gap-6 pointer-events-none">
                {/* Selfie 1 (Female) */}
                <div className="relative w-24 md:w-32 aspect-[4/5] bg-white p-2 shadow-xl transform -rotate-6 transition-transform hover:-rotate-3 duration-500 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
                  <div className="relative w-full h-full overflow-hidden bg-gray-100 ring-1 ring-black/5">
                    <Image
                      src="/hero-selfie-female.jpg"
                      alt="Source Selfie 1"
                      fill
                      className="object-cover filter grayscale contrast-125"
                    />
                  </div>
                </div>

                {/* Selfie 2 (Male) */}
                <div className="relative w-24 md:w-32 aspect-[4/5] bg-white p-2 shadow-xl transform rotate-3 translate-x-4 md:translate-x-8 transition-transform hover:rotate-6 duration-500 animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
                  <div className="relative w-full h-full overflow-hidden bg-gray-100 ring-1 ring-black/5">
                    <Image
                      src="/hero-selfie-male.jpg"
                      alt="Source Selfie 2"
                      fill
                      className="object-cover filter grayscale contrast-125"
                    />
                  </div>
                </div>
              </div>

              {/* Connector: Visual Flow Line */}
              <svg className="absolute left-16 md:left-24 top-1/2 -translate-y-1/2 z-20 w-32 md:w-48 h-24 pointer-events-none opacity-60 hidden sm:block" viewBox="0 0 100 50">
                <path
                  d="M0,25 C30,25 30,25 100,25"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#D4A373" />
                    <stop offset="100%" stopColor="#D4A373" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Output: Main Art Frame */}
              <div className="relative z-10 w-full max-w-xs md:max-w-sm lg:max-w-md gallery-frame animate-float shadow-2xl ml-16 md:ml-32">
                <div className="relative w-full aspect-[3/4] bg-white overflow-hidden p-6 md:p-8 border-[12px] md:border-[16px] border-white shadow-inner">
                  <Image
                    src="/hero-result-art.jpg"
                    alt="Gallery of Us Hero Result"
                    width={800}
                    height={1000}
                    className="w-full h-full object-contain transition-transform duration-1000 hover:scale-105"
                    priority
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-4 md:-bottom-8 md:-left-8 bg-white p-4 md:p-6 shadow-2xl max-w-[140px] md:max-w-[180px] border-l-4 border-terracotta-500 text-left animate-fade-in opacity-0" style={{ animationDelay: '0.8s' }}>
                  <p className="font-serif text-lg md:text-xl text-terracotta-500 mb-1 leading-tight">Das Ergebnis</p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 leading-relaxed font-medium uppercase tracking-wider">Handkuratiert. Künstlerisch vollendet. Ein Unikat für die Ewigkeit.</p>
                </div>
              </div>
            </div>

            {/* Background Decorative Frame */}
            <div className="absolute -top-4 -right-4 w-full max-w-xs md:max-w-md aspect-[3/4] border border-gold-400/20 z-10 hidden md:block transform translate-x-8 translate-y-8 pointer-events-none"></div>
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
              <p className="text-gray-500 leading-relaxed">Lade zwei Porträts von dir und deinem Lieblingsmenschen hoch. Unser Kreativteam erfasst die Essenz eurer Verbindung.</p>
            </div>

            {/* Step 2 */}
            <div className="space-y-6 text-center group">
              <div className="w-16 h-16 bg-cream-50 rounded-full flex items-center justify-center mx-auto border border-cream-100 group-hover:bg-terracotta-500 group-hover:text-white transition-all duration-300">
                <span className="font-serif text-2xl font-bold">2</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 transition-colors group-hover:text-terracotta-500">Künstlerische Veredelung</h3>
              <p className="text-gray-500 leading-relaxed">In einem fein abgestimmten Prozess entsteht eine fließende, endlose Linie, die eure Gesichter zu einem harmonischen Ganzen verschmilzt.</p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 auto-rows-[300px] md:auto-rows-[400px]">
            {/* Main Feature - Large Left (Couple at Table) */}
            <div className="lg:col-span-8 row-span-1 md:row-span-2 relative group overflow-hidden rounded-sm shadow-2xl">
              <Image
                src="/inspiration-couple-table.jpg"
                alt="Authentische Momente zuhause"
                fill
                className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Secondary Feature - Top Right (Family) */}
            <div className="lg:col-span-4 relative group overflow-hidden rounded-sm shadow-xl">
              <Image
                src="/inspiration-family-wall.jpg"
                alt="Kunst für die ganze Familie"
                fill
                className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Tertiary Feature - Bottom Right (Couple Couch) */}
            <div className="lg:col-span-4 relative group overflow-hidden rounded-sm shadow-xl">
              <Image
                src="/inspiration-couple-couch.jpg"
                alt="Ein Mittelpunkt im Wohnzimmer"
                fill
                className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section id="quality" className="py-24 bg-white border-y border-cream-200/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">Die Essenz des Handwerks</h2>
            <div className="w-20 h-1 bg-terracotta-500 mx-auto rounded-full"></div>
            <p className="text-gray-500 font-light text-lg italic">In unserer Manufaktur verschmelzen zeitlose Materialien mit moderner Präzision zu einem Werk, das Generationen überdauert.</p>
          </div>

          <div className="space-y-24 md:space-y-32">
            {/* Paper Detail */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl group">
                  <Image
                    src="/quality-paper.jpg"
                    alt="Detailaufnahme des 200g Museumspapiers"
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <span className="text-terracotta-600 font-serif italic text-xl">Haptik & Beständigkeit</span>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Ein Relief der <br />Ewigkeit</h3>
                <p className="text-gray-500 text-lg leading-relaxed font-light">
                  Unser schweres Museumspapier ist mehr als nur ein Träger – es ist Teil des Kunstwerks. Mit seiner feinen, haptischen Textur und der reinweißen, säurefreien Beschaffenheit bewahrt es die Tiefe jeder Linie über Jahrzehnte hinweg. Lichtecht, haptisch erlebbar und von zeitloser Eleganz.
                </p>
              </div>
            </div>

            {/* Frame Detail */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2">
                <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl group">
                  <Image
                    src="/quality-frame.jpg"
                    alt="Detailaufnahme des handgefertigten Holzrahmens"
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 space-y-6 lg:text-right">
                <span className="text-terracotta-600 font-serif italic text-xl">Meisterhand & Material</span>
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Rahmen aus <br />Meisterhand</h3>
                <p className="text-gray-500 text-lg leading-relaxed font-light">
                  Echtes Massivholz, tiefschwarz lasiert. Unsere Rahmen werden in lokaler Handarbeit gefertigt und bestechen durch ihre sichtbare Maserung und handwerkliche Präzision. Sie geben eurer Geschichte den Raum, den sie verdient – stabil, edel und vollkommen im Detail.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-24 text-center">
            <Button href="/create" variant="primary" className="bg-gray-900 border-none hover:bg-black text-white px-12 py-4 text-lg rounded-full shadow-xl transition-all hover:scale-105">
              Qualität erleben
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ / Trust */}
      <section className="py-24 bg-cream-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-4xl font-bold">Wissenswertes zu deinem Unikat</h2>
            <p className="text-gray-500">Alles, was du über deine Bestellung in unserer Manufaktur wissen musst.</p>
          </div>

          <div className="space-y-6">
            {[
              { q: "Welche Motive eignen sich für mein Kunstwerk?", a: "Am schönsten wirken klare Porträtaufnahmen, die den Charakter eurer Gesichter gut einfangen. Doch hab keine Sorge um die Qualität: Unsere Manufaktur ist darauf spezialisiert, auch aus einfachen Schnappschüssen die verborgene Harmonie herauszuarbeiten." },
              { q: "Habe ich die volle Kontrolle über das Ergebnis?", a: "Selbstverständlich. Du begleitest den Entstehungsprozess in unserer digitalen Vorschau. Erst wenn die Linienführung dein Herz berührt und du zu 100% zufrieden bist, geben wir dein Werk in den Druck." },
              { q: "In welcher Zeit erreicht mich mein Kunstwerk?", a: "Qualität braucht einen Moment der Ruhe, aber keine Ewigkeit. Innerhalb der EU erreicht dich dein individuell gefertigtes Werk in der Regel nach 3 bis 5 Werktagen – sicher verpackt und bereit für seinen Platz an deiner Wand." },
              { q: "Was macht die Qualität der Gallery Of Us aus?", a: "Wir verwenden ausschließlich schweres 200g Museums-Papier und Rahmen aus nachhaltigem Massivholz. Jedes Stück wird in lokaler Handarbeit vollendet, um die Tiefe eurer Verbindung auch haptisch spürbar zu machen." },
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
              <Link href="/" className="transition-opacity hover:opacity-80 inline-block mb-4">
                <Logo className="h-10 w-auto" variant="light" />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">Merging human emotion with artistic precision. Hand-crafted for the modern minimalist gallery.</p>
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
            <p className="text-gray-500 text-[10px] uppercase tracking-widest">&copy; 2026 The Gallery Of Us. Art & Print Excellence.</p>
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
