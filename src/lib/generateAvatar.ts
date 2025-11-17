/**
 * Generate an SVG avatar data URL for a given name
 * @param name - The name to generate avatar for (uses first letter)
 * @param backgroundColor - Background color (hex without #)
 * @param textColor - Text color (hex without #)
 * @returns Data URL string for inline SVG usage
 */
export function generateAvatar(
  name: string,
  backgroundColor: string = 'ff6a00',
  textColor: string = 'fff'
): string {
  const initial = name.charAt(0).toUpperCase();
  const bgColor = backgroundColor.replace('#', '');
  const fgColor = textColor.replace('#', '');
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#${bgColor}"/>
      <text x="50" y="50" dominant-baseline="central" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
            fill="#${fgColor}">
        ${initial}
      </text>
    </svg>
  `.trim();
  
  // Encode to base64 data URL
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get the default Dezemu logo URL from environment or generate fallback
 * @returns Logo URL string
 */
export function getDezemuLogo(): string {
  // Try to get from environment variable first
  const envLogo = import.meta.env.VITE_DEFAULT_SELLER_LOGO_URL 
    || import.meta.env.DEFAULT_SELLER_LOGO_URL;
  
  if (envLogo) {
    return envLogo;
  }
  
  // Fallback to generated avatar
  return generateAvatar('Dezemu', 'ff6a00', 'fff');
}
