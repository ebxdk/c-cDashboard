import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SMALL_WIDGET_HEIGHT } from '../constants/widgetConstants';
import ModulesSlider from './ModulesSlider';

const { width: screenWidth } = Dimensions.get('window');

// Mock therapist data
const MOCK_THERAPIST = {
  name: 'Dr. Amira Hassan',
  credentials: 'Licensed Clinical Psychologist',
  specialization: 'Islamic Psychology & Mental Health',
  experience: '8+ years',
  languages: 'English, Arabic',
  organization: 'Ruh Care',
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

  // Mock message count for testing the 9+ cap
  const [messageCount, setMessageCount] = useState(12);

  const colors = {
    background: isDarkMode ? '#000000' : '#F2F2F7',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#6D6D70',
    tertiaryText: isDarkMode ? '#636366' : '#8E8E93',
    accent: '#A8C8E8',
    accentLight: isDarkMode ? 'rgba(168, 200, 232, 0.15)' : 'rgba(168, 200, 232, 0.08)',
    separator: isDarkMode ? 'rgba(84, 84, 88, 0.6)' : 'rgba(60, 60, 67, 0.18)',
    shadow: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.04)',
    tabBackground: isDarkMode ? '#2C2C2E' : '#E5E5EA',
    tabActiveBackground: isDarkMode ? '#48484A' : '#FFFFFF',
    cohortCard: isDarkMode ? '#1C1C1E' : '#F8F9FA',
    upgradeCard: '#A8C8E8',
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
        router.push('/companion-chat');
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

  // Journal Widget Component for Support+ (with left-aligned, bigger text)
  const JournalWidgetMiniSupport = () => {
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

    // Function to render text with translucent unimportant words (left-aligned, bigger text)
    const renderStyledPrompt = (prompt: string) => {
      const unimportantWords = ['did', 'you', 'are', 'to', 'a', 'an', 'the', 'of', 'for', 'would', 'do'];
      const words = prompt.split(' ');
      
      return (
        <Text style={{ textAlign: 'left', lineHeight: 28 }}>
          {words.map((word, index) => {
            const cleanWord = word.replace(/[.,;:!?]/g, '').toLowerCase();
            const isUnimportant = unimportantWords.includes(cleanWord);
            
            return (
              <Text
                key={index}
                style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  lineHeight: 26,
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
            backgroundColor: 'rgba(181, 208, 237, 0.3)',
          }}
        />

        <View style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
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

          {/* Journal prompt - left aligned and bigger */}
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
            <View style={[styles.myCohortCardSquare, { 
              backgroundColor: '#C5D9F1',
              // Add gradient effect with multiple layers
            }]}>
              {/* Gradient background layers for smooth transition */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#7A9BC8', // Darkest blue at bottom
                borderRadius: 30,
              }} />
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: '20%', // Changed from '25%' to make darker portion higher
                backgroundColor: '#A8C1E0', // Medium-dark blue
                borderRadius: 30,
              }} />
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: '60%',
                backgroundColor: '#C5D9F1', // Lightest blue at top
                borderRadius: 30,
              }} />
              
              {/* Frosty blue blur overlay */}
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
                  backgroundColor: 'rgba(181, 208, 237, 0.3)',
                }}
              />
              
              <View style={styles.squareCohortHeader}>
                <View style={styles.squareCohortTitleSection}>
                  <Text style={[styles.squareCohortMainTitle, { color: '#1C1C1E' }]}>My Cohort</Text>
                  <Text style={[styles.squareCohortSubtitle, { color: '#5A7BA8' }]}>
                    Connect with your group
                  </Text>
                </View>
                <View style={[styles.squareCohortStatusBadge, { backgroundColor: 'rgba(255, 255, 255, 0.4)' }]}>
                  <View style={[styles.statusDot, { backgroundColor: '#34C759' }]} />
                  <Text style={[styles.squareStatusText, { color: '#5A7BA8' }]}>4 Online</Text>
                </View>
              </View>

              <View style={styles.squareStatsSection}>
                <View style={styles.squareStatsRow}>
                  <View style={[styles.squareStatCard, { backgroundColor: 'transparent' }]}>
                    {/* Translucent blur background for Members card */}
                    <BlurView
                      intensity={15}
                      tint="light"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 16,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      }}
                    />
                    <Text style={[styles.squareStatNumber, { color: '#1C1C1E', zIndex: 1 }]}>8</Text>
                    <Text style={[styles.squareStatLabel, { color: '#5A7BA8', zIndex: 1 }]}>Members</Text>
                  </View>
                  <View style={[styles.squareStatCard, { backgroundColor: 'transparent' }]}>
                    {/* Translucent blur background for Messages card */}
                    <BlurView
                      intensity={15}
                      tint="light"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 16,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      }}
                    />
                    <Text style={[styles.squareStatNumber, { color: '#1C1C1E', zIndex: 1 }]}>
                      {messageCount > 9 ? '9+' : messageCount.toString()}
                    </Text>
                    <Text style={[styles.squareStatLabel, { color: '#5A7BA8', zIndex: 1 }]}>Messages</Text>
                  </View>
                </View>
              </View>

              <View style={styles.squareNextCallSection}>
                <Text style={[styles.squareNextCallText, { color: '#5A7BA8' }]}>
                  Next Call: Dec 15
                </Text>
              </View>

              <TouchableOpacity 
                style={[styles.squareCohortActionButton, { 
                  backgroundColor: '#4A90E2',
                  borderWidth: 0,
                }]}
                onPress={() => handleCardPress('my-cohort')}
                activeOpacity={0.9}
              >
                <Text style={[styles.squareCohortActionText, { color: '#FFFFFF' }]}>Open Chat</Text>
              </TouchableOpacity>
            </View>

            {/* Journal Widget */}
            <JournalWidgetMiniSupport />
          </View>
        );

      case 'Companion+':
        // Show One-on-One card with same gradient and blur as My Cohort card
        return (
          <View style={styles.gridContainer}>
            <TouchableOpacity 
              style={[styles.myCohortCardSquare, { 
                backgroundColor: '#C5D9F1',
                height: screenWidth * 0.58, // Make card shorter (65% of width)
                paddingBottom: 10, // Further reduce bottom padding to move button down more
                overflow: 'hidden', // Keep card edges clean and blur effects contained
                // Add gradient effect with multiple layers
              }]}
              onPress={() => handleCardPress('one-on-one')}
              activeOpacity={0.9}
            >
              {/* Gradient background layers for smooth transition */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#7A9BC8', // Darkest blue at bottom
                borderRadius: 30,
              }} />
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: '20%', // Changed from '25%' to make darker portion higher
                backgroundColor: '#A8C1E0', // Medium-dark blue
                borderRadius: 30,
              }} />
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: '60%',
                backgroundColor: '#C5D9F1', // Lightest blue at top
                borderRadius: 30,
              }} />
              
              {/* Frosty blue blur overlay */}
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
                  backgroundColor: 'rgba(181, 208, 237, 0.3)',
                }}
              />
              
              <View style={[styles.squareCohortHeader, { marginBottom: 10 }]}>
                <View style={styles.squareCohortTitleSection}>
                  <Text style={[styles.squareCohortMainTitle, { color: '#1C1C1E', fontSize: 34 }]}>Personal Companion</Text>
                  <Text style={[styles.squareCohortSubtitle, { color: '#5A7BA8' }]}>
                    1-on-1 Islamic guidance
                  </Text>
                  <Text style={[styles.squareNextCallText, { color: '#5A7BA8', marginTop: 8 }]}>
                    Next detox call: Dec 18
                  </Text>
                </View>
                
                {/* Memoji in top right corner */}
                <View style={{
                  width: 80,
                  height: 80,
                  position: 'relative',
                }}>
                  {/* Image container with overflow hidden */}
                  <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 12,
                    elevation: 6,
                    overflow: 'hidden',
                  }}>
                    {/* Blur background for image container */}
                    <BlurView
                      intensity={15}
                      tint="light"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 40,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      }}
                    />
                    <Image
                      source={require('../assets/images/memoji2.png')}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        zIndex: 1,
                      }}
                    />
                  </View>
                  
                  {/* Red notification bubble - positioned outside image container */}
                  <View style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    minWidth: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#FF3B30',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 6,
                    shadowColor: '#FF3B30',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 2,
                    elevation: 10,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    zIndex: 999,
                  }}>
                    <Text style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: '#FFFFFF',
                      fontFamily: 'System',
                      letterSpacing: -0.2,
                      lineHeight: 13,
                    }}>+9</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.squareCohortActionButton, { 
                  backgroundColor: '#4A90E2',
                  borderWidth: 0,
                  paddingVertical: 14, // Reduced button height
                  marginTop: 0, // Remove any top margin
                }]}
                onPress={() => handleCardPress('one-on-one')}
                activeOpacity={0.9}
              >
                <Text style={[styles.squareCohortActionText, { color: '#FFFFFF' }]}>Start Chat</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Journal Widget */}
            <JournalWidgetMiniSupport />
          </View>
        );

      case 'Mentorship+':
        // Show Mentorship+ UI with therapist card, Jane app card, and journal widget
        return (
          <View style={styles.gridContainer}>
            {/* Therapist Info Card */}
            <View style={[styles.therapistCard, { backgroundColor: '#C5D9F1' }]}>
              {/* Gradient background layers for smooth transition */}
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#7A9BC8', // Darkest blue at bottom
                borderRadius: 20,
              }} />
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: '20%', // Changed from '25%' to make darker portion higher
                backgroundColor: '#A8C1E0', // Medium-dark blue
                borderRadius: 20,
              }} />
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: '60%',
                backgroundColor: '#C5D9F1', // Lightest blue at top
                borderRadius: 20,
              }} />
              
              {/* Frosty blue blur overlay */}
              <BlurView
                intensity={45}
                tint="light"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 20,
                  backgroundColor: 'rgba(181, 208, 237, 0.3)',
                }}
              />
              
              <View style={styles.therapistHeader}>
                <Image
                  source={MOCK_THERAPIST.image}
                  style={styles.therapistImage}
                />
                <View style={styles.therapistInfo}>
                  <Text style={[styles.therapistName, { color: '#1C1C1E', zIndex: 1 }]}>
                    {MOCK_THERAPIST.name}
                  </Text>
                  <Text style={[styles.therapistCredentials, { color: '#5A7BA8', zIndex: 1 }]}>
                    {MOCK_THERAPIST.credentials}
                  </Text>
                  <Text style={[styles.therapistSpecialization, { color: '#5A7BA8', zIndex: 1 }]}>
                    {MOCK_THERAPIST.specialization}
                  </Text>
                </View>
              </View>
              
              <View style={styles.therapistDetails}>
                <View style={styles.therapistDetailRow}>
                  <Text style={[styles.therapistDetailLabel, { color: '#5A7BA8', zIndex: 1 }]}>Experience:</Text>
                  <Text style={[styles.therapistDetailValue, { color: '#1C1C1E', zIndex: 1 }]}>
                    {MOCK_THERAPIST.experience}
                  </Text>
                </View>
                <View style={styles.therapistDetailRow}>
                  <Text style={[styles.therapistDetailLabel, { color: '#5A7BA8', zIndex: 1 }]}>Languages:</Text>
                  <Text style={[styles.therapistDetailValue, { color: '#1C1C1E', zIndex: 1 }]}>
                    {MOCK_THERAPIST.languages}
                  </Text>
                </View>
                <View style={styles.therapistDetailRow}>
                  <Text style={[styles.therapistDetailLabel, { color: '#5A7BA8', zIndex: 1 }]}>Specialty:</Text>
                  <Text style={[styles.therapistDetailValue, { color: '#1C1C1E', zIndex: 1 }]}>
                    Trauma
                  </Text>
                </View>
                <View style={styles.therapistDetailRow}>
                  <Text style={[styles.therapistDetailLabel, { color: '#5A7BA8', zIndex: 1 }]}>Organization:</Text>
                  <Text style={[styles.therapistDetailValue, { color: '#1C1C1E', zIndex: 1 }]}>
                    {MOCK_THERAPIST.organization}
                  </Text>
                </View>
              </View>
            </View>

            {/* Bottom Row: Jane App Card and Journal Widget */}
            <View style={styles.bottomCardsRow}>
              {/* Jane App Card */}
              <TouchableOpacity 
                style={[styles.janeCard, { backgroundColor: '#00C1CA' }]}
                onPress={() => handleCardPress('jane-app')}
                activeOpacity={0.9}
              >
                <View style={styles.janeCardContent}>
                  <Image 
                    source={require('../assets/images/Jane_Logo_Color_RGB.png')}
                    style={styles.janeCardLogo}
                    resizeMode="contain"
                  />
                  <Text style={[styles.janeCardSubtitle, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                    Book a meeting with Dr Hassan
                  </Text>
                  <View style={[styles.janeCardButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                    <Text style={[styles.janeCardButtonText, { color: '#FFFFFF' }]}>Connect</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Journal Widget */}
              <JournalWidgetMiniSupport />
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
        <ModulesSlider />
        {/* Reduced gap between slider and featured section */}
        <View style={{ height: 16 }} />
        {/* Featured Section */}
        <View style={styles.modulesSection}>
          <Text style={[styles.modulesSectionTitle, { color: colors.primaryText }]}>Featured</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredModulesScroll}
          >
            {MOCK_MODULES.slice(0, 3).map((module, index) => (
              <TouchableOpacity
                key={module.id}
                style={[
                  styles.featuredModuleCard, 
                  { backgroundColor: module.color },
                  index === 0 && { marginLeft: 20 } // Add left margin only to first card
                ]}
                onPress={() => handleCardPress('module')}
                activeOpacity={0.9}
              >
                <View style={styles.featuredModuleContent}>
                  <Text style={styles.featuredModuleEmoji}>{module.emoji}</Text>
                  <Text style={styles.featuredModuleTitle}>{module.title}</Text>
                  <Text style={styles.featuredModuleSubtitle}>{module.subtitle}</Text>
                  <View style={styles.featuredModuleMeta}>
                    <Text style={styles.featuredModuleDuration}>{module.duration}</Text>
                  </View>
                  <Text style={styles.featuredModuleType}>{module.type}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Modules Section */}
        <View style={[styles.modulesSection, { paddingHorizontal: 20 }]}>
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
            
            {/* Report Flag Button (disguised subscription toggle) */}
            <TouchableOpacity
              style={[styles.reportFlagButton, { 
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.4)',
              }]}
              onPress={handleSubscriptionToggle}
              activeOpacity={0.8}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M4 4v16M4 4l8 3 8-3v10l-8 3-8-3V4z"
                  stroke={colors.primaryText}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
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
  reportFlagButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    gap: 5,
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
  myCohortCardSquare: {
    width: screenWidth - 40, // Full width minus padding
    height: screenWidth - 40, // Square: same as width
    borderRadius: 30, // Same as journal widget
    padding: 20, // Reduced from 24 to fit content better
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 16,
    overflow: 'hidden', // Ensure blur effect clips to rounded corners
  },
  squareCohortHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20, // Reduced from 32
  },
  squareCohortTitleSection: {
    flex: 1,
  },
  squareCohortMainTitle: {
    fontSize: 38, // Increased from 26 to make it much bigger
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  squareCohortSubtitle: {
    fontSize: 18, // Increased from 15 to make it bigger
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 22, // Adjusted line height proportionally
  },
  squareCohortStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, // Reduced padding
    paddingVertical: 5,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  squareStatusText: {
    fontSize: 13, // Slightly smaller
    fontWeight: '600',
    fontFamily: 'System',
  },
  squareStatsSection: {
    marginBottom: 20, // Reduced from 32
  },
  squareStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0, // Remove padding to use full width
    gap: 12, // Add gap between cards
  },
  squareStatCard: {
    alignItems: 'flex-start', // Left align content
    justifyContent: 'flex-start',
    borderRadius: 16,
    paddingVertical: 20, // Increased back to 20
    paddingHorizontal: 16, // Optimized padding
    flex: 1,
    minHeight: 80, // Ensure consistent height
    overflow: 'hidden', // Ensure blur effect clips to rounded corners
  },
  squareStatNumber: {
    fontSize: 48, // Back to larger size since we have more space
    fontWeight: '700',
    fontFamily: 'System',
    marginBottom: 4, // Reduced gap between number and label
    letterSpacing: -1,
    lineHeight: 48, // Tight line height
  },
  squareStatLabel: {
    fontSize: 14, // Back to larger size
    fontWeight: '500',
    fontFamily: 'System',
    lineHeight: 16,
  },
  squareNextCallSection: {
    marginBottom: 20, // Reduced from 32
    alignItems: 'flex-start', // Left align instead of center
    paddingHorizontal: 10, // Reduced padding
  },
  squareNextCallText: {
    fontSize: 18, // Increased from 15 to make it bigger
    fontWeight: '500',
    fontFamily: 'System',
  },
  squareCohortActionButton: {
    paddingVertical: 18, // Increased from 14 to make button taller
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareCohortActionText: {
    fontSize: 16, // Slightly smaller
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },

  // Therapist Card Styles
  therapistCard: {
    width: '100%',
    borderRadius: 20,
    padding: 20, // Reduced from 24
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 16,
    overflow: 'hidden', // Hide overflow from gradient and blur effects
  },
  therapistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18, // Reduced from 24 for less spacing
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
    fontSize: 22, // Increased from 20
    fontWeight: '700',
    fontFamily: 'System',
    marginBottom: 4, // Reduced from 6 to make it more compact
  },
  therapistCredentials: {
    fontSize: 15, // Increased from 14
    fontWeight: '500',
    fontFamily: 'System',
    marginBottom: 2, // Reduced from 4 to make it more compact
  },
  therapistSpecialization: {
    fontSize: 13, // Increased from 12
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 18, // Increased from 16 for better readability
  },
  therapistDetails: {
    marginBottom: 16, // Reduced from 24
  },
  therapistDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8, // Reduced from 10 for less spacing
  },
  therapistDetailLabel: {
    fontSize: 15, // Increased from 14
    fontWeight: '500',
    fontFamily: 'System',
  },
  therapistDetailValue: {
    fontSize: 15, // Increased from 14
    fontWeight: '600',
    fontFamily: 'System',
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
  },
  janeCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  janeCardLogo: {
    width: 100,
    height: 32,
    marginBottom: 12,
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  janeCardButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
    paddingHorizontal: 0, // Removed horizontal padding
  },
  modulesSection: {
    marginBottom: 32,
    paddingHorizontal: 0, // Changed from 20 to 0 to remove side gaps
  },
  modulesSectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'System',
    marginBottom: 16,
    paddingHorizontal: 20, // Add padding only to the title
  },
  featuredModulesScroll: {
    paddingLeft: 0, // Changed from 20 to 0 to remove left gap
    paddingRight: 0, // No right padding
  },
  featuredModuleCard: {
    width: 200,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    position: 'relative', // Add relative positioning for absolute child
  },
  featuredModuleContent: {
    position: 'absolute',
    top: 16, // Increased slightly to give more top margin
    left: 16, // Reduced left margin for better fit
    right: 16, // Reduced right margin for better fit
    bottom: 16, // Reduced bottom margin for better fit
    justifyContent: 'flex-start', // Changed back to flex-start for top alignment
    alignItems: 'flex-start', // Changed back to flex-start for left alignment
  },
  featuredModuleEmoji: {
    fontSize: 28,
    marginBottom: 8, // Reduced from 12 to make content more compact
  },
  featuredModuleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'System',
    marginBottom: 4, // Reduced from 6 to make content more compact
    textAlign: 'left', // Ensure left alignment
  },
  featuredModuleSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'System',
    lineHeight: 18,
    marginBottom: 8, // Reduced from 12 to make content more compact
    textAlign: 'left', // Ensure left alignment
  },
  featuredModuleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Add bottom margin to push content away from card bottom
  },
  featuredModuleDuration: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'System',
  },
  featuredModuleType: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
    textTransform: 'uppercase',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 6, // Reduced from 12 to 6 to move it further down
    right: 12,
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
