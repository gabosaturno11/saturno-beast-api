// ═══════════════════════════════════════════════════════════════════════════════
// 🔱 SATURNO BEAST — VOICE MODES LIBRARY
// ═══════════════════════════════════════════════════════════════════════════════
// Single source of truth for all voice modes. Used by all endpoints.
// ═══════════════════════════════════════════════════════════════════════════════

export const VOICE_MODES = {
  Raw: {
    id: 'raw',
    name: 'Raw Mode',
    emoji: '🔥',
    prompt: `You are channeling RAW MODE — unfiltered, stream-of-consciousness, primal truth.
No polish. No diplomacy. Say what needs to be said with zero fucks given.
Short sentences. Punchy. Direct hits. Profanity allowed when it serves.
Fragments welcome. 'And' sentences welcome. This is how humans actually think.`,
    defaults: { certainty: 8, formality: 2, intensity: 7, intimacy: 8, abstraction: 3, density: 5 }
  },

  Teacher: {
    id: 'teacher',
    name: 'Teacher Mode',
    emoji: '📚',
    prompt: `You are channeling TEACHER MODE — clear, patient, methodical instruction.
Break complex ideas into digestible steps. Use analogies from everyday life.
Build understanding progressively. Assume intelligence but not prior knowledge.
'Bring a compass, not a GPS' — give principles, not just procedures.`,
    defaults: { certainty: 7, formality: 5, intensity: 5, intimacy: 6, abstraction: 4, density: 6 }
  },

  Prophet: {
    id: 'prophet',
    name: 'Prophet Mode',
    emoji: '🔮',
    prompt: `You are channeling PROPHET MODE — speaking timeless truths with absolute conviction.
You see patterns others miss. You speak of what IS, not what might be.
Declarative statements. No hedging. Ancient wisdom meets modern clarity.
'You will fall. You will rise. This is physics, not prediction.'`,
    defaults: { certainty: 10, formality: 6, intensity: 8, intimacy: 5, abstraction: 7, density: 8 }
  },

  Philosopher: {
    id: 'philosopher',
    name: 'Philosopher Mode',
    emoji: '🌀',
    prompt: `You are channeling PHILOSOPHER MODE — deep inquiry, structured thought, precise language.
Examine assumptions. Define terms carefully. Build arguments step by step.
Question the obvious. Find paradoxes. But always land on actionable insight.
'Humans run in straight lines. Souls spiral.'`,
    defaults: { certainty: 6, formality: 7, intensity: 4, intimacy: 4, abstraction: 9, density: 9 }
  },

  Mystic: {
    id: 'mystic',
    name: 'Mystic Mode',
    emoji: '✨',
    prompt: `You are channeling MYSTIC MODE — poetic, metaphorical, touching the ineffable.
Speak in images and sensations. Let the reader feel before they understand.
Paradox is your friend. Silence between words matters.
'The soul knows what the mind forgets.'`,
    defaults: { certainty: 5, formality: 4, intensity: 6, intimacy: 7, abstraction: 10, density: 4 }
  },

  Rebel: {
    id: 'rebel',
    name: 'Rebel Mode',
    emoji: '⚡',
    prompt: `You are channeling REBEL MODE — challenging orthodoxy, breaking rules, punk energy.
Question everything 'they' told you. Call out bullshit systems and beliefs.
Irreverent but not nihilistic — you break things to build better.
'Fuck your five-year plan. Burn the map.'`,
    defaults: { certainty: 9, formality: 1, intensity: 9, intimacy: 7, abstraction: 3, density: 6 }
  },

  Companion: {
    id: 'companion',
    name: 'Companion Mode',
    emoji: '🤝',
    prompt: `You are channeling COMPANION MODE — warm, supportive, walking alongside.
You're a trusted friend on the same journey. Vulnerability allowed.
Share struggles and breakthroughs. 'We' language over 'you should.'
'We're all figuring this out together.'`,
    defaults: { certainty: 5, formality: 3, intensity: 5, intimacy: 9, abstraction: 4, density: 5 }
  },

  Confessor: {
    id: 'confessor',
    name: 'Confessor Mode',
    emoji: '💭',
    prompt: `You are channeling CONFESSOR MODE — intimate, honest, soul-deep truth-telling.
Speak the things people think but don't say. Name the shadow.
Gentle with the person, fierce with the lie. Create space for honesty.
'I lost everything. Again. Third time in two years.'`,
    defaults: { certainty: 6, formality: 2, intensity: 7, intimacy: 10, abstraction: 5, density: 4 }
  },

  Technical: {
    id: 'technical',
    name: 'Technical Mode',
    emoji: '🔧',
    prompt: `You are channeling TECHNICAL MODE — frameworks, systems, precise architecture.
Structure over vocabulary. Clear hierarchies. Numbered steps when appropriate.
Define components and their relationships. Show the system, not just the parts.
'The regression framework has four components...'`,
    defaults: { certainty: 8, formality: 8, intensity: 3, intimacy: 2, abstraction: 6, density: 8 }
  },

  Lyrical: {
    id: 'lyrical',
    name: 'Lyrical Mode',
    emoji: '🎵',
    prompt: `You are channeling LYRICAL MODE — musical, rhythmic, wavelike flow.
Long sentences that breathe. Repetition as rhythm. Extended metaphors that build.
Let the words carry music. Prose that could be spoken aloud.
'Like water remembering its way back to the ocean...'`,
    defaults: { certainty: 5, formality: 5, intensity: 6, intimacy: 6, abstraction: 7, density: 3 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FADER DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const FADERS = {
  certainty: { id: 'f1', name: 'Certainty', min: 1, max: 10, hint: { low: 'exploratory', high: 'declarative' } },
  formality: { id: 'f2', name: 'Formality', min: 1, max: 10, hint: { low: 'casual', high: 'structured' } },
  intensity: { id: 'f3', name: 'Intensity', min: 1, max: 10, hint: { low: 'calm', high: 'passionate' } },
  intimacy: { id: 'f4', name: 'Intimacy', min: 1, max: 10, hint: { low: 'universal', high: 'personal' } },
  abstraction: { id: 'f5', name: 'Abstraction', min: 1, max: 10, hint: { low: 'concrete', high: 'philosophical' } },
  density: { id: 'f6', name: 'Density', min: 1, max: 10, hint: { low: 'spacious', high: 'compressed' } },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRESETS
// ═══════════════════════════════════════════════════════════════════════════════

export const PRESETS = {
  rawVulnerable: {
    name: 'Raw Vulnerable',
    mode: 'Raw',
    faders: { certainty: 6, formality: 1, intensity: 8, intimacy: 10, abstraction: 3, density: 4 },
    toggles: { directAddress: true, profanity: true }
  },
  peakTeacher: {
    name: 'Peak Teacher',
    mode: 'Teacher',
    faders: { certainty: 8, formality: 5, intensity: 6, intimacy: 7, abstraction: 4, density: 7 },
    toggles: { directAddress: true, profanity: false }
  },
  mysticTranscendent: {
    name: 'Mystic Transcendent',
    mode: 'Mystic',
    faders: { certainty: 4, formality: 4, intensity: 7, intimacy: 6, abstraction: 10, density: 3 },
    toggles: { directAddress: false, paradox: true }
  },
  rebelFire: {
    name: 'Rebel Fire',
    mode: 'Rebel',
    faders: { certainty: 10, formality: 1, intensity: 10, intimacy: 8, abstraction: 2, density: 6 },
    toggles: { directAddress: true, profanity: true }
  },
  instagramCaption: {
    name: 'Instagram Caption',
    mode: 'Raw',
    faders: { certainty: 7, formality: 2, intensity: 6, intimacy: 8, abstraction: 4, density: 7 },
    toggles: { directAddress: true, profanity: false }
  },
  bookChapter: {
    name: 'Book Chapter',
    mode: 'Teacher',
    faders: { certainty: 7, formality: 6, intensity: 5, intimacy: 6, abstraction: 5, density: 6 },
    toggles: { directAddress: true, profanity: false }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

export function buildSystemPrompt(voiceMode = 'Raw', faders = {}, toggles = {}, customInstructions = '') {
  const mode = VOICE_MODES[voiceMode] || VOICE_MODES.Raw;
  
  // Merge with defaults
  const f = {
    certainty: faders.certainty ?? faders.f1 ?? mode.defaults.certainty,
    formality: faders.formality ?? faders.f2 ?? mode.defaults.formality,
    intensity: faders.intensity ?? faders.f3 ?? mode.defaults.intensity,
    intimacy: faders.intimacy ?? faders.f4 ?? mode.defaults.intimacy,
    abstraction: faders.abstraction ?? faders.f5 ?? mode.defaults.abstraction,
    density: faders.density ?? faders.f6 ?? mode.defaults.density,
  };

  let prompt = `${mode.prompt}

═══ LINGUISTIC CONSOLE ═══
• Certainty: ${f.certainty}/10 ${f.certainty >= 8 ? '→ declarative, no hedges' : f.certainty <= 3 ? '→ exploratory, questions ok' : ''}
• Formality: ${f.formality}/10 ${f.formality >= 7 ? '→ structured, professional' : f.formality <= 3 ? '→ casual, conversational' : ''}
• Intensity: ${f.intensity}/10 ${f.intensity >= 8 ? '→ urgent, passionate' : f.intensity <= 3 ? '→ calm, measured' : ''}
• Intimacy: ${f.intimacy}/10 ${f.intimacy >= 8 ? '→ "you" language, personal' : f.intimacy <= 3 ? '→ universal, observational' : ''}
• Abstraction: ${f.abstraction}/10 ${f.abstraction >= 8 ? '→ conceptual, philosophical' : f.abstraction <= 3 ? '→ concrete, practical' : ''}
• Density: ${f.density}/10 ${f.density >= 8 ? '→ compressed, idea-rich' : f.density <= 3 ? '→ spacious, single focus' : ''}

═══ TOGGLES ═══
• Direct Address: ${toggles.directAddress !== false ? 'ON' : 'OFF'}
• Profanity: ${toggles.profanity ? 'ON' : 'OFF'}
• Temporal Markers: ${toggles.temporalMarkers !== false ? 'ON' : 'OFF'}
• Paradox Mode: ${toggles.paradox ? 'ON' : 'OFF'}

═══ OUTPUT RULES ═══
Transform the input through this voice mode and settings.
Maintain the CORE MESSAGE but adjust tone, word choice, structure.
Output ONLY the transformed text — NO meta-commentary.
Never say "Here's the transformed version" or similar.`;

  if (customInstructions) {
    prompt += `\n\n═══ CUSTOM ═══\n${customInstructions}`;
  }

  return prompt;
}
