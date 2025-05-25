import api from './api';

const resource = 'servicios';

export const crearServicio = (payload) => api.post(`/${resource}/`, payload);
export const listarServicios = () => api.get(`/${resource}/`);