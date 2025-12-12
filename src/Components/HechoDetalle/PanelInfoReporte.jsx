import React from 'react';

const PanelInfoReporte = ({ nombre, apellido }) => {
  return (
    <div className="w-full">
      <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 border-b border-gray-200/50 dark:border-white/10 pb-2">
        Autoría
      </h3>
      <dl>
        <div>
          <dt className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Reportado Por</dt>
          <dd className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            {nombre} {apellido}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default PanelInfoReporte;