-- Prüfe die Struktur der orders Tabelle
-- Führe dieses SQL aus, um zu sehen, welche Spalten und Constraints existieren

-- Zeige alle Spalten der orders Tabelle
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'orders'
ORDER BY ordinal_position;

-- Zeige alle Constraints
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.table_name = 'orders';

-- Zeige ENUM-Typen
SELECT 
    t.typname as enum_name,
    e.enumlabel as enum_value
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE t.typname = 'order_status'
ORDER BY e.enumsortorder;

-- Prüfe RLS Policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'orders'
ORDER BY policyname;


