# Vercel Deployment Guide

## Was ist Vercel?

Vercel ist ein Hosting-Provider, der speziell für Next.js optimiert ist:
- **Kostenlos** für kleine Projekte
- **Automatische Deployments** aus GitHub/GitLab
- **SSL-Zertifikate** automatisch
- **CDN** (Content Delivery Network) für schnelle Ladezeiten
- **Serverless Functions** für API Routes
- **Preview Deployments** für jeden Pull Request

## Vorteile für dieses Projekt:

1. **Einfaches Deployment:** Einfach GitHub Repository verbinden
2. **Automatische Builds:** Jeder Push erstellt ein neues Deployment
3. **Environment Variables:** Einfach im Dashboard setzen
4. **Kostenlos:** Für kleine Projekte völlig ausreichend
5. **Next.js optimiert:** Perfekt für Next.js 14 App Router

## Deployment-Schritte:

### 1. Code auf GitHub pushen

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/dein-username/gallery-of-us.git
git push -u origin main
```

### 2. Vercel Account erstellen

1. Gehe zu https://vercel.com
2. Sign Up mit GitHub Account
3. Klicke "Add New Project"
4. Wähle dein Repository aus

### 3. Environment Variables setzen

Im Vercel Dashboard, unter "Settings" → "Environment Variables", füge hinzu:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
REPLICATE_API_TOKEN=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=... (aus Stripe Dashboard für Production)
STRIPE_PRICE_ID=...
GELATO_API_KEY=...
NEXT_PUBLIC_APP_URL=https://gallery-of-us.vercel.app
```

### 4. Deploy

Klicke "Deploy" - Vercel baut automatisch dein Projekt.

### 5. Stripe Webhook konfigurieren

1. Im Stripe Dashboard: Webhooks → Add endpoint
2. URL: `https://gallery-of-us.vercel.app/api/webhook/stripe`
3. Event: `checkout.session.completed`
4. Kopiere den Webhook Secret und füge ihn zu Vercel Environment Variables hinzu

## Nach dem Deployment:

- Deine App ist unter `https://gallery-of-us.vercel.app` erreichbar
- Jeder Git Push erstellt automatisch ein neues Deployment
- Preview Deployments für Pull Requests

## Domain hinzufügen (später):

1. Im Vercel Dashboard: Settings → Domains
2. Füge deine Domain hinzu
3. Folge den DNS-Anweisungen
4. SSL wird automatisch eingerichtet


