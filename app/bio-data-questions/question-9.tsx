
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export default function Question9() {
  const router = useRouter();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const question = "How do you handle challenges in your faith?";
  const options = [
    "I seek guidance from knowledgeable people",
    "I prefer to reflect and find answers myself",
    "I discuss with friends and community",
    "I turn to prayer and seek Allah's help"
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleContinue = async () => {
    if (selectedAnswer === null) return;
    
    await AsyncStorage.setItem('question-9-answer', selectedAnswer.toString());
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/bio-data-questions/question-10');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B8D4F0" />
      
      <View style={styles.content}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '90%' }]} />
          </View>
          <Text style={styles.progressText}>9 of 10</Text>
        </View>

        <Text style={styles.question}>{question}</Text>

        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption
              ]}
              onPress={() => handleAnswerSelect(index)}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedAnswer === null && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={selectedAnswer === null}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 50,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2C3E50',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#2C3E50',
    textAlign: 'center',
    fontWeight: '500',
  },
  question: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36,
  },
  optionsContainer: {
    flex: 1,
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: '#FFF8E7',
    borderColor: '#2C3E50',
  },
  optionText: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#2C3E50',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
