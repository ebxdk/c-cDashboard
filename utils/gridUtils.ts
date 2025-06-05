import {
    GRID_CELL_WIDTH,
    GRID_COLS,
    GRID_PADDING,
    LARGE_WIDGET_HEIGHT,
    LARGE_WIDGET_WIDTH,
    MEDIUM_WIDGET_HEIGHT,
    MEDIUM_WIDGET_WIDTH,
    SMALL_WIDGET_HEIGHT,
    SMALL_WIDGET_SIZE,
    WIDGET_GAP
} from '../constants/widgetConstants';
import { WidgetPosition, WidgetSize } from '../types/widget';

export const getWidgetGridSize = (size: WidgetSize) => {
  switch (size) {
    case 'small':
      return { width: 1, height: 1 };
    case 'medium':
      return { width: 2, height: 1 };
    case 'large':
      return { width: 2, height: 2 };
  }
};

export const getWidgetPixelDimensions = (size: WidgetSize) => {
  switch (size) {
    case 'small':
      return { width: SMALL_WIDGET_SIZE, height: SMALL_WIDGET_HEIGHT };
    case 'medium':
      return { width: MEDIUM_WIDGET_WIDTH, height: MEDIUM_WIDGET_HEIGHT };
    case 'large':
      return { width: LARGE_WIDGET_WIDTH, height: LARGE_WIDGET_HEIGHT };
  }
};

export const getPixelPosition = (gridX: number, gridY: number, allWidgets?: WidgetPosition[]) => {
  // Center widgets within their grid cells by adjusting x position
  const baseX = GRID_PADDING + (gridX * (GRID_CELL_WIDTH + WIDGET_GAP));
  
  // Find current widget to determine its size
  let currentWidget = allWidgets?.find(w => w.gridX === gridX && w.gridY === gridY);
  let centerOffset = 0;
  
  if (currentWidget) {
    // Apply different offsets based on widget size
    if (currentWidget.size === 'medium' || currentWidget.size === 'large') {
      centerOffset = 6.5; // Shift medium/large widgets right
    } else {
      centerOffset = 10; // Shift small widgets left
    }
  } else {
    // Default offset for small widgets when widget info not available
    centerOffset = 10;
  }
  
  const x = baseX - centerOffset;
  let y = 0;

  if (!allWidgets) {
    // If we don't have widget layout info, use simple calculation
    for (let row = 0; row < gridY; row++) {
      y += SMALL_WIDGET_HEIGHT + WIDGET_GAP;
    }
  } else {
    // Calculate Y position based on actual widget heights in previous rows
    // Find the maximum bottom position of widgets in previous rows
    for (let row = 0; row < gridY; row++) {
      const widgetsInRow = allWidgets.filter(w => w.gridY === row);
      if (widgetsInRow.length > 0) {
        const maxHeightInRow = Math.max(...widgetsInRow.map(w => {
          const dimensions = getWidgetPixelDimensions(w.size);
          return dimensions.height;
        }));
        y += maxHeightInRow + WIDGET_GAP;
      }
    }
  }
  
  return { x, y };
};

export const getDefaultLayout = (): WidgetPosition[] => {
  return [
    { id: 'events', gridX: 0, gridY: 0, size: 'medium', ...getWidgetGridSize('medium') },
    { id: 'messages', gridX: 0, gridY: 1, size: 'small', ...getWidgetGridSize('small') },
    { id: 'habits', gridX: 1, gridY: 1, size: 'small', ...getWidgetGridSize('small') },
    { id: 'askMinara', gridX: 0, gridY: 2, size: 'small', ...getWidgetGridSize('small') },
    { id: 'prayer', gridX: 1, gridY: 2, size: 'small', ...getWidgetGridSize('small') },
    { id: 'journal', gridX: 0, gridY: 3, size: 'small', ...getWidgetGridSize('small') },
    { id: 'cohort', gridX: 1, gridY: 3, size: 'small', ...getWidgetGridSize('small') },
  ];
};

// Optimized grid matrix creation with caching
let gridCache: { positions: WidgetPosition[], matrix: (string | null)[][] } | null = null;

export const createGridMatrix = (positions: WidgetPosition[]) => {
  // Simple cache check - if positions haven't changed, return cached matrix
  if (gridCache && JSON.stringify(gridCache.positions) === JSON.stringify(positions)) {
    return gridCache.matrix;
  }

  const maxRow = Math.max(...positions.map(p => p.gridY + p.height), 10);
  const grid: (string | null)[][] = Array(maxRow).fill(null).map(() => Array(GRID_COLS).fill(null));
  
  positions.forEach(pos => {
    for (let y = pos.gridY; y < pos.gridY + pos.height; y++) {
      for (let x = pos.gridX; x < pos.gridX + pos.width; x++) {
        if (y < grid.length && x < GRID_COLS) {
          grid[y][x] = pos.id;
        }
      }
    }
  });
  
  // Cache the result
  gridCache = { positions: [...positions], matrix: grid };
  
  return grid;
};

// Optimized position finding with better placement strategy
export const findFirstAvailablePosition = (
  width: number, 
  height: number, 
  widgetPositions: WidgetPosition[], 
  excludeId?: string
) => {
  const otherWidgets = widgetPositions.filter(w => w.id !== excludeId);
  const grid = createGridMatrix(otherWidgets);
  
  // Try to find position closest to original position first
  const originalWidget = widgetPositions.find(w => w.id === excludeId);
  const preferredY = originalWidget ? originalWidget.gridY : 0;
  
  // Search in expanding rings around preferred position
  for (let radius = 0; radius < grid.length; radius++) {
    for (let yOffset = -radius; yOffset <= radius; yOffset++) {
      const y = preferredY + yOffset;
      if (y < 0 || y > grid.length - height) continue;
      
      for (let x = 0; x <= GRID_COLS - width; x++) {
        let canPlace = true;
        
        for (let dy = 0; dy < height && canPlace; dy++) {
          for (let dx = 0; dx < width && canPlace; dx++) {
            if (y + dy >= grid.length || grid[y + dy][x + dx] !== null) {
              canPlace = false;
            }
          }
        }
        
        if (canPlace) {
          return { x, y };
        }
      }
    }
  }
  
  // Fallback to bottom of grid
  return { x: 0, y: grid.length };
};

// Enhanced rearrangement with smoother transitions and better conflict resolution
export const rearrangeWidgets = (
  draggedId: string, 
  newX: number, 
  newY: number, 
  widgetPositions: WidgetPosition[]
): WidgetPosition[] => {
  const draggedWidget = widgetPositions.find(w => w.id === draggedId);
  if (!draggedWidget) return widgetPositions;

  const constrainedX = Math.max(0, Math.min(newX, GRID_COLS - draggedWidget.width));
  const constrainedY = Math.max(0, newY);

  // Early return if position hasn't actually changed
  if (constrainedX === draggedWidget.gridX && constrainedY === draggedWidget.gridY) {
    return widgetPositions;
  }

  let newPositions = [...widgetPositions];
  const draggedIndex = newPositions.findIndex(w => w.id === draggedId);
  
  // Update dragged widget position
  newPositions[draggedIndex] = {
    ...draggedWidget,
    gridX: constrainedX,
    gridY: constrainedY
  };

  // Find conflicts more efficiently
  const conflicts = new Map<string, WidgetPosition>();
  
  // Check for overlaps with the new position
  for (let y = constrainedY; y < constrainedY + draggedWidget.height; y++) {
    for (let x = constrainedX; x < constrainedX + draggedWidget.width; x++) {
      const conflictingWidget = newPositions.find(w => 
        w.id !== draggedId &&
        x >= w.gridX && x < w.gridX + w.width &&
        y >= w.gridY && y < w.gridY + w.height
      );
      
      if (conflictingWidget) {
        conflicts.set(conflictingWidget.id, conflictingWidget);
      }
    }
  }

  // Resolve conflicts with smarter placement
  conflicts.forEach((conflictWidget) => {
    // Try to place conflicting widget in nearby positions first
    const preferredPositions = [
      // Try positions around the dragged widget first
      { x: constrainedX + draggedWidget.width, y: constrainedY },
      { x: constrainedX - conflictWidget.width, y: constrainedY },
      { x: constrainedX, y: constrainedY + draggedWidget.height },
      { x: constrainedX, y: constrainedY - conflictWidget.height },
    ].filter(pos => 
      pos.x >= 0 && pos.x + conflictWidget.width <= GRID_COLS && 
      pos.y >= 0
    );

    let newPos = null;
    
    // Try preferred positions first
    for (const pos of preferredPositions) {
      const tempPositions = newPositions.filter(w => w.id !== conflictWidget.id);
      const tempGrid = createGridMatrix(tempPositions);
      
      let canPlace = true;
      for (let dy = 0; dy < conflictWidget.height && canPlace; dy++) {
        for (let dx = 0; dx < conflictWidget.width && canPlace; dx++) {
          const checkY = pos.y + dy;
          const checkX = pos.x + dx;
          if (checkY >= tempGrid.length || tempGrid[checkY][checkX] !== null) {
            canPlace = false;
          }
        }
      }
      
      if (canPlace) {
        newPos = pos;
        break;
      }
    }
    
    // Fallback to general search if preferred positions don't work
    if (!newPos) {
      newPos = findFirstAvailablePosition(
        conflictWidget.width, 
        conflictWidget.height, 
        newPositions,
        conflictWidget.id
      );
    }
    
    const conflictIndex = newPositions.findIndex(w => w.id === conflictWidget.id);
    newPositions[conflictIndex] = {
      ...conflictWidget,
      gridX: newPos.x,
      gridY: newPos.y
    };
  });

  return newPositions;
}; 