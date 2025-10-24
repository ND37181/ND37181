# Elementor zu WordPress Blocks Migration Guide

## Projekt: fahrzeugelektronik-service.de

Dieser Leitfaden beschreibt den Migrationsprozess von Elementor zu WordPress Gutenberg Blocks für https://fahrzeugelektronik-service.de/

---

## Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Vor der Migration](#vor-der-migration)
3. [Migrations-Strategien](#migrations-strategien)
4. [Schritt-für-Schritt Anleitung](#schritt-für-schritt-anleitung)
5. [Wichtige Überlegungen](#wichtige-überlegungen)
6. [Hilfreiche Tools](#hilfreiche-tools)
7. [Troubleshooting](#troubleshooting)

---

## Übersicht

### Warum von Elementor zu Blocks migrieren?

- **Performance**: Gutenberg Blocks sind leichter und schneller
- **Native Integration**: Vollständige WordPress-Integration ohne Drittanbieter-Plugin
- **Wartung**: Weniger Abhängigkeiten und Updates
- **Zukunftssicherheit**: WordPress entwickelt aktiv den Block-Editor weiter
- **Kosten**: Keine Lizenzgebühren für Elementor Pro

### Herausforderungen

- **Manuelle Arbeit**: Keine vollautomatische Konvertierung möglich
- **Design-Anpassungen**: Elementor-spezifische Features müssen neu implementiert werden
- **Zeit**: Je nach Seitenanzahl zeitintensiv

---

## Vor der Migration

### 1. Vollständiges Backup erstellen

**KRITISCH**: Bevor Sie beginnen!

```bash
# Backup-Optionen:
# 1. Hosting-Control-Panel (cPanel, Plesk, etc.)
# 2. WordPress Backup-Plugins:
#    - UpdraftPlus
#    - BackWPup
#    - Duplicator

# Was zu sichern ist:
# - Gesamte WordPress-Installation
# - Datenbank
# - wp-content Ordner (Themes, Plugins, Uploads)
# - .htaccess und wp-config.php
```

### 2. Staging-Umgebung einrichten

**NIEMALS direkt auf der Live-Site arbeiten!**

- Lokale Entwicklungsumgebung (Local WP, XAMPP, MAMP)
- Oder Staging-Umgebung beim Hosting-Provider
- Oder Subdomain (staging.fahrzeugelektronik-service.de)

### 3. Analyse der aktuellen Website

Dokumentieren Sie:

- [ ] Anzahl der Seiten mit Elementor
- [ ] Verwendete Elementor-Widgets
- [ ] Custom CSS/JavaScript in Elementor
- [ ] Elementor-Templates und wiederverwendbare Blöcke
- [ ] Verwendete Elementor-Features (Popups, Theme Builder, etc.)
- [ ] Responsive Breakpoints und Mobile-Anpassungen

### 4. Analyse-Tool verwenden

```bash
# WordPress-Admin aufrufen
# Tools installieren:
# 1. "Health Check & Troubleshooting" Plugin
# 2. "Query Monitor" für Performance-Analyse
```

---

## Migrations-Strategien

### Option 1: Schrittweise Migration (EMPFOHLEN)

**Vorteile:**
- Geringeres Risiko
- Kontinuierliche Website-Verfügbarkeit
- Zeit für Qualitätskontrolle

**Prozess:**
1. Neue Seiten im Block-Editor erstellen
2. Alte Seiten nach und nach konvertieren
3. Elementor erst entfernen, wenn alle Seiten migriert sind

### Option 2: Komplette Neugestaltung

**Vorteile:**
- Gelegenheit für komplettes Redesign
- Modernere Struktur
- Optimierte Performance von Anfang an

**Prozess:**
1. Neues Theme mit voller Gutenberg-Unterstützung
2. Alle Seiten neu erstellen
3. Inhalte aus alten Seiten kopieren
4. Paralleler Betrieb bis Fertigstellung

### Option 3: Hybrid-Ansatz (Übergangsphase)

**Vorteile:**
- Flexibilität
- Sofortiger Start möglich

**Prozess:**
1. Elementor und Gutenberg parallel nutzen
2. Neue Inhalte nur noch mit Blocks
3. Alte Seiten bei Bedarf migrieren

---

## Schritt-für-Schritt Anleitung

### Phase 1: Vorbereitung

#### Schritt 1: Backup & Staging
```bash
# 1. Backup erstellen (siehe oben)
# 2. Staging-Site erstellen
# 3. Backup auf Staging wiederherstellen
```

#### Schritt 2: Analyse durchführen
```bash
# Im WordPress-Admin der Staging-Site:
# 1. Alle Seiten durchgehen
# 2. Screenshots erstellen
# 3. Besondere Features notieren
```

#### Schritt 3: Theme prüfen
```bash
# Aktuelles Theme auf Gutenberg-Kompatibilität prüfen
# Gute Block-kompatible Themes:
# - GeneratePress
# - Astra
# - Kadence
# - Twenty Twenty-Four (WordPress Standard)
# - Blocksy
```

### Phase 2: Tools installieren

#### Schritt 4: Notwendige Plugins installieren

**Block-Bibliotheken** (erweitern Gutenberg):
```
- Kadence Blocks (kostenlos, sehr umfangreich)
- Spectra (ehemals Ultimate Addons for Gutenberg)
- Stackable
- GenerateBlocks
- Otter Blocks
```

**Layout-Builder**:
```
- CoBlocks
- Block Lab (für Custom Blocks)
- Advanced Custom Fields (ACF) für Blocks
```

**Migration-Hilfen**:
```
- Reusable Blocks Extended
- Block Pattern Builder
```

### Phase 3: Migration

#### Schritt 5: Erste Testseite konvertieren

1. **Einfache Seite wählen** (z.B. "Impressum" oder "Datenschutz")
2. **Neuen Entwurf erstellen**:
   - Seite duplizieren
   - "-BLOCKS" an Titel anhängen
   - Mit Block-Editor öffnen

3. **Inhalte manuell nachbauen**:
   - Elementor-Seite parallel öffnen
   - Block-für-Block nachbauen
   - CSS-Klassen übertragen falls nötig

4. **Vergleichen und testen**:
   - Desktop-Ansicht
   - Tablet-Ansicht
   - Mobile-Ansicht
   - Performance testen

#### Schritt 6: Widget-Mapping erstellen

Erstellen Sie eine Zuordnungstabelle:

| Elementor Widget | Gutenberg Alternative |
|------------------|----------------------|
| Heading | Core: Heading Block |
| Text Editor | Core: Paragraph Block |
| Image | Core: Image Block |
| Button | Core: Button Block |
| Divider | Core: Spacer/Separator |
| Icon List | Kadence: Icon List |
| Accordion | Kadence: Accordion |
| Tabs | Kadence: Tabs |
| Testimonial | Kadence: Testimonials |
| Counter | Spectra: Counter |
| Progress Bar | Spectra: Progress Bar |
| Pricing Table | Kadence: Pricing Table |
| Contact Form | Contact Form 7 + Block |
| Google Maps | Core: Embed oder Kadence: Maps |

#### Schritt 7: Wiederverwendbare Komponenten

**Für häufig verwendete Elemente**:
1. Als "Reusable Block" speichern
2. Oder als Block Pattern speichern
3. Überall wiederverwenden

```
WordPress Admin → Muster → Neu erstellen
```

#### Schritt 8: Seite für Seite migrieren

**Empfohlene Reihenfolge**:
1. Einfache Content-Seiten (Impressum, Datenschutz, Über uns)
2. Standard-Seiten (Dienstleistungen, Kontakt)
3. Startseite (komplex, zum Schluss)
4. Blog-Posts
5. Archive/Kategorieseiten

**Für jede Seite**:
- [ ] Screenshot der Original-Seite
- [ ] Neue Version im Block-Editor erstellen
- [ ] Responsive Design prüfen
- [ ] SEO-Einstellungen übertragen (Meta-Titel, Beschreibung)
- [ ] URLs/Slugs identisch halten
- [ ] Verlinkungen testen
- [ ] Performance vergleichen

### Phase 4: Theme-Anpassungen

#### Schritt 9: Header & Footer

Wenn Sie Elementor Theme Builder verwenden:

**Option A**: Theme mit FSE (Full Site Editing)
- WordPress 6.x mit Block-Theme
- Header/Footer als Blocks
- Theme-Dateien: header.html, footer.html

**Option B**: Traditionelles Theme mit Gutenberg-Hooks
- GeneratePress mit GP Premium
- Kadence Theme
- Astra mit Custom Layouts

**Option C**: Plugin-Lösung
- WPBakery Header Footer Plugin
- Elementor weiter nur für Header/Footer nutzen (nicht ideal)

#### Schritt 10: Custom CSS übertragen

```css
/* In WordPress anpassen:
   Design → Customizer → Zusätzliches CSS
   oder
   Theme File Editor (nicht empfohlen)
   oder
   Child Theme erstellen
*/

/* Elementor CSS extrahieren:
   Elementor → Tools → Replace URL
   CSS aus Elementor-Stylesheets kopieren
*/
```

### Phase 5: Testing & Optimierung

#### Schritt 11: Umfassende Tests

- [ ] Alle Seiten auf allen Geräten testen
- [ ] Formulare testen
- [ ] Navigationsmenüs prüfen
- [ ] Interne Links prüfen
- [ ] Bilder-Optimierung (WebP, lazy loading)
- [ ] Performance testen (GTmetrix, PageSpeed Insights)
- [ ] SEO prüfen (Rank Math, Yoast)
- [ ] Accessibility prüfen (WAVE, Lighthouse)

#### Schritt 12: Performance-Optimierung

```bash
# Empfohlene Plugins:
# - WP Rocket (Caching)
# - ShortPixel (Bildoptimierung)
# - Asset CleanUp (CSS/JS bereinigen)
# - Autoptimize (Minification)
```

### Phase 6: Live-Schaltung

#### Schritt 13: Elementor deaktivieren

**NUR wenn alle Seiten migriert sind!**

1. **Backup erstellen** (nochmal!)
2. Elementor-Plugin deaktivieren
3. Website komplett durchprüfen
4. Falls alles funktioniert: Elementor löschen

#### Schritt 14: Aufräumen

```bash
# Datenbank bereinigen:
# - WP-Optimize Plugin
# - Advanced Database Cleaner

# Folgendes bereinigen:
# - Elementor-Metadaten
# - Elementor-Custom-Post-Types
# - Verwaiste CSS-Dateien
# - Ungenutzte Bilder
```

#### Schritt 15: Migration auf Live-Site

**Option A**: Staging zu Live
```bash
# Mit Plugin:
# - WP Staging Pro
# - Duplicator Pro
# - All-in-One WP Migration
```

**Option B**: Manuell
```bash
# 1. Live-Site Backup
# 2. Datenbank exportieren (Staging)
# 3. Dateien synchronisieren
# 4. Datenbank-URLs ersetzen
# 5. DNS/URLs anpassen
```

---

## Wichtige Überlegungen

### 1. Content-Struktur

- **Semantisches HTML**: Gutenberg erzeugt saubereres HTML
- **Accessibility**: Bessere Barrierefreiheit mit nativen Blocks
- **SEO**: Sauberer Code = besseres SEO

### 2. Design-Fidelity

- Nicht alles 1:1 übernehmen - Gelegenheit zur Verbesserung
- Moderne Design-Patterns nutzen
- Mobile-First-Ansatz

### 3. Performance

- Elementor lädt viel CSS/JS
- Gutenberg ist leichter
- Erwartete Verbesserung: 20-40% schnellere Ladezeiten

### 4. Wartbarkeit

- Weniger Plugins = weniger Kompatibilitätsprobleme
- Einfacherer Code = leichtere Wartung
- Native WordPress-Funktionen = bessere Langzeitunterstützung

---

## Hilfreiche Tools

### WordPress-Plugins

**Block-Erweiterungen**:
- Kadence Blocks - https://www.kadencewp.com/kadence-blocks/
- Spectra - https://wpspectra.com/
- Stackable - https://wpstackable.com/

**Entwickler-Tools**:
- Query Monitor - Performance-Debugging
- Show Current Template - Template-Erkennung
- Reusable Blocks Extended - Block-Management

**Migration-Unterstützung**:
- Import External Images - Bilder von externer URL importieren
- Search & Replace - Massenersetzung in Datenbank

### Browser-Erweiterungen

- Responsive Viewer - Multi-Device-Ansicht
- WhatFont - Schriftarten identifizieren
- ColorZilla - Farben extrahieren

### Externe Tools

- GTmetrix - Performance-Analyse
- Google PageSpeed Insights - Performance & SEO
- Screaming Frog - SEO-Crawler
- DiffChecker - Seiten vergleichen

---

## Troubleshooting

### Problem: Layouts sehen anders aus

**Lösung**:
- Custom CSS hinzufügen
- Block-Spacing anpassen
- Container-Breiten prüfen
- Theme-Einstellungen anpassen

### Problem: Fehlende Funktionalität

**Lösung**:
- Passende Block-Plugins suchen
- Custom Block erstellen (ACF Blocks)
- Shortcode als Fallback

### Problem: Performance schlechter

**Lösung**:
- Caching aktivieren
- Bilder optimieren
- Ungenutzte Blocks deaktivieren
- CSS/JS minifizieren

### Problem: Mobile Ansicht fehlerhaft

**Lösung**:
- Responsive-Einstellungen pro Block prüfen
- Theme Mobile-Settings anpassen
- Custom Media Queries hinzufügen

---

## Zeitplan (Beispiel)

Für eine typische Business-Website mit ca. 20 Seiten:

| Phase | Dauer | Aufgaben |
|-------|-------|----------|
| Vorbereitung | 1-2 Tage | Backup, Staging, Analyse |
| Setup | 1 Tag | Theme, Plugins installieren |
| Migration | 1-3 Wochen | Seiten konvertieren (1-2/Tag) |
| Testing | 3-5 Tage | QA, Bugfixes |
| Optimierung | 2-3 Tage | Performance, SEO |
| Live-Schaltung | 1 Tag | Migration, Testing |

**Gesamt: 3-5 Wochen** (je nach Komplexität und verfügbarer Zeit)

---

## Nächste Schritte

1. [ ] Vollständiges Backup erstellen
2. [ ] Staging-Umgebung einrichten
3. [ ] Website-Analyse durchführen (siehe Pre-Migration-Checklist.md)
4. [ ] Migrations-Strategie festlegen
5. [ ] Erste Testseite migrieren
6. [ ] Systematisch alle Seiten migrieren
7. [ ] Testen & Optimieren
8. [ ] Live-Schaltung planen

---

## Ressourcen

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Gutenberg Changelog](https://wordpress.org/gutenberg/)
- [Full Site Editing](https://fullsiteediting.com/)
- [Block Pattern Directory](https://wordpress.org/patterns/)

---

**Erstellt**: Oktober 2024
**Für**: fahrzeugelektronik-service.de
**Version**: 1.0
