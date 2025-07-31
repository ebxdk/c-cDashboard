import { useCalendar } from '@/contexts/CalendarContext';
import { useHabits } from '@/contexts/HabitsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import AnimatedReanimated, { interpolate, runOnJS, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { IconSymbol } from './ui/IconSymbol';

interface WidgetProps {
  colors: any;
  isDarkMode: boolean;
  subscriptionTier?: 'Support+' | 'Companion+' | 'Mentorship+';
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

export const CohortContactsWidget: React.FC<WidgetProps> = ({ colors, isDarkMode, subscriptionTier = 'Support+' }) => {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/cohort');
  };

  // Get widget design based on subscription tier
  const getWidgetDesign = () => {
    // Use the same background for all tiers
    const commonBackground = {
      backgroundColor: '#A8C8E8',
      gradientColors: ['#7BA8D1', '#8FB5D6', '#A8C8E8'],
    };

    switch (subscriptionTier) {
      case 'Companion+':
        return {
          ...commonBackground,
          title: 'Companion+',
          subtitle: '',
          buttonText: 'Start Chat',
          buttonColor: '#4A90E2',
          showNotification: true,
          notificationCount: '+9',
        };
      case 'Mentorship+':
        return {
          ...commonBackground,
          title: 'Mentorship+',
          subtitle: '',
          buttonText: 'Connect Now',
          buttonColor: '#6C5CE7',
          showNotification: true,
          notificationCount: '+12',
        };
      default: // Support+
        return {
          ...commonBackground,
          title: 'Connect',
          subtitle: 'Join your community',
          buttonText: 'Open Chat',
          buttonColor: '#4A90E2',
          showNotification: false,
          notificationCount: '',
        };
    }
  };

  const design = getWidgetDesign();

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        baseWidgetStyle, 
        { 
          backgroundColor: design.backgroundColor,
          shadowColor: design.gradientColors[0],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
          padding: 20,
          paddingBottom: 0,
          overflow: 'hidden',
        }
      ]}
    >
      {/* Gradient background layers */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: design.gradientColors[0],
        borderRadius: 30,
      }} />
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '20%',
        backgroundColor: design.gradientColors[1],
        borderRadius: 30,
      }} />
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '60%',
        backgroundColor: design.gradientColors[2],
        borderRadius: 30,
      }} />
      
      {/* Blur overlay */}
      <BlurView
        intensity={45}
        tint="light"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 30,
          backgroundColor: `${design.backgroundColor}30`,
        }}
      />
      
      <View style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        zIndex: 1,
        paddingTop: 0,
        paddingBottom: 10,
      }}>
        {/* Header section with title and subtitle */}
        <View style={{
          alignItems: 'center',
          width: '100%',
          marginBottom: 5,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#FFFFFF',
            fontFamily: 'System',
            textAlign: 'center',
            marginBottom: 4,
          }}>
            {design.title}
          </Text>
          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: '#FFFFFF',
            fontFamily: 'System',
            opacity: 0.8,
            textAlign: 'center',
          }}>
            {design.subtitle}
          </Text>
        </View>

        {/* Content section - different for each tier */}
        {subscriptionTier === 'Support+' ? (
          // Support+ shows community contacts
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: 8,
            flex: 1,
          }}>
            {/* Contact 1 */}
            <View style={{
              alignItems: 'center',
              flex: 1,
              maxWidth: 80,
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
              }}>
                Sarah
              </Text>
            </View>

            {/* Contact 2 */}
            <View style={{
              alignItems: 'center',
              flex: 1,
              maxWidth: 80,
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
              }}>
                Ahmed
              </Text>
            </View>

            {/* Contact 3 */}
            <View style={{
              alignItems: 'center',
              flex: 1,
              maxWidth: 80,
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
              }}>
                Fatima
              </Text>
            </View>

            {/* More contacts */}
            <View style={{
              alignItems: 'center',
              flex: 1,
              maxWidth: 80,
            }}>
              <View style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 8,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 10,
                elevation: 4,
                borderWidth: 0.5,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                overflow: 'hidden',
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  opacity: 0.9,
                  letterSpacing: -0.2,
                  lineHeight: 16,
                }}>
                  +
                </Text>
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
              }}>
                more
              </Text>
            </View>
          </View>
        ) : (
          // Companion+ and Mentorship+ show different content
          <View style={{
            alignItems: 'center',
            width: '100%',
            flex: 1,
            justifyContent: 'center',
          }}>
            {subscriptionTier === 'Companion+' ? (
              // Companion+ shows companion profile and status
              <View style={{
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
                flex: 1,
              }}>
                {/* Companion Avatar */}
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 12,
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 12,
                  elevation: 6,
                  overflow: 'hidden',
                }}>
                  <Image
                    source={require('../assets/images/memoji2.png')}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 35,
                    }}
                  />
                  {/* Online status indicator */}
                  <View style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: '#34C759',
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                  }} />
                </View>
                
                {/* Companion Name */}
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  marginBottom: 4,
                }}>
                  Omar Hassan
                </Text>
                
                {/* Status */}
                <Text style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  opacity: 0.8,
                }}>
                  Online • Available
                </Text>
              </View>
            ) : subscriptionTier === 'Mentorship+' ? (
              // Mentorship+ shows clean, readable mentor interface
              <View style={{
                width: '100%',
                flex: 1,
                justifyContent: 'flex-start',
                paddingTop: 0,
                paddingBottom: 8,
                marginTop: -8,
              }}>
                {/* Top Section - Mentor Profile */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  {/* Mentor Avatar */}
                  <View style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 14,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 4,
                    overflow: 'hidden',
                  }}>
                    <Image
                      source={require('../assets/images/memoji1.png')}
                      style={{
                        width: 68,
                        height: 68,
                        borderRadius: 34,
                      }}
                    />
                    {/* Premium badge */}
                    <View style={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: '#FFD700',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 2,
                      borderColor: '#FFFFFF',
                    }}>
                      <Text style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: '#000000',
                      }}>
                        ★
                      </Text>
                    </View>
                  </View>
                  
                  {/* Mentor Info */}
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#FFFFFF',
                      fontFamily: 'System',
                      marginBottom: 3,
                    }}>
                      Dr. Hassan
                    </Text>
                    <Text style={{
                      fontSize: 13,
                      fontWeight: '500',
                      color: '#FFFFFF',
                      fontFamily: 'System',
                      opacity: 0.8,
                      marginBottom: 4,
                    }}>
                      Islamic Counselor
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                      <View style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#34C759',
                        marginRight: 6,
                      }} />
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: '#FFFFFF',
                        fontFamily: 'System',
                        opacity: 0.9,
                      }}>
                        Available
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Bottom Section - Action Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#00C1CA',
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    borderRadius: 10,
                    alignItems: 'center',
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                  onPress={handlePress}
                  activeOpacity={0.8}
                >
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: '#FFFFFF',
                    fontFamily: 'System',
                  }}>
                    Book Session
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
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
          padding: 20,
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
        gap: 16,
      }}>
        {/* Sparkling Logo - Single Large Sparkle */}
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Single sparkle like in nav bar */}
          <IconSymbol
            name="sparkles"
            size={80}
            color="#3B82F6"
          />
        </View>

        {/* Ask Minara AI Text */}
        <Text style={{
          fontSize: 16,
          fontWeight: '600',
          color: isDarkMode ? '#FFFFFF' : '#000000',
          fontFamily: '-apple-system',
          textAlign: 'center',
          letterSpacing: 0.2,
        }}>
          Ask Minara AI
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const CalendarWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => {
  const router = useRouter();
  const { getNextUpcomingEvent, events } = useCalendar();
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[today.getDay()];
  const currentDate = today.getDate().toString().padStart(2, '0');

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/calendar');
  };

  // Get the next upcoming event
  const nextEvent = getNextUpcomingEvent();

  // Format event date and time for widget display
  const formatEventForWidget = (event: any) => {
    if (!event) return null;

    const startDate = event.start.dateTime || event.start.date;
    if (!startDate) return null;

    const start = new Date(startDate);
    const end = new Date(event.end.dateTime || event.end.date || startDate);
    
    // Check if it's an all-day event
    if (event.start.date && !event.start.dateTime) {
      return {
        title: event.summary,
        location: event.location || '',
        time: 'All day',
        duration: '',
      };
    }

    // Calculate duration
    const durationMs = end.getTime() - start.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    let duration = '';
    if (durationHours > 0) {
      duration = `(${durationHours}h`;
      if (durationMinutes > 0) {
        duration += ` ${durationMinutes}m)`;
      } else {
        duration += ')';
      }
    } else if (durationMinutes > 0) {
      duration = `(${durationMinutes}m)`;
    }

    return {
      title: event.summary,
      location: event.location || '',
      time: start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
      duration,
    };
  };

  const formattedEvent = formatEventForWidget(nextEvent);

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        baseWidgetStyle, 
        { 
          backgroundColor: '#1B2951', // Navy blue background
          padding: 16,
          paddingTop: 12,
          position: 'relative',
          overflow: 'hidden',
          shadowColor: '#0F1A3A',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
        }
      ]}
    >
      {/* Darker blue section in top-right corner with graduation */}
      <View style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '65%', // Slightly larger for better blending
        height: '55%',
        backgroundColor: '#2A4F7A', // Darkest blue
        opacity: 0.9,
      }} />
      
      {/* Gradient layer 1 - Medium dark transition */}
      <View style={{
        position: 'absolute',
        top: 0,
        right: '50%',
        width: '40%',
        height: '45%',
        backgroundColor: '#3A6B8A', // Medium dark blue
        opacity: 0.7,
      }} />
      
      {/* Gradient layer 2 - Light transition */}
      <View style={{
        position: 'absolute',
        top: 0,
        right: '35%',
        width: '30%',
        height: '35%',
        backgroundColor: '#4A7BA7', // Lighter transition
        opacity: 0.5,
      }} />
      
      {/* Gradient layer 3 - Final blend */}
      <View style={{
        position: 'absolute',
        top: 0,
        right: '25%',
        width: '25%',
        height: '25%',
        backgroundColor: '#5A8BC4', // Final blend color
        opacity: 0.3,
      }} />
      
      {/* Enhanced frosty blur overlay ON TOP of everything */}
      <BlurView
        intensity={120} // Dramatically increased from 70 for much more blur
        tint="light"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      {/* Red notification bubble - show count of events */}
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
        borderColor: '#1B2951',
        zIndex: 2,
      }}>
        <Text style={{
          fontSize: 11,
          fontWeight: 'bold',
          color: '#FFFFFF',
          fontFamily: 'System',
          letterSpacing: -0.3,
          lineHeight: 14,
          textAlign: 'center',
        }}>{events.length}</Text>
      </View>

      <View style={{
        flex: 1,
        justifyContent: 'flex-start',
        zIndex: 1,
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
          color: '#FFFFFF',
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
            backgroundColor: '#FFFFFF',
            marginRight: 6,
          }} />
          <Text style={{
            fontSize: 12,
            fontWeight: 'bold',
            color: '#FFFFFF',
            fontFamily: 'System',
          }}>
            Upcoming
          </Text>
        </View>

        {/* Events list */}
        <View style={{ flex: 1 }}>
          {formattedEvent ? (
            /* Next upcoming event */
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
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  marginBottom: 1,
                  lineHeight: 14,
                }} numberOfLines={1}>
                  {formattedEvent.title}
                </Text>
                {formattedEvent.location && (
                  <Text style={{
                    fontSize: 10,
                    fontWeight: 'normal',
                    color: '#FFFFFF',
                    fontFamily: 'System',
                    marginBottom: 1,
                    lineHeight: 12,
                    opacity: 0.8,
                  }} numberOfLines={1}>
                    {formattedEvent.location}
                  </Text>
                )}
                <Text style={{
                  fontSize: 10,
                  fontWeight: 'normal',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  lineHeight: 12,
                  opacity: 0.8,
                }}>
                  {formattedEvent.time} {formattedEvent.duration}
                </Text>
              </View>
            </View>
          ) : (
            /* No upcoming events */
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 6,
            }}>
              <View style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#5AC8FA',
                marginRight: 6,
                marginTop: 4,
              }} />
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  marginBottom: 1,
                  lineHeight: 14,
                }}>
                  No upcoming events
                </Text>
                <Text style={{
                  fontSize: 10,
                  fontWeight: 'normal',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  lineHeight: 12,
                  opacity: 0.8,
                }}>
                  Enjoy your free time! 🎉
                </Text>
              </View>
            </View>
          )}
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
  const scrollViewRef = useRef<AnimatedReanimated.ScrollView>(null);

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
          <PageView key={`habit-${habit.id}-copy-${copy}-index-${i}-page-${pageIndex}`} index={pageIndex}>
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
        <AnimatedReanimated.ScrollView
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
        </AnimatedReanimated.ScrollView>

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
          {habits.map((habit, index) => (
            <DotComponent key={`dot-${habit.id}-${index}`} index={index} />
          ))}
        </View>
      </View>
    </TapGestureHandler>
  );
};

export const InspireWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = React.useState(0);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const islamicQuotes = [
    {
      text: "Indeed, with hardship comes ease.",
      reference: "Quran 94:6"
    },
    {
      text: "Allah is sufficient for us.",
      reference: "Quran 3:173"
    },
    {
      text: "So remember Me; I will remember you.",
      reference: "Quran 2:152"
    },
    {
      text: "The best among you are those who have the best character.",
      reference: "Prophet Muhammad ﷺ"
    },
    {
      text: "Whoever relies upon Allah - He is sufficient for him.",
      reference: "Quran 65:3"
    },
    {
      text: "Be kind, for kindness beautifies everything.",
      reference: "Prophet Muhammad ﷺ"
    },
    {
      text: "Verily, in the remembrance of Allah do hearts find rest.",
      reference: "Quran 13:28"
    },
    {
      text: "The strong person controls himself when angry.",
      reference: "Prophet Muhammad ﷺ"
    },
    {
      text: "And He is with you wherever you are.",
      reference: "Quran 57:4"
    },
    {
      text: "Speak good or remain silent.",
      reference: "Prophet Muhammad ﷺ"
    }
  ];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/inspire');
  };

  // Function to animate quote transition
  const animateQuoteChange = (newIndex: number) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Change quote
      setCurrentQuoteIndex(newIndex);
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Function to render text with translucent key words
  const renderStyledText = (quote: { text: string; reference: string }) => {
    const keyWords = ['Allah', 'Me', 'He', 'hardship', 'ease', 'kind', 'kindness', 'hearts', 'strong', 'good'];
    const words = quote.text.split(' ');
    
    return (
      <>
        <Text style={{
          textAlign: 'left',
          lineHeight: 24,
          marginBottom: 2,
        }}>
          {words.map((word, index) => {
            const cleanWord = word.replace(/[.,;:!?]/g, ''); // Remove punctuation for comparison
            const isKeyWord = keyWords.some(keyWord => 
              cleanWord.toLowerCase() === keyWord.toLowerCase()
            );
            
            return (
              <Text
                key={index}
                style={{
                  opacity: isKeyWord ? 0.7 : 1,
                  fontSize: 21,
                  fontWeight: '800',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  letterSpacing: -0.4,
                }}
              >
                {word}{index < words.length - 1 ? ' ' : ''}
              </Text>
            );
          })}
        </Text>
        <Text style={{
          fontSize: 10,
          color: '#FFFFFF',
          opacity: 1,
          fontFamily: 'System',
          fontWeight: '500',
          textAlign: 'left',
        }}>
          {quote.reference}
        </Text>
      </>
    );
  };

  // Rotate quotes every 30 seconds with animation
  React.useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentQuoteIndex + 1) % islamicQuotes.length;
      animateQuoteChange(nextIndex);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [currentQuoteIndex, islamicQuotes.length]);

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        baseWidgetStyle, 
        { 
          backgroundColor: '#6B9BD1', // Darker blue base
          padding: 20,
          shadowColor: '#4A7BA7',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
          overflow: 'hidden', // Ensure gradient layers don't exceed bounds
        }
      ]}
    >
      {/* Darker blue section in top-right corner with graduation */}
      <View style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '65%', // Slightly larger for better blending
        height: '55%',
        backgroundColor: '#2A4F7A', // Darkest blue
        opacity: 0.9,
      }} />
      
      {/* Gradient layer 1 - Medium dark transition */}
      <View style={{
        position: 'absolute',
        top: 0,
        right: '50%',
        width: '40%',
        height: '45%',
        backgroundColor: '#3A6B8A', // Medium dark blue
        opacity: 0.7,
      }} />
      
      {/* Gradient layer 2 - Light transition */}
      <View style={{
        position: 'absolute',
        top: 0,
        right: '35%',
        width: '30%',
        height: '35%',
        backgroundColor: '#4A7BA7', // Lighter transition
        opacity: 0.5,
      }} />
      
      {/* Gradient layer 3 - Final blend */}
      <View style={{
        position: 'absolute',
        top: 0,
        right: '25%',
        width: '25%',
        height: '25%',
        backgroundColor: '#5A8BC4', // Final blend color
        opacity: 0.3,
      }} />
      
      {/* Enhanced frosty blur overlay ON TOP of everything */}
      <BlurView
        intensity={120} // Dramatically increased from 70 for much more blur
        tint="light"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      
      <Animated.View style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        zIndex: 1,
        opacity: fadeAnim,
      }}>
        {renderStyledText(islamicQuotes[currentQuoteIndex])}
      </Animated.View>
    </TouchableOpacity>
  );
};

export const JournalWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => {
  const router = useRouter();
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[today.getDay()];

  // Journal prompts array - moved outside to prevent recreation
  const journalPrompts = React.useMemo(() => [
    "What lessons did you learn today?",
    "What are you most grateful for?",
    "How did you grow today?",
    "What challenged you today?",
    "What positive impact did you make?",
    "What would you do differently?",
    "What brought you joy today?",
    "How did you practice your faith?",
    "What are you looking forward to?",
    "What act of kindness did you see today?"
  ], []);

  const [currentPromptIndex, setCurrentPromptIndex] = React.useState(0);

  const handlePress = React.useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/journal');
  }, []);

  const handleRefresh = React.useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % journalPrompts.length);
  }, [journalPrompts.length]);

  // Function to render text with translucent unimportant words
  const renderStyledPrompt = (prompt: string) => {
    const unimportantWords = ['did', 'you', 'are', 'to', 'a', 'an', 'the', 'of', 'for', 'would', 'do'];
    const words = prompt.split(' ');
    
    return (
      <Text style={{ textAlign: 'left', lineHeight: 24 }}>
        {words.map((word, index) => {
          const cleanWord = word.replace(/[.,;:!?]/g, '').toLowerCase();
          const isUnimportant = unimportantWords.includes(cleanWord);
          
          return (
            <Text
              key={index}
              style={{
                fontSize: 19,
                fontWeight: '800',
                color: '#FFFFFF',
                fontFamily: 'System',
                lineHeight: 23,
                letterSpacing: -0.3,
                opacity: isUnimportant ? 0.6 : 1,
              }}
            >
              {word}{index < words.length - 1 ? ' ' : ''}
            </Text>
          );
        })}
      </Text>
    );
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
      style={[
        baseWidgetStyle, 
        { 
          backgroundColor: '#6B4C93', // Darker base purple color
          padding: 22,
          shadowColor: '#4A3366',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
          overflow: 'hidden',
        }
      ]}
    >
      {/* Gradient Layer 1 - Smaller and darker bottom effect */}
      <View style={{
        position: 'absolute',
        bottom: -30,
        left: -30,
        right: -30,
        height: '80%', // Reduced from 120% to make it smaller
        backgroundColor: '#4A3366',
        opacity: 0.8,
        borderRadius: 45,
      }} />
      
      {/* Gradient Layer 2 - Smaller additional depth */}
      <View style={{
        position: 'absolute',
        bottom: -20,
        left: -20,
        right: -20,
        height: '60%', // Reduced from 100% to make it smaller
        backgroundColor: '#3A2952',
        opacity: 0.6,
        borderRadius: 35,
      }} />
      
      {/* Increased frosty blur overlay */}
      <BlurView
        intensity={45} // Increased from 25 to make it more blurry
        tint="light"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 30,
        }}
      />

      <View style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        zIndex: 1,
        paddingTop: 0,
      }}>
        {/* Day of week */}
        <View style={{ width: '100%', alignItems: 'flex-start' }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#FFFFFF',
            fontFamily: 'System',
            opacity: 0.9,
            marginBottom: 2,
          }}>
            {currentDay}
          </Text>
        </View>

        {/* Journal prompt */}
        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 0, marginTop: 4 }}>
          {renderStyledPrompt(journalPrompts[currentPromptIndex])}
        </View>

        {/* Action buttons */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          gap: 10,
          paddingHorizontal: 16,
          marginTop: 3,
          marginBottom: -4,
          position: 'absolute',
          bottom: -4,
        }}>
          {/* New button */}
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 22,
              paddingHorizontal: 16,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            <Text style={{
              fontSize: 15,
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'System',
              marginRight: 6,
            }}>
              ✏️ New
            </Text>
          </TouchableOpacity>

          {/* Refresh button */}
          <TouchableOpacity
            onPress={handleRefresh}
            activeOpacity={0.8}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const AffinityGroupsWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => {
  const router = useRouter();
  const [joinedGroups, setJoinedGroups] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Affinity groups data (matching the structure from the app)
  const AFFINITY_GROUPS = [
    { id: '1', emoji: '🍽️', name: 'Halal Foodies Club', tagline: 'Share halal recipes, local halal spots, snacks from different cultures', memberCount: 1247 },
    { id: '2', emoji: '🎮', name: 'Muslim Gamers', tagline: 'Talk about favorite games, set up casual halal game nights', memberCount: 892 },
    { id: '3', emoji: '📚', name: 'Muslim Book/Anime Club', tagline: 'Share your fav Islamic books, anime, manga, or shows', memberCount: 634 },
    { id: '4', emoji: '✈️', name: 'Revert Travel Chat', tagline: 'Talk Umrah dreams, halal travel hacks, Muslim-friendly destinations', memberCount: 456 },
    { id: '5', emoji: '📸', name: 'Aesthetic Muslims', tagline: 'Share Islamic aesthetic pics, clothing inspo, room decor, wallpapers', memberCount: 789 },
    { id: '6', emoji: '🛍️', name: 'Modest Fashion Talk', tagline: 'Share fits, brands, modest wear inspo (hijabi fashion, thobes, etc.)', memberCount: 923 },
    { id: '7', emoji: '💼', name: 'Career & Resume Circle', tagline: 'Job advice, resume tips, halal work discussions', memberCount: 567 },
    { id: '8', emoji: '💸', name: 'Halal Hustle Chat', tagline: 'Side hustles, selling, halal investing, business ideas', memberCount: 834 },
    { id: '9', emoji: '🧠', name: 'Memory & Quran Hacks', tagline: 'Productivity tips, how to stay on track memorizing, habit building', memberCount: 445 },
    { id: '10', emoji: '🎯', name: 'Muslim Productivity Tools', tagline: 'Apps, systems, routines to keep deen + dunya on point', memberCount: 312 },
    { id: '11', emoji: '🌙', name: 'Ramadan Prep & Vibes', tagline: 'Only open during Ramadan seasons — recipes, goals, support', memberCount: 1834 },
    { id: '12', emoji: '💭', name: 'Late Night Deen Thoughts', tagline: 'Chatroom for deep convos about Allah, doubts, afterlife, etc.', memberCount: 678 },
    { id: '13', emoji: '🧎', name: 'Salah Struggles & Wins', tagline: 'Talk honestly about struggles staying consistent, wins, reminders', memberCount: 924 },
    { id: '14', emoji: '🤲', name: 'Du\'a Board', tagline: 'Share what you need du\'a for and make du\'a for others', memberCount: 1245 },
    { id: '15', emoji: '😔', name: 'Loneliness & Isolation', tagline: 'For people who just feel lost or alone in the revert journey', memberCount: 543 },
    { id: '16', emoji: '👨‍👩‍👧‍👦', name: 'Family Drama Vent Room', tagline: 'Talk family struggles, boundaries, non-Muslim tensions', memberCount: 387 },
    { id: '17', emoji: '😤', name: 'Dealing With Anger', tagline: 'Especially for brothers who need a space to cool off, vent', memberCount: 289 },
    { id: '18', emoji: '💕', name: 'Self-Love & Muslim Identity', tagline: 'Loving yourself while growing into your Muslim identity', memberCount: 734 },
    { id: '19', emoji: '🤷‍♂️', name: 'I Don\'t Know What I\'m Doing', tagline: 'A totally non-judgy room for asking even the "dumbest" questions', memberCount: 2145 },
    { id: '20', emoji: '⏱️', name: 'Just Reverted - Day 1 Club', tagline: 'For people who just took shahada or are days/weeks in', memberCount: 678 },
    { id: '21', emoji: '🧕', name: 'How to Be Muslim 101', tagline: 'Practical help: how to pray, make wudu, what to say, what to avoid', memberCount: 1834 },
    { id: '22', emoji: '💬', name: 'Cringe Moments & Mistakes', tagline: 'Laugh and learn from Islamic fails — converts tell all', memberCount: 923 },
  ];

  // Load joined groups from AsyncStorage
  React.useEffect(() => {
    const loadJoinedGroups = async () => {
      try {
        const savedJoinedGroups = await AsyncStorage.getItem('joinedAffinityGroups');
        if (savedJoinedGroups) {
          const parsedGroups = JSON.parse(savedJoinedGroups);
          setJoinedGroups(parsedGroups);
        }
      } catch (error) {
        console.log('Error loading joined groups:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadJoinedGroups();
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/affinity-groups');
  };

  const handleGroupPress = (groupId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const group = AFFINITY_GROUPS.find(g => g.id === groupId);
    if (group) {
      router.push({
        pathname: '/group-chat',
        params: {
          groupName: group.name,
          groupEmoji: group.emoji,
          groupId: group.id,
        }
      });
    }
  };

  // Get user's enrolled groups (limit to 2 for the widget, show remainder count)
  const allUserGroups = AFFINITY_GROUPS.filter(group => joinedGroups.includes(group.id));
  const userGroups = allUserGroups.slice(0, 2);
  const remainingCount = allUserGroups.length - 2;

  if (isLoading) {
    return (
      <View style={[
        baseWidgetStyle, 
        { 
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }
      ]}>
        <Text style={{ fontSize: 12, color: colors.secondaryText }}>Loading...</Text>
      </View>
    );
  }

  // Empty state when user has no groups
  if (userGroups.length === 0) {
    return (
      <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.8}
        style={[
          baseWidgetStyle, 
          { 
            backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
            padding: 20,
          }
        ]}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 28,
            textAlign: 'center',
            marginBottom: 8,
          }}>🧩</Text>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: colors.primaryText,
            textAlign: 'center',
            marginBottom: 4,
            fontFamily: 'System',
          }}>
            Affinity Groups
          </Text>
          <Text style={{
            fontSize: 12,
            color: colors.secondaryText,
            textAlign: 'center',
            fontFamily: 'System',
          }}>
            Find your people
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[
      baseWidgetStyle, 
      { 
        backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        padding: 16,
      }
    ]}>
      {/* Header */}
      <Text style={{
        fontSize: 15,
        fontWeight: '600',
        color: colors.primaryText,
        marginBottom: 6,
        fontFamily: 'System',
      }}>
        Affinity Groups
      </Text>

      {/* Groups List */}
      <View style={{ flex: 1, justifyContent: 'flex-start', minHeight: 80 }}>
        {userGroups.map((group, index) => (
          <View key={group.id}>
            <TouchableOpacity
              onPress={() => handleGroupPress(group.id)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 3,
                marginBottom: 1,
              }}
            >
              <Text style={{
                fontSize: 18,
                marginRight: 10,
              }}>
                {group.emoji}
              </Text>
              <Text style={{
                fontSize: 13,
                fontWeight: '500',
                color: colors.primaryText,
                flex: 1,
                fontFamily: 'System',
              }} numberOfLines={1}>
                {group.name}
              </Text>
            </TouchableOpacity>
            
            {/* Show remaining count under the 2nd group */}
            {index === 1 && remainingCount > 0 && (
              <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 3,
                  marginBottom: 1,
                }}
              >
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: colors.primaryText,
                  marginRight: 10,
                  fontFamily: 'System',
                  width: 18, // Same width as emoji space
                  textAlign: 'center',
                }}>
                  +{remainingCount}
                </Text>
                <Text style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: colors.primaryText,
                  flex: 1,
                  fontFamily: 'System',
                }} numberOfLines={1}>
                  More Groups
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* View My Groups Button with Light Blue Gradient */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={{
          marginTop: 8,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={['#87CEEB', '#ADD8E6']} // Light blue gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{
            fontSize: 13,
            fontWeight: '600',
            color: '#FFFFFF',
            fontFamily: 'System',
          }}>
            View My Groups
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

