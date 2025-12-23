'use client';

import { useState, useCallback, useRef } from 'react';
import { PackConfig, MEDIDAS, MedidaType, DEFAULT_MENSAJE } from '@/types';
import LogoUpload from './LogoUpload';
import TextInput from './TextInput';
import MedidaSelector from './MedidaSelector';
import GraficoPreview, { GraficoPreviewHandle } from './GraficoPreview';
import VideoPreview from './VideoPreview';
import DownloadModal from './DownloadModal';
import { submitEmail, generateAndDownloadZip } from '@/lib/download';

const DEFAULT_CONFIG: PackConfig = {
  logo: null,
  texto: DEFAULT_MENSAJE,
  medida: '1:1',
};

export default function Editor() {
  const [config, setConfig] = useState<PackConfig>(DEFAULT_CONFIG);
  const [showModal, setShowModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const graficoPreviewRef = useRef<GraficoPreviewHandle>(null);

  const updateConfig = useCallback(<K extends keyof PackConfig>(
    key: K,
    value: PackConfig[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const medidaActual = MEDIDAS.find(m => m.id === config.medida)!;

  const handleDownloadClick = () => {
    setShowModal(true);
  };

  const handleDownloadConfirm = async (email: string) => {
    setIsDownloading(true);

    try {
      // 1. Guardar email en Google Sheets
      await submitEmail(email);

      // 2. Obtener los canvas
      const canvases = await graficoPreviewRef.current?.getCanvases() || [];
      
      if (canvases.length === 0) {
        throw new Error('No hay gráficos para descargar');
      }

      // 3. Generar y descargar ZIP
      await generateAndDownloadZip(canvases, medidaActual.folder);

      // 4. Cerrar modal
      setShowModal(false);
    } catch (error) {
      console.error('Error en descarga:', error);
      alert('Hubo un error al generar la descarga. Intenta de nuevo.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--christmas-cream)]">
      {/* Header */}
      <header className="bg-christmas-wine text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">
                Pack Navideño 2024
              </h1>
              <p className="text-sm md:text-base opacity-90 mt-1">
                Gráficos navideños personalizados <span className="text-[var(--christmas-gold)] font-bold">¡GRATIS!</span>
              </p>
            </div>
            <a 
              href="https://renderdevo.com" 
              target="_blank"
              className="text-right"
            >
              <span 
                className="text-white text-2xl tracking-wide block"
                style={{ fontFamily: 'var(--font-logo)' }}
              >
                RENDERDEVO
              </span>
              <span className="text-xs text-white/70">
                Estrategias digitales que conectan
              </span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Panel de configuración */}
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <h2 className="font-display text-xl font-semibold text-christmas-wine border-b border-gray-100 pb-3">
                Personaliza tus gráficos
              </h2>

              <LogoUpload 
                currentLogo={config.logo}
                onLogoChange={(logo) => updateConfig('logo', logo)}
              />

              <TextInput
                label="Mensaje navideño"
                value={config.texto}
                onChange={(v) => updateConfig('texto', v)}
                placeholder="Tu mensaje de felicitación..."
                maxLength={200}
                multiline
                rows={5}
              />

              <button
                onClick={handleDownloadClick}
                className="w-full py-4 rounded-xl font-semibold text-lg bg-christmas-wine text-white hover:bg-[var(--christmas-wine-light)] shadow-lg hover:shadow-xl transition-all"
              >
                Descargar 6 gráficos gratis
              </button>
            </div>

            {/* Video preview con opción de compra */}
            <VideoPreview medida={medidaActual} />
          </aside>

          {/* Vista previa */}
          <section className="space-y-6">
            {/* Selector de medida */}
            <MedidaSelector
              value={config.medida}
              onChange={(m: MedidaType) => updateConfig('medida', m)}
            />

            {/* Previews de gráficos */}
            <div className="space-y-6">
              <h2 className="font-display text-lg font-semibold text-christmas-wine">
                Vista previa — {medidaActual.nombre} ({medidaActual.width}×{medidaActual.height})
              </h2>

              <GraficoPreview 
                ref={graficoPreviewRef}
                config={config} 
                medida={medidaActual} 
              />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-christmas-wine text-white py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm opacity-80">
            © 2024 RenderDevo. Estrategias digitales que conectan.
          </p>
        </div>
      </footer>

      {/* Modal de descarga */}
      <DownloadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDownloadConfirm}
        isLoading={isDownloading}
      />
    </div>
  );
}