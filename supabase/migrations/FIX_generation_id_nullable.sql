-- FIX: Mache generation_id optional (nullable) in orders Tabelle
-- Führe dieses SQL im Supabase SQL Editor aus

-- Prüfe ob generation_id aktuell NOT NULL ist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'orders' 
        AND column_name = 'generation_id'
        AND is_nullable = 'NO'
    ) THEN
        -- Mache generation_id nullable
        ALTER TABLE orders 
        ALTER COLUMN generation_id DROP NOT NULL;
        
        RAISE NOTICE 'generation_id wurde zu nullable geändert ✓';
    ELSE
        RAISE NOTICE 'generation_id ist bereits nullable oder existiert nicht';
    END IF;
END $$;

-- Verifikation: Zeige die aktuelle Struktur
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'orders'
AND column_name = 'generation_id';


