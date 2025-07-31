import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BackgroundSettingsScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  const [selectedBackground, setSelectedBackground] = useState('off-white');

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
      id: 'white',
      name: isDarkMode ? 'Dark Gray' : 'White',
      color: isDarkMode ? '#1C1C1E' : '#FFFFFF', // ChatGPT-like dark color
    },
    {
      id: 'off-white',
      name: isDarkMode ? 'Black' : 'Off-White',
      color: isDarkMode ? '#000000' : '#FFFAF2', // Pure black for dark mode
    },
  ];

  const patternPresets = [
    {
      id: 'pattern-arabic',
      name: 'Arabic Style Pattern',
      description: 'Traditional Islamic geometric patterns',
    },
  ];

  const handleBackgroundSelect = async (backgroundId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBackground(backgroundId);
    
    // Save the background preference
    try {
      await AsyncStorage.setItem('selectedBackground', backgroundId);
      // Trigger a global event to update the dashboard in real-time
      (global as any).dashboardBackgroundUpdate = backgroundId;
    } catch (error) {
      console.log('Error saving background preference:', error);
    }
  };

  return (
    <View style={[styles.popupCardWrapper, { backgroundColor: colors.background }]}>
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
                      (preset.id === 'white' || preset.id === 'off-white') && { borderWidth: 1, borderColor: colors.border }
                    ]}
                  >
                    {selectedBackground === preset.id && (
                      <View style={styles.selectedOverlay}>
                        <Text style={[styles.checkmark, (preset.id === 'white' || preset.id === 'off-white') && { color: '#000000' }]}>✓</Text>
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
            <View style={styles.gradientGrid}>
              {patternPresets.map((preset) => (
                <TouchableOpacity
                  key={preset.id}
                  style={styles.gradientOption}
                  onPress={() => handleBackgroundSelect(preset.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.gradientPreview,
                      { backgroundColor: '#FFFAF2' },
                      selectedBackground === preset.id && styles.selectedPreview,
                      { borderWidth: 1, borderColor: colors.border }
                    ]}
                  >
                    {/* Pattern overlay using ImageBackground */}
                    <ImageBackground
                      source={require('../../assets/images/cc.patterns-01.png')}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.4,
                      }}
                      resizeMode="cover"
                    />
                    
                    {selectedBackground === preset.id && (
                      <View style={styles.selectedOverlay}>
                        <Text style={[styles.checkmark, { color: '#000000' }]}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.gradientName, { color: colors.primaryText }]}>{preset.name}</Text>
                </TouchableOpacity>
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
    // Remove top border radius as requested
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginTop: 0, // Adjusted for no top border radius
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