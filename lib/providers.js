// ═══════════════════════════════════════════════════════════════════════════════
// 🔱 SATURNO BEAST — PROVIDERS LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════
// Multi-provider support. BYOK architecture. Zero vendor lock-in.
// ═══════════════════════════════════════════════════════════════════════════════

export const PROVIDERS = {
  anthropic: {
    name: 'Anthropic (Claude)',
    url: 'https://api.anthropic.com/v1/messages',
    keyPrefix: 'sk-ant-',
    defaultModel: 'claude-sonnet-4-20250514',
    models: {
      'claude-sonnet-4-20250514': { name: 'Claude Sonnet 4', maxTokens: 8192, cost: 'low' },
      'claude-opus-4-20250514': { name: 'Claude Opus 4', maxTokens: 8192, cost: 'high' },
      'claude-haiku-4-20250514': { name: 'Claude Haiku 4', maxTokens: 8192, cost: 'lowest' },
    },
    buildRequest: (apiKey, model, system, input, maxTokens) => ({
      url: 'https://api.anthropic.com/v1/messages',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: {
        model,
        max_tokens: maxTokens || 4096,
        system,
        messages: [{ role: 'user', content: input }],
      },
    }),
    parseResponse: (data) => ({
      text: data.content?.[0]?.text || '',
      usage: {
        input: data.usage?.input_tokens || 0,
        output: data.usage?.output_tokens || 0,
      },
      model: data.model,
    }),
    parseError: (data) => data.error?.message || 'Claude API error',
  },

  openai: {
    name: 'OpenAI (GPT)',
    url: 'https://api.openai.com/v1/chat/completions',
    keyPrefix: 'sk-',
    defaultModel: 'gpt-4o',
    models: {
      'gpt-4o': { name: 'GPT-4o', maxTokens: 16384, cost: 'medium' },
      'gpt-4o-mini': { name: 'GPT-4o Mini', maxTokens: 16384, cost: 'lowest' },
      'gpt-4-turbo': { name: 'GPT-4 Turbo', maxTokens: 4096, cost: 'high' },
      'o1': { name: 'o1 (Reasoning)', maxTokens: 100000, cost: 'highest' },
      'o1-mini': { name: 'o1 Mini', maxTokens: 65536, cost: 'high' },
    },
    buildRequest: (apiKey, model, system, input, maxTokens) => ({
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: {
        model,
        max_tokens: maxTokens || 4096,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: input },
        ],
      },
    }),
    parseResponse: (data) => ({
      text: data.choices?.[0]?.message?.content || '',
      usage: {
        input: data.usage?.prompt_tokens || 0,
        output: data.usage?.completion_tokens || 0,
      },
      model: data.model,
    }),
    parseError: (data) => data.error?.message || 'OpenAI API error',
  },

  google: {
    name: 'Google (Gemini)',
    url: 'https://generativelanguage.googleapis.com/v1beta/models',
    keyPrefix: 'AIza',
    defaultModel: 'gemini-2.0-flash',
    models: {
      'gemini-2.0-flash': { name: 'Gemini 2.0 Flash', maxTokens: 8192, cost: 'lowest' },
      'gemini-1.5-pro': { name: 'Gemini 1.5 Pro', maxTokens: 8192, cost: 'medium' },
      'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', maxTokens: 8192, cost: 'low' },
    },
    buildRequest: (apiKey, model, system, input, maxTokens) => ({
      url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      headers: { 'Content-Type': 'application/json' },
      body: {
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ parts: [{ text: input }] }],
        generationConfig: { maxOutputTokens: maxTokens || 4096 },
      },
    }),
    parseResponse: (data) => ({
      text: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
      usage: { input: 0, output: 0 },
      model: 'gemini',
    }),
    parseError: (data) => data.error?.message || 'Gemini API error',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

export function detectProvider(apiKey, hint = null) {
  if (!apiKey) return null;
  
  // Explicit hint takes priority
  if (hint && PROVIDERS[hint]) return hint;
  
  // Auto-detect from key prefix
  if (apiKey.startsWith('sk-ant-')) return 'anthropic';
  if (apiKey.startsWith('AIza')) return 'google';
  if (apiKey.startsWith('sk-')) return 'openai';
  
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CALL PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

export async function callProvider(providerId, apiKey, model, systemPrompt, input, maxTokens = 4096) {
  const provider = PROVIDERS[providerId];
  if (!provider) {
    throw new Error(`Unknown provider: ${providerId}`);
  }

  const selectedModel = model || provider.defaultModel;
  const req = provider.buildRequest(apiKey, selectedModel, systemPrompt, input, maxTokens);

  const startTime = Date.now();
  
  const response = await fetch(req.url, {
    method: 'POST',
    headers: req.headers,
    body: JSON.stringify(req.body),
  });

  const data = await response.json();
  const duration = Date.now() - startTime;

  if (!response.ok) {
    throw new Error(provider.parseError(data));
  }

  const result = provider.parseResponse(data);
  
  return {
    ...result,
    provider: providerId,
    duration,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET AVAILABLE MODELS
// ═══════════════════════════════════════════════════════════════════════════════

export function getAvailableModels(providerId = null) {
  if (providerId && PROVIDERS[providerId]) {
    return {
      [providerId]: {
        name: PROVIDERS[providerId].name,
        default: PROVIDERS[providerId].defaultModel,
        models: PROVIDERS[providerId].models,
      }
    };
  }

  const all = {};
  for (const [id, provider] of Object.entries(PROVIDERS)) {
    all[id] = {
      name: provider.name,
      default: provider.defaultModel,
      models: provider.models,
    };
  }
  return all;
}
