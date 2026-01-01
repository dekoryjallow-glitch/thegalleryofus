import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import CheckoutButton from '@/components/CheckoutButton';

export default function Home() {
  return (
    <main className="min-h-screen bg-cream-50 flex flex-col">
      {/* Navigation / Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center bg-cream-50/80 backdrop-blur-sm fixed top-0 z-50 border-b border-cream-200">
        <div className="font-serif text-2xl font-bold text-gray-900 tracking-wide">
          The Gallery Of Us
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium tracking-widest text-gray-500 uppercase">
          <a href="#" className="hover:text-gold-500 transition-colors">Visit</a>
          <a href="#" className="hover:text-gold-500 transition-colors">Exhibitions</a>
          <a href="#" className="hover:text-gold-500 transition-colors">Shop</a>
        </nav>
        <Button href="/create" variant="primary" className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full px-6 py-2">
          Create Art
        </Button>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center pt-20 overflow-hidden">

        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-terracotta-500/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 h-full flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8 z-10 text-center lg:text-left">
            <div className="space-y-2">
              <span className="block text-gold-500 font-serif italic text-xl">Antique Beauty</span>
              <h1 className="font-serif text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1]">
                Two Souls. <br />
                <span className="italic text-gray-600">One Line.</span>
              </h1>
            </div>

            <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
              Create a timeless masterpiece that intertwines your stories.
              Upload two photos and let our AI sculpt a unique one-line drawing,
              framed in elegance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button href="/create" className="bg-terracotta-500 hover:bg-terracotta-600 text-white text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                Start Creating
              </Button>
              <Button href="#how-it-works" variant="ghost" className="text-gray-500 hover:text-gray-900 px-8 py-4">
                View Gallery
              </Button>
            </div>
            <div className="mt-4 flex justify-center lg:justify-start">
              <CheckoutButton />
            </div>

            {/* Stats / Trust */}
            <div className="pt-8 flex gap-8 justify-center lg:justify-start border-t border-cream-200 mt-8">
              <div>
                <p className="font-serif text-3xl text-gray-900">50k+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Portraits Created</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-gray-900">4.9</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Star Rating</p>
              </div>
            </div>
          </div>

          {/* Hero Image / Viz */}
          <div className="lg:w-1/2 relative h-[50vh] lg:h-[80vh] w-full flex items-center justify-center">
            {/* Main Image Frame */}
            <div className="relative z-20 w-full max-w-md aspect-[3/4] shadow-2xl bg-white p-4 rounded-sm transform transition-transform hover:scale-[1.01] duration-700">
              <div className="relative w-full h-full border border-gray-100 overflow-hidden bg-gray-100">
                <Image
                  src="/hero-gallery.jpg"
                  alt="Gallery of Us Hero"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl max-w-[200px] hidden md:block border border-cream-100">
                <p className="font-serif text-xl text-terracotta-500 mb-1">The Collection</p>
                <p className="text-xs text-gray-500">Hand-curated AI masterpieces, merging nature&apos;s grace.</p>
              </div>
            </div>

            {/* Background Layers */}
            <div className="absolute top-10 right-10 w-full h-full border border-gold-400/30 z-10 hidden lg:block transform translate-x-4 translate-y-4"></div>
          </div>

        </div>
      </section>
    </main>
  );
}
