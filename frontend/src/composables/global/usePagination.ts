import { ref, computed, watch } from 'vue'

interface PaginationOptions {
  page?: number
  pageSize?: number
  fetcher: (params: Record<string, any>) => Promise<any>
  immediate?: boolean
}

export function usePagination<T>({ fetcher, page = 1, pageSize = 6, immediate = true }: PaginationOptions) {
  const items = ref<T[]>([])
  const total = ref(0)
  const loading = ref(false)
  const currentPage = ref(page)
  const pageSizeRef = ref(pageSize)

  const totalPages = computed(() =>
    Math.ceil(total.value / pageSizeRef.value)
  )

  async function load(params: Record<string, any> = {}) {
    loading.value = true
    try {
      const response = await fetcher({
        page: currentPage.value,
        page_size: pageSizeRef.value,
        ...params
      })

      items.value = response.data.results
      total.value = response.data.count
    } finally {
      loading.value = false
    }
  }

  // Cargar al iniciar si se requiere
  if (immediate) {
    load()
  }

  // Si cambia de página, recargar
  watch(currentPage, () => {
    load()
  })

  return {
    items,
    total,
    currentPage,
    pageSize: pageSizeRef,
    totalPages,
    loading,
    load,
    setPage: (p: number) => currentPage.value = p
  }
}