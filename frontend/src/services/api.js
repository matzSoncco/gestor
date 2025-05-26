import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api' || 'https://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

//exportamos la api
export default api;