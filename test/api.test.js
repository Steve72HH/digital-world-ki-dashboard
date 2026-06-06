const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { createApp, readConfig } = require("../server");

async function withTestServer(run) {
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "dw-dashboard-"));
  const config = readConfig(
    {
      PORT: "0",
      DATA_DIR: dataDir,
      AI_PROVIDER: "mock",
      AI_MODEL: "test-model",
    },
    path.resolve(__dirname, ".."),
  );
  const { server, store } = createApp({ config });
  await new Promise((resolve) => server.listen(0, resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  try {
    await run({ baseUrl, store, dataDir });
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    await fs.rm(dataDir, { recursive: true, force: true });
  }
}

async function withWebhookReceiver(run) {
  const requests = [];
  const server = http.createServer((req, res) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      const body = raw ? JSON.parse(raw) : {};
      requests.push({ method: req.method, url: req.url, body });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, receivedWorkflow: body.workflow?.id }));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}/webhook/test`;
  try {
    await run({ url, requests });
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

test("health endpoint exposes provider, model and storage", async () => {
  await withTestServer(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.ok, true);
    assert.equal(data.provider, "mock");
    assert.equal(data.model, "test-model");
    assert.match(data.storage, /dashboard\.json$/);
  });
});

test("state endpoint returns seeded workspace data", async () => {
  await withTestServer(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/state`);
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.equal(data.version, 2);
    assert.ok(data.prompts.length >= 3);
    assert.ok(data.workflows.length >= 3);
    assert.ok(data.agents.some((agent) => agent.active));
    assert.equal(typeof data.metrics.activeWorkflows, "number");
  });
});

test("prompt creation is persisted", async () => {
  await withTestServer(async ({ baseUrl, store }) => {
    const response = await fetch(`${baseUrl}/api/prompts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Test Prompt",
        text: "Bitte baue eine Testautomation.",
      }),
    });
    assert.equal(response.status, 201);
    const created = await response.json();
    assert.equal(created.title, "Test Prompt");

    const data = await store.readData();
    assert.equal(data.prompts[0].id, created.id);
    assert.equal(data.prompts[0].text, "Bitte baue eine Testautomation.");
  });
});

test("run creation stores a completed mock response", async () => {
  await withTestServer(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/runs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Erstelle einen Testlauf",
        mode: "auto",
        tool: { id: "qa", label: "QA" },
        model: "test-model",
        workspace: "Digital World",
      }),
    });
    assert.equal(response.status, 201);
    const payload = await response.json();
    assert.equal(payload.run.status, "done");
    assert.match(payload.run.output, /Demo-Antwort fuer QA/);

    const runs = await (await fetch(`${baseUrl}/api/runs`)).json();
    assert.equal(runs.length, 1);
    assert.equal(runs[0].id, payload.run.id);
  });
});

test("workflow and agent patch endpoints update state", async () => {
  await withTestServer(async ({ baseUrl }) => {
    const workflows = await (await fetch(`${baseUrl}/api/workflows`)).json();
    const targetWorkflow = workflows.find((workflow) => workflow.id === "support-triage");
    assert.equal(targetWorkflow.active, false);

    const workflowResponse = await fetch(`${baseUrl}/api/workflows/support-triage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: true }),
    });
    assert.equal(workflowResponse.status, 200);
    assert.equal((await workflowResponse.json()).active, true);

    const agentResponse = await fetch(`${baseUrl}/api/agents/code`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: true }),
    });
    assert.equal(agentResponse.status, 200);
    assert.equal((await agentResponse.json()).active, true);
  });
});

test("workflow runner creates a local dry run without webhook", async () => {
  await withTestServer(async ({ baseUrl, store }) => {
    const response = await fetch(`${baseUrl}/api/workflows/lead-research/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Teste die lokale Workflow-Vorbereitung",
        workspace: "Digital World",
      }),
    });
    assert.equal(response.status, 201);
    const run = await response.json();
    assert.equal(run.toolLabel, "Lead-Recherche");
    assert.equal(run.model, "local-dry-run");
    assert.match(run.output, /Kein Webhook konfiguriert/);

    const data = await store.readData();
    const workflow = data.workflows.find((item) => item.id === "lead-research");
    assert.equal(workflow.lastStatus, "lokal");
    assert.ok(workflow.lastRunAt);
  });
});

test("workflow runner posts JSON to configured webhook", async () => {
  await withTestServer(async ({ baseUrl, store }) => {
    await withWebhookReceiver(async ({ url, requests }) => {
      const patchResponse = await fetch(`${baseUrl}/api/workflows/support-triage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: url,
          trigger: "Test Webhook",
          owner: "QA",
        }),
      });
      assert.equal(patchResponse.status, 200);

      const runResponse = await fetch(`${baseUrl}/api/workflows/support-triage/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Support-Mail priorisieren",
          workspace: "Digital World",
        }),
      });
      assert.equal(runResponse.status, 201);
      const run = await runResponse.json();
      assert.equal(run.model, "webhook-post");
      assert.equal(run.provider, "Webhook Runner");
      assert.match(run.output, /HTTP 200/);

      assert.equal(requests.length, 1);
      assert.equal(requests[0].method, "POST");
      assert.equal(requests[0].body.source, "digital-world-ki-dashboard");
      assert.equal(requests[0].body.prompt, "Support-Mail priorisieren");
      assert.equal(requests[0].body.workflow.id, "support-triage");

      const data = await store.readData();
      const workflow = data.workflows.find((item) => item.id === "support-triage");
      assert.equal(workflow.lastStatus, "OK HTTP 200");
      assert.match(workflow.lastResponse, /receivedWorkflow/);
    });
  });
});

test("AI provider setup stores keys server-side and redacts public payloads", async () => {
  await withTestServer(async ({ baseUrl, store }) => {
    const providers = await (await fetch(`${baseUrl}/api/ai-providers`)).json();
    const openai = providers.find((provider) => provider.id === "openai");
    assert.ok(openai);
    assert.equal(openai.apiKey, undefined);
    assert.equal(openai.apiKeySet, false);

    const patchResponse = await fetch(`${baseUrl}/api/ai-providers/openai`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabled: true,
        apiKey: "test-api-secret",
        model: "gpt-test",
        defaultProvider: true,
      }),
    });
    assert.equal(patchResponse.status, 200);
    const patched = await patchResponse.json();
    assert.equal(patched.apiKey, undefined);
    assert.equal(patched.apiKeySet, true);
    assert.equal(patched.apiKeyMasked, "test••••cret");

    const data = await store.readData();
    assert.equal(data.aiProviders.find((provider) => provider.id === "openai").apiKey, "test-api-secret");

    const exported = await (await fetch(`${baseUrl}/api/export`)).json();
    const exportedOpenai = exported.aiProviders.find((provider) => provider.id === "openai");
    assert.equal(exportedOpenai.apiKey, undefined);
    assert.equal(exportedOpenai.apiKeySet, true);

    const health = await (await fetch(`${baseUrl}/api/health`)).json();
    assert.equal(health.provider, "ChatGPT / OpenAI");
    assert.equal(health.model, "gpt-test");
  });
});

test("settings endpoint persists provider routing", async () => {
  await withTestServer(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultProviderId: "ollama",
        defaultModel: "llama3.2:1b",
        providerRouting: {
          code: "openai",
          researcher: "openrouter",
        },
      }),
    });
    assert.equal(response.status, 200);
    const settings = await response.json();
    assert.equal(settings.providerRouting.code, "openai");
    assert.equal(settings.providerRouting.researcher, "openrouter");

    const state = await (await fetch(`${baseUrl}/api/state`)).json();
    assert.equal(state.settings.providerRouting.code, "openai");
    assert.equal(state.settings.providerRouting.researcher, "openrouter");
  });
});

test("agent profiles can be configured and executed", async () => {
  await withTestServer(async ({ baseUrl }) => {
    const patchResponse = await fetch(`${baseUrl}/api/agents/code`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        active: true,
        model: "agent-test-model",
        instructions: "Arbeite als Test-Code-Agent.",
      }),
    });
    assert.equal(patchResponse.status, 200);
    const agent = await patchResponse.json();
    assert.equal(agent.active, true);
    assert.equal(agent.model, "agent-test-model");
    assert.equal(agent.instructions, "Arbeite als Test-Code-Agent.");

    const runResponse = await fetch(`${baseUrl}/api/agents/code/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Plane einen kleinen Test",
        workspace: "Digital World",
      }),
    });
    assert.equal(runResponse.status, 201);
    const payload = await runResponse.json();
    assert.equal(payload.run.agentId, "code");
    assert.equal(payload.run.toolLabel, "Code Operator");
    assert.equal(payload.run.model, "agent-test-model");
    assert.match(payload.run.output, /Demo-Antwort fuer Code Operator/);
  });
});

test("static index is served", async () => {
  await withTestServer(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Digital World KI Dashboard/);
    assert.match(html, /app\.js/);
  });
});
