import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BackgroundSettingsScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  const [selectedBackground, setSelectedBackground] = useState('gradient1');

  // Load saved background preference
  useEffect(() => {
    const loadBackgroundPreference = async () => {
      try {
        const savedBackground = await AsyncStorage.getItem('selectedBackground');
        if (savedBackground) {
          setSelectedBackground(savedBackground);
        }
      } catch (error) {
        console.log('Error loading background preference:', error);
      }
    };
    loadBackgroundPreference();
  }, []);

  const colors = {
    background: isDarkMode ? '#000000' : '#F2F2F7',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#666666',
    tertiaryText: isDarkMode ? '#636366' : '#999999',
    accent: '#007AFF',
    border: isDarkMode ? '#38383A' : '#C6C6C8',
    separator: isDarkMode ? '#38383A' : '#C6C6C8',
  };

  const gradientPresets = [
    {
      id: 'gradient1',
      name: 'Ocean Breeze',
      colors: ['#667eea', '#764ba2'] as const,
    },
    {
      id: 'gradient2',
      name: 'Sunset Glow',
      colors: ['#f093fb', '#f5576c'] as const,
    },
    {
      id: 'gradient3',
      name: 'Forest Dawn',
      colors: ['#4facfe', '#00f2fe'] as const,
    },
    {
      id: 'gradient4',
      name: 'Purple Dream',
      colors: ['#a8edea', '#fed6e3'] as const,
    },
    {
      id: 'gradient5',
      name: 'Golden Hour',
      colors: ['#ffd89b', '#19547b'] as const,
    },
    {
      id: 'gradient6',
      name: 'Cosmic Dust',
      colors: ['#667eea', '#764ba2'] as const,
    },
  ];

  const solidColorPresets = [
    {
      id: 'blue',
      name: 'Blue',
      color: '#007AFF',
    },
    {
      id: 'white',
      name: 'White',
      color: '#FFFFFF',
    },
  ];

  const patternOptions = [
    {
      id: 'pattern1',
      name: 'Geometric',
      description: 'Clean lines and shapes',
    },
    {
      id: 'pattern2',
      name: 'Organic',
      description: 'Natural flowing forms',
    },
    {
      id: 'pattern3',
      name: 'Minimal',
      description: 'Simple and clean',
    },
  ];

  const handleBackgroundSelect = async (backgroundId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBackground(backgroundId);
    
    // Save the background preference
    try {
      await AsyncStorage.setItem('selectedBackground', backgroundId);
    } catch (error) {
      console.log('Error saving background preference:', error);
    }
  };

  return (
    <View style={styles.popupCardWrapper}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).then(() => router.back())}
            activeOpacity={0.7}
          >
            <Text style={[styles.backIcon, { color: colors.primaryText }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { color: colors.primaryText }]}>Background</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Solid Colors */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>SOLID COLORS</Text>
            <View style={styles.gradientGrid}>
              {solidColorPresets.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={styles.gradientOption}
                  onPress={() => handleBackgroundSelect(preset.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.gradientPreview,
                      { backgroundColor: preset.color },
                      selectedBackground === preset.id && styles.selectedPreview,
                      preset.id === 'white' && { borderWidth: 1, borderColor: colors.border }
                    ]}
                  >
                    {selectedBackground === preset.id && (
                      <View style={styles.selectedOverlay}>
                        <Text style={[styles.checkmark, preset.id === 'white' && { color: '#000000' }]}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.gradientName, { color: colors.primaryText }]}>{preset.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Gradient Presets */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>GRADIENT PRESETS</Text>
            <View style={styles.gradientGrid}>
              {gradientPresets.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={styles.gradientOption}
                  onPress={() => handleBackgroundSelect(preset.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={preset.colors}
                    style={[
                      styles.gradientPreview,
                      selectedBackground === preset.id && styles.selectedPreview
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {selectedBackground === preset.id && (
                      <View style={styles.selectedOverlay}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    )}
                  </LinearGradient>
                  <Text style={[styles.gradientName, { color: colors.primaryText }]}>{preset.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pattern Options */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>PATTERN STYLES</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              {patternOptions.map((pattern, index) => (
                <React.Fragment key={pattern.id}>
                  <TouchableOpacity 
                    style={styles.patternOption}
                    onPress={() => handleBackgroundSelect(pattern.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.patternLeft}>
                      <View style={[
                        styles.patternIcon,
                        { backgroundColor: colors.accent + '20' }
                      ]}>
                        <Text style={[styles.patternEmoji, { color: colors.accent }]}>
                          {pattern.id === 'pattern1' ? '◆' : pattern.id === 'pattern2' ? '◉' : '◯'}
                        </Text>
                      </View>
                      <View style={styles.patternInfo}>
                        <Text style={[styles.patternTitle, { color: colors.primaryText }]}>{pattern.name}</Text>
                        <Text style={[styles.patternDescription, { color: colors.secondaryText }]}>{pattern.description}</Text>
                      </View>
                    </View>
                    <View style={styles.patternRight}>
                      <View style={[
                        styles.radioButton,
                        { 
                          borderColor: selectedBackground === pattern.id ? colors.accent : colors.border,
                          backgroundColor: selectedBackground === pattern.id ? colors.accent : 'transparent'
                        }
                      ]}>
                        {selectedBackground === pattern.id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  {index < patternOptions.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: colors.separator }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Custom Background Info */}
          <View style={styles.sectionContainer}>
            <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.infoTitle, { color: colors.primaryText }]}>🎨 Custom Backgrounds</Text>
              <Text style={[styles.infoText, { color: colors.secondaryText }]}>
                Upload your own background images and create custom gradient combinations with Stoic Premium.
              </Text>
              <TouchableOpacity style={[styles.upgradeButton, { backgroundColor: colors.accent }]}>
                <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popupCardWrapper: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 64,
    borderTopRightRadius: 64,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginTop: 12,
    marginBottom: 0,
    marginHorizontal: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  container: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  gradientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  gradientOption: {
    width: '47%',
    alignItems: 'center',
  },
  gradientPreview: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPreview: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gradientName: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  patternOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  patternLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  patternIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternEmoji: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  patternInfo: {
    flex: 1,
  },
  patternTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  patternDescription: {
    fontSize: 14,
  },
  patternRight: {
    marginLeft: 12,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  separator: {
    height: 0.5,
    marginLeft: 16,
  },
  infoCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  upgradeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  headerSpacer: {
    flex: 1,
  },
}); 