const { createApp, readConfig } = require("./src/server-app");

if (require.main === module) {
  const config = readConfig(process.env, __dirname);
  const { server, ai } = createApp({ config });
  server.listen(config.port, () => {
    const info = ai.publicInfo(config.ai);
    console.log(`Digital World KI Dashboard: http://localhost:${config.port}`);
    console.log(`AI provider: ${info.provider} (${info.model})`);
    console.log(`Data dir: ${config.dataDir}`);
  });
}

module.exports = {
  createApp,
  readConfig,
};
