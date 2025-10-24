#!/bin/bash
# SSH Configuration für fahrzeugelektronik-service.de
# WICHTIG: Diese Datei enthält sensible Daten - NICHT in Git committen!
#
# VERWENDUNG:
# 1. Kopieren Sie diese Datei: cp config-EXAMPLE.sh config.sh
# 2. Passen Sie die Zugangsdaten an
# 3. config.sh ist in .gitignore und wird nicht committed

# SSH-Zugangsdaten
SSH_HOST="ssh.strato.de"
SSH_PORT="22"
SSH_USER="56927191.swh.strato-hosting.eu"
SSH_PASS="hgFMK82B3zsUSi-"  # ÄNDERN SIE DIES, falls Passwort anders ist

# WordPress-Pfade
WP_PATH="STRATO-apps/wordpress_02/app"
WP_ADMIN_URL="https://fahrzeugelektronik-service.de/wp-admin"
WP_SITE_URL="https://fahrzeugelektronik-service.de"

# Lokale Pfade
LOCAL_BACKUP_DIR="$HOME/fahrzeugelektronik-backups"
LOCAL_WORK_DIR="$HOME/fahrzeugelektronik-migration"

# Farben für Output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Hilfsfunktionen
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# SSH-Befehl ausführen
ssh_exec() {
    sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "$1"
}

# Datei vom Server herunterladen
ssh_download() {
    local remote_path="$1"
    local local_path="$2"
    sshpass -p "$SSH_PASS" scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -P "$SSH_PORT" "$SSH_USER@$SSH_HOST:$remote_path" "$local_path"
}

# Datei auf Server hochladen
ssh_upload() {
    local local_path="$1"
    local remote_path="$2"
    sshpass -p "$SSH_PASS" scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -P "$SSH_PORT" "$local_path" "$SSH_USER@$SSH_HOST:$remote_path"
}

# WP-CLI Befehl ausführen
wp_cli() {
    ssh_exec "cd $WP_PATH && wp $1"
}
