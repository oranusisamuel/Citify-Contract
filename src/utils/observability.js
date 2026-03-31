const getConfig = () => ({
  endpoint: String(import.meta.env.VITE_OBSERVABILITY_ENDPOINT || '').trim(),
  release: String(import.meta.env.VITE_APP_VERSION || import.meta.env.MODE || 'unknown'),
  enabled: true,
})

const sendPayload = (payload) => {
  const config = getConfig()
  if (!config.enabled) return

  const body = JSON.stringify({
    release: config.release,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    ...payload,
  })

  if (import.meta.env.DEV) {
    console.debug('[Observability]', payload)
  }

  if (!config.endpoint || typeof window === 'undefined') {
    return
  }

  try {
    if (navigator?.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon(config.endpoint, blob)
      return
    }

    fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {
      // Avoid user-facing impact when telemetry endpoint is unavailable.
    })
  } catch {
    // Swallow telemetry errors to keep UX stable.
  }
}

export const trackOperationalEvent = (event, meta = {}) => {
  sendPayload({ type: 'event', event, meta })
}

export const trackRouteView = (pathname) => {
  sendPayload({ type: 'route_view', pathname })
}

let initialized = false

export const initObservability = async () => {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  window.addEventListener('error', (event) => {
    trackOperationalEvent('window_error', {
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    trackOperationalEvent('unhandled_rejection', {
      reason: String(event.reason || 'Unknown rejection'),
    })
  })

  try {
    const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals')
    const reportMetric = (metric) => {
      sendPayload({
        type: 'web_vital',
        name: metric.name,
        value: Number(metric.value?.toFixed?.(2) ?? metric.value),
        rating: metric.rating,
        id: metric.id,
      })
    }

    onCLS(reportMetric)
    onINP(reportMetric)
    onLCP(reportMetric)
    onFCP(reportMetric)
    onTTFB(reportMetric)
  } catch {
    trackOperationalEvent('web_vitals_init_failed')
  }
}