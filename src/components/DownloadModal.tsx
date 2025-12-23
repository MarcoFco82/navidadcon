'use client';

import { useState } from 'react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
  isLoading: boolean;
}

export default function DownloadModal({ isOpen, onClose, onConfirm, isLoading }: DownloadModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Ingresa tu email');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Ingresa un email válido');
      return;
    }

    setError('');
    onConfirm(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        <div className="text-center space-y-2">
          <h3 className="font-display text-2xl font-bold text-christmas-wine">
            ¡Tus gráficos están listos!
          </h3>
          <p className="text-gray-600">
            Ingresa tu email para descargar los 6 diseños en formato PNG.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className={`
                w-full px-4 py-3 border rounded-xl text-lg
                focus:outline-none focus:ring-2 focus:ring-[var(--christmas-wine)]
                ${error ? 'border-red-500' : 'border-gray-300'}
              `}
              disabled={isLoading}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-4 rounded-xl font-semibold text-lg transition-all
              ${isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-wait' 
                : 'bg-christmas-wine text-white hover:bg-[var(--christmas-wine-light)] shadow-lg hover:shadow-xl'
              }
            `}
          >
            {isLoading ? 'Generando...' : 'Descargar gratis'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400">
          No spam. Solo te enviaremos ofertas navideñas.
        </p>
      </div>
    </div>
  );
}