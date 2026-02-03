// ═══════════════════════════════════════════════════════════════════════════════
// 🔱 SATURNO BEAST API — /api/batch
// ═══════════════════════════════════════════════════════════════════════════════
// Process multiple items in sequence. Perfect for batch-generator.html
// Max 10 items per request to prevent timeout.
// ═══════════════════════════════════════════════════════════════════════════════

import { buildSystemPrompt, PRESETS } from '../lib/voice-modes.js';
import { detectProvider, callProvider, PROVIDERS } from '../lib/providers.js';

export const config = {
  runtime: 'edge',
  regions: ['iad1', 'sfo1', 'cdg1'],
  maxDuration: 60, // 60 second timeout for batch
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-api-key, x-provider, x-model',
};

const MAX_BATCH_SIZE = 10;

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
    const providerHint = req.headers.get('x-provider')?.toLowerCase();
    const providerId = detectProvider(apiKey, providerHint);
    
    if (!providerId) {
      return json({
        error: 'Invalid or missing API key',
        supported: Object.keys(PROVIDERS),
      }, 401);
    }

    // ═══ PARSE REQUEST ═══
    const body = await req.json();
    const {
      items,
      voiceMode = 'Raw',
      faders = {},
      toggles = {},
      model,
      preset,
      customPrompt,
      parallelism = 'sequential', // 'sequential' or 'parallel'
    } = body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return json({ error: 'Missing or empty items array' }, 400);
    }

    if (items.length > MAX_BATCH_SIZE) {
      return json({
        error: `Batch too large. Max ${MAX_BATCH_SIZE} items per request.`,
        received: items.length,
        hint: 'Split into multiple requests for larger batches.',
      }, 400);
    }

    // ═══ RESOLVE PRESET ═══
    let resolvedMode = voiceMode;
    let resolvedFaders = faders;
    let resolvedToggles = toggles;

    if (preset && PRESETS[preset]) {
      const p = PRESETS[preset];
      resolvedMode = p.mode;
      resolvedFaders = { ...p.faders, ...faders };
      resolvedToggles = { ...p.toggles, ...toggles };
    }

    // ═══ BUILD SYSTEM PROMPT ═══
    const systemPrompt = customPrompt || buildSystemPrompt(resolvedMode, resolvedFaders, resolvedToggles);
    const selectedModel = model || req.headers.get('x-model') || PROVIDERS[providerId].defaultModel;

    // ═══ PROCESS ITEMS ═══
    const results = [];
    let totalUsage = { input: 0, output: 0 };

    if (parallelism === 'parallel') {
      // Process in parallel (faster but may hit rate limits)
      const promises = items.map((item, index) => 
        processItem(item, index, providerId, apiKey, selectedModel, systemPrompt)
      );
      const responses = await Promise.allSettled(promises);
      
      for (const [index, response] of responses.entries()) {
        if (response.status === 'fulfilled') {
          results.push(response.value);
          if (response.value.usage) {
            totalUsage.input += response.value.usage.input || 0;
            totalUsage.output += response.value.usage.output || 0;
          }
        } else {
          results.push({
            index,
            success: false,
            input: items[index]?.input || items[index],
            error: response.reason?.message || 'Unknown error',
          });
        }
      }
    } else {
      // Process sequentially (safer, respects rate limits)
      for (let i = 0; i < items.length; i++) {
        const result = await processItem(items[i], i, providerId, apiKey, selectedModel, systemPrompt);
        results.push(result);
        if (result.usage) {
          totalUsage.input += result.usage.input || 0;
          totalUsage.output += result.usage.output || 0;
        }
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalDuration = Date.now() - startTime;

    // ═══ RETURN RESULTS ═══
    return json({
      success: true,
      summary: {
        total: items.length,
        successful: successCount,
        failed: items.length - successCount,
      },
      results,
      meta: {
        requestId,
        provider: providerId,
        model: selectedModel,
        voiceMode: resolvedMode,
        preset: preset || null,
        parallelism,
        duration: `${totalDuration}ms`,
        usage: totalUsage,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    return json({
      success: false,
      error: error.message || 'Batch processing failed',
      meta: {
        requestId,
        duration: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString(),
      },
    }, 500);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROCESS SINGLE ITEM
// ═══════════════════════════════════════════════════════════════════════════════

async function processItem(item, index, providerId, apiKey, model, systemPrompt) {
  const input = typeof item === 'string' ? item : item.input;
  const title = item.title || `Item ${index + 1}`;

  if (!input || input.trim().length === 0) {
    return {
      index,
      title,
      success: false,
      error: 'Empty input',
    };
  }

  try {
    const result = await callProvider(providerId, apiKey, model, systemPrompt, input);
    
    return {
      index,
      title,
      success: true,
      input,
      output: result.text,
      usage: result.usage,
      duration: result.duration,
    };
  } catch (error) {
    return {
      index,
      title,
      success: false,
      input,
      error: error.message,
    };
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
