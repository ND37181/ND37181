#!/bin/bash
# Script 3: Backup erstellen
# Erstellt ein vollständiges Backup der WordPress-Installation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/config.sh"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="fahrzeugelektronik-backup-$TIMESTAMP"

log_info "========================================"
log_info "Backup erstellen"
log_info "========================================"
echo ""

log_warning "ACHTUNG: Backup-Erstellung kann 30-60 Minuten dauern!"
log_warning "Je nach Größe der Website kann dies länger dauern."
echo ""

read -p "Backup jetzt erstellen? (ja/nein): " confirm
if [ "$confirm" != "ja" ] && [ "$confirm" != "j" ]; then
    log_info "Backup abgebrochen"
    exit 0
fi

# Lokales Backup-Verzeichnis erstellen
mkdir -p "$LOCAL_BACKUP_DIR/$BACKUP_NAME"

log_info "Backup wird gespeichert in: $LOCAL_BACKUP_DIR/$BACKUP_NAME"
echo ""

# 1. Datenbank-Backup
log_info "1. Datenbank exportieren..."
log_info "Dies kann einige Minuten dauern..."

DB_BACKUP_FILE="database-$TIMESTAMP.sql.gz"

wp_cli "db export - | gzip > /tmp/$DB_BACKUP_FILE"

if [ $? -eq 0 ]; then
    log_success "Datenbank exportiert"

    # Datenbank herunterladen
    log_info "Datenbank wird heruntergeladen..."
    ssh_download "/tmp/$DB_BACKUP_FILE" "$LOCAL_BACKUP_DIR/$BACKUP_NAME/$DB_BACKUP_FILE"

    # Auf Server löschen
    ssh_exec "rm /tmp/$DB_BACKUP_FILE"

    log_success "Datenbank-Backup gespeichert: $DB_BACKUP_FILE"
else
    log_error "Datenbank-Export fehlgeschlagen"
    exit 1
fi
echo ""

# 2. Dateien-Backup
log_info "2. WordPress-Dateien sichern..."
log_info "Dies kann 15-30 Minuten dauern..."

# Temporäres Archiv auf dem Server erstellen
TEMP_ARCHIVE="/tmp/wordpress-files-$TIMESTAMP.tar.gz"

log_info "Erstelle Archiv auf dem Server..."
ssh_exec "cd $WP_PATH && tar -czf $TEMP_ARCHIVE \
    --exclude='wp-content/cache' \
    --exclude='wp-content/backup*' \
    --exclude='wp-content/updraft' \
    --exclude='wp-content/ai1wm-backups' \
    ."

if [ $? -eq 0 ]; then
    log_success "Archiv erstellt"

    # Archiv herunterladen
    log_info "Archiv wird heruntergeladen (kann lange dauern)..."
    ssh_download "$TEMP_ARCHIVE" "$LOCAL_BACKUP_DIR/$BACKUP_NAME/wordpress-files-$TIMESTAMP.tar.gz"

    # Auf Server löschen
    ssh_exec "rm $TEMP_ARCHIVE"

    log_success "Dateien-Backup gespeichert"
else
    log_error "Archiv-Erstellung fehlgeschlagen"
    exit 1
fi
echo ""

# 3. Wichtige Konfigurationsdateien separat sichern
log_info "3. Konfigurationsdateien sichern..."

CONFIG_FILES=(
    "wp-config.php"
    ".htaccess"
)

for file in "${CONFIG_FILES[@]}"; do
    if ssh_exec "test -f $WP_PATH/$file" > /dev/null 2>&1; then
        ssh_download "$WP_PATH/$file" "$LOCAL_BACKUP_DIR/$BACKUP_NAME/$file"
        log_success "$file gesichert"
    fi
done
echo ""

# 4. Info-Datei erstellen
log_info "4. Backup-Info erstellen..."

cat > "$LOCAL_BACKUP_DIR/$BACKUP_NAME/BACKUP-INFO.txt" <<EOL
Backup-Informationen
===================

Erstellt: $(date)
Website: $WP_SITE_URL
WordPress-Pfad: $WP_PATH

Enthält:
- Datenbank: $DB_BACKUP_FILE
- WordPress-Dateien: wordpress-files-$TIMESTAMP.tar.gz
- Konfiguration: wp-config.php, .htaccess

Wiederherstellung:
1. Datenbank importieren
2. Dateien entpacken
3. wp-config.php anpassen
4. Permalinks neu generieren

WICHTIG: Dieses Backup an mehreren Orten speichern!
- Lokal: $LOCAL_BACKUP_DIR
- Cloud: Google Drive, Dropbox, etc.
- Externe Festplatte

Bei Fragen: Siehe Backup-and-Safety-Procedures.md
EOL

log_success "Backup-Info erstellt"
echo ""

# Backup-Größe anzeigen
BACKUP_SIZE=$(du -sh "$LOCAL_BACKUP_DIR/$BACKUP_NAME" | awk '{print $1}')

log_info "========================================"
log_success "BACKUP ERFOLGREICH ERSTELLT!"
log_info "========================================"
echo ""
echo "Backup-Verzeichnis: $LOCAL_BACKUP_DIR/$BACKUP_NAME"
echo "Backup-Größe: $BACKUP_SIZE"
echo ""
log_warning "WICHTIG: Kopieren Sie das Backup an einen sicheren Ort!"
echo ""
echo "Empfohlene nächste Schritte:"
echo "  1. Backup auf externe Festplatte kopieren"
echo "  2. Backup in Cloud hochladen (Google Drive, Dropbox)"
echo "  3. Backup-Wiederherstellung testen (optional aber empfohlen)"
echo ""
log_info "Nächstes Script: ./04-setup-staging.sh"
