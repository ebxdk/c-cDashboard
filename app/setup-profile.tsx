import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
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

export default function SetupProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleImagePicker = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
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
    
    if (!age.trim()) {
      Alert.alert('Required Field', 'Please enter your age.');
      return;
    }
    
    if (!location.trim()) {
      Alert.alert('Required Field', 'Please enter your location.');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 13 and 120.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Navigate to persona selection
    router.push('/persona-selection');
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Skip Profile Setup', 'You can complete your profile later in settings.', [
      {
        text: 'Skip',
        onPress: () => router.push('/persona-selection')
      },
      {
        text: 'Continue Setup',
        style: 'cancel'
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Help others get to know you better by sharing a bit about yourself.
            </Text>
          </View>

          {/* Profile Picture Section */}
          <View style={styles.profilePictureSection}>
            <Text style={styles.sectionTitle}>Profile Picture</Text>
            <TouchableOpacity style={styles.imageContainer} onPress={handleImagePicker}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />c
              ) : (
                <View style={styles.placeholderImage}>
                  <Ionicons name="camera" size={40} color="#34495E" />
                  <Text style={styles.placeholderText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.optionalText}>Optional</Text>
          </View>

          {/* Description Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>About Me</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={handleDescriptionChange}
              placeholder="Tell us a bit about yourself..."
              placeholderTextColor="#34495E80"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.wordCount}>
              {wordCount}/30 words
            </Text>
          </View>

          {/* Age Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor="#34495E80"
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          {/* Location Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="City, Country"
              placeholderTextColor="#34495E80"
              autoCapitalize="words"
            />
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Complete Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#2C3E50',
    fontSize: 24,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 120,
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34495E',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'System',
    opacity: 0.8,
    paddingHorizontal: 10,
  },
  profilePictureSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
    fontFamily: 'System',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(44, 62, 80, 0.1)',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 12,
    color: '#34495E',
    fontFamily: 'System',
    marginTop: 4,
  },
  optionalText: {
    fontSize: 12,
    color: '#34495E',
    fontFamily: 'System',
    opacity: 0.6,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    fontFamily: 'System',
  },
  input: {
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
  textArea: {
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
    minHeight: 100,
  },
  wordCount: {
    fontSize: 12,
    color: '#34495E',
    fontFamily: 'System',
    textAlign: 'right',
    marginTop: 4,
    opacity: 0.6,
  },
  buttonContainer: {
    marginTop: 40,
  },
  continueButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    color: '#2C3E50',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34495E',
  },
  skipButtonText: {
    color: '#34495E',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
}); 