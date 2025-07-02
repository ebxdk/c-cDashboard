import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function Question10Screen() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Load saved answer when page comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const loadSavedAnswer = async () => {
        try {
          const savedAnswer = await AsyncStorage.getItem('question-10-answer');
          if (savedAnswer !== null) {
            setSelectedOption(parseInt(savedAnswer, 10));
          }
        } catch (error) {
          console.log('Error loading saved answer:', error);
        }
      };
      loadSavedAnswer();
    }, [])
  );

  const handleOptionSelect = async (optionIndex: number) => {
    if (selectedOption !== null && selectedOption !== optionIndex) {
      // Allow changing the answer
      setSelectedOption(optionIndex);
    } else if (selectedOption === null) {
      // First time selecting
      setSelectedOption(optionIndex);
    } else {
      // Same option selected again, do nothing
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Save the answer
    try {
      await AsyncStorage.setItem('question-10-answer', optionIndex.toString());
    } catch (error) {
      console.log('Error saving answer:', error);
    }
    
    // Final question - navigate to subscription page
    setTimeout(() => {
      router.push('/subscription');
    }, 300);
  };

  const options = [
    "Slow and steady",
    "Go with the flow",
    "A bit of structure",
    "Fast but focused"
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>10 of 10</Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            What pace feels right for your journey?
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === index && styles.selectedOption
              ]}
              onPress={() => handleOptionSelect(index)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.optionText,
                selectedOption === index && styles.selectedOptionText
              ]}>
                {option}
              </Text>
              {selectedOption === index && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
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
    backgroundColor: '#B8D4F0',
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(44, 62, 80, 0.2)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2C3E50',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 13,
    color: '#34495E',
    fontWeight: '500',
    fontFamily: 'System',
    opacity: 0.8,
  },
  questionContainer: {
    marginBottom: 50,
  },
  questionText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    lineHeight: 38,
    fontFamily: 'System',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 64,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: '#FFF8E7',
    borderColor: '#2C3E50',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    fontFamily: 'System',
    flex: 1,
    lineHeight: 24,
  },
  selectedOptionText: {
    color: '#2C3E50',
    fontWeight: '600',
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