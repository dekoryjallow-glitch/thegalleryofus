import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ImpressumPage() {
    return (
        <main className="min-h-screen bg-cream-50 flex flex-col">
            <Header />

            <div className="flex-grow pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl bg-white p-8 md:p-16 shadow-sm rounded-sm">
                    <h1 className="font-serif text-4xl font-bold mb-8 text-gray-900">Impressum</h1>

                    <div className="prose prose-stone max-w-none text-gray-600">
                        <h3 className="text-xl font-bold text-gray-900">Angaben gemäß § 5 TMG</h3>

                        <p>
                            <strong>The Gallery of Us</strong><br />
                            Inh. Dekory Jallow<br />
                            Friedrich-Naumann-Str. 40<br />
                            21075 Hamburg<br />
                            Deutschland
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 mt-8">Kontakt</h3>
                        <p>
                            Telefon: +49 151 29663077<br />
                            E-Mail: <a href="mailto:dekory@onvisimedia.com">dekory@onvisimedia.com</a>
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 mt-8">Umsatzsteuer-ID / Steuernummer</h3>
                        <p>
                            Steuernummer: 86174095832<br />
                            <span className="text-sm text-gray-500">(Umsatzsteuer-Identifikationsnummer wird nachgereicht)</span>
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 mt-8">Redaktionell verantwortlich</h3>
                        <p>
                            Dekory Jallow<br />
                            Friedrich-Naumann-Str. 40<br />
                            21075 Hamburg
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 mt-8">EU-Streitschlichtung</h3>
                        <p>
                            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.org/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.org/consumers/odr/</a>.<br />
                            Unsere E-Mail-Adresse finden Sie oben im Impressum.
                        </p>

                        <h3 className="text-xl font-bold text-gray-900 mt-8">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h3>
                        <p>
                            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
