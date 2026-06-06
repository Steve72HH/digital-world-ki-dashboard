# API

Base URL lokal:

```text
http://localhost:8787
```

Alle Endpunkte liefern JSON.

## System

### `GET /api/health`

Prueft Server, Provider, Modell und Speicherpfad.

### `GET /api/state`

Liefert den kompletten Workspace-Zustand fuer das Frontend:

- `settings`
- `agents`
- `workflows`
- `prompts`
- `runs`
- `activity`
- `aiProviders`
- `metrics`

`aiProviders` enthaelt keine Klartext-Keys. Stattdessen werden `apiKeySet` und `apiKeyMasked` geliefert.

## KI-Setup

### `GET /api/ai-providers`

Liefert alle Provider-Presets mit Status, Modell, Base URL und maskiertem Key-Status.

### `PATCH /api/ai-providers/:id`

Aktualisiert einen Provider.

```json
{
  "enabled": true,
  "baseUrl": "https://api.openai.com/v1",
  "model": "gpt-4.1-mini",
  "apiKey": "sk-...",
  "defaultProvider": true
}
```

Wenn `apiKey` leer bleibt, bleibt ein vorhandener Key erhalten. Mit `clearKey: true` wird er geloescht.

### `POST /api/ai-providers/:id/test`

Speichert nichts, sondern testet den aktuell gespeicherten Provider mit einem sehr kurzen Prompt.

### `PATCH /api/settings`

Aktualisiert globale Workspace- und Routing-Einstellungen.

```json
{
  "workspaceName": "Digital World",
  "defaultProviderId": "openai",
  "defaultModel": "gpt-4.1-mini",
  "providerMode": "backend",
  "providerRouting": {
    "code": "openai",
    "researcher": "openrouter",
    "ai-chat": "ollama"
  }
}
```

`providerRouting` ist optional. Fehlt ein Tool-Eintrag oder ist er leer, nutzt das Dashboard `defaultProviderId`.

## KI-Auftraege

### `POST /api/runs`

Erstellt einen KI-Auftrag, ruft den konfigurierten Provider auf und speichert den abgeschlossenen Run.

```json
{
  "prompt": "Plane eine n8n Automation",
  "mode": "auto",
  "tool": { "id": "claw", "label": "Claw" },
  "model": "gpt-4.1-mini",
  "providerId": "openai",
  "workspace": "Digital World"
}
```

### `POST /api/chat`

Kompatibilitaets-Endpunkt ohne Persistenz. Gut fuer schnelle Provider-Tests.

## Prompts

### `GET /api/prompts`

Liefert Prompt Vault.

### `POST /api/prompts`

Speichert eine Vorlage.

```json
{
  "title": "Automation Blueprint",
  "text": "Erstelle einen Automationsplan..."
}
```

### `DELETE /api/prompts/:id`

Loescht eine Vorlage.

## Workflows

### `GET /api/workflows`

Liefert Workflow-Liste.

### `POST /api/workflows`

Erstellt einen Workflow.

```json
{
  "title": "Lead Sync",
  "subtitle": "Lead pruefen und CRM aktualisieren",
  "active": true,
  "steps": ["Trigger", "KI", "Webhook"],
  "trigger": "Neuer CRM-Lead",
  "owner": "Research Scout",
  "webhookUrl": "https://hook.eu1.make.com/..."
}
```

### `PATCH /api/workflows/:id`

Aktualisiert Felder wie `active`, `title`, `steps`, `trigger`, `owner` oder `webhookUrl`.

### `POST /api/workflows/:id/run`

Startet den Workflow. Ohne `webhookUrl` wird ein lokaler Dry Run erzeugt. Mit `webhookUrl` sendet das Backend einen `POST` mit JSON an den konfigurierten Endpunkt und speichert Status, Antwortauszug und Run.

Request:

```json
{
  "prompt": "Support-Mail priorisieren und Antwortentwurf vorbereiten",
  "workspace": "Digital World"
}
```

Webhook-Payload:

```json
{
  "source": "digital-world-ki-dashboard",
  "event": "workflow.run",
  "createdAt": "2026-06-06T00:00:00.000Z",
  "workspace": "Digital World",
  "prompt": "Support-Mail priorisieren und Antwortentwurf vorbereiten",
  "input": "Support-Mail priorisieren und Antwortentwurf vorbereiten",
  "workflow": {
    "id": "support-triage",
    "title": "Support Triage",
    "subtitle": "Mails clustern, priorisieren und Antwort vorschlagen",
    "active": true,
    "trigger": "Neue Support-Mail",
    "owner": "Claw Automations",
    "steps": ["Inbox", "Tags", "Antwort"]
  }
}
```

Die Webhook-URL wird lokal im Dashboard-Speicher gehalten. Wenn die URL geheime Token enthaelt, sollte ein Export nicht oeffentlich geteilt werden.

## Agents

### `GET /api/agents`

Liefert KI-Mitarbeiter.

### `PATCH /api/agents/:id`

Aktiviert, pausiert oder konfiguriert einen Agenten.

```json
{
  "active": true,
  "providerId": "openai",
  "model": "gpt-4.1-mini",
  "instructions": "Arbeite als Code-Operator mit Tests und Rollback-Hinweisen."
}
```

### `POST /api/agents/:id/run`

Fuehrt einen aktiven Agenten mit dessen Systembriefing aus und speichert das Ergebnis als normalen Run.

```json
{
  "prompt": "Plane eine Backup-Automation fuer Docker",
  "providerId": "openai",
  "model": "gpt-4.1-mini",
  "workspace": "Digital World"
}
```

Wenn `providerId` oder `model` fehlen, nutzt das Backend die Agenten- oder Workspace-Defaults.

## Daten

### `GET /api/export`

Exportiert den kompletten JSON-Zustand ohne Klartext-API-Keys.

### `POST /api/import`

Importiert JSON-Daten.

```json
{
  "mode": "replace",
  "data": {}
}
```

`mode` kann `replace` oder `merge` sein.

### `POST /api/demo/seed`

Setzt lokale Testdaten neu. Fuer produktive Deployments sollte dieser Endpunkt spaeter per Auth geschuetzt oder deaktiviert werden.
