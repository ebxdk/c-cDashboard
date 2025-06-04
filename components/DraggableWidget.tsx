import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { GRID_CELL_HEIGHT, GRID_CELL_WIDTH, GRID_PADDING, WIDGET_DEFINITIONS, WIDGET_GAP } from '../constants/widgetConstants';
import { DraggableWidgetProps, WidgetPosition } from '../types/widget';
import { getPixelPosition, getWidgetPixelDimensions } from '../utils/gridUtils';

interface DraggableWidgetComponentProps extends DraggableWidgetProps {
  position: WidgetPosition;
  allPositions: WidgetPosition[];
  isEditMode: boolean;
  isDarkMode: boolean;
  colors: any;
  onLiveRearrange?: (draggedId: string, newX: number, newY: number) => void;
}

// Enhanced spring config for buttery smooth animations
const BUTTERY_SPRING_CONFIG = {
  damping: 20,
  mass: 0.8,
  stiffness: 300,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
};

const DRAG_SPRING_CONFIG = {
  damping: 25,
  mass: 1,
  stiffness: 400,
  overshootClamping: false,
  restDisplacementThreshold: 0.001,
  restSpeedThreshold: 0.001,
};

export const DraggableWidget: React.FC<DraggableWidgetComponentProps> = ({
  children,
  widgetId,
  position,
  allPositions,
  isEditMode,
  isDarkMode,
  colors,
  onPositionChange,
  onResize,
  onLiveRearrange
}) => {
  const widgetDef = WIDGET_DEFINITIONS[widgetId];
  
  if (!widgetDef) return null;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const dragProgress = useSharedValue(0);
  const lastRearrangePosition = useSharedValue({ x: position.gridX, y: position.gridY });
  const rearrangeThrottle = useSharedValue(0);

  const { x: initialX, y: initialY } = getPixelPosition(position.gridX, position.gridY, allPositions);
  const dimensions = getWidgetPixelDimensions(position.size);

  // Smooth edit mode animations with staggered timing
  useEffect(() => {
    if (isEditMode) {
      scale.value = withSpring(0.95, BUTTERY_SPRING_CONFIG);
      dragProgress.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withSpring(1, BUTTERY_SPRING_CONFIG);
      dragProgress.value = withTiming(0, { duration: 150 });
      // Reset any lingering translations
      translateX.value = withSpring(0, BUTTERY_SPRING_CONFIG);
      translateY.value = withSpring(0, BUTTERY_SPRING_CONFIG);
    }
  }, [isEditMode]);

  // Smooth position transitions when externally rearranged
  useEffect(() => {
    if (!isDragging.value) {
      translateX.value = withSpring(0, BUTTERY_SPRING_CONFIG);
      translateY.value = withSpring(0, BUTTERY_SPRING_CONFIG);
      lastRearrangePosition.value = { x: position.gridX, y: position.gridY };
    }
  }, [position.gridX, position.gridY]);

  // Throttled rearrangement function to prevent excessive calls
  const triggerRearrangement = (newGridX: number, newGridY: number) => {
    'worklet';
    const now = Date.now();
    if (now - rearrangeThrottle.value > 100) { // Throttle to max 10 times per second
      rearrangeThrottle.value = now;
      if (onLiveRearrange) {
        runOnJS(onLiveRearrange)(widgetId, newGridX, newGridY);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  // Enhanced pan gesture handler with buttery smooth interactions
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      if (!isEditMode) return;
      
      context.startX = translateX.value;
      context.startY = translateY.value;
      context.initialGridX = position.gridX;
      context.initialGridY = position.gridY;
      
      isDragging.value = true;
      scale.value = withSpring(1.08, DRAG_SPRING_CONFIG);
      lastRearrangePosition.value = { x: position.gridX, y: position.gridY };
      rearrangeThrottle.value = 0;
      
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    },
    onActive: (event, context) => {
      if (!isEditMode) return;
      
      // Smooth translation with slight resistance for natural feel
      const resistance = 0.95;
      translateX.value = (context.startX + event.translationX) * resistance;
      translateY.value = (context.startY + event.translationY) * resistance;
      
      // Calculate potential new grid position with improved accuracy
      const draggedToX = initialX + translateX.value;
      const draggedToY = initialY + translateY.value;
      
      const cellWidth = GRID_CELL_WIDTH + WIDGET_GAP;
      const cellHeight = GRID_CELL_HEIGHT + WIDGET_GAP;
      
      // Use center point of widget for more accurate positioning
      const centerX = draggedToX + dimensions.width / 2;
      const centerY = draggedToY + dimensions.height / 2;
      
      let newGridX = Math.round((centerX - GRID_PADDING - dimensions.width / 2) / cellWidth);
      let newGridY = Math.round(centerY / cellHeight);
      
      // Constrain to valid grid positions
      newGridX = Math.max(0, Math.min(newGridX, 1 - (position.width - 1)));
      newGridY = Math.max(0, newGridY);
      
      // Only trigger rearrangement if position actually changed and enough time has passed
      if (newGridX !== lastRearrangePosition.value.x || newGridY !== lastRearrangePosition.value.y) {
        lastRearrangePosition.value = { x: newGridX, y: newGridY };
        triggerRearrangement(newGridX, newGridY);
      }
    },
    onEnd: (event, context) => {
      if (!isEditMode) return;
      
      isDragging.value = false;
      
      // Calculate final position with same logic as onActive
      const draggedToX = initialX + translateX.value;
      const draggedToY = initialY + translateY.value;
      
      const cellWidth = GRID_CELL_WIDTH + WIDGET_GAP;
      const cellHeight = GRID_CELL_HEIGHT + WIDGET_GAP;
      
      const centerX = draggedToX + dimensions.width / 2;
      const centerY = draggedToY + dimensions.height / 2;
      
      let newGridX = Math.round((centerX - GRID_PADDING - dimensions.width / 2) / cellWidth);
      let newGridY = Math.round(centerY / cellHeight);
      
      newGridX = Math.max(0, Math.min(newGridX, 1 - (position.width - 1)));
      newGridY = Math.max(0, newGridY);
      
      // Final position change with haptic feedback
      runOnJS(onPositionChange)(widgetId, newGridX, newGridY);
      
      // Smooth return animations
      translateX.value = withSpring(0, BUTTERY_SPRING_CONFIG);
      translateY.value = withSpring(0, BUTTERY_SPRING_CONFIG);
      scale.value = withSpring(0.95, BUTTERY_SPRING_CONFIG);
      
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    },
    onCancel: () => {
      if (!isEditMode) return;
      
      isDragging.value = false;
      translateX.value = withSpring(0, BUTTERY_SPRING_CONFIG);
      translateY.value = withSpring(0, BUTTERY_SPRING_CONFIG);
      scale.value = withSpring(0.95, BUTTERY_SPRING_CONFIG);
    },
  });

  // Enhanced animated style with smooth interpolations
  const animatedStyle = useAnimatedStyle(() => {
    // Smooth shadow and elevation changes during drag
    const shadowOpacity = interpolate(
      isDragging.value ? 1 : 0,
      [0, 1],
      [0, 0.15],
      Extrapolate.CLAMP
    );
    
    const shadowRadius = interpolate(
      isDragging.value ? 1 : 0,
      [0, 1],
      [0, 8],
      Extrapolate.CLAMP
    );
    
    const elevation = interpolate(
      isDragging.value ? 1 : 0,
      [0, 1],
      [0, 8],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      zIndex: isDragging.value ? 1000 : isEditMode ? 100 : 1,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity,
      shadowRadius,
      elevation,
    };
  });

  return (
    <PanGestureHandler 
      onGestureEvent={panGestureHandler} 
      enabled={isEditMode}
      shouldCancelWhenOutside={false}
      activeOffsetX={[-8, 8]}
      activeOffsetY={[-8, 8]}
      failOffsetX={[-12, 12]}
      failOffsetY={[-12, 12]}
    >
      <Animated.View 
        style={[
          {
            position: 'absolute',
            left: initialX,
            top: initialY,
            width: dimensions.width,
            height: dimensions.height,
            margin: 0,
            padding: 0,
          },
          animatedStyle
        ]}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
}; 