const { GoogleGenAI } = require('@google/genai')

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Small/fast models on each provider, and JSON-only responses, to keep
// token usage minimal - no chain-of-thought or markdown padding.
const PROVIDERS = {
  gemini: {
    enabled: () => !!process.env.GEMINI_API_KEY,
    call: async (prompt) => {
      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      })
      return response.text
    }
  },
  groq: {
    enabled: () => !!process.env.GROQ_API_KEY,
    call: (prompt) => callOpenAICompatible(
      'https://api.groq.com/openai/v1/chat/completions',
      process.env.GROQ_API_KEY,
      'openai/gpt-oss-20b',
      prompt
    )
  },
  mistral: {
    enabled: () => !!process.env.MISTRAL_API_KEY,
    call: (prompt) => callOpenAICompatible(
      'https://api.mistral.ai/v1/chat/completions',
      process.env.MISTRAL_API_KEY,
      'mistral-small-latest',
      prompt
    )
  }
}

async function callOpenAICompatible(url, apiKey, model, prompt) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    })
  })

  if (!res.ok) {
    const err = new Error(`${model} request failed: ${res.status} ${await res.text()}`)
    err.status = res.status
    throw err
  }

  const data = await res.json()
  return data.choices[0].message.content
}

// AI_PROVIDER can pin a provider to try first (still falls back to the
// rest); "auto" or unset uses the default order.
function resolveOrder() {
  const all = Object.keys(PROVIDERS)
  const pinned = (process.env.AI_PROVIDER || 'auto').toLowerCase()
  if (!all.includes(pinned)) return all
  return [pinned, ...all.filter((p) => p !== pinned)]
}

// Tries each configured provider in order, falling back to the next one
// on any failure (rate limit, quota, outage) so a single exhausted
// provider doesn't take the feature down.
async function generateJSON(prompt) {
  let lastError
  for (const name of resolveOrder()) {
    const provider = PROVIDERS[name]
    if (!provider.enabled()) continue
    try {
      return await provider.call(prompt)
    } catch (err) {
      lastError = err
      console.error(`AI provider "${name}" failed, trying next:`, err.message)
    }
  }
  throw lastError || new Error('No AI provider is configured')
}

// Strips markdown code fences some providers add even when asked not to.
function cleanJsonText(rawText) {
  return rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```$/, '')
    .trim()
}

module.exports = { generateJSON, cleanJsonText }
