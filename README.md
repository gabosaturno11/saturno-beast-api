# 🔱 SATURNO BEAST API

**Multi-provider voice synthesis with the Linguistic Console.**

Transform any text through 10 voice modes with 6 faders and 4 toggles. 
Works with Claude, OpenAI, and Gemini. BYOK (Bring Your Own Key).

## 🚀 Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/synthesize` | POST | Single content synthesis |
| `/api/batch` | POST | Process up to 10 items |
| `/api/transform` | POST | Same input through multiple modes |
| `/api/modes` | GET | List all modes, faders, presets |
| `/api/health` | GET | API status and info |

## 🔥 Quick Start

### Single Synthesis
```javascript
const response = await fetch('https://YOUR-URL.vercel.app/api/synthesize', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'sk-ant-YOUR-CLAUDE-KEY', // or OpenAI/Gemini key
  },
  body: JSON.stringify({
    input: 'Movement is medicine. Your body already knows this.',
    voiceMode: 'Raw',
    faders: {
      certainty: 8,
      formality: 2,
      intensity: 7,
      intimacy: 8,
      abstraction: 3,
      density: 5
    },
    toggles: {
      directAddress: true,
      profanity: true
    }
  })
});

const data = await response.json();
console.log(data.output);
```

### Multi-Mode Transform
```javascript
const response = await fetch('https://YOUR-URL.vercel.app/api/transform', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'sk-ant-YOUR-KEY',
  },
  body: JSON.stringify({
    input: 'Progress is not linear. It spirals.',
    modes: ['Raw', 'Teacher', 'Prophet', 'Mystic']
  })
});

const data = await response.json();
// Returns same text transformed through all 4 modes
```

### Batch Processing
```javascript
const response = await fetch('https://YOUR-URL.vercel.app/api/batch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'sk-ant-YOUR-KEY',
  },
  body: JSON.stringify({
    items: [
      { title: 'Caption 1', input: 'Movement is medicine.' },
      { title: 'Caption 2', input: 'Trust the process.' },
      { title: 'Caption 3', input: 'Your body knows.' }
    ],
    voiceMode: 'Raw',
    preset: 'instagramCaption'
  })
});
```

## 🎛️ Voice Modes

| Mode | Emoji | Description |
|------|-------|-------------|
| Raw | 🔥 | Unfiltered, stream-of-consciousness |
| Teacher | 📚 | Clear, patient instruction |
| Prophet | 🔮 | Timeless truths, absolute conviction |
| Philosopher | 🌀 | Deep inquiry, structured thought |
| Mystic | ✨ | Poetic, metaphorical |
| Rebel | ⚡ | Challenging orthodoxy, punk energy |
| Companion | 🤝 | Warm, supportive, "we" language |
| Confessor | 💭 | Intimate, soul-deep truth |
| Technical | 🔧 | Frameworks, systems, precision |
| Lyrical | 🎵 | Musical, rhythmic flow |

## 🎚️ Faders (1-10)

- **Certainty**: Declarative ↔ Exploratory
- **Formality**: Casual ↔ Structured
- **Intensity**: Calm ↔ Passionate
- **Intimacy**: Universal ↔ Personal
- **Abstraction**: Concrete ↔ Philosophical
- **Density**: Spacious ↔ Compressed

## 🔘 Toggles

- **directAddress**: Use "you" language
- **profanity**: Allow swearing
- **temporalMarkers**: Include dates/context
- **paradox**: Embrace contradiction

## 🎯 Presets

- `rawVulnerable` - Raw + high intimacy
- `peakTeacher` - Teacher at its best
- `mysticTranscendent` - Full cosmic mode
- `rebelFire` - Maximum punk energy
- `instagramCaption` - Optimized for IG
- `bookChapter` - Long-form ready

## 🔑 Provider Detection

The API auto-detects your provider from the key:
- `sk-ant-...` → Claude (Anthropic)
- `sk-...` → OpenAI
- `AIza...` → Gemini (Google)

Or set explicitly with `x-provider` header.

## 🚀 Deploy Your Own

```bash
npx vercel --prod
```

---

**Built for the Saturno Forge ecosystem.**
