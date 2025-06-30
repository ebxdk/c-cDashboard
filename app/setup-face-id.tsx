import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SetupFaceIdScreen() {
  const router = useRouter();

  const handleSetupFaceId = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Here you would integrate with Face ID/biometric authentication
    Alert.alert('Face ID Setup', 'Face ID setup would be implemented here.', [
      {
        text: 'OK',
        onPress: () => router.push('/dashboard')
      }
    ]);
  };

  const handleSkipFaceId = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/dashboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="happy-outline" size={80} color="#2C3E50" />
          </View>
          <Text style={styles.title}>Setup Face ID</Text>
          <Text style={styles.subtitle}>
            Secure your account with Face ID for quick and easy access to your account.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.setupFaceIdButton} 
            onPress={handleSetupFaceId}
          >
            <Text style={styles.setupFaceIdButtonText}>Setup Face ID</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={handleSkipFaceId}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
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
    paddingTop: 120,
    paddingHorizontal: 30,
    paddingBottom: 50,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  iconContainer: {
    marginBottom: 20,
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
  buttonContainer: {
    marginTop: 40,
  },
  setupFaceIdButton: {
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
  setupFaceIdButtonText: {
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