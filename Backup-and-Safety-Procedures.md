# Backup & Safety Procedures
## Elementor zu Blocks Migration

**Website**: fahrzeugelektronik-service.de

---

## Übersicht

Dieser Leitfaden beschreibt alle notwendigen Backup- und Sicherheitsverfahren für eine sichere Migration von Elementor zu WordPress Blocks. **Ein umfassendes Backup ist das wichtigste Element für eine risikofreie Migration.**

---

## Grundprinzipien

### Die 3-2-1 Backup-Regel

**3** Kopien Ihrer Daten
**2** verschiedene Medien/Speicherarten
**1** Kopie extern/off-site

Für WordPress-Migration:
- **Original**: Live-Site
- **Kopie 1**: Lokales Backup auf Computer
- **Kopie 2**: Cloud-Speicher (Google Drive, Dropbox, etc.)
- **Kopie 3**: Staging-Site (ist gleichzeitig Arbeitsumgebung)

### Zeitpunkt für Backups

```
IMMER Backup erstellen:
- ✅ BEVOR Sie mit der Migration beginnen
- ✅ BEVOR Sie Plugins deaktivieren/löschen
- ✅ BEVOR Sie das Theme wechseln
- ✅ BEVOR Sie auf die Live-Site migrieren
- ✅ NACHDEM Sie erfolgreich migriert haben (neuer Baseline)
```

---

## 1. Vollständiges Site-Backup

### Was muss gesichert werden?

#### A. WordPress-Dateien

**Verzeichnisse**:
```
/wp-admin/          (WordPress Core Admin)
/wp-includes/       (WordPress Core Libraries)
/wp-content/        (WICHTIG! Themes, Plugins, Uploads)
  ├── /themes/
  ├── /plugins/
  ├── /uploads/     (SEHR WICHTIG! Alle Medien)
  └── /languages/

Wichtige Dateien im Root:
- wp-config.php     (KRITISCH! Datenbank-Zugangsdaten)
- .htaccess         (Server-Konfiguration)
- index.php
- wp-load.php
- wp-settings.php
- robots.txt        (falls vorhanden)
```

**Dateigröße schätzen**:
```bash
# Via SSH:
du -sh /pfad/zum/wordpress/

# Typische Größen:
- Kleine Site: 500 MB - 2 GB
- Mittlere Site: 2 GB - 10 GB
- Große Site: 10 GB+
```

#### B. Datenbank

**Was in der Datenbank ist**:
```
- Seiteninhalte (Posts, Pages)
- Benutzer & Berechtigungen
- Kommentare
- Plugin-Einstellungen
- Theme-Einstellungen
- Menüs & Widgets
- Elementor-Daten (Meta-Daten, Templates)
```

**Größe schätzen**:
```bash
# In phpMyAdmin: Datenbank → "Struktur" → Gesamtgröße unten

# Typische Größen:
- Kleine Site: 10-50 MB
- Mittlere Site: 50-200 MB
- Große Site mit viel Content: 200 MB+
```

---

## 2. Backup-Methoden

### Methode 1: WordPress Backup-Plugins (EMPFOHLEN für Einsteiger)

#### Option A: UpdraftPlus (kostenlos + Premium)

**Vorteile**:
- Einfach zu bedienen
- Automatische Backups
- Cloud-Speicher-Integration
- Kostenloses Plugin sehr umfangreich

**Installation & Einrichtung**:

```
1. Plugin installieren:
   WordPress Admin → Plugins → Neu hinzufügen → "UpdraftPlus"
   → Installieren → Aktivieren

2. Konfiguration:
   Einstellungen → UpdraftPlus Backups → Einstellungen

3. Backup-Zeitplan (optional):
   - Dateien: Wöchentlich
   - Datenbank: Täglich
   - Aufbewahrung: Letzte 4 Backups

4. Cloud-Speicher verbinden:
   - Google Drive (empfohlen)
   - Dropbox
   - OneDrive
   - Oder: Nur lokal

5. Manuelles Backup erstellen:
   Reiter "Sichern/Wiederherstellen"
   → "Jetzt sichern" Button
   → Haken bei allen Optionen setzen
   → "Jetzt sichern" klicken
```

**Download des Backups**:
```
Nach Abschluss:
→ Jede Komponente einzeln herunterladen:
  - Datenbank (.gz)
  - Plugins (.zip)
  - Themes (.zip)
  - Uploads (.zip)
  - Others (.zip)

Lokal speichern in:
/Backups/fahrzeugelektronik-[DATUM]/
```

#### Option B: BackWPup (kostenlos)

**Einrichtung**:
```
1. Plugin installieren: BackWPup

2. Backup-Job erstellen:
   BackWPup → Add new Job

3. Konfiguration:
   - Job-Name: "Vollständiges Backup"
   - Archive-Format: Zip
   - Backup-Typ: Alle Dateien + Datenbank
   - Ziel: Ordner oder Dropbox/etc.

4. Zeitplan:
   - Manuell für Migration
   - Oder: Wöchentlich automatisch

5. Job starten:
   BackWPup → Jobs → "Jetzt ausführen"
```

#### Option C: All-in-One WP Migration (einfachste)

**Besonders geeignet für**:
- Migration zu/von Staging
- Einfacher Export/Import
- Komplette Site als eine Datei

**Verwendung**:
```
1. Plugin installieren: All-in-One WP Migration

2. Export:
   Tools → All-in-One WP Migration → Export
   → Export nach: Datei
   → Download wenn fertig

   ACHTUNG: Kostenlose Version max. 512 MB!
   Für größere Sites: Unlimited Extension kaufen ($69)

3. Ergebnis:
   .wpress Datei (enthält alles)
   Lokal speichern!
```

---

### Methode 2: Hosting Control Panel (cPanel/Plesk)

#### cPanel Backup

**Vollständiges Backup**:
```
1. cPanel einloggen
2. "Backup" oder "Sicherung" suchen
3. "Vollständige Sicherung herunterladen" wählen
4. E-Mail-Benachrichtigung eingeben
5. "Sicherung erstellen" klicken
6. Warten (kann 30 Min - 2 Std dauern)
7. Link per E-Mail erhalten
8. Backup herunterladen

Ergebnis:
- Große .tar.gz Datei
- Enthält ALLES (Dateien + Datenbank)
```

**Teilweises Backup** (schneller):
```
1. Home-Verzeichnis:
   cPanel → Backup → Home-Verzeichnis sichern
   → Download .tar.gz

2. MySQL-Datenbank:
   cPanel → Backup → MySQL-Datenbanken sichern
   → Datenbank wählen → Download .sql.gz
```

#### Plesk Backup

```
1. Plesk einloggen
2. Websites & Domains
3. Website auswählen
4. "Sichern/Wiederherstellen"
5. "Sichern" → Vollständige Sicherung
6. Sicherung starten
7. Nach Abschluss: Download-Link
```

---

### Methode 3: Manuelles Backup (für Fortgeschrittene)

#### A. Dateien via FTP/SFTP

**Mit FileZilla**:
```
1. FileZilla installieren (https://filezilla-project.org/)

2. Verbindung einrichten:
   - Host: ftp.ihre-domain.de (oder SFTP: sftp://...)
   - Benutzername: [Ihr FTP-User]
   - Passwort: [Ihr FTP-Passwort]
   - Port: 21 (FTP) oder 22 (SFTP)

3. Verbinden

4. WordPress-Verzeichnis finden:
   Meist: /public_html/ oder /httpdocs/ oder /www/

5. Komplettes WordPress-Verzeichnis herunterladen:
   - Rechtsklick auf Ordner
   - "Download" wählen
   - Lokales Ziel: z.B. D:/Backups/wordpress-[DATUM]/

   ACHTUNG: Kann mehrere Stunden dauern!
```

**Mit WinSCP** (Windows, einfacher):
```
Ähnlich wie FileZilla, aber mit "Kopieren"-Funktion
```

#### B. Datenbank via phpMyAdmin

**Export**:
```
1. Hosting Control Panel → phpMyAdmin
   (oder direkt: https://ihre-domain.de:2083/phpmyadmin)

2. Einloggen (Datenbank-User, nicht WordPress-User!)

3. Datenbank wählen (links in Liste)
   (Name steht in wp-config.php: DB_NAME)

4. Reiter "Exportieren" oben

5. Export-Methode:
   ☑ Schnell (für kleine DBs < 50 MB)
   ☑ Angepasst (für große DBs, mehr Optionen)

6. Format: SQL

7. Kompression: gzip (spart Platz)

8. "OK" oder "Ausführen" klicken

9. .sql.gz Datei wird heruntergeladen

10. Speichern als:
    datenbank-backup-[DATUM].sql.gz
```

**Für sehr große Datenbanken** (> 200 MB):
```bash
# Via SSH (falls Zugang vorhanden):
mysqldump -u [DB_USER] -p [DB_NAME] | gzip > backup-$(date +%F).sql.gz

# Mit Passwort-Eingabe wenn -p
```

---

## 3. Backup verifizieren

### Kritisch: Backups testen!

**Ein Backup das nicht getestet wurde, ist kein Backup.**

#### Datei-Backup testen

```
1. Backup-Archiv entpacken (lokal):
   - Rechtsklick → "Hier entpacken"
   - Prüfen, ob Dateien vorhanden

2. Wichtige Dateien prüfen:
   ✓ wp-config.php vorhanden?
   ✓ /wp-content/themes/ vorhanden?
   ✓ /wp-content/plugins/ vorhanden?
   ✓ /wp-content/uploads/ vorhanden?
   ✓ .htaccess vorhanden?

3. Uploads-Ordner stichprobenartig prüfen:
   ✓ Bilder öffnen sich?
   ✓ Keine korrupten Dateien?
```

#### Datenbank-Backup testen

```
1. .sql.gz Datei entpacken:
   - Ergibt .sql Datei
   - Mit Texteditor öffnen (Notepad++, VS Code)

2. Prüfen:
   ✓ Datei beginnt mit SQL-Kommentaren
   ✓ "CREATE TABLE" Statements sichtbar
   ✓ "INSERT INTO" Statements sichtbar
   ✓ Datei endet nicht abrupt

3. Optional: In Staging-Umgebung importieren
   - phpMyAdmin → Importieren
   - Prüfen ob alles funktioniert
```

---

## 4. Backup-Speicherung

### Lokale Speicherung

```
Organisierte Ordnerstruktur:

Backups/
├── fahrzeugelektronik-service.de/
│   ├── 2024-10-20_pre-migration/
│   │   ├── files/
│   │   │   ├── plugins.zip
│   │   │   ├── themes.zip
│   │   │   ├── uploads.zip
│   │   │   └── others.zip
│   │   ├── database/
│   │   │   └── db-backup.sql.gz
│   │   └── README.txt (Beschreibung: "Vor Elementor-Migration")
│   │
│   ├── 2024-11-01_after-migration/
│   │   └── [selbe Struktur]
│   │
│   └── LATEST/ (Symlink zum neuesten)
```

**Speicherorte**:
- Externe Festplatte (USB)
- NAS (Network Attached Storage)
- Zweiter Computer

### Cloud-Speicherung

**Empfohlene Dienste**:

1. **Google Drive** (15 GB kostenlos)
   ```
   - Backup-Ordner erstellen
   - Desktop-App installieren
   - Auto-Sync aktivieren
   ```

2. **Dropbox** (2 GB kostenlos, 2 TB für $11.99/Monat)
   ```
   - Ähnlich wie Google Drive
   ```

3. **OneDrive** (5 GB kostenlos)
   ```
   - In Windows 10/11 integriert
   ```

4. **Backblaze** (spezialisiert auf Backups, $7/Monat unlimitiert)

**Sicherheit**:
```
Für sensible Daten:
- Backups verschlüsseln (7-Zip mit Passwort)
- Starkes Passwort verwenden
- 2FA für Cloud-Konten aktivieren
```

---

## 5. Restore-Prozeduren (Wiederherstellung)

### Wann wiederherstellen?

```
- ❌ Migration ist fehlgeschlagen
- ❌ Website ist defekt nach Änderungen
- ❌ Daten wurden versehentlich gelöscht
- ❌ Plugin-Konflikt macht Site unbrauchbar
- ❌ Hack/Malware-Befall
```

### Schneller Restore mit Plugin

#### UpdraftPlus Restore

```
1. WordPress Admin erreichbar?
   JA:
   - Einstellungen → UpdraftPlus
   - Reiter "Sichern/Wiederherstellen"
   - Bei gewünschtem Backup: "Wiederherstellen"
   - Komponenten auswählen (alle)
   - "Weiter" → "Wiederherstellen"

   NEIN (White Screen, Error):
   - Siehe "Manueller Restore" unten
```

#### All-in-One WP Migration Restore

```
1. Tools → All-in-One WP Migration → Import
2. .wpress Datei hochladen
3. Warten
4. "Permalink-Struktur aktualisieren"
5. Fertig
```

### Manueller Restore (wenn Admin nicht erreichbar)

#### 1. Wartungsmodus aktivieren

```
Via FTP:
1. Leere Datei erstellen: .maintenance
2. In WordPress-Root hochladen
3. Inhalt:
   <?php $upgrading = time(); ?>

Besucher sehen: "Kurz nicht verfügbar wegen Wartungsarbeiten"
```

#### 2. Dateien wiederherstellen

```
Via FTP:
1. Aktuelles /wp-content/ umbenennen zu /wp-content-OLD/
   (als Backup falls Restore fehlschlägt)

2. Backup wp-content.zip entpacken (lokal)

3. Neues /wp-content/ hochladen

4. Wichtig: wp-config.php prüfen
   - Datenbankdaten korrekt?

5. .htaccess wiederherstellen (falls vorhanden)
```

#### 3. Datenbank wiederherstellen

```
Via phpMyAdmin:
1. Einloggen

2. Aktuelle Datenbank sichern (nochmal!):
   Exportieren → Quick → SQL → OK
   (als Sicherheit)

3. Alle Tabellen löschen:
   - Alle Tabellen auswählen (Haken)
   - "Auswahl: Löschen" (VORSICHT!)
   - Bestätigen

4. Backup importieren:
   - Reiter "Importieren"
   - .sql oder .sql.gz Datei wählen
   - "OK"
   - Warten (kann 1-10 Min dauern)

5. Erfolgsmeldung prüfen
```

#### 4. Abschluss

```
1. Cache leeren (alle):
   - Server-Cache (Hosting)
   - Plugin-Cache (falls Plugin-Dateien wiederhergestellt)
   - Browser-Cache (Strg+Shift+R)

2. Permalinks neu generieren:
   - Falls Admin erreichbar: Einstellungen → Permalinks → Speichern
   - Falls nicht erreichbar: Über Datenbank (kompliziert)

3. Wartungsmodus deaktivieren:
   - .maintenance Datei via FTP löschen

4. Website testen:
   - Frontend laden
   - Admin-Bereich
   - Kritische Funktionen (Formulare, etc.)
```

---

## 6. Staging-Site Backup-Strategie

### Warum Staging-Backups?

```
- Experimentieren ohne Risiko
- Zwischenstände sichern
- Schnell zu funktionierendem Zustand zurück
```

### Backup-Zeitplan für Migration

```
Staging-Backups erstellen:

1. VORHER:
   - Direkt nach Einrichtung
   "staging-baseline-[DATUM]"

2. WÄHREND:
   - Ende jeder Arbeitswoche
   - Nach großen Meilensteinen
   "staging-week2-[DATUM]"

3. VOR LIVE-PUSH:
   - Finaler Zustand
   "staging-final-ready-for-live-[DATUM]"
```

### Snapshot-System (wenn vorhanden)

```
Manche Hosting-Provider bieten Snapshots:
- 1-Klick Backup
- 1-Klick Restore
- Sehr schnell

Beispiele:
- Kinsta: WP Admin → MyKinsta → Backups
- WP Engine: WP Admin → WP Engine → Backup Points
- SiteGround: Site Tools → Backups

NUTZEN SIE DIESE!
```

---

## 7. Automatisierung

### Automatische Backups einrichten

#### Mit UpdraftPlus

```
Einstellungen → UpdraftPlus → Einstellungen:

Zeitplan Dateien:
- Täglich / Wöchentlich / Monatlich
- Empfehlung während Migration: Täglich
- Empfehlung nach Migration: Wöchentlich

Zeitplan Datenbank:
- Empfehlung: Täglich

Aufbewahrung:
- Letzte 7-30 Backups (je nach Platz)

Cloud-Speicher:
- Aktiviert → Auto-Upload

E-Mail-Berichte:
- Bei Erfolg: Optional
- Bei Fehler: JA (unbedingt)
```

#### Mit BackWPup

```
Ähnlicher Zeitplan wie oben

Plus: Mehrere Jobs möglich:
- Job 1: Täglich nur Datenbank
- Job 2: Wöchentlich komplette Dateien
```

### Backup-Monitoring

```
Wöchentlich prüfen:
- [ ] Letztes Backup erfolgreich?
- [ ] Backup-Größe normal? (kein 0 KB Fehler)
- [ ] Cloud-Speicher hat noch Platz?
- [ ] Fehler-E-Mails erhalten? → Beheben!
```

---

## 8. Notfall-Kontaktliste

### Wichtige Kontakte dokumentieren

```
NOTFALL-KONTAKTE
================

Hosting-Support:
- Provider: _______________________
- Support-URL: ____________________
- Support-Email: __________________
- Support-Telefon: ________________
- Ticket-System: __________________

Domain-Registrar:
- Anbieter: _______________________
- Support: ________________________

Technische Kontakte:
- WordPress-Admin: ________________
- Server-Admin: ___________________
- Entwickler/Freelancer: __________

Backup-Speicherorte:
- Lokal: __________________________
- Cloud 1: ________________________
- Cloud 2: ________________________
```

### Eskalations-Prozess

```
WENN SITE DOWN:

Stufe 1 (Erste 5 Minuten):
- Nicht in Panik geraten
- Screenshot von Fehlermeldung
- Error-Log prüfen (falls Zugang)

Stufe 2 (5-15 Minuten):
- Backup bereit halten
- Hosting-Support kontaktieren
- Oder: Restore selbst starten

Stufe 3 (15-30 Minuten):
- Falls Restore nicht klappt:
- Professionelle Hilfe rufen
- Hosting-Support: dringender Fall

Stufe 4 (> 30 Minuten):
- Kunden/User informieren (falls Business)
- Social Media: "Wartungsarbeiten"
- Zeitplan für Fix kommunizieren
```

---

## 9. Spezielle Szenarien

### Site-Hack: Backup-Strategie

```
WENN SITE GEHACKT:

1. NICHT sofort Backup wiederherstellen!
   Backup könnte bereits Malware enthalten

2. Stattdessen:
   - Hosting informieren
   - Malware-Scan durchführen
   - Sauberen Zeitpunkt identifizieren
   - NUR sauberes Backup wiederherstellen

3. Nach Restore:
   - Alle Passwörter ändern
   - Sicherheits-Plugin installieren (Wordfence, Sucuri)
   - Unnötige Benutzer löschen
   - Plugins/Themes aktualisieren
```

### Defekte Datenbank

```
Symptome:
- "Error establishing database connection"
- Tabellen fehlen
- Daten korrupt

Lösung:
1. wp-config.php prüfen (Zugangsdaten korrekt?)
2. phpMyAdmin: Datenbank-Repair
   - Tabelle auswählen
   - Aktion: "Reparieren"
3. Falls nicht reparierbar: DB-Backup importieren
```

### Zu große Backups (> 5 GB)

```
Problem: Plugin-Backups scheitern bei großen Sites

Lösungen:

1. wp-content/uploads/ separat sichern:
   - Via FTP herunterladen (dauert lange)
   - Nur Uploads seit letztem Backup

2. Incremental Backups (nur Änderungen):
   - UpdraftPlus Premium
   - BackupBuddy

3. Server-Level Backups:
   - Hosting-Backup-Lösung nutzen

4. Kommandozeile (SSH):
   - tar + rsync für effizienten Transfer
```

---

## 10. Checklisten

### Pre-Migration Backup-Checklist

```
LIVE-SITE:
- [ ] Vollständiges Datei-Backup erstellt
- [ ] Datenbank-Backup erstellt
- [ ] Backups lokal heruntergeladen
- [ ] Backups in Cloud hochgeladen
- [ ] Backup-Wiederherstellung getestet
- [ ] Backup-Speicherort dokumentiert
- [ ] Backup-Datum notiert: __________

STAGING-SITE:
- [ ] Baseline-Backup nach Einrichtung
- [ ] Automatische Backups aktiviert
- [ ] Backup-Strategie definiert
```

### Post-Migration Backup-Checklist

```
NACH ERFOLGREICHER MIGRATION:
- [ ] Neues Baseline-Backup (Live)
- [ ] Altes Elementor-Backup archiviert
- [ ] Neue automatische Backup-Routine läuft
- [ ] Monitoring eingerichtet
- [ ] Team über Backup-Prozedur informiert
```

### Restore-Test-Checklist

```
RESTORE-TEST (Mindestens 1x durchführen!):
- [ ] Test-Umgebung vorbereitet
- [ ] Dateien wiederhergestellt
- [ ] Datenbank wiederhergestellt
- [ ] Website funktioniert
- [ ] Admin-Zugang funktioniert
- [ ] Kritische Features getestet
- [ ] Restore-Dauer dokumentiert: _____ Min
- [ ] Lessons Learned notiert
```

---

## 11. Best Practices Zusammenfassung

```
✅ DO:
- Backups VOR jeder größeren Änderung
- Multiple Backup-Kopien
- Backups regelmäßig testen
- Automatisierung nutzen
- Backup-Logs überwachen
- Externe/Off-site Speicherung
- Dokumentation führen

❌ DON'T:
- Nur ein einziges Backup
- Backups nie testen
- Nur auf Server-Backups verlassen
- Backup-Passwörter vergessen
- Alte Backups sofort löschen
- Backup-Fehler ignorieren
```

---

## Anhang: Nützliche Befehle

### SSH-Befehle (für Fortgeschrittene)

```bash
# Dateien packen
tar -czf backup-$(date +%Y%m%d).tar.gz /pfad/zu/wordpress/

# Datenbank exportieren
mysqldump -u DB_USER -p DB_NAME | gzip > db-$(date +%Y%m%d).sql.gz

# Dateien herunterladen (von lokalem PC)
scp user@server:/pfad/zu/backup.tar.gz ~/Backups/

# Sync mit rsync (sehr effizient)
rsync -avz user@server:/pfad/zu/wordpress/ ~/Backups/wordpress/
```

### WP-CLI Befehle

```bash
# Komplettes Backup
wp db export backup.sql

# Nur bestimmte Tabellen
wp db export backup.sql --tables=wp_posts,wp_postmeta

# Search & Replace in DB
wp search-replace 'http://old-domain.com' 'http://new-domain.com'
```

---

**Kritische Erinnerung**:
Ein Backup das Sie nicht wiederherstellen können, ist nutzlos.
TESTEN SIE IHRE BACKUPS!

---

**Version**: 1.0
**Letzte Aktualisierung**: Oktober 2024
**Für**: fahrzeugelektronik-service.de
