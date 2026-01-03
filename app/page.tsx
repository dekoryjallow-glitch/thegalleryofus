import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default async function Home() {

  return (
    <main className="min-h-screen bg-cream-50 flex flex-col selection:bg-terracotta-500/30 selection:text-terracotta-900 overflow-x-hidden">
      {/* Navigation / Header */}
      <Header />

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
                Was Worte nicht sagen können.
              </span>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[1.1] md:leading-[0.95] tracking-tighter">
                Eure Verbindung. <br />
                <span className="italic text-gray-400/80 font-normal">Als Kunstwerk.</span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-500 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Wir halten fest, was zwischen zwei Menschen existiert. <span className="text-gray-900 font-medium italic">Echt. Nah. Berührend.</span><br className="hidden md:block" />
              Ein Unikat, das die Tiefe eures Augenblicks bewahrt.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button href="/create" className="bg-terracotta-500 hover:bg-terracotta-600 text-white text-lg !px-10 py-4 shadow-xl shadow-terracotta-500/20 rounded-full transition-transform hover:scale-105 active:scale-95">
                Eure Geschichte erzählen
              </Button>
              <div className="flex items-center justify-center">
                <p className="text-xs text-gray-400 font-medium tracking-widest uppercase">Über 12.000 erzählte Geschichten</p>
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
                    src="/hero-result-art-v2.jpg"
                    alt="Gallery of Us Hero Result"
                    width={800}
                    height={1000}
                    className="w-full h-full object-contain transition-transform duration-1000 hover:scale-105"
                    priority
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-4 md:-bottom-8 md:-left-8 bg-white p-4 md:p-6 shadow-2xl max-w-[140px] md:max-w-[180px] border-l-4 border-terracotta-500 text-left animate-fade-in opacity-0" style={{ animationDelay: '0.8s' }}>
                  <p className="font-serif text-lg md:text-xl text-terracotta-500 mb-1 leading-tight">Der Moment</p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 leading-relaxed font-medium uppercase tracking-wider">Still. Zeitlos. Nur für euch.</p>
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
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">Vom Foto zum Gefühl</h2>
            <div className="w-20 h-1 bg-terracotta-500 mx-auto rounded-full"></div>
            <p className="text-gray-500 font-light text-lg">Wie aus einem Augenblick ein Kunstwerk wird.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            {/* Step 1 */}
            <div className="space-y-6 text-center group">
              <div className="w-16 h-16 bg-cream-50 rounded-full flex items-center justify-center mx-auto border border-cream-100 group-hover:bg-terracotta-500 group-hover:text-white transition-all duration-300">
                <span className="font-serif text-2xl font-bold">1</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 transition-colors group-hover:text-terracotta-500">Eure Aufnahme</h3>
              <p className="text-gray-500 leading-relaxed">Ein Foto, das euch zeigt. Ungestellt und ehrlich. Der Anfang eurer gemeinsamen Reise.</p>
            </div>

            {/* Step 2 */}
            <div className="space-y-6 text-center group">
              <div className="w-16 h-16 bg-cream-50 rounded-full flex items-center justify-center mx-auto border border-cream-100 group-hover:bg-terracotta-500 group-hover:text-white transition-all duration-300">
                <span className="font-serif text-2xl font-bold">2</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 transition-colors group-hover:text-terracotta-500">Die Verwandlung</h3>
              <p className="text-gray-500 leading-relaxed">Aus dem Bild wird Gefühl. Wir verdichten eure Aufnahme, bis nur noch die Essenz eurer Verbindung sichtbar bleibt.</p>
            </div>

            {/* Step 3 */}
            <div className="space-y-6 text-center group">
              <div className="w-16 h-16 bg-cream-50 rounded-full flex items-center justify-center mx-auto border border-cream-100 group-hover:bg-terracotta-500 group-hover:text-white transition-all duration-300">
                <span className="font-serif text-2xl font-bold">3</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 transition-colors group-hover:text-terracotta-500">Die Ankunft</h3>
              <p className="text-gray-500 leading-relaxed">Gedruckt auf Museumspapier, gehalten von massivem Holz. Ein Werk, das bleibt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery / Inspiration Section */}
      <section id="gallery" className="py-24 bg-cream-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-xl space-y-4">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">Momente, die bleiben</h2>
              <p className="text-gray-500 font-light text-lg">Wo Geschichten ein Zuhause finden. Still und kraftvoll.</p>
            </div>
            <Link href="/create" className="text-terracotta-600 font-bold uppercase tracking-widest text-xs border-b-2 border-terracotta-500 pb-1 hover:text-terracotta-700 transition-colors">
              Eure Geschichte starten
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8 auto-rows-[300px] md:auto-rows-[400px]">
            {/* Main Feature - Large Left (Couple at Table) */}
            <div className="lg:col-span-8 row-span-1 md:row-span-2 relative group overflow-hidden rounded-sm shadow-2xl">
              <Image
                src="/inspiration-couple-table-v2.jpg"
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
                src="/inspiration-family-v2.jpg"
                alt="Kunst für die ganze Familie"
                fill
                className="object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Tertiary Feature - Bottom Right (Couple Couch/Emotional) */}
            <div className="lg:col-span-4 relative group overflow-hidden rounded-sm shadow-xl">
              <Image
                src="/inspiration-emotional-couple-v2.jpg"
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
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900">Berührbare Erinnerung</h2>
            <div className="w-20 h-1 bg-terracotta-500 mx-auto rounded-full"></div>
            <p className="text-gray-500 font-light text-lg italic">Qualität, die man spürt. Materialien, die deiner Geschichte Gewicht verleihen.</p>
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
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Papier mit <br />Charakter</h3>
                <p className="text-gray-500 text-lg leading-relaxed font-light">
                  Nicht nur ein Träger, sondern Teil des Werks. 200g Museumspapier mit einer Textur, die das Licht fängt und der Linie Tiefe gibt. Haptisch, rein und für die Ewigkeit gemacht.
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
                <h3 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Ein Rahmen für <br />eure Geschichte</h3>
                <p className="text-gray-500 text-lg leading-relaxed font-light">
                  Massives Holz, in Handarbeit gefertigt. Dunkel, stabil und edel. Ein schützender Raum für euren gemeinsamen Moment.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-24 text-center">
            <Button href="/create" variant="primary" className="bg-gray-900 border-none hover:bg-black text-white px-12 py-4 text-lg rounded-full shadow-xl transition-all hover:scale-105">
              Zuhause spüren
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ / Trust */}
      <section className="py-24 bg-cream-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-serif text-4xl font-bold">Gedanken zu deinem Unikat</h2>
            <p className="text-gray-500">Antworten auf Fragen, die du vielleicht noch hast.</p>
          </div>

          <div className="space-y-6">
            {[
              { q: "Welche Momente eignen sich?", a: "Jedes Bild, das euch etwas bedeutet. Wir fangen nicht nur Gesichter ein, sondern die Atmosphäre zwischen euch. Auch einfache Schnappschüsse tragen oft die größte Magie." },
              { q: "Sehe ich das Werk vorher?", a: "Ja. Du erhältst einen intimen Einblick in die Entstehung. Erst wenn das Werk dein Herz berührt, wird es vollendet." },
              { q: "Wann kommt das Werk zu mir?", a: "Gutes braucht Ruhe. Wir nehmen uns Zeit für die Ausarbeitung. Nach 3-5 Tagen hältst du dein Unikat in den Händen." },
              { q: "Warum Museumspapier?", a: "Weil Erinnerungen Gewicht haben sollten. Unser Papier ist schwer, sanft und beständig. Es lässt die Kunst atmen." },
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
      <Footer />

    </main>
  );
}
