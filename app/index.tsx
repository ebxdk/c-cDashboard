import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
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
    AskAIWidget,
    CalendarWidget,
    CohortContactsWidget,
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
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isEditMode, setIsEditMode] = useState(false);
  const [widgetPositions, setWidgetPositions] = useState(() => getDefaultLayout());

  // Parallax effect state
  const [deviceMotion, setDeviceMotion] = useState({ x: 0, y: 0 });
  const backgroundX = useSharedValue(0);
  const backgroundY = useSharedValue(0);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Theme transition animation
  const themeTransition = useSharedValue(isDarkMode ? 1 : 0);

  useEffect(() => {
    themeTransition.value = withTiming(isDarkMode ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Apple-like easing
    });
  }, [isDarkMode]);

  // Device motion parallax effect
  useEffect(() => {
    const subscription = DeviceMotion.addListener((motionData) => {
      if (motionData.rotation) {
        // Subtle parallax movement based on device rotation
        const maxOffset = 20; // Maximum offset in pixels
        const newX = Math.max(-maxOffset, Math.min(maxOffset, motionData.rotation.gamma * 30));
        const newY = Math.max(-maxOffset, Math.min(maxOffset, motionData.rotation.beta * 30));
        
        backgroundX.value = withTiming(newX, {
          duration: 100,
          easing: Easing.out(Easing.quad),
        });
        backgroundY.value = withTiming(newY, {
          duration: 100,
          easing: Easing.out(Easing.quad),
        });
      }
    });

    DeviceMotion.setUpdateInterval(100); // Update every 100ms

    return () => {
      subscription && subscription.remove();
    };
  }, []);

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

  // Animated background with parallax effect
  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: backgroundX.value },
      { translateY: backgroundY.value },
    ],
  }));

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
      { rotate: `${toggleButtonRotation.value}deg` }
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
      <View style={[{ flex: 1 }, { backgroundColor: colors.background }]}>
        <Animated.View style={[
          {
            position: 'absolute',
            top: -50,
            left: -50,
            right: -50,
            bottom: -50,
            opacity: isDarkMode ? 0.25 : 0.35,
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
            intensity={15}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </Animated.View>

        {/* Background gesture area */}
        <LongPressGestureHandler onHandlerStateChange={handleBackgroundLongPress} minDurationMs={500}>
          <TapGestureHandler onHandlerStateChange={handleBackgroundTap} enabled={isEditMode}>
            <View style={{ flex: 1 }}>
              <ScrollView 
                style={widgetStyles.mainScrollView}
                contentContainerStyle={[widgetStyles.scrollContent]}
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
                    You have 📅 <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>3 upcoming events</Text>, 💬 <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>2 new messages</Text> and 🌟 <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>4 daily habits</Text> awaiting your attention. <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>Let's crush it, akhi! 💪</Text>
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

                  {/* Cohort Contacts Widget */}
                  <DraggableWidget widgetId="events" position={widgetPositions[0]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <CohortContactsWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  {/* Messages Widget */}
                  <DraggableWidget widgetId="messages" position={widgetPositions[1]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <MinaraWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  {/* Calendar Widget */}
                  <DraggableWidget widgetId="habits" position={widgetPositions[2]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <CalendarWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  {/* Ask AI Widget */}
                  <DraggableWidget widgetId="askMinara" position={widgetPositions[3]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <AskAIWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  {/* Prayer Widget */}
                  <DraggableWidget widgetId="prayer" position={widgetPositions[4]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <PrayerWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  {/* Journal Widget */}
                  <DraggableWidget widgetId="journal" position={widgetPositions[5]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <JournalWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  
                </View>
              </ScrollView>
            </View>
          </TapGestureHandler>
        </LongPressGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}