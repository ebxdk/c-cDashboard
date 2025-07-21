import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const { height: screenHeight } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoint?: number; // Percentage of screen height (default: 70%)
  enableBackdropDismiss?: boolean;
  enableSwipeToDismiss?: boolean;
  backgroundColor?: string;
  handleColor?: string;
  horizontalMargin?: number; // Margin from left and right edges
  bottomMargin?: number; // Margin from bottom edge
}

interface GestureContext extends Record<string, unknown> {
  startY: number;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  snapPoint = 70,
  enableBackdropDismiss = true,
  enableSwipeToDismiss = true,
  backgroundColor = '#FFFFFF',
  handleColor = 'rgba(0, 0, 0, 0.2)',
  horizontalMargin = 0,
  bottomMargin = 0,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const translateY = useSharedValue(screenHeight);
  const backdropOpacity = useSharedValue(0);

  // Animation configs - iOS-like spring feel
  const springConfig = {
    damping: 65,
    stiffness: 400,
    mass: 0.8,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  };

  // Open/close animations
  useEffect(() => {
    if (visible) {
      // Show modal immediately
      setIsModalVisible(true);
      // Open animation
      translateY.value = withSpring(0, springConfig);
      backdropOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else if (isModalVisible) {
      // Close animation with callback to hide modal
      translateY.value = withSpring(screenHeight, springConfig, (finished) => {
        if (finished) {
          runOnJS(setIsModalVisible)(false);
        }
      });
      backdropOpacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [visible]);

  // Animated styles
  const bottomSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // Pan gesture handler for swipe to dismiss
  const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, GestureContext>({
    onStart: (_, context) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      if (event.translationY > 0) {
        translateY.value = context.startY + event.translationY;
      }
    },
    onEnd: (event) => {
      const shouldClose = event.translationY > 100 || event.velocityY > 500;
      
      if (shouldClose && enableSwipeToDismiss) {
        translateY.value = withSpring(screenHeight, springConfig, (finished) => {
          if (finished) {
            runOnJS(onClose)();
          }
        });
        backdropOpacity.value = withTiming(0, {
          duration: 250,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      } else {
        // Snap back to open position
        translateY.value = withSpring(0, springConfig);
      }
    },
  });

  const handleBackdropPress = () => {
    if (enableBackdropDismiss) {
      onClose();
    }
  };

  if (!isModalVisible) return null;

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            },
            backdropStyle,
          ]}
        />
        
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet */}
        <PanGestureHandler onGestureEvent={onGestureEvent} enabled={enableSwipeToDismiss}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                bottom: bottomMargin,
                left: horizontalMargin,
                right: horizontalMargin,
                height: `${snapPoint}%`,
                backgroundColor: backgroundColor,
                borderRadius: horizontalMargin > 0 ? 48 : undefined,
                borderTopLeftRadius: horizontalMargin > 0 ? 48 : 16,
                borderTopRightRadius: horizontalMargin > 0 ? 48 : 16,
                borderBottomLeftRadius: horizontalMargin > 0 ? 48 : undefined,
                borderBottomRightRadius: horizontalMargin > 0 ? 48 : undefined,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: -8 },
                shadowOpacity: 0.25,
                shadowRadius: 24,
                elevation: 25,
              },
              bottomSheetStyle,
            ]}
          >
            {/* Drag handle */}
            <View
              style={{
                width: 36,
                height: 5,
                backgroundColor: handleColor,
                borderRadius: 3,
                alignSelf: 'center',
                marginTop: 8,
                marginBottom: 12,
                opacity: 0.6,
              }}
            />
            
            {/* Content */}
            <View style={{ flex: 1 }}>
              {children}
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
}; 