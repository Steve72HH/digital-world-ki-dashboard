# Digital World KI Dashboard

Self-hosted KI-Workspace fuer Prompts, Agents, Workflows, Automationen und serverseitige KI-Provider.

Die Anwendung ist als testbare V1 gebaut: ohne externe Frontend-CDNs, ohne npm-Abhaengigkeiten, mit Node-Backend, JSON-Dateispeicher, API, Docker-Dateien und automatisierten Tests. Ziel ist eine kleine, selbst hostbare Plattform, die KI-Provider, Agentenrollen und Automations-Workflows an einem Ort buendelt.

![Status](https://img.shields.io/badge/status-MVP_ready-18d4c5)
![Node](https://img.shields.io/badge/node-%3E%3D20-75d66b)
![License](https://img.shields.io/badge/license-MIT-f6b84d)

## Warum?

Viele KI-Dashboards sind im Kern nur ein Buendel aus Chat, Prompt-Bibliothek, Agentenrollen, Provider-Keys und Automations-Triggern. Dieses Projekt macht genau diese Schicht selbst hostbar: transparent, lokal kontrollierbar und erweiterbar.

## Funktionen

- Command Center mit Tool- und Modusauswahl
- KI-Auftraege mit persistenter Run-Historie
- Prompt Vault mit Export/Import
- Workflow-Verwaltung mit lokalem Testlauf und Webhook Runner fuer n8n, Make oder eigene Worker
- KI-Mitarbeiter aktivieren/pausieren
- Agent Studio mit Provider, Modell, Systembriefing und Testlauf pro Agent
- Aktivitaetsfeed und Kennzahlen
- Test Center im Dashboard
- KI-Setup fuer eigene Provider-Keys, Standardrouting und Routing pro Werkzeug
- Backend-Bridge fuer `mock`, `ollama`, OpenAI-kompatible APIs, Claude, Gemini und Azure OpenAI
- JSON-Webhook-Runner fuer n8n, Make und eigene Worker
- GitHub Actions CI, Issue Templates und PR Template

## Screenshots

Screenshots koennen in `docs/assets/` abgelegt werden:

- `docs/assets/dashboard-desktop.png`
- `docs/assets/workflow-runner.png`
- `docs/assets/social-preview.png`

## Schnellstart

```bash
npm run check
npm start
```

Dann oeffnen:

```text
http://localhost:8787
```

Beim ersten Start erzeugt die App:

```text
data/dashboard.json
```

Diese Datei enthaelt lokale Arbeitsdaten und ist per `.gitignore` vom Repository ausgeschlossen.

## Demo-Daten

Ein sauberes Beispiel ohne Secrets liegt unter:

```text
data/dashboard.example.json
```

Produktive Daten liegen in `data/dashboard.json` und werden nicht committet.

## Tests

```bash
npm run check
npm test
npm run smoke
```

Weitere manuelle Checks stehen in [docs/TESTPLAN.md](docs/TESTPLAN.md).

## Docker

```bash
docker compose up --build
```

Danach:

```text
http://localhost:8787
```

## KI-Setup und Provider

Du kannst Provider entweder per `.env` als Server-Fallback setzen oder im Dashboard unter `KI-Setup` eigene KI-Abos mit API-Key hinterlegen.

Unterstuetzte Presets:

- lokal: Ollama, LM Studio
- OpenAI: ChatGPT/OpenAI, Codex
- Anthropic Claude
- Google Gemini
- Mistral, DeepSeek, Groq, OpenRouter, Perplexity, xAI/Grok, Together AI
- Azure OpenAI
- Custom/OpenClaw fuer OpenAI-kompatible Agenten-Server

Keys werden serverseitig in `data/dashboard.json` gespeichert, in API-Antworten maskiert und bei `GET /api/export` nicht im Klartext ausgegeben. Fuer produktive Multi-User-Deployments sollte spaeter ein Secret Manager oder verschluesselte Key-Ablage ergaenzt werden.

Im KI-Setup kannst du ausserdem einzelne Werkzeuge einem Provider zuordnen. Beispiel: `Code` nutzt OpenAI, `Research` nutzt OpenRouter oder Perplexity, waehrend `KI-Chat` lokal ueber Ollama laeuft. Ohne Werkzeug-Zuordnung wird der Standard-Provider verwendet.

Kopiere `.env.example` nach `.env` oder setze Umgebungsvariablen direkt, wenn du einen Fallback ohne Dashboard-Setup willst.

### Mock

```env
AI_PROVIDER=mock
AI_MODEL=gpt-4.1-mini
```

### Ollama

```env
AI_PROVIDER=ollama
AI_BASE_URL=http://localhost:11434
AI_MODEL=llama3.1
```

Im Docker-Container kann fuer Ollama auf dem Host je nach Setup diese URL noetig sein:

```env
AI_BASE_URL=http://host.docker.internal:11434
```

### OpenAI-kompatibel

```env
AI_PROVIDER=openai-compatible
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=<dein-api-key>
AI_MODEL=gpt-4.1-mini
```

Der API-Key bleibt serverseitig und wird nicht im Browser gespeichert.

## Workflow Runner

Im `Workflow Runner` kannst du pro Workflow eine Webhook-URL hinterlegen. Ohne URL entsteht ein lokaler Dry Run. Mit URL sendet das Backend einen JSON-`POST` an n8n, Make oder eigene Worker und speichert Status sowie Antwortauszug am Workflow.

Mehr dazu in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## API

Siehe [docs/API.md](docs/API.md).

Wichtige Endpunkte:

- `GET /api/health`
- `GET /api/state`
- `GET /api/ai-providers`
- `PATCH /api/ai-providers/:id`
- `POST /api/ai-providers/:id/test`
- `PATCH /api/settings`
- `POST /api/runs`
- `POST /api/prompts`
- `PATCH /api/workflows/:id`
- `POST /api/workflows/:id/run`
- `PATCH /api/agents/:id`
- `POST /api/agents/:id/run`
- `GET /api/export`
- `POST /api/import`

## GitHub vorbereiten

Vor dem Push:

```bash
npm run check
npm test
npm run smoke
```

Dann:

```bash
git init
git add .
git commit -m "Initial Digital World KI Dashboard"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Siehe auch [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md).

## Projektstruktur

```text
.
├── app.js
├── index.html
├── styles.css
├── server.js
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── src/
│   ├── ai.js
│   ├── provider-catalog.js
│   ├── seeds.js
│   ├── server-app.js
│   └── store.js
├── test/
│   ├── api.test.js
│   ├── check-syntax.js
│   └── smoke.js
├── docs/
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── RELEASE_CHECKLIST.md
│   ├── ROADMAP.md
│   └── TESTPLAN.md
└── data/
    └── dashboard.example.json
```

## Naechste Ausbaustufen

Siehe [docs/ROADMAP.md](docs/ROADMAP.md).

## Sicherheit

Bitte [SECURITY.md](SECURITY.md) lesen, bevor das Dashboard oeffentlich betrieben wird. Die aktuelle Version ist fuer Self-Hosting in einem vertrauenswuerdigen Umfeld gedacht.
