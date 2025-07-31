import * as AuthSession from 'expo-auth-session';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import Svg, { Path } from 'react-native-svg';
import { supabase } from '../lib/supabaseClient';
import { authenticateWithBiometric, checkBiometricAvailability } from '../utils/biometricUtils';
import { onboardingUtils } from '../utils/onboardingUtils';
import { getStoredCredentials, storeCredentials } from '../utils/secureStorage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Apple Logo SVG Component (same as sign up page)
const AppleLogo = ({ width = 20, height = 24, color = '#000000' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
      fill={color}
    />
  </Svg>
);

/** Add Google SVG Icon */
const GoogleLogo = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path fill="#4285F4" d="M21.805 10.023h-9.765v3.955h5.627c-.242 1.236-1.457 3.627-5.627 3.627-3.386 0-6.145-2.803-6.145-6.25s2.759-6.25 6.145-6.25c1.93 0 3.227.82 3.97 1.527l2.713-2.64C17.13 2.82 15.02 1.75 12.04 1.75c-3.386 0-6.145 2.803-6.145 6.25 0 1.07.28 2.08.768 2.945z"/>
    <Path fill="#34A853" d="M3.153 7.345l3.285 2.41c.89-1.73 2.57-2.955 4.602-2.955 1.13 0 2.16.387 2.97 1.02l2.713-2.64C15.02 2.82 12.91 1.75 9.93 1.75c-3.386 0-6.145 2.803-6.145 6.25 0 1.07.28 2.08.768 2.945z"/>
    <Path fill="#FBBC05" d="M12.04 21.75c2.98 0 5.09-.98 6.77-2.68l-3.11-2.55c-.86.58-2.01.98-3.66.98-2.86 0-5.28-1.93-6.15-4.57l-3.22 2.49c1.62 3.18 5.13 5.33 9.37 5.33z"/>
    <Path fill="#EA4335" d="M21.805 10.023h-9.765v3.955h5.627c-.242 1.236-1.457 3.627-5.627 3.627-3.386 0-6.145-2.803-6.145-6.25s2.759-6.25 6.145-6.25c1.93 0 3.227.82 3.97 1.527l2.713-2.64C17.13 2.82 15.02 1.75 12.04 1.75 6.477 1.75 2 6.227 2 11.75s4.477 10 10.04 10c5.77 0 9.56-4.047 9.56-9.75 0-.656-.07-1.15-.16-1.477z" opacity=".1"/>
  </Svg>
);

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      console.log('Biometric info:', biometricInfo); // Debug log
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

  const handleLoginWithEmail = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Store credentials securely for biometric login
      await storeCredentials(email, password);
      
      // Check email verification
      const isEmailVerified = await onboardingUtils.isEmailVerified();
      if (!isEmailVerified) {
        Alert.alert(
          'Email Not Verified', 
          'Please verify your email address before signing in. Check your inbox for a verification link.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/verify-email')
            }
          ]
        );
        return;
      }
      
      // Check onboarding status and redirect accordingly
      const nextStep = await onboardingUtils.getNextOnboardingStep();
      if (nextStep) {
        console.log('Redirecting to onboarding step:', nextStep);
        router.push(nextStep as any);
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Forgot Password', 'Password reset functionality will be implemented soon.');
  };

  const handleSignUp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back(); // Go back to sign up page
  };

  const handleBiometricSignIn = async () => {
    if (!isBiometricAvailable) {
      Alert.alert('Biometric Not Available', 'Please set up Face ID or Touch ID in your device settings.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    try {
      const result = await authenticateWithBiometric(`Sign in with ${biometricType}`);

      if (result.success) {
        // Retrieve stored credentials
        const credentials = await getStoredCredentials();

        if (credentials) {
          // Authenticate with Supabase using stored credentials
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) {
            Alert.alert('Authentication Failed', 'Stored credentials are invalid. Please sign in with email/password.');
            console.error('Supabase auth error:', error);
          } else {
            console.log('Biometric login successful');
            
            // Check email verification
            const isEmailVerified = await onboardingUtils.isEmailVerified();
            if (!isEmailVerified) {
              Alert.alert(
                'Email Not Verified', 
                'Please verify your email address before signing in. Check your inbox for a verification link.',
                [
                  {
                    text: 'OK',
                    onPress: () => router.push('/verify-email')
                  }
                ]
              );
              return;
            }
            
            // Check onboarding status and redirect accordingly
            const nextStep = await onboardingUtils.getNextOnboardingStep();
            if (nextStep) {
              console.log('Redirecting to onboarding step:', nextStep);
              router.push(nextStep as any);
            } else {
              console.log('Onboarding complete, redirecting to dashboard');
              router.push('/dashboard');
            }
          }
        } else {
          Alert.alert('No Stored Credentials', 'Please sign in with email/password first to enable biometric login.');
        }
      } else {
        // Authentication failed or was cancelled
        console.log('Biometric auth result:', result);
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication failed. Please try again.');
      console.error('Biometric auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'yourapp', // must match your app.json
  });

  const handleGoogleSignIn = async () => {
    const authUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUri)}`;
    const result = await (AuthSession as any).default.startAsync({ authUrl });

    if (result.type === 'success' && result.url) {
      // Supabase will handle the session automatically if you use supabase-js v2+
      // Optionally, you can fetch the session here if needed
    } else {
      Alert.alert('Google Sign-In cancelled or failed');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#B8D4F0" translucent={false} />
        
        {/* Back Button - Top Left */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        {/* Main Content */}
        <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        {/* Form */}
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

        {/* Social Sign-In Row */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
            <GoogleLogo width={28} height={28} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Apple Sign-In', 'Apple sign-in coming soon!')}>
            <AppleLogo width={28} height={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.socialButton, styles.biometricButton]} 
            onPress={handleBiometricSignIn}
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
              ? `${biometricType} available for quick sign-in`
              : 'Biometric not available - check device settings'
            }
          </Text>
          <TouchableOpacity 
            style={styles.debugButton} 
            onPress={checkBiometricStatus}
          >
            <Text style={styles.debugButtonText}>Refresh Biometric Status</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.debugButton, { marginTop: 8 }]} 
            onPress={async () => {
              await onboardingUtils.markOnboardingComplete();
              Alert.alert('Debug', 'Onboarding marked as complete for testing');
            }}
          >
            <Text style={styles.debugButtonText}>Mark Onboarding Complete (Debug)</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
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

        {/* Sign Up Link */}
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
    backgroundColor: '#B8D4F0', // Same blue background as sign up page
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 140,
    paddingBottom: 50,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 50,
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
  formContainer: {
    marginBottom: 40,
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
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
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
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginEmailButtonText: {
    color: '#000000',
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
    marginLeft: 4,
  },
  signUpLink: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    fontFamily: 'System',
    textDecorationLine: 'underline',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 24,
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