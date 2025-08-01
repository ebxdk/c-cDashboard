import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Keyboard,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { supabase } from '../lib/supabaseClient';
import { onboardingUtils } from '../utils/onboardingUtils';

// --- COMMENTED OUT: Original verification logic and state ---
/*
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import {
    Alert,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
*/

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginWithEmail = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        Alert.alert('Error', error.message || 'Login failed');
        return;
      }
      
      // Check email verification
      const isEmailVerified = await onboardingUtils.isEmailVerified();
      if (!isEmailVerified) {
        Alert.alert(
          'Email Not Verified', 
          'Please verify your email address before signing in. Check your inbox for a verification link.'
        );
        return;
      }
      
      // Reset profile setup status for new users to ensure proper flow
      await onboardingUtils.resetProfileSetupStatus();
      
      // Reset gender selection for new users to ensure they see gender page
      await onboardingUtils.resetGenderSelection();
      
      // Debug: Check onboarding status
      const status = await onboardingUtils.getOnboardingStatus();
      console.log('Onboarding status:', status);
      
      // Check onboarding status and redirect accordingly
      const nextStep = await onboardingUtils.getNextOnboardingStep();
      console.log('Next onboarding step:', nextStep);
      
      if (nextStep === 'profile-gender') {
        console.log('Redirecting to gender selection');
        router.push('/profile-gender');
      } else if (nextStep === 'profile-picture') {
        console.log('Redirecting to profile picture');
        router.push('/profile-picture');
      } else if (nextStep === 'persona-selection') {
        console.log('Redirecting to persona selection');
        router.push('/persona-selection');
      } else if (nextStep === 'question-1') {
        console.log('Redirecting to questionnaire');
        router.push('/question-1');
      } else if (nextStep === 'subscription') {
        console.log('Redirecting to subscription');
        router.push('/subscription');
      } else if (nextStep === 'verify-email') {
        console.log('Still needs email verification');
        Alert.alert('Email Not Verified', 'Please verify your email address.');
      } else {
        console.log('Onboarding complete, redirecting to dashboard');
        router.push('/dashboard');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset functionality will be implemented soon.');
  };

  const handleSignUp = () => {
    router.back(); // Go back to sign up page
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#B8D4F0" translucent={false} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Verification Link Sent</Text>
          <Text style={styles.subtitle}>
            We have sent a verification link to your email. Once you verify, please proceed to log in below.
          </Text>
          {/* --- Login Form (copied from login.tsx) --- */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#34495E80"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#34495E80"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity style={styles.forgotPasswordButton} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.loginEmailButton, isLoading && styles.buttonDisabled]} 
              onPress={handleLoginWithEmail}
              disabled={isLoading}
            >
              <Text style={styles.loginEmailButtonText}>
                {isLoading ? 'Signing in...' : 'Sign in with email'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <TouchableOpacity onPress={handleSignUp} style={styles.signUpLinkContainer}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 30,
    paddingBottom: 50,
    justifyContent: 'center',
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
    marginBottom: 40,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#34495E',
    fontWeight: '600',
    fontFamily: 'System',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'System',
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.2)',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    fontFamily: 'System',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  loginEmailButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginEmailButtonText: {
    color: '#2C3E50',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpContainer: {
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#34495E',
    fontFamily: 'System',
    opacity: 0.8,
  },
  signUpLinkContainer: {
    marginTop: 5,
  },
  signUpLink: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    fontFamily: 'System',
    textDecorationLine: 'underline',
  },
});
