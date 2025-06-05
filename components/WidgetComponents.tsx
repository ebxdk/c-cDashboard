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

export const EventsWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
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
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF', padding: 22 }]}>
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 12,
      paddingRight: 12,
      marginTop: 8,
    }}>
      {/* Main circular chat input */}
      <View style={{
        width: 160,
        height: 65,
        borderRadius: 32,
        backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: isDarkMode ? '#3A3A3C' : '#E5E5EA',
        paddingHorizontal: 16,
      }}>
        <Text style={{
          fontSize: 22,
          marginRight: 10,
        }}>💬</Text>
        <Text style={{
          fontSize: 14,
          color: isDarkMode ? '#8E8E93' : '#8E8E93',
          fontFamily: 'Poppins-Regular',
          flex: 1,
        }}>Ask Minara AI</Text>
      </View>

      {/* Two smaller circular buttons */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        marginBottom: 8,
      }}>
        {/* Camera button */}
        <View style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: isDarkMode ? '#3A3A3C' : '#E5E5EA',
        }}>
          <Text style={{
            fontSize: 22,
            textAlign: 'center',
          }}>📷</Text>
        </View>

        {/* Microphone button */}
        <View style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: isDarkMode ? '#3A3A3C' : '#E5E5EA',
        }}>
          <Text style={{
            fontSize: 22,
            textAlign: 'center',
          }}>🎤</Text>
        </View>
      </View>

    </View>
  </View>
);

export const HabitsWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
);

export const AskAIWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
);

export const PrayerWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
);

export const JournalWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
);

export const CohortWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
); 