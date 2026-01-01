-- FIX: Optimiere RLS Policies für bessere Performance
-- Ersetze auth.uid() durch (select auth.uid()) um unnötige Re-Evaluation zu vermeiden
-- Führe dieses SQL im Supabase SQL Editor aus

-- ============================================
-- PROFILES TABLE
-- ============================================

-- Entferne alte Policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Erstelle optimierte Policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING ((select auth.uid()) = id);

-- ============================================
-- GENERATIONS TABLE
-- ============================================

-- Entferne alte Policies
DROP POLICY IF EXISTS "Users can view own generations" ON generations;
DROP POLICY IF EXISTS "Users can insert own generations" ON generations;

-- Erstelle optimierte Policies
CREATE POLICY "Users can view own generations"
    ON generations FOR SELECT
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own generations"
    ON generations FOR INSERT
    WITH CHECK ((select auth.uid()) = user_id);

-- ============================================
-- ORDERS TABLE
-- ============================================

-- Entferne alte Policies
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- Erstelle optimierte Policies
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own orders"
    ON orders FOR INSERT
    WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own orders"
    ON orders FOR UPDATE
    USING ((select auth.uid()) = user_id);

-- Service Role Policy bleibt unverändert (hat kein auth.uid())
-- Diese Policy erlaubt dem Service Role (Admin Client) alle Operationen
DROP POLICY IF EXISTS "Service role can manage orders" ON orders;

CREATE POLICY "Service role can manage orders"
    ON orders
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- VERIFICATION
-- ============================================

-- Prüfe ob alle Policies korrekt erstellt wurden
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('profiles', 'generations', 'orders')
ORDER BY tablename, policyname;


