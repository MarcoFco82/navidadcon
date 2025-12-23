'use client';

import { useCallback, useState } from 'react';

interface LogoUploadProps {
  onLogoChange: (base64: string | null) => void;
  currentLogo: string | null;
}

export default function LogoUpload({ onLogoChange, currentLogo }: LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor sube una imagen');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onLogoChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onLogoChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const removeLogo = useCallback(() => {
    onLogoChange(null);
  }, [onLogoChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-christmas-wine">
        Logo de tu negocio
      </label>
      
      {currentLogo ? (
        <div className="relative w-full h-32 border-2 border-dashed border-[var(--christmas-wine)] rounded-lg bg-white flex items-center justify-center">
          <img 
            src={currentLogo} 
            alt="Logo" 
            className="max-h-28 max-w-full object-contain"
          />
          <button
            onClick={removeLogo}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
            aria-label="Eliminar logo"
          >
            ×
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            w-full h-32 border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center gap-2
            cursor-pointer transition-all duration-200
            ${isDragging 
              ? 'border-[var(--christmas-gold)] bg-[var(--christmas-gold)]/10' 
              : 'border-[var(--christmas-wine)]/40 hover:border-[var(--christmas-wine)] bg-white'
            }
          `}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            id="logo-upload"
          />
          <label htmlFor="logo-upload" className="cursor-pointer text-center">
            <div className="text-3xl mb-1">📁</div>
            <span className="text-sm text-gray-600">
              Arrastra tu logo o <span className="text-christmas-wine underline">selecciona archivo</span>
            </span>
          </label>
        </div>
      )}
    </div>
  );
}
