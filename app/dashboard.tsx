import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { DeviceMotion } from 'expo-sensors';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, LongPressGestureHandler, PanGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { DraggableWidget } from '../components/DraggableWidget';
import {
    CalendarWidget,
    CohortContactsWidget,
    HabitWidget,
    InspireWidget,
    JournalWidget,
    MinaraWidget,
    TestWidget
} from '../components/WidgetComponents';
import { widgetStyles } from '../styles/widgetStyles';
import {
    findFirstAvailablePosition,
    getDefaultLayout,
    getWidgetGridSize,
    rearrangeWidgets
} from '../utils/gridUtils';

export default function Dashboard() {
  const params = useLocalSearchParams();
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [showBackgroundSelectorInSettings, setShowBackgroundSelectorInSettings] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('pattern'); // 'pattern' or 'plain'
  const [widgetPositions, setWidgetPositions] = useState(() => getDefaultLayout());

  // Enhanced parallax effect state with multiple layers
  const [deviceMotion, setDeviceMotion] = useState({ x: 0, y: 0 });
  const backgroundX = useSharedValue(0);
  const backgroundY = useSharedValue(0);
  const backgroundLayer2X = useSharedValue(0);
  const backgroundLayer2Y = useSharedValue(0);
  const backgroundLayer3X = useSharedValue(0);
  const backgroundLayer3Y = useSharedValue(0);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Theme transition animation
  const themeTransition = useSharedValue(isDarkMode ? 1 : 0);

  // Settings modal animation
  const settingsTranslateY = useSharedValue(0);
  const settingsScale = useSharedValue(0.95);
  const settingsOpacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  const backdropBlur = useSharedValue(0);
  // Background scale animation for card presentation effect
  const backgroundScale = useSharedValue(1);
  const backgroundTranslateY = useSharedValue(0);

  // 1. Add animation guard state at the top of Dashboard
  const [isSettingsAnimating, setIsSettingsAnimating] = useState(false);

  // Settings button animation values (copying journal + button pattern)
  const settingsButtonScale = useSharedValue(1);
  const settingsButtonOpacity = useSharedValue(1);

  useEffect(() => {
    themeTransition.value = withTiming(isDarkMode ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Apple-like easing
    });
  }, [isDarkMode]);

  // Enhanced device motion parallax effect with multiple layers
  useEffect(() => {
    let subscription: any = null;
    let lastUpdate = 0;
    
    const startDeviceMotion = async () => {
      try {
        // Request permission for device motion (iOS)
        const { status } = await DeviceMotion.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Device motion permission not granted');
          return;
        }

        // Set update interval to 16ms for 60fps smooth updates
        DeviceMotion.setUpdateInterval(16);

        subscription = DeviceMotion.addListener((motionData) => {
          const now = Date.now();
          // Throttle updates to prevent overwhelming the animation system
          if (now - lastUpdate < 8) return; // ~120fps max for ultra-smooth motion
          lastUpdate = now;

          if (motionData.rotation) {
            // Enhanced parallax with multiple layers and reduced sensitivity
            const maxOffset = 25; // Reduced from 50 for less dramatic effect
            const sensitivity = 60; // Reduced from 120 for less sensitive movement
            
            // Calculate new positions with enhanced smoothing
            const targetX = Math.max(-maxOffset, Math.min(maxOffset, motionData.rotation.gamma * sensitivity));
            const targetY = Math.max(-maxOffset, Math.min(maxOffset, motionData.rotation.beta * sensitivity));
            
            // Layer 1 (main background) - full movement
            backgroundX.value = withTiming(targetX, {
              duration: 100,
              easing: Easing.out(Easing.quad),
            });
            
            backgroundY.value = withTiming(targetY, {
              duration: 100,
              easing: Easing.out(Easing.quad),
            });

            // Layer 2 - 60% movement speed for depth
            backgroundLayer2X.value = withTiming(targetX * 0.6, {
              duration: 120,
              easing: Easing.out(Easing.quad),
            });
            
            backgroundLayer2Y.value = withTiming(targetY * 0.6, {
              duration: 120,
              easing: Easing.out(Easing.quad),
            });

            // Layer 3 - 30% movement speed for even more depth
            backgroundLayer3X.value = withTiming(targetX * 0.3, {
              duration: 150,
              easing: Easing.out(Easing.quad),
            });
            
            backgroundLayer3Y.value = withTiming(targetY * 0.3, {
              duration: 150,
              easing: Easing.out(Easing.quad),
            });
          }
        });
      } catch (error) {
        console.log('Error setting up device motion:', error);
      }
    };

    startDeviceMotion();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [backgroundX, backgroundY, backgroundLayer2X, backgroundLayer2Y, backgroundLayer3X, backgroundLayer3Y]);

  // Update theme when system changes
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF', // Pure white for light mode
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#A0A0A0' : '#666666',
    tertiaryText: isDarkMode ? '#808080' : '#777777',
    cardBorder: isDarkMode ? '#2C2C2E' : 'rgba(0,0,0,0.08)', // Slightly stronger border for light mode
    cardShadow: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', // Subtle shadow for cards
    redDot: '#FF3B30',
    prayerCompleted: '#007AFF',
    prayerPending: isDarkMode ? '#48484A' : '#D1D1D6',
    accent: '#007AFF',
    accentSubtle: isDarkMode ? '#1A2332' : '#F0F4FF',
    habitRing: '#007AFF',
    habitBackground: isDarkMode ? '#2C2C2E' : '#E5E5EA',
    journalGradient: isDarkMode ? '#2C2C2E' : '#007AFF',
    journalBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    cohortAccent: '#007AFF',
    cohortBackground: isDarkMode ? 'rgba(0, 122, 255, 0.10)' : 'rgba(0, 122, 255, 0.08)',
    cohortBorder: isDarkMode ? 'rgba(0, 122, 255, 0.25)' : 'rgba(0, 122, 255, 0.18)',
    resizeHandle: '#007AFF',
  };

  const animatedColors = {
    background: useAnimatedStyle(() => ({
      backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
    })),
  };

  // Enhanced animated background styles with multiple layers
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: backgroundX.value },
        { translateY: backgroundY.value + backgroundTranslateY.value },
        { scale: backgroundScale.value * 1.1 }, // Slight scale to prevent edge visibility
      ],
    };
  });

  const animatedBackgroundLayer2Style = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: backgroundLayer2X.value },
        { translateY: backgroundLayer2Y.value + backgroundTranslateY.value },
        { scale: backgroundScale.value * 1.05 },
      ],
    };
  });

  const animatedBackgroundLayer3Style = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: backgroundLayer3X.value },
        { translateY: backgroundLayer3Y.value + backgroundTranslateY.value },
        { scale: backgroundScale.value * 1.02 },
      ],
    };
  });

  // Main content container animation for card presentation
  const animatedMainContent = useAnimatedStyle(() => ({
    transform: [
      { scale: backgroundScale.value },
      { translateY: backgroundTranslateY.value }
    ],
  }));

  // Clean, minimal settings modal animation
  const animatedSettingsModal = useAnimatedStyle(() => ({
    transform: [
      { translateY: settingsTranslateY.value },
      { scale: settingsScale.value }
    ],
    opacity: settingsOpacity.value,
  }));

  // Animated backdrop styles for premium feel
  const animatedBackdropBlur = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const animatedBackdropOverlay = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * 0.6, // Slightly less opacity for overlay
  }));

  // Floating elements animation for enhanced parallax effect
  const animatedFloatingElements = useAnimatedStyle(() => ({
    transform: [
      { translateX: backgroundX.value * 3.0 },
      { translateY: backgroundY.value * 3.0 },
    ],
  }));

  // Drag gesture handler for buttery smooth iOS-style dismiss
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: { startY: number }) => {
      context.startY = settingsTranslateY.value;
    },
    onActive: (event, context: { startY: number }) => {
      const newTranslateY = context.startY + event.translationY;
      // Only allow downward dragging
      if (newTranslateY >= 0) {
        settingsTranslateY.value = newTranslateY;
        
        // Interactive scale feedback during drag
        const dragProgress = Math.min(newTranslateY / (screenHeight * 0.3), 1);
        const scaleValue = 1 - (dragProgress * 0.04); // Scale down slightly as dragged
        settingsScale.value = Math.max(scaleValue, 0.96);
        
        // Scale background back to normal as modal is dismissed
        const backgroundScaleValue = 0.85 + (dragProgress * 0.15); // Scale from 0.85 to 1.0 (matching journal)
        backgroundScale.value = Math.min(backgroundScaleValue, 1);
        backgroundTranslateY.value = -35 + (dragProgress * 35); // Move from -35 to 0
        
        // Fade backdrop based on drag progress
        const backdropValue = 1 - (dragProgress * 0.5);
        backdropOpacity.value = Math.max(backdropValue, 0.5);
      }
    },
    onEnd: (event) => {
      const shouldDismiss = event.translationY > 100 || event.velocityY > 500;
      
      if (shouldDismiss) {
        // Ultra-smooth spring dismiss animation
        settingsTranslateY.value = withSpring(screenHeight, {
          damping: 35,
          mass: 0.8,
          stiffness: 250,
          overshootClamping: true,
        }, () => {
          runOnJS(setIsSettingsVisible)(false);
        });
        // Scale down on dismiss
        settingsScale.value = withSpring(0.94, {
          damping: 32,
          mass: 0.7,
          stiffness: 250,
          overshootClamping: true,
        });
        settingsOpacity.value = withSpring(0, {
          damping: 30,
          mass: 0.6,
          stiffness: 300,
          overshootClamping: true,
        });
        // Background scale back to normal
        backgroundScale.value = withSpring(1, {
          damping: 30,
          mass: 0.7,
          stiffness: 200,
          overshootClamping: true,
        });
        backgroundTranslateY.value = withSpring(0, {
          damping: 30,
          mass: 0.7,
          stiffness: 200,
          overshootClamping: true,
        });
        // Backdrop fade-out on dismiss
        backdropOpacity.value = withSpring(0, {
          damping: 32,
          mass: 0.7,
          stiffness: 280,
          overshootClamping: true,
        });
        backdropBlur.value = withSpring(0, {
          damping: 35,
          mass: 0.8,
          stiffness: 250,
          overshootClamping: true,
        });
        // Settings button restore (copying journal pattern)
        settingsButtonOpacity.value = withSpring(1, {
          damping: 30,
          mass: 0.6,
          stiffness: 300,
          overshootClamping: true,
        });
      } else {
        // Buttery snap back with perfect spring feel
        settingsTranslateY.value = withSpring(0, {
          damping: 25,
          mass: 0.7,
          stiffness: 250,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        });
        // Scale back to full size
        settingsScale.value = withSpring(1, {
          damping: 22,
          mass: 0.6,
          stiffness: 280,
          overshootClamping: false,
        });
        settingsOpacity.value = withSpring(1, {
          damping: 20,
          mass: 0.5,
          stiffness: 300,
          overshootClamping: false,
        });
        // Background scale back to card presentation state
        backgroundScale.value = withSpring(0.85, {
          damping: 35,
          mass: 1.2,
          stiffness: 200,
          overshootClamping: true,
        });
        backgroundTranslateY.value = withSpring(-35, {
          damping: 35,
          mass: 1.2,
          stiffness: 200,
          overshootClamping: true,
        });
        // Backdrop restore on snap back
        backdropOpacity.value = withSpring(1, {
          damping: 18,
          mass: 0.5,
          stiffness: 320,
          overshootClamping: false,
        });
        backdropBlur.value = withSpring(1, {
          damping: 20,
          mass: 0.6,
          stiffness: 280,
          overshootClamping: false,
        });
      }
    },
  });

  // Clean, sophisticated settings functions with ultra-buttery spring animations
  const openSettings = useCallback(() => {
    if (isSettingsAnimating) return;
    setIsSettingsAnimating(true);
    
    // Apple-native button press animation - copying journal + button pattern
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    settingsButtonScale.value = withSpring(0.95, {
      damping: 60,
      stiffness: 300,
      mass: 0.4,
    }, () => {
      settingsButtonScale.value = withSpring(1, {
        damping: 60,
        stiffness: 300,
        mass: 0.4,
      });
    });
    
    setIsSettingsVisible(true);
    settingsTranslateY.value = screenHeight;
    settingsScale.value = 0.94;
    settingsOpacity.value = 0;
    backdropOpacity.value = 0;
    backdropBlur.value = 0;
    backgroundScale.value = 1;
    backgroundTranslateY.value = 0;
    
    // Faster spring configuration for modal (copying journal pattern)
    const modalSpring = {
      damping: 280,
      stiffness: 800,
      mass: 2,
    };
    
    // Faster fluid spring for background scaling (copying journal pattern)
    const backgroundSpring = {
      damping: 30,
      stiffness: 200,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
    };
    
    // Modal and background use different optimized timings
    settingsTranslateY.value = withSpring(0, modalSpring, () => {
      runOnJS(setIsSettingsAnimating)(false);
    });
    settingsScale.value = withSpring(1, modalSpring);
    settingsOpacity.value = withSpring(1, modalSpring);
    backgroundScale.value = withSpring(0.85, backgroundSpring);
    backgroundTranslateY.value = withSpring(-35, backgroundSpring);
    
    // Quicker overlay timing to match spring speed (copying journal pattern)
    backdropOpacity.value = withTiming(1, { 
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) // Smooth ease-out
    });
    backdropBlur.value = withTiming(1, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    
    // Quicker button fade (copying journal pattern)
    settingsButtonOpacity.value = withTiming(0, {
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
  }, [screenHeight, isSettingsAnimating]);

  const closeSettings = useCallback(() => {
    if (isSettingsAnimating) return;
    setIsSettingsAnimating(true);
    
    // Faster spring configuration for modal dismissal (copying journal pattern)
    const modalSpring = {
      damping: 320,
      stiffness: 700,
      mass: 2.5,
    };
    
    // Faster fluid spring for background scaling return (copying journal pattern)
    const backgroundSpring = {
      damping: 30,
      stiffness: 200,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
    };
    
    // Modal and background use different optimized timings
    settingsTranslateY.value = withSpring(screenHeight, modalSpring, () => {
      runOnJS(setIsSettingsVisible)(false);
      runOnJS(setIsSettingsAnimating)(false);
    });
    settingsScale.value = withSpring(0.94, modalSpring);
    settingsOpacity.value = withSpring(0, modalSpring);
    backgroundScale.value = withSpring(1, backgroundSpring);
    backgroundTranslateY.value = withSpring(0, backgroundSpring);
    
    // Quicker overlay fade to match spring speed (copying journal pattern)
    backdropOpacity.value = withTiming(0, { 
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    backdropBlur.value = withTiming(0, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    
    // Quicker button restore (copying journal pattern)
    settingsButtonOpacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [screenHeight, isSettingsAnimating]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode(!isDarkMode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isDarkMode]);

  const openBackgroundSelector = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowBackgroundSelectorInSettings(true);
  }, []);

  const closeBackgroundSelector = useCallback(() => {
    setShowBackgroundSelectorInSettings(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleWebsitePress = useCallback(() => {
    Linking.openURL('https://your-website.com');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  // Settings button - Apple-native animation copying journal + button pattern
  const animatedSettingsButton = useAnimatedStyle(() => ({
    transform: [{ scale: settingsButtonScale.value }],
    opacity: settingsButtonOpacity.value,
  }));

  const handleSettingsPress = useCallback(() => {
    // Direct call with no button animation interference
    openSettings();
  }, [openSettings]);

  // Handle long press to enter edit mode
  const handleLongPress = useCallback(() => {
    if (!isEditMode) {
      setIsEditMode(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [isEditMode]);

  // Handle tap to exit edit mode
  const handleTapToExit = useCallback(() => {
    if (isEditMode) {
      setIsEditMode(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isEditMode]);

  // Background gesture handlers
  const handleBackgroundLongPress = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      handleLongPress();
    }
  };

  const handleBackgroundTap = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      handleTapToExit();
    }
  };

  // Handle widget position change with auto-rearrangement
  const handleWidgetPositionChange = useCallback((id: string, newGridX: number, newGridY: number) => {
    setWidgetPositions(prevPositions => {
      const newPositions = rearrangeWidgets(id, newGridX, newGridY, prevPositions);
      return newPositions;
    });
  }, []);

  // Handle live rearrangement during drag with throttling
  const handleLiveRearrange = useCallback((id: string, newGridX: number, newGridY: number) => {
    setWidgetPositions(prevPositions => {
      // Only update if position actually changed
      const currentWidget = prevPositions.find(w => w.id === id);
      if (currentWidget && currentWidget.gridX === newGridX && currentWidget.gridY === newGridY) {
        return prevPositions;
      }

      const newPositions = rearrangeWidgets(id, newGridX, newGridY, prevPositions);
      return newPositions;
    });
  }, []);

  // Handle widget resize
  const handleWidgetResize = useCallback((id: string, newSize: 'small' | 'medium' | 'large') => {
    const widget = widgetPositions.find(w => w.id === id);
    if (!widget) return;

    const newGridSize = getWidgetGridSize(newSize);
    const newPos = findFirstAvailablePosition(newGridSize.width, newGridSize.height, widgetPositions, id);

    setWidgetPositions(prev => 
      prev.map(pos => 
        pos.id === id 
          ? { ...pos, size: newSize, gridX: newPos.x, gridY: newPos.y, width: newGridSize.width, height: newGridSize.height }
          : pos
      )
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [widgetPositions]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {params.noAnim === '1' && (
        <Stack.Screen options={{ animation: 'none' }} />
      )}
      <View style={[{ flex: 1 }, { backgroundColor: colors.background }]}>
        
        {/* Enhanced Multi-Layer Parallax Background */}
        
        {selectedBackground === 'pattern' && (
          <>
            {/* Background Layer 3 - Slowest movement (30%) */}
            <Animated.View style={[
              {
                position: 'absolute',
                top: -80,
                left: -80,
                right: -80,
                bottom: -80,
                opacity: isDarkMode ? 0.08 : 0.12,
                zIndex: 1,
              },
              animatedBackgroundLayer3Style
            ]}>
              <ImageBackground
                source={require('../assets/images/cc.patterns-01.png')}
                style={{
                  width: screenWidth + 160,
                  height: screenHeight + 160,
                }}
                resizeMode="cover"
              />
              <BlurView
                intensity={25}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </Animated.View>

            {/* Background Layer 2 - Medium movement (60%) */}
            <Animated.View style={[
              {
                position: 'absolute',
                top: -60,
                left: -60,
                right: -60,
                bottom: -60,
                opacity: isDarkMode ? 0.15 : 0.20,
                zIndex: 2,
              },
              animatedBackgroundLayer2Style
            ]}>
              <ImageBackground
                source={require('../assets/images/cc.patterns-01.png')}
                style={{
                  width: screenWidth + 120,
                  height: screenHeight + 120,
                }}
                resizeMode="cover"
              />
              <BlurView
                intensity={18}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </Animated.View>

            {/* Background Layer 1 - Full movement (100%) */}
            <Animated.View style={[
              {
                position: 'absolute',
                top: -50,
                left: -50,
                right: -50,
                bottom: -50,
                opacity: isDarkMode ? 0.25 : 0.35,
                zIndex: 3,
              },
              animatedBackgroundStyle
            ]}>
              <ImageBackground
                source={require('../assets/images/cc.patterns-01.png')}
                style={{
                  width: screenWidth + 100,
                  height: screenHeight + 100,
                }}
                resizeMode="cover"
              />
              <BlurView
                intensity={12}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            </Animated.View>

            {/* Floating Elements Layer - Enhanced movement (150%) */}
            <Animated.View style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 4,
                pointerEvents: 'none',
              },
              animatedFloatingElements
            ]}>
              {/* Subtle floating dots */}
              <View style={{
                position: 'absolute',
                top: '20%',
                left: '15%',
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              }} />
              <View style={{
                position: 'absolute',
                top: '60%',
                right: '20%',
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
              }} />
              <View style={{
                position: 'absolute',
                top: '40%',
                left: '70%',
                width: 3,
                height: 3,
                borderRadius: 1.5,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.06)',
              }} />
              <View style={{
                position: 'absolute',
                bottom: '30%',
                left: '25%',
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.04)',
              }} />
            </Animated.View>
          </>
        )}

        {/* Background gesture area */}
        <LongPressGestureHandler onHandlerStateChange={handleBackgroundLongPress} minDurationMs={500}>
          <TapGestureHandler onHandlerStateChange={handleBackgroundTap} enabled={isEditMode}>
            <Animated.View style={[{ flex: 1, zIndex: 10 }, animatedMainContent]}>
              <ScrollView 
                style={widgetStyles.mainScrollView}
                contentContainerStyle={{
                  ...widgetStyles.scrollContent,
                  paddingBottom: 120,
                }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={!isEditMode}
                bounces={!isEditMode}
              >
                {/* Header with day and date */}
                <View style={widgetStyles.header}>
                  <View style={widgetStyles.daySection}>
                    <Text style={[widgetStyles.dayText, { color: colors.primaryText }]}>Fri</Text>
                    <View style={[widgetStyles.redDot, { backgroundColor: colors.redDot }]} />
                  </View>
                  <View style={widgetStyles.headerRight}>
                    <View style={widgetStyles.dateSection}>
                      <Text style={[widgetStyles.dateText, { color: colors.secondaryText }]}>December 9</Text>
                      <Text style={[widgetStyles.yearText, { color: colors.tertiaryText }]}>2024</Text>
                    </View>
                    <Animated.View style={animatedSettingsButton}>
                      <TouchableOpacity
                        style={[
                          widgetStyles.themeToggle,
                          {
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.cardBorder,
                            shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
                          }
                        ]}
                        onPress={handleSettingsPress}
                        activeOpacity={0.7}
                      >
                        <Text style={widgetStyles.themeIcon}>⚙️</Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                </View>

                {/* Greeting and Summary */}
                <View style={widgetStyles.summarySection}>
                  <Text style={[widgetStyles.greetingText, { color: colors.primaryText }]}>السلام عليكم</Text>
                  <Text style={[widgetStyles.summaryText, { color: colors.secondaryText }]}>
                    You have 📅 <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>3 upcoming events</Text>, 💬 <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>2 new messages</Text> and 🌟 <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>4 daily habits</Text> awaiting your attention. <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>Let's crush it! 💪</Text>
                  </Text>
                </View>

                {/* Stats Row */}
                <View style={widgetStyles.statsRow}>
                  <Text style={[widgetStyles.statItem, { color: colors.secondaryText }]}>📅 <Text style={[widgetStyles.statNumber, { color: colors.primaryText }]}>3</Text> events</Text>
                  <Text style={[widgetStyles.statItem, { color: colors.secondaryText }]}>💬 <Text style={[widgetStyles.statNumber, { color: colors.primaryText }]}>2</Text> messages</Text>
                  <Text style={[widgetStyles.statItem, { color: colors.secondaryText }]}>🌟 <Text style={[widgetStyles.statNumber, { color: colors.primaryText }]}>4</Text> habits</Text>
                </View>

                {/* Widget Container */}
                <View style={widgetStyles.widgetContainer}>

                  {/* Render widgets dynamically based on widgetPositions */}
                  {widgetPositions.map((position) => {
                    let WidgetComponent;
                    switch (position.id) {
                      case 'events':
                        WidgetComponent = CohortContactsWidget;
                        break;
                      case 'messages':
                        WidgetComponent = MinaraWidget;
                        break;
                      case 'habits':
                        WidgetComponent = CalendarWidget;
                        break;
                      case 'askMinara':
                        WidgetComponent = InspireWidget;
                        break;
                      case 'prayer':
                        WidgetComponent = HabitWidget;
                        break;
                      case 'journal':
                        WidgetComponent = JournalWidget;
                        break;
                      case 'test':
                        WidgetComponent = TestWidget;
                        break;
                      default:
                        return null;
                    }

                    return (
                      <DraggableWidget 
                        key={position.id}
                        widgetId={position.id} 
                        position={position} 
                        allPositions={widgetPositions} 
                        onPositionChange={handleWidgetPositionChange} 
                        onResize={handleWidgetResize} 
                        onLiveRearrange={handleLiveRearrange} 
                        isEditMode={isEditMode} 
                        isDarkMode={isDarkMode} 
                        colors={colors}
                        parallaxX={backgroundX}
                        parallaxY={backgroundY}
                      >
                        <WidgetComponent colors={colors} isDarkMode={isDarkMode} />
                      </DraggableWidget>
                    );
                  })}

                  
                </View>
              </ScrollView>
            </Animated.View>
          </TapGestureHandler>
        </LongPressGestureHandler>

        {/* Settings Modal */}
        <Modal
          visible={isSettingsVisible}
          transparent={true}
          animationType="none"
          onRequestClose={closeSettings}
        >
          <View style={{ 
            flex: 1, 
            justifyContent: 'flex-end',
          }}>
            {/* Frosty blur background */}
            <Animated.View style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
              animatedBackdropBlur
            ]}>
              <BlurView
                intensity={100}
                tint={isDarkMode ? 'dark' : 'light'}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: isDarkMode
                    ? 'rgba(30, 80, 200, 0.10)'
                    : 'rgba(30, 80, 200, 0.18)',
                  opacity: 0.8,
                }}
              />
            </Animated.View>
            
            {/* Subtle overlay for depth - reduced opacity for frostier look */}
            <Animated.View style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.08)',
              },
              animatedBackdropOverlay
            ]} />
            
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={closeSettings}
              activeOpacity={1}
            />
            
            <PanGestureHandler onGestureEvent={panGestureHandler}>
              <Animated.View style={[
                {
                  backgroundColor: colors.background,
                  borderTopLeftRadius: 32,
                  borderTopRightRadius: 32,
                  height: screenHeight * 0.85,
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: -4 },
                  shadowOpacity: isDarkMode ? 0.3 : 0.15,
                  shadowRadius: 20,
                  elevation: 20,
                },
                animatedSettingsModal
              ]}>
                {/* Drag Handle */}
                <View style={{
                  width: 40,
                  height: 4,
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
                  borderRadius: 2,
                  alignSelf: 'center',
                  marginTop: 12,
                  marginBottom: 8,
                }} />

                {/* Header */}
                <View style={{
                  paddingTop: 20,
                  paddingHorizontal: 20,
                  paddingBottom: 20,
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.cardBorder,
                  backgroundColor: colors.background,
                }}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    {showBackgroundSelectorInSettings && (
                      <TouchableOpacity
                        onPress={closeBackgroundSelector}
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: isDarkMode ? 0 : 0.5,
                          borderColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.08)',
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={{
                          fontSize: 16,
                          color: colors.secondaryText,
                          fontWeight: '600',
                        }}>‹</Text>
                      </TouchableOpacity>
                    )}
                    <Text style={{
                      fontSize: 34,
                      fontWeight: '700',
                      color: colors.primaryText,
                      letterSpacing: -0.8,
                      flex: showBackgroundSelectorInSettings ? 1 : 0,
                      textAlign: showBackgroundSelectorInSettings ? 'center' : 'left',
                      marginLeft: showBackgroundSelectorInSettings ? -30 : 0,
                    }}>
                      {showBackgroundSelectorInSettings ? 'Appearance' : 'Settings'}
                    </Text>
                    <TouchableOpacity
                      onPress={closeSettings}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: isDarkMode ? 0 : 0.5,
                        borderColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.08)',
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={{
                        fontSize: 16,
                        color: colors.secondaryText,
                        fontWeight: '600',
                      }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView 
                  style={{ flex: 1 }}
                  contentContainerStyle={{ paddingBottom: 40 }}
                  showsVerticalScrollIndicator={false}
                >
                  {showBackgroundSelectorInSettings ? (
                    // Background Selector Content
                    <View style={{ padding: 20 }}>
                      {/* Theme Toggle */}
                      <View style={{ marginBottom: 32 }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: colors.primaryText,
                          marginBottom: 16,
                          letterSpacing: -0.2,
                        }}>
                          Theme
                        </Text>
                        
                        <View style={{
                          flexDirection: 'row',
                          backgroundColor: colors.cardBackground,
                          borderRadius: 16,
                          padding: 4,
                          borderWidth: isDarkMode ? 0.5 : 1,
                          borderColor: colors.cardBorder,
                        }}>
                          <TouchableOpacity
                            onPress={() => {
                              setIsDarkMode(false);
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            style={{
                              flex: 1,
                              paddingVertical: 12,
                              borderRadius: 12,
                              backgroundColor: !isDarkMode ? colors.accent : 'transparent',
                              alignItems: 'center',
                            }}
                            activeOpacity={0.8}
                          >
                            <Text style={{
                              fontSize: 15,
                              fontWeight: '600',
                              color: !isDarkMode ? '#FFFFFF' : colors.secondaryText,
                              letterSpacing: -0.1,
                            }}>
                              ☀️ Light
                            </Text>
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            onPress={() => {
                              setIsDarkMode(true);
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                            style={{
                              flex: 1,
                              paddingVertical: 12,
                              borderRadius: 12,
                              backgroundColor: isDarkMode ? colors.accent : 'transparent',
                              alignItems: 'center',
                            }}
                            activeOpacity={0.8}
                          >
                            <Text style={{
                              fontSize: 15,
                              fontWeight: '600',
                              color: isDarkMode ? '#FFFFFF' : colors.secondaryText,
                              letterSpacing: -0.1,
                            }}>
                              🌙 Dark
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Background Options */}
                      <View>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: colors.primaryText,
                          marginBottom: 16,
                          letterSpacing: -0.2,
                        }}>
                          Background Style
                        </Text>
                        
                        <View style={{
                          flexDirection: 'row',
                          gap: 16,
                        }}>
                          {/* Pattern Background */}
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedBackground('pattern');
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            }}
                            style={{
                              flex: 1,
                              aspectRatio: 0.7,
                              borderRadius: 24,
                              overflow: 'hidden',
                              borderWidth: selectedBackground === 'pattern' ? 3 : 2,
                              borderColor: selectedBackground === 'pattern' ? colors.accent : colors.cardBorder,
                              shadowColor: '#000000',
                              shadowOffset: { width: 0, height: 4 },
                              shadowOpacity: 0.1,
                              shadowRadius: 8,
                              elevation: 4,
                            }}
                            activeOpacity={0.9}
                          >
                            <View style={{
                              flex: 1,
                              backgroundColor: colors.background,
                              position: 'relative',
                            }}>
                              {/* Pattern preview */}
                              <View style={{
                                position: 'absolute',
                                top: -20,
                                left: -20,
                                right: -20,
                                bottom: -20,
                                opacity: isDarkMode ? 0.3 : 0.4,
                              }}>
                                <ImageBackground
                                  source={require('../assets/images/cc.patterns-01.png')}
                                  style={{ flex: 1 }}
                                  resizeMode="cover"
                                />
                              </View>
                              {/* Mini widgets preview */}
                              <View style={{
                                position: 'absolute',
                                bottom: 20,
                                left: 12,
                                right: 12,
                                flexDirection: 'row',
                                gap: 8,
                              }}>
                                <View style={{
                                  flex: 1,
                                  height: 30,
                                  backgroundColor: colors.cardBackground,
                                  borderRadius: 8,
                                  opacity: 0.8,
                                }} />
                                <View style={{
                                  flex: 1,
                                  height: 30,
                                  backgroundColor: colors.cardBackground,
                                  borderRadius: 8,
                                  opacity: 0.8,
                                }} />
                              </View>
                              <Text style={{
                                position: 'absolute',
                                bottom: 8,
                                alignSelf: 'center',
                                fontSize: 12,
                                fontWeight: '600',
                                color: colors.primaryText,
                                textAlign: 'center',
                              }}>
                                Pattern
                              </Text>
                            </View>
                          </TouchableOpacity>

                          {/* Plain Background */}
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedBackground('plain');
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            }}
                            style={{
                              flex: 1,
                              aspectRatio: 0.7,
                              borderRadius: 24,
                              overflow: 'hidden',
                              borderWidth: selectedBackground === 'plain' ? 3 : 2,
                              borderColor: selectedBackground === 'plain' ? colors.accent : colors.cardBorder,
                              shadowColor: '#000000',
                              shadowOffset: { width: 0, height: 4 },
                              shadowOpacity: 0.1,
                              shadowRadius: 8,
                              elevation: 4,
                            }}
                            activeOpacity={0.9}
                          >
                            <View style={{
                              flex: 1,
                              backgroundColor: colors.background,
                              position: 'relative',
                            }}>
                              {/* Mini widgets preview */}
                              <View style={{
                                position: 'absolute',
                                bottom: 20,
                                left: 12,
                                right: 12,
                                flexDirection: 'row',
                                gap: 8,
                              }}>
                                <View style={{
                                  flex: 1,
                                  height: 30,
                                  backgroundColor: colors.cardBackground,
                                  borderRadius: 8,
                                  opacity: 0.8,
                                }} />
                                <View style={{
                                  flex: 1,
                                  height: 30,
                                  backgroundColor: colors.cardBackground,
                                  borderRadius: 8,
                                  opacity: 0.8,
                                }} />
                              </View>
                              <Text style={{
                                position: 'absolute',
                                bottom: 8,
                                alignSelf: 'center',
                                fontSize: 12,
                                fontWeight: '600',
                                color: colors.primaryText,
                                textAlign: 'center',
                              }}>
                                Plain
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : (
                    // Main Settings Content
                    <>
                      {/* Profile Section */}
                      <View style={{
                        paddingHorizontal: 20,
                        paddingVertical: 32,
                        borderBottomWidth: 0.5,
                        borderBottomColor: colors.cardBorder,
                      }}>
                        <View style={{
                          backgroundColor: colors.cardBackground,
                          borderRadius: 24,
                          padding: 24,
                          borderWidth: isDarkMode ? 0.5 : 1,
                          borderColor: colors.cardBorder,
                          shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: isDarkMode ? 0.05 : 0.08,
                          shadowRadius: 8,
                          elevation: isDarkMode ? 2 : 4,
                        }}>
                          <Text style={{
                            fontSize: 24,
                            fontWeight: '700',
                            color: colors.primaryText,
                            marginBottom: 8,
                            letterSpacing: -0.4,
                          }}>
                            Your Name
                          </Text>
                          <Text style={{
                            fontSize: 16,
                            color: colors.secondaryText,
                            letterSpacing: -0.1,
                            marginBottom: 20,
                          }}>
                            your.email@example.com
                          </Text>
                          <TouchableOpacity style={{
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            backgroundColor: colors.accent,
                            borderRadius: 25,
                            alignSelf: 'flex-start',
                          }}>
                            <Text style={{
                              fontSize: 15,
                              fontWeight: '600',
                              color: '#FFFFFF',
                              letterSpacing: -0.1,
                            }}>
                              Edit Profile
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Settings Groups */}
                      <View style={{ paddingTop: 32 }}>
                        
                        {/* General Section */}
                        <View style={{ marginBottom: 32 }}>
                          <Text style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: colors.secondaryText,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            paddingHorizontal: 20,
                            marginBottom: 12,
                          }}>
                            General
                          </Text>
                          
                          <View style={{
                            backgroundColor: colors.cardBackground,
                            marginHorizontal: 20,
                            borderRadius: 24,
                            borderWidth: isDarkMode ? 0.5 : 1,
                            borderColor: colors.cardBorder,
                            shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDarkMode ? 0.05 : 0.08,
                            shadowRadius: 8,
                            elevation: isDarkMode ? 2 : 4,
                          }}>
                            {/* Preferences */}
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 18,
                                paddingHorizontal: 20,
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.cardBorder,
                              }}
                              onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }}
                              activeOpacity={0.7}
                            >
                              <View style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                                borderWidth: isDarkMode ? 0 : 0.5,
                                borderColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.08)',
                              }}>
                                <Text style={{ fontSize: 16, color: colors.primaryText }}>⚙️</Text>
                              </View>
                              <Text style={{
                                fontSize: 17,
                                fontWeight: '400',
                                color: colors.primaryText,
                                flex: 1,
                                letterSpacing: -0.2,
                              }}>
                                Preferences
                              </Text>
                              <Text style={{
                                fontSize: 17,
                                color: colors.tertiaryText,
                                fontWeight: '400',
                              }}>
                                ›
                              </Text>
                            </TouchableOpacity>

                            {/* Appearance */}
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 18,
                                paddingHorizontal: 20,
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.cardBorder,
                              }}
                              onPress={openBackgroundSelector}
                              activeOpacity={0.7}
                            >
                              <View style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: colors.accent,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                              }}>
                                <Text style={{ fontSize: 16, color: '#FFFFFF' }}>{isDarkMode ? '☀️' : '🌙'}</Text>
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={{
                                  fontSize: 17,
                                  fontWeight: '400',
                                  color: colors.primaryText,
                                  letterSpacing: -0.2,
                                }}>
                                  Appearance
                                </Text>
                                <Text style={{
                                  fontSize: 13,
                                  color: colors.secondaryText,
                                  marginTop: 1,
                                  letterSpacing: -0.1,
                                }}>
                                  {isDarkMode ? 'Dark' : 'Light'}
                                </Text>
                              </View>
                              <Text style={{
                                fontSize: 17,
                                color: colors.tertiaryText,
                                fontWeight: '400',
                              }}>
                                ›
                              </Text>
                            </TouchableOpacity>

                            {/* Notifications */}
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 18,
                                paddingHorizontal: 20,
                              }}
                              onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }}
                              activeOpacity={0.7}
                            >
                              <View style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                                borderWidth: isDarkMode ? 0 : 0.5,
                                borderColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.08)',
                              }}>
                                <Text style={{ fontSize: 16, color: colors.primaryText }}>🔔</Text>
                              </View>
                              <Text style={{
                                fontSize: 17,
                                fontWeight: '400',
                                color: colors.primaryText,
                                flex: 1,
                                letterSpacing: -0.2,
                              }}>
                                Notifications
                              </Text>
                              <Text style={{
                                fontSize: 17,
                                color: colors.tertiaryText,
                                fontWeight: '400',
                              }}>
                                ›
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Privacy & Security Section */}
                        <View style={{ marginBottom: 32 }}>
                          <Text style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: colors.secondaryText,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            paddingHorizontal: 20,
                            marginBottom: 12,
                          }}>
                            Privacy & Security
                          </Text>
                          
                          <View style={{
                            backgroundColor: colors.cardBackground,
                            marginHorizontal: 20,
                            borderRadius: 24,
                            borderWidth: isDarkMode ? 0.5 : 1,
                            borderColor: colors.cardBorder,
                            shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDarkMode ? 0.05 : 0.08,
                            shadowRadius: 8,
                            elevation: isDarkMode ? 2 : 4,
                          }}>
                            {/* Privacy */}
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 18,
                                paddingHorizontal: 20,
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.cardBorder,
                              }}
                              onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }}
                              activeOpacity={0.7}
                            >
                              <View style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                                borderWidth: isDarkMode ? 0 : 0.5,
                                borderColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.08)',
                              }}>
                                <Text style={{ fontSize: 16, color: colors.primaryText }}>🔒</Text>
                              </View>
                              <Text style={{
                                fontSize: 17,
                                fontWeight: '400',
                                color: colors.primaryText,
                                flex: 1,
                                letterSpacing: -0.2,
                              }}>
                                Privacy
                              </Text>
                              <Text style={{
                                fontSize: 17,
                                color: colors.tertiaryText,
                                fontWeight: '400',
                              }}>
                                ›
                              </Text>
                            </TouchableOpacity>

                            {/* Data & Analytics */}
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 18,
                                paddingHorizontal: 20,
                              }}
                              onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }}
                              activeOpacity={0.7}
                            >
                              <View style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                                borderWidth: isDarkMode ? 0 : 0.5,
                                borderColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.08)',
                              }}>
                                <Text style={{ fontSize: 16, color: colors.primaryText }}>📊</Text>
                              </View>
                              <Text style={{
                                fontSize: 17,
                                fontWeight: '400',
                                color: colors.primaryText,
                                flex: 1,
                                letterSpacing: -0.2,
                              }}>
                                Data & Analytics
                              </Text>
                              <Text style={{
                                fontSize: 17,
                                color: colors.tertiaryText,
                                fontWeight: '400',
                              }}>
                                ›
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* Support Section */}
                        <View style={{ marginBottom: 32 }}>
                          <Text style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: colors.secondaryText,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            paddingHorizontal: 20,
                            marginBottom: 12,
                          }}>
                            Support
                          </Text>
                          
                          <View style={{
                            backgroundColor: colors.cardBackground,
                            marginHorizontal: 20,
                            borderRadius: 24,
                            borderWidth: isDarkMode ? 0.5 : 1,
                            borderColor: colors.cardBorder,
                            shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDarkMode ? 0.05 : 0.08,
                            shadowRadius: 8,
                            elevation: isDarkMode ? 2 : 4,
                          }}>
                            {/* Help & Support */}
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 18,
                                paddingHorizontal: 20,
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.cardBorder,
                              }}
                              onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }}
                              activeOpacity={0.7}
                            >
                              <View style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                                borderWidth: isDarkMode ? 0 : 0.5,
                                borderColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.08)',
                              }}>
                                <Text style={{ fontSize: 16, color: colors.primaryText }}>❓</Text>
                              </View>
                              <Text style={{
                                fontSize: 17,
                                fontWeight: '400',
                                color: colors.primaryText,
                                flex: 1,
                                letterSpacing: -0.2,
                              }}>
                                Help & Support
                              </Text>
                              <Text style={{
                                fontSize: 17,
                                color: colors.tertiaryText,
                                fontWeight: '400',
                              }}>
                                ›
                              </Text>
                            </TouchableOpacity>

                            {/* Visit Our Website */}
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 18,
                                paddingHorizontal: 20,
                                borderBottomWidth: 0.5,
                                borderBottomColor: colors.cardBorder,
                              }}
                              onPress={handleWebsitePress}
                              activeOpacity={0.7}
                            >
                              <View style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                                borderWidth: isDarkMode ? 0 : 0.5,
                                borderColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.08)',
                              }}>
                                <Text style={{ fontSize: 16, color: colors.primaryText }}>🌐</Text>
                              </View>
                              <Text style={{
                                fontSize: 17,
                                fontWeight: '400',
                                color: colors.primaryText,
                                flex: 1,
                                letterSpacing: -0.2,
                              }}>
                                Visit Our Website
                              </Text>
                              <Text style={{
                                fontSize: 17,
                                color: colors.tertiaryText,
                                fontWeight: '400',
                              }}>
                                ›
                              </Text>
                            </TouchableOpacity>

                            {/* About */}
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 18,
                                paddingHorizontal: 20,
                              }}
                              onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                              }}
                              activeOpacity={0.7}
                            >
                              <View style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16,
                                borderWidth: isDarkMode ? 0 : 0.5,
                                borderColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.08)',
                              }}>
                                <Text style={{ fontSize: 16, color: colors.primaryText }}>ℹ️</Text>
                              </View>
                              <Text style={{
                                fontSize: 17,
                                fontWeight: '400',
                                color: colors.primaryText,
                                flex: 1,
                                letterSpacing: -0.2,
                              }}>
                                About
                              </Text>
                              <Text style={{
                                fontSize: 17,
                                color: colors.tertiaryText,
                                fontWeight: '400',
                              }}>
                                ›
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* App Version */}
                        <View style={{
                          paddingHorizontal: 20,
                          paddingVertical: 16,
                          alignItems: 'center',
                        }}>
                          <Text style={{
                            fontSize: 13,
                            color: colors.tertiaryText,
                            letterSpacing: -0.1,
                          }}>
                            Version 1.0.0 (Build 1)
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </ScrollView>
              </Animated.View>
            </PanGestureHandler>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}