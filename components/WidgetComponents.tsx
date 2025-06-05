import React from 'react';
import { Image, Text, View } from 'react-native';

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

export const CohortContactsWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[
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
  ]}>
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
            fontFamily: 'Poppins-Regular',
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
            fontFamily: 'Poppins-Regular',
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
            fontFamily: 'Poppins-Regular',
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
                fontFamily: 'Poppins-Regular',
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
              }}>12+</Text>
            </View>
          </View>

          <Text style={{
            fontSize: 12,
            fontWeight: '500',
            color: '#FFFFFF',
            fontFamily: 'Poppins-Regular',
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
          fontFamily: 'Poppins-Regular',
          opacity: 0.9,
          letterSpacing: -0.2,
        }}>Cohort</Text>
      </View>
    </View>
  </View>
);

export const MinaraWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[
    baseWidgetStyle, 
    { 
      backgroundColor: isDarkMode ? '#1C1C1E' : '#F8F9FA',
      padding: 16,
      // Apple-style gradient overlay
      background: isDarkMode 
        ? 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 50%, #1A1A1C 100%)'
        : 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 50%, #F5F5F7 100%)',
      shadowColor: isDarkMode ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDarkMode ? 0.15 : 0.08,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: isDarkMode ? 0.5 : 1,
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
    }
  ]}>
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
          fontFamily: 'Poppins-Regular',
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
  </View>
);

export const CalendarWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();
  
  // Get month name
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Create calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before first day of month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  // Mock events for demonstration (you can replace with real data)
  const eventsOnDays = [3, 7, 15, 22, 28]; // Days with events
  
  return (
    <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
      <View style={{
        flex: 1,
        padding: 12,
      }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            color: isDarkMode ? '#FFFFFF' : '#000000',
            fontFamily: 'Poppins-Regular',
          }}>
            {monthNames[currentMonth].substring(0, 3)}
          </Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: isDarkMode ? '#8E8E93' : '#6B6B6B',
            fontFamily: 'Poppins-Regular',
          }}>
            {currentYear}
          </Text>
        </View>
        
        {/* Day labels */}
        <View style={{
          flexDirection: 'row',
          marginBottom: 8,
        }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayLabel, index) => (
            <View key={index} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{
                fontSize: 10,
                fontWeight: '600',
                color: isDarkMode ? '#8E8E93' : '#8E8E93',
                fontFamily: 'Poppins-Regular',
              }}>
                {dayLabel}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Calendar grid */}
        <View style={{ flex: 1 }}>
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, rowIndex) => (
            <View key={rowIndex} style={{
              flexDirection: 'row',
              flex: 1,
              marginBottom: 2,
            }}>
              {Array.from({ length: 7 }, (_, colIndex) => {
                const dayIndex = rowIndex * 7 + colIndex;
                const day = calendarDays[dayIndex];
                const isToday = day === currentDate;
                const hasEvent = day && eventsOnDays.includes(day);
                
                return (
                  <View key={colIndex} style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 2,
                  }}>
                    {day && (
                      <View style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: isToday 
                          ? (isDarkMode ? '#0A84FF' : '#007AFF')
                          : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}>
                        <Text style={{
                          fontSize: 12,
                          fontWeight: isToday ? '700' : '500',
                          color: isToday 
                            ? '#FFFFFF'
                            : (isDarkMode ? '#FFFFFF' : '#000000'),
                          fontFamily: 'Poppins-Regular',
                        }}>
                          {day}
                        </Text>
                        {hasEvent && !isToday && (
                          <View style={{
                            position: 'absolute',
                            bottom: -2,
                            width: 4,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: isDarkMode ? '#FF9F0A' : '#FF9500',
                          }} />
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
        
        {/* Footer with next event */}
        <View style={{
          marginTop: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
        }}>
          <Text style={{
            fontSize: 10,
            fontWeight: '500',
            color: isDarkMode ? '#8E8E93' : '#8E8E93',
            fontFamily: 'Poppins-Regular',
            textAlign: 'center',
          }}>
            Next: Team Meeting Tomorrow 2:00 PM
          </Text>
        </View>
      </View>
    </View>
  );
};

export const AskAIWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
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
        fontFamily: 'Poppins-Regular',
      }}>
        🤖 Ask AI
      </Text>
      <Text style={{
        fontSize: 12,
        color: isDarkMode ? '#8E8E93' : '#6B6B6B',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
      }}>
        Get quick answers
      </Text>
    </View>
  </View>
);

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
        fontFamily: 'Poppins-Regular',
      }}>
        🕌 Prayer
      </Text>
      <Text style={{
        fontSize: 12,
        color: isDarkMode ? '#8E8E93' : '#6B6B6B',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
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
        fontFamily: 'Poppins-Regular',
      }}>
        📝 Journal
      </Text>
      <Text style={{
        fontSize: 12,
        color: isDarkMode ? '#8E8E93' : '#6B6B6B',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
      }}>
        Daily reflections
      </Text>
    </View>
  </View>
);

export const CohortWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
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
        fontFamily: 'Poppins-Regular',
      }}>
        👥 Cohort
      </Text>
      <Text style={{
        fontSize: 12,
        color: isDarkMode ? '#8E8E93' : '#6B6B6B',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular',
      }}>
        Group activities
      </Text>
    </View>
  </View>
);