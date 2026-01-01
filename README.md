# Galleryofus

Ein Micro-SaaS für personalisierte Continuous-Line Wandkunst aus Paar-Selfies.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth, Database, Storage)
- **Replicate API** (AI Image Generation)
- **Stripe** (Payments)

## Setup

1. Installiere Dependencies:
```bash
npm install
```

2. Erstelle `.env.local` Datei:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Replicate
REPLICATE_API_TOKEN=your_replicate_api_token

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Starte den Development Server:
```bash
npm run dev
```

## Projektstruktur

Siehe `project_overview.md` für detaillierte Dokumentation der Datenbank-Struktur und API-Logik.

## Design

- **Schriftarten**: Playfair Display (Überschriften), Inter (Fließtext)
- **Styling**: Minimalistische Art Gallery Optik mit Gold/Creme Farbpalette

