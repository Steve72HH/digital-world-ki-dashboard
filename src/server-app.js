const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { createAiClient } = require("./ai");
const { createStore } = require("./store");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
};

function readConfig(env = process.env, rootDir = path.resolve(__dirname, "..")) {
  const mergedEnv = { ...readDotEnv(path.join(rootDir, ".env")), ...env };
  const provider = (mergedEnv.AI_PROVIDER || "mock").toLowerCase();
  return {
    rootDir,
    port: Number(mergedEnv.PORT || 8787),
    dataDir: mergedEnv.DATA_DIR
      ? path.resolve(rootDir, mergedEnv.DATA_DIR)
      : path.join(rootDir, "data"),
    ai: {
      provider,
      model: mergedEnv.AI_MODEL || (provider === "ollama" ? "llama3.1" : "gpt-4.1-mini"),
      baseUrl:
        mergedEnv.AI_BASE_URL ||
        (provider === "ollama" ? "http://localhost:11434" : "https://api.openai.com/v1"),
      apiKey: mergedEnv.AI_API_KEY || "",
    },
  };
}

function createApp(options = {}) {
  const config = options.config || readConfig(options.env, options.rootDir);
  const store = options.store || createStore({ dataDir: config.dataDir });
  const ai = options.ai || createAiClient(config.ai);

  const server = http.createServer(async (req, res) => {
    setCors(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      if (url.pathname.startsWith("/api/")) {
        await handleApi({ req, res, url, store, ai, config });
        return;
      }
      serveStatic(config.rootDir, url.pathname, res);
    } catch (error) {
      sendJson(res, error.statusCode || 500, {
        error: error.message || "Internal server error",
      });
    }
  });

  return { server, store, ai, config };
}

async function handleApi({ req, res, url, store, ai, config }) {
  const method = req.method;
  const pathName = url.pathname;
  const parts = pathName.split("/").filter(Boolean);

  if (method === "GET" && pathName === "/api/health") {
    const effectiveAi = await store.getEffectiveAiConfig(config.ai);
    const aiInfo = ai.publicInfo(effectiveAi);
    sendJson(res, 200, {
      ok: true,
      version: "0.2.0",
      provider: aiInfo.provider,
      model: aiInfo.model,
      baseUrl: aiInfo.baseUrl,
      storage: path.relative(config.rootDir, store.dataFile),
    });
    return;
  }

  if (method === "GET" && pathName === "/api/state") {
    const effectiveAi = await store.getEffectiveAiConfig(config.ai);
    const aiInfo = ai.publicInfo(effectiveAi);
    const state = await store.getState();
    state.settings = {
      ...state.settings,
      defaultModel: aiInfo.model,
      defaultProviderId: effectiveAi.id || state.settings.defaultProviderId,
      providerLabel: aiInfo.provider,
      providerBaseUrl: aiInfo.baseUrl,
    };
    sendJson(res, 200, state);
    return;
  }

  if (method === "GET" && pathName === "/api/export") {
    sendJson(res, 200, await store.exportData());
    return;
  }

  if (method === "GET" && pathName === "/api/ai-providers") {
    sendJson(res, 200, await store.listAiProviders());
    return;
  }

  if (parts[1] === "ai-providers" && parts[2] && method === "PATCH") {
    sendJson(res, 200, await store.saveAiProvider(parts[2], await readJson(req)));
    return;
  }

  if (parts[1] === "ai-providers" && parts[2] && parts[3] === "test" && method === "POST") {
    const providerConfig = await store.getEffectiveAiConfig(config.ai, parts[2]);
    if (providerConfig.keyRequired && !providerConfig.apiKey) {
      throw createHttpError(400, "API key is missing for this provider");
    }
    const reply = await ai.createReply({
      prompt: "Antworte nur mit: Verbindung OK.",
      mode: "setup-test",
      tool: { id: "ki-setup", label: "KI-Setup" },
      model: providerConfig.model,
      workspace: "Digital World",
      providerConfig,
    });
    sendJson(res, 200, {
      ok: true,
      provider: reply.provider,
      model: reply.model,
      reply: reply.reply,
    });
    return;
  }

  if (method === "PATCH" && pathName === "/api/settings") {
    sendJson(res, 200, await store.saveSettings(await readJson(req)));
    return;
  }

  if (method === "POST" && pathName === "/api/import") {
    const body = await readJson(req);
    const imported = await store.importData(body.data || body, body.mode || "replace");
    sendJson(res, 200, { ok: true, state: imported });
    return;
  }

  if (method === "POST" && pathName === "/api/demo/seed") {
    sendJson(res, 200, { ok: true, state: await store.reset() });
    return;
  }

  if (method === "GET" && pathName === "/api/prompts") {
    sendJson(res, 200, (await store.readData()).prompts);
    return;
  }

  if (method === "POST" && pathName === "/api/prompts") {
    sendJson(res, 201, await store.addPrompt(await readJson(req)));
    return;
  }

  if (parts[1] === "prompts" && parts[2] && method === "DELETE") {
    sendJson(res, 200, await store.deletePrompt(parts[2]));
    return;
  }

  if (method === "GET" && pathName === "/api/workflows") {
    sendJson(res, 200, (await store.readData()).workflows);
    return;
  }

  if (method === "POST" && pathName === "/api/workflows") {
    sendJson(res, 201, await store.addWorkflow(await readJson(req)));
    return;
  }

  if (parts[1] === "workflows" && parts[2] && method === "PATCH") {
    sendJson(res, 200, await store.patchWorkflow(parts[2], await readJson(req)));
    return;
  }

  if (parts[1] === "workflows" && parts[2] && parts[3] === "run" && method === "POST") {
    sendJson(res, 201, await store.runWorkflow(parts[2], await readJson(req)));
    return;
  }

  if (method === "GET" && pathName === "/api/agents") {
    sendJson(res, 200, (await store.readData()).agents);
    return;
  }

  if (parts[1] === "agents" && parts[2] && method === "PATCH") {
    const body = await readJson(req);
    sendJson(res, 200, await store.patchAgent(parts[2], body));
    return;
  }

  if (parts[1] === "agents" && parts[2] && parts[3] === "run" && method === "POST") {
    const body = await readJson(req);
    const agent = await store.getAgent(parts[2]);
    if (!agent.active) throw createHttpError(400, "Agent is paused");
    const prompt = clean(body.prompt);
    if (!prompt) throw createHttpError(400, "Prompt is required");
    const providerConfig = await store.getEffectiveAiConfig(
      config.ai,
      agent.providerId || body.providerId,
    );
    const reply = await ai.createReply({
      prompt: buildAgentPrompt(agent, prompt),
      mode: "agent",
      tool: { id: `agent-${agent.id}`, label: agent.name },
      model: agent.model || body.model || providerConfig.model,
      workspace: body.workspace || "Digital World",
      providerConfig,
      agent,
    });
    const run = await store.createRun(
      {
        prompt,
        mode: "agent",
        tool: { id: `agent-${agent.id}`, label: agent.name },
        model: reply.model,
        agentId: agent.id,
      },
      reply,
    );
    sendJson(res, 201, { ...reply, agent, run });
    return;
  }

  if (method === "GET" && pathName === "/api/runs") {
    sendJson(res, 200, (await store.readData()).runs);
    return;
  }

  if (method === "POST" && pathName === "/api/runs") {
    const body = await readJson(req);
    const providerConfig = await store.getEffectiveAiConfig(config.ai, body.providerId);
    const reply = await ai.createReply({ ...body, providerConfig });
    const run = await store.createRun(body, reply);
    sendJson(res, 201, { ...reply, run });
    return;
  }

  if (method === "DELETE" && pathName === "/api/runs/completed") {
    sendJson(res, 200, await store.clearCompletedRuns());
    return;
  }

  if (method === "POST" && pathName === "/api/chat") {
    const body = await readJson(req);
    const providerConfig = await store.getEffectiveAiConfig(config.ai, body.providerId);
    sendJson(res, 200, await ai.createReply({ ...body, providerConfig }));
    return;
  }

  sendJson(res, 404, { error: "API route not found" });
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(createHttpError(413, "Request body too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(createHttpError(400, "Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function serveStatic(rootDir, urlPath, res) {
  const requestPath = decodeURIComponent(urlPath === "/" ? "/index.html" : urlPath);
  const filePath = path.resolve(rootDir, `.${requestPath}`);
  if (!filePath.startsWith(rootDir)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(rootDir, "index.html"), (fallbackError, fallback) => {
        if (fallbackError) {
          sendJson(res, 404, { error: "Not found" });
          return;
        }
        res.writeHead(200, { "Content-Type": contentTypes[".html"] });
        res.end(fallback);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
    res.end(data);
  });
}

function buildAgentPrompt(agent, prompt) {
  return [
    `Agent: ${agent.name}`,
    `Rolle: ${agent.role}`,
    `Tools: ${(agent.tools || []).join(", ") || "keine externen Tools"}`,
    "",
    "Agenten-Briefing:",
    agent.instructions || "Arbeite strukturiert, knapp und praktisch.",
    "",
    "Arbeitsregeln:",
    "- Antworte als dieser Agent, nicht als allgemeiner Chatbot.",
    "- Liefere ein nutzbares Arbeitsergebnis mit naechsten Schritten.",
    "- Nenne Annahmen und Risiken kurz, wenn sie relevant sind.",
    "",
    "Nutzerauftrag:",
    prompt,
  ].join("\n");
}

function clean(value) {
  return String(value ?? "").trim();
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function readDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed
      .slice(index + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    env[key] = value;
  }
  return env;
}

module.exports = {
  createApp,
  readConfig,
};
