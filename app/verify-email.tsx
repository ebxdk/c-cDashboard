import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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

export default function VerifyEmailScreen() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const verifyingRef = useRef(false);
  
  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current;
  const loadingRotation = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  // Timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Loading animation
  useEffect(() => {
    if (isLoading) {
      const rotateAnimation = Animated.loop(
        Animated.timing(loadingRotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();
      return () => rotateAnimation.stop();
    }
  }, [isLoading]);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleVerify = async () => {
    if (verifyingRef.current) return;
    verifyingRef.current = true;
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      // Do nothing if not all digits are filled (shouldn't happen with auto-verify)
      verifyingRef.current = false;
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    setShowCheckmark(false);
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Stop loading animation and show checkmark
      setIsLoading(false);
      setShowCheckmark(true);
      // Animate checkmark appearance
      Animated.sequence([
        Animated.timing(checkmarkScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      // Wait for checkmark animation to complete, then navigate
      setTimeout(() => {
        router.push('/setup-face-id');
        verifyingRef.current = false;
      }, 800);
    } catch (error) {
      setIsLoading(false);
      setShowCheckmark(false);
      Alert.alert('Error', 'Invalid verification code. Please try again.');
      verifyingRef.current = false;
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // If all slots are filled, auto-verify
    if (newCode.every((digit) => digit.length === 1)) {
      Keyboard.dismiss();
      handleVerify();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      if (code[index]) {
        // Clear the current digit
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      } else if (index > 0) {
        // Move to previous and clear it
        inputRefs.current[index - 1]?.focus();
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
      }
    }
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setResendTimer(30);
    Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
  };

  // Original Verification Screen
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* Back Button - Top Left */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail-outline" size={60} color="#2C3E50" />
              </View>
              <Text style={styles.title}>Check Your Email</Text>
              <Text style={styles.subtitle}>
                We sent a verification code to your email address. Enter the 6-digit code below to verify your account.
              </Text>
            </View>

            {/* Code Input */}
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.codeInput,
                    digit ? styles.codeInputFilled : null
                  ]}
                  value={digit}
                  onChangeText={(value) => handleCodeChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                  onFocus={() => {
                    // Always focus the first empty input
                    const firstEmpty = code.findIndex((c) => c === '');
                    if (firstEmpty !== -1 && firstEmpty !== index) {
                      inputRefs.current[firstEmpty]?.focus();
                    }
                  }}
                />
              ))}
            </View>

            {/* Verify Button */}
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity 
                style={[styles.verifyButton, (isLoading || showCheckmark) && styles.disabledButton]} 
                onPress={handleVerify}
                disabled={isLoading || showCheckmark}
              >
                {isLoading ? (
                  <Animated.View
                    style={{
                      transform: [{
                        rotate: loadingRotation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg']
                        })
                      }]
                    }}
                  >
                    <Ionicons name="refresh" size={20} color="#2C3E50" />
                  </Animated.View>
                ) : showCheckmark ? (
                  <Animated.View
                    style={{
                      transform: [{ scale: checkmarkScale }]
                    }}
                  >
                    <Ionicons name="checkmark" size={20} color="#2C3E50" />
                  </Animated.View>
                ) : (
                  <Text style={styles.verifyButtonText}>Verify Email</Text>
                )}
              </TouchableOpacity>
            </Animated.View>

            {/* Resend Code */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code? </Text>
              <TouchableOpacity 
                onPress={handleResendCode}
                disabled={resendTimer > 0}
              >
                <Text style={[
                  styles.resendLink,
                  resendTimer > 0 && styles.resendDisabled
                ]}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Help Text */}
            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Make sure to check your spam folder if you don't see the email in your inbox.
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 45,
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'System',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'rgba(44, 62, 80, 0.1)',
  },
  codeInputFilled: {
    borderColor: '#2C3E50',
    backgroundColor: '#FFF8E7',
  },
  verifyButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  verifyButtonText: {
    color: '#2C3E50',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
  disabledButton: {
    opacity: 0.6,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    color: '#34495E',
    fontFamily: 'System',
    opacity: 0.8,
  },
  resendLink: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
    fontFamily: 'System',
    textDecorationLine: 'underline',
  },
  resendDisabled: {
    color: '#34495E',
    opacity: 0.5,
    textDecorationLine: 'none',
  },
  helpContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  helpText: {
    fontSize: 12,
    color: '#34495E',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'System',
    opacity: 0.7,
  },
});
