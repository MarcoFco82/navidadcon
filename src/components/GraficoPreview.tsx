'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { PackConfig, MedidaConfig, GRAFICOS } from '@/types';

interface GraficoPreviewProps {
  config: PackConfig;
  medida: MedidaConfig;
}

export interface GraficoPreviewHandle {
  getCanvases: () => Promise<HTMLCanvasElement[]>;
}

const GraficoPreview = forwardRef<GraficoPreviewHandle, GraficoPreviewProps>(
  ({ config, medida }, ref) => {
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      getCanvases: async () => {
        // Generar canvas NUEVOS sin marca de agua para descarga
        const canvases: HTMLCanvasElement[] = [];
        
        for (const num of GRAFICOS) {
          const canvas = document.createElement('canvas');
          canvas.width = medida.width;
          canvas.height = medida.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            await drawGrafico(ctx, num, config, medida, false);
          }
          canvases.push(canvas);
        }
        
        return canvases;
      },
    }));

    return (
      <div className="grid gap-6">
        {GRAFICOS.map((num, index) => (
          <SingleGrafico
            key={num}
            num={num}
            config={config}
            medida={medida}
            ref={(el) => { canvasRefs.current[index] = el; }}
          />
        ))}
      </div>
    );
  }
);

GraficoPreview.displayName = 'GraficoPreview';

export default GraficoPreview;

interface SingleGraficoProps {
  num: string;
  config: PackConfig;
  medida: MedidaConfig;
}

const SingleGrafico = forwardRef<HTMLCanvasElement, SingleGraficoProps>(
  ({ num, config, medida }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => canvasRef.current!, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = medida.width;
      canvas.height = medida.height;

      // Preview CON watermark
      drawGrafico(ctx, num, config, medida, true);
    }, [num, config, medida]);

    return (
      <div className="space-y-2">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-md">
          <div 
            className="relative w-full" 
            style={{ paddingBottom: `${(medida.height / medida.width) * 100}%` }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500">Diseño {num}</p>
      </div>
    );
  }
);

SingleGrafico.displayName = 'SingleGrafico';

async function drawGrafico(
  ctx: CanvasRenderingContext2D,
  num: string,
  config: PackConfig,
  medida: MedidaConfig,
  withWatermark: boolean = true
) {
  const { width, height } = medida;
  const { top, bottom, leftRight } = medida.textArea;

  // 1. Cargar imagen de fondo
  const bgImage = new Image();
  bgImage.crossOrigin = 'anonymous';
  
  await new Promise<void>((resolve) => {
    bgImage.onload = () => {
      ctx.drawImage(bgImage, 0, 0, width, height);
      resolve();
    };
    bgImage.onerror = () => {
      ctx.fillStyle = '#27020C';
      ctx.fillRect(0, 0, width, height);
      resolve();
    };
    bgImage.src = `/graphics/${medida.folder}/${num}.png`;
  });

  // 2. Área de contenido
  const contentY = top;
  const contentWidth = width - (leftRight * 2);
  const contentHeight = height - top - bottom;

  // 3. Dibujar texto (múltiples líneas)
  const gap = 30;
  let currentY = contentY;
  
  if (config.texto) {
    const lines = config.texto.split('\n');
    const fontSize = Math.min(width * 0.038, 44);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${fontSize}px "Heiti TC", "Hiragino Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    const lineHeight = fontSize * 1.3;
    
    for (const line of lines) {
      if (line.trim()) {
        ctx.fillText(line.trim(), width / 2, currentY);
      }
      currentY += lineHeight;
    }
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  // 4. Dibujar logo debajo del texto
  if (config.logo) {
    const logoMaxHeight = contentHeight * 0.35;
    const logoMaxWidth = contentWidth * 0.45;
    const logoY = currentY + gap;
    
    await drawLogoCentered(ctx, config.logo, width / 2, logoY, logoMaxWidth, logoMaxHeight);
  }

  // 5. Marca de agua (solo en preview)
  if (withWatermark) {
    drawWatermark(ctx, width, height);
  }
}

async function drawLogoCentered(
  ctx: CanvasRenderingContext2D,
  logoSrc: string,
  centerX: number,
  y: number,
  maxWidth: number,
  maxHeight: number
) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      
      const drawX = centerX - newWidth / 2;
      
      ctx.drawImage(img, drawX, y, newWidth, newHeight);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = logoSrc;
  });
}

function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = 'RENDERDEVO';
  const spacingX = 150;
  const spacingY = 50;
  
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-25 * Math.PI / 180);
  ctx.translate(-width / 2, -height / 2);
  
  for (let y = -height; y < height * 2; y += spacingY) {
    for (let x = -width; x < width * 2; x += spacingX) {
      ctx.fillText(text, x, y);
    }
  }
  
  ctx.restore();
}
