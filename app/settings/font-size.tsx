import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FontSizeSettingsScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>('medium');

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

  const fontSizes = [
    {
      id: 'small',
      name: 'Small',
      description: 'Compact text for more content',
      titleSize: 20,
      bodySize: 14,
      captionSize: 12,
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'Default size, comfortable reading',
      titleSize: 24,
      bodySize: 16,
      captionSize: 14,
    },
    {
      id: 'large',
      name: 'Large',
      description: 'Easier to read, less content',
      titleSize: 28,
      bodySize: 18,
      captionSize: 16,
    },
    {
      id: 'xlarge',
      name: 'Extra Large',
      description: 'Maximum readability',
      titleSize: 32,
      bodySize: 20,
      captionSize: 18,
    },
  ];

  const handleSizeSelect = (sizeId: 'small' | 'medium' | 'large' | 'xlarge') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSize(sizeId);
  };

  const currentFontSize = fontSizes.find(size => size.id === selectedSize);

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
          <Text style={[styles.pageTitle, { color: colors.primaryText }]}>Font Size</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Preview Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>PREVIEW</Text>
            <View style={[styles.previewCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[
                styles.previewTitle, 
                { 
                  color: colors.primaryText,
                  fontSize: currentFontSize?.titleSize || 24
                }
              ]}>
                Daily Reflection
              </Text>
              <Text style={[
                styles.previewBody, 
                { 
                  color: colors.secondaryText,
                  fontSize: currentFontSize?.bodySize || 16
                }
              ]}>
                "You have power over your mind - not outside events. Realize this, and you will find strength." This timeless wisdom from Marcus Aurelius reminds us that true peace comes from within.
              </Text>
              <Text style={[
                styles.previewCaption, 
                { 
                  color: colors.tertiaryText,
                  fontSize: currentFontSize?.captionSize || 14
                }
              ]}>
                Marcus Aurelius • Meditations
              </Text>
            </View>
          </View>

          {/* Font Size Options */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>CHOOSE SIZE</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              {fontSizes.map((size, index) => (
                <React.Fragment key={size.id}>
                  <TouchableOpacity 
                    style={styles.sizeOption}
                    onPress={() => handleSizeSelect(size.id as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.sizeLeft}>
                      <View style={styles.sizeDemo}>
                        <Text style={[
                          styles.sizeDemoText,
                          { 
                            color: colors.primaryText,
                            fontSize: size.bodySize
                          }
                        ]}>
                          Aa
                        </Text>
                      </View>
                      <View style={styles.sizeInfo}>
                        <Text style={[styles.sizeName, { color: colors.primaryText }]}>{size.name}</Text>
                        <Text style={[styles.sizeDescription, { color: colors.secondaryText }]}>{size.description}</Text>
                      </View>
                    </View>
                    <View style={styles.sizeRight}>
                      <View style={[
                        styles.radioButton,
                        { 
                          borderColor: selectedSize === size.id ? colors.accent : colors.border,
                          backgroundColor: selectedSize === size.id ? colors.accent : 'transparent'
                        }
                      ]}>
                        {selectedSize === size.id && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  {index < fontSizes.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: colors.separator }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Accessibility Info */}
          <View style={styles.sectionContainer}>
            <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.infoTitle, { color: colors.primaryText }]}>♿ Accessibility</Text>
              <Text style={[styles.infoText, { color: colors.secondaryText }]}>
                Font size affects all text throughout the app. Choose a size that's comfortable for your reading preferences. You can also use your device's accessibility settings for system-wide text scaling.
              </Text>
            </View>
          </View>

          {/* Dynamic Type Info */}
          <View style={styles.sectionContainer}>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <TouchableOpacity style={styles.dynamicTypeRow} activeOpacity={0.7}>
                <View style={styles.dynamicTypeLeft}>
                  <Text style={styles.dynamicTypeIcon}>📱</Text>
                  <View>
                    <Text style={[styles.dynamicTypeTitle, { color: colors.primaryText }]}>Use Device Settings</Text>
                    <Text style={[styles.dynamicTypeSubtitle, { color: colors.secondaryText }]}>Follow system text size preferences</Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.tertiaryText }]}>›</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSpacer: {
    width: 36,
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
  previewTitle: {
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 1.2,
  },
  previewBody: {
    lineHeight: 1.5,
    marginBottom: 12,
  },
  previewCaption: {
    fontStyle: 'italic',
    lineHeight: 1.3,
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
  sizeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  sizeLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sizeDemo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeDemoText: {
    fontWeight: '600',
  },
  sizeInfo: {
    flex: 1,
  },
  sizeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  sizeDescription: {
    fontSize: 14,
  },
  sizeRight: {
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
  dynamicTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  dynamicTypeLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dynamicTypeIcon: {
    fontSize: 20,
  },
  dynamicTypeTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  dynamicTypeSubtitle: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '300',
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
}); 