function createAiClient(config) {
  return {
    publicInfo(overrideConfig) {
      const runtime = normalizeRuntimeConfig(overrideConfig || config);
      return {
        provider: runtime.providerLabel || runtime.provider,
        model: runtime.model,
        baseUrl: runtime.provider === "mock" ? "local" : redactBaseUrl(runtime.baseUrl),
      };
    },
    async createReply(body) {
      const prompt = String(body.prompt || "").trim();
      const runtime = normalizeRuntimeConfig(body.providerConfig || config);
      const selectedModel = body.model || runtime.model;
      if (!prompt) {
        return { reply: "Kein Prompt erhalten.", provider: runtime.providerLabel, model: selectedModel };
      }

      if (runtime.keyRequired && !runtime.apiKey) {
        throw createHttpError(500, "AI provider API key is missing");
      }

      if (runtime.provider === "ollama") {
        return callOllama({ prompt, body, model: selectedModel, config: runtime });
      }

      if (runtime.provider === "anthropic") {
        return callAnthropic({ prompt, body, model: selectedModel, config: runtime });
      }

      if (runtime.provider === "gemini") {
        return callGemini({ prompt, body, model: selectedModel, config: runtime });
      }

      if (runtime.provider === "azure-openai") {
        return callAzureOpenAI({ prompt, body, model: selectedModel, config: runtime });
      }

      if (runtime.provider === "openai-compatible" || runtime.provider === "openai") {
        return callOpenAICompatible({ prompt, body, model: selectedModel, config: runtime });
      }

      return {
        provider: runtime.providerLabel || "mock",
        model: selectedModel,
        reply: mockReply(prompt, body),
      };
    },
  };
}

function normalizeRuntimeConfig(config) {
  const provider = (config.provider || config.adapter || "mock").toLowerCase();
  const model = config.model || (provider === "ollama" ? "llama3.1" : "gpt-4.1-mini");
  const baseUrl =
    config.baseUrl ||
    (provider === "ollama" ? "http://localhost:11434" : "https://api.openai.com/v1");
  return {
    id: config.id || provider,
    provider,
    providerLabel: config.providerLabel || config.name || config.id || provider,
    model,
    baseUrl,
    apiKey: config.apiKey || "",
    keyRequired: Boolean(config.keyRequired),
  };
}

const systemPrompt = [
  "Du bist das serverseitige KI-Backend des Digital World KI Dashboards.",
  "Antworte immer in der Sprache des Nutzers.",
  "Du bist kein Lexikon. Du hilfst dem Nutzer, Dinge praktisch zu verstehen.",
  "Wenn der Nutzer ein Anfaenger ist oder etwas erklaert haben moechte, antworte wie ein geduldiger Lehrer:",
  "- einfache Woerter",
  "- kurze Saetze",
  "- klare Struktur",
  "- ein konkretes Alltagsbeispiel",
  "- keine Fachbegriffe ohne kurze Erklaerung",
  "- keine Abschweifungen zu Deep Learning, Nervenzellen oder komplexen Algorithmen, wenn der Nutzer das nicht fragt",
  "Wenn du unsicher bist, sage das klar.",
  "Erfinde keine technischen Details.",
  "Bei deutschen Antworten: Schreibe sauber, direkt und ohne verschachtelte Saetze.",
].join("\n");

async function callOpenAICompatible({ prompt, body, model, config }) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (config.apiKey) headers.Authorization = `Bearer ${config.apiKey}`;

  const response = await fetch(`${trimSlash(config.baseUrl)}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: buildUserMessage(prompt, body),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw createHttpError(502, await readProviderError(response, "OpenAI-compatible provider"));
  }
  const data = await response.json();
  return {
    provider: config.providerLabel,
    model: data.model || model,
    reply: applyAnswerGuardrails(prompt, data.choices?.[0]?.message?.content || ""),
  };
}

async function callAnthropic({ prompt, body, model, config }) {
  const response = await fetch(`${trimSlash(config.baseUrl)}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 700,
      temperature: 0.4,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: buildUserMessage(prompt, body),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw createHttpError(502, await readProviderError(response, "Anthropic"));
  }
  const data = await response.json();
  const reply = Array.isArray(data.content)
    ? data.content.map((part) => part.text || "").join("")
    : "";
  return {
    provider: config.providerLabel,
    model: data.model || model,
    reply: applyAnswerGuardrails(prompt, reply),
  };
}

async function callGemini({ prompt, body, model, config }) {
  const url = `${trimSlash(config.baseUrl)}/models/${encodeURIComponent(
    model,
  )}:generateContent?key=${encodeURIComponent(config.apiKey)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: buildUserMessage(prompt, body) }],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 700,
      },
    }),
  });

  if (!response.ok) {
    throw createHttpError(502, await readProviderError(response, "Gemini"));
  }
  const data = await response.json();
  const reply =
    data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("") || "";
  return {
    provider: config.providerLabel,
    model,
    reply: applyAnswerGuardrails(prompt, reply),
  };
}

async function callAzureOpenAI({ prompt, body, model, config }) {
  const url = `${trimSlash(config.baseUrl)}/openai/deployments/${encodeURIComponent(
    model,
  )}/chat/completions?api-version=2024-10-21`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": config.apiKey,
    },
    body: JSON.stringify({
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: buildUserMessage(prompt, body),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw createHttpError(502, await readProviderError(response, "Azure OpenAI"));
  }
  const data = await response.json();
  return {
    provider: config.providerLabel,
    model,
    reply: applyAnswerGuardrails(prompt, data.choices?.[0]?.message?.content || ""),
  };
}

async function callOllama({ prompt, body, model, config }) {
  const response = await fetch(`${trimSlash(config.baseUrl)}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      options: {
        temperature: 0.1,
        top_p: 0.7,
        num_predict: 260,
        repeat_penalty: 1.1,
      },
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: buildUserMessage(prompt, body),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw createHttpError(502, await readProviderError(response, "Ollama"));
  }
  const data = await response.json();
  return {
    provider: config.providerLabel || "ollama",
    model: data.model || model,
    reply: applyAnswerGuardrails(prompt, data.message?.content || ""),
  };
}

function buildUserMessage(prompt, body) {
  const tool = body.tool?.label || body.tool?.id || "Standard";
  const mode = body.mode || "auto";
  const workspace = body.workspace || "Digital World";
  const beginnerRules = isBeginnerAiQuestion(prompt)
    ? [
        "",
        "Spezialmodus: Anfaenger-Erklaerung zu KI",
        "Antworte mit genau dieser Struktur:",
        "",
        "## Was ist KI?",
        "2 kurze Saetze. Beginne mit: KI steht fuer Kuenstliche Intelligenz.",
        "",
        "## Beispiel",
        "Ein einziges Alltagsbeispiel, z.B. Chatbot, Navi oder Spamfilter.",
        "",
        "## Wichtig zu wissen",
        "- KI denkt nicht wie ein Mensch.",
        "- KI erkennt Muster in Daten und erzeugt daraus Antworten oder Vorschlaege.",
        "",
        "## Merksatz",
        "Ein kurzer Satz.",
        "",
        "Verbote:",
        "- Erwaehne Deep Learning nicht.",
        "- Erwaehne Nervenzellen nicht.",
        "- Erwaehne Algorithmen nur, wenn du es mit 'Rechenregel' in Klammern erklaerst.",
        "- Keine langen Listen.",
        "- Keine Formulierungen wie 'Lernende Maschinen' oder 'menschliches Gehirn nachahmen'.",
        "- Maximal 140 Woerter.",
      ].join("\n")
    : "";
  return [
    `Workspace: ${workspace}`,
    `Modus: ${mode}`,
    `Tool: ${tool}`,
    "",
    "Qualitaetsregeln:",
    "- Beantworte genau die Frage des Nutzers.",
    "- Erklaere fuer das passende Wissensniveau.",
    "- Verwende bei Erklaerungen erst die einfache Definition, dann Beispiel, dann kurze Zusammenfassung.",
    "- Nutze keine unnatuerlichen Begriffe wie Geistiges Organisator.",
    beginnerRules,
    "",
    "Nutzerauftrag:",
    prompt,
  ].join("\n");
}

function isBeginnerAiQuestion(prompt) {
  const normalized = prompt.toLowerCase();
  const asksForBeginner =
    normalized.includes("anfänger") ||
    normalized.includes("anfaenger") ||
    normalized.includes("einfach") ||
    normalized.includes("leicht") ||
    normalized.includes("verständlich") ||
    normalized.includes("verstaendlich");
  const asksAboutAi =
    normalized.includes("ki") ||
    normalized.includes("künstliche intelligenz") ||
    normalized.includes("kuenstliche intelligenz");
  return asksForBeginner && asksAboutAi;
}

function applyAnswerGuardrails(prompt, reply) {
  if (!isBeginnerAiQuestion(prompt)) return reply;

  const normalizedReply = reply.toLowerCase();
  const hasForbiddenDrift =
    normalizedReply.includes("deep learning") ||
    normalizedReply.includes("nervenzellen") ||
    normalizedReply.includes("lernende maschinen") ||
    normalizedReply.includes("menschliches gehirn") ||
    normalizedReply.includes("algorithmen");
  const hasRequiredShape =
    normalizedReply.includes("was ist ki") &&
    normalizedReply.includes("beispiel") &&
    normalizedReply.includes("wichtig") &&
    normalizedReply.includes("merksatz");

  if (!hasForbiddenDrift && hasRequiredShape) return reply;

  return [
    "## Was ist KI?",
    "",
    "KI steht für Künstliche Intelligenz.",
    "Damit meint man Computerprogramme, die Aufgaben erledigen können, für die man sonst menschliches Denken, Sprache oder Mustererkennung braucht.",
    "",
    "## Beispiel",
    "",
    "Ein Chatbot ist ein einfaches Beispiel.",
    "Du stellst eine Frage, und die KI erstellt aus gelernten Mustern eine passende Antwort.",
    "",
    "## Wichtig zu wissen",
    "",
    "- KI denkt nicht wie ein Mensch.",
    "- KI erkennt Muster in Daten und macht daraus Antworten, Vorschläge oder Entscheidungen.",
    "- KI kann hilfreich sein, kann sich aber auch irren.",
    "",
    "## Merksatz",
    "",
    "KI ist ein Werkzeug, das aus Daten lernt und dir bei Aufgaben helfen kann.",
  ].join("\n");
}

function mockReply(prompt, body) {
  const tool = body.tool?.label || "KI";
  const normalized = prompt.toLowerCase();
  if (normalized.includes("was genau") && normalized.includes("ki")) {
    return [
      "Demo-Antwort des Backend-Mocks:",
      "",
      "KI steht fuer Kuenstliche Intelligenz. Gemeint sind Software-Systeme, die Aufgaben erledigen, fuer die man frueher menschliches Denken gebraucht haette: Texte verstehen, Informationen zusammenfassen, Bilder erzeugen, Code schreiben, Entscheidungen vorbereiten oder Prozesse automatisieren.",
      "",
      "Fuer dieses Dashboard bedeutet KI konkret:",
      "1. Chat: Fragen beantworten und Ideen ausarbeiten.",
      "2. Research: Themen strukturieren und Quellenarbeit vorbereiten.",
      "3. Content: Posts, Skripte, Newsletter und Bilder planen.",
      "4. Agents: wiederkehrende Aufgaben mit Rollen und Tools ausfuehren.",
      "5. Workflows: KI-Schritte mit Automationen wie n8n, Make oder Webhooks verbinden.",
      "",
      "Hinweis: Das ist noch keine echte Modellantwort. Fuer echte Antworten konfiguriere Ollama oder einen OpenAI-kompatiblen Provider.",
    ].join("\n");
  }

  return [
    `Demo-Antwort fuer ${tool}:`,
    "",
    `Auftrag: ${prompt.slice(0, 120)}`,
    "",
    "1. Ziel und gewuenschtes Ergebnis klaeren.",
    "2. Datenquellen, Tools und Grenzen festlegen.",
    "3. Einen kleinen MVP-Ablauf erstellen.",
    "4. Ergebnis pruefen und als Workflow oder Vorlage speichern.",
    "5. Fuer echte Modellantworten Ollama oder einen OpenAI-kompatiblen Provider anbinden.",
  ].join("\n");
}

function trimSlash(value) {
  return String(value).replace(/\/$/, "");
}

function redactBaseUrl(value) {
  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`;
  } catch {
    return "configured";
  }
}

async function readProviderError(response, providerName) {
  let detail = "";
  try {
    const raw = await response.text();
    if (raw) {
      try {
        const data = JSON.parse(raw);
        detail =
          data.error?.message ||
          data.error ||
          data.message ||
          data.detail ||
          raw.slice(0, 280);
      } catch {
        detail = raw.slice(0, 280);
      }
    }
  } catch {
    detail = "";
  }
  return detail
    ? `${providerName} returned ${response.status}: ${detail}`
    : `${providerName} returned ${response.status}`;
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  createAiClient,
  mockReply,
};
