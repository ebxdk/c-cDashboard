
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function CohortScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#000000' : '#EEEEEE',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#A0A0A0' : '#666666',
    buttonBackground: isDarkMode ? '#2C2C2E' : '#F2F2F7',
    accent: '#007AFF',
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleMyCohort = () => {
    // TODO: Navigate to My Cohort page
    console.log('Navigate to My Cohort');
  };

  const handleOneOnOneMentor = () => {
    // TODO: Navigate to 1-on-1 with Mentor page
    console.log('Navigate to 1-on-1 with Mentor');
  };

  const handleAdvancedMentorship = () => {
    // TODO: Navigate to Advanced Mentorship page
    console.log('Navigate to Advanced Mentorship');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: colors.accent }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.primaryText }]}>Cohort</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
          Connect with your cohort and mentors
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.cardBackground }]} 
            onPress={handleMyCohort}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonEmoji}>👥</Text>
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonTitle, { color: colors.primaryText }]}>My Cohort</Text>
                <Text style={[styles.buttonSubtitle, { color: colors.secondaryText }]}>
                  Connect with your fellow learners
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.secondaryText }]}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.cardBackground }]} 
            onPress={handleOneOnOneMentor}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonEmoji}>🎯</Text>
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonTitle, { color: colors.primaryText }]}>1-on-1 with Mentor</Text>
                <Text style={[styles.buttonSubtitle, { color: colors.secondaryText }]}>
                  Schedule personal guidance sessions
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.secondaryText }]}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.cardBackground }]} 
            onPress={handleAdvancedMentorship}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonEmoji}>🚀</Text>
              <View style={styles.buttonTextContainer}>
                <Text style={[styles.buttonTitle, { color: colors.primaryText }]}>Advanced Mentorship</Text>
                <Text style={[styles.buttonSubtitle, { color: colors.secondaryText }]}>
                  Access specialized guidance programs
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.secondaryText }]}>›</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    fontFamily: 'Poppins-Regular',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Poppins-Regular',
  },
  buttonSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  chevron: {
    fontSize: 20,
    fontWeight: '300',
  },
});
