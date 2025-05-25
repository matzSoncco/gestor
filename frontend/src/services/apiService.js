import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

//funciones genericas para cada recurso del be
export const getAll = async (resource) =>  apiClient.get(`/${resource}/`); //GET
export const getOne = async (resource, id) => apiClient.get(`/${resource}/${id}/`); //GET
export const create = async (resource, data) => apiClient.post(`/${resource}/`, data); //POST
export const update = async (resource, id, data) => apiClient.put(`/${resource}/${id}/`, data); //PUT
export const partialUpdate = async (resource, id, data) => apiClient.patch(`/${resource}/${id}/`, data); //PATCH
export const remove = async (resource, id) => apiClient.delete(`/${resource}/${id}/`); //DELETE

