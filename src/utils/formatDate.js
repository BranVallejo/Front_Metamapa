// src/utils/formatDate.js

export const formatearFecha = (fechaISO) => {
  if (!fechaISO) return "No especificada";
  // Convertimos a Date y luego a un string legible en español
  return new Date(fechaISO).toLocaleString('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};