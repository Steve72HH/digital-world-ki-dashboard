# Deployment

Das Digital World KI Dashboard ist als einfache Node-App gebaut und braucht keine Datenbank. Persistenz liegt standardmaessig in `data/dashboard.json`.

## Lokal

```bash
npm start
```

```text
http://localhost:8787
```

## Docker Compose

```bash
docker compose up --build
```

Die Daten werden ueber `./data:/app/data` persistiert.

## Ollama anbinden

Auf demselben Host:

```env
AI_PROVIDER=ollama
AI_BASE_URL=http://localhost:11434
AI_MODEL=llama3.2:1b
```

In Docker kann je nach Host-System diese URL besser passen:

```env
AI_BASE_URL=http://host.docker.internal:11434
```

## OpenAI-kompatible Provider

```env
AI_PROVIDER=openai-compatible
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=<dein-key>
AI_MODEL=gpt-4.1-mini
```

Alternativ Provider im Dashboard unter `KI-Setup` pflegen. Keys werden serverseitig gespeichert und in API-Antworten maskiert.

## n8n / Make / Webhooks

Im `Workflow Runner` pro Workflow eine Webhook-URL hinterlegen. Beim Start sendet das Backend einen JSON-`POST`:

```json
{
  "source": "digital-world-ki-dashboard",
  "event": "workflow.run",
  "workspace": "Digital World",
  "prompt": "Auftragstext",
  "workflow": {
    "id": "support-triage",
    "title": "Support Triage",
    "steps": ["Inbox", "Tags", "Antwort"]
  }
}
```

Webhook-URLs mit Tokens gelten als Secrets. Exporte aus produktiven Workspaces nicht oeffentlich teilen.

## Produktionshinweise

Vor einem oeffentlichen Betrieb sollten Auth, Rollen, Rate Limits und Secret-Verschluesselung ergaenzt werden. Fuer private Self-Hosting-Setups reicht die aktuelle Version als testbare Grundlage.
