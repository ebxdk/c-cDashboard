import { useHabits } from '@/contexts/HabitsContext';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';


interface WidgetProps {
  colors: any;
  isDarkMode: boolean;
}

const baseWidgetStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  borderRadius: 30,
  padding: 22,
  margin: 0,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
  borderWidth: 0,
};

export const CohortContactsWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => {
  const router = useRouter();

  const handlePress = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/cohort');
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        baseWidgetStyle, 
        { 
          backgroundColor: '#A8C8E8', // Light blue base color
          shadowColor: '#5A8BC4',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
          padding: 20, // Adjusted padding for larger circles
          paddingBottom: 0, // Reduced bottom padding specifically
        }
      ]}
    >
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Single row of contacts */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 4, // Reduced padding for larger circles
      }}>
        {/* Contact 1 */}
        <View style={{
          alignItems: 'center',
          flex: 1,
        }}>
          <View style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 4,
            borderWidth: 0.5,
            borderColor: 'rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}>
            <Image
              source={require('../assets/images/memoji1.png')}
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
              }}
              resizeMode="cover"
            />
          </View>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: '#FFFFFF',
            fontFamily: 'System',
            opacity: 0.95,
            textAlign: 'center',
            letterSpacing: -0.1,
            lineHeight: 14,
          }}>Ahmed</Text>
        </View>

        {/* Contact 2 */}
        <View style={{
          alignItems: 'center',
          flex: 1,
        }}>
          <View style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 4,
            borderWidth: 0.5,
            borderColor: 'rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}>
            <Image
              source={require('../assets/images/memoji2.png')}
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
              }}
              resizeMode="cover"
            />
          </View>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: '#FFFFFF',
            fontFamily: 'System',
            opacity: 0.95,
            textAlign: 'center',
            letterSpacing: -0.1,
            lineHeight: 14,
          }}>Omar</Text>
        </View>

        {/* Contact 3 */}
        <View style={{
          alignItems: 'center',
          flex: 1,
        }}>
          <View style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 4,
            borderWidth: 0.5,
            borderColor: 'rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}>
            <Image
              source={require('../assets/images/memoji3.png')}
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
              }}
              resizeMode="cover"
            />
          </View>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: '#FFFFFF',
            fontFamily: 'System',
            opacity: 0.95,
            textAlign: 'center',
            letterSpacing: -0.1,
            lineHeight: 14,
          }}>Yusuf</Text>
        </View>

        {/* Contact 4 - More people indicator */}
        <View style={{
          alignItems: 'center',
          flex: 1,
        }}>
          <View style={{ position: 'relative' }}>
            <View style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 8,
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.12,
              shadowRadius: 10,
              elevation: 4,
              borderWidth: 0.5,
              borderColor: 'rgba(0, 0, 0, 0.04)',
            }}>
              <Text style={{
                fontSize: 22,
                fontWeight: '600',
                color: '#666666',
                fontFamily: 'System',
                letterSpacing: -0.3,
              }}>+5</Text>
            </View>

            {/* Red notification badge */}
            <View style={{
              position: 'absolute',
              top: 2,
              right: -5,
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#FF3B30',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 6,
              shadowColor: '#FF3B30',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 2,
              borderWidth: 1.5,
              borderColor: '#FFFFFF',
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '600',
                color: '#FFFFFF',
                fontFamily: 'System',
                letterSpacing: -0.2,
                lineHeight: 13,
              }}>2</Text>
            </View>
          </View>

          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: '#FFFFFF',
            fontFamily: 'System',
            opacity: 0.85,
            textAlign: 'center',
            letterSpacing: -0.1,
            lineHeight: 14,
          }}>more</Text>
        </View>
      </View>

      {/* Bottom label */}
      <View style={{
        alignItems: 'center',
        marginTop: 18, // Increased from 14 to 18 to push text a little more down
      }}>
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: '#FFFFFF',
          fontFamily: 'System',
          opacity: 0.9,
          letterSpacing: -0.2,
        }}>Cohort</Text>
      </View>
    </View>
    </TouchableOpacity>
  );
};

export const MinaraWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/minara-chat');
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      style={[
        baseWidgetStyle, 
        { 
          backgroundColor: isDarkMode ? '#1C1C1E' : '#F8F9FA',
          padding: 16,
          shadowColor: isDarkMode ? '#000000' : '#000000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: isDarkMode ? 0.15 : 0.08,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: isDarkMode ? 0.5 : 1,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
        }
      ]}
      activeOpacity={0.8}
    >
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 60,
        paddingVertical: 4,
      }}>
        {/* Main circular chat input */}
        <View style={{
          width: 152,
          height: 65,
          borderRadius: 32,
          backgroundColor: isDarkMode ? '#2A2A2C' : '#F0F1F3',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 6,
          borderWidth: isDarkMode ? 0.5 : 1,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          paddingHorizontal: 16,
          shadowColor: isDarkMode ? '#000000' : '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.25 : 0.04,
          shadowRadius: 4,
          elevation: 2,
        }}>
          <Text style={{
            fontSize: 22,
            marginRight: 10,
          }}>💬</Text>
          <Text style={{
            fontSize: 12,
            color: isDarkMode ? '#8E8E93' : '#8E8E93',
            fontFamily: 'System',
            flex: 1,
            textAlign: 'center',
          }}>Ask Minara AI</Text>
        </View>

        {/* Two smaller circular buttons */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          paddingHorizontal: 8,
          gap: 16,
        }}>
          {/* Camera button */}
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: isDarkMode ? '#2A2A2C' : '#F0F1F3',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: isDarkMode ? 0.5 : 1,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            shadowColor: isDarkMode ? '#000000' : '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.25 : 0.04,
            shadowRadius: 4,
            elevation: 2,
          }}>
            <Text style={{
              fontSize: 24,
              textAlign: 'center',
            }}>📷</Text>
          </View>

          {/* Microphone button */}
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: isDarkMode ? '#2A2A2C' : '#F0F1F3',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: isDarkMode ? 0.5 : 1,
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            shadowColor: isDarkMode ? '#000000' : '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDarkMode ? 0.25 : 0.04,
            shadowRadius: 4,
            elevation: 2,
          }}>
            <Text style={{
              fontSize: 24,
              textAlign: 'center',
            }}>🎤</Text>
          </View>
        </View>

      </View>
    </TouchableOpacity>
  );
};

export const CalendarWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => {
  const router = useRouter();
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[today.getDay()];
  const currentDate = today.getDate().toString().padStart(2, '0');

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/calendar');
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        baseWidgetStyle, 
        { 
          backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
          padding: 16,
          paddingTop: 12,
          position: 'relative',
        }
      ]}
    >
      {/* Red notification bubble */}
      <View style={{
        position: 'absolute',
        top: 14,
        right: 14,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FF453A',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        shadowColor: '#FF453A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 2,
        borderColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
      }}>
        <Text style={{
          fontSize: 11,
          fontWeight: 'bold',
          color: '#FFFFFF',
          fontFamily: 'System',
          letterSpacing: -0.3,
          lineHeight: 14,
          textAlign: 'center',
        }}>3</Text>
      </View>

      <View style={{
        flex: 1,
        justifyContent: 'flex-start',
      }}>
        {/* Day of week */}
        <Text style={{
          fontSize: 13,
          fontWeight: 'bold',
          color: '#5AC8FA',
          fontFamily: 'System',
          marginBottom: 2,
          marginTop: 2,
        }}>
          {currentDay}
        </Text>

        {/* Date number */}
        <Text style={{
          fontSize: 44,
          fontWeight: 'bold',
          color: isDarkMode ? '#FFFFFF' : '#000000',
          fontFamily: 'System',
          lineHeight: 48,
          marginBottom: 12,
          marginTop: 0,
        }}>
          {currentDate}
        </Text>

        {/* Upcoming section */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        }}>
          <View style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: isDarkMode ? '#8E8E93' : '#8E8E93',
            marginRight: 6,
          }} />
          <Text style={{
            fontSize: 12,
            fontWeight: 'bold',
            color: isDarkMode ? '#8E8E93' : '#8E8E93',
            fontFamily: 'System',
          }}>
            Upcoming
          </Text>
        </View>

        {/* Events list */}
        <View style={{ flex: 1 }}>
          {/* Event 1 */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 6,
          }}>
            <View style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#FF453A',
              marginRight: 6,
              marginTop: 4,
            }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: isDarkMode ? '#FFFFFF' : '#000000',
                fontFamily: 'System',
                marginBottom: 1,
                lineHeight: 14,
              }}>
                Iftar Outing
              </Text>
              <Text style={{
                fontSize: 10,
                fontWeight: 'normal',
                color: isDarkMode ? '#8E8E93' : '#8E8E93',
                fontFamily: 'System',
                marginBottom: 1,
                lineHeight: 12,
              }}>
                Revert Reach Iftar @ GC Ridgeway
              </Text>
              <Text style={{
                fontSize: 10,
                fontWeight: 'normal',
                color: isDarkMode ? '#8E8E93' : '#8E8E93',
                fontFamily: 'System',
                lineHeight: 12,
              }}>
                9:00 AM (3 hrs)
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const HabitWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => {
  const router = useRouter();
  const { habits } = useHabits();

  // Track current habit index in the widget
  const [currentHabitIndex, setCurrentHabitIndex] = React.useState(0);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to habits page with the current habit index
    router.push(`/habits?habitIndex=${currentHabitIndex}`);
  };

  // If no habits exist, show empty state
  if (habits.length === 0) {
    return (
      <TapGestureHandler onHandlerStateChange={(event) => {
        if (event.nativeEvent.state === State.END) {
          handlePress();
        }
      }}>
        <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF', padding: 20 }]}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              fontSize: 32,
              textAlign: 'center',
              marginBottom: 8,
            }}>🎯</Text>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.primaryText,
              textAlign: 'center',
              marginBottom: 4,
              fontFamily: 'System',
            }}>
              No Habits Yet
            </Text>
            <Text style={{
              fontSize: 12,
              color: colors.secondaryText,
              textAlign: 'center',
              fontFamily: 'System',
            }}>
              Tap to add habits
            </Text>
          </View>
        </View>
      </TapGestureHandler>
    );
  }

  // SVG circle parameters - bigger and much thicker ring
  const size = 100;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate the proper page width for the ScrollView
  const { width: screenWidth } = Dimensions.get('window');
  
  // Calculate small widget size using the same formula as in constants
  const gridPadding = 23;
  const widgetGap = 20;
  const additionalRightPadding = 6;
  const smallWidgetSize = Math.floor((screenWidth - (gridPadding * 1) - widgetGap - additionalRightPadding) / 2);
  
  // The available width for each page should be the full widget width
  const pageWidth = smallWidgetSize;

  // Use actual habits instead of hardcoded pages
  const copiesPerSide = 5; // Reduced from 50 to 5 for better performance
  const totalCopies = copiesPerSide * 2 + 1;
  const startIndex = copiesPerSide;

  // Scroll animation values
  const scrollX = useSharedValue(startIndex * habits.length * pageWidth);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  // Track scroll state to distinguish between scrolling and tapping
  const isScrolling = useRef(false);
  const scrollStartTime = useRef(0);

  // Optimized scroll handler with throttling
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      
      // Calculate current habit index based on scroll position
      const currentPageFloat = event.contentOffset.x / pageWidth;
      const currentPageIndex = Math.round(currentPageFloat) % habits.length;
      const normalizedPage = currentPageIndex < 0 ? currentPageIndex + habits.length : currentPageIndex;
      
      // Update current habit index on main thread
      runOnJS(setCurrentHabitIndex)(normalizedPage);
    },
  }, [pageWidth, habits.length]);

  // Handle scroll begin and end
  const handleScrollBeginDrag = () => {
    isScrolling.current = true;
    scrollStartTime.current = Date.now();
  };

  const handleScrollEndDrag = () => {
    // Allow a small delay before considering scroll ended
    setTimeout(() => {
      isScrolling.current = false;
    }, 100);
  };

  // Handle tap on the widget - only navigate if not scrolling
  const handleWidgetTap = () => {
    const timeSinceScrollStart = Date.now() - scrollStartTime.current;
    // Only navigate if we're not currently scrolling and haven't scrolled recently
    if (!isScrolling.current && timeSinceScrollStart > 200) {
      handlePress();
    }
  };

  // Handle tap gesture state changes
  const onTapHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      handleWidgetTap();
    }
  };

  // Initialize scroll position after component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollTo({ 
        x: startIndex * habits.length * pageWidth, 
        animated: false 
      });
    }, 50); // Reduced timeout for faster initialization
    return () => clearTimeout(timer);
  }, [pageWidth, habits.length]);

  // Simplified Page component with reduced animations for better performance
  const PageView = React.memo(({ children, index }: { children: React.ReactNode; index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * pageWidth,
        index * pageWidth,
        (index + 1) * pageWidth,
      ];

      // Simplified scale animation only - removed complex rotations and translations
      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.9, 1, 0.9],
        'clamp'
      );

      // Simplified opacity animation
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.7, 1, 0.7],
        'clamp'
      );

      return {
        transform: [{ scale }],
        opacity,
      };
    });

    return (
      <Animated.View style={[
        {
          width: pageWidth,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        animatedStyle
      ]}>
        {children}
      </Animated.View>
    );
  });

  // Memoized page content to prevent unnecessary re-renders - now uses actual habit data
  const createPageContent = React.useCallback((habit: any, marginTop: number) => {
    // Calculate progress
    let progress = 0;
    let progressPercentage = 0;
    if (habit.goal !== 'infinite') {
      progress = Math.min(habit.current / habit.goal, 1);
      progressPercentage = progress * 100;
    } else {
      // For infinite goals, show current value but no progress ring
      progressPercentage = 0;
    }

    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

    return (
      <>
        {/* SVG Circular Progress Ring */}
        <View style={{
          width: size,
          height: size,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 8,
          marginTop,
          position: 'relative',
        }}>
          <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
            {/* Background Ring */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.habitBackground || (isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {/* Progress Ring - only show if not infinite goal */}
            {habit.goal !== 'infinite' && (
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={habit.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            )}
          </Svg>
          
          {/* Centered emoji in the middle of the ring */}
          <View style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            width: size,
            height: size,
          }}>
            <Text style={{
              fontSize: 28,
              textAlign: 'center',
            }}>🎯</Text>
          </View>
        </View>

        {/* Habit Label */}
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: colors.primaryText,
          textAlign: 'center',
          marginBottom: 2,
          fontFamily: 'System',
          letterSpacing: 0.5,
        }}>
          {habit.name}
        </Text>

        {/* Progress Stats - Combined in one line */}
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: habit.color,
          textAlign: 'center',
          fontFamily: 'System',
        }}>
          {habit.goal === 'infinite' ? `${habit.current} ${habit.unit}` : `${habit.current}/${habit.goal} ${habit.unit}`}
        </Text>
      </>
    );
  }, [size, strokeWidth, radius, circumference, colors, isDarkMode]);

  // Optimized page generation with memoization - now uses actual habits
  const pages = React.useMemo(() => {
    const generatedPages = [];
    let pageIndex = 0;

    for (let copy = 0; copy < totalCopies; copy++) {
      for (let i = 0; i < habits.length; i++) {
        const habit = habits[i];
        const marginTop = 3; // Same marginTop for all pages for consistent centering
        
        generatedPages.push(
          <PageView key={`${copy}-${i}`} index={pageIndex}>
            {createPageContent(habit, marginTop)}
          </PageView>
        );
        pageIndex++;
      }
    }
    return generatedPages;
  }, [pageWidth, createPageContent, habits]);

  // Simplified dot animation with reduced complexity - now uses actual habits
  const DotComponent = React.memo(({ index }: { index: number }) => {
    const animatedDotStyle = useAnimatedStyle(() => {
      'worklet';
      
      // Simplified calculation for better performance and stability
      const currentPageFloat = scrollX.value / pageWidth;
      const currentPageIndex = Math.round(currentPageFloat) % habits.length;
      const normalizedPage = currentPageIndex < 0 ? currentPageIndex + habits.length : currentPageIndex;
      const isActive = normalizedPage === index;
      
      // Use the actual habit color for the active dot
      const habit = habits[index];
      const activeColor = habit ? habit.color : '#1E90FF';
      const inactiveColor = isDarkMode ? '#48484A' : '#8E8E93';
      
      return {
        transform: [{ scale: isActive ? 1.2 : 0.8 }],
        opacity: isActive ? 1 : 0.4,
        backgroundColor: isActive ? activeColor : inactiveColor,
      };
    }, [scrollX, pageWidth, isDarkMode, habits]);

    return (
      <Animated.View style={[
        {
          width: 6,
          height: 6,
          borderRadius: 3,
        },
        animatedDotStyle
      ]} />
    );
  });

  return (
    <TapGestureHandler onHandlerStateChange={onTapHandlerStateChange}>
      <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF', padding: 0, paddingTop: 10, paddingBottom: 10 }]}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          decelerationRate="fast"
          contentInsetAdjustmentBehavior="never"
          directionalLockEnabled={true}
          scrollEventThrottle={8} // Reduced from 16 for better performance
          disableIntervalMomentum={true}
          disableScrollViewPanResponder={false}
          onScroll={onScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexDirection: 'row', height: '100%' }}
          removeClippedSubviews={true} // Enable view recycling for better performance
        >
          {pages}
        </Animated.ScrollView>

        {/* Simplified page indicator dots - now shows dots for actual habits */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: -12,
          left: 0,
          right: 0,
          gap: 6,
        }}>
          {habits.map((_, index) => (
            <DotComponent key={index} index={index} />
          ))}
        </View>
      </View>
    </TapGestureHandler>
  );
};

export const PrayerWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
    }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: isDarkMode ? '#FFFFFF' : '#000000',
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: 'System',
      }}>
        🕌 Prayer
      </Text>
      <Text style={{
        fontSize: 12,
        color: isDarkMode ? '#8E8E93' : '#6B6B6B',
        textAlign: 'center',
        fontFamily: 'System',
      }}>
        Prayer times
      </Text>
    </View>
  </View>
);

export const JournalWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
    }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: isDarkMode ? '#FFFFFF' : '#000000',
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: 'System',
      }}>
        📝 Journal
      </Text>
      <Text style={{
        fontSize: 12,
        color: isDarkMode ? '#8E8E93' : '#6B6B6B',
        textAlign: 'center',
        fontFamily: 'System',
      }}>
        Daily reflections
      </Text>
    </View>
  </View>
);

