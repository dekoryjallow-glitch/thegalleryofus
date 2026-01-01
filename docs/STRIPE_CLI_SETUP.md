# Stripe CLI Setup für lokales Testing

## 1. Stripe CLI installieren

### Windows:
1. Lade die neueste Version von https://github.com/stripe/stripe-cli/releases
2. Entpacke die ZIP-Datei
3. Füge den Ordner zu deinem PATH hinzu (oder nutze den vollständigen Pfad)

### Alternative (mit Scoop):
```powershell
scoop install stripe
```

### Alternative (mit Chocolatey):
```powershell
choco install stripe-cli
```

## 2. Stripe CLI authentifizieren

1. Öffne ein Terminal
2. Führe aus:
```bash
stripe login
```
3. Folge den Anweisungen im Browser (Stripe Account Login)

## 3. Webhook-Forwarding starten

Während dein Next.js Dev-Server läuft (`npm run dev`), öffne ein **zweites Terminal** und führe aus:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

**Wichtig:** Die Stripe CLI gibt dir einen **Webhook Signing Secret** aus, der mit `whsec_` beginnt.

## 4. Webhook Secret in .env.local setzen

Kopiere den `whsec_...` Wert aus dem Terminal und füge ihn zu deiner `.env.local` hinzu:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Wichtig:** Dieser Secret ist nur für lokales Testing! Für Production bekommst du einen anderen Secret aus dem Stripe Dashboard.

## 5. Test-Event senden

In einem dritten Terminal kannst du Test-Events senden:

```bash
# Teste checkout.session.completed Event
stripe trigger checkout.session.completed
```

## 6. Webhook-Events im Terminal sehen

Die Stripe CLI zeigt dir alle eingehenden Webhook-Events in Echtzeit an.

## Troubleshooting

- **Port bereits belegt?** Ändere den Port: `stripe listen --forward-to localhost:3001/api/webhook/stripe`
- **Webhook Secret nicht gefunden?** Prüfe, ob der `whsec_...` Wert korrekt in `.env.local` steht
- **Events kommen nicht an?** Prüfe, ob der Next.js Server läuft und die Route `/api/webhook/stripe` existiert


