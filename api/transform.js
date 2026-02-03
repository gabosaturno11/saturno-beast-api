// ═══════════════════════════════════════════════════════════════════════════════
// 🔱 SATURNO BEAST API — /api/transform
// ═══════════════════════════════════════════════════════════════════════════════
// Multi-mode transformation: Same input through multiple voice modes.
// Perfect for A/B testing, style exploration, caption variants.
// ═══════════════════════════════════════════════════════════════════════════════

import { VOICE_MODES, buildSystemPrompt, PRESETS } from '../lib/voice-modes.js';
import { detectProvider, callProvider, PROVIDERS } from '../lib/providers.js';

export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1', 'cdg1'],
  maxDuration: 60,
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, x-provider, x-model',
};

const MAX_MODES = 5;

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const requestId = crypto.randomUUID().slice(0, 8);
  const startTime = Date.now();

  try {
    // ═══ AUTH ═══
    const apiKey = req.headers.get('x-api-key');
    const providerId = detectProvider(apiKey, req.headers.get('x-provider'));
    
    if (!providerId) {
      return json({ error: 'Invalid or missing API key' }, 401);
    }

    // ═══ PARSE REQUEST ═══
    const body = await req.json();
    const {
      input,
      modes = ['Raw', 'Teacher', 'Prophet'], // Default: 3 key modes
      faders = {},
      toggles = {},
      model,
    } = body;

    // Validate input
    if (!input || input.trim().length === 0) {
      return json({ error: 'Missing or empty input text' }, 400);
    }

    // Validate modes
    const validModes = modes.filter(m => VOICE_MODES[m]);
    if (validModes.length === 0) {
      return json({
        error: 'No valid voice modes specified',
        available: Object.keys(VOICE_MODES),
      }, 400);
    }

    if (validModes.length > MAX_MODES) {
      return json({
        error: `Too many modes. Max ${MAX_MODES} per request.`,
        received: validModes.length,
      }, 400);
    }

    const selectedModel = model || req.headers.get('x-model') || PROVIDERS[providerId].defaultModel;

    // ═══ TRANSFORM THROUGH EACH MODE ═══
    const results = [];
    let totalUsage = { input: 0, output: 0 };

    for (const mode of validModes) {
      const systemPrompt = buildSystemPrompt(mode, faders, toggles);
      
      try {
        const result = await callProvider(providerId, apiKey, selectedModel, systemPrompt, input);
        
        results.push({
          mode,
          modeEmoji: VOICE_MODES[mode].emoji,
          modeName: VOICE_MODES[mode].name,
          success: true,
          output: result.text,
          duration: result.duration,
        });

        if (result.usage) {
          totalUsage.input += result.usage.input || 0;
          totalUsage.output += result.usage.output || 0;
        }
      } catch (error) {
        results.push({
          mode,
          modeEmoji: VOICE_MODES[mode].emoji,
          modeName: VOICE_MODES[mode].name,
          success: false,
          error: error.message,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalDuration = Date.now() - startTime;

    // ═══ RETURN RESULTS ═══
    return json({
      success: successCount > 0,
      input,
      transformations: results,
      summary: {
        total: validModes.length,
        successful: successCount,
        failed: validModes.length - successCount,
      },
      meta: {
        requestId,
        provider: providerId,
        model: selectedModel,
        duration: `${totalDuration}ms`,
        usage: totalUsage,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    return json({
      success: false,
      error: error.message || 'Transform failed',
      meta: {
        requestId,
        duration: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString(),
      },
    }, 500);
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
