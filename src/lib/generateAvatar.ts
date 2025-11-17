/**
 * Generate an avatar data URL with initial letter and branded background color
 * @param name - The name to generate avatar for
 * @param backgroundColor - Background color (default: #ff6a00 - Dezemu primary)
 * @param textColor - Text color (default: #ffffff)
 * @returns SVG data URL
 */
export function generateAvatarDataUrl(
  name: string,
  backgroundColor: string = '#ff6a00',
  textColor: string = '#ffffff'
): string {
  // Get first letter and capitalize
  const initial = name.charAt(0).toUpperCase();
  
  // Create SVG with proper XML encoding
  const svg = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${backgroundColor}"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="central">${initial}</text></svg>`;
  
  // Encode to data URL using URL encoding to avoid btoa() issues with special chars
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}

export default generateAvatarDataUrl;
