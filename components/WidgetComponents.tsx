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
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[today.getDay()];
  const currentDate = today.getDate().toString().padStart(2, '0');
  
  return (
    <View style={[
      baseWidgetStyle, 
      { 
        backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
        padding: 16,
        position: 'relative',
      }
    ]}>
      {/* Red notification bubble */}
      <View style={{
        position: 'absolute',
        top: 26,
        right: 8,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
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
          fontSize: 10,
          fontWeight: 'bold',
          color: '#FFFFFF',
          fontFamily: 'Poppins-Regular',
          letterSpacing: -0.3,
          lineHeight: 18,
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
          fontFamily: 'Poppins-Regular',
          marginBottom: 2,
          marginTop: 6,
        }}>
          {currentDay}
        </Text>
        
        {/* Date number */}
        <Text style={{
          fontSize: 44,
          fontWeight: 'bold',
          color: isDarkMode ? '#FFFFFF' : '#000000',
          fontFamily: 'Poppins-Regular',
          lineHeight: 48,
          marginBottom: 16,
          marginTop: 2,
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
            fontFamily: 'Poppins-Regular',
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
                fontFamily: 'Poppins-Regular',
                marginBottom: 1,
                lineHeight: 14,
              }}>
                Iftar Outing
              </Text>
              <Text style={{
                fontSize: 10,
                fontWeight: 'normal',
                color: isDarkMode ? '#8E8E93' : '#8E8E93',
                fontFamily: 'Poppins-Regular',
                marginBottom: 1,
                lineHeight: 12,
              }}>
                Revert Reach Iftar @ GC Ridgeway
              </Text>
              <Text style={{
                fontSize: 10,
                fontWeight: 'normal',
                color: isDarkMode ? '#8E8E93' : '#8E8E93',
                fontFamily: 'Poppins-Regular',
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