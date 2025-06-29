export const Fonts = {
  // Apple system font stack for modern, clean UI
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  
  // For headers, titles, and emphasis (keeping existing custom font as option)
  header: 'AminMedium',
  
  // For body text, descriptions, and general content - now using system font
  body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  
  // Font weights (for reference)
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  }
} as const;

export type FontFamily = typeof Fonts.header | typeof Fonts.body | typeof Fonts.system; 