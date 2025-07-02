import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Person {
  id: number;
  name: string;
  age: number;
  location: string;
  image: any;
  bio: string;
  interests: string[];
}

// Mock profiles data
const MOCK_PROFILES: Person[] = [
  {
    id: 1,
    name: "Amara Hassan",
    age: 24,
    location: "Toronto, Canada",
    image: require('../assets/images/femalememoji1.png'),
    bio: "Recent revert finding my way in Islam. Love reading and deep conversations.",
    interests: ["Quran Study", "Reading", "Nature Walks"]
  },
  {
    id: 2,
    name: "Omar Abdullah",
    age: 28,
    location: "London, UK",
    image: require('../assets/images/memoji1.png'),
    bio: "Software engineer passionate about Islamic history and technology.",
    interests: ["Islamic History", "Technology", "Fitness"]
  },
  {
    id: 3,
    name: "Zara Ahmed",
    age: 22,
    location: "Sydney, Australia",
    image: require('../assets/images/femalememoji2.png'),
    bio: "University student exploring my faith journey with curiosity and joy.",
    interests: ["Art", "Cooking", "Community Service"]
  },
  {
    id: 4,
    name: "Ibrahim Khan",
    age: 31,
    location: "New York, USA",
    image: require('../assets/images/memoji2.png'),
    bio: "Teacher and mentor helping others grow in their Islamic knowledge.",
    interests: ["Teaching", "Mentoring", "Sports"]
  },
  {
    id: 5,
    name: "Layla Mohamed",
    age: 26,
    location: "Dubai, UAE",
    image: require('../assets/images/femalememoji3.png'),
    bio: "Healthcare worker dedicated to serving others and strengthening my deen.",
    interests: ["Healthcare", "Volunteering", "Travel"]
  },
  {
    id: 6,
    name: "Yusuf Ali",
    age: 29,
    location: "Birmingham, UK",
    image: require('../assets/images/memoji3.png'),
    bio: "Business owner balancing entrepreneurship with Islamic values.",
    interests: ["Business", "Islamic Finance", "Family"]
  },
  {
    id: 7,
    name: "Fatima Rahman",
    age: 23,
    location: "Chicago, USA",
    image: require('../assets/images/femalememoji1.png'),
    bio: "Graduate student passionate about Islamic literature and poetry.",
    interests: ["Literature", "Poetry", "Languages"]
  },
  {
    id: 8,
    name: "Hassan Ahmed",
    age: 27,
    location: "Manchester, UK",
    image: require('../assets/images/memoji1.png'),
    bio: "Engineer and community organizer building bridges through faith.",
    interests: ["Engineering", "Community", "Photography"]
  },
  {
    id: 9,
    name: "Aisha Thompson",
    age: 25,
    location: "Los Angeles, USA",
    image: require('../assets/images/femalememoji2.png'),
    bio: "Creative professional exploring Islam through art and expression.",
    interests: ["Art", "Design", "Music"]
  },
  {
    id: 10,
    name: "Khalid Roberts",
    age: 30,
    location: "Toronto, Canada",
    image: require('../assets/images/memoji2.png'),
    bio: "Recent revert sharing the journey with fellow new Muslims.",
    interests: ["Cooking", "Hiking", "Learning Arabic"]
  }
];

export default function PeopleMatchesScreen() {
  const router = useRouter();
  const [subscriptionTier, setSubscriptionTier] = useState<string>('support');
  const [displayedProfiles, setDisplayedProfiles] = useState<Person[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadSubscriptionData();
    startAnimations();
  }, []);

  useEffect(() => {
    if (subscriptionTier) {
      setupProfilesForTier();
    }
  }, [subscriptionTier]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadSubscriptionData = async () => {
    try {
      const subscription = await AsyncStorage.getItem('selected-subscription');
      if (subscription) {
        setSubscriptionTier(subscription);
      }
    } catch (error) {
      console.log('Error loading subscription:', error);
      setSubscriptionTier('support'); // Default fallback
    }
  };

  const setupProfilesForTier = () => {
    switch (subscriptionTier) {
      case 'support':
        // Support+: Show 8 profiles in a grid
        setDisplayedProfiles(MOCK_PROFILES.slice(0, 8));
        break;
      case 'companion':
        // Companion+: Show 1 profile, with ability to scroll for more
        setDisplayedProfiles(MOCK_PROFILES.slice(0, 5));
        break;
      case 'mentorship':
        // Mentorship+: Show 1 profile, with ability to scroll for more (premium profiles)
        setDisplayedProfiles(MOCK_PROFILES.slice(0, 5));
        break;
      default:
        setDisplayedProfiles(MOCK_PROFILES.slice(0, 8));
    }
  };

  const handleProfileSelect = (profile: Person) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Navigate to chat or profile detail
    console.log('Selected profile:', profile.name);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/dashboard');
  };

  const handleNextProfile = () => {
    if (currentProfileIndex < displayedProfiles.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentProfileIndex(currentProfileIndex + 1);
    }
  };

  const handlePrevProfile = () => {
    if (currentProfileIndex > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentProfileIndex(currentProfileIndex - 1);
    }
  };

  const getTierDisplayName = () => {
    switch (subscriptionTier) {
      case 'support': return 'Support+';
      case 'companion': return 'Companion+';
      case 'mentorship': return 'Mentorship+';
      default: return 'Support+';
    }
  };

  const renderSupportTierGrid = () => (
    <View style={styles.gridContainer}>
      <Text style={styles.gridTitle}>Your Community Matches</Text>
      <Text style={styles.gridSubtitle}>Connect with {displayedProfiles.length} people in your area</Text>
      
      <View style={styles.profilesGrid}>
        {displayedProfiles.map((profile, index) => (
          <TouchableOpacity
            key={profile.id}
            style={styles.gridProfileCard}
            onPress={() => handleProfileSelect(profile)}
            activeOpacity={0.8}
          >
            <Image source={profile.image} style={styles.gridProfileImage} />
            <Text style={styles.gridProfileName}>{profile.name}</Text>
            <Text style={styles.gridProfileAge}>{profile.age}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSingleProfileView = () => {
    const currentProfile = displayedProfiles[currentProfileIndex];
    
    if (!currentProfile) return null;

    return (
      <View style={styles.singleProfileContainer}>
        <Text style={styles.singleTitle}>Your Perfect Match</Text>
        <Text style={styles.singleSubtitle}>Swipe or scroll to see more options</Text>
        
        <View style={styles.profileCard}>
          <Image source={currentProfile.image} style={styles.singleProfileImage} />
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentProfile.name}</Text>
            <Text style={styles.profileDetails}>{currentProfile.age} • {currentProfile.location}</Text>
            <Text style={styles.profileBio}>{currentProfile.bio}</Text>
            
            <View style={styles.interestsContainer}>
              {currentProfile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Navigation dots */}
        <View style={styles.dotsContainer}>
          {displayedProfiles.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentProfileIndex ? '#2C3E50' : 'rgba(44, 62, 80, 0.3)' }
              ]}
            />
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={handleNextProfile}
            disabled={currentProfileIndex >= displayedProfiles.length - 1}
          >
            <Text style={styles.passButtonText}>Pass</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.connectButton]}
            onPress={() => handleProfileSelect(currentProfile)}
          >
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B8D4F0" translucent={false} />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.tierBadge}>{getTierDisplayName()}</Text>
          <Text style={styles.title}>People Near You</Text>
        </View>

        {/* Content based on tier */}
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {subscriptionTier === 'support' ? renderSupportTierGrid() : renderSingleProfileView()}
        </ScrollView>

        {/* Continue button */}
        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0',
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  tierBadge: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  
  // Support+ Grid Styles
  gridContainer: {
    flex: 1,
  },
  gridTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
  },
  gridSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'System',
    opacity: 0.8,
  },
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  gridProfileCard: {
    width: (SCREEN_WIDTH - 60) / 2 - 7.5, // Account for padding and gap
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gridProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  gridProfileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 4,
    fontFamily: 'System',
  },
  gridProfileAge: {
    fontSize: 14,
    fontWeight: '400',
    color: '#34495E',
    fontFamily: 'System',
    opacity: 0.8,
  },
  
  // Single Profile View Styles
  singleProfileContainer: {
    flex: 1,
    alignItems: 'center',
  },
  singleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
  },
  singleSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'System',
    opacity: 0.8,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  singleProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#F8F9FA',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    fontFamily: 'System',
  },
  profileDetails: {
    fontSize: 16,
    fontWeight: '500',
    color: '#34495E',
    marginBottom: 16,
    fontFamily: 'System',
  },
  profileBio: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34495E',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    fontFamily: 'System',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
    fontFamily: 'System',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  passButton: {
    backgroundColor: 'rgba(44, 62, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.2)',
  },
  connectButton: {
    backgroundColor: '#2C3E50',
  },
  passButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    fontFamily: 'System',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
  continueButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'System',
  },
}); 