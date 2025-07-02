import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Persona {
  id: number;
  name: string;
  description: string;
  image: any;
  gender: string;
}

export default function MatchResultsScreen() {
  const router = useRouter();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [personalizedDescription, setPersonalizedDescription] = useState<string>('');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [typewriterComplete, setTypewriterComplete] = useState<boolean>(false);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const cursorAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadUserData();
    startAnimations();
  }, []);

  useEffect(() => {
    if (personalizedDescription && selectedPersona) {
      // Start typewriter effect after a brief delay
      setTimeout(() => {
        startTypewriterEffect();
      }, 1000);
    }
  }, [personalizedDescription, selectedPersona]);

  useEffect(() => {
    // Cursor blinking animation
    const blinkCursor = () => {
      Animated.sequence([
        Animated.timing(cursorAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (showCursor) {
          blinkCursor();
        }
      });
    };
    
    if (showCursor) {
      blinkCursor();
    }
  }, [showCursor, cursorAnim]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startTypewriterEffect = () => {
    const text = personalizedDescription;
    let currentIndex = 0;
    
    const typeNextCharacter = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
        
        // Add slight haptic feedback for each character (very light)
        if (currentIndex % 5 === 0) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        // Vary typing speed for more natural feel
        const delay = Math.random() * 50 + 30; // 30-80ms per character
        setTimeout(typeNextCharacter, delay);
      } else {
        // Typewriter complete
        setTypewriterComplete(true);
        // Hide cursor after a delay
        setTimeout(() => {
          setShowCursor(false);
        }, 2000);
      }
    };
    
    typeNextCharacter();
  };

  const loadUserData = async () => {
    try {
      // Load selected persona
      const personaData = await AsyncStorage.getItem('selected-persona');
      if (personaData) {
        const persona = JSON.parse(personaData);
        setSelectedPersona(persona);
      }

      // Load questionnaire answers and generate personalized description
      const description = await generatePersonalizedDescription();
      setPersonalizedDescription(description);
    } catch (error) {
      console.log('Error loading user data:', error);
      setPersonalizedDescription('I found someone perfect for your spiritual journey!');
    }
  };

  const generatePersonalizedDescription = async (): Promise<string> => {
    try {
      // Load all questionnaire answers
      const answers = [];
      for (let i = 1; i <= 10; i++) {
        const answer = await AsyncStorage.getItem(`question-${i}-answer`);
        if (answer !== null) {
          answers[i - 1] = parseInt(answer, 10);
        }
      }

      // Generate description based on key answers
      let traits = [];
      
      // Journey level (Q2)
      if (answers[1] === 0) traits.push("curious beginner");
      else if (answers[1] === 1) traits.push("eager learner");
      else if (answers[1] === 2) traits.push("dedicated student");
      else if (answers[1] === 3) traits.push("confident believer");

      // Conversation style (Q3)
      if (answers[2] === 0) traits.push("scholarly-minded");
      else if (answers[2] === 1) traits.push("growth-focused");
      else if (answers[2] === 2) traits.push("spiritually deep");
      else if (answers[2] === 3) traits.push("authentically real");

      // Personality match (Q4)
      if (answers[3] === 0) traits.push("gentle soul");
      else if (answers[3] === 1) traits.push("wisdom seeker");
      else if (answers[3] === 2) traits.push("enthusiastic spirit");
      else if (answers[3] === 3) traits.push("balanced individual");

      // Social style (Q6)
      if (answers[5] === 0) traits.push("thoughtful");
      else if (answers[5] === 1) traits.push("expressive");
      else if (answers[5] === 2) traits.push("warmly social");
      else if (answers[5] === 3) traits.push("adaptable");

      // Learning style (Q8)
      if (answers[7] === 0) traits.push("structured learner");
      else if (answers[7] === 1) traits.push("reflective observer");
      else if (answers[7] === 2) traits.push("curious questioner");
      else if (answers[7] === 3) traits.push("collaborative partner");

      // Create personalized sentence
      const selectedTraits = traits.slice(0, 2); // Use first 2 traits for shorter text
      if (selectedTraits.length >= 2) {
        return `I matched you with someone perfect for a ${selectedTraits[0]}, ${selectedTraits[1]} person like you.`;
      } else if (selectedTraits.length === 1) {
        return `I found the perfect companion for a ${selectedTraits[0]} like you.`;
      } else {
        return `I found someone who perfectly matches your spiritual journey.`;
      }
    } catch (error) {
      console.log('Error generating description:', error);
      return `I found someone perfect for your unique spiritual journey.`;
    }
  };

  const handleScreenTap = () => {
    if (typewriterComplete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.replace('/people-matches');
    }
  };

  if (!selectedPersona) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Loading your match...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handleScreenTap}
      activeOpacity={1}
      disabled={!typewriterComplete}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#B8D4F0" translucent={false} />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Persona Display */}
        <View style={styles.personaContainer}>
          <Image source={selectedPersona.image} style={styles.personaImage} />
        </View>

        {/* Typewriter Text */}
        <View style={styles.textContainer}>
          <Text style={styles.typewriterText}>
            {displayedText}
            {showCursor && (
              <Animated.View 
                style={[
                  styles.cursor,
                  { opacity: cursorAnim }
                ]}
              />
            )}
          </Text>
        </View>

        {/* Tap to continue hint (only show when typewriter is complete) */}
        {typewriterComplete && (
          <Animated.View 
            style={[
              styles.tapHint,
              {
                opacity: fadeAnim
              }
            ]}
          >
            <Text style={styles.tapHintText}>Tap to continue</Text>
          </Animated.View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  personaContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  personaImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 6,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  textContainer: {
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
  },
  typewriterText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    fontFamily: 'System',
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  cursor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2C3E50',
    marginLeft: 4,
    marginBottom: 4,
    alignSelf: 'baseline',
  },
  tapHint: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
  },
  tapHintText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#34495E',
    fontFamily: 'System',
    opacity: 0.6,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2C3E50',
    fontFamily: 'System',
  },
}); 