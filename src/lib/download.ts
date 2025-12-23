import JSZip from 'jszip';
import emailjs from '@emailjs/browser';

// EmailJS Config
const EMAILJS_SERVICE_ID = 'service_8gh747m';
const EMAILJS_TEMPLATE_ID = 'template_6ssvr2p';
const EMAILJS_PUBLIC_KEY = 'MQePSJwFKzy2hW_XK';

// Inicializar EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export async function submitEmail(email: string, medida: string = '1:1'): Promise<boolean> {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      user_email: email,
      medida: medida,
      timestamp: new Date().toLocaleString('es-MX', { 
        timeZone: 'America/Mexico_City',
        dateStyle: 'full',
        timeStyle: 'short'
      })
    });
    
    console.log('✅ Email registrado:', email);
    return true;
  } catch (error) {
    console.error('❌ Error EmailJS:', error);
    return false;
  }
}

export async function generateAndDownloadZip(
  canvases: HTMLCanvasElement[],
  medidaFolder: string
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(`pack-navidad-${medidaFolder}`);

  if (!folder) {
    throw new Error('No se pudo crear el ZIP');
  }

  for (let i = 0; i < canvases.length; i++) {
    const canvas = canvases[i];
    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    
    folder.file(`diseno-${String(i + 1).padStart(2, '0')}.png`, base64Data, { base64: true });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `pack-navidad-${medidaFolder}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}