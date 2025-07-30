export const extractErrorMessage = (error: any, fallback = 'Ocurrió un error'): string => {
  console.error('Error completo:', error);
  
  if (!error) return fallback;

  if (typeof error === 'string') {
    return error;
  }

  // Errores de respuesta de la API (axios)
  const responseData = error?.response?.data;
  if (responseData) {
    console.error('Response data:', responseData);
    
    // Si tiene detail (común en DRF)
    if (responseData.detail) {
      return responseData.detail;
    }
    
    if (typeof responseData === 'object') {
      const keys = Object.keys(responseData);
      if (keys.length > 0) {
        const firstKey = keys[0];
        const firstError = Array.isArray(responseData[firstKey]) 
          ? responseData[firstKey][0] 
          : responseData[firstKey];
        
        return firstKey === 'non_field_errors' 
          ? firstError 
          : `${firstKey}: ${firstError}`;
      }
    }
    
    if (typeof responseData === 'string') {
      return responseData;
    }
  }

  // errores de red
  if (error?.message && !error?.response) {
    return error.message;
  }

  // Si es un objeto sin response (como el que lanzas en handleApiError)
  if (typeof error === 'object' && !error?.response) {
    const keys = Object.keys(error);
    if (keys.length > 0) {
      const firstKey = keys[0];
      const firstError = Array.isArray(error[firstKey]) 
        ? error[firstKey][0] 
        : error[firstKey];
      return firstError;
    }
  }

  return fallback;
};

export const handleApiError = (error: any, fallbackMessage = 'Error inesperado'): never => {
  const errorMessage = extractErrorMessage(error, fallbackMessage);

  const responseData = error?.response?.data;
  if (responseData) {
    throw responseData;
  }
  
  throw new Error(errorMessage);
};

export const getApiErrorMessage = (error: any, fallback = 'Ocurrió un error'): string => {
  return extractErrorMessage(error, fallback);
};