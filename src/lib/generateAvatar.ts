/**
 * Generate an inline SVG avatar data URL from a name
 * Used as a fallback for seller logos
 * 
 * @param name - The name to generate avatar for
 * @param backgroundColor - Background color (hex without #), defaults to ff6a00 (Trendyol orange)
 * @param textColor - Text color (hex without #), defaults to fff (white)
 * @returns SVG data URL
 */
export function generateAvatar(
  name: string,
  backgroundColor: string = "ff6a00",
  textColor: string = "fff"
): string {
  // Get first letter of the name, uppercase
  const initial = name.charAt(0).toUpperCase();
  
  // Create SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#${backgroundColor}"/>
      <text 
        x="50" 
        y="50" 
        font-family="Arial, sans-serif" 
        font-size="48" 
        font-weight="bold" 
        fill="#${textColor}" 
        text-anchor="middle" 
        dominant-baseline="central"
      >${initial}</text>
    </svg>
  `.trim();
  
  // Convert to data URL
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generate an avatar URL using ui-avatars.com service
 * Alternative to inline SVG for external use
 * 
 * @param name - The name to generate avatar for
 * @param backgroundColor - Background color (hex without #), defaults to ff6a00
 * @param textColor - Text color (hex without #), defaults to fff
 * @returns URL to ui-avatars.com service
 */
export function generateAvatarUrl(
  name: string,
  backgroundColor: string = "ff6a00",
  textColor: string = "fff"
): string {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${backgroundColor}&color=${textColor}&size=200&bold=true`;
}
