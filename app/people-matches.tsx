import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
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
  profession?: string;
  education?: string;
  strengths?: string[];
  isCompanion?: boolean; // Added for companion profiles
}

// Enhanced mock profiles data
const MOCK_PROFILES: Person[] = [
  {
    id: 1,
    name: "Amara Hassan",
    age: 24,
    location: "Toronto, Canada",
    image: require('../assets/images/femalememoji1.png'),
    bio: "Recent revert finding my way in Islam. Love reading and deep conversations.",
    interests: ["Quran Study", "Reading", "Nature Walks"],
    profession: "Software Developer",
    education: "Computer Science, University of Toronto",
    strengths: ["Patient Listener", "Thoughtful", "Encouraging"]
  },
  {
    id: 2,
    name: "Omar Abdullah",
    age: 28,
    location: "London, UK",
    image: require('../assets/images/memoji1.png'),
    bio: "Software engineer passionate about Islamic history and technology.",
    interests: ["Islamic History", "Technology", "Fitness"],
    profession: "Senior Engineer",
    education: "Engineering, Imperial College London",
    strengths: ["Knowledgeable", "Analytical", "Supportive"]
  },
  {
    id: 3,
    name: "Zara Ahmed",
    age: 22,
    location: "Sydney, Australia",
    image: require('../assets/images/femalememoji2.png'),
    bio: "University student exploring my faith journey with curiosity and joy.",
    interests: ["Art", "Cooking", "Community Service"],
    profession: "Medical Student",
    education: "Medicine, University of Sydney",
    strengths: ["Empathetic", "Creative", "Dedicated"]
  },
  {
    id: 4,
    name: "Ibrahim Khan",
    age: 31,
    location: "New York, USA",
    image: require('../assets/images/memoji2.png'),
    bio: "Teacher and mentor helping others grow in their Islamic knowledge.",
    interests: ["Teaching", "Mentoring", "Sports"],
    profession: "Islamic Studies Teacher",
    education: "Islamic Studies, Al-Azhar University",
    strengths: ["Wise", "Patient", "Inspiring"]
  },
  {
    id: 5,
    name: "Layla Mohamed",
    age: 26,
    location: "Dubai, UAE",
    image: require('../assets/images/femalememoji3.png'),
    bio: "Healthcare worker dedicated to serving others and strengthening my deen.",
    interests: ["Healthcare", "Volunteering", "Travel"],
    profession: "Nurse",
    education: "Nursing, American University of Beirut",
    strengths: ["Caring", "Reliable", "Compassionate"]
  },
  {
    id: 6,
    name: "Yusuf Ali",
    age: 29,
    location: "Birmingham, UK",
    image: require('../assets/images/memoji3.png'),
    bio: "Business owner balancing entrepreneurship with Islamic values.",
    interests: ["Business", "Islamic Finance", "Family"],
    profession: "Entrepreneur",
    education: "Business Administration, University of Birmingham",
    strengths: ["Leadership", "Innovative", "Ethical"]
  },
  {
    id: 7,
    name: "Fatima Rahman",
    age: 23,
    location: "Chicago, USA",
    image: require('../assets/images/femalememoji1.png'),
    bio: "Graduate student passionate about Islamic literature and poetry.",
    interests: ["Literature", "Poetry", "Languages"],
    profession: "PhD Student",
    education: "Literature, University of Chicago",
    strengths: ["Articulate", "Deep Thinker", "Cultured"]
  },
  {
    id: 8,
    name: "Hassan Ahmed",
    age: 27,
    location: "Manchester, UK",
    image: require('../assets/images/memoji1.png'),
    bio: "Engineer and community organizer building bridges through faith.",
    interests: ["Engineering", "Community", "Photography"],
    profession: "Civil Engineer",
    education: "Engineering, University of Manchester",
    strengths: ["Organized", "Community-minded", "Technical"]
  }
];

export default function PeopleMatchesScreen() {
  const router = useRouter();
  const [subscriptionTier, setSubscriptionTier] = useState<string>('support');
  const [displayedProfiles, setDisplayedProfiles] = useState<Person[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Person | null>(null);
  const [userGender, setUserGender] = useState<string | null>(null);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadSubscriptionData();
    loadUserGender();
    startAnimations();
  }, []);

  useEffect(() => {
    if (subscriptionTier && userGender) {
      setupProfilesForTier();
    }
  }, [subscriptionTier, userGender]);

  const loadUserGender = async () => {
    try {
      const gender = await AsyncStorage.getItem('user-gender');
      setUserGender(gender);
    } catch (error) {
      console.log('Error loading user gender:', error);
      setUserGender(null);
    }
  };

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
      setSubscriptionTier('support');
    }
  };

  const setupProfilesForTier = () => {
    // Filter profiles based on user gender
    let genderFilteredProfiles = MOCK_PROFILES;
    if (userGender === 'male') {
      // For male users, show only male profiles
      genderFilteredProfiles = MOCK_PROFILES.filter(profile => 
        profile.name.includes('Omar') || 
        profile.name.includes('Ibrahim') || 
        profile.name.includes('Yusuf') || 
        profile.name.includes('Hassan')
      );
    } else if (userGender === 'female') {
      // For female users, show only female profiles
      genderFilteredProfiles = MOCK_PROFILES.filter(profile => 
        profile.name.includes('Amara') || 
        profile.name.includes('Zara') || 
        profile.name.includes('Layla') || 
        profile.name.includes('Fatima')
      );
    }
    // If no gender is set, show all profiles (fallback)

    switch (subscriptionTier) {
      case 'support':
        // For Support+: Show 1 companion first + 7 reverts
        const companionProfile = {
          ...genderFilteredProfiles[genderFilteredProfiles.length - 1], // Use last profile as companion
          isCompanion: true, // Mark as companion
          name: userGender === 'male' ? "Omar Hassan" : "Amina Hassan", // Gender-appropriate companion name
          bio: "Experienced companion and mentor helping reverts on their journey. Passionate about Islamic knowledge and community building.",
          profession: "Islamic Studies Teacher",
          education: "Islamic Studies, Al-Azhar University",
          strengths: ["Patient", "Knowledgeable", "Supportive"]
        };
        const supportProfiles = [
          companionProfile, // Companion first
          ...genderFilteredProfiles.slice(0, Math.min(7, genderFilteredProfiles.length)), // Then up to 7 reverts
        ];
        setDisplayedProfiles(supportProfiles);
        break;
      case 'companion':
      case 'mentorship':
        setDisplayedProfiles(genderFilteredProfiles.slice(0, Math.min(5, genderFilteredProfiles.length)));
        break;
      default:
        setDisplayedProfiles(genderFilteredProfiles.slice(0, Math.min(8, genderFilteredProfiles.length)));
    }
  };

  const handleProfileSelect = (profile: Person) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Selected profile:', profile.name);
    setSelectedProfile(profile);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (selectedProfile) {
      router.replace('/dashboard');
    } else {
      console.warn('No profile selected to continue.');
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
          <Text style={styles.subtitle}>
            {subscriptionTier === 'support' 
              ? `Swipe through ${displayedProfiles.length} people (1 companion + 7 reverts)`
              : `Swipe through ${displayedProfiles.length} people in your community`
            }
          </Text>
        </View>

        {/* TikTok-style Profile Cards */}
        <FlatList 
          data={displayedProfiles}
          renderItem={({ item }) => {
            const isSelected = selectedProfile?.id === item.id;
            const cardContent = (
              <>
                {/* Backdrop Area (top third) */}
                <View style={[
                  styles.backdropArea,
                  item.isCompanion && styles.companionBackdropArea,
                  isSelected && styles.selectedBackdropArea
                ]}>
                  {/* Companion Badge */}
                  {item.isCompanion && (
                    <View style={styles.companionBadge}>
                      <Text style={styles.companionBadgeText}>Companion</Text>
                    </View>
                  )}
                  
                  {/* Selection Badge */}
                  {isSelected && (
                    <View style={styles.selectionBadge}>
                      <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                    </View>
                  )}
                  
                  {/* Profile Picture positioned at bottom border */}
                  <View style={styles.profileImageContainer}>
                    <Image source={item.image} style={styles.profileImage} />
                  </View>
                </View>
                
                {/* Profile Info Area */}
                <View style={styles.profileInfoArea}>
                  {/* Name and Age */}
                  <View style={styles.nameAgeContainer}>
                    <Text style={styles.profileName}>{item.name}</Text>
                    <Text style={styles.profileAge}>{item.age}</Text>
                  </View>
                  
                  {/* Location */}
                  <Text style={styles.profileLocation}>{item.location}</Text>
                  
                  {/* Bio */}
                  <Text style={styles.profileBio}>{item.bio}</Text>
                </View>
              </>
            );

            // For Support+, render as View (non-clickable)
            if (subscriptionTier === 'support') {
              return (
                <View
                  key={item.id}
                  style={[
                    styles.profileCard,
                    item.isCompanion && styles.companionCard
                  ]}
                >
                  {cardContent}
                </View>
              );
            }

            // For other tiers, render as TouchableOpacity (clickable for selection)
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.profileCard,
                  item.isCompanion && styles.companionCard,
                  isSelected && styles.selectedCard
                ]}
                onPress={() => handleProfileSelect(item)}
                activeOpacity={0.95}
              >
                {cardContent}
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true} // Makes scrolling more strict like TikTok
          snapToInterval={SCREEN_HEIGHT * 0.6 + 20} // Snap to the height of each card plus margin
          snapToAlignment="start" // Ensures cards snap to the top of the screen
          decelerationRate={0.2} // Much faster deceleration for strict snapping
          scrollEventThrottle={16} // More responsive scroll events (60fps)
          getItemLayout={(data, index) => ({
            length: SCREEN_HEIGHT * 0.6 + 20,
            offset: (SCREEN_HEIGHT * 0.6 + 20) * index,
            index,
          })}
          contentContainerStyle={styles.cardsContent}
        />

        {/* Continue button */}
        <TouchableOpacity 
          style={[
            styles.continueButton,
            !selectedProfile && subscriptionTier !== 'support' && styles.continueButtonDisabled
          ]} 
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!selectedProfile && subscriptionTier !== 'support'}
        >
          <Text style={[
            styles.continueButtonText,
            !selectedProfile && subscriptionTier !== 'support' && styles.continueButtonTextDisabled
          ]}>
            {subscriptionTier === 'support' 
              ? 'Continue to Dashboard' 
              : selectedProfile 
                ? `Continue with ${selectedProfile.name}` 
                : 'Select a person to continue'
            }
          </Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34495E',
    textAlign: 'center',
    fontFamily: 'System',
    opacity: 0.8,
  },
  scrollContainer: {
    flex: 1,
  },
  cardsContent: {
    paddingTop: 20, // Added top padding for better spacing from header
    paddingBottom: 20, // Changed back to paddingBottom for vertical scroll
  },
  profileCard: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.6, // Reduced from 0.7 to fit screen better
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20, // Changed back to marginBottom for vertical spacing
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  companionCard: {
    backgroundColor: '#E8F5E9', // Lighter green background for companion
    borderWidth: 2,
    borderColor: '#4CAF50', // Green border for companion
  },
  companionBackdropArea: {
    backgroundColor: '#E8F5E9', // Lighter green background for companion
  },
  companionBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  companionBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
  },
  backdropArea: {
    height: SCREEN_HEIGHT * 0.25, // Increased from 0.23 to accommodate bigger profile picture
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative', // Added for absolute positioning of profile picture
  },
  profileInfoArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60, // Increased from 24 to move text further down and avoid profile picture overlap
    paddingBottom: 24,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -40, // Position at bottom border of backdrop section
    left: 24, // Left-aligned with content padding
    zIndex: 10, // Ensure it's above other content
  },
  profileImage: {
    width: 100, // Increased from 80
    height: 100, // Increased from 80
    borderRadius: 50, // Increased from 40
    borderWidth: 4, // Increased from 3
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, // Increased from 0.1
    shadowRadius: 12, // Increased from 8
    elevation: 6, // Increased from 4
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Changed from 'center' to left-align
    marginBottom: 8,
    marginLeft: 0, // Ensure no left margin
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    marginRight: 8,
    textAlign: 'left', // Ensure left alignment
  },
  profileAge: {
    fontSize: 20,
    fontWeight: '600',
    color: '#34495E',
    opacity: 0.8,
    textAlign: 'left', // Ensure left alignment
  },
  profileLocation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#34495E',
    textAlign: 'left', // Changed from 'center' to left-align
    marginBottom: 16,
    opacity: 0.7,
  },
  profileBio: {
    fontSize: 16,
    fontWeight: '400',
    color: '#2C3E50',
    textAlign: 'left', // Changed from 'center' to left-align
    lineHeight: 24,
    flex: 1,
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
  continueButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#808080',
  },
  continueButtonTextDisabled: {
    color: '#A0A0A0',
  },
  selectedBackdropArea: {
    backgroundColor: '#E0F2F7', // Light blue background for selected
  },
  selectionBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#4CAF50',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selectionBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50', // Green border for selected
  },
});