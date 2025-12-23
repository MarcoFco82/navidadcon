'use client';

import { useRef, useState } from 'react';
import { MedidaConfig } from '@/types';

interface VideoPreviewProps {
  medida: MedidaConfig;
}

export default function VideoPreview({ medida }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleBuyClick = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medida: medida.id }),
      });
      
      const { url, error } = await response.json();
      
      if (error) {
        alert('Error al procesar el pago. Intenta de nuevo.');
        return;
      }
      
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <h3 className="font-display text-lg font-semibold text-christmas-wine">
        ¿Quieres la animación?
      </h3>
      
      <div className="relative rounded-xl overflow-hidden bg-gray-100">
        <div 
          className="relative w-full" 
          style={{ paddingBottom: `${(medida.height / medida.width) * 100}%` }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={`/anim/${medida.video}`}
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />
        </div>
        
        {/* Botón de audio */}
        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all"
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="text-center space-y-3">
        <p className="text-gray-600">
          Video animado personalizado con tu logo y nombre.
          <br />
          <span className="font-semibold text-christmas-wine">Entrega el mismo día.</span>
        </p>
        
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-bold text-christmas-wine">$100</span>
          <span className="text-gray-500">MXN</span>
        </div>

        <button
          onClick={handleBuyClick}
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all ${
            isLoading 
              ? 'bg-gray-300 text-gray-500 cursor-wait' 
              : 'bg-christmas-gold text-white hover:bg-[var(--christmas-gold-light)] hover:shadow-xl'
          }`}
        >
          {isLoading ? 'Procesando...' : 'Comprar animación'}
        </button>
        
        <p className="text-xs text-gray-400">
          Pago seguro con Stripe
        </p>
      </div>
    </div>
  );
}