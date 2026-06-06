# Security Policy

## Secrets

Das Dashboard kann API-Keys und Webhook-URLs lokal in `data/dashboard.json` speichern. Diese Datei ist per `.gitignore` ausgeschlossen und darf nicht in ein oeffentliches Repository gelangen.

Bitte niemals committen:

- `.env`
- `data/dashboard.json`
- echte API-Keys
- Webhook-URLs mit Tokens
- Exportdateien aus produktiven Workspaces

## Deployment

Die aktuelle Version ist fuer self-hosted Single-User- oder Trusted-Team-Setups gedacht. Fuer oeffentliche oder Multi-User-Deployments sollten vorab ergaenzt werden:

- Authentifizierung
- Rollen/Rechte
- verschluesselte Secret-Ablage
- Rate Limits
- Audit-Log
- Schutz oder Deaktivierung von `/api/demo/seed`

## Meldungen

Wenn du ein Sicherheitsproblem findest, oeffne kein oeffentliches Issue mit Secrets. Entferne vertrauliche Daten aus Logs und beschreibe nur den reproduzierbaren Ablauf.
