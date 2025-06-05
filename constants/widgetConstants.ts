import { Dimensions } from 'react-native';
import { WidgetData } from '../types/widget';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Apple iOS widget specifications - ultra-tight spacing like screenshot
export const GRID_PADDING = 23; // Minimal side margins like Apple
export const WIDGET_GAP = 20; // Small gaps between widgets (Apple's actual spacing)
export const ADDITIONAL_RIGHT_PADDING = 6; // New constant for right padding


// Apple-accurate widget dimensions (matching screenshot proportions)
export const SMALL_WIDGET_SIZE = Math.floor((screenWidth - (GRID_PADDING * 1) - WIDGET_GAP - ADDITIONAL_RIGHT_PADDING) / 2);
export const SMALL_WIDGET_HEIGHT = Math.floor(SMALL_WIDGET_SIZE * 1.05); // Slightly taller but not too much
export const MEDIUM_WIDGET_WIDTH = screenWidth - (GRID_PADDING * 1.25) - ADDITIONAL_RIGHT_PADDING;
export const MEDIUM_WIDGET_HEIGHT = Math.floor(SMALL_WIDGET_SIZE * 1.05); // Just slightly taller than width
export const LARGE_WIDGET_WIDTH = screenWidth - (GRID_PADDING * 2);
export const LARGE_WIDGET_HEIGHT = (SMALL_WIDGET_HEIGHT * 2) + WIDGET_GAP;

// Grid dimensions - using actual widget heights for ultra-tight rows
export const GRID_COLS = 2;
export const GRID_CELL_WIDTH = SMALL_WIDGET_SIZE;
export const GRID_CELL_HEIGHT = SMALL_WIDGET_HEIGHT; // Use actual widget height for tight rows

// Apple's spring animation configs
export const APPLE_SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 200,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};

export const EDIT_MODE_SPRING = {
  damping: 12,
  mass: 1,
  stiffness: 180,
  overshootClamping: false,
};

// iOS-style wiggle animation config
export const WIGGLE_CONFIG = {
  damping: 8,
  mass: 1,
  stiffness: 150,
};

// Widget definitions
export const WIDGET_DEFINITIONS: Record<string, WidgetData> = {
  events: { id: 'events', type: 'medium', availableSizes: ['medium', 'large'] }, // Cohort contacts
  messages: { id: 'messages', type: 'small', availableSizes: ['small', 'medium'] },
  habits: { id: 'habits', type: 'small', availableSizes: ['small', 'medium'] }, // Calendar widget
  askMinara: { id: 'askMinara', type: 'small', availableSizes: ['small', 'medium'] },
  prayer: { id: 'prayer', type: 'small', availableSizes: ['small', 'medium'] },
  journal: { id: 'journal', type: 'small', availableSizes: ['small', 'medium'] },
}; 