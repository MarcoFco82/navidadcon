'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const medida = searchParams.get('medida') || '1x1';

  return (
    <div className="min-h-screen bg-[var(--christmas-cream)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center space-y-6">
        <div className="text-6xl">🎄</div>
        
        <h1 className="font-display text-2xl font-bold text-christmas-wine">
          ¡Gracias por tu compra!
        </h1>
        
        <p className="text-gray-600">
          Tu pago se procesó correctamente. Recibirás tu video animado personalizado en formato <strong>{medida}</strong> en las próximas horas.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-800 text-sm">
            📋 Completa el formulario con tu logo y texto para crear tu video personalizado.
          </p>
        </div>

        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSduop9NHbsKVtDBTy_25eUHOJY_DnFOmneNCD1P0lPNa5aT_w/viewform"
          target="_blank"
          className="inline-block w-full py-4 rounded-xl font-semibold text-lg bg-christmas-gold text-white hover:bg-[var(--christmas-gold-light)] shadow-lg hover:shadow-xl transition-all"
        >
          Enviar mi logo y texto
        </a>
        
        <a
          href="/"
          className="inline-block w-full py-3 rounded-xl font-semibold text-christmas-wine border-2 border-christmas-wine hover:bg-christmas-wine hover:text-white transition-all"
        >
          Volver al inicio
        </a>
        
        <p className="text-xs text-gray-400">
          ¿Dudas? Escríbenos a hola@renderdevo.com
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--christmas-cream)] flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}