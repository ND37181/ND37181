#!/bin/bash
# Script 1: WordPress-Installation analysieren
# Dieses Script analysiert die aktuelle WordPress-Installation

set -e  # Bei Fehler abbrechen

# Config laden
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

log_info "========================================"
log_info "WordPress-Analyse: fahrzeugelektronik-service.de"
log_info "========================================"
echo ""

# 1. Verbindung testen
log_info "1. SSH-Verbindung testen..."
if ssh_exec "echo 'Verbindung erfolgreich'" > /dev/null 2>&1; then
    log_success "SSH-Verbindung erfolgreich"
else
    log_error "SSH-Verbindung fehlgeschlagen"
    log_error "Bitte prüfen Sie die Zugangsdaten in config.sh"
    exit 1
fi
echo ""

# 2. WordPress-Verzeichnis prüfen
log_info "2. WordPress-Verzeichnis prüfen..."
if ssh_exec "cd $WP_PATH && pwd" > /dev/null 2>&1; then
    WP_DIR=$(ssh_exec "cd $WP_PATH && pwd")
    log_success "WordPress-Verzeichnis gefunden: $WP_DIR"
else
    log_error "WordPress-Verzeichnis nicht gefunden: $WP_PATH"
    exit 1
fi
echo ""

# 3. WP-CLI verfügbar?
log_info "3. WP-CLI prüfen..."
if ssh_exec "cd $WP_PATH && wp --version" > /dev/null 2>&1; then
    WP_CLI_VERSION=$(ssh_exec "cd $WP_PATH && wp --version")
    log_success "WP-CLI verfügbar: $WP_CLI_VERSION"
else
    log_error "WP-CLI nicht verfügbar"
    log_warning "Installation ohne WP-CLI ist komplizierter"
    exit 1
fi
echo ""

# 4. WordPress-Version
log_info "4. WordPress-Version..."
WP_VERSION=$(wp_cli "core version")
log_info "WordPress-Version: $WP_VERSION"
echo ""

# 5. Installierte Plugins
log_info "5. Installierte Plugins analysieren..."
log_info "Aktive Plugins:"
wp_cli "plugin list --status=active --format=table"
echo ""

# 6. Elementor prüfen
log_info "6. Elementor-Installation prüfen..."
if wp_cli "plugin is-installed elementor" > /dev/null 2>&1; then
    ELEMENTOR_VERSION=$(wp_cli "plugin get elementor --field=version")
    ELEMENTOR_STATUS=$(wp_cli "plugin get elementor --field=status")
    log_success "Elementor installiert: Version $ELEMENTOR_VERSION (Status: $ELEMENTOR_STATUS)"

    # Elementor Pro?
    if wp_cli "plugin is-installed elementor-pro" > /dev/null 2>&1; then
        ELEMENTOR_PRO_VERSION=$(wp_cli "plugin get elementor-pro --field=version")
        ELEMENTOR_PRO_STATUS=$(wp_cli "plugin get elementor-pro --field=status")
        log_success "Elementor Pro installiert: Version $ELEMENTOR_PRO_VERSION (Status: $ELEMENTOR_PRO_STATUS)"
    else
        log_info "Elementor Pro nicht installiert"
    fi
else
    log_error "Elementor nicht gefunden!"
    log_warning "Migration möglicherweise nicht nötig?"
    exit 1
fi
echo ""

# 7. Theme
log_info "7. Aktives Theme..."
ACTIVE_THEME=$(wp_cli "theme list --status=active --field=name")
THEME_VERSION=$(wp_cli "theme get $ACTIVE_THEME --field=version")
log_info "Aktives Theme: $ACTIVE_THEME (Version: $THEME_VERSION)"
echo ""

# 8. Seiten mit Elementor zählen
log_info "8. Seiten mit Elementor analysieren..."
TOTAL_PAGES=$(wp_cli "post list --post_type=page --format=count")
log_info "Gesamt Seiten: $TOTAL_PAGES"

# Seiten mit Elementor-Metadaten (built with Elementor)
ELEMENTOR_PAGES=$(wp_cli "post list --post_type=page --meta_key=_elementor_edit_mode --meta_value=builder --format=count" || echo "0")
log_info "Seiten mit Elementor: $ELEMENTOR_PAGES"

if [ "$ELEMENTOR_PAGES" -gt 0 ]; then
    log_warning "Diese Seiten müssen migriert werden!"
    echo ""
    log_info "Liste der Elementor-Seiten:"
    wp_cli "post list --post_type=page --meta_key=_elementor_edit_mode --meta_value=builder --format=table --fields=ID,post_title,post_status,post_modified"
fi
echo ""

# 9. Blog-Posts mit Elementor
log_info "9. Blog-Posts analysieren..."
TOTAL_POSTS=$(wp_cli "post list --post_type=post --format=count")
log_info "Gesamt Posts: $TOTAL_POSTS"

ELEMENTOR_POSTS=$(wp_cli "post list --post_type=post --meta_key=_elementor_edit_mode --meta_value=builder --format=count" || echo "0")
log_info "Posts mit Elementor: $ELEMENTOR_POSTS"
echo ""

# 10. Datenbank-Größe
log_info "10. Datenbank-Größe..."
DB_SIZE=$(wp_cli "db size --human-readable")
log_info "Datenbank-Größe: $DB_SIZE"
echo ""

# 11. Upload-Ordner Größe
log_info "11. Upload-Ordner Größe..."
UPLOADS_SIZE=$(ssh_exec "du -sh $WP_PATH/wp-content/uploads" | awk '{print $1}')
log_info "Uploads-Größe: $UPLOADS_SIZE"
echo ""

# 12. Verfügbarer Speicherplatz
log_info "12. Verfügbarer Speicherplatz..."
DISK_USAGE=$(ssh_exec "df -h ." | tail -n 1)
log_info "Speicherplatz:"
echo "$DISK_USAGE"
echo ""

# Zusammenfassung
log_info "========================================"
log_info "ZUSAMMENFASSUNG"
log_info "========================================"
echo ""
echo "WordPress-Version: $WP_VERSION"
echo "Theme: $ACTIVE_THEME (v$THEME_VERSION)"
echo "Elementor: $ELEMENTOR_VERSION"
echo ""
echo "Zu migrierende Seiten: $ELEMENTOR_PAGES / $TOTAL_PAGES"
echo "Zu migrierende Posts: $ELEMENTOR_POSTS / $TOTAL_POSTS"
echo "GESAMT zu migrieren: $((ELEMENTOR_PAGES + ELEMENTOR_POSTS))"
echo ""
echo "Datenbank: $DB_SIZE"
echo "Uploads: $UPLOADS_SIZE"
echo ""

# Zeitschätzung
TOTAL_ITEMS=$((ELEMENTOR_PAGES + ELEMENTOR_POSTS))
HOURS_LOW=$((TOTAL_ITEMS * 1))
HOURS_HIGH=$((TOTAL_ITEMS * 3))

log_info "Geschätzte Migrations-Dauer:"
echo "  - Optimistisch: $HOURS_LOW Stunden ($((HOURS_LOW / 8)) Arbeitstage)"
echo "  - Realistisch: $HOURS_HIGH Stunden ($((HOURS_HIGH / 8)) Arbeitstage)"
echo ""

log_success "Analyse abgeschlossen!"
log_info "Nächster Schritt: ./02-verify-backup.sh ausführen"
