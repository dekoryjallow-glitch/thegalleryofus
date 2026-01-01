-- Erweitere die orders Tabelle um Gelato-Felder und Versandinformationen
-- Diese Migration fügt die benötigten Felder hinzu, falls sie noch nicht existieren

-- Prüfe ob die Spalten bereits existieren und füge sie nur hinzu, wenn sie fehlen
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
END $$;

-- Erstelle Index für gelato_order_id für bessere Performance
CREATE INDEX IF NOT EXISTS idx_orders_gelato_order_id ON orders(gelato_order_id);

-- Kommentare für Dokumentation
COMMENT ON COLUMN orders.gelato_order_id IS 'Gelato Order ID (Draft Order)';
COMMENT ON COLUMN orders.gelato_order_status IS 'Status der Gelato Order (draft, pending, fulfilled, etc.)';
COMMENT ON COLUMN orders.shipping_address IS 'Versandadresse als JSONB (aus Stripe Checkout)';
COMMENT ON COLUMN orders.image_url IS 'URL des generierten Bildes (für Gelato Fulfillment)';


