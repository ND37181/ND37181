# Mitarbeiterunterweisung - Training Management System

Eine moderne Web-Anwendung zur Verwaltung und Durchführung von Mitarbeiterunterweisungen mit PocketBase als Backend.

## 🚀 Features

### Für Mitarbeiter
- 📚 Interaktive Kurse mit Texten, Videos und Bildern
- ✅ Wissenstest mit automatischer Auswertung
- 📊 Übersicht über abgeschlossene und ausstehende Schulungen
- 🔔 Status-Anzeige (Offen, Bestanden, Läuft bald ab, Abgelaufen)

### Für Administratoren
- 👥 Benutzerverwaltung (Mitarbeiter und Admins)
- 📚 Kursverwaltung mit Editor für Inhalte und Quiz
- 📊 Schulungsübersicht aller Mitarbeiter
- 🔍 Filter- und Sortierfunktionen
- 📥 CSV-Export der Schulungsdaten
- ⏰ Automatische Gültigkeitsprüfung

## 🏗️ Technologie-Stack

- **Frontend:** Vanilla JavaScript (ES6 Modules), HTML5, CSS3
- **Styling:** Tailwind CSS
- **Backend:** PocketBase (SQLite-basiert)
- **Realtime:** PocketBase Realtime Subscriptions

## 📁 Projektstruktur

```
/
├── index.html              # Haupt-HTML-Datei
├── SETUP.md               # Detaillierte Setup-Anleitung
├── pb_schema.json         # PocketBase Collections Schema
├── css/
│   └── styles.css         # Custom CSS Styles
└── js/
    ├── main.js            # App Entry Point
    ├── config.js          # Konfiguration
    ├── state.js           # State Management
    ├── api.js             # PocketBase API
    ├── auth.js            # Authentifizierung
    └── ui/
        ├── login.js       # Login UI
        ├── dashboard.js   # Employee Dashboard
        ├── admin.js       # Admin Dashboard
        ├── training.js    # Training Content
        ├── quiz.js        # Quiz UI
        └── modals.js      # Modal Dialoge
```

## 🛠️ Installation & Setup

### 1. PocketBase installieren

```bash
# Linux/Mac
wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.0/pocketbase_0.20.0_linux_amd64.zip
unzip pocketbase_0.20.0_linux_amd64.zip
chmod +x pocketbase
```

### 2. PocketBase starten

```bash
./pocketbase serve
```

PocketBase läuft auf: http://localhost:8090

### 3. Collections importieren

1. Öffnen Sie http://localhost:8090/_/
2. Erstellen Sie einen Admin-Account
3. Gehen Sie zu Settings → Import collections
4. Laden Sie `pb_schema.json` hoch

Detaillierte Anleitung: [SETUP.md](SETUP.md)

### 4. Anwendung öffnen

Öffnen Sie `index.html` in einem Browser oder verwenden Sie einen lokalen Webserver:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Dann öffnen Sie: http://localhost:8000

## 🔑 Test-Zugangsdaten

Nach dem Setup sind folgende Test-Accounts verfügbar:

**Admin:**
- Email: `admin@example.com`
- Passwort: `admin123`

**Mitarbeiter:**
- Email: `max@example.com`
- Passwort: `employee123`

## 🎯 Verwendung

### Als Mitarbeiter
1. Mit E-Mail und Passwort anmelden
2. Beim ersten Login neues Passwort festlegen
3. Verfügbare Kurse ansehen
4. Kurs starten und Inhalte durcharbeiten
5. Wissenstest absolvieren (mind. 50% richtige Antworten)

### Als Administrator
1. Benutzer anlegen und verwalten
2. Kurse erstellen mit:
   - Texten (Absätze)
   - YouTube-Videos
   - Bildern
   - Quiz-Fragen
3. Schulungsübersicht aller Mitarbeiter einsehen
4. Daten filtern und als CSV exportieren

## 📊 Datenmodell

### Collections

**users** (Auth Collection)
- email, name, role, mustChangePassword

**courses**
- title, description, validityDays, content (JSON), quiz (JSON)

**progress**
- user (Relation), course (Relation), date, score

## 🔒 Sicherheit

- ✅ Passwort-Hashing durch PocketBase
- ✅ Backend-Validierung durch API Rules
- ✅ Rollenverwaltung (Admin/Employee)
- ✅ Geschützte API-Endpunkte
- ✅ Pflicht zur Passwortänderung beim ersten Login

## 🚧 Migration von Firebase

Diese Anwendung wurde von Firebase zu PocketBase migriert:

**Vorteile:**
- Self-hosted - keine Cloud-Abhängigkeit
- Echte Benutzer-Authentifizierung
- Backend-Validierung
- Einfacheres Deployment
- Keine externen Kosten

## 📝 Lizenz

Dieses Projekt ist für interne Verwendung entwickelt.

## 👤 Autor

Nils Dietrich (@ND37181)
