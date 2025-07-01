import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AIPreferencesScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  
  const [selectedPersona, setSelectedPersona] = useState('minara');
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [responseStyle, setResponseStyle] = useState('balanced');

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

  const aiPersonas = [
    {
      id: 'minara',
      name: 'Minara',
      subtitle: 'Wise and compassionate Stoic guide',
      description: 'A thoughtful mentor who helps you apply Stoic principles to daily life with wisdom and empathy.',
      icon: '🧘‍♀️',
      isPremium: false,
    },
    {
      id: 'marcus',
      name: 'Marcus',
      subtitle: 'Direct and practical philosopher',
      description: 'Inspired by Marcus Aurelius, offering straightforward advice with imperial wisdom.',
      icon: '👑',
      isPremium: true,
    },
    {
      id: 'epictetus',
      name: 'Epictetus',
      subtitle: 'Resilient and encouraging teacher',
      description: 'Based on the former slave turned philosopher, focusing on inner freedom and resilience.',
      icon: '⛓️‍💥',
      isPremium: true,
    },
    {
      id: 'seneca',
      name: 'Seneca',
      subtitle: 'Practical and worldly advisor',
      description: 'Combining Stoic philosophy with practical life advice, perfect for modern challenges.',
      icon: '📜',
      isPremium: true,
    },
  ];

  const languages = [
    { id: 'english', name: 'English', nativeName: 'English' },
    { id: 'spanish', name: 'Spanish', nativeName: 'Español' },
    { id: 'french', name: 'French', nativeName: 'Français' },
    { id: 'german', name: 'German', nativeName: 'Deutsch' },
    { id: 'italian', name: 'Italian', nativeName: 'Italiano' },
    { id: 'portuguese', name: 'Portuguese', nativeName: 'Português' },
  ];

  const responseStyles = [
    {
      id: 'concise',
      name: 'Concise',
      description: 'Brief, to-the-point responses',
      icon: '⚡',
    },
    {
      id: 'balanced',
      name: 'Balanced',
      description: 'Thoughtful responses with good detail',
      icon: '⚖️',
    },
    {
      id: 'detailed',
      name: 'Detailed',
      description: 'Comprehensive, in-depth guidance',
      icon: '📚',
    },
  ];

  const handlePersonaSelect = (personaId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPersona(personaId);
  };

  const handleLanguageSelect = (languageId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLanguage(languageId);
  };

  const handleStyleSelect = (styleId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setResponseStyle(styleId);
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
          <Text style={[styles.pageTitle, { color: colors.primaryText }]}>AI Preferences</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* AI Persona Selection */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>CHOOSE YOUR AI GUIDE</Text>
            <View style={styles.personaGrid}>
              {aiPersonas.map((persona) => (
                <TouchableOpacity
                  key={persona.id}
                  style={[
                    styles.personaCard,
                    { backgroundColor: colors.cardBackground },
                    selectedPersona === persona.id && { borderColor: colors.accent, borderWidth: 2 }
                  ]}
                  onPress={() => handlePersonaSelect(persona.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.personaHeader}>
                    <Text style={styles.personaIcon}>{persona.icon}</Text>
                    {persona.isPremium && (
                      <View style={[styles.premiumBadge, { backgroundColor: colors.accent }]}>
                        <Text style={styles.premiumText}>PRO</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.personaName, { color: colors.primaryText }]}>{persona.name}</Text>
                  <Text style={[styles.personaSubtitle, { color: colors.secondaryText }]}>{persona.subtitle}</Text>
                  <Text style={[styles.personaDescription, { color: colors.tertiaryText }]}>{persona.description}</Text>
                  {selectedPersona === persona.id && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedCheck}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Language Selection */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>LANGUAGE</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              {languages.map((language, index) => (
                <React.Fragment key={language.id}>
                  <TouchableOpacity 
                    style={styles.languageRow}
                    onPress={() => handleLanguageSelect(language.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.languageLeft}>
                      <Text style={[styles.languageName, { color: colors.primaryText }]}>{language.name}</Text>
                      <Text style={[styles.languageNative, { color: colors.secondaryText }]}>{language.nativeName}</Text>
                    </View>
                    <View style={[
                      styles.radioButton,
                      { 
                        borderColor: selectedLanguage === language.id ? colors.accent : colors.border,
                        backgroundColor: selectedLanguage === language.id ? colors.accent : 'transparent'
                      }
                    ]}>
                      {selectedLanguage === language.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                  {index < languages.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: colors.separator }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Response Style */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>RESPONSE STYLE</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              {responseStyles.map((style, index) => (
                <React.Fragment key={style.id}>
                  <TouchableOpacity 
                    style={styles.styleRow}
                    onPress={() => handleStyleSelect(style.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.styleLeft}>
                      <Text style={styles.styleIcon}>{style.icon}</Text>
                      <View style={styles.styleInfo}>
                        <Text style={[styles.styleName, { color: colors.primaryText }]}>{style.name}</Text>
                        <Text style={[styles.styleDescription, { color: colors.secondaryText }]}>{style.description}</Text>
                      </View>
                    </View>
                    <View style={[
                      styles.radioButton,
                      { 
                        borderColor: responseStyle === style.id ? colors.accent : colors.border,
                        backgroundColor: responseStyle === style.id ? colors.accent : 'transparent'
                      }
                    ]}>
                      {responseStyle === style.id && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                  {index < responseStyles.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: colors.separator }]} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Advanced Settings */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>ADVANCED SETTINGS</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <TouchableOpacity style={styles.advancedRow} activeOpacity={0.7}>
                <View style={styles.advancedLeft}>
                  <Text style={styles.advancedIcon}>🎯</Text>
                  <View>
                    <Text style={[styles.advancedTitle, { color: colors.primaryText }]}>Conversation Context</Text>
                    <Text style={[styles.advancedSubtitle, { color: colors.secondaryText }]}>How much history to remember</Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.tertiaryText }]}>›</Text>
              </TouchableOpacity>
              <View style={[styles.separator, { backgroundColor: colors.separator }]} />
              <TouchableOpacity style={styles.advancedRow} activeOpacity={0.7}>
                <View style={styles.advancedLeft}>
                  <Text style={styles.advancedIcon}>🔄</Text>
                  <View>
                    <Text style={[styles.advancedTitle, { color: colors.primaryText }]}>Reset AI Memory</Text>
                    <Text style={[styles.advancedSubtitle, { color: colors.secondaryText }]}>Start fresh conversations</Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.tertiaryText }]}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.sectionContainer}>
            <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.infoTitle, { color: colors.primaryText }]}>🤖 About Your AI Guide</Text>
              <Text style={[styles.infoText, { color: colors.secondaryText }]}>
                Your AI guide learns from your conversations to provide more personalized advice. All interactions are private and encrypted. Premium personas offer deeper philosophical insights and specialized guidance.
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
  personaGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  personaCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  personaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  personaIcon: {
    fontSize: 32,
  },
  premiumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  personaName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  personaSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  personaDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheck: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  languageLeft: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  languageNative: {
    fontSize: 14,
  },
  styleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  styleLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  styleIcon: {
    fontSize: 20,
  },
  styleInfo: {
    flex: 1,
  },
  styleName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  styleDescription: {
    fontSize: 14,
  },
  advancedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  advancedLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  advancedIcon: {
    fontSize: 20,
  },
  advancedTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  advancedSubtitle: {
    fontSize: 14,
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
  chevron: {
    fontSize: 18,
    fontWeight: '300',
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
    fontSize: 20,
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