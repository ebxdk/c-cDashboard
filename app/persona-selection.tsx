import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { onboardingUtils } from '../utils/onboardingUtils';

const { width: screenWidth } = Dimensions.get('window');

export default function PersonaSelectionScreen() {
  const router = useRouter();
  const [selectedPersona, setSelectedPersona] = useState<number>(0);
  const [userGender, setUserGender] = useState<string | null>(null);
  const [filteredPersonas, setFilteredPersonas] = useState<any[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const allPersonas = [
    // Male personas
    {
      id: 0,
      name: "Ahmed",
      description: "Direct, scholarly & thoughtful approach 📖",
      image: require('../assets/images/memoji1.png'),
      gender: "male"
    },
    {
      id: 1,
      name: "Yusuf",
      description: "Straightforward, practical & no-nonsense 💡",
      image: require('../assets/images/memoji2.png'),
      gender: "male"
    },
    {
      id: 2,
      name: "Khalid",
      description: "Wise, calm & deeply reflective 🧘",
      image: require('../assets/images/memoji3.png'),
      gender: "male"
    },
    // Female personas
    {
      id: 3,
      name: "Amina",
      description: "Soft, nurturing & compassionate tone 🤲",
      image: require('../assets/images/femalememoji1.png'),
      gender: "female"
    },
    {
      id: 4,
      name: "Zara",
      description: "Energetic, encouraging & uplifting style 🌟",
      image: require('../assets/images/femalememoji2.png'),
      gender: "female"
    },
    {
      id: 5,
      name: "Layla",
      description: "Warm, understanding & patient manner 💛",
      image: require('../assets/images/femalememoji3.png'),
      gender: "female"
    }
  ];

  // Load user gender and filter personas
  useEffect(() => {
    const loadUserGender = async () => {
      try {
        const gender = await AsyncStorage.getItem('user-gender');
        setUserGender(gender);
        
        if (gender) {
          const filtered = allPersonas.filter(persona => persona.gender === gender);
          setFilteredPersonas(filtered);
        } else {
          setFilteredPersonas(allPersonas); // Fallback to all personas
        }
      } catch (error) {
        console.error('Error loading user gender:', error);
        setFilteredPersonas(allPersonas); // Fallback to all personas
      }
    };
    
    loadUserGender();
  }, []);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    if (index !== selectedPersona) {
      setSelectedPersona(index);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleDotPress = (index: number) => {
    setSelectedPersona(index);
    scrollViewRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleContinue = async () => {
    // Mark profile setup as complete
    await onboardingUtils.markProfileSetupComplete();
    
    // Save the selected persona and navigate
    try {
      await AsyncStorage.setItem('selected-persona', JSON.stringify(filteredPersonas[selectedPersona]));
    } catch (error) {
      console.log('Error saving persona:', error);
    }

    // Navigate to next page
    router.push('/question-1');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B8D4F0" translucent={false} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.title}>Choose AI Persona</Text>
        <View style={styles.rightSpacer} />
      </View>

      {/* Persona Slider */}
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
        >
          {filteredPersonas.map((persona: any, index: number) => (
            <View key={index} style={styles.slide}>
              <View style={styles.personaImageContainer}>
                <Image source={persona.image} style={styles.personaImage} />
              </View>
              <Text style={styles.personaName}>{persona.name}</Text>
              <Text style={styles.personaDescription}>{persona.description}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Navigation Dots */}
        <View style={styles.dotsContainer}>
          {filteredPersonas.map((_: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                selectedPersona === index && styles.activeDot
              ]}
              onPress={() => handleDotPress(index)}
            />
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  rightSpacer: {
    width: 44,
  },
  sliderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  personaImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  personaImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  personaName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  personaDescription: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(44, 62, 80, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2C3E50',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  continueButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
  },
  continueButtonText: {
    color: '#2C3E50',
    fontSize: 17,
    fontWeight: '600',
  },
});