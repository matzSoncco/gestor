import api from './api';

const resource = 'mantenimientos';

export const crearMantenimiento = (payload) => api.post(`/${resource}/`, payload);
export const listarMantenimientos = () => api.get(`/${resource}/`);