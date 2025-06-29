import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Dimensions, ImageBackground, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface BackgroundSelectorProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  selectedBackground: string;
  setSelectedBackground: (value: string) => void;
  colors: any;
}

export const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  visible,
  onClose,
  isDarkMode,
  setIsDarkMode,
  selectedBackground,
  setSelectedBackground,
  colors
}) => {
  // Animation values
  const translateY = useSharedValue(screenHeight);
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  // Animated styles
  const animatedModal = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  const animatedBackdrop = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  // Open animation
  React.useEffect(() => {
    if (visible) {
      translateY.value = screenHeight;
      scale.value = 0.94;
      opacity.value = 0;
      backdropOpacity.value = 0;
      
      const modalSpring = {
        damping: 280,
        stiffness: 800,
        mass: 2,
      };
      
      translateY.value = withSpring(0, modalSpring);
      scale.value = withSpring(1, modalSpring);
      opacity.value = withSpring(1, modalSpring);
      
      backdropOpacity.value = withTiming(1, { 
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
    }
  }, [visible]);

  const handleClose = () => {
    const modalSpring = {
      damping: 320,
      stiffness: 700,
      mass: 2.5,
    };
    
    translateY.value = withSpring(screenHeight, modalSpring, () => {
      runOnJS(onClose)();
    });
    scale.value = withSpring(0.94, modalSpring);
    opacity.value = withSpring(0, modalSpring);
    
    backdropOpacity.value = withTiming(0, { 
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleThemeChange = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleBackgroundChange = (background: string) => {
    setSelectedBackground(background);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={{ 
        flex: 1, 
        justifyContent: 'flex-end',
      }}>
        {/* Backdrop */}
        <Animated.View style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          animatedBackdrop
        ]} />
        
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={handleClose}
          activeOpacity={1}
        />
        
        <Animated.View style={[
          {
            backgroundColor: colors.background,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            height: screenHeight * 0.75,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDarkMode ? 0.3 : 0.15,
            shadowRadius: 20,
            elevation: 20,
          },
          animatedModal
        ]}>
          {/* Drag Handle */}
          <View style={{
            width: 40,
            height: 4,
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            alignSelf: 'center',
            marginTop: 12,
            marginBottom: 8,
          }} />

          {/* Header */}
          <View style={{
            paddingTop: 20,
            paddingHorizontal: 20,
            paddingBottom: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.cardBorder,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Text style={{
                fontSize: 28,
                fontWeight: '700',
                color: colors.primaryText,
                letterSpacing: -0.6,
              }}>
                Choose Background
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                activeOpacity={0.7}
              >
                <Text style={{
                  fontSize: 16,
                  color: colors.secondaryText,
                  fontWeight: '600',
                }}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              padding: 20,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Theme Toggle */}
            <View style={{ marginBottom: 32 }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.primaryText,
                marginBottom: 16,
                letterSpacing: -0.2,
              }}>
                Theme
              </Text>
              
              <View style={{
                flexDirection: 'row',
                backgroundColor: colors.cardBackground,
                borderRadius: 16,
                padding: 4,
                borderWidth: isDarkMode ? 0.5 : 1,
                borderColor: colors.cardBorder,
              }}>
                <TouchableOpacity
                  onPress={() => handleThemeChange(false)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: !isDarkMode ? colors.accent : 'transparent',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: !isDarkMode ? '#FFFFFF' : colors.secondaryText,
                    letterSpacing: -0.1,
                  }}>
                    ☀️ Light
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => handleThemeChange(true)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: isDarkMode ? colors.accent : 'transparent',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '600',
                    color: isDarkMode ? '#FFFFFF' : colors.secondaryText,
                    letterSpacing: -0.1,
                  }}>
                    🌙 Dark
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Background Options */}
            <View>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.primaryText,
                marginBottom: 16,
                letterSpacing: -0.2,
              }}>
                Background Style
              </Text>
              
              <View style={{
                flexDirection: 'row',
                gap: 16,
              }}>
                {/* Pattern Background */}
                <TouchableOpacity
                  onPress={() => handleBackgroundChange('pattern')}
                  style={{
                    flex: 1,
                    aspectRatio: 0.7,
                    borderRadius: 24,
                    overflow: 'hidden',
                    borderWidth: selectedBackground === 'pattern' ? 3 : 2,
                    borderColor: selectedBackground === 'pattern' ? colors.accent : colors.cardBorder,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                  activeOpacity={0.9}
                >
                  {/* Pattern Preview */}
                  <View style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    position: 'relative',
                  }}>
                    <ImageBackground
                      source={require('../assets/images/cc.patterns-01.png')}
                      style={{
                        width: '120%',
                        height: '120%',
                        position: 'absolute',
                        top: '-10%',
                        left: '-10%',
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
                    
                    {/* Mini widgets preview */}
                    <View style={{
                      position: 'absolute',
                      top: 20,
                      left: 12,
                      right: 12,
                      bottom: 20,
                    }}>
                      <View style={{
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                        borderRadius: 8,
                        height: 20,
                        marginBottom: 6,
                      }} />
                      <View style={{
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.03)',
                        borderRadius: 6,
                        height: 30,
                        marginBottom: 6,
                      }} />
                      <View style={{
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.025)',
                        borderRadius: 6,
                        height: 25,
                      }} />
                    </View>
                    
                    {/* Selection indicator */}
                    {selectedBackground === 'pattern' && (
                      <View style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: colors.accent,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <Text style={{
                          fontSize: 14,
                          color: '#FFFFFF',
                          fontWeight: '600',
                        }}>✓</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={{
                    padding: 12,
                    backgroundColor: colors.cardBackground,
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.primaryText,
                      letterSpacing: -0.1,
                    }}>
                      Pattern
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: colors.secondaryText,
                      marginTop: 2,
                    }}>
                      With parallax
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Plain Background */}
                <TouchableOpacity
                  onPress={() => handleBackgroundChange('plain')}
                  style={{
                    flex: 1,
                    aspectRatio: 0.7,
                    borderRadius: 24,
                    overflow: 'hidden',
                    borderWidth: selectedBackground === 'plain' ? 3 : 2,
                    borderColor: selectedBackground === 'plain' ? colors.accent : colors.cardBorder,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                  activeOpacity={0.9}
                >
                  {/* Plain Preview */}
                  <View style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    position: 'relative',
                  }}>
                    {/* Mini widgets preview */}
                    <View style={{
                      position: 'absolute',
                      top: 20,
                      left: 12,
                      right: 12,
                      bottom: 20,
                    }}>
                      <View style={{
                        backgroundColor: colors.cardBackground,
                        borderRadius: 8,
                        height: 20,
                        marginBottom: 6,
                        borderWidth: 0.5,
                        borderColor: colors.cardBorder,
                      }} />
                      <View style={{
                        backgroundColor: colors.cardBackground,
                        borderRadius: 6,
                        height: 30,
                        marginBottom: 6,
                        borderWidth: 0.5,
                        borderColor: colors.cardBorder,
                      }} />
                      <View style={{
                        backgroundColor: colors.cardBackground,
                        borderRadius: 6,
                        height: 25,
                        borderWidth: 0.5,
                        borderColor: colors.cardBorder,
                      }} />
                    </View>
                    
                    {/* Selection indicator */}
                    {selectedBackground === 'plain' && (
                      <View style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: colors.accent,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <Text style={{
                          fontSize: 14,
                          color: '#FFFFFF',
                          fontWeight: '600',
                        }}>✓</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={{
                    padding: 12,
                    backgroundColor: colors.cardBackground,
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: colors.primaryText,
                      letterSpacing: -0.1,
                    }}>
                      Plain
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: colors.secondaryText,
                      marginTop: 2,
                    }}>
                      Clean & simple
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}; 