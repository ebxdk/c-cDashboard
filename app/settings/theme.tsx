import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ThemeSettingsScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('system');

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

  const handleThemeSelect = (theme: 'light' | 'dark' | 'system') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTheme(theme);
  };

  const themeOptions = [
    {
      id: 'light',
      title: 'Light',
      subtitle: 'Clean and bright interface',
      icon: '☀️',
    },
    {
      id: 'dark',
      title: 'Dark',
      subtitle: 'Easy on the eyes',
      icon: '🌙',
    },
    {
      id: 'system',
      title: 'System',
      subtitle: 'Follow device settings',
      icon: '⚙️',
    },
  ];

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
          <Text style={[styles.pageTitle, { color: colors.primaryText }]}>Theme Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Preview Card */}
          <View style={styles.previewSection}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>APPEARANCE PREVIEW</Text>
            <View style={[styles.previewCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.previewContent}>
                <View style={styles.previewHeader}>
                  <View style={[styles.previewDot, { backgroundColor: colors.accent }]} />
                  <View style={[styles.previewDot, { backgroundColor: colors.secondaryText, opacity: 0.3 }]} />
                  <View style={[styles.previewDot, { backgroundColor: colors.secondaryText, opacity: 0.3 }]} />
                </View>
                <View style={styles.previewBody}>
                  <View style={[styles.previewLine, { backgroundColor: colors.primaryText, opacity: 0.8 }]} />
                  <View style={[styles.previewLine, { backgroundColor: colors.secondaryText, opacity: 0.5, width: '70%' }]} />
                  <View style={[styles.previewLine, { backgroundColor: colors.secondaryText, opacity: 0.3, width: '50%' }]} />
                </View>
              </View>
            </View>
          </View>

          {/* Theme Options */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>CHOOSE THEME</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              {themeOptions.map((option, index) => (
                <React.Fragment key={option.id}>
                  <TouchableOpacity 
                    style={styles.themeOption}
                    onPress={() => handleThemeSelect(option.id as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.themeLeft}>
                      <Text style={styles.themeIcon}>{option.icon}</Text>
                      <View style={styles.themeInfo}>
                        <Text style={[styles.themeTitle, { color: colors.primaryText }]}>{option.title}</Text>
                        <Text style={[styles.themeSubtitle, { color: colors.secondaryText }]}>{option.subtitle}</Text>
                      </View>
                    </View>
                    <View style={styles.themeRight}>
                      <View style={[
                        styles.radioButton,
                        { 
                          borderColor: selectedTheme === option.id ? colors.accent : colors.border,
                          backgroundColor: selectedTheme === option.id ? colors.accent : 'transparent'
                        }
                      ]}>
                        {selectedTheme === option.id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  {index < themeOptions.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: colors.separator }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Auto-Switch Info */}
          <View style={styles.sectionContainer}>
            <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.infoTitle, { color: colors.primaryText }]}>💡 Auto-Switch</Text>
              <Text style={[styles.infoText, { color: colors.secondaryText }]}>
                When System is selected, the app will automatically switch between light and dark themes based on your device settings.
              </Text>
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
  previewSection: {
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  previewCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  previewContent: {
    gap: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    gap: 8,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  previewBody: {
    gap: 8,
  },
  previewLine: {
    height: 4,
    borderRadius: 2,
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
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  themeLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeIcon: {
    fontSize: 24,
  },
  themeInfo: {
    flex: 1,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  themeSubtitle: {
    fontSize: 14,
  },
  themeRight: {
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
    fontSize: 24,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  headerSpacer: {
    flex: 1,
  },
}); 