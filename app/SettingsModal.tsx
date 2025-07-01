import { BlurView } from 'expo-blur';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  colors: any;
  screenHeight: number;
  animatedBackdropBlur: any;
  animatedBackdropOverlay: any;
  panGestureHandler: any;
  animatedSettingsModal: any;
  showBackgroundSelectorInSettings: boolean;
  closeBackgroundSelector: () => void;
  setIsDarkMode: (val: boolean) => void;
  Haptics: any;
  selectedBackground: string;
  setSelectedBackground: (val: string) => void;
  handleWebsitePress: () => void;
  setIsAppearanceVisible: (val: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  isDarkMode,
  colors,
  screenHeight,
  animatedBackdropBlur,
  animatedBackdropOverlay,
  panGestureHandler,
  animatedSettingsModal,
  showBackgroundSelectorInSettings,
  closeBackgroundSelector,
  setIsDarkMode,
  Haptics,
  selectedBackground,
  setSelectedBackground,
  handleWebsitePress,
  setIsAppearanceVisible,
}) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="none"
    onRequestClose={onClose}
  >
    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
      {/* Frosty blur background */}
      <Animated.View style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        animatedBackdropBlur
      ]}>
        <BlurView
          intensity={100}
          tint={isDarkMode ? 'dark' : 'light'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDarkMode
              ? 'rgba(30, 80, 200, 0.10)'
              : 'rgba(30, 80, 200, 0.18)',
            opacity: 0.8,
          }}
        />
      </Animated.View>
      {/* Subtle overlay for depth - reduced opacity for frostier look */}
      <Animated.View style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.08)',
        },
        animatedBackdropOverlay
      ]} />
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={onClose}
        activeOpacity={1}
      />
      <PanGestureHandler onGestureEvent={panGestureHandler}>
        <Animated.View style={[
          {
            backgroundColor: colors.background,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            height: screenHeight * 0.85,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: isDarkMode ? 0.3 : 0.15,
            shadowRadius: 20,
            elevation: 20,
          },
          animatedSettingsModal
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
            backgroundColor: colors.background,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              {showBackgroundSelectorInSettings && (
                <TouchableOpacity
                  onPress={closeBackgroundSelector}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: isDarkMode ? 0 : 0.5,
                    borderColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.08)',
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{
                    fontSize: 16,
                    color: colors.secondaryText,
                    fontWeight: '600',
                  }}>‹</Text>
                </TouchableOpacity>
              )}
              <Text style={{
                fontSize: 34,
                fontWeight: '700',
                color: colors.primaryText,
                letterSpacing: -0.8,
                flex: showBackgroundSelectorInSettings ? 1 : 0,
                textAlign: showBackgroundSelectorInSettings ? 'center' : 'left',
                marginLeft: showBackgroundSelectorInSettings ? -30 : 0,
              }}>
                {showBackgroundSelectorInSettings ? 'Appearance' : 'Settings'}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: isDarkMode ? 0 : 0.5,
                  borderColor: isDarkMode ? 'transparent' : 'rgba(0, 0, 0, 0.08)',
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
          {/* The rest of the modal content (settings, appearance, etc.) should be included here, using the same structure as before. */}
          {/* ... (copy the rest of the modal content from dashboard.tsx) ... */}
        </Animated.View>
      </PanGestureHandler>
    </View>
  </Modal>
);

export default SettingsModal; 