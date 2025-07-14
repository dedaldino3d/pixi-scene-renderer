// Utility functions for Pixi Renderer Pro

export function hexToPixiColor(hex: string): number {
  // Convert hex color string to PixiJS color number
  return parseInt(hex.replace('#', ''), 16);
} 