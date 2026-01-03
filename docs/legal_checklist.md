# Rechtliche Checkliste & Warnhinweise vor dem Launch

> **Hinweis:** Diese Dokumente wurden als solide Grundlage für den Launch erstellt, ersetzen jedoch keine anwaltliche Prüfung.

## ✅ Checkliste vor dem Launch

1.  **Impressum vervollständigen**
    *   [ ] Firmenname (exakte Rechtsform beachten, z.B. GmbH, UG (haftungsbeschränkt))
    *   [ ] Ladungsfähige Anschrift (kein Postfach)
    *   [ ] Vertretungsberechtigte Person (Geschäftsführer)
    *   [ ] E-Mail-Adresse und Telefonnummer
    *   [ ] Handelsregister-Eintrag (falls vorhanden) & USt-IdNr.
    *   [ ] Link zur Online-Streitbeilegung (OS-Plattform) ist vorhanden und klickbar.

2.  **AGB / Widerrufsrecht**
    *   [ ] Im Checkout-Prozess muss ein Haken gesetzt werden können: "Ich habe die AGB und die Datenschutzerklärung gelesen und stimme zu."
    *   [ ] **Wichtig:** Da das Widerrufsrecht für personalisierte Produkte ausgeschlossen ist, sollte der Kunde idealerweise im Checkout explizit darauf hingewiesen werden ("Da es sich um eine individuelle Anfertigung handelt, besteht kein Widerrufsrecht.").

3.  **Datenschutz**
    *   [ ] Cookie-Banner: Verwenden Sie ein Consent-Tool (z.B. Cookiebot, Usercentrics), wenn Sie Tracking-Cookies (Google Analytics, Facebook Pixel) nutzen. Für essenzielle Cookies (Session, Warenkorb) ist kein Banner zwingend, aber eine Info ratsam.
    *   [ ] Prüfen Sie die Auftragsverarbeitungsverträge (AVV) mit:
        *   Stripe
        *   Supabase
        *   E-Mail-Provider (z.B. Resend)
        *   Ggf. Replicate (AI Provider) - hier US-Datentransfer beachten!

4.  **Preisangaben**
    *   [ ] Alle Preise müssen inkl. MwSt. ausgewiesen sein ("inkl. MwSt., zzgl. Versand").
    *   [ ] Versandkosten müssen verlinkt oder direkt sichtbar sein.

## ⚠️ Rechtliche Risiken & Warnhinweise

### 1. Ausschluss des Widerrufsrechts („Custom Products“)
*   **Risiko:** Wenn ein Produkt nicht *eindeutig* personalisiert ist (z.B. nur ein Standard-Poster), greift der Ausschluss nicht.
*   **Lösung:** Bei "The Gallery of Us" (individuelles Kunstwerk aus User-Foto) ist der Ausschluss rechtlich sehr sicher (§ 312g Abs. 2 Nr. 1 BGB). Dokumentieren Sie den individuellen Erstellungsprozess.

### 2. Nutzung von US-Diensten (Supabase, Stripe, Replicate)
*   **Risiko:** Datentransfer in die USA (Drittlandtransfer) ist nach DSGVO streng geregelt.
*   **Empfehlung:**
    *   Stellen Sie sicher, dass die Standardvertragsklauseln (SCCs) in den AVVs der Anbieter enthalten sind.
    *   Datenschutzerklärung informiert transparent darüber (erledigt).
    *   Bei User-Fotos (biometrische Daten?) ist besondere Vorsicht geboten. Replicate löscht Daten meist nach kurzer Zeit, dies sollte sichergestellt sein.

### 3. Urheberrecht an User-Fotos
*   **Risiko:** User laden Fotos hoch, an denen sie keine Rechte haben.
*   **Lösung:** Die AGB enthalten eine Klausel, die den User in die Pflicht nimmt (Ziffer 3). Der User stellt Sie von Ansprüchen Dritter frei.

### 4. "Manuelle" Fulfillment-Prozesse
*   **Risiko:** Wenn Sie manuell bei Gelato bestellen, geben Sie Kundendaten weiter.
*   **Lösung:** Auch hierfür benötigen Sie formell einen AVV mit der Druckerei (Gelato), da Sie Daten im Auftrag verarbeiten lassen.

### 💡 Empfehlung für anwaltliche Prüfung
Lassen Sie insbesondere folgende Punkte final von einem Fachanwalt prüfen:
*   Den konkreten Checkout-Prozess (Button-Beschriftung "Kaufen" / "Zahlungspflichtig bestellen" ist Pflicht!).
*   Die Umsetzung des Cookie-Banners (falls Tracking genutzt wird).
*   Die Formulierung zum Widerrufsrecht im Checkout.
