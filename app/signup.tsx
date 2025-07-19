import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
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
import { supabase } from '../lib/supabaseClient'
import * as AuthSession from 'expo-auth-session';
import Svg, { Path } from 'react-native-svg';
import { checkBiometricAvailability, authenticateWithBiometric } from '../utils/biometricUtils';
import { storeCredentials } from '../utils/secureStorage';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  // Check biometric availability on component mount
  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    try {
      const biometricInfo = await checkBiometricAvailability();
      console.log('Signup - Biometric info:', biometricInfo); // Debug log
      setIsBiometricAvailable(biometricInfo.isAvailable);
      setBiometricType(biometricInfo.type);
    } catch (error) {
      console.log('Biometric check failed:', error);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSignUp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    // Password requirements
    const passwordRequirements = [
      { regex: /.{8,}/, message: 'at least 8 characters' },
      { regex: /[A-Z]/, message: 'an uppercase letter' },
      { regex: /[a-z]/, message: 'a lowercase letter' },
      { regex: /[0-9]/, message: 'a number' },
      { regex: /[^A-Za-z0-9]/, message: 'a special character' },
    ];
    const failed = passwordRequirements.filter(req => !req.regex.test(password));
    if (failed.length > 0) {
      Alert.alert('Password Requirements',
        'Password must contain:\n' + failed.map(f => '- ' + f.message).join('\n')
      );
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try { 
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: process.env.EXPO_PUBLIC_EMAIL_REDIRECT_URL || 'https://your-app.vercel.app/welcome',
        },
      });

      if (error) throw error;

      // Store credentials securely for biometric login
      await storeCredentials(email, password);

      Alert.alert('Check your email', 'We sent you a confirmation link.');
      router.push('/verify-email');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/login'); // Navigate to login screen
  };

  const handleBiometricSignUp = async () => {
    if (!isBiometricAvailable) {
      Alert.alert('Biometric Not Available', 'Please set up Face ID or Touch ID in your device settings.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    try {
      const result = await authenticateWithBiometric(`Set up ${biometricType} for quick sign-in`);

      if (result.success) {
        // Store credentials securely for future biometric login
        await storeCredentials(email, password);
        
        Alert.alert(
          'Biometric Setup Complete', 
          `${biometricType} has been set up for quick sign-in. Your credentials are now securely stored.`,
          [
            {
              text: 'Continue',
              onPress: () => router.push('/dashboard')
            }
          ]
        );
      } else {
        console.log('Biometric setup result:', result);
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric setup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  // For Expo Go, useProxy: true is needed, but not a valid property in makeRedirectUri in some versions
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'yourapp', // must match your app.json
    // useProxy: true, // Uncomment if your Expo version supports it
  });

  const handleGoogleSignUp = async () => {
    // For Expo Go, useProxy: true is needed in makeRedirectUri in some versions
    const authUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUri)}`;
    const result = await (AuthSession as any).default.startAsync({ authUrl });
    console.log('Google Auth result:', result);

    if (result.type === 'success' && result.url) {
      // Supabase will handle the session automatically if you use supabase-js v2+
      // Optionally, you can fetch the session here if needed
    } else {
      Alert.alert('Google Sign-Up cancelled or failed', `Result type: ${result.type}`);
    }
  };



  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B8D4F0" translucent={false} />

      {/* Back Button - Top Left */}
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our community of faith</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor="#34495E80"
                autoCapitalize="words"
                textContentType="name"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#34495E80"
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  placeholderTextColor="#34495E80"
                  secureTextEntry={!showPassword}
                  textContentType="newPassword"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color="#2C3E50" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#34495E80"
                  secureTextEntry={!showConfirmPassword}
                  textContentType="newPassword"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye" : "eye-off"} 
                    size={20} 
                    color="#2C3E50" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button - Circular Arrow */}
            <View style={styles.signUpButtonContainer}>
              <TouchableOpacity 
                style={[styles.signUpButton, isLoading && styles.disabledButton]} 
                onPress={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Text style={styles.loadingText}>...</Text>
                ) : (
                  <Ionicons 
                    name="arrow-forward" 
                    size={24} 
                    color="#2C3E50" 
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* Social Sign-In Row */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignUp}>
                {/* GoogleLogo SVG (reuse from login page) */}
                <Svg width={28} height={28} viewBox="0 0 24 24">
                  <Path fill="#4285F4" d="M21.805 10.023h-9.765v3.955h5.627c-.242 1.236-1.457 3.627-5.627 3.627-3.386 0-6.145-2.803-6.145-6.25s2.759-6.25 6.145-6.25c1.93 0 3.227.82 3.97 1.527l2.713-2.64C17.13 2.82 15.02 1.75 12.04 1.75c-3.386 0-6.145 2.803-6.145 6.25 0 1.07.28 2.08.768 2.945z"/>
                  <Path fill="#34A853" d="M3.153 7.345l3.285 2.41c.89-1.73 2.57-2.955 4.602-2.955 1.13 0 2.16.387 2.97 1.02l2.713-2.64C15.02 2.82 12.91 1.75 9.93 1.75c-3.386 0-6.145 2.803-6.145 6.25 0 1.07.28 2.08.768 2.945z"/>
                  <Path fill="#FBBC05" d="M12.04 21.75c2.98 0 5.09-.98 6.77-2.68l-3.11-2.55c-.86.58-2.01.98-3.66.98-2.86 0-5.28-1.93-6.15-4.57l-3.22 2.49c1.62 3.18 5.13 5.33 9.37 5.33z"/>
                  <Path fill="#EA4335" d="M21.805 10.023h-9.765v3.955h5.627c-.242 1.236-1.457 3.627-5.627 3.627-3.386 0-6.145-2.803-6.145-6.25s2.759-6.25 6.145-6.25c1.93 0 3.227.82 3.97 1.527l2.713-2.64C17.13 2.82 15.02 1.75 12.04 1.75 6.477 1.75 2 6.227 2 11.75s4.477 10 10.04 10c5.77 0 9.56-4.047 9.56-9.75 0-.656-.07-1.15-.16-1.477z" opacity=".1"/>
                </Svg>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.socialButton, styles.biometricButton]} 
                onPress={handleBiometricSignUp}
                disabled={isLoading}
              >
                <View style={styles.biometricButtonContent}>
                  <Text style={styles.biometricIcon}>
                    {biometricType === 'Face ID' ? '👁️' : biometricType === 'Touch ID' ? '👆' : '🔐'}
                  </Text>
                  <Text style={styles.biometricLabel}>
                    {biometricType || 'Biometric'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Biometric Status Indicator */}
            <View style={styles.biometricStatusContainer}>
              <Text style={styles.biometricStatusText}>
                {isBiometricAvailable 
                  ? `Set up ${biometricType} for quick sign-in`
                  : 'Biometric not available - check device settings'
                }
              </Text>
              <TouchableOpacity 
                style={styles.debugButton} 
                onPress={checkBiometricStatus}
              >
                <Text style={styles.debugButtonText}>Refresh Biometric Status</Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>

            {/* Terms */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0', // Same blue background as login page
  },
  backButton: {
    position: 'absolute',
    top: 60,
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
    flexGrow: 1,
    paddingTop: 140,
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
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34495E',
    textAlign: 'center',
    fontFamily: 'System',
    opacity: 0.8,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
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
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2C3E50',
    fontFamily: 'System',
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  signUpButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButton: {
    backgroundColor: '#FFF8E7',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingText: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  loginText: {
    fontSize: 14,
    color: '#34495E',
    fontFamily: 'System',
    opacity: 0.8,
  },
  loginLink: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    fontFamily: 'System',
    textDecorationLine: 'underline',
  },
  termsContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#34495E',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'System',
    opacity: 0.7,
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
    gap: 24,
  },
  biometricButton: {
    backgroundColor: '#E8F5E8',
  },
  biometricIcon: {
    fontSize: 24,
  },
  biometricStatusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  biometricStatusText: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '500',
    fontFamily: 'System',
    textAlign: 'center',
  },
  debugButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
  },
  debugButtonText: {
    fontSize: 10,
    color: '#2C3E50',
    fontWeight: '500',
    fontFamily: 'System',
  },
  biometricButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricLabel: {
    fontSize: 8,
    color: '#2C3E50',
    fontWeight: '500',
    fontFamily: 'System',
    marginTop: 2,
  },
});