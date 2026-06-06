# Testplan

## Automatisierte Tests

```bash
npm run check
npm test
npm run smoke
```

`npm test` startet den Server auf einem temporaeren Port und nutzt ein temporaeres Datenverzeichnis.

## Manuelle Browser-Checks

1. App starten:

   ```bash
   npm start
   ```

2. Browser oeffnen:

   ```text
   http://localhost:8787
   ```

3. Im Test Center `API pruefen` klicken.

4. `Demo-Auftrag` klicken und pruefen:

   - Auftrag erscheint in der Queue.
   - Aktivitaet bekommt neuen Eintrag.
   - `data/dashboard.json` wird aktualisiert.

5. Prompt in das Command Center schreiben und `Als Vorlage` klicken.

6. Seite neu laden und pruefen, ob die Vorlage erhalten bleibt.

7. Workflow aktivieren/pausieren und nach Reload kontrollieren.

8. Workflow Runner pruefen:

   - Workflow auswaehlen.
   - Trigger und Owner aendern und speichern.
   - Ohne Webhook `Workflow starten` klicken und lokalen Dry Run in der Queue oeffnen.
   - Eine n8n-/Make-Test-Webhook-URL eintragen, speichern und erneut starten.
   - Pruefen, ob Status und Antwortauszug im Runner sichtbar werden.

9. Agenten aktivieren und nach Reload kontrollieren.

10. Agent Studio pruefen:

   - Agent auswaehlen.
   - Provider und optional Modell setzen.
   - Systembriefing aendern und speichern.
   - Testauftrag starten.
   - Ergebnis erscheint in der Queue mit Agentennamen.

11. `Export` laden, danach ueber Backend Drawer wieder importieren.

12. `KI-Setup` oeffnen und pruefen:

   - Provider-Karten werden angezeigt.
   - Provider aktivieren, Modell/Base URL aendern und speichern.
   - API-Key-Feld zeigt nach dem Speichern nur eine maskierte Variante.
   - `Verbindung testen` liefert bei gueltigem Key eine Erfolgsmeldung.
   - Unter `Werkzeuge zuordnen` ein Tool auf einen Provider setzen und speichern.
   - `Auto zuordnen` pruefen und danach speichern.
   - Export enthaelt keinen Klartext-Key.

13. Mobile Breite pruefen:

    - 390 px
    - 768 px
    - Desktop ab 1280 px

## Provider-Checks

### Mock

```env
AI_PROVIDER=mock
AI_MODEL=gpt-4.1-mini
```

Erwartung: keine externen Calls, Antwort kommt sofort.

### Ollama

```env
AI_PROVIDER=ollama
AI_BASE_URL=http://localhost:11434
AI_MODEL=llama3.1
```

Erwartung: `/api/health` zeigt `ollama`, Demo-Auftrag liefert lokale Modellantwort.

### OpenAI-kompatibel

```env
AI_PROVIDER=openai-compatible
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=<dein-api-key>
AI_MODEL=gpt-4.1-mini
```

Erwartung: API-Key bleibt serverseitig, Browser sieht ihn nicht.

### Dashboard KI-Setup

Im Drawer `KI-Setup` kann ein Provider auch ohne `.env` gepflegt werden. Erwartung:

- `GET /api/ai-providers` liefert Presets ohne Klartext-Key.
- `PATCH /api/ai-providers/:id` speichert Modell, Base URL und Key serverseitig.
- `POST /api/ai-providers/:id/test` prueft den Anbieter.
- Neue Auftraege nutzen `settings.defaultProviderId`, wenn der Provider aktiv ist.
- Wenn `settings.providerRouting[toolId]` gesetzt ist, nutzt das Tool diesen Provider statt des Standards.

### Agent Studio

Erwartung:

- `PATCH /api/agents/:id` speichert `active`, `providerId`, `model` und `instructions`.
- `POST /api/agents/:id/run` blockiert pausierte Agenten.
- Aktive Agenten erzeugen einen normalen Run mit `agentId`.
- Agenten ohne eigenen Provider nutzen das Routing fuer `agents` oder den Standard-Provider.

### Workflow Runner

Erwartung:

- `PATCH /api/workflows/:id` speichert `trigger`, `owner` und `webhookUrl`.
- `POST /api/workflows/:id/run` erzeugt ohne Webhook einen lokalen Dry Run.
- Mit Webhook sendet das Backend einen JSON-`POST` an den externen Endpunkt.
- Workflow-Daten enthalten danach `lastRunAt`, `lastStatus` und `lastResponse`.

## Release-Checkliste

- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run smoke`
- [ ] Desktop Screenshot
- [ ] Mobile Screenshot
- [ ] README aktualisiert
- [ ] `.env.example` ohne echte Zugangsdaten
- [ ] `data/dashboard.json` nicht commiten
