import { useNotification, NotificationType } from 'naive-ui'

/* Config global (modifícalo si necesitas) */
const BASE_OPTIONS = {
  duration: 3000,       // ms (0 = permanece hasta cerrar)
  placement: 'top-right' as const,
  closable: true,
  showIcon: true
}

type NotifyFn = (content: string, title?: string) => void

export function useNotify() {
  const notify = useNotification()

  /* ---- Factory interna para cada tipo ---- */
  const create = (type: NotificationType): NotifyFn => {
    return (content: string, title?: string) => {
      notify[type]({
        ...BASE_OPTIONS,
        content,
        title: title || DEFAULT_TITLE[type]
      })
    }
  }

  /* ---- Títulos por defecto ---- */
  const DEFAULT_TITLE: Record<NotificationType, string> = {
    success: 'Éxito',
    info:    'Información',
    warning: 'Advertencia',
    error:   'Error'
  }

  /* ---- Métodos públicos ---- */
  const success  = create('success')
  const info     = create('info')
  const warning  = create('warning')
  const error    = create('error')

  /* También exponer el objeto notify original por si necesitas algo especial */
  return { success, info, warning, error, notify }
}