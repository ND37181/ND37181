# Mitarbeiterunterweisung - Setup Anleitung

## PocketBase Installation

### 1. PocketBase herunterladen

Besuchen Sie [https://pocketbase.io/docs/](https://pocketbase.io/docs/) und laden Sie PocketBase für Ihr System herunter.

**Linux/Mac:**
```bash
# Download (Version anpassen)
wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.0/pocketbase_0.20.0_linux_amd64.zip

# Entpacken
unzip pocketbase_0.20.0_linux_amd64.zip

# Ausführbar machen
chmod +x pocketbase
```

**Windows:**
- Laden Sie die `.zip` Datei herunter
- Entpacken Sie sie in dieses Projektverzeichnis

### 2. PocketBase starten

```bash
./pocketbase serve
```

PocketBase läuft nun auf: **http://localhost:8090**

### 3. Admin-Account erstellen

1. Öffnen Sie im Browser: `http://localhost:8090/_/`
2. Erstellen Sie einen Admin-Account (wird nur für die PocketBase-Verwaltung verwendet)

### 4. Collections importieren

**Option A - Automatisch (empfohlen):**
1. Im PocketBase Admin-UI: Settings → Import collections
2. Laden Sie die Datei `pb_schema.json` hoch
3. Klicken Sie auf "Import"

**Option B - Manuell:**
Erstellen Sie folgende Collections:

#### Collection: `users` (Auth Collection)
- Type: Auth
- Felder:
  - `name` (Text, required)
  - `role` (Select, required, options: `employee`, `admin`)
  - `mustChangePassword` (Bool, default: true)

#### Collection: `courses`
- Felder:
  - `title` (Text, required)
  - `description` (Text)
  - `validityDays` (Number, default: 365)
  - `content` (JSON)
  - `quiz` (JSON)

#### Collection: `progress`
- Felder:
  - `user` (Relation -> users, required)
  - `course` (Relation -> courses, required)
  - `date` (Date, required)
  - `score` (Number)

### 5. API Rules konfigurieren

**users Collection:**
- List: `@request.auth.id != ""`
- View: `@request.auth.id != ""`
- Create: `@request.auth.role = "admin"`
- Update: `@request.auth.id = id || @request.auth.role = "admin"`
- Delete: `@request.auth.role = "admin"`

**courses Collection:**
- List: `@request.auth.id != ""`
- View: `@request.auth.id != ""`
- Create: `@request.auth.role = "admin"`
- Update: `@request.auth.role = "admin"`
- Delete: `@request.auth.role = "admin"`

**progress Collection:**
- List: `@request.auth.id != ""`
- View: `@request.auth.id != ""`
- Create: `@request.auth.id = user.id || @request.auth.role = "admin"`
- Update: `@request.auth.id = user.id || @request.auth.role = "admin"`
- Delete: `@request.auth.role = "admin"`

### 6. Test-Benutzer anlegen

Im PocketBase Admin-UI unter "Collections" → "users":

**Admin:**
- Email: `admin@example.com`
- Passwort: `admin123`
- Name: `Nils Dietrich`
- Role: `admin`
- mustChangePassword: `true`

**Mitarbeiter 1:**
- Email: `max@example.com`
- Passwort: `employee123`
- Name: `Max Mustermann`
- Role: `employee`
- mustChangePassword: `true`

**Mitarbeiter 2:**
- Email: `anna@example.com`
- Passwort: `employee123`
- Name: `Anna Schmidt`
- Role: `employee`
- mustChangePassword: `true`

### 7. Anwendung starten

Öffnen Sie `index.html` in einem modernen Browser oder verwenden Sie einen lokalen Webserver:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (npx)
npx serve

# PHP
php -S localhost:8000
```

Dann öffnen Sie: `http://localhost:8000`

## Konfiguration

Die PocketBase-URL kann in `js/config.js` angepasst werden:

```javascript
export const POCKETBASE_URL = 'http://localhost:8090';
```

## Troubleshooting

**CORS-Fehler:**
- Stellen Sie sicher, dass PocketBase läuft
- Prüfen Sie in der Browser-Console auf Fehler
- PocketBase erlaubt standardmäßig `localhost`

**Login funktioniert nicht:**
- Prüfen Sie, ob die Benutzer angelegt wurden
- Prüfen Sie Email und Passwort
- Schauen Sie in die Browser-Console

**Daten werden nicht geladen:**
- Prüfen Sie die API Rules in PocketBase
- Öffnen Sie die Network-Tab in den DevTools
- Stellen Sie sicher, dass Sie eingeloggt sind
