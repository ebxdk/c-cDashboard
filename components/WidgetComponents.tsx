import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
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
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[today.getDay()];
  const currentDate = today.getDate().toString().padStart(2, '0');

  return (
    <View style={[
      baseWidgetStyle, 
      { 
        backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
        padding: 16,
        paddingTop: 12,
        position: 'relative',
      }
    ]}>
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
    </View>
  );
};

export const HabitWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => {
  // Calculate progress percentage (3 out of 5 = 60%)
  const progress = 3;
  const total = 5;
  const progressPercentage = (progress / total) * 100;
  
  // SVG circle parameters - bigger and much thicker ring
  const size = 100;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Calculate the proper page width for the ScrollView
  const { width: screenWidth } = Dimensions.get('window');
  
  // Calculate small widget size using the same formula as in constants
  const gridPadding = 23;
  const widgetGap = 20;
  const additionalRightPadding = 6;
  const smallWidgetSize = Math.floor((screenWidth - (gridPadding * 1) - widgetGap - additionalRightPadding) / 2);
  
  // The available width for each page should be the full widget width
  const pageWidth = smallWidgetSize;

  // Optimized infinite scroll setup - use fewer copies for better performance
  const originalPages = ['prayer', 'reading', 'exercise'] as const;
  const copiesPerSide = 5; // Reduced from 50 to 5 for better performance
  const totalCopies = copiesPerSide * 2 + 1;
  const startIndex = copiesPerSide;

  // Scroll animation values
  const scrollX = useSharedValue(startIndex * originalPages.length * pageWidth);
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  // Optimized scroll handler with throttling
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  }, []);

  // Initialize scroll position after component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollTo({ 
        x: startIndex * originalPages.length * pageWidth, 
        animated: false 
      });
    }, 50); // Reduced timeout for faster initialization
    return () => clearTimeout(timer);
  }, [pageWidth]);

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

  // Memoized page content to prevent unnecessary re-renders
  const createPageContent = React.useCallback((pageType: 'prayer' | 'reading' | 'exercise', marginTop: number) => {
    // Define different colors for each page using theme colors
    const getPageColors = (pageType: 'prayer' | 'reading' | 'exercise') => {
      switch (pageType) {
        case 'prayer':
          return '#1E90FF'; // Vibrant dodger blue (more pop than light sky blue)
        case 'reading':
          return '#FF1744'; // More vibrant red (brighter than theme red)
        case 'exercise':
          return '#9370DB'; // Vibrant medium purple (much more pop than pastel)
        default:
          return colors.redDot;
      }
    };

    const pageColor = getPageColors(pageType);

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
              stroke={colors.habitBackground}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            
            {/* Progress Ring */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={pageColor}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
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
            }}>👋</Text>
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
          {pageType === 'prayer' ? 'Prayer' : pageType === 'reading' ? 'Reading' : 'Exercise'}
        </Text>

        {/* Progress Stats - Combined in one line */}
        <Text style={{
          fontSize: 16,
          fontWeight: '700',
          color: pageColor,
          textAlign: 'center',
          fontFamily: 'System',
        }}>
          {progress}/{total} per day
        </Text>
      </>
    );
  }, [size, strokeWidth, radius, strokeDasharray, strokeDashoffset, colors, progress, total]);

  // Optimized page generation with memoization
  const pages = React.useMemo(() => {
    const generatedPages = [];
    let pageIndex = 0;

    for (let copy = 0; copy < totalCopies; copy++) {
      for (let i = 0; i < originalPages.length; i++) {
        const pageType = originalPages[i];
        const marginTop = 3; // Same marginTop for all pages for consistent centering
        
        generatedPages.push(
          <PageView key={`${copy}-${i}`} index={pageIndex}>
            {createPageContent(pageType, marginTop)}
          </PageView>
        );
        pageIndex++;
      }
    }
    return generatedPages;
  }, [pageWidth, createPageContent]);

  // Simplified dot animation with reduced complexity
  const DotComponent = React.memo(({ index }: { index: number }) => {
    const animatedDotStyle = useAnimatedStyle(() => {
      'worklet';
      
      // Simplified calculation for better performance and stability
      const currentPageFloat = scrollX.value / pageWidth;
      const currentPageIndex = Math.round(currentPageFloat) % originalPages.length;
      const normalizedPage = currentPageIndex < 0 ? currentPageIndex + originalPages.length : currentPageIndex;
      const isActive = normalizedPage === index;
      
      // Define colors directly in worklet for stability
      let activeColor = '#1E90FF'; // Default vibrant blue
      if (index === 0) activeColor = '#1E90FF'; // Prayer - vibrant dodger blue
      else if (index === 1) activeColor = '#FF1744'; // Reading - vibrant red  
      else if (index === 2) activeColor = '#9370DB'; // Exercise - vibrant purple
      
      const inactiveColor = isDarkMode ? '#48484A' : '#8E8E93';
      
      return {
        transform: [{ scale: isActive ? 1.2 : 0.8 }],
        opacity: isActive ? 1 : 0.4,
        backgroundColor: isActive ? activeColor : inactiveColor,
      };
    }, [scrollX, pageWidth, isDarkMode]);

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
        style={{ flex: 1 }}
        contentContainerStyle={{ flexDirection: 'row', height: '100%' }}
        removeClippedSubviews={true} // Enable view recycling for better performance
      >
        {pages}
      </Animated.ScrollView>

      {/* Simplified page indicator dots */}
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
        {[0, 1, 2].map((index) => (
          <DotComponent key={index} index={index} />
        ))}
      </View>
    </View>
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

