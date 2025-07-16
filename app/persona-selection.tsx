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
      description: "Soft, nurturing & compassionate tone 🤲",
      image: require('../assets/images/femalememoji1.png'),
      gender: "female"
    },
    {
      id: 1,
      name: "Omar",
      description: "Direct, scholarly & thoughtful approach 📖",
      image: require('../assets/images/memoji1.png'),
      gender: "male"
    },
    {
      id: 2,
      name: "Zara",
      description: "Energetic, encouraging & uplifting style 🌟",
      image: require('../assets/images/femalememoji2.png'),
      gender: "female"
    },
    {
      id: 3,
      name: "Yusuf",
      description: "Straightforward, practical & no-nonsense 💡",
      image: require('../assets/images/memoji2.png'),
      gender: "male"
    },
    {
      id: 4,
      name: "Layla",
      description: "Warm, understanding & patient manner 💛",
      image: require('../assets/images/femalememoji3.png'),
      gender: "female"
    }
  ];

  const handlePersonaSelect = (personaIndex: number) => {
    setSelectedPersona(personaIndex);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleContinue = async () => {
    if (selectedPersona === null) return;
    
    // Save the selected persona and navigate
    try {
      await AsyncStorage.setItem('selected-persona', JSON.stringify(personas[selectedPersona]));
    } catch (error) {
      console.log('Error saving persona:', error);
    }

    // Navigate to next page
    router.push('/question-1');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Choose Your AI Persona</Text>
          <Text style={styles.subtitle}>
            Pick your perfect AI personality match
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

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              selectedPersona === null && styles.disabledButton
            ]}
            onPress={selectedPersona !== null ? handleContinue : undefined}
            activeOpacity={selectedPersona !== null ? 0.8 : 1}
            disabled={selectedPersona === null}
          >
            <Text style={[
              styles.continueButtonText,
              selectedPersona === null && styles.disabledButtonText
            ]}>
              Continue
            </Text>
            <Text style={[
              styles.rightArrow,
              selectedPersona === null && styles.disabledButtonText
            ]}>
              →
            </Text>
          </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 100,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
    gap: 12,
    justifyContent: 'center',
    maxHeight: 400,
  },
  personaCard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedPersona: {
    backgroundColor: '#FFF8E7',
    borderColor: '#2C3E50',
    borderWidth: 2,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  personaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personaImageContainer: {
    marginRight: 12,
  },
  personaImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  personaTextContainer: {
    flex: 1,
  },
  personaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'System',
    marginBottom: 2,
  },
  personaDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: '#34495E',
    fontFamily: 'System',
    lineHeight: 16,
    opacity: 0.8,
  },
  selectedPersonaText: {
    color: '#2C3E50',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2C3E50',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  checkmarkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 30,
    paddingHorizontal: 0,
  },
  continueButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#2C3E50',
  },
  continueButtonText: {
    color: '#2C3E50',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
    marginRight: 8,
  },
  rightArrow: {
    color: '#2C3E50',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    borderColor: '#AAAAAA',
  },
  disabledButtonText: {
    color: '#AAAAAA',
  },
});