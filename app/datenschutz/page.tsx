import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function DatenschutzPage() {
    return (
        <main className="min-h-screen bg-cream-50 flex flex-col">
            <Header />

            <div className="flex-grow pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-4xl bg-white p-8 md:p-16 shadow-sm rounded-sm">
                    <h1 className="font-serif text-4xl font-bold mb-8 text-gray-900">Datenschutzerklärung</h1>

                    <div className="prose prose-stone max-w-none text-gray-600">
                        <h3>1. Datenschutz auf einen Blick</h3>
                        <p>
                            <strong>Allgemeine Hinweise</strong><br />
                            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                        </p>
                        <p>
                            <strong>Datenerfassung auf dieser Website</strong><br />
                            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.<br />
                            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z. B. durch das Hochladen von Fotos oder Eingabe im Bestellformular). Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst (z. B. technische Daten wie Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                        </p>

                        <h3>2. Hosting</h3>
                        <p>
                            Wir hosten die Inhalte unserer Website bei folgenden Anbietern:
                        </p>
                        <p>
                            <strong>Supabase</strong><br />
                            Anbieter ist Supabase, Inc., 970 Toa Payoh North #07-04, Singapore 319000. Supabase stellt uns Datenbank- und Authentifizierungsdienste zur Verfügung. Die Datenverarbeitung kann auch auf Servern außerhalb der EU stattfinden. Wir haben mit dem Anbieter eine Vereinbarung zur Auftragsverarbeitung (AVV) bzw. Standardvertragsklauseln abgeschlossen, um die Sicherheit Ihrer Daten zu gewährleisten.
                        </p>

                        <h3>3. Allgemeine Hinweise und Pflichtinformationen</h3>
                        <p>
                            <strong>Datenschutz</strong><br />
                            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                        </p>
                        <p>
                            <strong>Hinweis zur verantwortlichen Stelle</strong><br />
                            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
                            The Gallery of Us<br />
                            Inh. Dekory Jallow<br />
                            Friedrich-Naumann-Str. 40<br />
                            21075 Hamburg<br />
                            E-Mail: dekory@onvisimedia.com
                        </p>

                        <h3>4. Datenerfassung auf dieser Website</h3>
                        <h4>Cookies</h4>
                        <p>
                            Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Textdateien und richten auf Ihrem Endgerät keinen Schaden an. Sie dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Die meisten der von uns verwendeten Cookies sind so genannte „Session-Cookies“. Sie werden nach Ende Ihres Besuchs automatisch gelöscht.
                        </p>
                        <h4>Kontaktformular / E-Mail-Kontakt</h4>
                        <p>
                            Wenn Sie uns per Kontaktformular oder E-Mail Anfragen zukommen lassen, werden Ihre Angaben aus der Anfrage inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                        </p>

                        <h3>5. E-Commerce und Zahlungsanbieter</h3>
                        <h4>Verarbeitung von Daten (Kunden- und Vertragsdaten)</h4>
                        <p>
                            Wir erheben, verarbeiten und nutzen personenbezogene Daten nur, soweit sie für die Begründung, inhaltliche Ausgestaltung oder Änderung des Rechtsverhältnisses erforderlich sind (Bestandsdaten). Dies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, der die Verarbeitung von Daten zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen gestattet.
                        </p>
                        <h4>Datenübermittlung bei Vertragsschluss für Online-Shops, Händler und Warenversand</h4>
                        <p>
                            Wir übermitteln personenbezogene Daten an Dritte nur dann, wenn dies im Rahmen der Vertragsabwicklung notwendig ist, etwa an die mit der Lieferung der Ware betrauten Unternehmen (Druckdienstleister) oder das mit der Zahlungsabwicklung beauftragte Kreditinstitut. Eine weitergehende Übermittlung der Daten erfolgt nicht bzw. nur dann, wenn Sie der Übermittlung ausdrücklich zugestimmt haben.
                        </p>
                        <h4>Zahlungsdienste (Stripe)</h4>
                        <p>
                            Wir binden auf dieser Website Zahlungsdienste des Unternehmens Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland ein. Wenn Sie sich für eine Bezahlung über Stripe entscheiden, werden die von Ihnen eingegebenen Zahlungsdaten an Stripe übermittelt. Die Übermittlung Ihrer Daten an Stripe erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragsabwicklung) sowie auf Grundlage unseres berechtigten Interesses am Einsatz sicherer Zahlungsmethoden (Art. 6 Abs. 1 lit. f DSGVO).
                        </p>

                        <h3>6. Bildverarbeitung und KI-Dienste</h3>
                        <p>
                            Zur Erstellung der personalisierten Kunstwerke ("Continuous Line Art") verwenden wir spezialisierte Software-Dienste für Bildverarbeitung (u.a. KI-basierte Tools).
                        </p>
                        <p>
                            <strong>Verarbeitung von Fotos</strong><br />
                            Die von Ihnen hochgeladenen Fotos werden ausschließlich zum Zweck der Erstellung des bestellten Kunstwerks verarbeitet. Die Bilder werden an unseren technischen Dienstleister für Bildberechnung übertragen. Nach Abschluss des Auftrags und Ablauf der Gewährleistungsfristen werden die Originalfotos automatisiert gelöscht. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
                        </p>

                        <h3>7. Ihre Rechte</h3>
                        <p>
                            Sie haben jederzeit das Recht auf unentgeltliche <strong>Auskunft</strong> über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf <strong>Berichtigung</strong> oder <strong>Löschung</strong> dieser Daten. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft <strong>widerrufen</strong>. Außerdem haben Sie ein Recht auf <strong>Einschränkung der Verarbeitung</strong> unter bestimmten Umständen sowie ein Recht auf <strong>Datenübertragbarkeit</strong>. Des Weiteren steht Ihnen ein <strong>Beschwerderecht</strong> bei der zuständigen Aufsichtsbehörde zu.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
