-- FIX: Füge Service Role Policy für orders Tabelle hinzu
-- Dies erlaubt dem Admin-Client (Service Role) Orders zu erstellen
-- Führe dieses SQL im Supabase SQL Editor aus

-- Prüfe ob die Policy bereits existiert und entferne sie falls nötig
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;

-- Erstelle die Service Role Policy
-- Diese Policy erlaubt dem Service Role (Admin Client) alle Operationen
CREATE POLICY "Service role can manage orders"
    ON orders
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Prüfe ob die Policy erstellt wurde
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
WHERE tablename = 'orders' AND policyname = 'Service role can manage orders';


