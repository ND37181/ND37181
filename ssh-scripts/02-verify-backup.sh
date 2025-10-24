#!/bin/bash
# Script 2: Backup verifizieren
# Prüft ob ein aktuelles Backup vorhanden ist

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

log_info "========================================"
log_info "Backup-Verifikation"
log_info "========================================"
echo ""

# Lokales Backup-Verzeichnis erstellen
mkdir -p "$LOCAL_BACKUP_DIR"

log_info "1. Nach Backups auf dem Server suchen..."
echo ""

# Prüfe verschiedene mögliche Backup-Orte
BACKUP_LOCATIONS=(
    "$WP_PATH/wp-content/backups"
    "$WP_PATH/backups"
    "backups"
    "backup"
)

FOUND_BACKUPS=0

for location in "${BACKUP_LOCATIONS[@]}"; do
    log_info "Prüfe: $location"
    BACKUP_FILES=$(ssh_exec "ls -lh $location 2>/dev/null || echo 'Nicht gefunden'")

    if [ "$BACKUP_FILES" != "Nicht gefunden" ]; then
        log_success "Backup-Dateien gefunden in: $location"
        echo "$BACKUP_FILES"
        FOUND_BACKUPS=1
        echo ""
    fi
done

if [ $FOUND_BACKUPS -eq 0 ]; then
    log_warning "Keine automatischen Backups auf dem Server gefunden"
    echo ""
fi

# Prüfe Backup-Plugins
log_info "2. Backup-Plugins prüfen..."
echo ""

BACKUP_PLUGINS=("updraftplus" "backwpup" "all-in-one-wp-migration" "duplicator")

for plugin in "${BACKUP_PLUGINS[@]}"; do
    if wp_cli "plugin is-installed $plugin" > /dev/null 2>&1; then
        PLUGIN_STATUS=$(wp_cli "plugin get $plugin --field=status")
        if [ "$PLUGIN_STATUS" == "active" ]; then
            log_success "$plugin ist installiert und aktiv"

            case $plugin in
                "updraftplus")
                    log_info "UpdraftPlus Backup-Verzeichnis: $WP_PATH/wp-content/updraft"
                    UPDRAFT_BACKUPS=$(ssh_exec "ls -lh $WP_PATH/wp-content/updraft 2>/dev/null || echo 'Leer'")
                    echo "$UPDRAFT_BACKUPS"
                    ;;
                "backwpup")
                    log_info "BackWPup Backup-Verzeichnis: $WP_PATH/wp-content/uploads/backwpup-*"
                    ;;
                "all-in-one-wp-migration")
                    log_info "All-in-One Backup-Verzeichnis: $WP_PATH/wp-content/ai1wm-backups"
                    ;;
            esac
        else
            log_info "$plugin ist installiert aber inaktiv"
        fi
    fi
done
echo ""

# Empfehlung
log_info "========================================"
log_info "EMPFEHLUNG"
log_info "========================================"
echo ""

log_warning "WICHTIG: Vor der Migration muss ein vollständiges Backup existieren!"
echo ""
echo "Haben Sie bereits ein Backup? (Sie sagten: JA)"
echo ""
echo "Bitte verifizieren Sie:"
echo "  1. Backup-Datum ist aktuell (heute oder gestern)"
echo "  2. Backup enthält Dateien UND Datenbank"
echo "  3. Backup-Größe ist plausibel (mehrere GB erwartet)"
echo ""

log_info "Falls KEIN Backup vorhanden:"
echo "  → Führen Sie Script 03-create-backup.sh aus"
echo ""

log_info "Falls Backup vorhanden:"
echo "  → Fahren Sie mit Script 04-setup-staging.sh fort"
echo ""

# Interaktive Bestätigung
read -p "Haben Sie ein aktuelles, vollständiges Backup? (ja/nein): " backup_confirmed

if [ "$backup_confirmed" != "ja" ] && [ "$backup_confirmed" != "j" ]; then
    log_error "Bitte erstellen Sie zuerst ein Backup!"
    log_info "Führen Sie aus: ./03-create-backup.sh"
    exit 1
fi

log_success "Backup bestätigt - Sie können fortfahren"
