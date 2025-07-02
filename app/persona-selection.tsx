
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PersonaSelectionScreen() {
  const router = useRouter();
  const [selectedPersona, setSelectedPersona] = useState<number | null>(null);

  const personas = [
    {
      id: 0,
      name: "Amina",
      description: "Compassionate spiritual guide with gentle wisdom",
      image: require('../assets/images/femalememoji1.png'),
      gender: "female"
    },
    {
      id: 1,
      name: "Omar",
      description: "Knowledgeable mentor who loves deep conversations",
      image: require('../assets/images/memoji1.png'),
      gender: "male"
    },
    {
      id: 2,
      name: "Zara",
      description: "Encouraging friend who celebrates your growth",
      image: require('../assets/images/femalememoji2.png'),
      gender: "female"
    },
    {
      id: 3,
      name: "Yusuf",
      description: "Thoughtful advisor with practical life insights",
      image: require('../assets/images/memoji2.png'),
      gender: "male"
    },
    {
      id: 4,
      name: "Layla",
      description: "Warm companion who understands your journey",
      image: require('../assets/images/femalememoji3.png'),
      gender: "female"
    }
  ];

  const handlePersonaSelect = async (personaIndex: number) => {
    if (selectedPersona !== null && selectedPersona !== personaIndex) {
      // Allow changing the answer
      setSelectedPersona(personaIndex);
    } else if (selectedPersona === null) {
      // First time selecting
      setSelectedPersona(personaIndex);
    } else {
      // Same option selected again, proceed to next page
      proceedToNext(personaIndex);
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Auto-proceed after selection
    setTimeout(() => {
      proceedToNext(personaIndex);
    }, 800);
  };

  const proceedToNext = async (personaIndex: number) => {
    // Save the selected persona
    try {
      await AsyncStorage.setItem('selected-persona', JSON.stringify(personas[personaIndex]));
    } catch (error) {
      console.log('Error saving persona:', error);
    }
    
    router.push('/question-1');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Choose Your AI Companion</Text>
          <Text style={styles.subtitle}>
            Select the persona that resonates with you most
          </Text>
        </View>

        {/* Persona Options */}
        <View style={styles.personasContainer}>
          {personas.map((persona, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.personaCard,
                selectedPersona === index && styles.selectedPersona
              ]}
              onPress={() => handlePersonaSelect(index)}
              activeOpacity={0.8}
            >
              <View style={styles.personaContent}>
                <View style={styles.personaImageContainer}>
                  <Image source={persona.image} style={styles.personaImage} />
                </View>
                
                <View style={styles.personaTextContainer}>
                  <Text style={[
                    styles.personaName,
                    selectedPersona === index && styles.selectedPersonaText
                  ]}>
                    {persona.name}
                  </Text>
                  <Text style={[
                    styles.personaDescription,
                    selectedPersona === index && styles.selectedPersonaText
                  ]}>
                    {persona.description}
                  </Text>
                </View>
                
                {selectedPersona === index && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0', // Match onboarding background
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34495E',
    textAlign: 'center',
    fontFamily: 'System',
    opacity: 0.8,
    lineHeight: 24,
  },
  personasContainer: {
    flex: 1,
    gap: 16,
  },
  personaCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedPersona: {
    backgroundColor: '#FFF8E7',
    borderColor: '#2C3E50',
    borderWidth: 2,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  personaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personaImageContainer: {
    marginRight: 16,
  },
  personaImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  personaTextContainer: {
    flex: 1,
  },
  personaName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'System',
    marginBottom: 4,
  },
  personaDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#34495E',
    fontFamily: 'System',
    lineHeight: 20,
    opacity: 0.8,
  },
  selectedPersonaText: {
    color: '#2C3E50',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2C3E50',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmarkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
