import { defineConfig, loadEnv } from 'vite'
import sitemap from 'vite-plugin-sitemap'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const STATIC_PUBLIC_ROUTES = ['/about', '/properties', '/events', '/blog', '/contact', '/privacy-policy']
const GOOGLE_SITE_VERIFICATION_PATH = '/google6c44fab17a62d8e5'

const decodeFirestoreValue = (value = {}) => {
  if (Object.prototype.hasOwnProperty.call(value, 'stringValue')) return String(value.stringValue || '')
  if (Object.prototype.hasOwnProperty.call(value, 'integerValue')) return String(value.integerValue || '')
  if (Object.prototype.hasOwnProperty.call(value, 'doubleValue')) return String(value.doubleValue || '')
  if (Object.prototype.hasOwnProperty.call(value, 'timestampValue')) return String(value.timestampValue || '')
  return ''
}

const getDocumentIdFromName = (name = '') => {
  const parts = String(name).split('/')
  return parts[parts.length - 1] || ''
}

const fetchFirestoreCollection = async ({ apiKey, projectId, collectionId }) => {
  const docs = []
  let pageToken = ''

  while (true) {
    const params = new URLSearchParams({
      key: apiKey,
      pageSize: '300',
    })
    if (pageToken) params.set('pageToken', pageToken)

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionId}?${params.toString()}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch ${collectionId}: ${response.status} ${response.statusText}`)
    }

    const payload = await response.json()
    docs.push(...(payload.documents || []))

    if (!payload.nextPageToken) break
    pageToken = payload.nextPageToken
  }

  return docs
}

const queryPublishedBlogPosts = async ({ apiKey, projectId }) => {
  const params = new URLSearchParams({ key: apiKey })
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?${params.toString()}`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'blog_posts' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'status' },
            op: 'EQUAL',
            value: { stringValue: 'published' },
          },
        },
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to query published blog posts: ${response.status} ${response.statusText}`)
  }

  const payload = await response.json()
  return payload
    .map((entry) => entry.document)
    .filter(Boolean)
}

const getDynamicRoutesFromFirestore = async ({ mode, rootDir }) => {
  const env = loadEnv(mode, rootDir, '')
  const apiKey = env.VITE_FIREBASE_API_KEY
  const projectId = env.VITE_FIREBASE_PROJECT_ID

  if (!apiKey || !projectId) {
    console.warn('[sitemap] Missing Firebase env vars, generating sitemap without listing/blog detail routes.')
    return []
  }

  try {
    const [projectsDocs, blogDocs] = await Promise.all([
      fetchFirestoreCollection({ apiKey, projectId, collectionId: 'projects' }),
      queryPublishedBlogPosts({ apiKey, projectId }),
    ])

    const projectRoutes = projectsDocs
      .map((doc) => {
        const id = decodeFirestoreValue(doc?.fields?.id) || getDocumentIdFromName(doc?.name)
        return id ? `/property/${encodeURIComponent(id)}` : ''
      })
      .filter(Boolean)

    const nowMs = Date.now()
    const blogRoutes = blogDocs
      .filter((doc) => {
        const publishedAt = decodeFirestoreValue(doc?.fields?.publishedAt)
        if (!publishedAt) return true
        const publishedAtMs = Date.parse(publishedAt)
        if (Number.isNaN(publishedAtMs)) return true
        return publishedAtMs <= nowMs
      })
      .map((doc) => {
        const slug = decodeFirestoreValue(doc?.fields?.slug)
        return slug ? `/blog/${encodeURIComponent(slug)}` : ''
      })
      .filter(Boolean)

    return [...new Set([...projectRoutes, ...blogRoutes])]
  } catch (error) {
    console.warn('[sitemap] Unable to fetch Firestore routes, generating sitemap with static routes only.', error)
    return []
  }
}

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const firestoreDynamicRoutes = await getDynamicRoutesFromFirestore({
    mode,
    rootDir: process.cwd(),
  })
  const dynamicRoutes = [...new Set([...STATIC_PUBLIC_ROUTES, ...firestoreDynamicRoutes])]

  return {
    plugins: [tailwindcss(), react(), sitemap({
      hostname: 'https://citify-contractors.com',
      dynamicRoutes,
      exclude: [GOOGLE_SITE_VERIFICATION_PATH],
    })],
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) return 'firebase'
              if (id.includes('react-router')) return 'router'
              if (id.includes('framer-motion')) return 'motion'
              if (id.includes('react-icons') || id.includes('lucide-react')) return 'icons'
              if (id.includes('react') || id.includes('scheduler')) return 'react-vendor'
            }
          },
        },
      },
    },
  }
})
