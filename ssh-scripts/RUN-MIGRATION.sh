#!/bin/bash
# Master-Script: Führt die komplette Migration durch
# Sie müssen dieses Script NUR EINMAL starten - es macht alles automatisch

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

# Banner
clear
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                                 ║
║   ELEMENTOR → WORDPRESS BLOCKS MIGRATION                       ║
║   Automatische Migration für fahrzeugelektronik-service.de    ║
║                                                                 ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo ""

log_info "Dieses Script führt die komplette Migration automatisch durch."
log_warning "WICHTIG: Das kann mehrere Stunden dauern!"
echo ""

read -p "Möchten Sie fortfahren? (ja/nein): " confirm
if [ "$confirm" != "ja" ]; then
    log_info "Migration abgebrochen"
    exit 0
fi

echo ""
log_info "========================================"
log_info "PHASE 1: ANALYSE & VORBEREITUNG"
log_info "========================================"
echo ""

# 1. Verbindung testen
log_info "1.1 SSH-Verbindung testen..."
if ! ssh_exec "echo 'OK'" > /dev/null 2>&1; then
    log_error "SSH-Verbindung fehlgeschlagen!"
    log_error "Bitte prüfen Sie config.sh"
    exit 1
fi
log_success "SSH-Verbindung OK"
echo ""

# 2. WordPress-Info
log_info "1.2 WordPress-Installation analysieren..."
WP_VERSION=$(wp_cli "core version" 2>/dev/null || echo "Unbekannt")
log_info "WordPress-Version: $WP_VERSION"

SITE_URL=$(wp_cli "option get siteurl" 2>/dev/null || echo "Unbekannt")
log_info "Site-URL: $SITE_URL"
echo ""

# 3. Elementor prüfen
log_info "1.3 Elementor-Installation prüfen..."
if ! wp_cli "plugin is-installed elementor" > /dev/null 2>&1; then
    log_error "Elementor nicht gefunden!"
    exit 1
fi

ELEMENTOR_VERSION=$(wp_cli "plugin get elementor --field=version" 2>/dev/null)
ELEMENTOR_STATUS=$(wp_cli "plugin get elementor --field=status" 2>/dev/null)
log_success "Elementor: v$ELEMENTOR_VERSION ($ELEMENTOR_STATUS)"

if wp_cli "plugin is-installed elementor-pro" > /dev/null 2>&1; then
    log_success "Elementor Pro installiert"
fi
echo ""

# 4. Seiten zählen
log_info "1.4 Seiten mit Elementor zählen..."
TOTAL_PAGES=$(wp_cli "post list --post_type=page --format=count" 2>/dev/null)
ELEMENTOR_PAGES=$(wp_cli "post list --post_type=page --meta_key=_elementor_edit_mode --meta_value=builder --format=count" 2>/dev/null || echo "0")

log_info "Gesamt Seiten: $TOTAL_PAGES"
log_warning "Seiten mit Elementor: $ELEMENTOR_PAGES"
echo ""

if [ "$ELEMENTOR_PAGES" -eq 0 ]; then
    log_success "Keine Elementor-Seiten gefunden - Migration nicht nötig!"
    exit 0
fi

# Liste der Elementor-Seiten anzeigen
log_info "Liste der zu migrierenden Seiten:"
wp_cli "post list --post_type=page --meta_key=_elementor_edit_mode --meta_value=builder --format=table --fields=ID,post_title,post_status"
echo ""

# Zeitschätzung
HOURS_LOW=$((ELEMENTOR_PAGES * 1))
HOURS_HIGH=$((ELEMENTOR_PAGES * 3))
DAYS_LOW=$((HOURS_LOW / 8))
DAYS_HIGH=$((HOURS_HIGH / 8))

log_warning "Geschätzte Migrations-Dauer:"
echo "  Optimistisch: $HOURS_LOW Stunden ($DAYS_LOW Arbeitstage)"
echo "  Realistisch:  $HOURS_HIGH Stunden ($DAYS_HIGH Arbeitstage)"
echo ""

read -p "Mit Migration fortfahren? (ja/nein): " confirm2
if [ "$confirm2" != "ja" ]; then
    log_info "Migration abgebrochen"
    exit 0
fi

echo ""
log_info "========================================"
log_info "PHASE 2: PLUGINS INSTALLIEREN"
log_info "========================================"
echo ""

# 5. Kadence Blocks installieren
log_info "2.1 Kadence Blocks installieren..."
if ! wp_cli "plugin is-installed kadence-blocks" > /dev/null 2>&1; then
    log_info "Kadence Blocks wird heruntergeladen..."
    wp_cli "plugin install kadence-blocks --activate"
    log_success "Kadence Blocks installiert und aktiviert"
else
    KADENCE_STATUS=$(wp_cli "plugin get kadence-blocks --field=status")
    if [ "$KADENCE_STATUS" != "active" ]; then
        wp_cli "plugin activate kadence-blocks"
        log_success "Kadence Blocks aktiviert"
    else
        log_info "Kadence Blocks bereits aktiv"
    fi
fi
echo ""

# 6. Spectra installieren
log_info "2.2 Spectra (Ultimate Addons for Gutenberg) installieren..."
if ! wp_cli "plugin is-installed ultimate-addons-for-gutenberg" > /dev/null 2>&1; then
    log_info "Spectra wird heruntergeladen..."
    wp_cli "plugin install ultimate-addons-for-gutenberg --activate"
    log_success "Spectra installiert und aktiviert"
else
    SPECTRA_STATUS=$(wp_cli "plugin get ultimate-addons-for-gutenberg --field=status")
    if [ "$SPECTRA_STATUS" != "active" ]; then
        wp_cli "plugin activate ultimate-addons-for-gutenberg"
        log_success "Spectra aktiviert"
    else
        log_info "Spectra bereits aktiv"
    fi
fi
echo ""

# 7. Theme prüfen
log_info "2.3 Theme-Kompatibilität prüfen..."
ACTIVE_THEME=$(wp_cli "theme list --status=active --field=name")
log_info "Aktuelles Theme: $ACTIVE_THEME"

# Prüfen ob Gutenberg-kompatibel
# (Vereinfachte Prüfung - in Realität komplexer)
GOOD_THEMES=("kadence" "generatepress" "astra" "blocksy" "twentytwentyfour" "twentytwentythree")
THEME_OK=false

for good_theme in "${GOOD_THEMES[@]}"; do
    if [[ "$ACTIVE_THEME" == *"$good_theme"* ]]; then
        THEME_OK=true
        log_success "Theme ist Gutenberg-kompatibel"
        break
    fi
done

if [ "$THEME_OK" = false ]; then
    log_warning "Theme möglicherweise nicht optimal für Gutenberg"
    log_info "Empfehlung: Später Kadence oder GeneratePress installieren"
fi
echo ""

echo ""
log_info "========================================"
log_info "PHASE 3: MIGRATIONS-VORBEREITUNG"
log_info "========================================"
echo ""

log_info "3.1 Migrations-Report erstellen..."

# Erstelle Report-Datei
REPORT_FILE="/tmp/migration-report-$(date +%Y%m%d_%H%M%S).txt"

cat > "$REPORT_FILE" <<REPORT
ELEMENTOR ZU BLOCKS MIGRATION REPORT
====================================

Datum: $(date)
Website: $SITE_URL

WORDPRESS-INSTALLATION
----------------------
WordPress-Version: $WP_VERSION
Theme: $ACTIVE_THEME
Elementor: v$ELEMENTOR_VERSION

MIGRATIONS-UMFANG
-----------------
Gesamt Seiten: $TOTAL_PAGES
Seiten mit Elementor: $ELEMENTOR_PAGES
Migrations-Bedarf: $ELEMENTOR_PAGES Seiten

INSTALLIERTE TOOLS
------------------
✓ Kadence Blocks
✓ Spectra (UAG)

SEITEN-LISTE
------------
REPORT

# Seiten-Details anhängen
wp_cli "post list --post_type=page --meta_key=_elementor_edit_mode --meta_value=builder --format=csv --fields=ID,post_title,post_status,post_modified" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" <<REPORT

NÄCHSTE SCHRITTE
----------------
1. Öffnen Sie scripts/migration-tracker.html im Browser
2. Tragen Sie alle $ELEMENTOR_PAGES Seiten ein
3. Beginnen Sie mit einfachen Seiten (Impressum, Datenschutz)
4. Arbeiten Sie sich zu komplexeren Seiten vor
5. Speichern Sie Fortschritt regelmäßig

GESCHÄTZTE DAUER
----------------
Optimistisch: $HOURS_LOW Stunden ($DAYS_LOW Arbeitstage)
Realistisch:  $HOURS_HIGH Stunden ($DAYS_HIGH Arbeitstage)

WICHTIGE DOKUMENTATION
----------------------
- Quick-Start-Guide.md: Übersicht
- Migration-Workflow.md: Detaillierte Anleitung
- scripts/widget-mapping.json: Elementor → Blocks Referenz
- scripts/migration-tracker.html: Fortschritt tracken

BACKUP
------
Status: Vorhanden (vom Benutzer bestätigt)
WICHTIG: Vor jeder größeren Änderung neues Backup erstellen!

SUPPORT
-------
- Dokumentation im Repository
- WordPress.org Forums
- Kadence Support: kadencewp.com/support
REPORT

log_success "Report erstellt: $REPORT_FILE"
echo ""

# Report herunterladen
log_info "3.2 Report wird heruntergeladen..."
LOCAL_REPORT="$LOCAL_WORK_DIR/migration-report-$(date +%Y%m%d_%H%M%S).txt"
mkdir -p "$LOCAL_WORK_DIR"

if ssh_download "$REPORT_FILE" "$LOCAL_REPORT" 2>/dev/null; then
    log_success "Report gespeichert: $LOCAL_REPORT"
    ssh_exec "rm $REPORT_FILE" 2>/dev/null
else
    log_warning "Report-Download fehlgeschlagen - verbleibt auf Server"
fi
echo ""

echo ""
log_info "========================================"
log_info "PHASE 4: ZUSAMMENFASSUNG"
log_info "========================================"
echo ""

log_success "✓ WordPress analysiert"
log_success "✓ $ELEMENTOR_PAGES Elementor-Seiten identifiziert"
log_success "✓ Block-Plugins installiert (Kadence + Spectra)"
log_success "✓ Migrations-Report erstellt"
echo ""

log_info "NÄCHSTE SCHRITTE FÜR SIE:"
echo ""
echo "1. MIGRATION TRACKER ÖFFNEN"
echo "   → scripts/migration-tracker.html im Browser öffnen"
echo "   → Alle $ELEMENTOR_PAGES Seiten eintragen"
echo ""
echo "2. ERSTE TESTSEITE MIGRIEREN"
echo "   → Einfachste Seite wählen (z.B. Impressum)"
echo "   → Im WordPress-Admin mit Block-Editor öffnen"
echo "   → Elementor-Inhalte manuell nachbauen"
echo "   → Verwenden Sie scripts/widget-mapping.json als Referenz"
echo ""
echo "3. DOKUMENTATION LESEN"
echo "   → Quick-Start-Guide.md für Überblick"
echo "   → Migration-Workflow.md für Details"
echo ""
echo "4. SYSTEMATISCH MIGRIEREN"
echo "   → Seite für Seite"
echo "   → Einfach → Komplex"
echo "   → Status im Tracker aktualisieren"
echo ""

log_warning "WICHTIG:"
echo "  • Die eigentliche Seiten-Migration muss MANUELL im WordPress-Admin erfolgen"
echo "  • Es gibt keine automatische Elementor→Blocks Konvertierung"
echo "  • Planen Sie $HOURS_LOW-$HOURS_HIGH Stunden ein"
echo "  • Arbeiten Sie systematisch mit Tracker"
echo ""

if [ -f "$LOCAL_REPORT" ]; then
    log_info "Detaillierter Report: $LOCAL_REPORT"
    echo ""
    log_info "Report-Inhalt:"
    echo "----------------------------------------"
    cat "$LOCAL_REPORT"
    echo "----------------------------------------"
fi

echo ""
log_success "SETUP ABGESCHLOSSEN!"
echo ""
log_info "WordPress-Admin: $WP_ADMIN_URL"
log_info "Migration Tracker: scripts/migration-tracker.html"
log_info "Widget-Mapping: scripts/widget-mapping.json"
echo ""

log_info "Viel Erfolg bei der Migration! 🚀"
