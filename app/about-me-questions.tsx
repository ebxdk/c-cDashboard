
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Question {
  id: string;
  question: string;
  placeholder: string;
  type: 'text' | 'multiline';
}

const questions: Question[] = [
  {
    id: 'location',
    question: 'Where are you located?',
    placeholder: 'City, State/Country',
    type: 'text',
  },
  {
    id: 'age',
    question: 'How old are you?',
    placeholder: 'Your age',
    type: 'text',
  },
  {
    id: 'occupation',
    question: 'What do you do for work?',
    placeholder: 'Your occupation or field of work',
    type: 'text',
  },
  {
    id: 'hobbies',
    question: 'What are your hobbies?',
    placeholder: 'Tell us about your favorite activities and interests',
    type: 'multiline',
  },
  {
    id: 'faith_journey',
    question: 'Describe your faith journey',
    placeholder: 'Share about your spiritual path and experiences',
    type: 'multiline',
  },
  {
    id: 'goals',
    question: 'What are your current goals?',
    placeholder: 'Personal, professional, or spiritual goals',
    type: 'multiline',
  },
  {
    id: 'values',
    question: 'What values are important to you?',
    placeholder: 'The principles that guide your life',
    type: 'multiline',
  },
  {
    id: 'community',
    question: 'How do you like to connect with community?',
    placeholder: 'Your preferred ways of building relationships',
    type: 'multiline',
  },
  {
    id: 'free_time',
    question: 'How do you spend your free time?',
    placeholder: 'Your typical leisure activities',
    type: 'multiline',
  },
  {
    id: 'looking_for',
    question: 'What are you looking for in this community?',
    placeholder: 'Your hopes and expectations',
    type: 'multiline',
  },
];

export default function AboutMeQuestionsScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (isLastQuestion) {
      // Save answers and navigate to dashboard
      console.log('About Me Answers:', answers);
      router.push('/dashboard');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/dashboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Progress Header */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </View>

          {/* Question */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.questionContainer}>
              <Text style={styles.questionNumber}>
                Question {currentQuestionIndex + 1}
              </Text>
              <Text style={styles.questionText}>
                {currentQuestion.question}
              </Text>
            </View>

            {/* Answer Input */}
            <View style={styles.answerContainer}>
              <TextInput
                style={[
                  styles.answerInput,
                  currentQuestion.type === 'multiline' && styles.multilineInput
                ]}
                value={answers[currentQuestion.id] || ''}
                onChangeText={handleAnswerChange}
                placeholder={currentQuestion.placeholder}
                placeholderTextColor="#34495E80"
                multiline={currentQuestion.type === 'multiline'}
                numberOfLines={currentQuestion.type === 'multiline' ? 4 : 1}
                textAlignVertical={currentQuestion.type === 'multiline' ? 'top' : 'center'}
                autoFocus
              />
            </View>
          </ScrollView>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <View style={styles.navigationButtons}>
              {currentQuestionIndex > 0 && (
                <TouchableOpacity 
                  style={styles.previousButton} 
                  onPress={handlePrevious}
                >
                  <Ionicons name="arrow-back" size={20} color="#34495E" />
                  <Text style={styles.previousButtonText}>Previous</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={[styles.nextButton, { marginLeft: 'auto' }]} 
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>
                  {isLastQuestion ? 'Complete' : 'Next'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#2C3E50" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.skipButton} 
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>Skip remaining questions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0',
  },
  keyboardAvoidingView: {
    flex: 1,
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
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFF8E7',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#34495E',
    textAlign: 'center',
    fontFamily: 'System',
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionNumber: {
    fontSize: 14,
    color: '#34495E',
    fontFamily: 'System',
    opacity: 0.7,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    fontFamily: 'System',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  answerContainer: {
    marginBottom: 40,
  },
  answerInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2C3E50',
    fontFamily: 'System',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
  },
  multilineInput: {
    minHeight: 120,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#34495E',
    gap: 8,
  },
  previousButtonText: {
    color: '#34495E',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 8,
  },
  nextButtonText: {
    color: '#2C3E50',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#34495E',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'System',
    textDecorationLine: 'underline',
    opacity: 0.7,
  },
});
