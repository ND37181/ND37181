# Pre-Migration Checklist
## Elementor zu WordPress Blocks Migration

**Website**: fahrzeugelektronik-service.de
**Datum**: _______________
**Durchgeführt von**: _______________

---

## 1. Backup & Sicherheit

### Vollständiges Backup
- [ ] **WordPress-Dateien gesichert**
  - Komplettes WordPress-Verzeichnis
  - Datum: _______________
  - Speicherort: _______________

- [ ] **Datenbank gesichert**
  - SQL-Export erstellt
  - Datum: _______________
  - Speicherort: _______________

- [ ] **Uploads-Ordner separat gesichert**
  - wp-content/uploads/
  - Größe: _______________ MB/GB
  - Speicherort: _______________

- [ ] **Wichtige Konfigurationsdateien gesichert**
  - wp-config.php
  - .htaccess
  - robots.txt
  - Speicherort: _______________

- [ ] **Backup lokal heruntergeladen**
  - [ ] Auf externem Laufwerk gespeichert
  - [ ] In Cloud-Speicher hochgeladen (Google Drive, Dropbox, etc.)

- [ ] **Backup-Wiederherstellung getestet**
  - Datum Test: _______________
  - Ergebnis: [ ] Erfolgreich [ ] Fehlgeschlagen

### Backup-Methode dokumentieren
```
Verwendete Backup-Methode:
[ ] Hosting Control Panel (cPanel/Plesk)
[ ] WordPress Plugin (Name: _______________)
[ ] Manuell (FTP + phpMyAdmin)
[ ] Andere: _______________
```

---

## 2. Staging-Umgebung

- [ ] **Staging-Site eingerichtet**
  - URL: _______________
  - Login: _______________
  - Hosting-Location: _______________

- [ ] **Backup auf Staging wiederhergestellt**
  - [ ] Dateien vollständig
  - [ ] Datenbank importiert
  - [ ] URLs angepasst (Search & Replace)

- [ ] **Staging-Site funktionsfähig**
  - [ ] Frontend erreichbar
  - [ ] Admin-Bereich zugänglich
  - [ ] Alle Seiten laden korrekt

- [ ] **Staging-Site vor Suchmaschinen geschützt**
  - [ ] robots.txt auf "Disallow: /"
  - [ ] Meta-Tag noindex gesetzt
  - [ ] .htaccess Passwortschutz (optional)

---

## 3. Website-Analyse

### Allgemeine Informationen

**WordPress-Version**: _______________
**PHP-Version**: _______________
**Elementor-Version**: _______________
**Elementor Pro**: [ ] Ja [ ] Nein
**Aktuelles Theme**: _______________

### Seiten-Inventar

- [ ] **Alle Seiten dokumentiert**

```
Gesamtanzahl Seiten: _______________
Seiten mit Elementor: _______________
Seiten ohne Elementor: _______________
Blog-Posts: _______________
Custom Post Types: _______________
```

- [ ] **Seiten-Liste erstellt** (Tabelle erstellen)

| Seiten-Titel | URL | Elementor? | Priorität | Komplexität | Status |
|-------------|-----|-----------|----------|-------------|--------|
| Startseite | / | Ja | Hoch | Hoch | |
| Über uns | /uber-uns | Ja | Mittel | Niedrig | |
| ... | ... | ... | ... | ... | |

### Elementor-Features-Analyse

- [ ] **Verwendete Elementor-Widgets dokumentiert**

Häufig verwendete Widgets (abhaken und Anzahl notieren):
- [ ] Heading (___ x)
- [ ] Text Editor (___ x)
- [ ] Image (___ x)
- [ ] Button (___ x)
- [ ] Divider (___ x)
- [ ] Spacer (___ x)
- [ ] Icon List (___ x)
- [ ] Accordion (___ x)
- [ ] Tabs (___ x)
- [ ] Testimonial (___ x)
- [ ] Counter (___ x)
- [ ] Progress Bar (___ x)
- [ ] Pricing Table (___ x)
- [ ] Contact Form (___ x)
- [ ] Google Maps (___ x)
- [ ] Gallery (___ x)
- [ ] Slider (___ x)
- [ ] Video (___ x)
- [ ] andere: _______________

- [ ] **Elementor Pro Features**
  - [ ] Theme Builder (Header/Footer)
  - [ ] Popup Builder
  - [ ] WooCommerce Builder
  - [ ] Custom Fonts
  - [ ] Custom Icons
  - [ ] Globale Widgets
  - [ ] Dynamic Content
  - [ ] Forms

- [ ] **Custom CSS/JavaScript**
  - [ ] Custom CSS vorhanden: _______________ Zeilen
  - [ ] Custom JS vorhanden: _______________ Zeilen
  - [ ] CSS extrahiert und dokumentiert
  - [ ] JS extrahiert und dokumentiert

- [ ] **Templates & Wiederverwendbare Blöcke**
  - Anzahl Templates: _______________
  - Anzahl Globale Widgets: _______________
  - Liste erstellt: [ ] Ja [ ] Nein

### Responsive Design

- [ ] **Mobile Breakpoints dokumentiert**
  - Tablet: _______________ px
  - Mobile: _______________ px

- [ ] **Mobile-spezifische Anpassungen notiert**
  - [ ] Versteckte Elemente auf Mobile
  - [ ] Andere Reihenfolge auf Mobile
  - [ ] Mobile-spezifische Widgets

---

## 4. Theme & Plugins

### Theme-Kompatibilität

- [ ] **Aktuelles Theme auf Gutenberg-Support geprüft**
  - Theme-Name: _______________
  - Gutenberg-kompatibel: [ ] Ja [ ] Nein [ ] Teilweise
  - Full Site Editing (FSE): [ ] Ja [ ] Nein

- [ ] **Alternative Block-Themes recherchiert**

Mögliche Themes:
- [ ] GeneratePress (+ GP Premium)
- [ ] Astra (+ Pro)
- [ ] Kadence
- [ ] Blocksy
- [ ] Twenty Twenty-Four
- [ ] Andere: _______________

### Plugin-Inventar

- [ ] **Alle installierten Plugins dokumentiert**

```
Gesamtanzahl Plugins: _______________
Aktive Plugins: _______________
Inaktive Plugins: _______________
```

- [ ] **Kritische Plugins identifiziert**
  - SEO: _______________
  - Caching: _______________
  - Sicherheit: _______________
  - Formulare: _______________
  - WooCommerce: [ ] Ja [ ] Nein

- [ ] **Block-Plugins ausgewählt**

Geplante Block-Plugins:
- [ ] Kadence Blocks
- [ ] Spectra (Ultimate Addons for Gutenberg)
- [ ] GenerateBlocks
- [ ] Stackable
- [ ] CoBlocks
- [ ] Otter Blocks
- [ ] Andere: _______________

---

## 5. Performance-Baseline

### Vor der Migration messen

- [ ] **Performance-Tests durchgeführt**

**GTmetrix**:
- Performance Score: _______________
- Structure Score: _______________
- Ladezeit: _______________ s
- Seitengröße: _______________ MB
- Requests: _______________

**Google PageSpeed Insights**:
- Mobile Score: _______________
- Desktop Score: _______________
- First Contentful Paint: _______________ s
- Largest Contentful Paint: _______________ s
- Total Blocking Time: _______________ ms
- Cumulative Layout Shift: _______________

**Pingdom**:
- Performance Grade: _______________
- Ladezeit: _______________ s
- Seitengröße: _______________ MB

- [ ] **Screenshots der Performance-Ergebnisse gespeichert**

---

## 6. SEO & Analytics

### SEO-Daten sichern

- [ ] **SEO-Plugin dokumentiert**
  - Plugin: _______________
  - Meta-Titel und -Beschreibungen exportiert
  - Schema-Markup dokumentiert
  - Sitemap-URL: _______________

- [ ] **Rankings dokumentiert** (Top-Keywords)
  - Tool: _______________ (z.B. Google Search Console)
  - Top 10 Keywords notiert
  - Screenshot erstellt

- [ ] **Google Search Console überprüft**
  - Keine kritischen Fehler
  - Indexierte Seiten: _______________

### Analytics

- [ ] **Google Analytics aktiv**
  - UA/GA4: _______________
  - Tracking funktioniert
  - Custom Events dokumentiert

- [ ] **Andere Tracking-Tools**
  - [ ] Facebook Pixel
  - [ ] Google Tag Manager
  - [ ] Andere: _______________

---

## 7. Inhalts-Sicherung

- [ ] **Screenshots aller wichtigen Seiten erstellt**
  - Desktop-Ansicht
  - Tablet-Ansicht
  - Mobile-Ansicht
  - Speicherort: _______________

- [ ] **Content-Export erstellt**
  - [ ] WordPress XML-Export (Tools → Daten exportieren)
  - [ ] Elementor Template Export
  - [ ] Medien-Bibliothek dokumentiert

---

## 8. Funktionalitäts-Tests

### Vor-Migration Baseline

- [ ] **Alle Features getestet und dokumentiert**

Formulare:
- [ ] Kontaktformular funktioniert
- [ ] Newsletter-Anmeldung funktioniert
- [ ] Andere Formulare: _______________

E-Commerce (falls vorhanden):
- [ ] Produktseiten laden
- [ ] Warenkorb funktioniert
- [ ] Checkout funktioniert
- [ ] Zahlungs-Gateways getestet

Spezielle Features:
- [ ] Mehrsprachigkeit (WPML, Polylang, etc.)
- [ ] Mitgliederbereich
- [ ] Buchungssystem
- [ ] Andere: _______________

---

## 9. Zugänge & Dokumentation

- [ ] **Alle Zugangsdaten dokumentiert und sicher verwahrt**
  - [ ] WordPress Admin
  - [ ] Hosting Control Panel
  - [ ] FTP/SFTP
  - [ ] Datenbank (phpMyAdmin)
  - [ ] Domain-Registrar
  - [ ] CDN (falls vorhanden)

- [ ] **Hosting-Spezifikationen dokumentiert**
  - PHP-Version: _______________
  - MySQL-Version: _______________
  - PHP Memory Limit: _______________
  - Max Upload Size: _______________
  - Execution Time: _______________

---

## 10. Stakeholder-Kommunikation

- [ ] **Migrations-Plan mit Stakeholdern besprochen**
  - [ ] Zeitplan abgestimmt
  - [ ] Erwartungen geklärt
  - [ ] Downtime-Fenster definiert

- [ ] **Notfall-Kontakte definiert**
  - Projektleiter: _______________
  - Technischer Ansprechpartner: _______________
  - Hosting-Support: _______________

---

## 11. Rechtliche Aspekte

- [ ] **Elementor-Lizenz überprüft**
  - Lizenztyp: _______________
  - Gültig bis: _______________
  - Nach Migration kündigen: [ ] Ja [ ] Nein

- [ ] **Theme-Lizenz überprüft** (falls Premium)
  - Lizenztyp: _______________
  - Gültig bis: _______________

- [ ] **Plugin-Lizenzen überprüft**
  - Liste kritischer Lizenzen: _______________

---

## 12. Risiko-Bewertung

### Potenzielle Risiken identifizieren

- [ ] **Technische Risiken**
  - [ ] Inkompatible Plugins
  - [ ] Theme-Probleme
  - [ ] Custom Code-Konflikte
  - [ ] Performance-Verschlechterung

- [ ] **Business-Risiken**
  - [ ] SEO-Ranking-Verlust
  - [ ] Funktionalitäts-Verlust
  - [ ] Conversion-Rate-Verlust
  - [ ] Längere Downtime als geplant

- [ ] **Mitigation-Strategien definiert**
  - Rollback-Plan: _______________
  - Zeitpuffer eingeplant: _______________
  - Notfall-Prozedur dokumentiert: [ ] Ja [ ] Nein

---

## 13. Finale Checkliste vor Start

- [ ] Alle obigen Punkte abgeschlossen
- [ ] Team ist bereit
- [ ] Backup ist verifiziert
- [ ] Staging-Umgebung ist einsatzbereit
- [ ] Zeitplan ist realistisch
- [ ] Notfall-Plan existiert

---

## Unterschrift & Freigabe

**Verantwortlicher**: _______________
**Datum**: _______________
**Unterschrift**: _______________

**Freigabe zur Migration**: [ ] Ja [ ] Nein

**Notizen**:
```
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________
```

---

## Nächste Schritte

Nach Abschluss dieser Checklist:
1. Siehe ELEMENTOR_TO_BLOCKS_MIGRATION.md für detaillierte Anleitung
2. Siehe Migration-Workflow.md für Schritt-für-Schritt-Prozess
3. Beginne mit Phase 1: Setup der Tools und Test-Migration

---

**Dokument-Version**: 1.0
**Letzte Aktualisierung**: Oktober 2024
