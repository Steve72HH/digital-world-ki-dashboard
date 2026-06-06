const { createDefaultAiProviders } = require("./provider-catalog");

const seedAgents = [
  {
    id: "automations",
    name: "Claw Automations",
    role: "Make, n8n, Webhooks",
    initials: "CA",
    color: "#ff6a4b",
    active: true,
    tools: ["webhook", "scheduler", "http"],
    providerId: "",
    model: "",
    instructions:
      "Plane robuste Automationen mit klaren Triggern, Datenquellen, Fehlerpfaden, Logging und einem kleinen MVP-Schritt. Denke besonders an Make, n8n, Webhooks und sichere Uebergaben.",
  },
  {
    id: "research",
    name: "Research Scout",
    role: "Markt, Quellen, Vergleiche",
    initials: "RS",
    color: "#18d4c5",
    active: true,
    tools: ["browser", "summarizer", "source-check"],
    providerId: "",
    model: "",
    instructions:
      "Recherchiere strukturiert, trenne Fakten von Annahmen und liefere Vergleiche, Risiken, Chancen und naechste Pruefschritte. Markiere unsichere Punkte klar.",
  },
  {
    id: "content",
    name: "Content Pilot",
    role: "Posts, Newsletter, Skripte",
    initials: "CP",
    color: "#f6b84d",
    active: false,
    tools: ["editor", "calendar", "asset-plan"],
    providerId: "",
    model: "",
    instructions:
      "Erstelle klare Content-Entwuerfe mit Hook, Zielgruppe, Format, Kanal, CTA und Produktionsschritten. Schreibe direkt, praktisch und wiederverwendbar.",
  },
  {
    id: "code",
    name: "Code Operator",
    role: "Reviews, Fixes, Deployments",
    initials: "CO",
    color: "#8f7aff",
    active: false,
    tools: ["repo", "tests", "deploy"],
    providerId: "",
    model: "",
    instructions:
      "Arbeite wie ein senioriger Code-Operator: erst Ziel und Risiko klaeren, dann kleine Implementierungsschritte, Tests, Rollback-Punkte und konkrete Dateien oder Befehle nennen.",
  },
];

const seedWorkflows = [
  {
    id: "lead-research",
    title: "Lead-Recherche",
    subtitle: "Firma finden, ICP pruefen, Outreach skizzieren",
    active: true,
    steps: ["Quelle", "Analyse", "CRM"],
    trigger: "Manuell oder neuer CRM-Lead",
    owner: "Research Scout",
    webhookUrl: "",
    lastRunAt: null,
    lastStatus: "",
    lastResponse: "",
  },
  {
    id: "content-repurpose",
    title: "Content Repurpose",
    subtitle: "Video in Blog, Newsletter und LinkedIn zerlegen",
    active: true,
    steps: ["Transkript", "Assets", "Plan"],
    trigger: "Neuer Video-Link",
    owner: "Content Pilot",
    webhookUrl: "",
    lastRunAt: null,
    lastStatus: "",
    lastResponse: "",
  },
  {
    id: "support-triage",
    title: "Support Triage",
    subtitle: "Mails clustern, priorisieren und Antwort vorschlagen",
    active: false,
    steps: ["Inbox", "Tags", "Antwort"],
    trigger: "Neue Support-Mail",
    owner: "Claw Automations",
    webhookUrl: "",
    lastRunAt: null,
    lastStatus: "",
    lastResponse: "",
  },
];

const seedPrompts = [
  {
    id: "p1",
    title: "Automation Blueprint",
    text: "Erstelle fuer diesen Prozess einen Automationsplan mit Trigger, Datenquellen, Fehlerfaellen, Tools und erstem MVP.",
    tags: ["automation", "mvp"],
    createdAt: "2026-06-05T00:00:00.000Z",
  },
  {
    id: "p2",
    title: "Executive Briefing",
    text: "Fasse dieses Thema fuer eine Geschaeftsentscheidung zusammen: Kontext, Optionen, Risiko, Empfehlung, naechste Schritte.",
    tags: ["strategy", "briefing"],
    createdAt: "2026-06-05T00:00:00.000Z",
  },
  {
    id: "p3",
    title: "Content Engine",
    text: "Baue aus dieser Idee eine Content-Serie mit Positionierung, Hook-Varianten, Formaten und Produktionsworkflow.",
    tags: ["content", "workflow"],
    createdAt: "2026-06-05T00:00:00.000Z",
  },
];

const seedActivity = [
  {
    id: "a1",
    title: "Workspace initialisiert",
    detail: "Digital World Dashboard V1.2",
    color: "#18d4c5",
    time: "jetzt",
    createdAt: "2026-06-05T00:00:00.000Z",
  },
  {
    id: "a2",
    title: "Workflow-Vorlagen geladen",
    detail: "Lead, Content, Support",
    color: "#f6b84d",
    time: "02:15",
    createdAt: "2026-06-05T00:00:00.000Z",
  },
];

function createSeedData() {
  return {
    version: 2,
    settings: {
      workspaceName: "Digital World",
      defaultModel: "gpt-4.1-mini",
      defaultProviderId: "ollama",
      providerRouting: {},
      providerMode: "backend",
      monthlyPlatformAlternativeEur: 600,
    },
    agents: structuredClone(seedAgents),
    workflows: structuredClone(seedWorkflows),
    prompts: structuredClone(seedPrompts),
    runs: [],
    activity: structuredClone(seedActivity),
    aiProviders: createDefaultAiProviders(),
    connectors: [
      {
        id: "ollama",
        name: "Ollama lokal",
        type: "llm",
        status: "optional",
        description: "Lokaler LLM-Endpunkt fuer private Tests.",
      },
      {
        id: "openai-compatible",
        name: "OpenAI-kompatibel",
        type: "llm",
        status: "optional",
        description: "Serverseitige API-Bridge fuer gehostete Modelle.",
      },
      {
        id: "webhook",
        name: "Webhook Runner",
        type: "automation",
        status: "ready",
        description: "Startet n8n, Make oder eigene Worker per JSON-Webhook.",
      },
    ],
  };
}

module.exports = {
  createSeedData,
  seedAgents,
  seedWorkflows,
  seedPrompts,
};
