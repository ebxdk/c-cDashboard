import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
  isDarkMode: boolean;
}

const ModelSelectorMenu: React.FC<ModelSelectorProps> = ({ selectedModel, onModelSelect, isDarkMode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonLayout, setButtonLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;
  const buttonRef = useRef<View>(null);

  const models = [
    { id: 'MinaraX', name: 'MinaraX', icon: '✨', description: 'Islamic AI Assistant' },
    { id: 'ScholarX', name: 'ScholarX', icon: '📚', description: 'Scholarly Research' },
    { id: 'DebateX', name: 'DebateX', icon: '🎯', description: 'Debate & Discussion' },
  ];

  const colors = {
    background: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    cardBackground: isDarkMode ? '#2C2C2E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#6B7280',
    selectedBackground: isDarkMode ? 'rgba(0, 122, 255, 0.2)' : 'rgba(0, 122, 255, 0.1)',
    selectedBorder: '#007AFF',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    shadow: isDarkMode ? '#000000' : '#000000',
    overlay: isDarkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.4)',
  };

  const openMenu = () => {
    buttonRef.current?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      setButtonLayout({ x: pageX, y: pageY, width, height });
      setIsVisible(true);
      
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 300,
          friction: 20,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -10,
        duration: 150,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  };

  const handleModelSelect = (modelId: string) => {
    onModelSelect(modelId);
    closeMenu();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const selectedModelData = models.find(m => m.id === selectedModel);

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        ref={buttonRef}
        onPress={openMenu}
        style={[styles.modelSelectorButton, {
          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
        }]}
        activeOpacity={0.7}
      >
        <Text style={[styles.modelSelectorIcon, { color: colors.primaryText }]}>
          {selectedModelData?.icon}
        </Text>
        <Text style={[styles.modelSelectorText, { color: colors.primaryText }]}>
          {selectedModelData?.name}
        </Text>
        <Text style={[styles.modelSelectorChevron, { color: colors.secondaryText }]}>
          ▼
        </Text>
      </TouchableOpacity>

      {/* Modal Popup */}
      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeMenu}
      >
        <TouchableWithoutFeedback onPress={closeMenu}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalBackground,
                {
                  backgroundColor: colors.overlay,
                  opacity: fadeAnim,
                }
              ]}
            />
            {/* Strong overlay behind the card */}
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.18)',
                zIndex: 999,
              }}
            />
            {/* Distinct card border */}
            <View
              style={{
                position: 'absolute',
                left: buttonLayout.x,
                top: buttonLayout.y + buttonLayout.height + 8,
                minWidth: buttonLayout.width,
                width: 280,
                borderRadius: 16,
                borderWidth: 4,
                borderColor: '#000',
                backgroundColor: '#FFF',
                zIndex: 1001,
              }}
            />
            <Animated.View
              style={[
                styles.dropdownMenu,
                {
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                  borderWidth: 0,
                  left: buttonLayout.x,
                  top: buttonLayout.y + buttonLayout.height + 8,
                  minWidth: buttonLayout.width,
                  opacity: fadeAnim,
                  transform: [
                    { scale: scaleAnim },
                    { translateY: slideAnim },
                  ],
                  zIndex: 1002,
                }
              ]}
            >
              {models.map((model, index) => {
                const isSelected = model.id === selectedModel;
                return (
                  <TouchableOpacity
                    key={model.id}
                    onPress={() => handleModelSelect(model.id)}
                    style={[
                      styles.dropdownItem,
                      {
                        backgroundColor: isSelected ? colors.selectedBackground : 'transparent',
                        borderColor: isSelected ? colors.selectedBorder : 'transparent',
                        borderBottomColor: index < models.length - 1 ? colors.border : 'transparent',
                      }
                    ]}
                    activeOpacity={0.6}
                  >
                    <View style={styles.dropdownItemLeft}>
                      <Text style={[styles.dropdownItemIcon, { color: colors.primaryText }]}>
                        {model.icon}
                      </Text>
                      <View style={styles.dropdownItemTextContainer}>
                        <Text style={[
                          styles.dropdownItemName, 
                          { 
                            color: colors.primaryText,
                            fontWeight: isSelected ? '600' : '500'
                          }
                        ]}>
                          {model.name}
                        </Text>
                        <Text style={[styles.dropdownItemDescription, { color: colors.secondaryText }]}>
                          {model.description}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Text style={[styles.checkmark, { color: colors.selectedBorder }]}>
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modelSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 120,
    justifyContent: 'center',
  },
  modelSelectorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  modelSelectorText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
    marginRight: 6,
  },
  modelSelectorChevron: {
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dropdownMenu: {
    position: 'absolute',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 8,
    minWidth: 200,
    maxWidth: 280,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  dropdownItemTextContainer: {
    flex: 1,
  },
  dropdownItemName: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
    marginBottom: 2,
  },
  dropdownItemDescription: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'System',
    opacity: 0.8,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ModelSelectorMenu; 