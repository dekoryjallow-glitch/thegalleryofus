# Leaked Password Protection aktivieren

Die Leaked Password Protection ist eine Security-Funktion von Supabase Auth, die Passwörter gegen die HaveIBeenPwned-Datenbank prüft.

## Aktivierung im Supabase Dashboard

1. **Gehe zum Supabase Dashboard**
   - Öffne dein Projekt

2. **Navigiere zu Authentication Settings**
   - Klicke auf **Authentication** in der linken Sidebar
   - Klicke auf **Settings** (oder **Policies**)

3. **Aktiviere Leaked Password Protection**
   - Suche nach **"Password Security"** oder **"Leaked Password Protection"**
   - Aktiviere die Option **"Check passwords against HaveIBeenPwned"**
   - Speichere die Änderungen

## Alternative: Über SQL (falls verfügbar)

Falls die Einstellung über SQL verfügbar ist, kannst du folgendes versuchen:

```sql
-- Prüfe aktuelle Auth-Konfiguration
SELECT * FROM auth.config;

-- Aktiviere Leaked Password Protection (falls als Config verfügbar)
-- HINWEIS: Dies funktioniert möglicherweise nicht, da Auth-Einstellungen
-- normalerweise nur über das Dashboard geändert werden können
```

## Warum ist das wichtig?

- **Sicherheit**: Verhindert die Verwendung von kompromittierten Passwörtern
- **Best Practice**: Erhöht die allgemeine Sicherheit deiner Anwendung
- **Compliance**: Kann für bestimmte Compliance-Anforderungen erforderlich sein

## Weitere Informationen

- [Supabase Auth Password Security Dokumentation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
- [HaveIBeenPwned](https://haveibeenpwned.com/)


