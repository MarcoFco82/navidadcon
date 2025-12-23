'use client';

import { MedidaType, MEDIDAS } from '@/types';

interface MedidaSelectorProps {
  value: MedidaType;
  onChange: (medida: MedidaType) => void;
}

export default function MedidaSelector({ value, onChange }: MedidaSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-sm text-gray-600 mb-3">Selecciona el formato:</p>
      <div className="flex gap-3">
        {MEDIDAS.map((medida) => (
          <button
            key={medida.id}
            onClick={() => onChange(medida.id)}
            className={`
              flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
              ${value === medida.id
                ? 'border-[var(--christmas-wine)] bg-[var(--christmas-wine)]/5'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            {/* Icono visual de la proporción */}
            <div 
              className={`
                bg-gray-300 rounded-sm
                ${medida.id === '1:1' ? 'w-10 h-10' : ''}
                ${medida.id === '16:9' ? 'w-14 h-8' : ''}
                ${medida.id === '9:16' ? 'w-6 h-10' : ''}
                ${value === medida.id ? 'bg-[var(--christmas-wine)]' : ''}
              `}
            />
            <span className={`text-sm font-medium ${value === medida.id ? 'text-christmas-wine' : 'text-gray-600'}`}>
              {medida.nombre}
            </span>
            <span className="text-xs text-gray-400">
              {medida.id}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}