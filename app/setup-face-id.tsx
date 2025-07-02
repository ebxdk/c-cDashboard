import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Custom Face ID Icon Component using the exact SVG from assets
const FaceIdIcon = ({ size = 80, color = "#2C3E50" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 3H5C3.89543 3 3 3.89543 3 5V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M17 3H19C20.1046 3 21 3.89543 21 5V7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M16 8L16 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M8 8L8 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 16C9 16 10 17 12 17C14 17 15 16 15 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M12 8L12 13L11 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M7 21H5C3.89543 21 3 20.1046 3 19V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M17 21H19C20.1046 21 21 20.1046 21 19V17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export default function SetupFaceIdScreen() {
  const router = useRouter();

  const handleSetupFaceId = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Here you would integrate with Face ID/biometric authentication
    Alert.alert('Face ID Setup', 'Face ID setup completed!', [
      {
        text: 'OK',
        onPress: () => router.push('/persona-selection')
      }
    ]);
  };

  const handleSkipFaceId = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/persona-selection');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <FaceIdIcon />
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