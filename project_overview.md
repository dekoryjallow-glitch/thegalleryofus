GalleryOfUs – Project Architecture Documentation
Version: 1.0
Stack: Next.js 14 (App Router), Supabase, Replicate API, Stripe
Purpose: Micro-SaaS für personalisierte Continuous-Line Wandkunst aus Paar-Selfies
📁 Folder Structure (Next.js 14 App Router)
code
Code
gallery-of-us/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx              # Auth-spezifisches Layout
│   ├── (dashboard)/
│   │   ├── create/
│   │   │   └── page.tsx            # Upload Interface
│   │   ├── preview/
│   │   │   └── [generationId]/
│   │   │       └── page.tsx        # Preview + Mockup
│   │   ├── orders/
│   │   │   └── page.tsx            # Order History
│   │   └── layout.tsx              # Dashboard Layout mit Nav
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts            # POST: Start Replicate Job
│   │   ├── webhook/
│   │   │   └── replicate/
│   │   │       └── route.ts        # POST: Replicate Webhook
│   │   ├── checkout/
│   │   │   └── route.ts            # POST: Create Stripe Checkout
│   │   └── webhook/
│   │       └── stripe/
│   │           └── route.ts        # POST: Stripe Webhook
│   ├── layout.tsx                   # Root Layout
│   ├── page.tsx                     # Landing Page
│   └── globals.css                  # Tailwind Base
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Toast.tsx
│   ├── upload/
│   │   ├── DualUpload.tsx           # Component für 2 Selfie-Uploads
│   │   └── ImagePreview.tsx
│   ├── preview/
│   │   ├── MockupViewer.tsx         # Zeigt Generated Image im Mockup
│   │   └── DownloadButton.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser Client
│   │   ├── server.ts                # Server-side Client
│   │   └── middleware.ts            # Auth Middleware
│   ├── replicate/
│   │   ├── client.ts                # Replicate SDK Wrapper
│   │   └── models.ts                # Model Config (InstantID etc.)
│   ├── stripe/
│   │   └── client.ts                # Stripe SDK Init
│   ├── utils/
│   │   ├── image.ts                 # Image Validation/Resize
│   │   └── validators.ts
│   └── constants.ts                 # Pricing, Limits etc.
├── types/
│   ├── database.ts                  # Supabase Generated Types
│   └── index.ts
├── public/
│   ├── mockups/                     # Mockup-Images für Preview
│   └── examples/                    # Example Artworks
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── config.toml
├── .env.local
├── middleware.ts                    # Next.js Middleware für Auth
├── next.config.js
└── package.json
🗄️ Supabase Database Schema
Tables
1. profiles
Erweitert Supabase Auth User.
code
SQL
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  credits INT DEFAULT 0, -- Für Credit-System (falls du Pre-Purchase Credits anbietest)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
2. generations
Speichert jeden Generierungs-Job.
code
SQL
CREATE TYPE generation_status AS ENUM (
  'pending',      -- Warten auf Replicate
  'processing',   -- Replicate verarbeitet
  'completed',    -- Erfolgreich generiert
  'failed'        -- Fehler
);

CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Input Images (Supabase Storage Paths)
  selfie_1_url TEXT NOT NULL,
  selfie_2_url TEXT NOT NULL,
  
  -- Replicate Job
  replicate_id TEXT UNIQUE, -- Replicate Prediction ID
  status generation_status DEFAULT 'pending',
  
  -- Output Image
  result_url TEXT, -- URL zum generierten Bild
  result_storage_path TEXT, -- Pfad in Supabase Storage
  
  -- Metadata
  prompt TEXT, -- Optional: Custom Prompt für Generation
  model_version TEXT, -- Welches Replicate Model
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_replicate_id ON generations(replicate_id);
CREATE INDEX idx_generations_status ON generations(status);

-- RLS Policies
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generations"
  ON generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
  ON generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
3. orders
Speichert Bestellungen nach Stripe Checkout.
code
SQL
CREATE TYPE order_status AS ENUM (
  'pending',      -- Checkout gestartet
  'paid',         -- Payment erfolgreich
  'fulfilled',    -- Print versendet
  'cancelled'
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  generation_id UUID NOT NULL REFERENCES generations(id) ON DELETE RESTRICT,
  
  -- Stripe Data
  stripe_checkout_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT UNIQUE,
  
  -- Order Details
  status order_status DEFAULT 'pending',
  amount_cents INT NOT NULL, -- In Cent (z.B. 7490 = 74,90€)
  currency TEXT DEFAULT 'EUR',
  
  -- Shipping (optional, wenn du Print-on-Demand nutzt)
  shipping_name TEXT,
  shipping_address JSONB, -- {street, city, zip, country}
  
  -- Tracking
  tracking_number TEXT,
  tracking_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  fulfilled_at TIMESTAMPTZ
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_stripe_checkout_id ON orders(stripe_checkout_id);
CREATE INDEX idx_orders_status ON orders(status);

-- RLS Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);
Storage Buckets
code
SQL
-- Bucket für Selfie-Uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('selfies', 'selfies', false);

-- Bucket für generierte Bilder
INSERT INTO storage.buckets (id, name, public)
VALUES ('generations', 'generations', false);

-- Storage Policies für Selfies
CREATE POLICY "Users can upload own selfies"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'selfies' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own selfies"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'selfies' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage Policies für Generations
CREATE POLICY "Users can view own generations"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'generations' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "System can insert generations"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'generations');
🤖 Replicate API Integration Flow
Architecture Overview
code
Code
User Upload → Next.js API → Supabase Storage → Replicate API
                                    ↓
                           (Webhook/Polling) ← Replicate
                                    ↓
                          Update DB + Store Image
Step-by-Step Flow
1. User Upload (/api/generate)
code
TypeScript
// app/api/generate/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const formData = await req.formData()
  const selfie1 = formData.get('selfie1') as File
  const selfie2 = formData.get('selfie2') as File
  
  // 1. Upload zu Supabase Storage
  const selfie1Path = `${user.id}/${Date.now()}_1.jpg`
  const selfie2Path = `${user.id}/${Date.now()}_2.jpg`
  
  await supabase.storage.from('selfies').upload(selfie1Path, selfie1)
  await supabase.storage.from('selfies').upload(selfie2Path, selfie2)
  
  const { data: { publicUrl: url1 } } = supabase.storage.from('selfies').getPublicUrl(selfie1Path)
  const { data: { publicUrl: url2 } } = supabase.storage.from('selfies').getPublicUrl(selfie2Path)
  
  // 2. Create Generation Record
  const { data: generation, error } = await supabase
    .from('generations')
    .insert({
      user_id: user.id,
      selfie_1_url: url1,
      selfie_2_url: url2,
      status: 'pending',
      model_version: 'instantid-v1'
    })
    .select()
    .single()
  
  if (error) throw error
  
  // 3. Start Replicate Job
  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  
  const prediction = await replicate.predictions.create({
    version: "YOUR_MODEL_VERSION_HASH",
    input: {
      image_1: url1,
      image_2: url2,
      prompt: "continuous line drawing, minimalist art, single line portrait, abstract faces",
      negative_prompt: "photograph, realistic, detailed",
      num_inference_steps: 30
    },
    webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/replicate`,
    webhook_events_filter: ["completed"]
  })
  
  // 4. Update Generation mit Replicate ID
  await supabase
    .from('generations')
    .update({ 
      replicate_id: prediction.id,
      status: 'processing'
    })
    .eq('id', generation.id)
  
  return NextResponse.json({ 
    generationId: generation.id,
    replicateId: prediction.id 
  })
}
2. Replicate Webhook Handler
code
TypeScript
// app/api/webhook/replicate/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Service Role für Admin-Zugriff
  )
  
  const payload = await req.json()
  const { id: replicateId, status, output, error } = payload
  
  // 1. Finde Generation
  const { data: generation } = await supabase
    .from('generations')
    .select('*')
    .eq('replicate_id', replicateId)
    .single()
  
  if (!generation) {
    return NextResponse.json({ error: 'Generation not found' }, { status: 404 })
  }
  
  // 2. Handle Status
  if (status === 'succeeded' && output) {
    // Download Image von Replicate URL
    const response = await fetch(output[0]) // output ist Array von URLs
    const blob = await response.blob()
    
    // Upload zu Supabase Storage
    const resultPath = `${generation.user_id}/${generation.id}.jpg`
    await supabase.storage
      .from('generations')
      .upload(resultPath, blob, { contentType: 'image/jpeg' })
    
    const { data: { publicUrl } } = supabase.storage
      .from('generations')
      .getPublicUrl(resultPath)
    
    // Update Generation
    await supabase
      .from('generations')
      .update({
        status: 'completed',
        result_url: publicUrl,
        result_storage_path: resultPath,
        completed_at: new Date().toISOString()
      })
      .eq('id', generation.id)
      
  } else if (status === 'failed') {
    await supabase
      .from('generations')
      .update({
        status: 'failed',
        error_message: error || 'Unknown error'
      })
      .eq('id', generation.id)
  }
  
  return NextResponse.json({ success: true })
}
3. Polling Alternative (für Development)
Falls du in Dev keinen Webhook nutzen kannst:
code
TypeScript
// lib/replicate/polling.ts
export async function pollReplicateStatus(replicateId: string) {
  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN })
  
  let prediction = await replicate.predictions.get(replicateId)
  
  while (prediction.status === 'starting' || prediction.status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, 2000)) // 2s Pause
    prediction = await replicate.predictions.get(replicateId)
  }
  
  return prediction
}
Dann in /api/generate nach dem Create den Poll starten:
code
TypeScript
// Nach replicate.predictions.create():
// Option 1: Client-side Polling via Status-Endpoint
// Option 2: Server-side Background Job (z.B. mit Vercel Cron oder Queue)
💳 Stripe Checkout Flow
1. Create Checkout Session
code
TypeScript
// app/api/checkout/route.ts
import Stripe from 'stripe'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
})

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  
  const { generationId } = await req.json()
  
  // 1. Verify Generation existiert und gehört User
  const { data: generation } = await supabase
    .from('generations')
    .select('*')
    .eq('id', generationId)
    .eq('user_id', user.id)
    .single()
  
  if (!generation || generation.status !== 'completed') {
    return NextResponse.json({ error: 'Invalid generation' }, { status: 400 })
  }
  
  // 2. Create Order Record
  const { data: order } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      generation_id: generationId,
      amount_cents: 7490, // 74,90€
      currency: 'EUR',
      status: 'pending'
    })
    .select()
    .single()
  
  // 3. Create Stripe Checkout
  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Personalized Line Art Print',
          images: [generation.result_url],
        },
        unit_amount: 7490,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/preview/${generationId}`,
    metadata: {
      orderId: order.id,
      generationId: generationId
    }
  })
  
  // 4. Update Order mit Stripe ID
  await supabase
    .from('orders')
    .update({ stripe_checkout_id: session.id })
    .eq('id', order.id)
  
  return NextResponse.json({ checkoutUrl: session.url })
}
2. Stripe Webhook Handler
code
TypeScript
// app/api/webhook/stripe/route.ts
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        stripe_payment_intent_id: session.payment_intent as string,
        paid_at: new Date().toISOString()
      })
      .eq('stripe_checkout_id', session.id)
  }
  
  return NextResponse.json({ received: true })
}