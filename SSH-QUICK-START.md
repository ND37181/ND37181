# SSH Quick Start - Los geht's!

**Für**: fahrzeugelektronik-service.de Migration über SSH

---

## In 3 Schritten zur Migration

### Schritt 1: Repository klonen (falls noch nicht geschehen)

```bash
# Repository klonen
git clone https://github.com/ND37181/ND37181.git
cd ND37181

# Zum richtigen Branch wechseln
git checkout claude/migrate-elementor-to-blocks-011CURwuGuzYmZmxraKCSYsy
```

### Schritt 2: SSH-Scripts vorbereiten

```bash
# In SSH-Scripts-Verzeichnis wechseln
cd ssh-scripts

# Konfiguration erstellen (Zugangsdaten bereits eingetragen)
cp config-EXAMPLE.sh config.sh

# Scripts ausführbar machen
chmod +x *.sh

# WICHTIG: sshpass installieren (falls noch nicht vorhanden)
# Ubuntu/Debian:
sudo apt-get install sshpass

# Mac:
brew install hudochenkov/sshpass/sshpass
```

### Schritt 3: Erste Analyse starten

```bash
# WordPress-Installation analysieren
./01-analyze-site.sh
```

Das war's! Das Script wird:
- SSH-Verbindung zu Ihrem Strato-Server herstellen
- WordPress-Installation analysieren
- Elementor-Seiten zählen
- Zeitschätzung für Migration geben

---

## Was die Scripts tun

### 01-analyze-site.sh (2-3 Minuten)
**Analysiert Ihre WordPress-Installation**

Gibt Ihnen Auskunft über:
- WordPress-Version
- Anzahl der Seiten mit Elementor
- Installierte Plugins
- Theme-Information
- Geschätzte Migrations-Dauer

**Beispiel-Output:**
```
[SUCCESS] SSH-Verbindung erfolgreich
[INFO] WordPress-Version: 6.4.2
[INFO] Elementor-Version: 3.18.0
[INFO] Seiten mit Elementor: 15 / 20
[INFO] Geschätzte Migrations-Dauer: 15-45 Stunden (2-6 Arbeitstage)
```

### 02-verify-backup.sh (1 Minute)
**Prüft ob Backup vorhanden ist**

- Sucht nach existierenden Backups
- Prüft Backup-Plugins
- Fragt nach Bestätigung

### 03-create-backup.sh (30-60 Minuten)
**Erstellt vollständiges Backup**

- Exportiert Datenbank
- Erstellt Archiv aller Dateien
- Lädt alles auf Ihren Computer herunter
- Speichert in: `~/fahrzeugelektronik-backups/`

⚠️ **Dauert lange** - Website-Größe abhängig!

---

## Häufige Probleme & Lösungen

### Problem: "sshpass: command not found"

**Lösung:**
```bash
# Ubuntu/Debian:
sudo apt-get install sshpass

# Mac (mit Homebrew):
brew install hudochenkov/sshpass/sshpass

# Windows: Verwenden Sie WSL oder Git Bash
```

### Problem: "Permission denied"

**Lösung:**
```bash
# Testen Sie manuelle Verbindung:
ssh 56927191.swh.strato-hosting.eu@ssh.strato.de

# Falls das funktioniert, ist sshpass das Problem
# Falls nicht: Passwort in config.sh prüfen
```

### Problem: Script stoppt mit Fehler

**Lösung:**
```bash
# Script nochmal ausführen - oft temporäres Problem
./01-analyze-site.sh

# Bei anhaltendem Problem: Detaillierte README lesen
cat ssh-scripts/README.md
```

---

## Empfohlener Ablauf für heute

### Heute (1-2 Stunden):

```bash
✅ 1. Repository klonen
✅ 2. SSH-Scripts einrichten
✅ 3. ./01-analyze-site.sh ausführen
✅ 4. ./02-verify-backup.sh ausführen
✅ 5. Falls nötig: ./03-create-backup.sh ausführen
```

### Diese Woche (3-5 Stunden):

```bash
⏳ 1. Dokumentation durchlesen (Quick-Start-Guide.md)
⏳ 2. Migration Tracker öffnen (scripts/migration-tracker.html)
⏳ 3. Alle Seiten in Tracker eintragen
⏳ 4. Staging-Umgebung vorbereiten
```

### Nächste 2-4 Wochen:

```bash
⏳ Systematisch Seiten migrieren (siehe Migration-Workflow.md)
```

---

## Wichtige Dateien

### Für SSH-Automation:
- `ssh-scripts/README.md` - Detaillierte Anleitung
- `ssh-scripts/config.sh` - Ihre Zugangsdaten (erstellen mit cp config-EXAMPLE.sh config.sh)
- `ssh-scripts/01-analyze-site.sh` - Start hier!

### Für Migrations-Planung:
- `Quick-Start-Guide.md` - Überblick über gesamte Migration
- `Migration-Workflow.md` - Schritt-für-Schritt Anleitung
- `Pre-Migration-Checklist.md` - Was vor Migration zu tun ist

### Für Tracking:
- `scripts/migration-tracker.html` - Im Browser öffnen
- `scripts/widget-mapping.json` - Elementor → Blocks Referenz

---

## Was als Nächstes?

Nach erfolgreicher Ausführung von `01-analyze-site.sh`:

**Sie erhalten Informationen wie:**
- Anzahl der zu migrierenden Seiten
- Zeitschätzung
- Liste aller Elementor-Seiten

**Dann:**
1. Notieren Sie sich die Zahlen
2. Führen Sie `02-verify-backup.sh` aus
3. Falls kein Backup: `03-create-backup.sh` ausführen
4. Backup an mehreren Orten speichern (extern + Cloud)

**Danach:**
- Lesen Sie `Quick-Start-Guide.md` für die nächsten Schritte
- Öffnen Sie `scripts/migration-tracker.html` im Browser
- Planen Sie die Migration mit `Migration-Workflow.md`

---

## Sicherheit

### ⚠️ WICHTIG

**Die Scripts arbeiten aktuell auf Ihrer LIVE-Site!**

Für die eigentliche Migration werden wir:
1. Eine Staging-Umgebung einrichten
2. Nur dort migrieren
3. Erst ganz zum Schluss auf Live deployen

**Aktuell machen die Scripts:**
- ✅ Nur lesen/analysieren (sicher)
- ✅ Backup erstellen (sicher)
- ❌ KEINE Änderungen an Live-Site

---

## Support

**Bei Fragen oder Problemen:**

1. **README lesen**: `ssh-scripts/README.md` hat ausführliche Troubleshooting-Sektion
2. **Dokumentation**: Alle Guides im Hauptverzeichnis
3. **Strato Support**: Bei Server-Problemen
4. **WordPress Community**: https://wordpress.org/support/

---

## Zusammenfassung

**Sie haben jetzt:**
- ✅ Vollständige Migrations-Dokumentation
- ✅ SSH-Automation-Scripts
- ✅ Migration Tracker Tool
- ✅ Widget-Mapping Referenz
- ✅ Schritt-für-Schritt Anleitungen

**Ihr nächster Befehl:**
```bash
cd ssh-scripts
./01-analyze-site.sh
```

**Los geht's!** 🚀

---

**Geschätzte Zeit bis Live-Migration**: 3-5 Wochen
**Geschätzter Zeitaufwand**: 40-80 Stunden (abhängig von Seitenzahl)
**Erwartete Verbesserung**: 20-40% schnellere Ladezeiten

---

**Version**: 1.0
**Erstellt**: Oktober 2024
**Für**: fahrzeugelektronik-service.de
