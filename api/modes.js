// ═══════════════════════════════════════════════════════════════════════════════
// 🔱 SATURNO BEAST API — /api/modes
// ═══════════════════════════════════════════════════════════════════════════════
// Returns all available voice modes, faders, toggles, and presets.
// Use this to populate your UI dropdowns.
// ═══════════════════════════════════════════════════════════════════════════════

import { VOICE_MODES, FADERS, PRESETS } from '../lib/voice-modes.js';
import { getAvailableModels } from '../lib/providers.js';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  // Build voice modes for response (exclude full prompts for security)
  const modes = {};
  for (const [key, mode] of Object.entries(VOICE_MODES)) {
    modes[key] = {
      id: mode.id,
      name: mode.name,
      emoji: mode.emoji,
      defaults: mode.defaults,
    };
  }

  return new Response(JSON.stringify({
    voiceModes: modes,
    faders: FADERS,
    toggles: {
      directAddress: { id: 't1', name: 'Direct Address', description: 'Use "you" language' },
      profanity: { id: 't2', name: 'Profanity Allowed', description: 'Swearing when it serves' },
      temporalMarkers: { id: 't3', name: 'Temporal Markers', description: 'Include dates/context' },
      paradox: { id: 't4', name: 'Paradox Mode', description: 'Embrace contradiction' },
    },
    presets: PRESETS,
    providers: getAvailableModels(),
  }, null, 2), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
