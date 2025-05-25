import api from './api';

const resource = 'combustibles';

export const crearCombustible = (payload) => api.post(`/${resource}/`, payload);
export const listarCombustibles = () => api.get(`/${resource}/`);