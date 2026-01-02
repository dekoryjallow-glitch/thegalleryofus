-- Erstelle die orders Tabelle, falls sie nicht existiert
-- Diese Migration sollte vor 001_add_orders_fields.sql ausgeführt werden

-- Erstelle order_status ENUM, falls es nicht existiert
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

-- Erstelle orders Tabelle, falls sie nicht existiert
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Optional: Generation ID (falls Order mit Generation verknüpft ist)
    generation_id UUID REFERENCES generations(id) ON DELETE RESTRICT,
    
    -- Stripe Data
    stripe_checkout_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT UNIQUE,
    
    -- Order Details
    status order_status DEFAULT 'pending',
    amount_cents INT NOT NULL, -- In Cent (z.B. 7490 = 74,90€)
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

-- Erstelle Indizes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_checkout_id ON orders(stripe_checkout_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_gelato_order_id ON orders(gelato_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_generation_id ON orders(generation_id);

-- RLS Policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Entferne alte Policies, falls sie existieren
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- Erstelle neue Policies
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
    ON orders FOR UPDATE
    USING (auth.uid() = user_id);

-- Kommentare für Dokumentation
COMMENT ON COLUMN orders.generation_id IS 'Optional: Verknüpfung zu einer Generation';
COMMENT ON COLUMN orders.image_url IS 'URL des Bildes (für direkte Orders ohne Generation)';
COMMENT ON COLUMN orders.gelato_product_uid IS 'Gelato Product UID für Print-on-Demand';
COMMENT ON COLUMN orders.gelato_order_id IS 'Gelato Order ID (Draft Order)';
COMMENT ON COLUMN orders.gelato_order_status IS 'Status der Gelato Order (draft, pending, fulfilled, etc.)';
COMMENT ON COLUMN orders.shipping_address IS 'Versandadresse als JSONB (aus Stripe Checkout)';


