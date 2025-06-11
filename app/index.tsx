import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams } from 'expo-router';
import { DeviceMotion } from 'expo-sensors';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, LongPressGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { DraggableWidget } from '../components/DraggableWidget';
import {
    CalendarWidget,
    CohortContactsWidget,
    HabitWidget,
    JournalWidget,
    MinaraWidget,
    PrayerWidget
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
    background: isDarkMode ? '#000000' : '#EEEEEE',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#A0A0A0' : '#666666',
    tertiaryText: isDarkMode ? '#808080' : '#777777',
    cardBorder: isDarkMode ? '#2C2C2E' : 'rgba(0,0,0,0.05)',
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
      backgroundColor: isDarkMode ? '#000000' : '#EEEEEE',
    })),
  };

  // Enhanced animated background styles with multiple layers
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: backgroundX.value },
        { translateY: backgroundY.value },
        { scale: 1.1 }, // Slight scale to prevent edge visibility
      ],
    };
  });

  const animatedBackgroundLayer2Style = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: backgroundLayer2X.value },
        { translateY: backgroundLayer2Y.value },
        { scale: 1.05 },
      ],
    };
  });

  const animatedBackgroundLayer3Style = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: backgroundLayer3X.value },
        { translateY: backgroundLayer3Y.value },
        { scale: 1.02 },
      ],
    };
  });

  const toggleEditMode = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsEditMode(!isEditMode);
  }, [isEditMode]);

  // Theme toggle with enhanced animation
  const toggleButtonScale = useSharedValue(1);
  const toggleButtonRotation = useSharedValue(0);

  const toggleTheme = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animate button press with scale and rotation
    toggleButtonScale.value = withTiming(0.9, { 
      duration: 100,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, () => {
      toggleButtonScale.value = withTiming(1, { 
        duration: 200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
    });

    toggleButtonRotation.value = withTiming(
      toggleButtonRotation.value + 180, 
      { 
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      }
    );

    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  const animatedToggleButton = useAnimatedStyle(() => ({
    transform: [
      { scale: toggleButtonScale.value },
      { rotate: `${toggleButtonRotation.value}deg` },
    ]
  }));

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
          useAnimatedStyle(() => ({
            transform: [
              { translateX: backgroundX.value * 3.0 },
              { translateY: backgroundY.value * 3.0 },
            ],
          }))
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

        {/* Background gesture area */}
        <LongPressGestureHandler onHandlerStateChange={handleBackgroundLongPress} minDurationMs={500}>
          <TapGestureHandler onHandlerStateChange={handleBackgroundTap} enabled={isEditMode}>
            <View style={{ flex: 1, zIndex: 10 }}>
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
                    <Animated.View style={animatedToggleButton}>
                      <TouchableOpacity
                        style={[
                          widgetStyles.themeToggle,
                          {
                            backgroundColor: colors.cardBackground,
                            borderColor: colors.cardBorder,
                            shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
                          }
                        ]}
                        onPress={toggleTheme}
                        activeOpacity={0.7}
                      >
                        <Text style={widgetStyles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
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
                        WidgetComponent = HabitWidget;
                        break;
                      case 'prayer':
                        WidgetComponent = PrayerWidget;
                        break;
                      case 'journal':
                        WidgetComponent = JournalWidget;
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
            </View>
          </TapGestureHandler>
        </LongPressGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}