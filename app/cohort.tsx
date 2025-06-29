import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SMALL_WIDGET_HEIGHT } from '../constants/widgetConstants';

const { width: screenWidth } = Dimensions.get('window');

// Mock therapist data
const MOCK_THERAPIST = {
  name: 'Dr. Amira Hassan',
  credentials: 'Licensed Clinical Psychologist',
  specialization: 'Islamic Psychology & Mental Health',
  experience: '8+ years',
  languages: 'English, Arabic',
  organization: 'Islamic Counseling Center',
  image: require('../assets/images/memoji1.png'),
  bio: 'Specializing in culturally sensitive therapy for Muslim individuals and families.'
};

// Mock modules data
const MOCK_MODULES = [
  {
    id: '1',
    title: 'Prayer & Mindfulness',
    subtitle: 'Finding peace through Salah',
    category: 'Spirituality',
    duration: '12 min',
    type: 'video',
    color: '#4CAF50',
    emoji: '🤲'
  },
  {
    id: '2',
    title: 'Dealing with Anxiety',
    subtitle: 'Islamic approaches to mental health',
    category: 'Mental Health',
    duration: '8 min',
    type: 'article',
    color: '#2196F3',
    emoji: '🧠'
  },
  {
    id: '3',
    title: 'Building Habits',
    subtitle: 'Consistency in worship and life',
    category: 'Personal Growth',
    duration: '15 min',
    type: 'video',
    color: '#FF9800',
    emoji: '🎯'
  },
  {
    id: '4',
    title: 'Family Relationships',
    subtitle: 'Navigating family dynamics',
    category: 'Relationships',
    duration: '20 min',
    type: 'workshop',
    color: '#E91E63',
    emoji: '👨‍👩‍👧‍👦'
  },
  {
    id: '5',
    title: 'Career & Purpose',
    subtitle: 'Finding your calling in Islam',
    category: 'Career',
    duration: '18 min',
    type: 'podcast',
    color: '#9C27B0',
    emoji: '💼'
  },
  {
    id: '6',
    title: 'Quran Reflection',
    subtitle: 'Daily verses for contemplation',
    category: 'Spirituality',
    duration: '6 min',
    type: 'article',
    color: '#4CAF50',
    emoji: '📖'
  }
];

export default function CohortScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';
  const [activeTab, setActiveTab] = useState('For You');
  
  // Animation for tab slider
  const sliderAnimation = useRef(new Animated.Value(0)).current;

  // Mock user membership level with cycling for testing
  const [userMembership, setUserMembership] = useState<'Support+' | 'Companion+' | 'Mentorship+'>('Support+');

  const colors = {
    background: isDarkMode ? '#000000' : '#F2F2F7',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#6D6D70',
    tertiaryText: isDarkMode ? '#636366' : '#8E8E93',
    accent: '#B8D4F0',
    accentLight: isDarkMode ? 'rgba(184, 212, 240, 0.15)' : 'rgba(184, 212, 240, 0.08)',
    separator: isDarkMode ? 'rgba(84, 84, 88, 0.6)' : 'rgba(60, 60, 67, 0.18)',
    shadow: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.04)',
    tabBackground: isDarkMode ? '#2C2C2E' : '#E5E5EA',
    tabActiveBackground: isDarkMode ? '#48484A' : '#FFFFFF',
    cohortCard: isDarkMode ? '#1C1C1E' : '#F8F9FA',
    upgradeCard: '#B8D4F0',
    upgradeCardPremium: '#AF52DE',
    lockedCard: isDarkMode ? '#2C2C2E' : '#E5E5EA',
  };

  const tabs = ['For You', 'Modules'];

  // Get tier level for comparison
  const getTierLevel = (membership: string) => {
    switch (membership) {
      case 'Support+': return 1;
      case 'Companion+': return 2;
      case 'Mentorship+': return 3;
      default: return 1;
    }
  };

  const userTierLevel = getTierLevel(userMembership);

  const handleTabPress = (tab: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
    
    // Animate slider
    const tabIndex = tabs.indexOf(tab);
    Animated.spring(sliderAnimation, {
      toValue: tabIndex,
      useNativeDriver: true,
      tension: 300,
      friction: 30,
    }).start();
  };

  // Subscription toggle for testing
  const handleSubscriptionToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const subscriptions: ('Support+' | 'Companion+' | 'Mentorship+')[] = ['Support+', 'Companion+', 'Mentorship+'];
    const currentIndex = subscriptions.indexOf(userMembership);
    const nextIndex = (currentIndex + 1) % subscriptions.length;
    setUserMembership(subscriptions[nextIndex]);
  };

  useEffect(() => {
    // Initialize slider position
    const initialIndex = tabs.indexOf(activeTab);
    sliderAnimation.setValue(initialIndex);
  }, []);

  const handleCardPress = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    switch (action) {
      case 'my-cohort':
        router.push('/my-cohort');
        break;
      case 'one-on-one':
        console.log('Navigate to 1-on-1 chat');
        break;
      case 'mentorship':
        console.log('Navigate to advanced mentorship');
        break;
      case 'jane-app':
        console.log('Connect to Jane App');
        break;
      case 'journal':
        router.push('/journal');
        break;
      case 'module':
        console.log('Open module');
        break;
      default:
        console.log('Action:', action);
    }
  };

  // Journal Widget Component (identical to dashboard widget)
  const JournalWidgetMini = () => {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = dayNames[today.getDay()];

    const journalPrompts = [
      "What lessons did you learn today?",
      "What are you most grateful for?",
      "How did you grow today?",
      "What challenged you today?",
      "What positive impact did you make?",
      "What would you do differently?",
      "What brought you joy today?",
      "How did you practice your faith?",
      "What are you looking forward to?",
      "What act of kindness did you see today?"
    ];

    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

    const handleRefresh = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentPromptIndex((prevIndex) => (prevIndex + 1) % journalPrompts.length);
    };

    // Function to render text with translucent unimportant words (identical to dashboard)
    const renderStyledPrompt = (prompt: string) => {
      const unimportantWords = ['did', 'you', 'are', 'to', 'a', 'an', 'the', 'of', 'for', 'would', 'do'];
      const words = prompt.split(' ');
      
      return (
        <Text style={{ textAlign: 'left', lineHeight: 24 }}>
          {words.map((word, index) => {
            const cleanWord = word.replace(/[.,;:!?]/g, '').toLowerCase();
            const isUnimportant = unimportantWords.includes(cleanWord);
            
            return (
              <Text
                key={index}
                style={{
                  fontSize: 19,
                  fontWeight: '800',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  lineHeight: 23,
                  letterSpacing: -0.3,
                  opacity: isUnimportant ? 0.6 : 1,
                }}
              >
                {word}{index < words.length - 1 ? ' ' : ''}
              </Text>
            );
          })}
        </Text>
      );
    };

    return (
      <TouchableOpacity 
        onPress={() => handleCardPress('journal')}
        activeOpacity={0.8}
        style={styles.journalCard}
      >
        {/* Gradient Layer 1 - Smaller and darker bottom effect */}
        <View style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          right: -30,
          height: '80%',
          backgroundColor: '#4A3366',
          opacity: 0.8,
          borderRadius: 45,
        }} />
        
        {/* Gradient Layer 2 - Smaller additional depth */}
        <View style={{
          position: 'absolute',
          bottom: -20,
          left: -20,
          right: -20,
          height: '60%',
          backgroundColor: '#3A2952',
          opacity: 0.6,
          borderRadius: 35,
        }} />
        
        {/* Increased frosty blur overlay */}
        <BlurView
          intensity={45}
          tint="light"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 30,
          }}
        />

        <View style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          zIndex: 1,
          paddingTop: 0,
        }}>
          {/* Day of week */}
          <View style={{ width: '100%', alignItems: 'flex-start' }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'System',
              opacity: 0.9,
              marginBottom: 2,
            }}>
              {currentDay}
            </Text>
          </View>

          {/* Journal prompt */}
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 0, marginTop: 4 }}>
            {renderStyledPrompt(journalPrompts[currentPromptIndex])}
          </View>

          {/* Action buttons */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            gap: 10,
            paddingHorizontal: 16,
            marginTop: 3,
            marginBottom: -4,
            position: 'absolute',
            bottom: -4,
          }}>
            {/* New button */}
            <TouchableOpacity
              onPress={() => handleCardPress('journal')}
              activeOpacity={0.8}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 22,
                paddingHorizontal: 16,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <Text style={{
                fontSize: 15,
                fontWeight: '600',
                color: '#FFFFFF',
                fontFamily: 'System',
                marginRight: 6,
              }}>
                ✏️ New
              </Text>
            </TouchableOpacity>

            {/* Refresh button */}
            <TouchableOpacity
              onPress={handleRefresh}
              activeOpacity={0.8}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 20,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderForYouTab = () => {
    switch (userMembership) {
      case 'Support+':
        // Show My Cohort card
        return (
          <View style={styles.gridContainer}>
            <View style={[styles.myCohortCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.cohortHeader}>
                <View style={styles.cohortTitleSection}>
                  <Text style={[styles.cohortMainTitle, { color: colors.primaryText }]}>My Cohort</Text>
                  <Text style={[styles.cohortSubtitle, { color: colors.secondaryText }]}>
                    Connect with your learning community
                  </Text>
                </View>
                <View style={[styles.cohortStatusBadge, { backgroundColor: colors.accentLight }]}>
                  <View style={[styles.statusDot, { backgroundColor: colors.accent }]} />
                  <Text style={[styles.statusText, { color: colors.accent }]}>3 Online</Text>
                </View>
              </View>

              <View style={styles.cohortStatsSection}>
                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <Text style={[styles.statNumber, { color: colors.accent }]}>12</Text>
                    <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Members</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={[styles.statNumber, { color: colors.accent }]}>8</Text>
                    <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Active Today</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={[styles.statNumber, { color: colors.accent }]}>24</Text>
                    <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Messages</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.cohortActionButton, { backgroundColor: colors.accent }]}
                onPress={() => handleCardPress('my-cohort')}
                activeOpacity={0.9}
              >
                <Text style={styles.cohortActionText}>Open Chat</Text>
                <Text style={styles.cohortActionIcon}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'Companion+':
        // Show One-on-One card
        return (
          <View style={styles.gridContainer}>
            <TouchableOpacity 
              style={[styles.gridCard, styles.largeCard, { backgroundColor: colors.cohortCard }]}
              onPress={() => handleCardPress('one-on-one')}
              activeOpacity={0.9}
            >
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.primaryText }]}>Personal Mentor</Text>
                <Text style={[styles.cardSubtitle, { color: colors.secondaryText }]}>1-on-1 guidance sessions</Text>
                <View style={[styles.cardButton, { backgroundColor: colors.accent }]}>
                  <Text style={styles.buttonText}>Start Chat</Text>
                </View>
              </View>
              <View style={[styles.cardImageContainer, { backgroundColor: colors.accentLight }]}>
                <Image
                  source={require('../assets/images/memoji2.png')}
                  style={styles.cardImage}
                />
              </View>
            </TouchableOpacity>
          </View>
        );

      case 'Mentorship+':
        // Show Mentorship+ UI with therapist card, Jane app card, and journal widget
        return (
          <View style={styles.gridContainer}>
            {/* Therapist Info Card */}
            <View style={[styles.therapistCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.therapistHeader}>
                <Image
                  source={MOCK_THERAPIST.image}
                  style={styles.therapistImage}
                />
                <View style={styles.therapistInfo}>
                  <Text style={[styles.therapistName, { color: colors.primaryText }]}>
                    {MOCK_THERAPIST.name}
                  </Text>
                  <Text style={[styles.therapistCredentials, { color: colors.secondaryText }]}>
                    {MOCK_THERAPIST.credentials}
                  </Text>
                  <Text style={[styles.therapistSpecialization, { color: colors.tertiaryText }]}>
                    {MOCK_THERAPIST.specialization}
                  </Text>
                </View>
              </View>
              
              <View style={styles.therapistDetails}>
                <View style={styles.therapistDetailRow}>
                  <Text style={[styles.therapistDetailLabel, { color: colors.secondaryText }]}>Experience:</Text>
                  <Text style={[styles.therapistDetailValue, { color: colors.primaryText }]}>
                    {MOCK_THERAPIST.experience}
                  </Text>
                </View>
                <View style={styles.therapistDetailRow}>
                  <Text style={[styles.therapistDetailLabel, { color: colors.secondaryText }]}>Languages:</Text>
                  <Text style={[styles.therapistDetailValue, { color: colors.primaryText }]}>
                    {MOCK_THERAPIST.languages}
                  </Text>
                </View>
                <View style={styles.therapistDetailRow}>
                  <Text style={[styles.therapistDetailLabel, { color: colors.secondaryText }]}>Organization:</Text>
                  <Text style={[styles.therapistDetailValue, { color: colors.primaryText }]}>
                    {MOCK_THERAPIST.organization}
                  </Text>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.therapistActionButton, { backgroundColor: colors.accent }]}
                onPress={() => handleCardPress('mentorship')}
                activeOpacity={0.9}
              >
                <Text style={styles.therapistActionText}>Schedule Session</Text>
                <Text style={styles.therapistActionIcon}>📅</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Row: Jane App Card and Journal Widget */}
            <View style={styles.bottomCardsRow}>
              {/* Jane App Card */}
              <TouchableOpacity 
                style={[styles.janeCard, { backgroundColor: colors.cardBackground }]}
                onPress={() => handleCardPress('jane-app')}
                activeOpacity={0.9}
              >
                <View style={styles.janeCardContent}>
                  <Text style={styles.janeCardEmoji}>🏥</Text>
                  <Text style={[styles.janeCardTitle, { color: colors.primaryText }]}>Jane App</Text>
                  <Text style={[styles.janeCardSubtitle, { color: colors.secondaryText }]}>
                    Connect to booking system
                  </Text>
                  <View style={[styles.janeCardButton, { backgroundColor: colors.accent }]}>
                    <Text style={styles.janeCardButtonText}>Connect</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Journal Widget */}
              <JournalWidgetMini />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const renderModulesTab = () => {
    return (
      <View style={styles.modulesContainer}>
        {/* Featured Section */}
        <View style={styles.modulesSection}>
          <Text style={[styles.modulesSectionTitle, { color: colors.primaryText }]}>Featured</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredModulesScroll}
          >
            {MOCK_MODULES.slice(0, 3).map((module) => (
              <TouchableOpacity
                key={module.id}
                style={[styles.featuredModuleCard, { backgroundColor: module.color }]}
                onPress={() => handleCardPress('module')}
                activeOpacity={0.9}
              >
                <Text style={styles.featuredModuleEmoji}>{module.emoji}</Text>
                <Text style={styles.featuredModuleTitle}>{module.title}</Text>
                <Text style={styles.featuredModuleSubtitle}>{module.subtitle}</Text>
                <View style={styles.featuredModuleMeta}>
                  <Text style={styles.featuredModuleDuration}>{module.duration}</Text>
                  <Text style={styles.featuredModuleType}>{module.type}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Modules Section */}
        <View style={styles.modulesSection}>
          <Text style={[styles.modulesSectionTitle, { color: colors.primaryText }]}>All Modules</Text>
          <View style={styles.modulesGrid}>
            {MOCK_MODULES.map((module) => (
              <TouchableOpacity
                key={module.id}
                style={[styles.moduleCard, { backgroundColor: colors.cardBackground }]}
                onPress={() => handleCardPress('module')}
                activeOpacity={0.9}
              >
                <View style={[styles.moduleIcon, { backgroundColor: module.color }]}>
                  <Text style={styles.moduleEmoji}>{module.emoji}</Text>
                </View>
                <View style={styles.moduleInfo}>
                  <Text style={[styles.moduleTitle, { color: colors.primaryText }]}>{module.title}</Text>
                  <Text style={[styles.moduleSubtitle, { color: colors.secondaryText }]}>{module.subtitle}</Text>
                  <View style={styles.moduleMeta}>
                    <Text style={[styles.moduleCategory, { color: colors.tertiaryText }]}>{module.category}</Text>
                    <Text style={[styles.moduleDuration, { color: colors.tertiaryText }]}>• {module.duration}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'For You':
        return renderForYouTab();
      case 'Modules':
        return renderModulesTab();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {params.noAnim === '1' && (
        <Stack.Screen options={{ animation: 'none' }} />
      )}
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <Text style={[styles.largeTitle, { color: colors.primaryText }]}>{userMembership}</Text>
            
            {/* Subscription Toggle Button */}
            <TouchableOpacity
              style={[styles.subscriptionToggle, { backgroundColor: colors.accent }]}
              onPress={handleSubscriptionToggle}
              activeOpacity={0.8}
            >
              <Text style={styles.subscriptionToggleText}>Switch</Text>
            </TouchableOpacity>
          </View>
          
          {/* Tab Navigation with Slider */}
          <View style={[styles.tabContainer, { backgroundColor: colors.tabBackground }]}>
            <Animated.View 
              style={[
                styles.tabSlider,
                { backgroundColor: colors.tabActiveBackground },
                {
                  transform: [{
                    translateX: sliderAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [4, (screenWidth - 48) / 2],
                    })
                  }]
                }
              ]}
            />
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={styles.tab}
                onPress={() => handleTabPress(tab)}
              >
                <Text style={[
                  styles.tabText,
                  { color: activeTab === tab ? colors.primaryText : colors.secondaryText }
                ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  headerSection: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: 0.4,
    lineHeight: 41,
  },
  subscriptionToggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subscriptionToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 6,
    position: 'relative',
    height: 52,
  },
  tabSlider: {
    position: 'absolute',
    top: 6,
    height: 40,
    width: (screenWidth - 52) / 2 - 8,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'System',
  },
  gridContainer: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    gap: 16,
  },
  gridCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  largeCard: {
    width: '100%',
    height: 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
  },
  cardSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    opacity: 0.8,
    marginBottom: 16,
    fontFamily: 'System',
  },
  cardButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  cardImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  bottomSpacing: {
    height: 40,
  },

  // My Cohort Card Styles
  myCohortCard: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  cohortHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cohortTitleSection: {
    flex: 1,
  },
  cohortMainTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  cohortSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 22,
  },
  cohortStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  cohortStatsSection: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'System',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'System',
  },
  cohortActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  cohortActionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  cohortActionIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },

  // Therapist Card Styles
  therapistCard: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 16,
  },
  therapistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  therapistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  therapistInfo: {
    flex: 1,
  },
  therapistName: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'System',
    marginBottom: 4,
  },
  therapistCredentials: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'System',
    marginBottom: 2,
  },
  therapistSpecialization: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 16,
  },
  therapistDetails: {
    marginBottom: 24,
  },
  therapistDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  therapistDetailLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'System',
  },
  therapistDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  therapistActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  therapistActionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  therapistActionIcon: {
    fontSize: 18,
  },

  // Bottom Cards Row
  bottomCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  // Jane App Card Styles
  janeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 22,
    margin: 0,
    height: SMALL_WIDGET_HEIGHT,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0,
  },
  janeCardContent: {
    alignItems: 'center',
  },
  janeCardEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  janeCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'System',
    marginBottom: 4,
  },
  janeCardSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  janeCardButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  janeCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },

  // Journal Widget Styles (identical to dashboard widget)
  journalCard: {
    flex: 1,
    backgroundColor: '#6B4C93',
    borderRadius: 30,
    padding: 22,
    margin: 0,
    height: SMALL_WIDGET_HEIGHT,
    shadowColor: '#4A3366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0,
    overflow: 'hidden',
  },

  // Modules Tab Styles
  modulesContainer: {
    paddingHorizontal: 20,
  },
  modulesSection: {
    marginBottom: 32,
  },
  modulesSectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'System',
    marginBottom: 16,
  },
  featuredModulesScroll: {
    paddingRight: 20,
  },
  featuredModuleCard: {
    width: 200,
    height: 140,
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    justifyContent: 'space-between',
  },
  featuredModuleEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  featuredModuleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
    marginBottom: 4,
  },
  featuredModuleSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'System',
    lineHeight: 18,
    marginBottom: 12,
  },
  featuredModuleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredModuleDuration: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'System',
  },
  featuredModuleType: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'System',
    textTransform: 'uppercase',
  },
  modulesGrid: {
    gap: 12,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  moduleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  moduleEmoji: {
    fontSize: 24,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
    marginBottom: 2,
  },
  moduleSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 18,
    marginBottom: 4,
  },
  moduleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleCategory: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'System',
  },
  moduleDuration: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'System',
    marginLeft: 4,
  },
});
