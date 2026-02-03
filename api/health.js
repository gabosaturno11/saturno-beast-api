// ═══════════════════════════════════════════════════════════════════════════════
// 🔱 SATURNO BEAST API — /api/health
// ═══════════════════════════════════════════════════════════════════════════════

import { VOICE_MODES, PRESETS } from '../lib/voice-modes.js';
import { PROVIDERS, getAvailableModels } from '../lib/providers.js';

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

  return new Response(JSON.stringify({
    status: 'operational',
    name: 'SATURNO BEAST API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      '/api/synthesize': 'Single content synthesis with voice modes',
      '/api/batch': 'Process multiple items (max 10)',
      '/api/transform': 'Same input through multiple voice modes',
      '/api/health': 'This endpoint',
      '/api/modes': 'List all voice modes and presets',
    },
    voiceModes: Object.keys(VOICE_MODES),
    presets: Object.keys(PRESETS),
    providers: Object.keys(PROVIDERS),
    docs: 'https://github.com/gabosaturno11/saturno-beast-api',
  }, null, 2), {
    status: 200,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
