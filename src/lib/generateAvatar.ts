/**
 * Generate an SVG avatar data URL from a name
 * Uses the first initial of the name with Dezemu's primary brand color
 * 
 * @param name - The name to generate an avatar for (e.g., "Dezemu")
 * @returns A data URL containing an inline SVG avatar
 * 
 * @example
 * const avatarUrl = generateAvatarDataUrl("Dezemu");
 * // Returns: "data:image/svg+xml,<svg>...</svg>"
 * 
 * // Usage in an img tag:
 * <img src={generateAvatarDataUrl("Dezemu")} alt="Dezemu" />
 */
export function generateAvatarDataUrl(name: string): string {
  // Get first character of the name, uppercase
  const initial = name.charAt(0).toUpperCase();
  
  // Dezemu primary brand color
  const backgroundColor = '#ff6a00';
  const textColor = '#ffffff';
  
  // Create SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${backgroundColor}" />
      <text
        x="50"
        y="50"
        font-family="Arial, sans-serif"
        font-size="48"
        font-weight="bold"
        fill="${textColor}"
        text-anchor="middle"
        dominant-baseline="central"
      >
        ${initial}
      </text>
    </svg>
  `.trim();
  
  // Encode the SVG for use as a data URL
  // Using encodeURIComponent to properly escape special characters
  const encoded = encodeURIComponent(svg);
  
  return `data:image/svg+xml,${encoded}`;
}
