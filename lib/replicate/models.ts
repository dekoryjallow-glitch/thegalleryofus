/**
 * Replicate Model Configuration
 */

// SDXL Model Version für Line Art Generation
// Für den MVP nutzen wir SDXL mit Text-Prompt
// Später können wir auf ein spezialisiertes Line-Art Model umstellen
export const SDXL_MODEL_VERSION = '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b';

/**
 * Generiert einen Prompt für Continuous Line Art
 */
export function generateLineArtPrompt(): string {
  return 'continuous line drawing, minimalist art, single line portrait, two faces merged into one abstract face, black ink on white background, elegant flowing lines, artistic line art, modern minimalist style, no shading, no color, just pure black lines';
}

export function generateNegativePrompt(): string {
  return 'photograph, realistic, detailed, color, shading, shadows, gradients, photorealistic, 3d render';
}

