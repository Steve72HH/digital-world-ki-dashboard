const fs = require("node:fs/promises");
const path = require("node:path");
const { createSeedData } = require("./seeds");
const {
  normalizeAiProviders,
  resolveProviderConfig,
  sanitizeAiProviders,
  updateProvider,
} = require("./provider-catalog");

function createStore(options = {}) {
  const dataDir = options.dataDir || path.join(process.cwd(), "data");
  const dataFile = options.dataFile || path.join(dataDir, "dashboard.json");
  let writeChain = Promise.resolve();

  async function ensureDataFile() {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    try {
      await fs.access(dataFile);
    } catch {
      await writeData(createSeedData());
    }
  }

  async function readData() {
    await ensureDataFile();
    const raw = await fs.readFile(dataFile, "utf8");
    return normalizeData(JSON.parse(raw));
  }

  async function writeData(data) {
    const normalized = normalizeData(data);
    const tmpFile = `${dataFile}.tmp`;
    writeChain = writeChain.then(async () => {
      await fs.mkdir(path.dirname(dataFile), { recursive: true });
      await fs.writeFile(tmpFile, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
      await fs.rename(tmpFile, dataFile);
    });
    await writeChain;
    return normalized;
  }

  async function update(mutator) {
    const data = await readData();
    const result = await mutator(data);
    await writeData(data);
    return result ?? data;
  }

  return {
    dataFile,
    readData,
    writeData,
    async reset() {
      const data = createSeedData();
      await writeData(data);
      return data;
    },
    async getState() {
      const data = await readData();
      return sanitizeData({
        ...data,
        metrics: buildMetrics(data),
      });
    },
    async exportData() {
      return sanitizeData(await readData());
    },
    async getEffectiveAiConfig(fallbackConfig, providerId) {
      const data = await readData();
      return resolveProviderConfig(data, fallbackConfig, providerId);
    },
    async saveSettings(patch) {
      return update((data) => {
        if ("workspaceName" in patch) data.settings.workspaceName = clean(patch.workspaceName);
        if ("defaultModel" in patch) data.settings.defaultModel = clean(patch.defaultModel);
        if ("defaultProviderId" in patch) data.settings.defaultProviderId = clean(patch.defaultProviderId);
        if ("providerRouting" in patch) data.settings.providerRouting = normalizeProviderRouting(patch.providerRouting);
        if ("providerMode" in patch) data.settings.providerMode = clean(patch.providerMode || "backend");
        if ("monthlyPlatformAlternativeEur" in patch) {
          data.settings.monthlyPlatformAlternativeEur = Number(patch.monthlyPlatformAlternativeEur || 0);
        }
        addActivity(data, "KI-Setup gespeichert", data.settings.defaultProviderId || "Standard", "#18d4c5");
        return sanitizeData(data).settings;
      });
    },
    async listAiProviders() {
      const data = await readData();
      return sanitizeAiProviders(data.aiProviders);
    },
    async listConnectors() {
      const data = await readData();
      return sanitizeConnectors(data.connectors);
    },
    async addConnector(payload) {
      return update((data) => {
        const connector = normalizeConnector({
          id: uid("connector"),
          name: payload.name,
          type: payload.type,
          status: payload.status || "optional",
          enabled: Boolean(payload.enabled),
          endpointUrl: payload.endpointUrl,
          method: payload.method,
          authType: payload.authType,
          apiKey: payload.apiKey,
          description: payload.description,
          testPayload: payload.testPayload,
          linkedWorkflowIds: payload.linkedWorkflowIds,
        });
        if (!connector.name) throw createHttpError(400, "Connector name is required");
        if (connector.endpointUrl) connector.endpointUrl = cleanHttpUrl(connector.endpointUrl, "Connector endpoint");
        data.connectors.unshift(connector);
        addActivity(data, "Connector angelegt", connector.name, "#18d4c5");
        return sanitizeConnector(connector);
      });
    },
    async patchConnector(id, patch) {
      return update((data) => {
        const connector = data.connectors.find((item) => item.id === id);
        if (!connector) throw createHttpError(404, "Connector not found");
        if ("name" in patch) connector.name = clean(patch.name) || connector.name;
        if ("type" in patch) connector.type = clean(patch.type) || connector.type;
        if ("status" in patch) connector.status = clean(patch.status || "optional");
        if ("enabled" in patch) connector.enabled = Boolean(patch.enabled);
        if ("endpointUrl" in patch) {
          connector.endpointUrl = clean(patch.endpointUrl)
            ? cleanHttpUrl(patch.endpointUrl, "Connector endpoint")
            : "";
        }
        if ("method" in patch) connector.method = normalizeConnectorMethod(patch.method);
        if ("authType" in patch) connector.authType = normalizeAuthType(patch.authType);
        if ("apiKey" in patch && clean(patch.apiKey)) connector.apiKey = clean(patch.apiKey);
        if (patch.clearApiKey) connector.apiKey = "";
        if ("description" in patch) connector.description = clean(patch.description);
        if ("testPayload" in patch) connector.testPayload = normalizeConnectorPayload(patch.testPayload);
        if ("linkedWorkflowIds" in patch) connector.linkedWorkflowIds = normalizeSteps(patch.linkedWorkflowIds);
        addActivity(data, "Connector aktualisiert", connector.name, connector.enabled ? "#75d66b" : "#aaa9a4");
        return sanitizeConnector(connector);
      });
    },
    async testConnector(id, payload = {}) {
      return update(async (data) => {
        const connector = data.connectors.find((item) => item.id === id);
        if (!connector) throw createHttpError(404, "Connector not found");
        if (!connector.endpointUrl) throw createHttpError(400, "Connector endpoint is required");
        const result = await callConnectorEndpoint(connector, payload);
        connector.lastTestAt = new Date().toISOString();
        connector.lastTestStatus = result.ok
          ? `OK${result.status ? ` HTTP ${result.status}` : ""}`
          : `Fehler${result.status ? ` HTTP ${result.status}` : ""}`;
        connector.lastTestResult = result.body || result.statusText || "";
        connector.status = result.ok ? "connected" : "error";
        if (result.ok) connector.enabled = true;
        addActivity(data, result.ok ? "Connector-Test erfolgreich" : "Connector-Test fehlgeschlagen", connector.name, result.ok ? "#75d66b" : "#ff6a4b");
        return {
          ok: result.ok,
          status: result.status,
          statusText: result.statusText,
          body: result.body,
          connector: sanitizeConnector(connector),
        };
      });
    },
    async saveAiProvider(providerId, patch) {
      return update((data) => {
        data.aiProviders = updateProvider(data.aiProviders, providerId, patch);
        const provider = data.aiProviders.find((item) => item.id === providerId);
        if (patch.defaultProvider) {
          data.settings.defaultProviderId = provider.id;
          data.settings.defaultModel = provider.model || data.settings.defaultModel;
        }
        addActivity(data, "KI-Provider aktualisiert", provider.name, "#18d4c5");
        return sanitizeAiProviders(data.aiProviders).find((item) => item.id === providerId);
      });
    },
    async addPrompt(payload) {
      return update((data) => {
        const prompt = {
          id: uid("prompt"),
          title: clean(payload.title || payload.text || "Neue Vorlage").slice(0, 80),
          text: clean(payload.text || ""),
          category: clean(payload.category || payload.tags?.[0] || "Allgemein"),
          tags: Array.isArray(payload.tags) ? payload.tags.slice(0, 8).map(clean) : [],
          favorite: Boolean(payload.favorite),
          createdAt: new Date().toISOString(),
        };
        if (!prompt.text) {
          throw createHttpError(400, "Prompt text is required");
        }
        data.prompts.unshift(prompt);
        addActivity(data, "Vorlage gespeichert", prompt.title, "#75d66b");
        return prompt;
      });
    },
    async updatePrompt(id, patch) {
      return update((data) => {
        const prompt = data.prompts.find((item) => item.id === id);
        if (!prompt) throw createHttpError(404, "Prompt not found");
        if ("title" in patch) prompt.title = clean(patch.title || prompt.title).slice(0, 80);
        if ("text" in patch) prompt.text = clean(patch.text);
        if ("category" in patch) prompt.category = clean(patch.category || "Allgemein");
        if ("tags" in patch) prompt.tags = Array.isArray(patch.tags) ? patch.tags.slice(0, 8).map(clean).filter(Boolean) : [];
        if ("favorite" in patch) prompt.favorite = Boolean(patch.favorite);
        if (!prompt.text) throw createHttpError(400, "Prompt text is required");
        addActivity(data, "Vorlage aktualisiert", prompt.title, "#75d66b");
        return prompt;
      });
    },
    async deletePrompt(id) {
      return update((data) => {
        const before = data.prompts.length;
        data.prompts = data.prompts.filter((prompt) => prompt.id !== id);
        if (data.prompts.length === before) throw createHttpError(404, "Prompt not found");
        addActivity(data, "Vorlage geloescht", id, "#aaa9a4");
        return { ok: true };
      });
    },
    async addWorkflow(payload) {
      return update((data) => {
        const workflow = {
          id: uid("workflow"),
          title: clean(payload.title || `Custom Workflow ${data.workflows.length + 1}`),
          subtitle: clean(payload.subtitle || "Trigger, KI-Schritt und Ergebnisablage"),
          active: Boolean(payload.active),
          steps: normalizeSteps(payload.steps),
          trigger: clean(payload.trigger || "Manuell"),
          owner: clean(payload.owner || "Digital World"),
          webhookUrl: clean(payload.webhookUrl || ""),
          lastRunAt: null,
          lastStatus: "",
          lastResponse: "",
          responseLog: [],
          errorLog: [],
        };
        data.workflows.unshift(workflow);
        addActivity(data, "Workflow angelegt", workflow.title, "#f6b84d");
        return workflow;
      });
    },
    async patchWorkflow(id, patch) {
      return update((data) => {
        const workflow = data.workflows.find((item) => item.id === id);
        if (!workflow) throw createHttpError(404, "Workflow not found");
        if ("title" in patch) workflow.title = clean(patch.title);
        if ("subtitle" in patch) workflow.subtitle = clean(patch.subtitle);
        if ("active" in patch) workflow.active = Boolean(patch.active);
        if ("steps" in patch) workflow.steps = normalizeSteps(patch.steps);
        if ("trigger" in patch) workflow.trigger = clean(patch.trigger);
        if ("owner" in patch) workflow.owner = clean(patch.owner);
        if ("webhookUrl" in patch) workflow.webhookUrl = cleanWebhookUrl(patch.webhookUrl);
        addActivity(
          data,
          workflow.active ? "Workflow aktiviert" : "Workflow aktualisiert",
          workflow.title,
          "#f6b84d",
        );
        return workflow;
      });
    },
    async runWorkflow(id, payload = {}) {
      return update(async (data) => {
        const workflow = data.workflows.find((item) => item.id === id);
        if (!workflow) throw createHttpError(404, "Workflow not found");
        const startedAt = new Date().toISOString();
        const eventPayload = buildWorkflowPayload(workflow, payload, data.settings, startedAt);
        const webhookUrl = clean(workflow.webhookUrl);
        const webhookResult = webhookUrl
          ? await callWorkflowWebhook(webhookUrl, eventPayload)
          : {
              ok: true,
              status: 0,
              statusText: "local",
              body: "Kein Webhook konfiguriert. Der Workflow wurde lokal vorbereitet.",
            };
        workflow.lastRunAt = startedAt;
        workflow.lastStatus = webhookUrl
          ? `${webhookResult.ok ? "OK" : "Fehler"}${webhookResult.status ? ` HTTP ${webhookResult.status}` : ""}`
          : "lokal";
        workflow.lastResponse = clip(webhookResult.body || webhookResult.statusText || "", 1200);
        const logEntry = buildWorkflowLogEntry(workflow, webhookUrl, webhookResult, eventPayload, startedAt);
        workflow.responseLog = [logEntry, ...(workflow.responseLog || [])].slice(0, 8);
        if (!webhookResult.ok) {
          workflow.errorLog = [logEntry, ...(workflow.errorLog || [])].slice(0, 8);
        }
        const run = createRun({
          prompt: eventPayload.prompt || `Workflow ausfuehren: ${workflow.title}`,
          mode: "workflow",
          tool: { id: "workflow", label: workflow.title },
          provider: webhookUrl ? "Webhook Runner" : "Lokaler Workflow",
          model: webhookUrl ? "webhook-post" : "local-dry-run",
          output: buildWorkflowOutput(workflow, webhookUrl, webhookResult),
        });
        data.runs.unshift(run);
        data.runs = data.runs.slice(0, 50);
        addActivity(
          data,
          webhookUrl ? "Workflow-Webhook gestartet" : "Workflow-Testlauf",
          workflow.title,
          webhookResult.ok ? "#18d4c5" : "#ff6a4b",
        );
        return run;
      });
    },
    async setAgentActive(id, active) {
      return this.patchAgent(id, { active });
    },
    async addAgent(payload) {
      return update((data) => {
        const agent = normalizeAgent({
          id: uid("agent"),
          name: clean(payload.name || `KI-Agent ${data.agents.length + 1}`),
          role: clean(payload.role || "Eigener Assistent"),
          initials: clean(payload.initials || initialsFromName(payload.name || "KI-Agent")),
          color: clean(payload.color || "#18d4c5"),
          active: "active" in payload ? Boolean(payload.active) : true,
          tools: normalizeSteps(payload.tools || ["chat", "workflow"]),
          providerId: clean(payload.providerId || data.settings.defaultProviderId || ""),
          model: clean(payload.model || data.settings.defaultModel || ""),
          instructions: clean(payload.instructions || "Arbeite strukturiert, knapp und praktisch."),
        });
        data.agents.unshift(agent);
        addActivity(data, "Agent angelegt", agent.name, agent.color);
        return agent;
      });
    },
    async patchAgent(id, patch) {
      return update((data) => {
        const agent = data.agents.find((item) => item.id === id);
        if (!agent) throw createHttpError(404, "Agent not found");
        if ("name" in patch) agent.name = clean(patch.name) || agent.name;
        if ("role" in patch) agent.role = clean(patch.role) || agent.role;
        if ("initials" in patch) agent.initials = clean(patch.initials || initialsFromName(agent.name)).slice(0, 3);
        if ("color" in patch) agent.color = clean(patch.color) || agent.color;
        if ("active" in patch) agent.active = Boolean(patch.active);
        if ("tools" in patch) agent.tools = normalizeSteps(patch.tools);
        if ("providerId" in patch) agent.providerId = clean(patch.providerId);
        if ("model" in patch) agent.model = clean(patch.model);
        if ("instructions" in patch) agent.instructions = clean(patch.instructions);
        addActivity(data, "Agent aktualisiert", agent.name, agent.color);
        return agent;
      });
    },
    async getAgent(id) {
      const data = await readData();
      const agent = data.agents.find((item) => item.id === id);
      if (!agent) throw createHttpError(404, "Agent not found");
      return agent;
    },
    async createRun(payload, replyPayload) {
      return update((data) => {
        const run = createRun({
          prompt: payload.prompt,
          mode: payload.mode,
          tool: payload.tool,
          agentId: payload.agentId,
          model: replyPayload.model || payload.model || data.settings.defaultModel,
          provider: replyPayload.provider,
          output: replyPayload.reply || "",
        });
        data.runs.unshift(run);
        data.runs = data.runs.slice(0, 50);
        addActivity(data, "Auftrag abgeschlossen", run.title, "#75d66b");
        return run;
      });
    },
    async clearCompletedRuns() {
      return update((data) => {
        const before = data.runs.length;
        data.runs = data.runs.filter((run) => run.status !== "done");
        addActivity(data, "Queue bereinigt", `${before - data.runs.length} Auftraege entfernt`, "#aaa9a4");
        return { ok: true, removed: before - data.runs.length };
      });
    },
    async importData(imported, mode = "replace") {
      const normalized = normalizeData(imported);
      if (mode === "merge") {
        return update((data) => {
          data.prompts = mergeById(normalized.prompts, data.prompts);
          data.workflows = mergeById(normalized.workflows, data.workflows);
          data.agents = mergeById(normalized.agents, data.agents);
          data.runs = mergeById(normalized.runs, data.runs).slice(0, 50);
          data.activity = mergeById(normalized.activity, data.activity).slice(0, 80);
          data.settings = { ...data.settings, ...normalized.settings };
          addActivity(data, "Import abgeschlossen", "Daten wurden zusammengefuehrt", "#18d4c5");
          return data;
        });
      }
      await writeData(normalized);
      return normalized;
    },
  };
}

function normalizeData(data) {
  const seed = createSeedData();
  return {
    version: 2,
    settings: {
      ...seed.settings,
      ...(data.settings || {}),
      providerRouting: normalizeProviderRouting(data.settings?.providerRouting || seed.settings.providerRouting),
    },
    agents: normalizeAgents(data.agents, seed.agents),
    workflows: normalizeWorkflows(data.workflows, seed.workflows),
    prompts: normalizePrompts(data.prompts, seed.prompts),
    runs: Array.isArray(data.runs) ? data.runs : [],
    activity: Array.isArray(data.activity) ? data.activity : seed.activity,
    aiProviders: normalizeAiProviders(data.aiProviders || seed.aiProviders),
    connectors: normalizeConnectors(data.connectors, seed.connectors),
  };
}

function normalizePrompts(input, seedPrompts) {
  const incoming = Array.isArray(input) ? input : seedPrompts;
  return incoming.map((prompt) => ({
    id: clean(prompt.id || uid("prompt")),
    title: clean(prompt.title || prompt.text || "Prompt").slice(0, 80),
    text: clean(prompt.text || ""),
    category: clean(prompt.category || prompt.tags?.[0] || "Allgemein"),
    tags: Array.isArray(prompt.tags) ? prompt.tags.map(clean).filter(Boolean).slice(0, 8) : [],
    favorite: Boolean(prompt.favorite),
    createdAt: prompt.createdAt || new Date().toISOString(),
  }));
}

function normalizeAgents(input, seedAgents) {
  const incoming = Array.isArray(input) ? input : seedAgents;
  const seedById = new Map(seedAgents.map((agent) => [agent.id, agent]));
  const seen = new Set();
  const normalized = incoming.map((agent) => {
    const seed = seedById.get(agent.id) || {};
    seen.add(agent.id);
    return normalizeAgent({ ...seed, ...agent }, seed);
  });
  for (const seed of seedAgents) {
    if (!seen.has(seed.id)) normalized.push(normalizeAgent(seed, seed));
  }
  return normalized;
}

function normalizeAgent(agent, seed = {}) {
  return {
    ...agent,
    id: clean(agent.id || seed.id),
    name: clean(agent.name || seed.name || "KI-Agent"),
    role: clean(agent.role || seed.role || "Assistent"),
    initials: clean(agent.initials || seed.initials || "AI").slice(0, 3),
    color: clean(agent.color || seed.color || "#18d4c5"),
    active: Boolean(agent.active),
    tools: Array.isArray(agent.tools) ? agent.tools.map(clean).filter(Boolean).slice(0, 12) : seed.tools || [],
    providerId: clean(agent.providerId || ""),
    model: clean(agent.model || ""),
    instructions: clean(agent.instructions || seed.instructions || ""),
  };
}

function normalizeWorkflows(input, seedWorkflows) {
  const incoming = Array.isArray(input) ? input : seedWorkflows;
  const seedById = new Map(seedWorkflows.map((workflow) => [workflow.id, workflow]));
  const seen = new Set();
  const normalized = incoming.map((workflow) => {
    const seed = seedById.get(workflow.id) || {};
    seen.add(workflow.id);
    return normalizeWorkflow({ ...seed, ...workflow }, seed);
  });
  for (const seed of seedWorkflows) {
    if (!seen.has(seed.id)) normalized.push(normalizeWorkflow(seed, seed));
  }
  return normalized;
}

function normalizeWorkflow(workflow, seed = {}) {
  return {
    ...workflow,
    id: clean(workflow.id || seed.id),
    title: clean(workflow.title || seed.title || "Workflow"),
    subtitle: clean(workflow.subtitle || seed.subtitle || "Trigger, KI-Schritt und Ergebnisablage"),
    active: Boolean(workflow.active),
    steps: normalizeSteps(workflow.steps || seed.steps),
    trigger: clean(workflow.trigger || seed.trigger || "Manuell"),
    owner: clean(workflow.owner || seed.owner || "Digital World"),
    webhookUrl: clean(workflow.webhookUrl || ""),
    lastRunAt: workflow.lastRunAt || null,
    lastStatus: clean(workflow.lastStatus || ""),
    lastResponse: clean(workflow.lastResponse || ""),
    responseLog: normalizeWorkflowLog(workflow.responseLog),
    errorLog: normalizeWorkflowLog(workflow.errorLog),
  };
}

function normalizeWorkflowLog(log) {
  if (!Array.isArray(log)) return [];
  return log
    .map((entry) => ({
      id: clean(entry.id || uid("workflow-log")),
      createdAt: entry.createdAt || null,
      ok: Boolean(entry.ok),
      status: Number(entry.status || 0),
      statusText: clean(entry.statusText || ""),
      mode: clean(entry.mode || "local"),
      response: clip(entry.response || "", 1600),
      payload: entry.payload && typeof entry.payload === "object" && !Array.isArray(entry.payload)
        ? entry.payload
        : null,
    }))
    .slice(0, 8);
}

function normalizeConnectors(input, seedConnectors) {
  const deprecatedEmptyConnectorIds = new Set(["ollama", "openai-compatible"]);
  const incoming = (Array.isArray(input) ? input : seedConnectors).filter((connector) => {
    const id = clean(connector.id);
    if (!deprecatedEmptyConnectorIds.has(id)) return true;
    return Boolean(connector.enabled || connector.endpointUrl || connector.apiKey || connector.apiKeySet);
  });
  const seedById = new Map(seedConnectors.map((connector) => [connector.id, connector]));
  const seen = new Set();
  const normalized = incoming.map((connector) => {
    const seed = seedById.get(connector.id) || {};
    seen.add(connector.id);
    return normalizeConnector(connector, seed);
  });
  for (const seed of seedConnectors) {
    if (!seen.has(seed.id)) normalized.push(normalizeConnector(seed, seed));
  }
  return normalized;
}

function normalizeConnector(connector, seed = {}) {
  const status =
    seed.id === "webhook" && connector.status === "planned"
      ? seed.status
      : clean(connector.status || seed.status || "optional");
  const description =
    seed.id === "webhook" && connector.description?.includes("Spaeterer Anschluss")
      ? seed.description
      : clean(connector.description || seed.description || "");
  return {
    ...seed,
    ...connector,
    id: clean(connector.id || seed.id),
    name: clean(connector.name || seed.name || "Connector"),
    type: clean(connector.type || seed.type || "integration"),
    status,
    description,
    enabled: Boolean(connector.enabled ?? seed.enabled),
    endpointUrl: clean(connector.endpointUrl || connector.webhookUrl || seed.endpointUrl || ""),
    method: normalizeConnectorMethod(connector.method || seed.method),
    authType: normalizeAuthType(connector.authType || seed.authType),
    apiKey: clean(connector.apiKey || ""),
    apiKeySet: Boolean(connector.apiKey || connector.apiKeySet),
    testPayload: normalizeConnectorPayload(connector.testPayload || seed.testPayload),
    linkedWorkflowIds: normalizeSteps(connector.linkedWorkflowIds || seed.linkedWorkflowIds || []),
    lastTestAt: connector.lastTestAt || null,
    lastTestStatus: clean(connector.lastTestStatus || ""),
    lastTestResult: clip(connector.lastTestResult || "", 1600),
  };
}

function normalizeConnectorMethod(value) {
  const method = clean(value || "POST").toUpperCase();
  return ["GET", "POST"].includes(method) ? method : "POST";
}

function normalizeAuthType(value) {
  const authType = clean(value || "none").toLowerCase();
  return ["none", "bearer", "api-key"].includes(authType) ? authType : "none";
}

function normalizeConnectorPayload(value) {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  return {};
}

function normalizeProviderRouting(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .map(([toolId, providerId]) => [clean(toolId), clean(providerId)])
      .filter(([toolId]) => Boolean(toolId)),
  );
}

function buildMetrics(data) {
  const completedRuns = data.runs.filter((run) => run.status === "done").length;
  return {
    savedPlatformMonthlyEur: Number(data.settings.monthlyPlatformAlternativeEur || 0),
    configuredAiProviders: data.aiProviders.filter((provider) => provider.enabled).length,
    activeWorkflows: data.workflows.filter((workflow) => workflow.active).length,
    totalWorkflows: data.workflows.length,
    activeAgents: data.agents.filter((agent) => agent.active).length,
    totalAgents: data.agents.length,
    prompts: data.prompts.length,
    completedRuns,
  };
}

function sanitizeData(data) {
  return {
    ...data,
    aiProviders: sanitizeAiProviders(data.aiProviders),
    connectors: sanitizeConnectors(data.connectors),
  };
}

function sanitizeConnectors(connectors = []) {
  return connectors.map(sanitizeConnector);
}

function sanitizeConnector(connector) {
  const { apiKey, ...publicConnector } = connector;
  return {
    ...publicConnector,
    apiKeySet: Boolean(apiKey || connector.apiKeySet),
  };
}

function createRun(payload) {
  const prompt = clean(payload.prompt || "");
  const toolLabel = payload.tool?.label || payload.toolLabel || "KI";
  return {
    id: uid("run"),
    title: buildRunTitle(prompt, toolLabel),
    prompt,
    mode: payload.mode || "auto",
    toolId: payload.tool?.id || payload.toolId || "ai-chat",
    toolLabel,
    agentId: payload.agentId || null,
    status: "done",
    progress: 100,
    provider: payload.provider || "mock",
    model: payload.model || "gpt-4.1-mini",
    output: clean(payload.output || ""),
    createdAt: new Date().toISOString(),
  };
}

function addActivity(data, title, detail, color = "#18d4c5") {
  data.activity.unshift({
    id: uid("activity"),
    title,
    detail,
    color,
    time: new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    createdAt: new Date().toISOString(),
  });
  data.activity = data.activity.slice(0, 80);
}

function buildRunTitle(prompt, toolLabel) {
  const cleaned = clean(prompt).replace(/\s+/g, " ");
  const label = clean(toolLabel);
  if (cleaned.length <= 58) return `${label}: ${cleaned}`;
  return `${label}: ${cleaned.slice(0, 55)}...`;
}

function normalizeSteps(steps) {
  if (!Array.isArray(steps)) return ["Trigger", "KI", "Output"];
  return steps.map(clean).filter(Boolean).slice(0, 8);
}

function initialsFromName(value) {
  const parts = clean(value).split(/\s+/).filter(Boolean);
  const initials = parts.map((part) => part[0]).join("").slice(0, 3).toUpperCase();
  return initials || "AI";
}

function cleanWebhookUrl(value) {
  const url = clean(value);
  if (!url) return "";
  return cleanHttpUrl(url, "Webhook URL");
}

function validateWebhookUrl(value) {
  return cleanHttpUrl(value, "Webhook URL");
}

function cleanHttpUrl(value, label = "URL") {
  let parsed;
  try {
    parsed = new URL(clean(value));
  } catch {
    throw createHttpError(400, `${label} must be a valid URL`);
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw createHttpError(400, `${label} must use http or https`);
  }
  return parsed.toString();
}

function buildWorkflowPayload(workflow, payload, settings, startedAt) {
  const input = clean(payload.input || payload.prompt || "");
  const parsedInput = parseJsonObject(input);
  const prompt = clean(parsedInput?.prompt || parsedInput?.task || payload.prompt || payload.input || "");
  return {
    source: "digital-world-ki-dashboard",
    event: "workflow.run",
    createdAt: startedAt,
    workspace: clean(payload.workspace || settings.workspaceName || "Digital World"),
    prompt,
    input,
    data: parsedInput,
    workflow: {
      id: workflow.id,
      title: workflow.title,
      subtitle: workflow.subtitle,
      active: workflow.active,
      trigger: workflow.trigger,
      owner: workflow.owner,
      steps: workflow.steps,
    },
  };
}

function buildWorkflowLogEntry(workflow, webhookUrl, result, payload, startedAt) {
  return {
    id: uid("workflow-log"),
    createdAt: startedAt,
    ok: Boolean(result.ok),
    status: Number(result.status || 0),
    statusText: clean(result.statusText || ""),
    mode: webhookUrl ? "webhook" : "local",
    response: clip(result.body || result.statusText || "", 1600),
    payload: {
      prompt: payload.prompt,
      workflow: payload.workflow?.id || workflow.id,
      workspace: payload.workspace,
      data: payload.data,
    },
  };
}

async function callWorkflowWebhook(webhookUrl, payload) {
  const url = validateWebhookUrl(webhookUrl);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Digital-World-KI-Dashboard/0.2",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      body: clip(formatWebhookBody(text, response.headers.get("content-type")), 4000),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: error.name === "AbortError" ? "timeout" : "request failed",
      body:
        error.name === "AbortError"
          ? "Webhook-Timeout nach 12 Sekunden."
          : `Webhook-Fehler: ${error.message}`,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function callConnectorEndpoint(connector, payload = {}) {
  const url = cleanHttpUrl(connector.endpointUrl, "Connector endpoint");
  const method = normalizeConnectorMethod(connector.method);
  const bodyPayload = normalizeConnectorPayload(payload.payload) || {};
  const testPayload = Object.keys(bodyPayload).length ? bodyPayload : normalizeConnectorPayload(connector.testPayload);
  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Digital-World-KI-Dashboard/0.2",
  };
  if (connector.authType === "bearer" && connector.apiKey) {
    headers.Authorization = `Bearer ${connector.apiKey}`;
  }
  if (connector.authType === "api-key" && connector.apiKey) {
    headers["X-API-Key"] = connector.apiKey;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(url, {
      method,
      headers,
      body:
        method === "POST"
          ? JSON.stringify({
              source: "digital-world-ki-dashboard",
              event: "connector.test",
              createdAt: new Date().toISOString(),
              connector: {
                id: connector.id,
                name: connector.name,
                type: connector.type,
              },
              payload: testPayload,
            })
          : undefined,
      signal: controller.signal,
    });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      body: clip(formatWebhookBody(text, response.headers.get("content-type")), 4000),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: error.name === "AbortError" ? "timeout" : "request failed",
      body:
        error.name === "AbortError"
          ? "Connector-Timeout nach 12 Sekunden."
          : `Connector-Fehler: ${error.message}`,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function formatWebhookBody(text, contentType = "") {
  if (!text) return "Webhook hat ohne Body geantwortet.";
  if (contentType.includes("application/json")) {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  }
  return text;
}

function parseJsonObject(value) {
  const text = clean(value);
  if (!text || !/^[\[{]/.test(text)) return null;
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function buildWorkflowOutput(workflow, webhookUrl, result) {
  const lines = [
    `Workflow "${workflow.title}" wurde gestartet.`,
    `Modus: ${webhookUrl ? "Webhook POST" : "Lokaler Testlauf"}`,
  ];
  if (webhookUrl) {
    lines.push(`Webhook: ${displayWebhookUrl(webhookUrl)}`);
    lines.push(`Status: ${result.ok ? "OK" : "Fehler"}${result.status ? ` HTTP ${result.status}` : ""}`);
  } else {
    lines.push("Kein Webhook konfiguriert. Trage eine n8n-, Make- oder eigene Webhook-URL ein, um externe Automationen zu starten.");
  }
  if (workflow.trigger) lines.push(`Trigger: ${workflow.trigger}`);
  if (workflow.owner) lines.push(`Owner: ${workflow.owner}`);
  if (result.body) {
    lines.push("", "Antwort:", result.body);
  }
  return lines.join("\n");
}

function displayWebhookUrl(value) {
  try {
    const parsed = new URL(value);
    parsed.username = "";
    parsed.password = "";
    if (parsed.search) parsed.search = "?...";
    return parsed.toString();
  } catch {
    return "konfiguriert";
  }
}

function clip(value, length) {
  const text = clean(value);
  return text.length > length ? `${text.slice(0, length - 3)}...` : text;
}

function clean(value) {
  return String(value ?? "").trim();
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function mergeById(incoming, current) {
  const map = new Map(current.map((item) => [item.id, item]));
  for (const item of incoming) map.set(item.id, item);
  return Array.from(map.values());
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  createStore,
  createHttpError,
};
