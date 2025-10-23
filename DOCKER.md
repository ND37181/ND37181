# 🐳 Docker Setup für Mitarbeiterunterweisung

Diese Anleitung zeigt, wie Sie die Anwendung mit Docker starten.

## Voraussetzungen

- Docker installiert: https://docs.docker.com/get-docker/
- Docker Compose installiert (meist in Docker Desktop enthalten)

## 🚀 Schnellstart

### 1. Repository klonen oder Dateien herunterladen

```bash
git clone https://github.com/ND37181/ND37181.git
cd ND37181
git checkout claude/improve-employee-training-app-011CUQ6UHc1zNZSnbt5bjakG
```

### 2. Container starten

```bash
docker-compose up -d
```

Das war's! Die Anwendung läuft jetzt.

### 3. PocketBase konfigurieren

**Erster Start - Admin-Account erstellen:**

1. Öffnen Sie: http://localhost:8090/_/
2. Erstellen Sie einen Admin-Account für PocketBase
3. Gehen Sie zu **Settings → Import collections**
4. Laden Sie die Datei `pb_schema.json` hoch
5. Klicken Sie auf **"Import"**

**Test-Benutzer anlegen:**

Gehen Sie zu **Collections → users** und erstellen Sie:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`
- Name: `Nils Dietrich`
- Role: `admin`
- mustChangePassword: `true`

**Mitarbeiter:**
- Email: `max@example.com`
- Password: `employee123`
- Name: `Max Mustermann`
- Role: `employee`
- mustChangePassword: `true`

### 4. Anwendung öffnen

Öffnen Sie im Browser: **http://localhost:8000**

## 📋 Nützliche Befehle

### Container-Verwaltung

```bash
# Container starten
docker-compose up -d

# Container stoppen
docker-compose down

# Container neu starten
docker-compose restart

# Logs anzeigen
docker-compose logs -f

# Logs nur von PocketBase
docker-compose logs -f pocketbase

# Logs nur vom Frontend
docker-compose logs -f frontend

# Status prüfen
docker-compose ps
```

### Datenverwaltung

```bash
# Backup der Datenbank erstellen
docker-compose exec pocketbase sh -c "tar czf /pb_data/backup.tar.gz /pb_data/*.db"

# Daten komplett löschen (VORSICHT!)
docker-compose down -v
```

## 🔧 Services

Die Docker-Compose-Konfiguration startet zwei Services:

### PocketBase (Backend)
- **Image:** spectado/pocketbase:latest
- **Port:** 8090
- **URL:** http://localhost:8090
- **Admin-UI:** http://localhost:8090/_/
- **Daten:** Werden in einem Docker Volume gespeichert

### Frontend (Nginx)
- **Port:** 8000
- **URL:** http://localhost:8000
- **Webserver:** Nginx
- **Inhalt:** Statische HTML/CSS/JS Dateien

## 📁 Verzeichnisstruktur

```
Mitarbeiterunterweisung/
├── docker-compose.yml      # Docker Compose Konfiguration
├── Dockerfile              # Frontend Container Definition
├── nginx.conf              # Nginx Webserver Konfiguration
├── .dockerignore          # Dateien die Docker ignorieren soll
├── pb_schema.json         # PocketBase Collections Schema
├── index.html
├── css/
└── js/
```

## 🔒 Sicherheitshinweise

**Für Produktion beachten:**

1. **Passwörter ändern** - Verwenden Sie sichere Passwörter
2. **HTTPS einrichten** - Nutzen Sie einen Reverse Proxy (Traefik, nginx)
3. **Firewall konfigurieren** - Nur notwendige Ports öffnen
4. **Backups erstellen** - Regelmäßig Datenbank sichern
5. **Updates einspielen** - Container regelmäßig aktualisieren

## 🌐 Produktion mit Domain

Wenn Sie die Anwendung mit einer Domain betreiben möchten:

### docker-compose.prod.yml Beispiel:

```yaml
version: '3.8'

services:
  pocketbase:
    image: spectado/pocketbase:latest
    command: serve --http=0.0.0.0:8090
    restart: always
    volumes:
      - ./pb_data:/pb_data
    networks:
      - internal

  frontend:
    build: .
    restart: always
    networks:
      - internal
      - web
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.mitarbeiterunterweisung.rule=Host(`ihre-domain.de`)"
      - "traefik.http.routers.mitarbeiterunterweisung.entrypoints=websecure"
      - "traefik.http.routers.mitarbeiterunterweisung.tls.certresolver=letsencrypt"

networks:
  internal:
  web:
    external: true
```

## 🐛 Troubleshooting

### Port bereits belegt

```bash
# Andere Ports verwenden
docker-compose down
# Editieren Sie docker-compose.yml und ändern Sie die Ports
docker-compose up -d
```

### Container startet nicht

```bash
# Logs anschauen
docker-compose logs

# Container neu bauen
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Daten zurücksetzen

```bash
# VORSICHT: Löscht alle Daten!
docker-compose down -v
docker-compose up -d
# Dann PocketBase neu konfigurieren (Schritt 3)
```

## 📊 Ressourcen

Die Container sind sehr ressourcenschonend:

- **PocketBase:** ~20-50 MB RAM
- **Nginx:** ~5-10 MB RAM
- **Gesamt:** ~25-60 MB RAM

Perfekt für kleine Server oder Raspberry Pi!

## 🆘 Hilfe

Bei Problemen:

1. Prüfen Sie die Logs: `docker-compose logs -f`
2. Stellen Sie sicher, dass die Ports frei sind
3. Prüfen Sie, ob Docker läuft: `docker ps`
4. Erstellen Sie ein Issue auf GitHub

## 📝 Updates

So aktualisieren Sie die Anwendung:

```bash
# Code aktualisieren
git pull

# Container neu bauen und starten
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

Die Datenbank bleibt dabei erhalten!
