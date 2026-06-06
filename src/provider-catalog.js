const providerCatalog = [
  {
    id: "ollama",
    name: "Ollama lokal",
    company: "Local",
    adapter: "ollama",
    category: "Lokal",
    defaultBaseUrl: "http://localhost:11434",
    defaultModel: "llama3.2:1b",
    keyRequired: false,
    description: "Lokale Modelle auf deinem Server oder PC.",
  },
  {
    id: "lm-studio",
    name: "LM Studio",
    company: "Local",
    adapter: "openai-compatible",
    category: "Lokal",
    defaultBaseUrl: "http://localhost:1234/v1",
    defaultModel: "local-model",
    keyRequired: false,
    description: "Lokaler OpenAI-kompatibler Server fuer Desktop-Modelle.",
  },
  {
    id: "openai",
    name: "ChatGPT / OpenAI",
    company: "OpenAI",
    adapter: "openai-compatible",
    category: "Allround",
    defaultBaseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4.1-mini",
    keyRequired: true,
    description: "Allround-Modelle fuer Chat, Analyse, Content und Tool-Aufrufe.",
  },
  {
    id: "openai-codex",
    name: "Codex",
    company: "OpenAI",
    adapter: "openai-compatible",
    category: "Code",
    defaultBaseUrl: "https://api.openai.com/v1",
    defaultModel: "codex-mini-latest",
    keyRequired: true,
    description: "Preset fuer Coding-Aufgaben, Reviews und Repo-Arbeit.",
  },
  {
    id: "anthropic",
    name: "Claude",
    company: "Anthropic",
    adapter: "anthropic",
    category: "Allround",
    defaultBaseUrl: "https://api.anthropic.com/v1",
    defaultModel: "claude-3-5-sonnet-latest",
    keyRequired: true,
    description: "Stark fuer lange Texte, Analyse, Schreiben und komplexe Assistenz.",
  },
  {
    id: "google-gemini",
    name: "Gemini",
    company: "Google",
    adapter: "gemini",
    category: "Allround",
    defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
    defaultModel: "gemini-2.5-flash",
    keyRequired: true,
    description: "Google-Modelle fuer schnelle Assistenz, Multimodalitaet und Recherche-Workflows.",
  },
  {
    id: "mistral",
    name: "Mistral",
    company: "Mistral AI",
    adapter: "openai-compatible",
    category: "EU",
    defaultBaseUrl: "https://api.mistral.ai/v1",
    defaultModel: "mistral-small-latest",
    keyRequired: true,
    description: "Europaeischer Anbieter mit OpenAI-kompatibler Chat-API.",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    company: "DeepSeek",
    adapter: "openai-compatible",
    category: "Reasoning",
    defaultBaseUrl: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
    keyRequired: true,
    description: "Preisbewusste Chat- und Reasoning-Modelle.",
  },
  {
    id: "groq",
    name: "Groq",
    company: "Groq",
    adapter: "openai-compatible",
    category: "Speed",
    defaultBaseUrl: "https://api.groq.com/openai/v1",
    defaultModel: "llama-3.3-70b-versatile",
    keyRequired: true,
    description: "Sehr schnelle Inferenz fuer Chat- und Agenten-Prototypen.",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    company: "OpenRouter",
    adapter: "openai-compatible",
    category: "Router",
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "openai/gpt-4.1-mini",
    keyRequired: true,
    description: "Ein Key fuer viele Modellanbieter und Modellvergleiche.",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    company: "Perplexity",
    adapter: "openai-compatible",
    category: "Recherche",
    defaultBaseUrl: "https://api.perplexity.ai",
    defaultModel: "sonar-pro",
    keyRequired: true,
    description: "Recherche-orientierte Antworten mit Web-Fokus.",
  },
  {
    id: "xai",
    name: "Grok / xAI",
    company: "xAI",
    adapter: "openai-compatible",
    category: "Allround",
    defaultBaseUrl: "https://api.x.ai/v1",
    defaultModel: "grok-3-mini",
    keyRequired: true,
    description: "OpenAI-kompatibler Zugang zu Grok-Modellen.",
  },
  {
    id: "together",
    name: "Together AI",
    company: "Together AI",
    adapter: "openai-compatible",
    category: "Open Source",
    defaultBaseUrl: "https://api.together.xyz/v1",
    defaultModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    keyRequired: true,
    description: "Hosting fuer viele offene Modelle.",
  },
  {
    id: "azure-openai",
    name: "Azure OpenAI",
    company: "Microsoft",
    adapter: "azure-openai",
    category: "Enterprise",
    defaultBaseUrl: "https://<resource>.openai.azure.com",
    defaultModel: "deployment-name",
    keyRequired: true,
    description: "Azure-Deployment mit eigenem Resource-Endpunkt und Deployment-Namen.",
  },
  {
    id: "openclaw",
    name: "OpenClaw / Custom Agent",
    company: "Custom",
    adapter: "openai-compatible",
    category: "Automation",
    defaultBaseUrl: "http://localhost:8080/v1",
    defaultModel: "openclaw-agent",
    keyRequired: false,
    description: "Freies Preset fuer eigene Claw-/Agenten-Server mit OpenAI-kompatibler API.",
  },
  {
    id: "custom",
    name: "Eigener Provider",
    company: "Custom",
    adapter: "openai-compatible",
    category: "Custom",
    defaultBaseUrl: "https://example.com/v1",
    defaultModel: "model-name",
    keyRequired: false,
    description: "Fallback fuer jeden OpenAI-kompatiblen Anbieter.",
  },
];

function createDefaultAiProviders() {
  return providerCatalog.map((provider, index) => ({
    ...provider,
    baseUrl: provider.defaultBaseUrl,
    model: provider.defaultModel,
    enabled: false,
    apiKey: "",
    updatedAt: null,
  }));
}

function normalizeAiProviders(input) {
  const byId = new Map(createDefaultAiProviders().map((provider) => [provider.id, provider]));
  if (Array.isArray(input)) {
    for (const provider of input) {
      const id = clean(provider.id);
      if (!id) continue;
      const base = byId.get(id) || {
        id,
        name: clean(provider.name || id),
        company: clean(provider.company || "Custom"),
        adapter: clean(provider.adapter || "openai-compatible"),
        category: clean(provider.category || "Custom"),
        defaultBaseUrl: clean(provider.defaultBaseUrl || provider.baseUrl || ""),
        defaultModel: clean(provider.defaultModel || provider.model || ""),
        keyRequired: Boolean(provider.keyRequired),
        description: clean(provider.description || "Eigener Provider."),
      };
      byId.set(id, {
        ...base,
        ...provider,
        id,
        name: clean(provider.name || base.name),
        company: clean(provider.company || base.company),
        adapter: clean(provider.adapter || base.adapter),
        category: clean(provider.category || base.category),
        baseUrl: clean(provider.baseUrl || base.baseUrl || base.defaultBaseUrl),
        model: clean(provider.model || base.model || base.defaultModel),
        apiKey: clean(provider.apiKey || base.apiKey || ""),
        enabled: Boolean(provider.enabled),
        keyRequired: Boolean("keyRequired" in provider ? provider.keyRequired : base.keyRequired),
        description: clean(provider.description || base.description),
        updatedAt: provider.updatedAt || null,
      });
    }
  }
  return Array.from(byId.values());
}

function sanitizeAiProviders(providers) {
  return normalizeAiProviders(providers).map(sanitizeProvider);
}

function sanitizeProvider(provider) {
  const sanitized = { ...provider };
  const apiKey = clean(sanitized.apiKey);
  delete sanitized.apiKey;
  sanitized.apiKeySet = Boolean(apiKey);
  sanitized.apiKeyMasked = maskSecret(apiKey);
  return sanitized;
}

function resolveProviderConfig(data, fallbackConfig, requestedProviderId) {
  const providers = normalizeAiProviders(data.aiProviders);
  const settings = data.settings || {};
  const requested = requestedProviderId
    ? providers.find((provider) => provider.id === requestedProviderId)
    : null;
  const defaulted = !requestedProviderId
    ? providers.find((provider) => provider.id === settings.defaultProviderId && provider.enabled)
    : null;
  const selected =
    requested ||
    defaulted ||
    providers.find((provider) => provider.enabled && provider.apiKey) ||
    providers.find((provider) => provider.enabled && !provider.keyRequired);

  if (selected) {
    return {
      id: selected.id,
      provider: selected.adapter,
      providerLabel: selected.name,
      model: selected.model,
      baseUrl: selected.baseUrl,
      apiKey: selected.apiKey,
      keyRequired: selected.keyRequired,
    };
  }

  const fallbackProvider = clean(fallbackConfig.provider || "mock").toLowerCase();
  return {
    id: "env",
    provider: fallbackProvider,
    providerLabel: fallbackProvider,
    model: fallbackConfig.model,
    baseUrl: fallbackConfig.baseUrl,
    apiKey: fallbackConfig.apiKey,
    keyRequired: !["mock", "ollama"].includes(fallbackProvider),
  };
}

function updateProvider(providers, providerId, patch) {
  const normalized = normalizeAiProviders(providers);
  const provider = normalized.find((item) => item.id === providerId);
  if (!provider) {
    throw createHttpError(404, "AI provider not found");
  }

  if ("enabled" in patch) provider.enabled = Boolean(patch.enabled);
  if ("name" in patch) provider.name = clean(patch.name) || provider.name;
  if ("adapter" in patch) provider.adapter = clean(patch.adapter) || provider.adapter;
  if ("baseUrl" in patch) provider.baseUrl = clean(patch.baseUrl) || provider.baseUrl;
  if ("model" in patch) provider.model = clean(patch.model) || provider.model;
  if ("apiKey" in patch && clean(patch.apiKey)) provider.apiKey = clean(patch.apiKey);
  if (patch.clearKey) provider.apiKey = "";
  provider.updatedAt = new Date().toISOString();
  return normalized;
}

function maskSecret(value) {
  const secret = clean(value);
  if (!secret) return "";
  if (secret.length <= 8) return "••••";
  return `${secret.slice(0, 4)}••••${secret.slice(-4)}`;
}

function clean(value) {
  return String(value ?? "").trim();
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  providerCatalog,
  createDefaultAiProviders,
  normalizeAiProviders,
  sanitizeAiProviders,
  sanitizeProvider,
  resolveProviderConfig,
  updateProvider,
};
