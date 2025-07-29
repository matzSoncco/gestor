export const parseApiError = (err: any, fallback = 'Ocurrió un error'): string => {
  if (!err) return fallback

  if (typeof err === 'string') {
    return err
  }

  if (err?.detail) {
    return err.detail
  }

  if (err?.message && !err?.response) {
    return err.message // ej: Error de red o del cliente
  }

  if (typeof err === 'object') {
    const keys = Object.keys(err)
    if (keys.length > 0) {
      const firstKey = keys[0]
      const firstError = Array.isArray(err[firstKey]) ? err[firstKey][0] : err[firstKey]
      return firstError
    }
  }

  return fallback
}