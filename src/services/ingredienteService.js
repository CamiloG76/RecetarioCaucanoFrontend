
import api from './api';

export const obtenerIngredientes = () => api.get('ingredientes/');

export const crearIngrediente = (datos) =>
    api.post('ingredientes/', datos);

export const actualizarIngrediente = (id, datos) =>
    api.put(`ingredientes/${id}/`, datos);
export const eliminarIngrediente = (id) =>
    api.delete(`ingredientes/${id}/`);
