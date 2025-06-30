import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/hooks/useColorScheme';



const Appearance = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<'pattern' | 'plain'>('pattern');

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF', // Pure white for light mode
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#A0A0A0' : '#666666',
    tertiaryText: isDarkMode ? '#808080' : '#777777',
    cardBorder: isDarkMode ? '#2C2C2E' : 'rgba(0,0,0,0.08)', // Slightly stronger border for light mode
    cardShadow: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', // Subtle shadow for cards
    redDot: '#FF3B30',
    prayerCompleted: '#007AFF',
    prayerPending: isDarkMode ? '#48484A' : '#D1D1D6',
    accent: '#007AFF',
    accentSubtle: isDarkMode ? '#1A2332' : '#F0F4FF',
    habitRing: '#007AFF',
    habitBackground: isDarkMode ? '#2C2C2E' : '#E5E5EA',
    journalGradient: isDarkMode ? '#2C2C2E' : '#007AFF',
    journalBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    cohortAccent: '#007AFF',
    cohortBackground: isDarkMode ? 'rgba(0, 122, 255, 0.10)' : 'rgba(0, 122, 255, 0.08)',
    cohortBorder: isDarkMode ? 'rgba(0, 122, 255, 0.25)' : 'rgba(0, 122, 255, 0.18)',
    resizeHandle: '#007AFF',
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* Theme Toggle */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.primaryText }]}>Theme</Text>

          <View style={[styles.toggleContainer, {
            backgroundColor: colors.cardBackground,
            borderColor: isDarkMode ? 'transparent' : colors.cardBorder,
          }]}
          >
            <TouchableOpacity
              onPress={() => {
                setIsDarkMode(false);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[styles.toggleOption, {
                backgroundColor: !isDarkMode ? colors.accent : 'transparent',
              }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, {
                color: !isDarkMode ? '#FFFFFF' : colors.secondaryText,
              }]}>☀️ Light</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsDarkMode(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[styles.toggleOption, {
                backgroundColor: isDarkMode ? colors.accent : 'transparent',
              }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, {
                color: isDarkMode ? '#FFFFFF' : colors.secondaryText,
              }]}>🌙 Dark</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Background Options */}
        <View>
          <Text style={[styles.label, { color: colors.primaryText }]}>Background Style</Text>
          <View style={styles.backgroundOptions}>
            {/* Pattern Background */}
            <TouchableOpacity
              onPress={() => {
                setSelectedBackground('pattern');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              style={[styles.previewCard, {
                borderColor: selectedBackground === 'pattern' ? colors.accent : colors.cardBorder,
                borderWidth: selectedBackground === 'pattern' ? 3 : 2,
              }]}
              activeOpacity={0.9}
            >
              <View style={[styles.cardContent, { backgroundColor: colors.background }]}>
                <View style={[styles.patternOverlay, { opacity: isDarkMode ? 0.3 : 0.4 }]}> 
                  <ImageBackground
                    source={require('../assets/images/cc.patterns-01.png')}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.miniWidgets}>
                  <View style={[styles.miniWidgetBox, { backgroundColor: colors.cardBackground }]} />
                  <View style={[styles.miniWidgetBox, { backgroundColor: colors.cardBackground }]} />
                </View>
                <Text style={[styles.backgroundLabel, { color: colors.primaryText }]}>Pattern</Text>
              </View>
            </TouchableOpacity>

            {/* Plain Background */}
            <TouchableOpacity
              onPress={() => {
                setSelectedBackground('plain');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              style={[styles.previewCard, {
                borderColor: selectedBackground === 'plain' ? colors.accent : colors.cardBorder,
                borderWidth: selectedBackground === 'plain' ? 3 : 2,
              }]}
              activeOpacity={0.9}
            >
              <View style={[styles.cardContent, { backgroundColor: colors.background }]}>
                <View style={styles.miniWidgets}>
                  <View style={[styles.miniWidgetBox, { backgroundColor: colors.cardBackground }]} />
                  <View style={[styles.miniWidgetBox, { backgroundColor: colors.cardBackground }]} />
                </View>
                <Text style={[styles.backgroundLabel, { color: colors.primaryText }]}>Plain</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  backgroundOptions: {
    flexDirection: 'row',
    gap: 16,
  },
  previewCard: {
    flex: 1,
    aspectRatio: 0.7,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    flex: 1,
    position: 'relative',
  },
  patternOverlay: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
  },
  miniWidgets: {
    position: 'absolute',
    bottom: 20,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  miniWidgetBox: {
    flex: 1,
    height: 30,
    borderRadius: 8,
    opacity: 0.8,
  },
  backgroundLabel: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Appearance;