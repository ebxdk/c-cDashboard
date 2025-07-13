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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
      setSubscriptionTier('support');
    }
  };

  const setupProfilesForTier = () => {
    switch (subscriptionTier) {
      case 'support':
        setDisplayedProfiles(MOCK_PROFILES.slice(0, 8));
        break;
      case 'companion':
      case 'mentorship':
        setDisplayedProfiles(MOCK_PROFILES.slice(0, 5));
        break;
      default:
        setDisplayedProfiles(MOCK_PROFILES.slice(0, 8));
    }
  };

  const handleProfileSelect = (profile: Person) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Selected profile:', profile.name);
    router.replace('/dashboard');
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace('/dashboard');
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
          <Text style={styles.subtitle}>Connect with {displayedProfiles.length} people in your community</Text>
        </View>

        {/* Profiles Grid */}
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
        >
          <View style={styles.profilesGrid}>
            {displayedProfiles.map((profile, index) => (
              <TouchableOpacity
                key={profile.id}
                style={styles.gridProfileContainer}
                onPress={() => handleProfileSelect(profile)}
                activeOpacity={0.8}
              >
                <View style={styles.profileImageContainer}>
                  <Image source={profile.image} style={styles.gridProfileImage} />
                </View>
                <Text style={styles.gridProfileName} numberOfLines={1}>{profile.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    marginBottom: 40,
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
  gridContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  gridProfileContainer: {
    width: (SCREEN_WIDTH - 60) / 2 - 10,
    alignItems: 'center',
    marginBottom: 25,
  },
  profileImageContainer: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  gridProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  gridProfileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 12,
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