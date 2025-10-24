# SSH Scripts für Elementor zu Blocks Migration

Diese Scripts helfen Ihnen bei der technischen Durchführung der Migration über SSH.

---

## Voraussetzungen

### Auf Ihrem Computer (Windows/Mac/Linux)

**Benötigte Programme:**

1. **SSH-Client** (normalerweise vorinstalliert)
   - Windows: PuTTY oder OpenSSH (in Windows 10/11 enthalten)
   - Mac/Linux: OpenSSH (vorinstalliert)

2. **sshpass** (für automatische Passwort-Authentifizierung)

   **Installation:**

   ```bash
   # Ubuntu/Debian:
   sudo apt-get install sshpass

   # Mac (mit Homebrew):
   brew install hudochenkov/sshpass/sshpass

   # Windows (Git Bash):
   # Laden Sie sshpass.exe herunter und fügen Sie es zu PATH hinzu
   # Oder verwenden Sie WSL (Windows Subsystem for Linux)
   ```

3. **Optional: Git Bash** (für Windows-Benutzer)
   - Download: https://git-scm.com/downloads
   - Ermöglicht Ausführung von Bash-Scripts unter Windows

---

## Installation

### Schritt 1: Repository klonen (falls noch nicht geschehen)

```bash
git clone https://github.com/ND37181/ND37181.git
cd ND37181
git checkout claude/migrate-elementor-to-blocks-011CURwuGuzYmZmxraKCSYsy
```

### Schritt 2: Scripts ausführbar machen

```bash
cd ssh-scripts
chmod +x *.sh
```

### Schritt 3: Konfiguration prüfen

```bash
# Öffnen Sie config.sh und prüfen Sie die Zugangsdaten
cat config.sh
```

**WICHTIG**: Die Datei `config.sh` enthält Ihre Passwörter. **Niemals in Git committen!**

---

## Script-Übersicht

### Vorbereitungsphase

| Script | Beschreibung | Dauer |
|--------|--------------|-------|
| `01-analyze-site.sh` | WordPress-Installation analysieren | 2-3 Min |
| `02-verify-backup.sh` | Backup-Status prüfen | 1 Min |
| `03-create-backup.sh` | Vollständiges Backup erstellen | 30-60 Min |

### Migrations-Phase (in Arbeit)

| Script | Beschreibung | Dauer |
|--------|--------------|-------|
| `04-setup-staging.sh` | Staging-Umgebung einrichten | 15-30 Min |
| `05-install-block-plugins.sh` | Block-Plugins installieren | 5-10 Min |
| `06-migration-helper.sh` | Migrations-Helfer-Funktionen | - |

### Abschluss-Phase (in Arbeit)

| Script | Beschreibung | Dauer |
|--------|--------------|-------|
| `07-optimize-performance.sh` | Performance optimieren | 10-15 Min |
| `08-final-checks.sh` | Finale Tests durchführen | 5-10 Min |

---

## Verwendung

### Quick Start

**Schritt-für-Schritt für Anfänger:**

```bash
# 1. In das Script-Verzeichnis wechseln
cd ssh-scripts

# 2. Analyse starten
./01-analyze-site.sh

# 3. Backup verifizieren
./02-verify-backup.sh

# 4. Falls kein Backup: Backup erstellen
./03-create-backup.sh

# 5. Staging einrichten (folgt)
# ./04-setup-staging.sh
```

### Detaillierte Anleitung

#### 1. Analyse (01-analyze-site.sh)

**Was macht das Script:**
- Verbindung zum Server testen
- WordPress-Version prüfen
- Elementor-Installation analysieren
- Anzahl der zu migrierenden Seiten zählen
- Zeitschätzung berechnen

**Ausführen:**
```bash
./01-analyze-site.sh
```

**Erwarteter Output:**
```
[INFO] WordPress-Analyse: fahrzeugelektronik-service.de
[SUCCESS] SSH-Verbindung erfolgreich
[SUCCESS] WordPress-Verzeichnis gefunden
[INFO] WordPress-Version: 6.4.2
[INFO] Elementor-Version: 3.x.x
[INFO] Seiten mit Elementor: 15 / 20
[INFO] Geschätzte Migrations-Dauer: 15-45 Stunden
```

**Nächster Schritt:**
- Falls Analyse erfolgreich → `02-verify-backup.sh`
- Falls Fehler → Prüfen Sie Zugangsdaten in `config.sh`

---

#### 2. Backup verifizieren (02-verify-backup.sh)

**Was macht das Script:**
- Sucht nach existierenden Backups auf dem Server
- Prüft Backup-Plugins
- Fragt Bestätigung ab, dass Backup vorhanden ist

**Ausführen:**
```bash
./02-verify-backup.sh
```

**Interaktive Frage:**
```
Haben Sie ein aktuelles, vollständiges Backup? (ja/nein):
```

**Antworten:**
- `ja` → Weiter mit Staging-Setup
- `nein` → Führen Sie `03-create-backup.sh` aus

---

#### 3. Backup erstellen (03-create-backup.sh)

**Was macht das Script:**
- Exportiert WordPress-Datenbank
- Erstellt Archiv aller WordPress-Dateien
- Lädt Backup auf Ihren lokalen Computer herunter
- Erstellt Backup-Info-Datei

**⚠️ WICHTIG:**
- Dauer: 30-60 Minuten (abhängig von Website-Größe)
- Benötigt ausreichend Speicherplatz auf Server UND lokal
- Internetverbindung muss stabil sein

**Ausführen:**
```bash
./03-create-backup.sh
```

**Backup-Speicherort:**
```
~/fahrzeugelektronik-backups/fahrzeugelektronik-backup-[DATUM]/
├── database-[DATUM].sql.gz        (Datenbank)
├── wordpress-files-[DATUM].tar.gz (Alle Dateien)
├── wp-config.php                  (Konfiguration)
├── .htaccess                      (Server-Regeln)
└── BACKUP-INFO.txt                (Informationen)
```

**Nach dem Backup:**
1. **Lokal sichern**: Backup-Ordner auf externe Festplatte kopieren
2. **Cloud-Upload**: In Google Drive/Dropbox hochladen
3. **Verifizieren**: Größe prüfen (sollte mehrere GB sein)

---

## Troubleshooting

### Problem: "sshpass: command not found"

**Lösung:**
```bash
# Ubuntu/Debian:
sudo apt-get install sshpass

# Mac:
brew install hudochenkov/sshpass/sshpass

# Windows: Verwenden Sie WSL oder Git Bash
```

### Problem: "Permission denied"

**Ursache:** Passwort falsch oder SSH-Zugang gesperrt

**Lösung:**
1. Prüfen Sie `config.sh` → Passwort korrekt?
2. Testen Sie manuell: `ssh 56927191.swh.strato-hosting.eu@ssh.strato.de`
3. Falls Login manuell funktioniert: sshpass-Problem
4. Kontaktieren Sie Strato-Support bei anhaltendem Problem

### Problem: "wp: command not found"

**Ursache:** WP-CLI nicht installiert oder nicht im PATH

**Lösung:**
```bash
# WP-CLI manuell installieren (auf dem Server):
ssh 56927191.swh.strato-hosting.eu@ssh.strato.de
cd STRATO-apps/wordpress_02/app
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
alias wp='php wp-cli.phar'
```

### Problem: Backup-Download dauert ewig

**Normal!** Je nach Website-Größe:
- Kleine Site (< 1 GB): 5-10 Minuten
- Mittlere Site (1-5 GB): 15-30 Minuten
- Große Site (> 5 GB): 30-60+ Minuten

**Bei Unterbrechung:**
```bash
# Script nochmal ausführen - erstellt neues Backup
./03-create-backup.sh
```

### Problem: "No space left on device"

**Ursache:** Zu wenig Speicherplatz auf Server oder lokal

**Lösung:**
1. Prüfen Sie Speicherplatz: `df -h`
2. Löschen Sie alte Backups auf dem Server
3. Schaffen Sie lokal mehr Platz

---

## Sicherheitshinweise

### ⚠️ WICHTIG

1. **config.sh niemals teilen oder committen**
   - Enthält Passwörter im Klartext
   - Bei Leak: Sofort Passwort ändern

2. **Immer auf Staging arbeiten, NIE auf Live**
   - Diese Scripts arbeiten aktuell auf der LIVE-Site
   - Staging-Setup folgt in Script 04

3. **Backups an mehreren Orten**
   - Lokal auf Computer
   - Externe Festplatte
   - Cloud-Speicher

4. **Vor Live-Migration**
   - Nochmal frisches Backup
   - Wartungsmodus aktivieren
   - Downtime-Fenster einplanen

---

## Nächste Schritte

Nach erfolgreicher Ausführung der Vorbereitungs-Scripts:

### ✅ Abgeschlossen
- [x] Website analysiert
- [x] Backup erstellt
- [x] Backup verifiziert

### ⏳ Nächste Schritte (Scripts folgen)
- [ ] Staging-Umgebung einrichten
- [ ] Block-Plugins installieren
- [ ] Erste Testseite migrieren
- [ ] Systematisch alle Seiten migrieren
- [ ] Performance optimieren
- [ ] Live-Schaltung

---

## Alternative: Manuelle Ausführung

Falls Scripts nicht funktionieren, können Sie Befehle auch manuell ausführen:

### Manuell einloggen:
```bash
ssh 56927191.swh.strato-hosting.eu@ssh.strato.de
cd STRATO-apps/wordpress_02/app
```

### WordPress-Info:
```bash
wp core version
wp plugin list
wp theme list
```

### Backup manuell:
```bash
# Datenbank:
wp db export backup-$(date +%Y%m%d).sql

# Dateien:
tar -czf backup-files-$(date +%Y%m%d).tar.gz .
```

---

## Support

Bei Problemen:

1. **Fehlermeldung googeln** - oft schnelle Lösung
2. **Strato-Support kontaktieren** - bei Server-Problemen
3. **Dokumentation lesen** - siehe Hauptverzeichnis
4. **WordPress-Community** - https://wordpress.org/support/

---

## Changelog

**Version 1.0** (2024-10-24)
- Initiale Scripts erstellt
- Analyse, Backup-Verifikation, Backup-Erstellung
- Umfassende Dokumentation

**Version 1.1** (in Arbeit)
- Staging-Setup Script
- Plugin-Installation Script
- Performance-Optimierung

---

**WICHTIG**: Lesen Sie die Hauptdokumentation im Root-Verzeichnis für vollständiges Verständnis der Migration!

- [Quick-Start-Guide.md](../Quick-Start-Guide.md)
- [Migration-Workflow.md](../Migration-Workflow.md)
- [Backup-and-Safety-Procedures.md](../Backup-and-Safety-Procedures.md)
