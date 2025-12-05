import React from 'react';

const SpamCard = ({ data, onExport }) => {
  const totalSpam = data.reduce((acc, curr) => acc + curr.cantidadSpam, 0);

  return (
    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl shadow border border-red-100 dark:border-red-900/50 flex flex-col justify-center items-center text-center">
      <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Solicitudes Detectadas como Spam</h3>
      <span className="text-5xl font-bold text-red-600 dark:text-red-400">{totalSpam}</span>
      <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-2">En el período seleccionado</p>
      <button onClick={onExport} className="mt-4 text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide hover:underline">Descargar Reporte</button>
    </div>
  );
};
export default SpamCard;