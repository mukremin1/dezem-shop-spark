/**
 * Generate an avatar data URL from a name
 * Creates an inline SVG with the first letter of the name and primary color background
 * 
 * @param name - The name to generate avatar from
 * @returns Data URL containing SVG avatar
 */
export function generateAvatarDataUrl(name: string): string {
  const initial = name.charAt(0).toUpperCase();
  const primaryColor = '#ff6a00'; // Dezemu primary color
  const textColor = '#ffffff';
  
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${primaryColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-size="100" 
        font-weight="bold" 
        font-family="Arial, sans-serif" 
        fill="${textColor}" 
        text-anchor="middle" 
        dominant-baseline="central"
      >
        ${initial}
      </text>
    </svg>
  `.trim();
  
  // Encode SVG to base64 data URL
  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}
