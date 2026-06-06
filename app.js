const STORAGE_KEY = "digital-world-ki-dashboard-v1";

const icons = {
  home: "icon-home",
  chat: "icon-chat",
  flow: "icon-flow",
  drive: "icon-drive",
  agents: "icon-agents",
  settings: "icon-settings",
  sparkles: "icon-sparkles",
  slides: "icon-slides",
  table: "icon-table",
  doc: "icon-doc",
  code: "icon-code",
  image: "icon-image",
  video: "icon-video",
  calendar: "icon-calendar",
  star: "icon-star",
  copy: "icon-copy",
  server: "icon-server",
};

const navItems = [
  { id: "home", label: "Startseite", icon: icons.home, target: "top" },
  { id: "chat", label: "KI-Chat", icon: icons.chat, target: "command" },
  { id: "workflows", label: "Workflows", icon: icons.flow, target: "workflows" },
  { id: "drive", label: "Laufwerk", icon: icons.drive, target: "vault" },
  { id: "agents", label: "Agenten", icon: icons.agents, target: "agents" },
  { id: "settings", label: "KI-Setup", icon: icons.settings, target: "settings" },
];

const modes = [
  { id: "auto", label: "Auto" },
  { id: "research", label: "Recherche" },
  { id: "content", label: "Content" },
  { id: "code", label: "Code" },
  { id: "meeting", label: "Meeting" },
];

const toolGroups = [
  {
    title: "KI-Mitarbeiter",
    tools: [
      {
        id: "claw",
        label: "Claw",
        icon: icons.sparkles,
        accent: "#ff6a4b",
        template: "Claw, plane eine Automatisierung fuer: ",
      },
      {
        id: "researcher",
        label: "Research",
        icon: icons.chat,
        accent: "#18d4c5",
        template: "Recherchiere die wichtigsten Fakten, Risiken und Chancen zu: ",
      },
    ],
  },
  {
    title: "Office-Suite",
    tools: [
      {
        id: "slides",
        label: "KI-Folien",
        icon: icons.slides,
        accent: "#f6b84d",
        template: "Erstelle eine Praesentation mit Struktur, Folienlogik und Sprecherhinweisen zu: ",
      },
      {
        id: "tables",
        label: "KI-Tabellen",
        icon: icons.table,
        accent: "#75d66b",
        template: "Baue eine Tabelle mit Spalten, Formeln und Auswertung fuer: ",
      },
      {
        id: "docs",
        label: "KI-Dokumente",
        icon: icons.doc,
        accent: "#3d8bff",
        template: "Schreibe ein strukturiertes Dokument mit Executive Summary zu: ",
      },
    ],
  },
  {
    title: "Design & Code",
    tools: [
      {
        id: "design",
        label: "Design",
        icon: icons.image,
        accent: "#8f7aff",
        template: "Entwirf ein klares UI-Konzept mit Komponenten, Farben und Nutzerfluss fuer: ",
      },
      {
        id: "code",
        label: "Code",
        icon: icons.code,
        accent: "#3d8bff",
        template: "Analysiere den Code-Plan und erstelle Implementierungsschritte fuer: ",
      },
    ],
  },
  {
    title: "Content-Erstellung",
    tools: [
      {
        id: "ai-chat",
        label: "KI-Chat",
        icon: icons.chat,
        accent: "#3d8bff",
        template: "Antworte als strategischer KI-Assistent auf: ",
      },
      {
        id: "image",
        label: "KI-Bild",
        icon: icons.image,
        accent: "#8f7aff",
        template: "Erstelle einen Bildprompt mit Stil, Motiv und Format fuer: ",
      },
      {
        id: "video",
        label: "KI-Video",
        icon: icons.video,
        accent: "#f6b84d",
        template: "Plane ein kurzes KI-Video mit Szenen, Voiceover und CTA fuer: ",
      },
    ],
  },
  {
    title: "Werkzeuge",
    tools: [
      {
        id: "meeting-notes",
        label: "Notizen",
        icon: icons.calendar,
        accent: "#18d4c5",
        template: "Verdichte dieses Meeting in Entscheidungen, Aufgaben und offenen Punkten: ",
      },
      {
        id: "agents",
        label: "KI-Agenten",
        icon: icons.agents,
        accent: "#aaa9a4",
        template: "Entwerfe einen Agenten mit Rolle, Tools, Triggern und Grenzen fuer: ",
      },
      {
        id: "api-router",
        label: "API-Router",
        icon: icons.server,
        accent: "#ff6a4b",
        template: "Plane eine API-Route, die diesen KI-Prozess sicher kapselt: ",
      },
    ],
  },
];

const agents = [
  {
    id: "automations",
    name: "Claw Automations",
    role: "Make, n8n, Webhooks",
    initials: "CA",
    color: "#ff6a4b",
  },
  {
    id: "research",
    name: "Research Scout",
    role: "Markt, Quellen, Vergleiche",
    initials: "RS",
    color: "#18d4c5",
  },
  {
    id: "content",
    name: "Content Pilot",
    role: "Posts, Newsletter, Skripte",
    initials: "CP",
    color: "#f6b84d",
  },
  {
    id: "code",
    name: "Code Operator",
    role: "Reviews, Fixes, Deployments",
    initials: "CO",
    color: "#8f7aff",
  },
];

const workflowSeeds = [
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

const promptSeeds = [
  {
    id: "p1",
    title: "Automation Blueprint",
    text: "Erstelle fuer diesen Prozess einen Automationsplan mit Trigger, Datenquellen, Fehlerfaellen, Tools und erstem MVP.",
  },
  {
    id: "p2",
    title: "Executive Briefing",
    text: "Fasse dieses Thema fuer eine Geschaeftsentscheidung zusammen: Kontext, Optionen, Risiko, Empfehlung, naechste Schritte.",
  },
  {
    id: "p3",
    title: "Content Engine",
    text: "Baue aus dieser Idee eine Content-Serie mit Positionierung, Hook-Varianten, Formaten und Produktionsworkflow.",
  },
];

const activitySeeds = [
  {
    id: "a1",
    title: "Workspace initialisiert",
    detail: "Digital World Dashboard V1",
    color: "#18d4c5",
    time: "jetzt",
  },
  {
    id: "a2",
    title: "Workflow-Vorlagen geladen",
    detail: "Lead, Content, Support",
    color: "#f6b84d",
    time: "02:15",
  },
];

const defaultState = {
  activeNav: "home",
  mode: "auto",
  selectedTool: "ai-chat",
  selectedAgentId: "automations",
  selectedWorkflowId: "lead-research",
  favorites: ["claw", "slides", "ai-chat", "agents"],
  runs: [],
  prompts: promptSeeds,
  workflows: workflowSeeds,
  serverAgents: agents,
  activeAgents: ["automations", "research"],
  activity: activitySeeds,
  aiProviders: [],
  metrics: null,
  settings: {
    providerMode: "backend",
    backendUrl: "",
    modelName: "gpt-4.1-mini",
    workspaceName: "Digital World",
    defaultProviderId: "",
    providerRouting: {},
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

let state = loadState();
let runTimers = new Map();
let selectedRunId = null;
let selectedSetupProviderId = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const saved = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...saved,
      settings: { ...defaultState.settings, ...(saved.settings || {}) },
      prompts: saved.prompts?.length ? saved.prompts : promptSeeds,
      workflows: saved.workflows?.length ? saved.workflows : workflowSeeds,
      activity: saved.activity?.length ? saved.activity : activitySeeds,
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid() {
  return globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function canUseBackend() {
  return state.settings.providerMode === "backend";
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    let message = `Backend ${response.status}`;
    try {
      const data = await response.json();
      message = data.error || message;
    } catch {
      // Keep the status-based message when the response is not JSON.
    }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

function applyServerState(serverState) {
  state.prompts = serverState.prompts || state.prompts;
  state.workflows = serverState.workflows || state.workflows;
  state.serverAgents = serverState.agents || state.serverAgents || agents;
  state.activeAgents = state.serverAgents.filter((agent) => agent.active).map((agent) => agent.id);
  if (!state.serverAgents.some((agent) => agent.id === state.selectedAgentId)) {
    state.selectedAgentId = state.serverAgents[0]?.id || "automations";
  }
  if (!state.workflows.some((workflow) => workflow.id === state.selectedWorkflowId)) {
    state.selectedWorkflowId = state.workflows[0]?.id || "lead-research";
  }
  state.runs = serverState.runs || state.runs;
  state.activity = serverState.activity || state.activity;
  state.aiProviders = serverState.aiProviders || state.aiProviders || [];
  state.metrics = serverState.metrics || state.metrics;
  if (serverState.settings) {
    state.settings.workspaceName = serverState.settings.workspaceName || state.settings.workspaceName;
    state.settings.modelName = serverState.settings.defaultModel || state.settings.modelName;
    state.settings.defaultProviderId =
      serverState.settings.defaultProviderId ?? state.settings.defaultProviderId;
    state.settings.providerRouting =
      serverState.settings.providerRouting || state.settings.providerRouting || {};
  }
  persist();
}

async function hydrateFromBackend() {
  if (!canUseBackend()) return false;
  try {
    const serverState = await apiRequest("/api/state", { cache: "no-store" });
    applyServerState(serverState);
    render();
    return true;
  } catch {
    return false;
  }
}

function icon(id) {
  return `<svg aria-hidden="true"><use href="#${id}"></use></svg>`;
}

function allTools() {
  return toolGroups.flatMap((group) => group.tools);
}

function getTool(id = state.selectedTool) {
  return allTools().find((tool) => tool.id === id) || allTools()[0];
}

function toast(message) {
  const region = $("#toastRegion");
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  region.append(item);
  setTimeout(() => item.remove(), 3200);
}

function nowLabel() {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function render() {
  renderNav();
  renderModes();
  renderTools();
  renderMetrics();
  renderRuns();
  renderAgents();
  renderAgentStudio();
  renderWorkflows();
  renderWorkflowRunner();
  renderPrompts();
  renderActivity();
  renderSettings();
  renderAiSetup();
  updateActiveToolChip();
}

function renderNav() {
  $("#mainNav").innerHTML = navItems
    .map(
      (item) => `
        <button class="nav-item ${state.activeNav === item.id ? "is-active" : ""}" type="button" data-nav="${item.id}">
          ${icon(item.icon)}
          <span>${item.label}</span>
        </button>
      `,
    )
    .join("");
}

function renderModes() {
  $("#modeTabs").innerHTML = modes
    .map(
      (mode) => `
        <button class="mode-tab ${state.mode === mode.id ? "is-active" : ""}" type="button" data-mode="${mode.id}">
          ${mode.label}
        </button>
      `,
    )
    .join("");
}

function renderTools() {
  $("#toolStrip").innerHTML = toolGroups
    .map(
      (group) => `
        <div class="tool-group">
          <div class="tool-group-header">
            <span>${group.title}</span>
          </div>
          <div class="tool-grid">
            ${group.tools
              .map(
                (tool) => `
                  <button
                    class="tool-button ${state.selectedTool === tool.id ? "is-active" : ""} ${state.favorites.includes(tool.id) ? "is-favorite" : ""}"
                    style="--accent: ${tool.accent}"
                    type="button"
                    data-tool="${tool.id}"
                    data-tooltip="${tool.label}"
                  >
                    <i class="favorite-dot"></i>
                    ${icon(tool.icon)}
                    <span>${tool.label}</span>
                  </button>
                `,
              )
              .join("")}
          </div>
        </div>
      `,
    )
    .join("");
}

function renderMetrics() {
  const serverMetrics = state.metrics || {};
  const completed = serverMetrics.completedRuns ?? state.runs.filter((run) => run.status === "done").length;
  const activeWorkflows =
    serverMetrics.activeWorkflows ?? state.workflows.filter((workflow) => workflow.active).length;
  const totalWorkflows = serverMetrics.totalWorkflows ?? state.workflows.length;
  const activeAgents = serverMetrics.activeAgents ?? state.activeAgents.length;
  const totalAgents = serverMetrics.totalAgents ?? (state.serverAgents || agents).length;
  const prompts = serverMetrics.prompts ?? state.prompts.length;
  const savedPlatformMonthlyEur = serverMetrics.savedPlatformMonthlyEur ?? 0;
  const metrics = [
    {
      label: "Gesparte Plattformkosten",
      value: `${savedPlatformMonthlyEur} EUR`,
      detail: "monatliche Plattform-Alternative",
      icon: icons.server,
      color: "#18d4c5",
    },
    {
      label: "Aktive Workflows",
      value: String(activeWorkflows),
      detail: `${totalWorkflows} Vorlagen im Workspace`,
      icon: icons.flow,
      color: "#f6b84d",
    },
    {
      label: "KI-Mitarbeiter",
      value: String(activeAgents),
      detail: `${totalAgents} Rollen vorbereitet`,
      icon: icons.agents,
      color: "#8f7aff",
    },
    {
      label: "Vault",
      value: String(prompts),
      detail: `${completed} Auftraege abgeschlossen`,
      icon: icons.drive,
      color: "#75d66b",
    },
  ];

  $("#metricsRow").innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric" style="--metric-color: ${metric.color}">
          <div class="metric-top">
            <div>
              <h3>${metric.label}</h3>
              <strong>${metric.value}</strong>
            </div>
            <div class="metric-icon">${icon(metric.icon)}</div>
          </div>
          <small>${metric.detail}</small>
        </article>
      `,
    )
    .join("");
}

function renderRuns() {
  const runs = state.runs.slice(0, 6);
  $("#runList").innerHTML = runs.length
    ? runs
        .map(
          (run) => `
            <div class="run-item">
              <div class="run-head">
                <div class="run-title">
                  <strong>${escapeHtml(run.title)}</strong>
                  <span>${run.toolLabel} · ${run.model || state.settings.modelName}</span>
                </div>
                <span class="run-status ${run.status === "done" ? "is-done" : "is-running"}">${run.status === "done" ? "fertig" : "läuft"}</span>
              </div>
              <div class="run-progress" style="--progress: ${run.progress}%"><span></span></div>
              ${run.output ? `<p class="run-output">${escapeHtml(run.output)}</p>` : ""}
              ${
                run.output
                  ? `<div class="run-actions"><button class="subtle-button" type="button" data-run-open="${run.id}">Ergebnis öffnen</button></div>`
                  : ""
              }
            </div>
          `,
        )
        .join("")
    : `<div class="empty-state">Noch keine Auftraege in der Queue.</div>`;
}

function renderAgents() {
  const visibleAgents = getVisibleAgents();
  $("#agentList").innerHTML = visibleAgents
    .map((agent) => {
      const active = "active" in agent ? agent.active : state.activeAgents.includes(agent.id);
      const providerLabel = getProviderLabel(agent.providerId || getProviderIdForTool("agents"));
      return `
        <div class="agent-row ${state.selectedAgentId === agent.id ? "is-selected" : ""}" data-agent-select="${agent.id}">
          <div class="agent-left">
            <div class="agent-avatar" style="--agent-color: ${agent.color}">${agent.initials}</div>
            <div class="agent-meta">
              <strong>${agent.name}</strong>
              <span>${agent.role} · ${escapeHtml(providerLabel)}</span>
            </div>
          </div>
          <button class="agent-toggle ${active ? "is-on" : ""}" type="button" data-agent="${agent.id}">
            ${active ? "on" : "off"}
          </button>
        </div>
      `;
    })
    .join("");
}

function renderAgentStudio() {
  const visibleAgents = getVisibleAgents();
  if (!visibleAgents.length) return;
  if (!visibleAgents.some((agent) => agent.id === state.selectedAgentId)) {
    state.selectedAgentId = visibleAgents[0].id;
  }
  const agent = getSelectedAgent();
  const providerValue = agent.providerId || "";
  const providerOptions = [
    `<option value="">Routing/Standard verwenden</option>`,
    ...(state.aiProviders || []).map((provider) => {
      const status = provider.enabled ? "aktiv" : provider.apiKeySet ? "Key gespeichert" : "nicht aktiv";
      return `<option value="${escapeHtml(provider.id)}">${escapeHtml(provider.name)} · ${status}</option>`;
    }),
  ].join("");

  $("#agentSelect").innerHTML = visibleAgents
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.name)}</option>`)
    .join("");
  $("#agentSelect").value = agent.id;
  $("#agentProviderId").innerHTML = providerOptions;
  $("#agentProviderId").value = providerValue;
  $("#agentModel").value = agent.model || "";
  $("#agentInstructions").value = agent.instructions || "";
  $("#agentBrief").innerHTML = `
    <strong>${escapeHtml(agent.name)} · ${agent.active ? "aktiv" : "pausiert"}</strong>
    <span>${escapeHtml(agent.role)} · Provider: ${escapeHtml(getProviderLabel(agent.providerId || getProviderIdForTool("agents")))}</span>
    <div class="agent-tags">
      ${(agent.tools || []).map((tool) => `<span>${escapeHtml(tool)}</span>`).join("")}
    </div>
  `;
}

function getVisibleAgents() {
  return state.serverAgents?.length ? state.serverAgents : agents;
}

function getSelectedAgent() {
  return getVisibleAgents().find((agent) => agent.id === state.selectedAgentId) || getVisibleAgents()[0];
}

function renderWorkflows() {
  $("#workflowList").innerHTML = state.workflows
    .map(
      (workflow) => `
        <div class="workflow-row ${state.selectedWorkflowId === workflow.id ? "is-selected" : ""}" data-workflow-select="${workflow.id}">
          <div class="workflow-head">
            <div class="workflow-title">
              <strong>${escapeHtml(workflow.title)}</strong>
              <span>${escapeHtml(workflow.subtitle)}</span>
            </div>
            <div class="workflow-row-actions">
              <button class="subtle-button" type="button" data-workflow-run="${workflow.id}">Start</button>
              <button class="workflow-status ${workflow.active ? "is-active" : ""}" type="button" data-workflow="${workflow.id}">
                ${workflow.active ? "aktiv" : "pause"}
              </button>
            </div>
          </div>
          <div class="workflow-steps">
            ${workflow.steps.map((step) => `<span>${escapeHtml(step)}</span>`).join("")}
          </div>
          <div class="workflow-meta">
            <span>${escapeHtml(workflow.owner || "Digital World")}</span>
            <span>${workflow.webhookUrl ? "Webhook aktiv" : "lokaler Test"}</span>
            ${workflow.lastStatus ? `<span>${escapeHtml(workflow.lastStatus)}</span>` : ""}
            ${workflow.lastRunAt ? `<span>${formatRunDate(workflow.lastRunAt)}</span>` : ""}
          </div>
        </div>
      `,
    )
    .join("");
}

function renderWorkflowRunner() {
  const workflow = getSelectedWorkflow();
  const workflows = state.workflows || [];
  if (!workflow || !workflows.length) return;
  $("#workflowSelect").innerHTML = workflows
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.title)}</option>`)
    .join("");
  $("#workflowSelect").value = workflow.id;
  $("#workflowTrigger").value = workflow.trigger || "";
  $("#workflowOwner").value = workflow.owner || "";
  $("#workflowWebhookUrl").value = workflow.webhookUrl || "";
  const payloadField = $("#workflowPayload");
  if (payloadField.dataset.workflowId !== workflow.id && !payloadField.value.trim()) {
    payloadField.dataset.workflowId = workflow.id;
  }
  payloadField.placeholder = `Teste ${workflow.title} mit einem konkreten Auftrag oder JSON-Hinweis.`;
  $("#workflowBrief").innerHTML = `
    <strong>${escapeHtml(workflow.title)} · ${workflow.active ? "aktiv" : "pausiert"}</strong>
    <span>${escapeHtml(workflow.subtitle || "Workflow")}</span>
    <div class="agent-tags">
      ${(workflow.steps || []).map((step) => `<span>${escapeHtml(step)}</span>`).join("")}
    </div>
    <div class="workflow-meta">
      <span>${workflow.webhookUrl ? "Webhook verbunden" : "kein Webhook"}</span>
      ${workflow.lastStatus ? `<span>${escapeHtml(workflow.lastStatus)}</span>` : ""}
      ${workflow.lastRunAt ? `<span>${formatRunDate(workflow.lastRunAt)}</span>` : ""}
    </div>
    ${
      workflow.lastResponse
        ? `<p class="workflow-last-response">${escapeHtml(workflow.lastResponse)}</p>`
        : ""
    }
  `;
}

function getSelectedWorkflow() {
  const workflows = state.workflows || [];
  if (!workflows.some((workflow) => workflow.id === state.selectedWorkflowId)) {
    state.selectedWorkflowId = workflows[0]?.id || "lead-research";
  }
  return workflows.find((workflow) => workflow.id === state.selectedWorkflowId) || workflows[0];
}

function renderPrompts() {
  $("#promptList").innerHTML = state.prompts.length
    ? state.prompts
        .slice(0, 6)
        .map(
          (prompt) => `
            <div class="prompt-row" data-prompt="${prompt.id}">
              <div class="prompt-title">
                <strong>${escapeHtml(prompt.title)}</strong>
                <span>${escapeHtml(prompt.text)}</span>
              </div>
              ${icon(icons.copy)}
            </div>
          `,
        )
        .join("")
    : `<div class="empty-state">Noch keine Vorlagen gespeichert.</div>`;
}

function renderActivity() {
  $("#activityList").innerHTML = state.activity
    .slice(0, 7)
    .map(
      (item) => `
        <div class="activity-row">
          <span class="activity-dot" style="--activity-color: ${item.color}"></span>
          <div class="activity-title">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.detail)} · ${item.time}</span>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderSettings() {
  $("#providerMode").value = state.settings.providerMode;
  $("#backendUrl").value = getBackendUrl(false);
  $("#modelName").value = state.settings.modelName;
  $("#workspaceName").value = state.settings.workspaceName;
  const providerOptions = [
    `<option value="">Backend .env / Auto</option>`,
    ...(state.aiProviders || []).map((provider) => {
      const status = provider.enabled ? "aktiv" : provider.apiKeySet ? "Key gespeichert" : "nicht aktiv";
      return `<option value="${escapeHtml(provider.id)}">${escapeHtml(provider.name)} · ${status}</option>`;
    }),
  ].join("");
  $("#defaultProviderId").innerHTML = providerOptions;
  $("#defaultProviderId").value = state.settings.defaultProviderId || "";
  renderProviderRouting();
}

function renderAiSetup() {
  const providers = state.aiProviders || [];
  if (!providers.length) {
    $("#aiProviderList").innerHTML = `<div class="empty-state">Noch keine Provider vom Backend geladen.</div>`;
    $("#providerCount").textContent = "0 aktiv";
    return;
  }

  if (!selectedSetupProviderId || !providers.some((provider) => provider.id === selectedSetupProviderId)) {
    selectedSetupProviderId = providers.some((provider) => provider.id === state.settings.defaultProviderId)
      ? state.settings.defaultProviderId
      : providers[0].id;
  }

  const activeCount = providers.filter((provider) => provider.enabled).length;
  $("#providerCount").textContent = `${activeCount} aktiv`;
  $("#aiProviderList").innerHTML = providers
    .map((provider) => {
      const keyState = provider.keyRequired
        ? provider.apiKeySet
          ? "Key gespeichert"
          : "Key fehlt"
        : "kein Key nötig";
      return `
        <button
          class="provider-card ${provider.id === selectedSetupProviderId ? "is-selected" : ""} ${provider.enabled ? "is-active" : ""}"
          type="button"
          data-provider-select="${escapeHtml(provider.id)}"
        >
          <div class="provider-card-head">
            <div>
              <strong>${escapeHtml(provider.name)}</strong>
              <small>${escapeHtml(provider.category || provider.company || "KI")}</small>
            </div>
            <small>${provider.enabled ? "ON" : "OFF"}</small>
          </div>
          <p>${escapeHtml(provider.description || "")}</p>
          <div class="provider-badges">
            <span>${escapeHtml(provider.adapter)}</span>
            <span class="${provider.keyRequired && !provider.apiKeySet ? "is-warn" : "is-ok"}">${keyState}</span>
          </div>
        </button>
      `;
    })
    .join("");

  renderProviderEditor();
}

function renderProviderRouting() {
  const routeContainer = $("#providerRoutingList");
  if (!routeContainer) return;
  const providers = state.aiProviders || [];
  const routeOptions = [
    `<option value="">Standard-Provider verwenden</option>`,
    ...providers.map((provider) => {
      const status = provider.enabled ? "aktiv" : provider.apiKeySet ? "Key gespeichert" : "nicht aktiv";
      return `<option value="${escapeHtml(provider.id)}">${escapeHtml(provider.name)} · ${status}</option>`;
    }),
  ].join("");

  routeContainer.innerHTML = allTools()
    .map((tool) => {
      const selected = state.settings.providerRouting?.[tool.id] || "";
      return `
        <label class="routing-row">
          <span class="routing-tool" style="--route-color: ${tool.accent}">
            ${icon(tool.icon)}
            <span>${escapeHtml(tool.label)}</span>
          </span>
          <select data-route-tool="${escapeHtml(tool.id)}" aria-label="Provider fuer ${escapeHtml(tool.label)}">
            ${routeOptions}
          </select>
        </label>
      `.replace(
        `value="${escapeHtml(selected)}"`,
        `value="${escapeHtml(selected)}" selected`,
      );
    })
    .join("");

  for (const select of $$("[data-route-tool]")) {
    select.value = state.settings.providerRouting?.[select.dataset.routeTool] || "";
  }
}

function getSelectedSetupProvider() {
  return (state.aiProviders || []).find((provider) => provider.id === selectedSetupProviderId);
}

function renderProviderEditor() {
  const provider = getSelectedSetupProvider();
  if (!provider) return;
  $("#setupProviderCategory").textContent = provider.category || provider.company || "Provider";
  $("#setupProviderName").textContent = provider.name;
  $("#setupProviderStatus").textContent = provider.enabled ? "aktiv" : "nicht aktiv";
  $("#setupProviderEnabled").checked = Boolean(provider.enabled);
  $("#setupProviderBaseUrl").value = provider.baseUrl || "";
  $("#setupProviderModel").value = provider.model || "";
  $("#setupProviderApiKey").value = "";
  $("#setupProviderApiKey").placeholder = provider.apiKeySet
    ? `${provider.apiKeyMasked} gespeichert · neuen Key eingeben zum Ersetzen`
    : provider.keyRequired
      ? "API-Key erforderlich"
      : "Optional";
  $("#setupProviderHint").textContent = provider.keyRequired
    ? "Dieser Anbieter braucht einen eigenen API-Key. Der Key wird serverseitig gespeichert und in Exporten maskiert."
    : "Dieser Anbieter kann ohne Key laufen, wenn dein lokaler Server keine Authentifizierung verlangt.";
}

function updateActiveToolChip() {
  const tool = getTool();
  $("#activeToolChip").innerHTML = `${icon(tool.icon)}<span>${tool.label}</span>`;
}

function selectTool(toolId) {
  const tool = getTool(toolId);
  state.selectedTool = tool.id;
  const input = $("#commandInput");
  if (!input.value.trim()) {
    input.placeholder = tool.template;
  }
  addActivity(`${tool.label} gewählt`, "Tool bereit", tool.accent);
  persist();
  render();
}

function selectMode(modeId) {
  state.mode = modeId;
  persist();
  renderModes();
}

function addActivity(title, detail, color = "#18d4c5") {
  state.activity.unshift({
    id: uid(),
    title,
    detail,
    color,
    time: nowLabel(),
  });
  state.activity = state.activity.slice(0, 30);
}

async function savePrompt() {
  const text = $("#commandInput").value.trim();
  if (!text) {
    toast("Kein Prompt im Eingabefeld.");
    return;
  }
  const title = text.slice(0, 42).replace(/\s+/g, " ");
  if (canUseBackend()) {
    try {
      await apiRequest("/api/prompts", {
        method: "POST",
        body: JSON.stringify({ title, text }),
      });
      await hydrateFromBackend();
      toast("Vorlage im Backend gespeichert.");
      return;
    } catch (error) {
      toast(`Backend-Fallback: ${error.message}`);
    }
  }
  state.prompts.unshift({
    id: uid(),
    title,
    text,
  });
  addActivity("Vorlage gespeichert", title, "#75d66b");
  persist();
  render();
  toast("Vorlage gespeichert.");
}

async function copyPrompt() {
  const text = $("#commandInput").value.trim();
  if (!text) {
    toast("Kein Prompt zum Kopieren.");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    toast("Prompt kopiert.");
  } catch {
    $("#commandInput").select();
    document.execCommand("copy");
    toast("Prompt kopiert.");
  }
}

function createRun(prompt) {
  const tool = getTool();
  const run = {
    id: uid(),
    title: buildRunTitle(prompt, tool),
    prompt,
    toolId: tool.id,
    toolLabel: tool.label,
    status: "running",
    progress: 12,
    model: state.settings.modelName,
    provider: state.settings.providerMode === "mock" ? "demo" : getActiveProviderLabel(tool.id),
    output: "",
    createdAt: Date.now(),
  };
  state.runs.unshift(run);
  state.runs = state.runs.slice(0, 20);
  addActivity("Auftrag gestartet", run.title, tool.accent);
  persist();
  render();
  return run;
}

function buildRunTitle(prompt, tool) {
  const cleaned = prompt.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 58) return `${tool.label}: ${cleaned}`;
  return `${tool.label}: ${cleaned.slice(0, 55)}...`;
}

async function runCommand() {
  const input = $("#commandInput");
  const prompt = input.value.trim();
  if (!prompt) {
    toast("Schreib zuerst einen Auftrag.");
    input.focus();
    return;
  }

  const run = createRun(prompt);
  const useBackend = state.settings.providerMode === "backend";
  if (!useBackend) {
    simulateRun(run);
    input.value = "";
    return;
  }

  try {
    await runViaBackend(run, prompt);
  } catch (error) {
    run.output = [
      `Provider- oder Backend-Fehler: ${error.message}`,
      "",
      `Demo-Ergebnis: ${mockOutput(prompt)}`,
    ].join("\n");
    run.progress = 100;
    run.status = "done";
    addActivity("Demo-Fallback genutzt", error.message, "#ff6a4b");
    persist();
    render();
  } finally {
    input.value = "";
  }
}

function simulateRun(run) {
  if (runTimers.has(run.id)) clearInterval(runTimers.get(run.id));
  const timer = setInterval(() => {
    const current = state.runs.find((item) => item.id === run.id);
    if (!current) {
      clearInterval(timer);
      return;
    }
    current.progress = Math.min(100, current.progress + 14 + Math.round(Math.random() * 15));
    if (current.progress >= 100) {
      current.status = "done";
      current.output = mockOutput(current.prompt);
      addActivity("Auftrag abgeschlossen", current.title, "#75d66b");
      clearInterval(timer);
      runTimers.delete(run.id);
    }
    persist();
    render();
  }, 650);
  runTimers.set(run.id, timer);
}

async function runViaBackend(run, prompt) {
  const timer = setInterval(() => {
    const current = state.runs.find((item) => item.id === run.id);
    if (current && current.status === "running") {
      current.progress = Math.min(86, current.progress + 7);
      persist();
      renderRuns();
    }
  }, 420);
  runTimers.set(run.id, timer);

  const response = await fetch(`${getBackendUrl()}/api/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      mode: state.mode,
      tool: getTool(),
      model: state.settings.modelName,
      providerId: getProviderIdForTool(getTool().id) || undefined,
      workspace: state.settings.workspaceName,
    }),
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }
  const data = await response.json();
  const current = state.runs.find((item) => item.id === run.id);
  if (current) {
    current.progress = 100;
    current.status = "done";
    current.model = data.run?.model || data.model || state.settings.modelName;
    current.provider = data.run?.provider || data.provider;
    current.output = data.run?.output || data.reply || mockOutput(prompt);
    addActivity("Backend-Antwort erhalten", current.title, "#18d4c5");
  }
  clearInterval(timer);
  runTimers.delete(run.id);
  persist();
  await hydrateFromBackend();
  render();
}

async function readResponseError(response) {
  try {
    const data = await response.clone().json();
    return data.error || `Backend ${response.status}`;
  } catch {
    try {
      const text = await response.text();
      return text || `Backend ${response.status}`;
    } catch {
      return `Backend ${response.status}`;
    }
  }
}

function mockOutput(prompt) {
  const tool = getTool();
  const normalized = prompt.toLowerCase();
  if (normalized.includes("was genau") && normalized.includes("ki")) {
    return [
      "Demo-Antwort (kein echter KI-Provider):",
      "",
      "KI steht fuer Kuenstliche Intelligenz. Gemeint sind Software-Systeme, die Aufgaben erledigen, fuer die man frueher menschliches Denken gebraucht haette: Texte verstehen, Informationen zusammenfassen, Bilder erzeugen, Code schreiben, Entscheidungen vorbereiten oder Prozesse automatisieren.",
      "",
      "Wichtig ist: KI ist nicht automatisch ein fertiger Mitarbeiter. Sie wird erst nuetzlich, wenn du ihr Kontext, Daten, Tools und klare Ziele gibst.",
      "",
      "Fuer dieses Dashboard bedeutet KI:",
      "1. Chat: Fragen beantworten und Ideen ausarbeiten.",
      "2. Research: Themen strukturieren und Quellenarbeit vorbereiten.",
      "3. Content: Posts, Skripte, Newsletter und Bilder planen.",
      "4. Agents: wiederkehrende Aufgaben mit Rollen und Tools ausfuehren.",
      "5. Workflows: KI-Schritte mit Automationen wie n8n, Make oder Webhooks verbinden.",
      "",
      "Wenn du echte Modellantworten statt Demo-Text willst, verbinde im Backend Ollama oder einen OpenAI-kompatiblen Provider.",
    ].join("\n");
  }
  const plan = {
    "api-router": "Demo-Antwort: Route, Auth, Logging und Retry-Strategie sind skizziert. Naechster Schritt: konkreten Request/Response-Vertrag definieren.",
    code: "Demo-Antwort: Implementierung in kleine Tasks zerlegt, inklusive Tests und Rollback-Punkt. Naechster Schritt: Ziel-Repository anbinden.",
    slides: "Demo-Antwort: Deck-Struktur mit 7 Folien, Storyline und Abschlussfolie vorbereitet. Naechster Schritt: Zielgruppe und Tonalitaet festlegen.",
    tables: "Demo-Antwort: Tabellenmodell mit Spalten, Kennzahlen und Auswertung angelegt. Naechster Schritt: Datenquelle verbinden.",
    image: "Demo-Antwort: Bildprompt mit Motiv, Stil, Format und Negativhinweisen erstellt. Naechster Schritt: Bildmodell anbinden.",
    video: "Demo-Antwort: Szenenfolge, Voiceover und Produktionsliste vorbereitet. Naechster Schritt: Video-Tool anbinden.",
    "meeting-notes": "Demo-Antwort: Entscheidungen, Aufgaben und offene Punkte extrahiert. Naechster Schritt: Kalender oder Transkriptquelle verbinden.",
  };
  return (
    plan[tool.id] ||
    [
      "Demo-Antwort (kein echter KI-Provider):",
      "",
      `Ich habe deinen Auftrag verstanden: "${prompt.slice(0, 120)}"`,
      "",
      "Moeglicher naechster Arbeitsplan:",
      "1. Ziel und gewuenschtes Ergebnis klaeren.",
      "2. Benoetigte Datenquellen und Tools festlegen.",
      "3. Ersten MVP-Ablauf bauen.",
      "4. Ergebnis pruefen und als Workflow oder Vorlage speichern.",
      "",
      "Fuer echte Antworten bitte im Backend Ollama oder einen OpenAI-kompatiblen Provider konfigurieren.",
    ].join("\n")
  );
}

function getProviderIdForTool(toolId) {
  return state.settings.providerRouting?.[toolId] || state.settings.defaultProviderId || "";
}

function getActiveProviderLabel(toolId = state.selectedTool) {
  return getProviderLabel(getProviderIdForTool(toolId));
}

function getProviderLabel(providerId) {
  const provider = (state.aiProviders || []).find((item) => item.id === providerId);
  return provider?.name || "Dashboard Backend";
}

async function toggleAgent(agentId) {
  const visibleAgents = getVisibleAgents();
  const currentAgent = visibleAgents.find((item) => item.id === agentId);
  const currentlyActive =
    currentAgent && "active" in currentAgent ? currentAgent.active : state.activeAgents.includes(agentId);
  if (canUseBackend()) {
    try {
      await apiRequest(`/api/agents/${encodeURIComponent(agentId)}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !currentlyActive }),
      });
      await hydrateFromBackend();
      return;
    } catch (error) {
      toast(`Backend-Fallback: ${error.message}`);
    }
  }
  const active = state.activeAgents.includes(agentId);
  state.activeAgents = active
    ? state.activeAgents.filter((id) => id !== agentId)
    : [...state.activeAgents, agentId];
  state.serverAgents = (state.serverAgents || agents).map((agent) =>
    agent.id === agentId ? { ...agent, active: !active } : agent,
  );
  const agent = visibleAgents.find((item) => item.id === agentId) || {
    name: agentId,
    color: "#aaa9a4",
  };
  addActivity(active ? "Agent pausiert" : "Agent aktiviert", agent.name, agent.color);
  persist();
  render();
}

function selectAgent(agentId) {
  if (!getVisibleAgents().some((agent) => agent.id === agentId)) return;
  state.selectedAgentId = agentId;
  persist();
  renderAgents();
  renderAgentStudio();
}

function selectWorkflow(workflowId) {
  if (!state.workflows.some((workflow) => workflow.id === workflowId)) return;
  state.selectedWorkflowId = workflowId;
  persist();
  renderWorkflows();
  renderWorkflowRunner();
}

async function saveAgentProfile() {
  const agent = getSelectedAgent();
  if (!agent) return;
  const patch = {
    providerId: $("#agentProviderId").value,
    model: $("#agentModel").value.trim(),
    instructions: $("#agentInstructions").value.trim(),
  };
  if (canUseBackend()) {
    try {
      await apiRequest(`/api/agents/${encodeURIComponent(agent.id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      await hydrateFromBackend();
      toast(`${agent.name} gespeichert.`);
      return;
    } catch (error) {
      toast(`Agent konnte nicht gespeichert werden: ${error.message}`);
    }
  }
  state.serverAgents = getVisibleAgents().map((item) =>
    item.id === agent.id ? { ...item, ...patch } : item,
  );
  addActivity("Agent aktualisiert", agent.name, agent.color);
  persist();
  render();
}

async function runSelectedAgent() {
  const agent = getSelectedAgent();
  const prompt = $("#agentPrompt").value.trim();
  if (!agent) return;
  if (!prompt) {
    toast("Gib dem Agenten zuerst einen Auftrag.");
    $("#agentPrompt").focus();
    return;
  }
  if (!agent.active) {
    toast(`${agent.name} ist pausiert. Aktiviere den Agenten zuerst.`);
    return;
  }

  const run = createAgentRun(agent, prompt);
  if (!canUseBackend()) {
    simulateRun(run);
    $("#agentPrompt").value = "";
    return;
  }

  try {
    await runAgentViaBackend(run, agent, prompt);
    $("#agentPrompt").value = "";
  } catch (error) {
    run.output = [
      `Agent- oder Provider-Fehler: ${error.message}`,
      "",
      `Demo-Ergebnis: ${mockOutput(prompt)}`,
    ].join("\n");
    run.progress = 100;
    run.status = "done";
    addActivity("Agent-Fallback genutzt", error.message, agent.color);
    persist();
    render();
  }
}

function createAgentRun(agent, prompt) {
  const providerId = agent.providerId || getProviderIdForTool("agents");
  const run = {
    id: uid(),
    title: buildRunTitle(prompt, { label: agent.name }),
    prompt,
    mode: "agent",
    toolId: `agent-${agent.id}`,
    toolLabel: agent.name,
    agentId: agent.id,
    status: "running",
    progress: 12,
    model: agent.model || state.settings.modelName,
    provider: getProviderLabel(providerId),
    output: "",
    createdAt: Date.now(),
  };
  state.runs.unshift(run);
  state.runs = state.runs.slice(0, 20);
  addActivity("Agent gestartet", run.title, agent.color);
  persist();
  render();
  return run;
}

async function runAgentViaBackend(run, agent, prompt) {
  const timer = setInterval(() => {
    const current = state.runs.find((item) => item.id === run.id);
    if (current && current.status === "running") {
      current.progress = Math.min(88, current.progress + 6);
      persist();
      renderRuns();
    }
  }, 420);
  runTimers.set(run.id, timer);

  try {
    const response = await fetch(`${getBackendUrl()}/api/agents/${encodeURIComponent(agent.id)}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        providerId: agent.providerId || getProviderIdForTool("agents") || undefined,
        model: agent.model || undefined,
        workspace: state.settings.workspaceName,
      }),
    });

    if (!response.ok) throw new Error(await readResponseError(response));
    const data = await response.json();
    const current = state.runs.find((item) => item.id === run.id);
    if (current) {
      current.progress = 100;
      current.status = "done";
      current.model = data.run?.model || data.model || current.model;
      current.provider = data.run?.provider || data.provider || current.provider;
      current.output = data.run?.output || data.reply || mockOutput(prompt);
      addActivity("Agent-Antwort erhalten", current.title, agent.color);
    }
    persist();
    await hydrateFromBackend();
    render();
  } finally {
    clearInterval(timer);
    runTimers.delete(run.id);
  }
}

async function toggleWorkflow(workflowId) {
  const current = state.workflows.find((item) => item.id === workflowId);
  if (canUseBackend() && current) {
    try {
      await apiRequest(`/api/workflows/${encodeURIComponent(workflowId)}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !current.active }),
      });
      await hydrateFromBackend();
      return;
    } catch (error) {
      toast(`Backend-Fallback: ${error.message}`);
    }
  }
  state.workflows = state.workflows.map((workflow) =>
    workflow.id === workflowId ? { ...workflow, active: !workflow.active } : workflow,
  );
  const workflow = state.workflows.find((item) => item.id === workflowId);
  addActivity(workflow.active ? "Workflow aktiviert" : "Workflow pausiert", workflow.title, "#f6b84d");
  persist();
  render();
}

async function addWorkflow() {
  const count = state.workflows.length + 1;
  const payload = {
    title: `Custom Workflow ${count}`,
    subtitle: "Trigger, KI-Schritt und Ergebnisablage",
    active: false,
    steps: ["Trigger", "KI", "Output"],
  };
  if (canUseBackend()) {
    try {
      await apiRequest("/api/workflows", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await hydrateFromBackend();
      toast("Workflow im Backend angelegt.");
      return;
    } catch (error) {
      toast(`Backend-Fallback: ${error.message}`);
    }
  }
  state.workflows.unshift({
    id: uid(),
    ...payload,
  });
  addActivity("Workflow angelegt", `Custom Workflow ${count}`, "#f6b84d");
  persist();
  render();
}

async function saveWorkflowProfile() {
  const workflow = getSelectedWorkflow();
  if (!workflow) return;
  const patch = {
    trigger: $("#workflowTrigger").value.trim(),
    owner: $("#workflowOwner").value.trim(),
    webhookUrl: $("#workflowWebhookUrl").value.trim(),
  };
  if (canUseBackend()) {
    try {
      await apiRequest(`/api/workflows/${encodeURIComponent(workflow.id)}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      await hydrateFromBackend();
      toast(`${workflow.title} gespeichert.`);
      return;
    } catch (error) {
      toast(`Workflow konnte nicht gespeichert werden: ${error.message}`);
    }
  }
  state.workflows = state.workflows.map((item) =>
    item.id === workflow.id ? { ...item, ...patch } : item,
  );
  addActivity("Workflow aktualisiert", workflow.title, "#f6b84d");
  persist();
  render();
}

async function runSelectedWorkflow(workflowId = state.selectedWorkflowId) {
  if (workflowId !== state.selectedWorkflowId) {
    state.selectedWorkflowId = workflowId;
    persist();
  }
  const workflow = getSelectedWorkflow();
  if (!workflow) return;
  const prompt =
    $("#workflowPayload")?.value.trim() || `Manueller Testlauf fuer ${workflow.title}`;
  const run = createWorkflowRun(workflow, prompt);

  if (!canUseBackend()) {
    simulateRun(run);
    $("#workflowPayload").value = "";
    return;
  }

  try {
    await runWorkflowViaBackend(run, workflow, prompt);
    $("#workflowPayload").value = "";
  } catch (error) {
    run.progress = 100;
    run.status = "done";
    run.output = [
      `Workflow-Fehler: ${error.message}`,
      "",
      "Lokaler Hinweis: Pruefe Webhook-URL, Netzwerk und ob dein n8n/Make-Endpunkt aktiv ist.",
    ].join("\n");
    addActivity("Workflow-Fehler", workflow.title, "#ff6a4b");
    persist();
    render();
  }
}

function createWorkflowRun(workflow, prompt) {
  const run = {
    id: uid(),
    title: buildRunTitle(prompt, { label: workflow.title }),
    prompt,
    mode: "workflow",
    toolId: `workflow-${workflow.id}`,
    toolLabel: workflow.title,
    status: "running",
    progress: 12,
    model: workflow.webhookUrl ? "webhook-post" : "local-dry-run",
    provider: workflow.webhookUrl ? "Webhook Runner" : "Lokaler Workflow",
    output: "",
    createdAt: Date.now(),
  };
  state.runs.unshift(run);
  state.runs = state.runs.slice(0, 20);
  addActivity("Workflow gestartet", workflow.title, "#f6b84d");
  persist();
  render();
  return run;
}

async function runWorkflowViaBackend(run, workflow, prompt) {
  const timer = setInterval(() => {
    const current = state.runs.find((item) => item.id === run.id);
    if (current && current.status === "running") {
      current.progress = Math.min(88, current.progress + 8);
      persist();
      renderRuns();
    }
  }, 420);
  runTimers.set(run.id, timer);

  try {
    const response = await fetch(`${getBackendUrl()}/api/workflows/${encodeURIComponent(workflow.id)}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        workspace: state.settings.workspaceName,
      }),
    });

    if (!response.ok) throw new Error(await readResponseError(response));
    const backendRun = await response.json();
    const current = state.runs.find((item) => item.id === run.id);
    if (current) {
      current.progress = 100;
      current.status = "done";
      current.model = backendRun.model || current.model;
      current.provider = backendRun.provider || current.provider;
      current.output =
        backendRun.output ||
        `Workflow "${workflow.title}" wurde gestartet.`;
      addActivity("Workflow-Ergebnis erhalten", workflow.title, "#18d4c5");
    }
    persist();
    await hydrateFromBackend();
    render();
  } finally {
    clearInterval(timer);
    runTimers.delete(run.id);
  }
}

function seedPrompts() {
  const existing = new Set(state.prompts.map((prompt) => prompt.title));
  const additions = promptSeeds.filter((prompt) => !existing.has(prompt.title));
  if (!additions.length) {
    toast("Beispiele sind schon im Vault.");
    return;
  }
  state.prompts = [...additions, ...state.prompts];
  addActivity("Prompt-Beispiele geladen", `${additions.length} Vorlagen`, "#75d66b");
  persist();
  render();
}

async function clearRuns() {
  if (canUseBackend()) {
    try {
      const result = await apiRequest("/api/runs/completed", { method: "DELETE" });
      await hydrateFromBackend();
      toast(`${result.removed} Auftraege entfernt.`);
      return;
    } catch (error) {
      toast(`Backend-Fallback: ${error.message}`);
    }
  }
  state.runs = state.runs.filter((run) => run.status === "running");
  addActivity("Queue bereinigt", "Abgeschlossene Auftraege entfernt", "#aaa9a4");
  persist();
  render();
}

async function activateAllAgents() {
  const visibleAgents = state.serverAgents?.length ? state.serverAgents : agents;
  if (canUseBackend()) {
    try {
      await Promise.all(
        visibleAgents.map((agent) =>
          apiRequest(`/api/agents/${encodeURIComponent(agent.id)}`, {
            method: "PATCH",
            body: JSON.stringify({ active: true }),
          }),
        ),
      );
      await hydrateFromBackend();
      toast("Alle Agenten im Backend aktiviert.");
      return;
    } catch (error) {
      toast(`Backend-Fallback: ${error.message}`);
    }
  }
  state.activeAgents = visibleAgents.map((agent) => agent.id);
  state.serverAgents = visibleAgents.map((agent) => ({ ...agent, active: true }));
  addActivity("Alle Agenten aktiviert", "Team bereit", "#8f7aff");
  persist();
  render();
}

function openSettings() {
  $("#settingsDrawer").classList.add("is-open");
  $("#drawerBackdrop").classList.add("is-open");
}

function closeSettings() {
  $("#settingsDrawer").classList.remove("is-open");
  $("#drawerBackdrop").classList.remove("is-open");
}

async function saveSettings(event) {
  event.preventDefault();
  await saveCurrentSettings();
}

async function saveCurrentSettings() {
  const nextSettings = {
    providerMode: $("#providerMode").value,
    backendUrl: $("#backendUrl").value.trim(),
    modelName: $("#modelName").value.trim() || defaultState.settings.modelName,
    workspaceName: $("#workspaceName").value.trim() || defaultState.settings.workspaceName,
    defaultProviderId: $("#defaultProviderId").value,
    providerRouting: { ...(state.settings.providerRouting || {}) },
  };
  state.settings = nextSettings;
  if (nextSettings.providerMode === "backend") {
    try {
      await apiRequest("/api/settings", {
        method: "PATCH",
        body: JSON.stringify({
          providerMode: nextSettings.providerMode,
          workspaceName: nextSettings.workspaceName,
          defaultModel: nextSettings.modelName,
          defaultProviderId: nextSettings.defaultProviderId,
          providerRouting: nextSettings.providerRouting,
        }),
      });
      await hydrateFromBackend();
      toast("KI-Setup im Backend gespeichert.");
      return;
    } catch (error) {
      toast(`Lokaler Fallback: ${error.message}`);
    }
  }
  addActivity("KI-Setup gespeichert", state.settings.providerMode, "#18d4c5");
  persist();
  render();
  checkBackend();
  toast("KI-Setup gespeichert.");
}

async function autoRouteProviders() {
  const route = buildAutoProviderRouting();
  state.settings.providerRouting = route;
  persist();
  renderProviderRouting();
  await saveCurrentSettings();
  toast("Provider-Routing automatisch zugeordnet.");
}

function buildAutoProviderRouting() {
  const providers = state.aiProviders || [];
  const usable = (provider) => provider?.enabled && (!provider.keyRequired || provider.apiKeySet);
  const byId = (id) => providers.find((provider) => provider.id === id && usable(provider))?.id || "";
  const first = (...ids) => ids.map(byId).find(Boolean) || "";
  const local = first("ollama", "lm-studio");
  const openai = first("openai", "openrouter", "groq", "deepseek", local);
  const research = first("perplexity", "openrouter", "openai", local);
  const fast = first("groq", "openrouter", "openai", local);
  const route = {};

  for (const tool of allTools()) {
    const providerId =
      {
        claw: openai,
        researcher: research,
        slides: openai,
        tables: fast,
        docs: openai,
        design: openai,
        code: openai,
        "ai-chat": local || openai,
        image: openai,
        video: openai,
        "meeting-notes": fast,
        agents: openai,
        "api-router": openai,
      }[tool.id] || "";
    if (providerId && providerId !== state.settings.defaultProviderId) route[tool.id] = providerId;
  }
  return route;
}

async function saveAiProvider(options = {}) {
  const provider = getSelectedSetupProvider();
  if (!provider) return null;
  const payload = {
    enabled: $("#setupProviderEnabled").checked,
    baseUrl: $("#setupProviderBaseUrl").value.trim(),
    model: $("#setupProviderModel").value.trim(),
  };
  const apiKey = $("#setupProviderApiKey").value.trim();
  if (apiKey) payload.apiKey = apiKey;
  try {
    const updated = await apiRequest(`/api/ai-providers/${encodeURIComponent(provider.id)}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    await hydrateFromBackend();
    if (!options.silent) toast(`${updated.name} gespeichert.`);
    return updated;
  } catch (error) {
    toast(`Provider konnte nicht gespeichert werden: ${error.message}`);
    return null;
  }
}

async function testAiProvider() {
  const provider = getSelectedSetupProvider();
  if (!provider) return;
  const saved = await saveAiProvider({ silent: true });
  if (!saved) return;
  toast(`${saved.name} wird getestet...`);
  try {
    const result = await apiRequest(`/api/ai-providers/${encodeURIComponent(saved.id)}/test`, {
      method: "POST",
    });
    toast(`${result.provider} bereit: ${result.model}`);
    await hydrateFromBackend();
  } catch (error) {
    toast(`Provider-Test fehlgeschlagen: ${error.message}`);
  }
}

async function clearAiProviderKey() {
  const provider = getSelectedSetupProvider();
  if (!provider) return;
  try {
    await apiRequest(`/api/ai-providers/${encodeURIComponent(provider.id)}`, {
      method: "PATCH",
      body: JSON.stringify({ clearKey: true }),
    });
    await hydrateFromBackend();
    toast(`${provider.name}: Key gelöscht.`);
  } catch (error) {
    toast(`Key konnte nicht gelöscht werden: ${error.message}`);
  }
}

function getBackendUrl(withFallback = true) {
  if (state.settings.backendUrl) return state.settings.backendUrl.replace(/\/$/, "");
  if (window.location.protocol.startsWith("http")) return window.location.origin;
  return withFallback ? "http://localhost:8787" : "";
}

async function checkBackend() {
  const status = $("#backendStatus");
  status.classList.remove("is-online", "is-offline");
  status.querySelector("span:last-child").textContent = "Backend wird geprüft";
  try {
    const response = await fetch(`${getBackendUrl()}/api/health`, { cache: "no-store" });
    if (!response.ok) throw new Error("offline");
    const data = await response.json();
    if (data.provider && data.provider !== "mock") {
      state.settings.providerMode = "backend";
      state.settings.modelName = data.model || state.settings.modelName;
      persist();
    }
    if (state.settings.providerMode === "mock" && data.provider === "mock") {
      status.classList.add("is-online");
      status.querySelector("span:last-child").textContent = "Demo-Modus aktiv";
      return true;
    }
    status.classList.add("is-online");
    status.querySelector("span:last-child").textContent = data.provider
      ? `${data.provider} bereit`
      : "Backend bereit";
    return true;
  } catch {
    if (state.settings.providerMode === "mock") {
      status.classList.add("is-online");
      status.querySelector("span:last-child").textContent = "Demo-Modus aktiv";
      return true;
    }
    status.classList.add("is-offline");
    status.querySelector("span:last-child").textContent = "Backend offline";
    return false;
  }
}

async function testBackend() {
  await checkBackend();
  toast($("#backendStatus span:last-child").textContent);
}

function scrollToTarget(navId) {
  const item = navItems.find((nav) => nav.id === navId);
  if (!item) return;
  if (item.target === "settings") {
    openSettings();
    return;
  }
  const targetMap = {
    top: document.body,
    command: $(".command-center"),
    workflows: $("#workflowList"),
    vault: $("#promptList"),
    agents: $("#agentList"),
  };
  targetMap[item.target]?.scrollIntoView({ behavior: "smooth", block: "center" });
  if (item.target === "command") $("#commandInput").focus();
}

function loadPrompt(promptId) {
  const prompt = state.prompts.find((item) => item.id === promptId);
  if (!prompt) return;
  $("#commandInput").value = prompt.text;
  state.activeNav = "chat";
  addActivity("Vorlage geladen", prompt.title, "#75d66b");
  persist();
  renderNav();
  $(".command-center").scrollIntoView({ behavior: "smooth", block: "center" });
  $("#commandInput").focus();
}

async function runApiTest() {
  const log = $("#testLog");
  log.textContent = "Teste Backend...\n";
  try {
    const health = await apiRequest("/api/health", { cache: "no-store" });
    const serverState = await apiRequest("/api/state", { cache: "no-store" });
    const reply = await apiRequest("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        prompt: "Smoke-Test fuer das Digital World KI Dashboard",
        mode: "auto",
        tool: { id: "qa", label: "QA" },
        model: state.settings.modelName,
        providerId: state.settings.defaultProviderId || undefined,
        workspace: state.settings.workspaceName,
      }),
    });
    log.textContent = [
      "OK Backend erreichbar",
      `Provider: ${health.provider}`,
      `Model: ${health.model}`,
      `Prompts: ${serverState.prompts.length}`,
      `Workflows: ${serverState.workflows.length}`,
      `Agents: ${serverState.agents.length}`,
      "",
      reply.reply,
    ].join("\n");
    applyServerState(serverState);
    render();
  } catch (error) {
    log.textContent = `Fehler: ${error.message}`;
  }
}

async function runDemoCommand() {
  $("#commandInput").value =
    "Plane eine n8n Automation, die ein YouTube-Transkript in Blogpost, Newsletter und LinkedIn-Post umwandelt.";
  selectTool("claw");
  await runCommand();
}

async function exportDashboardData() {
  const data = canUseBackend()
    ? await apiRequest("/api/export", { cache: "no-store" })
    : {
        version: 2,
        settings: state.settings,
        agents: state.serverAgents || agents,
        workflows: state.workflows,
        prompts: state.prompts,
        runs: state.runs,
        activity: state.activity,
      };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `digital-world-dashboard-export-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  toast("Export erstellt.");
}

function requestImport() {
  $("#importFile").click();
}

async function importDashboardData(file) {
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (canUseBackend()) {
      await apiRequest("/api/import", {
        method: "POST",
        body: JSON.stringify({ mode: "replace", data }),
      });
      await hydrateFromBackend();
    } else {
      applyServerState(data);
      render();
    }
    toast("Import abgeschlossen.");
  } catch (error) {
    toast(`Import fehlgeschlagen: ${error.message}`);
  } finally {
    $("#importFile").value = "";
  }
}

async function loadDemoData() {
  if (canUseBackend()) {
    try {
      await apiRequest("/api/demo/seed", { method: "POST" });
      await hydrateFromBackend();
      toast("Testdaten neu geladen.");
      return;
    } catch (error) {
      toast(`Backend-Fallback: ${error.message}`);
    }
  }
  state = structuredClone(defaultState);
  persist();
  render();
  toast("Lokale Testdaten neu geladen.");
}

function openRunResult(runId) {
  const run = state.runs.find((item) => item.id === runId);
  if (!run) {
    toast("Auftrag nicht gefunden.");
    return;
  }
  selectedRunId = run.id;
  $("#resultTitle").textContent = run.title || "Auftrag";
  $("#resultMeta").innerHTML = [
    run.toolLabel || "KI",
    run.model || state.settings.modelName,
    formatProvider(run.provider),
    run.status === "done" ? "fertig" : "laeuft",
    formatRunDate(run.createdAt),
  ]
    .filter(Boolean)
    .map((value) => `<span>${escapeHtml(value)}</span>`)
    .join("");
  $("#resultPrompt").textContent = run.prompt || "Kein Prompt gespeichert.";
  $("#resultOutput").textContent = run.output || "Noch keine Antwort vorhanden.";
  $("#resultDrawer").classList.add("is-open");
  $("#resultBackdrop").classList.add("is-open");
}

function closeRunResult() {
  selectedRunId = null;
  $("#resultDrawer").classList.remove("is-open");
  $("#resultBackdrop").classList.remove("is-open");
}

async function copyRunResult() {
  const run = state.runs.find((item) => item.id === selectedRunId);
  if (!run?.output) {
    toast("Kein Ergebnis zum Kopieren.");
    return;
  }
  try {
    await navigator.clipboard.writeText(run.output);
  } catch {
    const range = document.createRange();
    range.selectNodeContents($("#resultOutput"));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
  }
  toast("Ergebnis kopiert.");
}

function formatRunDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatProvider(provider) {
  const value = String(provider || "").toLowerCase();
  if (value === "demo" || value === "lokal" || value === "local") return "Demo-Modus";
  if (value === "mock") return "Backend Mock";
  if (value === "backend") return "Dashboard Backend";
  return provider || "Demo-Modus";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-nav]");
    if (nav) {
      state.activeNav = nav.dataset.nav;
      persist();
      renderNav();
      scrollToTarget(nav.dataset.nav);
      return;
    }

    const mode = event.target.closest("[data-mode]");
    if (mode) {
      selectMode(mode.dataset.mode);
      return;
    }

    const tool = event.target.closest("[data-tool]");
    if (tool) {
      selectTool(tool.dataset.tool);
      return;
    }

    const agent = event.target.closest("[data-agent]");
    if (agent) {
      toggleAgent(agent.dataset.agent);
      return;
    }

    const agentSelect = event.target.closest("[data-agent-select]");
    if (agentSelect) {
      selectAgent(agentSelect.dataset.agentSelect);
      return;
    }

    const workflowRun = event.target.closest("[data-workflow-run]");
    if (workflowRun) {
      runSelectedWorkflow(workflowRun.dataset.workflowRun);
      return;
    }

    const workflow = event.target.closest("[data-workflow]");
    if (workflow) {
      toggleWorkflow(workflow.dataset.workflow);
      return;
    }

    const workflowSelect = event.target.closest("[data-workflow-select]");
    if (workflowSelect) {
      selectWorkflow(workflowSelect.dataset.workflowSelect);
      return;
    }

    const runOpen = event.target.closest("[data-run-open]");
    if (runOpen) {
      openRunResult(runOpen.dataset.runOpen);
      return;
    }

    const provider = event.target.closest("[data-provider-select]");
    if (provider) {
      selectedSetupProviderId = provider.dataset.providerSelect;
      renderAiSetup();
      return;
    }

    const prompt = event.target.closest("[data-prompt]");
    if (prompt) {
      loadPrompt(prompt.dataset.prompt);
    }
  });

  $("#runCommand").addEventListener("click", runCommand);
  $("#commandInput").addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      runCommand();
    }
  });
  $("#savePrompt").addEventListener("click", savePrompt);
  $("#copyPrompt").addEventListener("click", copyPrompt);
  $("#voiceButton").addEventListener("click", () => toast("Sprachmodus ist fuer V2 markiert."));
  $("#clearRuns").addEventListener("click", clearRuns);
  $("#activateAllAgents").addEventListener("click", activateAllAgents);
  $("#agentSelect").addEventListener("change", (event) => selectAgent(event.target.value));
  $("#saveAgentProfile").addEventListener("click", saveAgentProfile);
  $("#runAgent").addEventListener("click", runSelectedAgent);
  $("#workflowSelect").addEventListener("change", (event) => selectWorkflow(event.target.value));
  $("#saveWorkflowProfile").addEventListener("click", saveWorkflowProfile);
  $("#runWorkflow").addEventListener("click", () => runSelectedWorkflow());
  $("#newWorkflow").addEventListener("click", addWorkflow);
  $("#seedPrompts").addEventListener("click", seedPrompts);
  $("#testApi").addEventListener("click", runApiTest);
  $("#runDemoCommand").addEventListener("click", runDemoCommand);
  $("#exportData").addEventListener("click", exportDashboardData);
  $("#drawerExportData").addEventListener("click", exportDashboardData);
  $("#drawerImportData").addEventListener("click", requestImport);
  $("#loadDemoData").addEventListener("click", loadDemoData);
  $("#importFile").addEventListener("change", (event) => importDashboardData(event.target.files?.[0]));
  $("#newCommand").addEventListener("click", () => {
    $("#commandInput").value = "";
    $(".command-center").scrollIntoView({ behavior: "smooth", block: "center" });
    $("#commandInput").focus();
  });
  $("#focusMode").addEventListener("click", () => {
    document.body.classList.toggle("is-focus");
    $("#focusMode").classList.toggle("is-active");
  });
  $("#openSettings").addEventListener("click", openSettings);
  $("#openSettingsMini").addEventListener("click", openSettings);
  $("#closeSettings").addEventListener("click", closeSettings);
  $("#drawerBackdrop").addEventListener("click", closeSettings);
  $("#closeResult").addEventListener("click", closeRunResult);
  $("#resultBackdrop").addEventListener("click", closeRunResult);
  $("#copyResult").addEventListener("click", copyRunResult);
  $("#settingsForm").addEventListener("submit", saveSettings);
  $("#autoRouteProviders").addEventListener("click", autoRouteProviders);
  $("#defaultProviderId").addEventListener("change", (event) => {
    const provider = (state.aiProviders || []).find((item) => item.id === event.target.value);
    if (provider) {
      selectedSetupProviderId = provider.id;
      $("#modelName").value = provider.model || $("#modelName").value;
      renderAiSetup();
    }
  });
  $("#providerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveAiProvider();
  });
  $("#testBackend").addEventListener("click", testBackend);
  $("#testProvider").addEventListener("click", testAiProvider);
  $("#clearProviderKey").addEventListener("click", clearAiProviderKey);
  document.addEventListener("change", (event) => {
    const routeSelect = event.target.closest("[data-route-tool]");
    if (!routeSelect) return;
    state.settings.providerRouting = {
      ...(state.settings.providerRouting || {}),
      [routeSelect.dataset.routeTool]: routeSelect.value,
    };
    if (!routeSelect.value) delete state.settings.providerRouting[routeSelect.dataset.routeTool];
    persist();
    toast("Routing geändert. Zum dauerhaften Speichern KI-Setup speichern.");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSettings();
      closeRunResult();
    }
  });
}

render();
bindEvents();
if (window.location.hash === "#ki-setup") openSettings();
if (window.location.hash === "#agent-studio") {
  $("#agentStudioPanel")?.scrollIntoView({ block: "start" });
}
if (window.location.hash === "#workflow-runner") {
  $("#workflowRunnerPanel")?.scrollIntoView({ block: "start" });
}
checkBackend().then((online) => {
  if (online) {
    hydrateFromBackend().then(() => {
      if (window.location.hash === "#agent-studio") {
        $("#agentStudioPanel")?.scrollIntoView({ block: "start" });
      }
      if (window.location.hash === "#workflow-runner") {
        $("#workflowRunnerPanel")?.scrollIntoView({ block: "start" });
      }
    });
  }
});
