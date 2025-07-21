import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useBottomNavHeight } from '@/hooks/useBottomNavHeight';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface WelcomeScreenProps {
  onExploreGroups: () => void;
  onCreateGroup: () => void;
}

export default function WelcomeScreen({ onExploreGroups, onCreateGroup }: WelcomeScreenProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { paddingBottom } = useBottomNavHeight();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={[styles.content, { paddingBottom: paddingBottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brotherhood Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/brotherhood.png')}
            style={styles.brotherhoodImage}
            resizeMode="contain"
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            Ready to connect with people like you?
          </Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            Join vibrant communities, share experiences, and build meaningful connections with fellow Muslims on the same journey.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: colors.text }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onExploreGroups();
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.primaryButtonText, { color: colors.background }]}>
              Explore Groups
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: colors.text }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onCreateGroup();
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Create a Group
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 120,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  brotherhoodImage: {
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.5,
  },
  textContent: {
    marginBottom: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: Fonts.system,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    fontFamily: Fonts.system,
    opacity: 0.8,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.system,
  },
  secondaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.system,
  },
}); 