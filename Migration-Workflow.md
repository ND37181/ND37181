# Migration Workflow: Elementor → WordPress Blocks
## Schritt-für-Schritt Arbeitsanleitung

**Website**: fahrzeugelektronik-service.de

---

## Übersicht

Dieser Workflow führt Sie systematisch durch die Migration von Elementor zu WordPress Blocks. Folgen Sie jedem Schritt der Reihe nach.

**Geschätzte Gesamtdauer**: 3-5 Wochen
**Voraussetzung**: Pre-Migration-Checklist.md vollständig abgeschlossen

---

## Woche 1: Setup & Vorbereitung

### Tag 1: Umgebung einrichten

#### 1.1 Staging-Site erstellen (2-3 Stunden)

**Methode A: Lokale Entwicklung (empfohlen für Flexibilität)**

1. **Local WP installieren** (kostenlos)
   ```
   - Download: https://localwp.com/
   - Installieren und starten
   - "Create a new site" klicken
   - Site-Name: "fahrzeugelektronik-staging"
   - Umgebung wählen: Preferred
   ```

2. **Live-Site importieren**
   ```
   - Plugin "All-in-One WP Migration" auf Live-Site installieren
   - Tools → All-in-One WP Migration → Export
   - Export nach Abschluss herunterladen
   - In Local WP Site: WP-Admin → All-in-One WP Migration → Import
   - .wpress Datei hochladen
   ```

3. **URLs anpassen**
   ```
   - In Local WP automatisch erledigt
   - Permalinks neu generieren: Einstellungen → Permalinks → Speichern
   ```

**Methode B: Hosting-basierte Staging**

1. **Beim Hoster Staging erstellen**
   ```
   - cPanel: "Staging" oder "Git Version Control"
   - Plesk: "WordPress Toolkit" → "Clone"
   - Subdomain erstellen: staging.fahrzeugelektronik-service.de
   ```

2. **Live-Site klonen**
   ```
   - Über Hosting-Control-Panel klonen
   - Oder Plugin "WP Staging" verwenden
   ```

**Checkliste Tag 1**:
- [ ] Staging-Umgebung läuft
- [ ] Admin-Zugang funktioniert
- [ ] Frontend ist erreichbar
- [ ] robots.txt auf "Disallow: /" gesetzt

---

#### 1.2 Analyse durchführen (2-3 Stunden)

1. **Seitenanalyse mit Browser**
   ```
   - Alle Seiten durchgehen
   - Screenshots erstellen (Desktop, Tablet, Mobile)
   - Ordner anlegen: "migration-screenshots/"
   ```

2. **Elementor-Analyse**
   ```
   WordPress Admin:
   - Elementor → Tools → System Info (Screenshot)
   - Elementor → Templates (Liste exportieren)
   - Pages → Alle Seiten (filtern nach "Elementor")
   ```

3. **Tabelle erstellen** (Excel/Google Sheets)
   ```
   Spalten:
   - Seitenname
   - URL
   - Priorität (Hoch/Mittel/Niedrig)
   - Komplexität (Hoch/Mittel/Niedrig)
   - Widgets-Anzahl
   - Besonderheiten
   - Status (Ausstehend/In Arbeit/Fertig)
   - Notizen
   ```

**Checkliste Tag 1**:
- [ ] Alle Seiten dokumentiert
- [ ] Screenshots erstellt
- [ ] Tabelle angelegt

---

### Tag 2: Theme & Plugins Setup (3-4 Stunden)

#### 2.1 Block-kompatibles Theme wählen

**Option 1: Aktuelles Theme behalten** (falls Gutenberg-kompatibel)
```
Theme-Check:
- Theme-Entwickler-Website besuchen
- Nach "Gutenberg" oder "Block Editor" suchen
- Support-Forum prüfen
```

**Option 2: Neues Theme installieren** (empfohlen)
```
Empfohlene Themes für Business-Websites:

1. GeneratePress (+ GP Premium) - EMPFEHLUNG
   - Leicht und schnell
   - Volle Block-Unterstützung
   - Großartiger Support
   - Preis: $59/Jahr für Premium

2. Kadence
   - Kostenlos mit vielen Features
   - Starter Templates für Blocks
   - Header/Footer Builder integriert

3. Astra (+ Astra Pro)
   - Sehr beliebt
   - Viele Starter-Templates
   - Preis: $59/Jahr für Pro
```

**Installation**:
```
1. WordPress Admin → Design → Themes → Neu hinzufügen
2. Theme suchen und installieren
3. NICHT sofort aktivieren!
4. Child Theme erstellen (falls Custom CSS vorhanden)
```

#### 2.2 Block-Plugins installieren

**Core Blocks erweitern**:
```
1. Kadence Blocks (EMPFOHLEN)
   - Plugins → Neu hinzufügen → "Kadence Blocks"
   - Installieren & Aktivieren
   - Kadence → Settings → durchgehen
   - Ungenutzte Blocks deaktivieren für Performance

2. Spectra (ehemals UAG)
   - Alternative/Ergänzung zu Kadence
   - Installieren & Aktivieren

3. GenerateBlocks (falls GeneratePress Theme)
   - Perfekte Integration
   - Sehr performant
```

**Hilfs-Plugins**:
```
1. Reusable Blocks Extended
   - Besseres Management für wiederverwendbare Blöcke

2. Block Pattern Builder
   - Eigene Block Patterns erstellen

3. EditorsKit
   - Zusätzliche Editor-Features
```

**Checkliste Tag 2**:
- [ ] Theme ausgewählt (aber noch nicht aktiviert)
- [ ] Kadence Blocks installiert
- [ ] Weitere Block-Plugins installiert
- [ ] Alle Plugins aktualisiert

---

### Tag 3: Erste Testseite migrieren (4-6 Stunden)

#### 3.1 Einfachste Seite wählen

Kriterien für erste Testseite:
- Wenige Widgets (5-10)
- Keine komplexen Layouts
- Nicht geschäftskritisch
- Beispiel: "Impressum" oder "Datenschutz"

#### 3.2 Widget-Mapping erstellen

**Schritt für Schritt**:

1. **Elementor-Seite öffnen**
   ```
   - In neuem Browser-Tab
   - Mit Elementor bearbeiten
   - Jeden Abschnitt durchgehen
   - Widgets notieren
   ```

2. **Gutenberg-Alternative finden**
   ```
   Beispiel Impressum-Seite:

   Elementor → Gutenberg
   ----------------------------------------
   Heading → Core: Überschrift
   Text Editor → Core: Absatz
   Divider → Core: Separator
   Button → Core: Button
   Icon List → Kadence: Icon List
   ```

3. **In Tabelle dokumentieren**

#### 3.3 Seite im Block-Editor nachbauen

**Prozess**:

1. **Neue Seite anlegen**
   ```
   Seiten → Neu erstellen
   Titel: "Impressum (Blocks)" oder "Impressum - NEU"
   Nicht veröffentlichen - als Entwurf speichern
   ```

2. **Block für Block nachbauen**
   ```
   Workflow:
   - Elementor-Seite auf einem Monitor
   - Block-Editor auf anderem Monitor (oder Tab wechseln)
   - Jeden Abschnitt nachbauen:
     1. Container/Group Block
     2. Inhalts-Blocks hinzufügen
     3. Styling anpassen
     4. Spacing/Padding einstellen
   ```

3. **Styling übertragen**
   ```
   Für jeden Block:
   - Farben (Hintergrund, Text)
   - Typografie (Schriftgröße, Gewicht)
   - Abstände (Margin, Padding)
   - Rahmen (Border, Border-Radius)
   - Schatten (Box Shadow)
   ```

4. **Responsive Design**
   ```
   - Im Editor: Responsive-Vorschau nutzen
   - Für Tablet/Mobile anpassen
   - Kadence Blocks: Responsive-Einstellungen pro Block
   ```

#### 3.4 Vergleichen & Testen

**Desktop-Vergleich**:
```
1. Beide Seiten in Tabs öffnen
2. Visuell vergleichen
3. Mit Screenshot vergleichen
4. Notizen zu Unterschieden
```

**Mobile Testing**:
```
1. Chrome DevTools (F12) → Responsive Modus
2. Verschiedene Geräte testen:
   - iPhone SE (375px)
   - iPhone 12 (390px)
   - iPad (768px)
   - iPad Pro (1024px)
```

**Performance-Test**:
```
1. GTmetrix: Beide Seiten testen
2. Ladezeiten vergleichen
3. Seitengröße vergleichen
```

**Checkliste Tag 3**:
- [ ] Erste Seite vollständig im Block-Editor nachgebaut
- [ ] Desktop-Design stimmt überein
- [ ] Mobile-Design funktioniert
- [ ] Performance ist gleich oder besser
- [ ] Alle Links funktionieren

---

### Tag 4-5: Prozess verfeinern (2-3 Tage)

#### 4.1 Zweite & dritte Testseite

```
1. Nächst-komplexere Seite wählen
2. Migration wiederholen
3. Zeit messen
4. Schwierigkeiten notieren
5. Workflow optimieren
```

#### 4.2 Wiederverwendbare Blöcke erstellen

**Für häufige Elemente**:
```
Beispiele:
- CTA (Call-to-Action) Button-Bereich
- Kontakt-Box
- Service-Karten
- Testimonial-Block
- Header-Bereiche

Erstellen:
1. Block/Gruppe erstellen
2. Styling fertig machen
3. ... Menü → "Als wiederverwendbar speichern"
4. Namen geben (z.B. "CTA - Kontakt")
5. Überall verwenden
```

#### 4.3 Custom CSS organisieren

```
1. Elementor Custom CSS extrahieren:
   - Elementor → Custom CSS (falls vorhanden)
   - Kopieren

2. Im Customizer hinzufügen:
   - Design → Customizer → Zusätzliches CSS
   - Oder: Child Theme style.css

3. Block-spezifisches CSS:
   - Kadence Blocks: Pro Block im "Advanced" Tab
   - Oder: CSS-Klassen vergeben und zentral stylen
```

**Checkliste Tag 4-5**:
- [ ] 2-3 weitere Seiten migriert
- [ ] Workflow optimiert
- [ ] Wiederverwendbare Blöcke erstellt
- [ ] Custom CSS organisiert
- [ ] Geschwindigkeit pro Seite verbessert

---

## Woche 2-3: Haupt-Migration

### Migrations-Reihenfolge

**Empfohlene Reihenfolge**:
```
Woche 2:
Tag 1-2: Einfache Content-Seiten (Über uns, Kontakt, etc.)
Tag 3-4: Service/Leistungs-Seiten
Tag 5: Blog-Posts beginnen

Woche 3:
Tag 1-2: Haupt-Landingpages
Tag 3-4: Startseite (komplex!)
Tag 5: Restliche Seiten
```

### Täglicher Workflow

**Morgen-Routine** (30 Min):
```
1. Gestrige Arbeit reviewen
2. 3-4 Seiten für heute auswählen
3. Priorität festlegen
4. Kaffee holen ☕
```

**Pro Seite** (1-2 Stunden):
```
1. Elementor-Seite analysieren (10 Min)
2. Widgets mappen (5 Min)
3. Im Block-Editor nachbauen (30-60 Min)
4. Responsive anpassen (15 Min)
5. Testen & vergleichen (10 Min)
6. Als Entwurf speichern
7. Status in Tabelle aktualisieren
```

**Abend-Routine** (20 Min):
```
1. Fortschritt dokumentieren
2. Probleme notieren
3. Morgen planen
4. Backup der Staging-Site (automatisch)
```

### Komplexe Elemente

#### Slider/Carousel
```
Elementor Slider → Gutenberg Alternativen:
1. Kadence: Advanced Gallery (Slider-Modus)
2. MetaSlider Plugin + Block
3. Splide Slider Block
```

#### Tabs & Accordions
```
Elementor Tabs/Accordion → Gutenberg:
1. Kadence: Tabs Block
2. Kadence: Accordion Block
3. GenerateBlocks: Container mit Toggle
```

#### Formulare
```
Elementor Forms → Alternativen:
1. Contact Form 7 (+ CF7 Blocks)
2. WPForms (+ Gutenberg Block)
3. Formidable Forms
4. Kadence: Form Block (Basic)

Migration:
1. Formular-Felder dokumentieren
2. In neuem Plugin nachbauen
3. Test-Submission durchführen
4. E-Mail-Benachrichtigungen prüfen
```

#### Google Maps
```
Elementor Map → Gutenberg:
1. Kadence: Google Maps Block
2. Core: Embed Block (Google Maps Embed-Code)
3. MapPress Plugin

API Key benötigt:
- Google Cloud Console
- Maps JavaScript API aktivieren
- API Key erstellen
- In Kadence Settings eintragen
```

**Checkliste Woche 2-3**:
- [ ] 80% der Seiten migriert
- [ ] Alle Standard-Seiten fertig
- [ ] Komplexe Features gelöst
- [ ] Formulare getestet

---

## Woche 4: Header, Footer & Theme

### Header & Footer Migration

#### Option A: Theme Builder verwenden

**Mit Kadence Theme**:
```
1. Design → Header Builder
2. Neue Header-Komponenten:
   - Logo
   - Navigation
   - Button/CTA
   - Mobile-Toggle
3. Elementor Header als Referenz
4. Desktop & Mobile testen
```

**Mit GeneratePress Premium**:
```
1. Design → Elements → Neu
2. Typ: Header
3. Mit Blocks gestalten
4. Display Rules setzen
```

#### Option B: Full Site Editing (FSE)

**Falls Block-Theme mit FSE**:
```
1. Design → Editor
2. Templates → Header
3. Header-Template bearbeiten
4. Mit Blocks gestalten
```

### Theme wechseln

**Wenn neues Theme gewählt**:

1. **Vorbereitung**:
   ```
   - Alle Seiten migriert
   - Header/Footer im neuen Theme vorbereitet
   - Menüs dokumentiert
   - Widgets dokumentiert (Sidebar, Footer)
   ```

2. **Customizer-Einstellungen exportieren**:
   ```
   - Plugin: Customizer Export/Import
   - Alte Einstellungen exportieren
   - Nach Theme-Wechsel importieren (soweit kompatibel)
   ```

3. **Theme aktivieren**:
   ```
   Design → Themes → [Neues Theme] → Aktivieren
   ```

4. **Nacharbeit**:
   ```
   - Menüs neu zuweisen
   - Widgets neu platzieren
   - Customizer durchgehen
   - Primary Color, Fonts, etc. setzen
   ```

**Checkliste Woche 4**:
- [ ] Header migriert
- [ ] Footer migriert
- [ ] Theme gewechselt (falls geplant)
- [ ] Menüs funktionieren
- [ ] Widgets platziert

---

## Woche 5: Testing, Optimierung & Launch

### Tag 1-2: Umfassende Tests

#### Funktionalitäts-Tests

**Alle Seiten durchgehen**:
```
Checklist pro Seite:
- [ ] Desktop-Layout korrekt
- [ ] Tablet-Layout korrekt
- [ ] Mobile-Layout korrekt
- [ ] Alle Bilder laden
- [ ] Alle Links funktionieren
- [ ] Buttons funktionieren
- [ ] Formulare funktionieren
- [ ] Animationen (falls vorhanden)
```

**Browser-Tests**:
```
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)
```

#### SEO-Check

```
1. Yoast/Rank Math prüfen:
   - [ ] Meta-Titel übertragen
   - [ ] Meta-Beschreibungen übertragen
   - [ ] Focus Keywords gesetzt
   - [ ] Alle Seiten "grün"

2. Strukturierte Daten:
   - [ ] Schema-Markup funktioniert
   - Google Rich Results Test

3. Sitemap:
   - [ ] XML Sitemap generiert
   - [ ] Sitemap in Search Console eingereicht
```

#### Performance-Optimierung

**Caching einrichten**:
```
1. WP Rocket installieren (empfohlen, kostenpflichtig)
   ODER
   W3 Total Cache / WP Super Cache (kostenlos)

2. Konfigurieren:
   - [ ] Page Caching aktiviert
   - [ ] Browser Caching aktiviert
   - [ ] GZIP Compression aktiviert
   - [ ] Minification (HTML/CSS/JS)
```

**Bilder optimieren**:
```
1. ShortPixel oder Imagify installieren
2. Bestehende Bilder optimieren (Bulk-Optimize)
3. WebP-Konvertierung aktivieren
4. Lazy Loading prüfen (Core Feature ab WP 5.5)
```

**CSS/JS optimieren**:
```
1. Asset CleanUp Plugin:
   - Ungenutzte CSS/JS entfernen
   - Pro Seite individuell optimieren

2. Autoptimize:
   - CSS aggregieren
   - JS aggregieren
   - Critical CSS (advanced)
```

**Performance-Tests**:
```
Vorher/Nachher vergleichen:
- [ ] GTmetrix
- [ ] PageSpeed Insights
- [ ] Pingdom
- [ ] WebPageTest

Ziel:
- Performance Score > 90%
- Ladezeit < 2 Sekunden
- First Contentful Paint < 1 Sekunde
```

### Tag 3: Elementor entfernen

**NUR wenn 100% fertig!**

#### Vorsichtig vorgehen:

1. **Finaler Check**:
   ```
   - [ ] ALLE Seiten migriert
   - [ ] ALLE Tests bestanden
   - [ ] Backup erstellt (CRITICAL!)
   - [ ] Rollback-Plan bereit
   ```

2. **Elementor deaktivieren** (NICHT löschen):
   ```
   Plugins → Elementor → Deaktivieren
   Plugins → Elementor Pro → Deaktivieren (falls vorhanden)
   ```

3. **Website komplett testen**:
   ```
   - Alle Seiten durchklicken
   - Formulare testen
   - Checkout testen (falls E-Commerce)
   - Keine Fehler?
   ```

4. **Falls alles funktioniert**:
   ```
   Plugins → Elementor → Löschen

   ACHTUNG: Löscht alle Elementor-Daten!
   Nur löschen wenn 100% sicher!
   ```

5. **Datenbank bereinigen**:
   ```
   Plugin: WP-Optimize oder Advanced Database Cleaner
   - Elementor-Metadaten entfernen
   - Verwaiste Daten löschen
   - Datenbank optimieren
   ```

### Tag 4: Vorbereitung Live-Migration

#### Pre-Launch Checklist

```
- [ ] Alle Funktionen auf Staging getestet
- [ ] Performance-Ziele erreicht
- [ ] SEO-Daten vollständig
- [ ] Formulare funktionieren
- [ ] Analytics funktioniert
- [ ] Backup der Live-Site erstellt
- [ ] Rollback-Plan dokumentiert
- [ ] Downtime-Fenster geplant
- [ ] Stakeholder informiert
```

#### Live-Site Backup

```
1. Komplettes Backup der Live-Site:
   - Dateien
   - Datenbank
   - Lokal herunterladen
   - Verifizieren

2. DNS TTL reduzieren (24h vorher):
   - Falls Domain-Wechsel geplant
   - TTL auf 300 (5 Min) setzen
```

### Tag 5: Live-Migration

#### Migrations-Methode wählen

**Option A: Plugin-Migration** (einfacher, empfohlen)

```
1. "All-in-One WP Migration" (Pro für große Sites)
   - Staging: Export erstellen
   - Live-Site: Import durchführen
   - URLs werden automatisch ersetzt

2. "Duplicator Pro"
   - Staging: Package erstellen
   - Live: Installer hochladen und ausführen

3. "WP Staging Pro"
   - Push-Funktion nutzen
   - Staging → Live
```

**Option B: Manuelle Migration** (volle Kontrolle)

```
1. Wartungsmodus aktivieren (Live-Site):
   Plugin: WP Maintenance Mode

2. Dateien synchronisieren:
   - Via FTP/SFTP
   - Oder: rsync (wenn SSH-Zugang)
   - wp-content/ übertragen
   - Neue Theme/Plugin-Dateien

3. Datenbank migrieren:
   - Staging DB exportieren (phpMyAdmin)
   - URLs mit Search & Replace ersetzen:
     staging.domain.de → www.domain.de
   - Live-DB importieren

4. wp-config.php prüfen:
   - Datenbank-Zugangsdaten korrekt
   - Sicherheitsschlüssel aktualisiert

5. .htaccess prüfen

6. Permalinks neu generieren:
   Einstellungen → Permalinks → Speichern

7. Cache leeren (alle!):
   - Server-Cache
   - Plugin-Cache
   - CDN-Cache (falls vorhanden)
   - Browser-Cache

8. Wartungsmodus deaktivieren
```

#### Post-Launch Tests

**Sofort nach Live-Schaltung**:
```
- [ ] Homepage lädt
- [ ] Alle Hauptseiten erreichbar
- [ ] Login funktioniert
- [ ] Formulare funktionieren
- [ ] Keine JavaScript-Fehler (Console prüfen)
- [ ] Keine 404-Fehler
- [ ] Mobile Ansicht OK
```

**Innerhalb 1 Stunde**:
```
- [ ] Alle Seiten stichprobenartig prüfen
- [ ] Performance-Test durchführen
- [ ] Analytics trackt
- [ ] Search Console prüfen
- [ ] Kontaktformular test-email senden
```

**Innerhalb 24 Stunden**:
```
- [ ] Alle Seiten detailliert prüfen
- [ ] User-Feedback einholen
- [ ] Error-Logs prüfen
- [ ] Traffic-Entwicklung monitoren
```

#### Monitoring (Woche nach Launch)

```
Täglich prüfen:
- [ ] Google Analytics: Traffic normal?
- [ ] Search Console: Keine kritischen Fehler?
- [ ] Server Error Logs: Keine Fehler?
- [ ] Kontaktformular: Anfragen kommen an?

Wöchentlich:
- [ ] Rankings prüfen: Stabil?
- [ ] Performance-Tests: Stabil?
- [ ] User-Feedback: Positiv?
```

---

## Rollback-Plan

Falls etwas schief geht:

### Sofortiger Rollback (< 1 Stunde)

```
1. Wartungsmodus aktivieren

2. Backup wiederherstellen:
   - Via Hosting Control Panel
   - Oder via Backup-Plugin

3. DNS zurücksetzen (falls geändert)

4. Cache leeren

5. Testen

6. Wartungsmodus deaktivieren

7. Post-Mortem: Was ist schief gelaufen?
```

### Teilweiser Rollback

```
Falls nur bestimmte Seiten Probleme haben:
1. Elementor NICHT löschen
2. Alte Seiten wieder aktivieren
3. Problematische neue Seiten deaktivieren
4. Zeit nehmen, Fehler zu beheben
5. Später erneut versuchen
```

---

## Erfolgs-Metriken

### Technische Metriken

```
Vorher → Nachher Vergleich:

Performance:
- GTmetrix Score: ___ → ___
- Ladezeit: ___ s → ___ s
- Seitengröße: ___ MB → ___ MB
- Requests: ___ → ___

SEO:
- PageSpeed Score (Mobile): ___ → ___
- PageSpeed Score (Desktop): ___ → ___
- Indexed Pages: ___ → ___ (sollte gleich bleiben)
```

### Business-Metriken

```
4 Wochen nach Launch:
- Organic Traffic: ___ → ___
- Bounce Rate: ___ → ___
- Avg. Session Duration: ___ → ___
- Conversion Rate: ___ → ___
- Lead-Generierung: ___ → ___
```

---

## Abschluss-Checklist

- [ ] Alle Seiten migriert
- [ ] Elementor entfernt
- [ ] Performance optimiert
- [ ] SEO unverändert/verbessert
- [ ] Live-Site funktioniert einwandfrei
- [ ] Monitoring eingerichtet
- [ ] Team trainiert (Block-Editor)
- [ ] Dokumentation aktualisiert
- [ ] Erfolgs-Report erstellt

---

## Nach der Migration

### Laufende Wartung

```
Monatlich:
- [ ] WordPress Core Updates
- [ ] Plugin Updates
- [ ] Theme Updates
- [ ] Performance-Check
- [ ] Security-Scan

Quartalsweise:
- [ ] Backup-Strategie reviewen
- [ ] Performance-Optimierung
- [ ] Content-Audit
- [ ] SEO-Review
```

### Weiterbildung

```
Team schulen:
- Gutenberg Editor Basics
- Kadence Blocks Features
- Wiederverwendbare Blöcke nutzen
- Performance Best Practices
- SEO mit Blocks
```

---

## Hilfe & Ressourcen

### Bei Problemen

1. **WordPress Support Forums**: https://wordpress.org/support/
2. **Kadence Support**: https://www.kadencewp.com/support/
3. **GeneratePress Forum**: https://generatepress.com/forums/
4. **Facebook Gruppen**: "WordPress Gutenberg Users"
5. **YouTube**: Tutorials zu spezifischen Problemen

### Professionelle Hilfe

Falls Sie professionelle Unterstützung benötigen:
- WordPress-Entwickler auf Upwork/Fiverr
- Lokale WordPress-Agenturen
- Freelancer spezialisiert auf Block-Theme-Entwicklung

---

**Viel Erfolg bei Ihrer Migration!**

Dieses Dokument regelmäßig aktualisieren mit Learnings und Fortschritt.

---

**Version**: 1.0
**Letzte Aktualisierung**: Oktober 2024
**Für**: fahrzeugelektronik-service.de
