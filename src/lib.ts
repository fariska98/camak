export const ease = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.76, 0, 0.24, 1] as const;

export function media(file: string) {
  const base = typeof window !== 'undefined' && window.camakRuntime?.assetBase ? window.camakRuntime.assetBase : '/media/';
  return `${base}${file}`;
}

export const contact = {
  phone: '+64272960929',
  phoneDisplay: '027 296 0929',
  phoneIntl: '+64 27 296 0929',
  phone2: '+64274283675',
  phone2Intl: '+64 27 428 3675',
  email: 'info@camakservices.co.nz',
  whatsapp: 'https://wa.me/64272960929',
  map: 'https://www.google.com/maps/search/?api=1&query=Dee+Street+Avenal+Invercargill+New+Zealand',
};
