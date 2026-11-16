import api from './api';

export const obtenerRecetas = () => api.get('recetas/');
export const crearReceta = (datos) => api.post('recetas/', datos);
export const actualizarReceta = (id, datos) => api.put(`recetas/${id}/`, datos);
export const eliminarReceta = (id) => api.delete(`recetas/${id}/`);
