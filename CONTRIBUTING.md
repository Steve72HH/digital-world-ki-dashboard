# Contributing

Danke, dass du am Digital World KI Dashboard mitarbeitest.

## Lokale Entwicklung

```bash
npm start
```

Danach:

```text
http://localhost:8787
```

## Checks vor Pull Requests

```bash
npm run check
npm test
npm run smoke
```

## Stil

- Keine echten API-Keys, Webhook-Tokens oder persoenlichen Daten committen.
- Bestehende Vanilla-JS/Node-Struktur beibehalten, solange kein klarer Grund fuer ein Framework entsteht.
- UI-Aenderungen immer einmal manuell im Browser pruefen.
- Neue Backend-Endpunkte in `docs/API.md` dokumentieren.
- Neue Workflows oder Provider mit Tests absichern, wenn sie Verhalten aendern.

## Branch- und Commit-Hinweise

Kurze, beschreibende Commit-Messages reichen aus:

```text
Add workflow runner webhook support
Update provider setup docs
```
