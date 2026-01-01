-- FIX: Komplettes Fix für Checkout-Probleme
-- Führe dieses SQL im Supabase SQL Editor aus
-- Dieses Skript behebt alle bekannten Probleme auf einmal

-- ============================================
-- 1. Stelle sicher, dass order_status ENUM existiert
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM (
            'pending',      -- Checkout gestartet
            'paid',         -- Payment erfolgreich
            'fulfilled',    -- Print versendet
            'cancelled'
        );
        RAISE NOTICE 'order_status ENUM wurde erstellt';
    ELSE
        RAISE NOTICE 'order_status ENUM existiert bereits';
    END IF;
END $$;

-- ============================================
-- 2. Stelle sicher, dass alle benötigten Spalten existieren
-- ============================================

DO $$
BEGIN
    -- image_url
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE orders ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Spalte image_url wurde hinzugefügt';
    END IF;

    -- gelato_product_uid
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'gelato_product_uid'
    ) THEN
        ALTER TABLE orders ADD COLUMN gelato_product_uid TEXT;
        RAISE NOTICE 'Spalte gelato_product_uid wurde hinzugefügt';
    END IF;

    -- Stelle sicher, dass status ein ENUM ist
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'status'
        AND data_type != 'USER-DEFINED'
    ) THEN
        -- Nur konvertieren wenn Tabelle leer ist
        IF NOT EXISTS (SELECT 1 FROM orders LIMIT 1) THEN
            ALTER TABLE orders DROP COLUMN status;
            ALTER TABLE orders ADD COLUMN status order_status DEFAULT 'pending';
            RAISE NOTICE 'Spalte status wurde zu ENUM konvertiert';
        ELSE
            RAISE WARNING 'Tabelle enthält Daten - status kann nicht konvertiert werden';
        END IF;
    END IF;
END $$;

-- ============================================
-- 3. Entferne alle bestehenden Policies
-- ============================================

DROP POLICY IF EXISTS "Service role can manage orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- ============================================
-- 4. Erstelle Service Role Policy ZUERST
-- ============================================
-- WICHTIG: Diese Policy muss zuerst erstellt werden

-- Versuche explizit für service_role
CREATE POLICY "Service role can manage orders"
    ON orders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Falls das nicht funktioniert, erstelle zusätzlich eine für alle Rollen
-- (aber Service Role sollte Vorrang haben)
CREATE POLICY "Service role fallback policy"
    ON orders
    FOR ALL
    USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR
        -- Fallback: Wenn Admin Client verwendet wird
        current_setting('request.jwt.claims', true) IS NULL
    )
    WITH CHECK (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
        OR
        current_setting('request.jwt.claims', true) IS NULL
    );

-- ============================================
-- 5. Erstelle User Policies
-- ============================================

CREATE POLICY "Users can view own orders"
    ON orders
    FOR SELECT
    TO authenticated
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own orders"
    ON orders
    FOR INSERT
    TO authenticated
    WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own orders"
    ON orders
    FOR UPDATE
    TO authenticated
    USING ((select auth.uid()) = user_id);

-- ============================================
-- 6. VERIFICATION
-- ============================================

-- Zeige alle Policies
SELECT 
    policyname,
    roles,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'HAS USING'
        ELSE 'NO USING'
    END as has_using,
    CASE 
        WHEN with_check IS NOT NULL THEN 'HAS WITH CHECK'
        ELSE 'NO WITH CHECK'
    END as has_with_check
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY 
    CASE 
        WHEN policyname LIKE '%Service role%' THEN 1
        ELSE 2
    END,
    policyname;

-- Zeige Tabellenstruktur
SELECT 
    column_name,
    data_type,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'orders'
ORDER BY ordinal_position;

-- Test: Prüfe ob Service Role Policy existiert
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'orders' 
            AND policyname = 'Service role can manage orders'
            AND 'service_role' = ANY(roles::text[])
        ) THEN 'Service Role Policy existiert für service_role ✓'
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'orders' 
            AND policyname LIKE '%Service role%'
        ) THEN 'Service Role Policy existiert ⚠'
        ELSE 'Service Role Policy fehlt ✗'
    END as policy_status;

