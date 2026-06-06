# Release Checklist

## Vor jedem Release

- [ ] `.env` enthaelt keine Daten, die ins Repo sollen.
- [ ] `data/dashboard.json` bleibt untracked.
- [ ] `data/dashboard.example.json` enthaelt keine echten Keys oder Webhook-Tokens.
- [ ] `npm run check`
- [ ] `npm test`
- [ ] `npm run smoke`
- [ ] README und API-Doku aktualisiert.
- [ ] Desktop-Screenshot erstellt.
- [ ] Mobile-Screenshot erstellt.

## GitHub Erstveroeffentlichung

```bash
git init
git add .
git commit -m "Initial Digital World KI Dashboard"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Nach dem Push in GitHub pruefen:

- Actions laufen gruen.
- README wird korrekt gerendert.
- Issue Templates erscheinen.
- Keine Secrets in der Weboberflaeche oder Historie sichtbar.
