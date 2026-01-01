-- FIX: Behebe Security-Warnungen für Funktionen mit mutable search_path
-- Führe dieses SQL im Supabase SQL Editor aus

-- ============================================
-- 1. update_updated_at_column Funktion
-- ============================================

-- Entferne alte Funktion und Trigger
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Erstelle Funktion mit festem search_path (Security Best Practice)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Erstelle Trigger neu
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 2. handle_new_user Funktion
-- ============================================

-- Erstelle Funktion mit festem search_path (Security Best Practice)
-- CREATE OR REPLACE funktioniert sowohl wenn die Funktion existiert als auch wenn nicht
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$;

-- Stelle sicher, dass der Trigger existiert
-- Entferne alten Trigger falls vorhanden (um Konflikte zu vermeiden)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Erstelle Trigger für handle_new_user
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION
-- ============================================

-- Prüfe ob alle Funktionen korrekt konfiguriert sind
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    CASE 
        WHEN p.proconfig IS NULL OR array_to_string(p.proconfig, ',') NOT LIKE '%search_path%' 
        THEN 'WARNUNG: search_path nicht gesetzt ✗'
        ELSE 'OK: search_path gesetzt ✓'
    END as security_status,
    p.proconfig as config
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname IN ('update_updated_at_column', 'handle_new_user')
ORDER BY p.proname;

-- Zeige Trigger-Informationen
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgenabled as enabled,
    pg_get_triggerdef(oid) as trigger_definition
FROM pg_trigger
WHERE tgname IN ('update_profiles_updated_at', 'on_auth_user_created')
ORDER BY tgname;

