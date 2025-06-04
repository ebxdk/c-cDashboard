import * as Haptics from 'expo-haptics';
import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, LongPressGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing
} from 'react-native-reanimated';

import { DraggableWidget } from '../components/DraggableWidget';
import {
    AskMinaraWidget,
    CohortWidget,
    EventsWidget,
    HabitsWidget,
    JournalWidget,
    MessagesWidget,
    PrayerWidget
} from '../components/WidgetComponents';
import { widgetStyles } from '../styles/widgetStyles';
import { WidgetPosition } from '../types/widget';
import {
    findFirstAvailablePosition,
    getDefaultLayout,
    getWidgetGridSize,
    rearrangeWidgets
} from '../utils/gridUtils';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function Dashboard() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isEditMode, setIsEditMode] = useState(false);

  // Theme transition animation
  const themeTransition = useSharedValue(isDarkMode ? 1 : 0);

  useEffect(() => {
    themeTransition.value = withTiming(isDarkMode ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Apple-like easing
    });
  }, [isDarkMode]);

  // Update theme when system changes
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const colors = {
    background: isDarkMode ? '#000000' : '#EEEEEE',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#3C3C43',
    tertiaryText: isDarkMode ? '#636366' : '#8E8E93',
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
      backgroundColor: interpolate(
        themeTransition.value,
        [0, 1],
        [colors.background, colors.background]
      ),
    })),
  };

  const toggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsDarkMode(prevMode => !prevMode);
  };

  // Enter edit mode on long press
  const handleLongPress = useCallback(() => {
    if (!isEditMode) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsEditMode(true);
    }
  }, [isEditMode]);

  // Exit edit mode on tap
  const handleTapToExit = useCallback(() => {
    if (isEditMode) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setIsEditMode(false);
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
      <Animated.View style={[{ flex: 1 }, animatedColors.background]}>
        
      
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
                    <TouchableOpacity 
                      style={[widgetStyles.themeToggle, { 
                        backgroundColor: colors.cardBackground, 
                        borderColor: colors.cardBorder,
                        shadowColor: isDarkMode ? '#FFFFFF' : '#000000',
                      }]} 
                      onPress={toggleTheme}
                      activeOpacity={0.7}
                    >
                      <Text style={widgetStyles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Greeting and Summary */}
                <View style={widgetStyles.summarySection}>
                  <Text style={[widgetStyles.greetingText, { color: colors.primaryText }]}>Salam, Ebad.</Text>
                  <Text style={[widgetStyles.summaryText, { color: colors.secondaryText }]}>
                    You have 📅 <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>3 meetings</Text>, ✅ <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>2 tasks</Text> and 🚀 <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>1 habit</Text> today. You're <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>mostly free</Text> after 4 pm.
                  </Text>
                </View>

                {/* Stats Row */}
                <View style={widgetStyles.statsRow}>
                  <Text style={[widgetStyles.statItem, { color: colors.secondaryText }]}>🚶 <Text style={[widgetStyles.statNumber, { color: colors.primaryText }]}>4.7K</Text> steps</Text>
                  <Text style={[widgetStyles.statItem, { color: colors.secondaryText }]}>🕐 <Text style={[widgetStyles.statNumber, { color: colors.primaryText }]}>7.3</Text> hours</Text>
                  <Text style={[widgetStyles.statItem, { color: colors.secondaryText }]}>🏃 <Text style={[widgetStyles.statNumber, { color: colors.primaryText }]}>36</Text> mins</Text>
                </View>

                {/* Widget Container */}
                <View style={widgetStyles.widgetContainer}>

                  {/* Events Widget */}
                  <DraggableWidget widgetId="events" position={widgetPositions[0]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <EventsWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  {/* Messages Widget */}
                  <DraggableWidget widgetId="messages" position={widgetPositions[1]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <MessagesWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  {/* Habits Widget */}
                  <DraggableWidget widgetId="habits" position={widgetPositions[2]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <HabitsWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  {/* Ask Minara Widget */}
                  <DraggableWidget widgetId="askMinara" position={widgetPositions[3]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <AskMinaraWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  {/* Prayer Widget */}
                  <DraggableWidget widgetId="prayer" position={widgetPositions[4]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <PrayerWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  {/* Journal Widget */}
                  <DraggableWidget widgetId="journal" position={widgetPositions[5]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <JournalWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>

                  {/* Cohort Widget */}
                  <DraggableWidget widgetId="cohort" position={widgetPositions[6]} allPositions={widgetPositions} onPositionChange={handleWidgetPositionChange} onResize={handleWidgetResize} onLiveRearrange={handleLiveRearrange} isEditMode={isEditMode} isDarkMode={isDarkMode} colors={colors}>
                    <CohortWidget colors={colors} isDarkMode={isDarkMode} />
                  </DraggableWidget>
                </View>
              </ScrollView>
            </View>
          </TapGestureHandler>
        </LongPressGestureHandler>
      </Animated.View>
    </GestureHandlerRootView>
  );
}