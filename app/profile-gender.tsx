import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function ProfileGenderScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const handleGenderSelect = (gender: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedGender(gender);
  };

  const handleContinue = async () => {
    if (!selectedGender) {
      return; // Button should be disabled anyway
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // Save the selected gender to AsyncStorage
      await AsyncStorage.setItem('user-gender', selectedGender);
      
      // Navigate to the profile picture page
      router.push('/profile-picture');
    } catch (error) {
      console.error('Error saving gender selection:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B8D4F0" translucent={false} />
      
      <View style={styles.content}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>What's your gender?</Text>
          <Text style={styles.subtitle}>This helps us personalize your experience</Text>
          
          {/* Gender Selection */}
          <View style={styles.genderContainer}>
            <TouchableOpacity 
              style={[
                styles.genderOption, 
                selectedGender === 'male' && styles.genderOptionSelected
              ]} 
              onPress={() => handleGenderSelect('male')}
            >
              <View style={styles.genderIconContainer}>
                <Ionicons 
                  name="male" 
                  size={40} 
                  color={selectedGender === 'male' ? '#2C3E50' : '#2C3E50'} 
                />
              </View>
              <Text style={[
                styles.genderText,
                selectedGender === 'male' && styles.genderTextSelected
              ]}>
                Male
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.genderOption, 
                selectedGender === 'female' && styles.genderOptionSelected
              ]} 
              onPress={() => handleGenderSelect('female')}
            >
              <View style={styles.genderIconContainer}>
                <Ionicons 
                  name="female" 
                  size={40} 
                  color={selectedGender === 'female' ? '#2C3E50' : '#2C3E50'} 
                />
              </View>
              <Text style={[
                styles.genderText,
                selectedGender === 'female' && styles.genderTextSelected
              ]}>
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.continueButton, 
              !selectedGender && styles.continueButtonDisabled
            ]} 
            onPress={handleContinue}
            disabled={!selectedGender}
          >
            <Text style={[
              styles.continueButtonText,
              !selectedGender && styles.continueButtonTextDisabled
            ]}>
              Continue
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
    backgroundColor: '#B8D4F0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 60,
    fontFamily: 'System',
    lineHeight: 22,
    opacity: 0.8,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  genderOption: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    minWidth: 120,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  genderOptionSelected: {
    backgroundColor: '#FFF8E7',
    borderColor: '#2C3E50',
  },
  genderIconContainer: {
    marginBottom: 12,
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'System',
  },
  genderTextSelected: {
    color: '#2C3E50',
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 16,
    marginTop: 40,
    marginBottom: 60,
    width: '100%',
  },
  continueButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 200,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E5EA',
    borderColor: '#E5E5EA',
  },
  continueButtonText: {
    color: '#2C3E50',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
  continueButtonTextDisabled: {
    color: '#8E8E93',
  },
}); 