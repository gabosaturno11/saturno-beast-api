// ═══════════════════════════════════════════════════════════════════════════════
// 🔱 SATURNO BEAST API — /api/synthesize
// ═══════════════════════════════════════════════════════════════════════════════
// Single content synthesis with voice modes and faders.
// Multi-provider: Claude, OpenAI, Gemini.
// BYOK (Bring Your Own Key) architecture.
// ═══════════════════════════════════════════════════════════════════════════════

import { VOICE_MODES, buildSystemPrompt, PRESETS } from '../lib/voice-modes.js';
import { detectProvider, callProvider, PROVIDERS } from '../lib/providers.js';

export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1', 'cdg1'], // US East, US West, Europe
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, x-provider, x-model',
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed', allowed: ['POST'] }, 405);
  }

  const requestId = crypto.randomUUID().slice(0, 8);
  const startTime = Date.now();

  try {
    // ═══ AUTH ═══
    const apiKey = req.headers.get('x-api-key');
    const providerHint = req.headers.get('x-provider')?.toLowerCase();
    
    const providerId = detectProvider(apiKey, providerHint);
    
    if (!providerId) {
      return json({
        error: 'Invalid or missing API key',
        hint: 'Provide your API key via x-api-key header',
        supported: Object.entries(PROVIDERS).map(([id, p]) => `${p.name} (${p.keyPrefix}...)`),
      }, 401);
    }

    // ═══ PARSE REQUEST ═══
    const body = await req.json();
    const {
      input,
      voiceMode = 'Raw',
      faders = {},
      toggles = {},
      model,
      maxTokens,
      preset,
      customPrompt,
      customInstructions,
    } = body;

    // Validate input
    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return json({ error: 'Missing or empty input text' }, 400);
    }

    // ═══ RESOLVE PRESET ═══
    let resolvedMode = voiceMode;
    let resolvedFaders = faders;
    let resolvedToggles = toggles;

    if (preset && PRESETS[preset]) {
      const p = PRESETS[preset];
      resolvedMode = p.mode;
      resolvedFaders = { ...p.faders, ...faders }; // User faders override preset
      resolvedToggles = { ...p.toggles, ...toggles };
    }

    // ═══ BUILD SYSTEM PROMPT ═══
    const systemPrompt = customPrompt || buildSystemPrompt(
      resolvedMode,
      resolvedFaders,
      resolvedToggles,
      customInstructions
    );

    // ═══ GET MODEL ═══
    const selectedModel = model || req.headers.get('x-model') || PROVIDERS[providerId].defaultModel;

    // ═══ CALL AI ═══
    const result = await callProvider(
      providerId,
      apiKey,
      selectedModel,
      systemPrompt,
      input,
      maxTokens || 4096
    );

    const totalDuration = Date.now() - startTime;

    // ═══ RETURN SUCCESS ═══
    return json({
      success: true,
      output: result.text,
      meta: {
        requestId,
        provider: providerId,
        model: result.model || selectedModel,
        voiceMode: resolvedMode,
        preset: preset || null,
        duration: {
          total: `${totalDuration}ms`,
          ai: `${result.duration}ms`,
        },
        usage: result.usage,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    
    return json({
      success: false,
      error: error.message || 'Synthesis failed',
      meta: {
        requestId,
        duration: `${totalDuration}ms`,
        timestamp: new Date().toISOString(),
      },
    }, error.message?.includes('API') ? 502 : 500);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER
// ═══════════════════════════════════════════════════════════════════════════════

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
