const { createApp, readConfig } = require("../server");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");

async function main() {
  const rootDir = path.resolve(__dirname, "..");
  const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), "dw-dashboard-smoke-"));
  const config = readConfig(
    {
      ...process.env,
      PORT: "0",
      DATA_DIR: dataDir,
      AI_PROVIDER: "mock",
      AI_MODEL: "smoke-model",
    },
    rootDir,
  );
  const { server } = createApp({ config });
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const health = await getJson(`${baseUrl}/api/health`);
    const state = await getJson(`${baseUrl}/api/state`);
    const run = await postJson(`${baseUrl}/api/runs`, {
      prompt: "Smoke-Test fuer das Digital World KI Dashboard",
      mode: "auto",
      tool: { id: "qa", label: "QA" },
      model: health.model,
      workspace: state.settings.workspaceName,
    });

    console.log("Smoke OK");
    console.log(`Provider: ${health.provider}`);
    console.log(`Model: ${health.model}`);
    console.log(`Prompts: ${state.prompts.length}`);
    console.log(`Workflows: ${state.workflows.length}`);
    console.log(`Run: ${run.run.status}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    await fs.rm(dataDir, { recursive: true, force: true });
  }
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
