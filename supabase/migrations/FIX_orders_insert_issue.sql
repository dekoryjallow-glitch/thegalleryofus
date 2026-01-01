-- FIX: Behebe mögliche Probleme beim Einfügen in orders Tabelle
-- Führe dieses SQL im Supabase SQL Editor aus

-- ============================================
-- 1. Prüfe und korrigiere order_status ENUM
-- ============================================

-- Prüfe ob order_status ENUM existiert
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

    -- status (falls nicht als ENUM)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'status'
    ) THEN
        ALTER TABLE orders ADD COLUMN status order_status DEFAULT 'pending';
        RAISE NOTICE 'Spalte status wurde hinzugefügt';
    ELSE
        -- Prüfe ob status bereits ENUM ist, falls nicht, ändere es
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' 
            AND column_name = 'status' 
            AND data_type != 'USER-DEFINED'
        ) THEN
            -- Konvertiere zu ENUM (nur wenn keine Daten vorhanden sind)
            IF NOT EXISTS (SELECT 1 FROM orders LIMIT 1) THEN
                ALTER TABLE orders DROP COLUMN status;
                ALTER TABLE orders ADD COLUMN status order_status DEFAULT 'pending';
                RAISE NOTICE 'Spalte status wurde zu ENUM konvertiert';
            END IF;
        END IF;
    END IF;
END $$;

-- ============================================
-- 3. Stelle sicher, dass Service Role Policy existiert
-- ============================================

-- Entferne alte Policy falls vorhanden
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;

-- Erstelle Service Role Policy
CREATE POLICY "Service role can manage orders"
    ON orders
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 4. Test-Insert (wird automatisch zurückgerollt)
-- ============================================

-- Teste ob ein Insert funktionieren würde (ohne tatsächlich zu committen)
DO $$
DECLARE
    test_user_id UUID;
    test_result BOOLEAN;
BEGIN
    -- Hole eine existierende User-ID für den Test
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        BEGIN
            -- Versuche einen Test-Insert (wird automatisch zurückgerollt)
            INSERT INTO orders (user_id, image_url, amount_cents, currency, status)
            VALUES (test_user_id, 'test://url', 4900, 'EUR', 'pending'::order_status);
            
            -- Rollback des Test-Inserts
            RAISE EXCEPTION 'Test erfolgreich - Rollback';
        EXCEPTION
            WHEN OTHERS THEN
                IF SQLERRM = 'Test erfolgreich - Rollback' THEN
                    RAISE NOTICE 'Test-Insert erfolgreich - Tabelle ist bereit';
                ELSE
                    RAISE WARNING 'Test-Insert fehlgeschlagen: %', SQLERRM;
                END IF;
        END;
    ELSE
        RAISE NOTICE 'Keine User gefunden für Test-Insert';
    END IF;
END $$;

-- ============================================
-- 5. Zeige finale Tabellenstruktur
-- ============================================

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

-- Zeige alle Policies
SELECT 
    policyname,
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
ORDER BY policyname;


