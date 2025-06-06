export const Fonts = {
  // For headers, titles, and emphasis
  header: 'AminMedium',
  
  // For body text, descriptions, and general content
  body: 'System',
  
  // Font weights (for reference)
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  }
} as const;

export type FontFamily = typeof Fonts.header | typeof Fonts.body; 