import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { DeviceMotion } from 'expo-sensors';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, LongPressGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
    Easing,
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
import PersonalDetails from './PersonalDetails';

export default function Dashboard() {
  const params = useLocalSearchParams();
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [showBackgroundSelectorInSettings, setShowBackgroundSelectorInSettings] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('gradient1'); // Default to gradient1
  const [widgetPositions, setWidgetPositions] = useState(() => getDefaultLayout());

  // Load saved background preference
  useEffect(() => {
    const loadBackgroundPreference = async () => {
      try {
        const savedBackground = await AsyncStorage.getItem('selectedBackground');
        if (savedBackground) {
          setSelectedBackground(savedBackground);
        }
      } catch (error) {
        console.log('Error loading background preference:', error);
      }
    };
    loadBackgroundPreference();
  }, []);

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

  // Settings button animation values (copying journal + button pattern)
  const settingsButtonScale = useSharedValue(1);
  const settingsButtonOpacity = useSharedValue(1);

  const [isPersonalDetailsVisible, setIsPersonalDetailsVisible] = useState(false);
  const [isAppearanceVisible, setIsAppearanceVisible] = useState(false);
  
  const router = useRouter();

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

  // Determine background color based on selection
  const getBackgroundColor = () => {
    if (selectedBackground === 'blue') {
      return '#007AFF';
    } else if (selectedBackground === 'white') {
      return '#FFFFFF';
    } else {
      return isDarkMode ? '#000000' : '#FFFFFF';
    }
  };

  // Determine text colors based on background
  const getTextColor = () => {
    if (selectedBackground === 'blue') {
      return '#FFFFFF';
    } else if (selectedBackground === 'white') {
      return '#000000';
    } else {
      return isDarkMode ? '#FFFFFF' : '#000000';
    }
  };

  const colors = {
    background: getBackgroundColor(),
    cardBackground: selectedBackground === 'blue' ? 'rgba(255, 255, 255, 0.15)' : 
                   selectedBackground === 'white' ? '#F8F9FA' : 
                   isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: getTextColor(),
    secondaryText: selectedBackground === 'blue' ? 'rgba(255, 255, 255, 0.8)' : 
                   selectedBackground === 'white' ? '#666666' :
                   isDarkMode ? '#A0A0A0' : '#666666',
    tertiaryText: selectedBackground === 'blue' ? 'rgba(255, 255, 255, 0.6)' : 
                  selectedBackground === 'white' ? '#777777' :
                  isDarkMode ? '#808080' : '#777777',
    cardBorder: selectedBackground === 'blue' ? 'rgba(255, 255, 255, 0.2)' : 
                selectedBackground === 'white' ? 'rgba(0,0,0,0.08)' :
                isDarkMode ? '#2C2C2E' : 'rgba(0,0,0,0.08)',
    cardShadow: selectedBackground === 'blue' ? 'rgba(0, 0, 0, 0.2)' : 
                selectedBackground === 'white' ? 'rgba(0,0,0,0.04)' :
                isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    redDot: '#FF3B30',
    prayerCompleted: selectedBackground === 'blue' ? '#FFFFFF' : '#007AFF',
    prayerPending: selectedBackground === 'blue' ? 'rgba(255, 255, 255, 0.3)' : 
                   selectedBackground === 'white' ? '#D1D1D6' :
                   isDarkMode ? '#48484A' : '#D1D1D6',
    accent: selectedBackground === 'blue' ? '#FFFFFF' : '#007AFF',
    accentSubtle: selectedBackground === 'blue' ? 'rgba(255, 255, 255, 0.1)' : 
                  selectedBackground === 'white' ? '#F0F4FF' :
                  isDarkMode ? '#1A2332' : '#F0F4FF',
    habitRing: selectedBackground === 'blue' ? '#FFFFFF' : '#007AFF',
    habitBackground: selectedBackground === 'blue' ? 'rgba(255, 255, 255, 0.2)' : 
                     selectedBackground === 'white' ? '#E5E5EA' :
                     isDarkMode ? '#2C2C2E' : '#E5E5EA',
    journalGradient: selectedBackground === 'blue' ? '#FFFFFF' : 
                     selectedBackground === 'white' ? '#007AFF' :
                     isDarkMode ? '#2C2C2E' : '#007AFF',
    journalBg: selectedBackground === 'blue' ? 'rgba(255, 255, 255, 0.1)' : 
               selectedBackground === 'white' ? '#FFFFFF' :
               isDarkMode ? '#1A1A1A' : '#FFFFFF',
    cohortAccent: selectedBackground === 'blue' ? '#FFFFFF' : '#007AFF',
    cohortBackground: selectedBackground === 'blue' ? 'rgba(255, 255, 255, 0.1)' : 
                      selectedBackground === 'white' ? 'rgba(0, 122, 255, 0.08)' :
                      isDarkMode ? 'rgba(0, 122, 255, 0.10)' : 'rgba(0, 122, 255, 0.08)',
    cohortBorder: selectedBackground === 'blue' ? 'rgba(255, 255, 255, 0.25)' : 
                  selectedBackground === 'white' ? 'rgba(0, 122, 255, 0.18)' :
                  isDarkMode ? 'rgba(0, 122, 255, 0.25)' : 'rgba(0, 122, 255, 0.18)',
    resizeHandle: selectedBackground === 'blue' ? '#FFFFFF' : '#007AFF',
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
        { translateY: backgroundY.value },
      ],
    };
  });

  const animatedBackgroundLayer2Style = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: backgroundLayer2X.value },
        { translateY: backgroundLayer2Y.value },
      ],
    };
  });

  const animatedBackgroundLayer3Style = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: backgroundLayer3X.value },
        { translateY: backgroundLayer3Y.value },
      ],
    };
  });

  // Main content container animation for card presentation
  const animatedMainContent = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 },
    ],
  }));

  // Drag gesture handler for buttery smooth iOS-style dismiss
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: { startY: number }) => {
      context.startY = 0;
    },
    onActive: (event, context: { startY: number }) => {
      const newTranslateY = context.startY + event.translationY;
      // Only allow downward dragging
      if (newTranslateY >= 0) {
        // Interactive scale feedback during drag
        const dragProgress = Math.min(newTranslateY / (screenHeight * 0.3), 1);
        const scaleValue = 1 - (dragProgress * 0.04); // Scale down slightly as dragged
      }
    },
    onEnd: (event) => {
      const shouldDismiss = event.translationY > 100 || event.velocityY > 500;
      
      if (shouldDismiss) {
        // Ultra-smooth spring dismiss animation
        backgroundX.value = withSpring(0, {
          damping: 35,
          mass: 0.8,
          stiffness: 250,
          overshootClamping: true,
        });
        backgroundY.value = withSpring(0, {
          damping: 35,
          mass: 0.8,
          stiffness: 250,
          overshootClamping: true,
        });
      } else {
        // Buttery snap back with perfect spring feel
        backgroundX.value = withSpring(0, {
          damping: 25,
          mass: 0.7,
          stiffness: 250,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        });
        backgroundY.value = withSpring(0, {
          damping: 25,
          mass: 0.7,
          stiffness: 250,
          overshootClamping: false,
          restDisplacementThreshold: 0.01,
          restSpeedThreshold: 2,
        });
      }
    },
  });

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
        
        {/* Enhanced Multi-Layer Parallax Background - Only show for gradient backgrounds */}
        
        {selectedBackground.startsWith('gradient') && (
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
        <LongPressGestureHandler onHandlerStateChange={() => {}} minDurationMs={500}>
          <TapGestureHandler onHandlerStateChange={() => {}} enabled={isEditMode}>
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
                    <TouchableOpacity
                      style={[
                        widgetStyles.themeToggle,
                        {
                          backgroundColor: '#FFFFFF',
                          borderColor: colors.cardBorder,
                          shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: isDarkMode ? 0.1 : 0.15,
                          shadowRadius: 4,
                          elevation: 3,
                        }
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        router.push('/settings-main');
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[widgetStyles.themeIcon, { fontSize: 18 }]}>⚙️</Text>
                    </TouchableOpacity>
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

        {/* Personal Details */}
        <PersonalDetails
          visible={isPersonalDetailsVisible}
          onClose={() => setIsPersonalDetailsVisible(false)}
        />
      </View>
    </GestureHandlerRootView>
  );
}