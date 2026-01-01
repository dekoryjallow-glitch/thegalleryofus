-- FIX: Stelle sicher, dass Service Role Policy korrekt funktioniert
-- Führe dieses SQL im Supabase SQL Editor aus

-- ============================================
-- 1. Entferne alle bestehenden Policies
-- ============================================

DROP POLICY IF EXISTS "Service role can manage orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- ============================================
-- 2. Erstelle Service Role Policy ZUERST
-- ============================================
-- WICHTIG: Service Role Policy muss zuerst erstellt werden,
-- damit sie bei der Evaluierung Vorrang hat

-- Option 1: Explizit für service_role (empfohlen)
-- Diese Policy erlaubt dem Service Role (service_role) alle Operationen
-- Der Service Role wird durch SUPABASE_SERVICE_ROLE_KEY authentifiziert
CREATE POLICY "Service role can manage orders"
    ON orders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 3. Erstelle User Policies
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
-- 4. Alternative: Falls TO service_role nicht funktioniert
-- ============================================
-- Wenn die obige Policy mit TO service_role nicht funktioniert,
-- verwende diese Alternative, die für alle Rollen gilt:

-- FALLBACK: Entferne die obige Policy und verwende diese stattdessen:
/*
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;

-- Diese Policy funktioniert für alle Rollen, prüft aber die JWT Claims
CREATE POLICY "Service role can manage orders"
    ON orders
    FOR ALL
    USING (
        -- Service Role hat immer Zugriff
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    )
    WITH CHECK (
        current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    );
*/

-- ODER: Noch einfacher - Policy die für alle gilt (wie aktuell)
-- aber sicherstellt, dass sie funktioniert:
/*
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;

CREATE POLICY "Service role can manage orders"
    ON orders
    FOR ALL
    USING (true)
    WITH CHECK (true);
*/

-- ============================================
-- 5. VERIFICATION
-- ============================================

-- Zeige alle Policies
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
ORDER BY 
    CASE 
        WHEN policyname = 'Service role can manage orders' THEN 1
        ELSE 2
    END,
    policyname;

-- Test: Prüfe ob Service Role Policy existiert
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'orders' 
            AND policyname = 'Service role can manage orders'
            AND roles @> ARRAY['service_role']
        ) THEN 'Service Role Policy existiert für service_role ✓'
        WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'orders' 
            AND policyname = 'Service role can manage orders'
        ) THEN 'Service Role Policy existiert, aber möglicherweise nicht für service_role ⚠'
        ELSE 'Service Role Policy fehlt ✗'
    END as policy_status;

