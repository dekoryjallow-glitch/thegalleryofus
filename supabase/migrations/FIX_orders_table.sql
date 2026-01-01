-- FIX: Erstelle oder aktualisiere die orders Tabelle
-- Führe diese Datei direkt im Supabase SQL Editor aus

-- 1. Erstelle order_status ENUM, falls es nicht existiert
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM (
            'pending',      -- Checkout gestartet
            'paid',         -- Payment erfolgreich
            'fulfilled',    -- Print versendet
            'cancelled'
        );
    END IF;
END $$;

-- 2. Erstelle orders Tabelle, falls sie nicht existiert
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Optional: Generation ID (falls Order mit Generation verknüpft ist)
    generation_id UUID,
    
    -- Stripe Data
    stripe_checkout_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT UNIQUE,
    
    -- Order Details
    status order_status DEFAULT 'pending',
    amount_cents INT NOT NULL, -- In Cent (z.B. 4900 = 49,00€)
    currency TEXT DEFAULT 'EUR',
    
    -- Image URL (für direkte Orders ohne Generation)
    image_url TEXT,
    
    -- Gelato Product UID (für Print-on-Demand)
    gelato_product_uid TEXT,
    
    -- Shipping (optional, wenn du Print-on-Demand nutzt)
    shipping_name TEXT,
    shipping_address JSONB, -- {street, city, zip, country}
    
    -- Gelato Order Tracking
    gelato_order_id TEXT,
    gelato_order_status TEXT,
    
    -- Tracking
    tracking_number TEXT,
    tracking_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    fulfilled_at TIMESTAMPTZ
);

-- 3. Füge fehlende Spalten hinzu, falls die Tabelle bereits existiert
DO $$ 
BEGIN
    -- gelato_order_id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'gelato_order_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN gelato_order_id TEXT;
    END IF;

    -- gelato_order_status
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'gelato_order_status'
    ) THEN
        ALTER TABLE orders ADD COLUMN gelato_order_status TEXT;
    END IF;

    -- shipping_address
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'shipping_address'
    ) THEN
        ALTER TABLE orders ADD COLUMN shipping_address JSONB;
    END IF;

    -- image_url
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE orders ADD COLUMN image_url TEXT;
    END IF;

    -- gelato_product_uid
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'gelato_product_uid'
    ) THEN
        ALTER TABLE orders ADD COLUMN gelato_product_uid TEXT;
    END IF;
END $$;

-- 4. Erstelle Indizes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_checkout_id ON orders(stripe_checkout_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_gelato_order_id ON orders(gelato_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_generation_id ON orders(generation_id);

-- 5. RLS Policies - Entferne alte Policies zuerst
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;

-- Erstelle Policies für normale User
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
    ON orders FOR UPDATE
    USING (auth.uid() = user_id);

-- WICHTIG: Service Role Policy für Admin-Client
-- Diese Policy erlaubt dem Service Role (Admin Client) alle Operationen
CREATE POLICY "Service role can manage orders"
    ON orders
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 6. Kommentare für Dokumentation
COMMENT ON COLUMN orders.generation_id IS 'Optional: Verknüpfung zu einer Generation';
COMMENT ON COLUMN orders.image_url IS 'URL des Bildes (für direkte Orders ohne Generation)';
COMMENT ON COLUMN orders.gelato_product_uid IS 'Gelato Product UID für Print-on-Demand';
COMMENT ON COLUMN orders.gelato_order_id IS 'Gelato Order ID (Draft Order)';
COMMENT ON COLUMN orders.gelato_order_status IS 'Status der Gelato Order (draft, pending, fulfilled, etc.)';
COMMENT ON COLUMN orders.shipping_address IS 'Versandadresse als JSONB (aus Stripe Checkout)';

-- 7. Prüfe ob alles korrekt erstellt wurde
DO $$
BEGIN
    RAISE NOTICE 'Orders table check:';
    RAISE NOTICE 'Table exists: %', EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders');
    RAISE NOTICE 'Columns: %', (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'orders');
    RAISE NOTICE 'RLS enabled: %', (SELECT rowsecurity FROM pg_tables WHERE tablename = 'orders');
END $$;


