export function generateAvatarDataUrl(name: string, bg = '#ff6a00', fg = '#ffffff') {
  const initial = (name || 'D').trim().charAt(0).toUpperCase();
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dy='.1em' text-anchor='middle' fill='${fg}' font-family='Arial, Helvetica, sans-serif' font-size='120'>${initial}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
