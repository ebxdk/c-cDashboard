import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileAboutScreen() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleDescriptionChange = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const count = words.length;

    if (count <= 30) {
      setDescription(text);
      setWordCount(count);
    }
  };

  const handleContinue = () => {
    if (!description.trim()) {
      Alert.alert('Required Field', 'Please add a description about yourself.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to the next profile setup page
    router.push('/profile-age');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B8D4F0" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.subtitle}>Share something interesting about yourself in 30 words or less.</Text>
            
            {/* About Me Section */}
            <View style={styles.aboutSection}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={description}
                  onChangeText={handleDescriptionChange}
                  placeholder="Share something interesting about yourself..."
                  placeholderTextColor="#8E8E93"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={200}
                />
                <Text style={styles.wordCount}>
                  {wordCount}/30 words
                </Text>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.continueButton, description.trim() && styles.continueButtonActive]} 
              onPress={handleContinue}
            >
              <Text style={styles.continueButtonText}>Next</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 0,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'System',
    lineHeight: 32,
  },
  aboutSection: {
    width: '100%',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    fontSize: 16,
    color: '#2C3E50',
    fontFamily: 'System',
    minHeight: 100,
    paddingVertical: 0,
    lineHeight: 24,
  },
  wordCount: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'right',
    fontFamily: 'System',
  },
  buttonContainer: {
    marginTop: 40,
  },
  continueButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
  },
  continueButtonActive: {
    backgroundColor: '#FFF8E7',
    borderColor: '#2C3E50',
  },
  continueButtonText: {
    color: '#2C3E50',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
}); 