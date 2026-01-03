import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function AGBPage() {
    return (
        <main className="min-h-screen bg-cream-50 flex flex-col">
            <Header />

            <div className="flex-grow pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl bg-white p-8 md:p-16 shadow-sm rounded-sm">
                    <h1 className="font-serif text-4xl font-bold mb-8 text-gray-900">Allgemeine Geschäftsbedingungen (AGB)</h1>

                    <div className="prose prose-stone max-w-none text-gray-600">
                        <p className="not-prose text-sm text-gray-500 mb-8">Stand: Januar 2026</p>

                        <h3>1. Geltungsbereich</h3>
                        <p>
                            Für alle Bestellungen über den Online-Shop "The Gallery of Us" (nachfolgend „Anbieter“) durch Verbraucher und Unternehmer gelten die nachfolgenden AGB.
                        </p>
                        <p>
                            Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können. Unternehmer ist eine natürliche oder juristische Person oder eine rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt.
                        </p>

                        <h3>2. Vertragspartner, Vertragsschluss</h3>
                        <p>
                            Der Kaufvertrag kommt zustande mit The Gallery of Us, Inh. Dekory Jallow.
                        </p>
                        <p>
                            Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern einen unverbindlichen Online-Katalog dar. Sie können unsere Produkte (personalisierte Kunstwerke) konfigurieren und in den Warenkorb legen. Durch Anklicken des Bestellbuttons geben Sie eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab. Die Bestätigung des Eingangs der Bestellung erfolgt zusammen mit der Annahme der Bestellung unmittelbar nach dem Absenden durch eine automatisierte E-Mail. Mit dieser E-Mail-Bestätigung ist der Kaufvertrag zustande gekommen.
                        </p>

                        <h3>3. Individuelle Gestaltung & Mitwirkungspflichten</h3>
                        <p>
                            Der Kunde beauftragt den Anbieter mit der Erstellung individueller Kunstwerke basierend auf vom Kunden hochgeladenen Fotos. Der Kunde versichert, dass er über alle erforderlichen Rechte an den übermittelten Bildern verfügt und diese frei von Rechten Dritter sind.
                        </p>
                        <p>
                            Der Anbieter behält sich vor, Aufträge abzulehnen, die rassistische, diskriminierende, pornografische oder rechtswidrige Inhalte darstellen.
                        </p>

                        <h3>4. Preise und Versandkosten</h3>
                        <p>
                            Die auf den Produktseiten genannten Preise enthalten die gesetzliche Mehrwertsteuer und sonstige Preisbestandteile.
                        </p>
                        <p>
                            Zusätzlich zu den angegebenen Preisen berechnen wir für die Lieferung Versandkosten. Die Versandkosten werden Ihnen im Warenkorbsystem und auf der Bestellseite nochmals deutlich mitgeteilt.
                        </p>

                        <h3>5. Bezahlung</h3>
                        <p>
                            In unserem Shop stehen Ihnen grundsätzlich die folgenden Zahlungsarten zur Verfügung (abgewickelt über den Zahlungsdienstleister Stripe):
                        </p>
                        <ul>
                            <li><strong>Kreditkarte (Visa, Mastercard, American Express)</strong>: Die Belastung Ihrer Kreditkarte erfolgt mit Abschluss der Bestellung.</li>
                            <li><strong>PayPal</strong>: Sie bezahlen den Rechnungsbetrag über den Online-Anbieter PayPal.</li>
                            <li><strong>Apple Pay / Google Pay</strong>: Zahlung über Ihr Mobile Wallet.</li>
                        </ul>

                        <h3>6. Ausschluss des Widerrufsrechts</h3>
                        <div className="bg-orange-50 p-6 border-l-4 border-orange-300 my-6">
                            <strong className="text-orange-900 block mb-2">Wichtiger Hinweis zum Widerrufsrecht:</strong>
                            <p className="mb-0 text-orange-800">
                                Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind (§ 312g Abs. 2 Nr. 1 BGB).
                            </p>
                            <p className="mt-2 text-orange-800">
                                Da alle Produkte von "The Gallery of Us" individuell nach Ihren Bildvorlagen angefertigt werden („Custom Art“), besteht für diese Artikel <strong>kein Widerrufsrecht</strong>.
                            </p>
                        </div>

                        <h3>7. Lieferung & Eigentumsvorbehalt</h3>
                        <p>
                            Die Lieferung erfolgt innerhalb der beim Produkt angegebenen Lieferzeit (in der Regel 3-5 Werktage nach Zahlungseingang und erfolgreicher Erstellung der Druckdaten).
                        </p>
                        <p>
                            Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.
                        </p>

                        <h3>8. Transportschäden</h3>
                        <p>
                            Werden Waren mit offensichtlichen Transportschäden angeliefert, so reklamieren Sie solche Fehler bitte möglichst sofort beim Zusteller und nehmen Sie bitte unverzüglich Kontakt zu uns auf. Die Versäumung einer Reklamation oder Kontaktaufnahme hat für Ihre gesetzlichen Ansprüche und deren Durchsetzung, insbesondere Ihre Gewährleistungsrechte, keinerlei Konsequenzen. Sie helfen uns aber, unsere eigenen Ansprüche gegenüber dem Frachtführer bzw. der Transportversicherung geltend machen zu können.
                        </p>

                        <h3>9. Gewährleistung und Garantien</h3>
                        <p>
                            Es gilt das gesetzliche Mängelhaftungsrecht. Da es sich um künstlerische Interpretationen von Fotos handelt, stellen stilistische Abweichungen vom Originalfoto keinen Mangel dar. Der spezifische „Continuous Line“-Stil ist Teil der vereinbarten Beschaffenheit.
                        </p>

                        <h3>10. Streitbeilegung</h3>
                        <p>
                            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie hier finden: <a href="https://ec.europa.org/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.org/consumers/odr/</a>.<br />
                            Zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle sind wir nicht verpflichtet und nicht bereit.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
