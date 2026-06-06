const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const files = [
  "server.js",
  "app.js",
  "src/ai.js",
  "src/seeds.js",
  "src/server-app.js",
  "src/store.js",
  "test/api.test.js",
  "test/smoke.js",
].map((file) => path.join(root, file));

let failed = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    failed = true;
    process.stderr.write(result.stderr || result.stdout);
  } else {
    process.stdout.write(`ok ${path.relative(root, file)}\n`);
  }
}

process.exit(failed ? 1 : 0);
