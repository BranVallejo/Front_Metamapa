import React from 'react';

const HechoHeader = ({ titulo, categoria }) => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 leading-tight">
        {titulo}
      </h1>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 w-fit">
        {categoria}
      </span>
    </div>
  );
};

export default HechoHeader;