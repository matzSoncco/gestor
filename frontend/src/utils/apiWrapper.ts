export const handleApiError = (error: any, fallbackMessage = 'Error inesperado'): never => {
  const responseData = error?.response?.data
  if (responseData) {
    throw responseData
  }
  throw new Error(fallbackMessage)
}