const { onRequest } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore, FieldValue } = require('firebase-admin/firestore')

initializeApp()

const db = getFirestore()
const COLLECTION = 'observability_events'
const ALLOWED_TYPES = new Set(['route_view', 'web_vital', 'event'])

const clampStr = (value, max) => {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

const sanitizeMeta = (meta) => {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
    return null
  }
  const out = {}
  let n = 0
  for (const [rawKey, rawVal] of Object.entries(meta)) {
    if (n >= 24) break
    const key = clampStr(String(rawKey), 48)
    if (!key) continue
    if (typeof rawVal === 'string') {
      out[key] = clampStr(rawVal, 800)
    } else if (typeof rawVal === 'number' && Number.isFinite(rawVal)) {
      out[key] = rawVal
    } else if (typeof rawVal === 'boolean') {
      out[key] = rawVal
    }
    n += 1
  }
  return Object.keys(out).length ? out : null
}

const readJsonBody = (req) => {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body
  }
  const raw = req.rawBody
  if (raw && Buffer.isBuffer(raw)) {
    try {
      const text = raw.toString('utf8')
      if (!text) return null
      return JSON.parse(text)
    } catch {
      return null
    }
  }
  return null
}

const buildValidatedDoc = (body) => {
  if (!body || typeof body !== 'object') {
    return { ok: false, status: 400, error: 'invalid_body' }
  }

  const type = clampStr(body.type, 32)
  if (!ALLOWED_TYPES.has(type)) {
    return { ok: false, status: 400, error: 'invalid_type' }
  }

  const doc = {
    type,
    release: clampStr(body.release, 120) || null,
    clientTimestamp: clampStr(body.timestamp, 64) || null,
    pageUrl: clampStr(body.url, 2048) || null,
  }

  if (type === 'route_view') {
    const pathname = clampStr(body.pathname, 512)
    if (!pathname) {
      return { ok: false, status: 400, error: 'missing_pathname' }
    }
    doc.pathname = pathname
    return { ok: true, doc }
  }

  if (type === 'web_vital') {
    const name = clampStr(body.name, 32)
    if (!name) {
      return { ok: false, status: 400, error: 'missing_metric_name' }
    }
    const value = Number(body.value)
    if (!Number.isFinite(value) || value < 0 || value > 1e7) {
      return { ok: false, status: 400, error: 'invalid_metric_value' }
    }
    doc.metricName = name
    doc.metricValue = value
    doc.rating = clampStr(body.rating, 16) || null
    doc.metricId = clampStr(body.id, 64) || null
    return { ok: true, doc }
  }

  if (type === 'event') {
    const event = clampStr(body.event, 120)
    if (!event) {
      return { ok: false, status: 400, error: 'missing_event' }
    }
    doc.event = event
    doc.meta = sanitizeMeta(body.meta)
    return { ok: true, doc }
  }

  return { ok: false, status: 400, error: 'unsupported_type' }
}

exports.observabilityIngest = onRequest(
  {
    cors: true,
    invoker: 'public',
    maxInstances: 25,
    memory: '256MiB',
    timeoutSeconds: 30,
  },
  async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.status(204).send('')
      return
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'method_not_allowed' })
      return
    }

    const body = readJsonBody(req)
    const parsed = buildValidatedDoc(body)
    if (!parsed.ok) {
      res.status(parsed.status).json({ error: parsed.error })
      return
    }

    try {
      await db.collection(COLLECTION).add({
        ...parsed.doc,
        ingestedAt: FieldValue.serverTimestamp(),
      })
      res.status(204).send('')
    } catch (err) {
      console.error('[observabilityIngest]', err)
      res.status(500).json({ error: 'write_failed' })
    }
  }
)
