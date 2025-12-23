export interface PackConfig {
  logo: string | null;
  texto: string;
  medida: MedidaType;
}

export type MedidaType = '1:1' | '16:9' | '9:16';

export interface MedidaConfig {
  id: MedidaType;
  nombre: string;
  width: number;
  height: number;
  folder: string;
  video: string;
  textArea: {
    top: number;
    bottom: number;
    leftRight: number;
  };
}

export const MEDIDAS: MedidaConfig[] = [
  {
    id: '1:1',
    nombre: 'Cuadrado',
    width: 1080,
    height: 1080,
    folder: '1080x1080',
    video: 'https://pub-2097fe72397c46bf8bb6b48fd08e8833.r2.dev/xmas_1_1.mp4',
    textArea: {
      top: 460,
      bottom: 360,
      leftRight: 150,
    },
  },
  {
    id: '16:9',
    nombre: 'Horizontal',
    width: 1920,
    height: 1080,
    folder: '1920x1080',
    video: 'https://pub-2097fe72397c46bf8bb6b48fd08e8833.r2.dev/xmas_16_9.mp4',
    textArea: {
      top: 380,
      bottom: 320,
      leftRight: 550,
    },
  },
  {
    id: '9:16',
    nombre: 'Vertical',
    width: 1080,
    height: 1920,
    folder: '1080x1920',
    video: 'https://pub-2097fe72397c46bf8bb6b48fd08e8833.r2.dev/xmas_9_16.mp4',
    textArea: {
      top: 860,
      bottom: 750,
      leftRight: 140,
    },
  },
];

export const GRAFICOS = ['01', '02', '03', '04', '05', '06'];

export const DEFAULT_MENSAJE = `Que el espíritu de la Navidad
traiga paz y amor a tu hogar.

Feliz Navidad te desea:`;