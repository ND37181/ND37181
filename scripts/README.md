# Helper Scripts für Elementor zu Blocks Migration

Diese Skripte und Tools helfen Ihnen bei der Migration von Elementor zu WordPress Gutenberg Blocks.

---

## Übersicht der Tools

### 1. Widget Mapping (widget-mapping.json)

**Beschreibung**: JSON-Datei mit vollständiger Zuordnung von Elementor-Widgets zu Gutenberg-Blocks.

**Verwendung**:
- Als Referenz beim Nachbauen von Seiten
- Zeigt benötigte Plugins
- Enthält alternative Lösungen

**Öffnen mit**:
- Texteditor (VS Code, Notepad++)
- Browser (für formatierte Ansicht)
- JSON-Viewer Online

**Hauptkategorien**:
- Basis-Widgets (Heading, Text, Button, etc.)
- Layout-Elemente (Section, Column, etc.)
- Erweiterte Widgets (Accordion, Tabs, Forms, etc.)
- Erforderliche Plugins mit URLs

---

### 2. Migration Tracker (migration-tracker.html)

**Beschreibung**: Interaktive HTML-Anwendung zum Tracking des Migrations-Fortschritts.

**Features**:
- ✅ Visueller Fortschrittsbalken
- ✅ Statistiken (Gesamt, Ausstehend, In Arbeit, Fertig)
- ✅ Tabelle aller zu migrierenden Seiten
- ✅ Status-Tracking pro Seite
- ✅ Prioritäten und Komplexität
- ✅ Notizen-Feld
- ✅ Export als JSON oder CSV
- ✅ Daten werden im Browser gespeichert (localStorage)

**Verwendung**:
```bash
# Einfach im Browser öffnen:
# Doppelklick auf migration-tracker.html

# Oder über Kommandozeile:
# Windows:
start scripts/migration-tracker.html

# Mac:
open scripts/migration-tracker.html

# Linux:
xdg-open scripts/migration-tracker.html
```

**Workflow**:
1. Tracker im Browser öffnen
2. Alle zu migrierenden Seiten eintragen
3. Während der Migration Status aktualisieren
4. Notizen zu Besonderheiten hinzufügen
5. Regelmäßig als JSON/CSV exportieren (Backup!)

**Tipp**: Lassen Sie den Tracker während der gesamten Migration geöffnet!

---

## Zusätzliche Ressourcen

### Empfohlene Browser-Extensions

**Für Chrome/Edge**:
- WhatFont - Schriftarten identifizieren
- ColorZilla - Farben extrahieren
- Responsive Viewer - Multi-Device-Vorschau
- Window Resizer - Schnelle Größenanpassung

**Für Firefox**:
- Fonts Ninja - Schriftarten-Inspektion
- ColorZilla - Farben extrahieren
- Responsive Design Mode (integriert)

---

## Verwendungsbeispiel: Kompletter Workflow

### Tag 1: Setup

```bash
1. Migration Tracker öffnen
   → Alle Seiten von WordPress-Admin in Tracker eintragen

2. Widget Mapping öffnen
   → Durchlesen und mit eigener Site abgleichen

3. Benötigte Plugins installieren
   → Siehe widget-mapping.json → "required_plugins"
```

### Tag 2-X: Migration

```bash
Für jede Seite:

1. Im Tracker Status auf "In Arbeit" setzen

2. Elementor-Seite öffnen
   → Widget-Liste erstellen

3. widget-mapping.json konsultieren
   → Passende Gutenberg-Blocks finden

4. Im Block-Editor nachbauen
   → Block für Block übertragen

5. Vergleichen und testen
   → Desktop, Tablet, Mobile

6. Im Tracker:
   → Status auf "Fertig" setzen
   → Notizen hinzufügen (z.B. "Spacing angepasst")

7. Tracker-Daten exportieren (Ende des Tages)
```

---

## Tipps für effiziente Nutzung

### Migration Tracker

**Best Practices**:
- Exportieren Sie täglich Ihre Daten als Backup
- Nutzen Sie das Notizen-Feld ausgiebig
- Sortieren Sie Seiten nach Priorität
- Markieren Sie komplexe Seiten für später

**Prioritäten setzen**:
- **Hoch**: Homepage, wichtige Landingpages
- **Mittel**: Standard-Seiten (Über uns, Services, etc.)
- **Niedrig**: Impressum, Datenschutz, Footer-Seiten

**Komplexität bewerten**:
- **Einfach**: 1-5 Widgets, keine Sonderfeatures
- **Mittel**: 5-15 Widgets, Standard-Layouts
- **Komplex**: 15+ Widgets, Custom CSS/JS, Animationen

---

## Troubleshooting

### Migration Tracker: Daten gehen verloren

**Problem**: Daten sind plötzlich weg.

**Ursache**: Browser-Cache gelöscht oder anderer Browser verwendet.

**Lösung**:
- Regelmäßig als JSON exportieren
- JSON-Backup bei Bedarf manuell in localStorage importieren
- Oder: Seiten aus CSV neu importieren (manuell)

**Prävention**:
- Täglicher Export als Backup
- Immer denselben Browser verwenden
- Evtl. Lesezeichen setzen mit Browser-Session

---

### Widget Mapping: Widget nicht gefunden

**Problem**: Elementor-Widget hat keine Entsprechung in der Mapping-Datei.

**Lösung**:
1. WordPress Plugin-Verzeichnis durchsuchen:
   ```
   https://wordpress.org/plugins/
   Suchbegriff: "[Widget-Name] gutenberg block"
   ```

2. Kadence/Spectra Dokumentation:
   - https://www.kadencewp.com/kadence-blocks/
   - https://wpspectra.com/blocks/

3. Als Custom-Lösung nachbauen:
   - Mit Columns/Groups kombinieren
   - Mit Custom CSS stylen

4. Mapping-Datei erweitern:
   - Eigene Lösung dokumentieren
   - Für spätere Referenz

---

## Weitere Skripte (Optional)

### Custom CSS Extractor (Manuell)

**Ziel**: Elementor Custom CSS extrahieren.

**Prozess**:
```
1. Elementor → Tools → Custom CSS (falls vorhanden)
2. Kompletten CSS-Code kopieren
3. In separatem .css File speichern
4. In WordPress Customizer einfügen:
   Design → Customizer → Zusätzliches CSS
```

### Database Search & Replace (Vorsicht!)

**Nur bei Experten**: URLs in Datenbank ersetzen.

**Tool**: Better Search Replace Plugin
```
WordPress Admin:
→ Better Search Replace Plugin installieren
→ Tools → Better Search Replace
→ Search for: staging.domain.de
→ Replace with: www.domain.de
→ Select tables: wp_*
→ ☑ Do a dry run (zum Testen!)
→ Run Search/Replace
```

---

## Support & Fragen

Falls Sie Fragen zu diesen Scripts haben:

1. **Dokumentation nochmal lesen**:
   - ELEMENTOR_TO_BLOCKS_MIGRATION.md
   - Migration-Workflow.md

2. **WordPress-Community**:
   - WordPress.org Support Forums
   - Facebook-Gruppen
   - Reddit r/WordPress

3. **Plugin-Support**:
   - Kadence Support
   - Spectra Support

---

## Changelog

**Version 1.0** (2024-10-24):
- Initiales Release
- Widget Mapping mit 25+ Widgets
- Migration Tracker mit allen Features
- Vollständige Dokumentation

---

**Viel Erfolg bei Ihrer Migration!**
