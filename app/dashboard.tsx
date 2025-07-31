import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { DeviceMotion } from 'expo-sensors';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, LongPressGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

import { useBottomNavHeight } from '@/hooks/useBottomNavHeight';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { DraggableWidget } from '../components/DraggableWidget';
import {
    AffinityGroupsWidget,
    CalendarWidget,
    CohortContactsWidget,
    HabitWidget,
    InspireWidget,
    JournalWidget,
    MinaraWidget
} from '../components/WidgetComponents';
import { useCalendar } from '../contexts/CalendarContext';
import { useHabits } from '../contexts/HabitsContext';
import { widgetStyles } from '../styles/widgetStyles';
import { generateDashboardSummary } from '../utils/dynamicSummary';
import {
    getDefaultLayout,
    getWidgetGridSize,
    rearrangeWidgets
} from '../utils/gridUtils';
import PersonalDetails from './PersonalDetails';

export default function Dashboard() {
  const params = useLocalSearchParams();
  const systemColorScheme = useColorScheme();
  const { paddingBottom } = useBottomNavHeight(); // Get dynamic padding
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [showBackgroundSelectorInSettings, setShowBackgroundSelectorInSettings] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null); // Start with null
  const [widgetPositions, setWidgetPositions] = useState(() => getDefaultLayout());

  // Dynamic dashboard state
  const [messageCount, setMessageCount] = useState(0);
  const [journalEntries, setJournalEntries] = useState(0);

  // Contexts for real data
  const { events, loading: eventsLoading } = useCalendar();
  const { habits } = useHabits();

  // Load saved background preference
  useEffect(() => {
    const loadBackgroundPreference = async () => {
      try {
        const savedBackground = await AsyncStorage.getItem('selectedBackground');
        setSelectedBackground(savedBackground || 'off-white'); // Default to off-white if nothing saved
      } catch (error) {
        console.log('Error loading background preference:', error);
        setSelectedBackground('off-white'); // Default on error
      }
    };
    loadBackgroundPreference();
  }, []);

  // Listen for real-time background updates from settings
  useEffect(() => {
    const checkForBackgroundUpdates = () => {
      const newBackground = (global as any).dashboardBackgroundUpdate;
      if (newBackground && selectedBackground && newBackground !== selectedBackground) {
        setSelectedBackground(newBackground);
        // Clear the global flag
        (global as any).dashboardBackgroundUpdate = null;
      }
    };

    // Only start checking after background is loaded
    if (selectedBackground !== null) {
      const interval = setInterval(checkForBackgroundUpdates, 100);
      return () => clearInterval(interval);
    }
  }, [selectedBackground]);

  // Load dynamic data from various sources
  useEffect(() => {
    const loadDynamicData = async () => {
      try {
        // Load subscription tier
        const subscription = await AsyncStorage.getItem('selected-subscription');
        if (subscription) {
          switch (subscription) {
            case 'support':
              setSubscriptionTier('Support+');
              break;
            case 'companion':
              setSubscriptionTier('Companion+');
              break;
            case 'mentorship':
              setSubscriptionTier('Mentorship+');
              break;
            default:
              setSubscriptionTier('Support+');
          }
        }

        // For now, simulate message count from community/cohort
        // In a real implementation, this would come from your messaging system
        const mockMessageCount = Math.floor(Math.random() * 8) + 1; // 1-8 messages
        setMessageCount(mockMessageCount);

        // For now, simulate journal entries this week
        // In a real implementation, this would come from your journal storage
        const mockJournalEntries = Math.floor(Math.random() * 5); // 0-4 entries this week
        setJournalEntries(mockJournalEntries);
      } catch (error) {
        console.log('Error loading dynamic data:', error);
      }
    };

    loadDynamicData();
    
    // Refresh dynamic data every hour to keep it fresh
    const interval = setInterval(loadDynamicData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate dynamic summary
  const dynamicSummary = generateDashboardSummary(events, habits, messageCount, journalEntries);

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
  const [subscriptionTier, setSubscriptionTier] = useState<'Support+' | 'Companion+' | 'Mentorship+'>('Support+');
  
  const router = useRouter();

  // Get current date information
  const currentDate = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];
  
  const currentDayName = dayNames[currentDate.getDay()];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentDayNumber = currentDate.getDate();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    themeTransition.value = withTiming(isDarkMode ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Apple-like easing
    });
  }, [isDarkMode]);

  useEffect(() => {
    let subscription: any = null;
    
    const startDeviceMotion = async () => {
      try {
        const { status } = await DeviceMotion.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Motion permission denied');
          return;
        }

        subscription = DeviceMotion.addListener((motionData) => {
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
  }, []);

  // Update theme when system changes
  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  // Determine background color based on selection and dark mode
  const getBackgroundColor = () => {
    switch (selectedBackground) {
      case 'white':
        return isDarkMode ? '#1C1C1E' : '#FFFFFF'; // ChatGPT-like dark color
      case 'off-white':
        return isDarkMode ? '#000000' : '#FFFAF2'; // Pure black for dark mode
      case 'pattern-arabic':
        return isDarkMode ? '#1C1C1E' : '#FFFAF2'; // Base color for patterns
      default:
        // For gradients, respect dark mode
        return isDarkMode ? '#1C1C1E' : '#FFFAF2';
    }
  };

  // Determine text colors based on background and dark mode
  const getTextColor = () => {
    if (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') {
      // For solid colors, text color depends on dark mode since backgrounds now change
      return isDarkMode ? '#FFFFFF' : '#000000';
    } else {
      // For gradients, use white text in dark mode, black in light mode
      return isDarkMode ? '#FFFFFF' : '#000000';
    }
  };

  const colors = {
    background: getBackgroundColor(),
    cardBackground: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? 
                   (isDarkMode ? '#2C2C2E' : '#F8F9FA') : (isDarkMode ? '#1C1C1E' : '#FFFFFF'),
    primaryText: getTextColor(),
    secondaryText: isDarkMode ? '#A0A0A0' : '#666666',
    tertiaryText: isDarkMode ? '#808080' : '#777777',
    cardBorder: isDarkMode ? '#2C2C2E' : 'rgba(0,0,0,0.08)',
    cardShadow: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
    redDot: '#FF3B30',
    prayerCompleted: '#007AFF',
    prayerPending: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? '#D1D1D6' :
                   isDarkMode ? '#48484A' : '#D1D1D6',
    accent: '#007AFF',
    accentSubtle: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? '#F0F4FF' :
                  isDarkMode ? '#1A2332' : '#F0F4FF',
    habitRing: '#007AFF',
    habitBackground: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? '#E5E5EA' :
                     isDarkMode ? '#2C2C2E' : '#E5E5EA',
    journalGradient: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? '#007AFF' :
                     isDarkMode ? '#2C2C2E' : '#007AFF',
    journalBg: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? '#FFFFFF' :
               isDarkMode ? '#1A1A1A' : '#FFFFFF',
    cohortAccent: '#007AFF',
    cohortBackground: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? '#FFFAF2' :
                      isDarkMode ? 'rgba(0, 122, 255, 0.10)' : 'rgba(0, 122, 255, 0.08)',
    cohortBorder: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? '#FFFAF2' :
                  isDarkMode ? 'rgba(0, 122, 255, 0.25)' : 'rgba(0, 122, 255, 0.18)',
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

  // Widget management functions
  const handleWidgetPositionChange = useCallback((widgetId: string, newGridX: number, newGridY: number) => {
    if (isEditMode) {
      setWidgetPositions(prevPositions => {
        return prevPositions.map(position => 
          position.id === widgetId 
            ? { ...position, gridX: newGridX, gridY: newGridY }
            : position
        );
      });
    }
  }, [isEditMode]);

  const handleWidgetResize = useCallback((widgetId: string, newSize: 'small' | 'medium' | 'large') => {
    if (isEditMode) {
      setWidgetPositions(prevPositions => {
        return prevPositions.map(position => 
          position.id === widgetId 
            ? { ...position, size: newSize, ...getWidgetGridSize(newSize) }
            : position
        );
      });
    }
  }, [isEditMode]);

  const handleLiveRearrange = useCallback((draggedWidgetId: string, newGridX: number, newGridY: number) => {
    if (isEditMode) {
      setWidgetPositions(prevPositions => {
        return rearrangeWidgets(draggedWidgetId, newGridX, newGridY, prevPositions);
      });
    }
  }, [isEditMode]);

  // Helper to get gradient colors based on selected background
  const getGradientColors = (background: string): readonly [string, string, ...string[]] => {
    switch (background) {
      case 'gradient1':
        return ['#667eea', '#764ba2'] as const; // Ocean Breeze
      case 'gradient2':
        return ['#f093fb', '#f5576c'] as const; // Sunset Glow
      case 'gradient3':
        return ['#4facfe', '#00f2fe'] as const; // Forest Dawn
      case 'gradient4':
        return ['#a8edea', '#fed6e3'] as const; // Purple Dream
      case 'gradient5':
        return ['#ffd89b', '#19547b'] as const; // Golden Hour
      case 'gradient6':
        return ['#667eea', '#764ba2'] as const; // Cosmic Dust
      default:
        return ['#667eea', '#764ba2'] as const; // Default to Ocean Breeze
    }
  };

  // Helper to render the main dashboard content
  const renderDashboardContent = () => (
    <>
      {/* Floating Elements Layer - Enhanced movement (150%) */}
      <Animated.View style={[
        {
          position: 'absolute',
          top: screenHeight * 0.15,
          left: screenWidth * 0.75,
          opacity: isDarkMode ? 0.03 : 0.06,
          zIndex: 4,
        },
        animatedBackgroundStyle
      ]} />

      {/* Background gesture area */}
      <LongPressGestureHandler onHandlerStateChange={() => {}} minDurationMs={500}>
        <TapGestureHandler onHandlerStateChange={() => {}} enabled={isEditMode}>
          <Animated.View style={[{ flex: 1, zIndex: 10 }, animatedMainContent]}>
            <ScrollView 
              style={widgetStyles.mainScrollView}
              contentContainerStyle={{
                ...widgetStyles.scrollContent,
                paddingBottom: paddingBottom + 20, // Dynamic padding based on nav bar visibility
              }}
              showsVerticalScrollIndicator={false}
              scrollEnabled={!isEditMode}
              bounces={!isEditMode}
            >
              {/* Header with day and date */}
              <View style={widgetStyles.header}>
                <View style={widgetStyles.daySection}>
                  <Text style={[widgetStyles.dayText, { color: colors.primaryText }]}>{currentDayName}</Text>
                  <View style={[widgetStyles.redDot, { backgroundColor: colors.redDot }]} />
                </View>
                <View style={widgetStyles.headerRight}>
                  <View style={widgetStyles.dateSection}>
                    <Text style={[widgetStyles.dateText, { color: colors.secondaryText }]}>{currentMonthName} {currentDayNumber}</Text>
                    <Text style={[widgetStyles.yearText, { color: colors.tertiaryText }]}>{currentYear}</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      widgetStyles.themeToggle,
                      {
                        backgroundColor: colors.cardBackground,
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
                  
                  {/* Subscription Toggle for Testing */}
                  <TouchableOpacity
                    style={[
                      widgetStyles.themeToggle,
                      {
                        backgroundColor: colors.cardBackground,
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
                        marginLeft: 8,
                      }
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      // Cycle through subscription tiers
                      const tiers: ('Support+' | 'Companion+' | 'Mentorship+')[] = ['Support+', 'Companion+', 'Mentorship+'];
                      const currentIndex = tiers.indexOf(subscriptionTier);
                      const nextIndex = (currentIndex + 1) % tiers.length;
                      const newTier = tiers[nextIndex];
                      setSubscriptionTier(newTier);
                      
                      // Save to AsyncStorage
                      const tierMap = {
                        'Support+': 'support',
                        'Companion+': 'companion', 
                        'Mentorship+': 'mentorship'
                      };
                      AsyncStorage.setItem('selected-subscription', tierMap[newTier]);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[widgetStyles.themeIcon, { fontSize: 14 }]}>
                      {subscriptionTier === 'Support+' ? 'S' : subscriptionTier === 'Companion+' ? 'C' : 'M'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Dynamic Greeting and Summary */}
              <View style={widgetStyles.summarySection}>
                <Text style={[widgetStyles.greetingText, { color: colors.primaryText }]}>
                  {dynamicSummary.greeting}
                </Text>
                <Text style={[widgetStyles.summaryText, { color: colors.secondaryText }]}>
                  {/* Parse and format the message to bold key numbers and emojis */}
                  {dynamicSummary.message
                    .split(/(📅\s+\d+\s+events?|💬\s+\d+\s+messages?|✅\s+\d+\s+habits?)/g)
                    .map((part, index) => {
                      // Check if this part contains an emoji and number followed by event/message/habit keywords
                      if (/(📅\s+\d+\s+events?|💬\s+\d+\s+messages?|✅\s+\d+\s+habits?)/.test(part)) {
                        return (
                          <Text key={index} style={[widgetStyles.highlightText, { color: colors.primaryText, fontWeight: '700' }]}>
                            {part}
                          </Text>
                        );
                      }
                      return part;
                    })} <Text style={[widgetStyles.highlightText, { color: colors.primaryText }]}>{dynamicSummary.motivationalPhrase}</Text>
                </Text>
              </View>

              {/* Dynamic Stats Row */}
              <View style={widgetStyles.statsRow}>
                <Text style={[widgetStyles.statItem, { color: colors.secondaryText }]}>
                  📅 <Text style={[widgetStyles.statNumber, { color: colors.primaryText }]}>{dynamicSummary.stats.events.count}</Text> {dynamicSummary.stats.events.label}
                </Text>
                <Text style={[widgetStyles.statItem, { color: colors.secondaryText }]}>
                  💬 <Text style={[widgetStyles.statNumber, { color: colors.primaryText }]}>{dynamicSummary.stats.messages.count}</Text> {dynamicSummary.stats.messages.label}
                </Text>
                <Text style={[widgetStyles.statItem, { color: colors.secondaryText }]}>
                  🌟 <Text style={[widgetStyles.statNumber, { color: colors.primaryText }]}>{dynamicSummary.stats.habits.count}</Text> {dynamicSummary.stats.habits.label}
                </Text>
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
                      WidgetComponent = AffinityGroupsWidget;
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
                      <WidgetComponent colors={colors} isDarkMode={isDarkMode} subscriptionTier={subscriptionTier} />
                    </DraggableWidget>
                  );
                })}

                {/* Add this button to your dashboard for easy testing */}
                <TouchableOpacity 
                  style={widgetStyles.testButton} 
                  onPress={() => router.push('/chat-test')}
                >
                  <Text style={widgetStyles.testButtonText}>🧪 Test Supabase Chat</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </TapGestureHandler>
      </LongPressGestureHandler>

      {/* Personal Details Modal */}
      <PersonalDetails
        visible={isPersonalDetailsVisible}
        onClose={() => setIsPersonalDetailsVisible(false)}
      />
    </>
  );

  // Don't render until background is loaded to prevent flashing
  if (selectedBackground === null) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {params.noAnim === '1' && (
        <Stack.Screen options={{ animation: 'none' }} />
      )}
      
      {/* Main Container - Wrap everything in gradient if gradient is selected */}
      {selectedBackground.startsWith('gradient') ? (
        <LinearGradient
          colors={getGradientColors(selectedBackground)}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ flex: 1 }}>
            {renderDashboardContent()}
          </View>
        </LinearGradient>
      ) : (
        <View style={[{ flex: 1 }, { backgroundColor: colors.background }]}>
          
          {/* Enhanced Multi-Layer Parallax Background - Show patterns only for pattern backgrounds */}
          {selectedBackground === 'pattern-arabic' && (
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

              {/* Background Layer 1 - Fastest movement (100%) */}
              <Animated.View style={[
                {
                  position: 'absolute',
                  top: -40,
                  left: -40,
                  right: -40,
                  bottom: -40,
                  opacity: isDarkMode ? 0.25 : 0.30,
                  zIndex: 3,
                },
                animatedBackgroundStyle
              ]}>
                <ImageBackground
                  source={require('../assets/images/cc.patterns-01.png')}
                  style={{
                    width: screenWidth + 80,
                    height: screenHeight + 80,
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
            </>
          )}

          {renderDashboardContent()}
        </View>
      )}
    </GestureHandlerRootView>
  );
}