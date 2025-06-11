import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CohortScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#000000' : '#F2F2F7',
    cardBackground: '#A8C8E8', // Same blue as cohort widget
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#6D6D70',
    tertiaryText: isDarkMode ? '#636366' : '#8E8E93',
    cardText: '#FFFFFF', // White text for blue cards
    accent: '#007AFF',
    accentLight: isDarkMode ? 'rgba(0, 122, 255, 0.15)' : 'rgba(0, 122, 255, 0.08)',
    separator: isDarkMode ? 'rgba(84, 84, 88, 0.6)' : 'rgba(60, 60, 67, 0.18)',
    shadow: isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.04)',
    overlay: isDarkMode ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleMyCohort = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/my-cohort');
  };

  const handleOneOnOneMentor = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Navigate to 1-on-1 with Mentor');
  };

  const handleAdvancedMentorship = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Navigate to Advanced Mentorship');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {params.noAnim === '1' && (
        <Stack.Screen options={{ animation: 'none' }} />
      )}
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentInsetAdjustmentBehavior="never"
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.titleSection}>
            <Text style={[styles.largeTitle, { color: colors.primaryText }]}>Cohort</Text>
            <Text style={[styles.instructionText, { color: colors.secondaryText }]}>
              Choose your learning path
            </Text>
          </View>
        </View>

        {/* Main Content Cards */}
        <View style={styles.contentSection}>
          
          {/* My Cohort - Basic Access */}
          <TouchableOpacity 
            style={[styles.planCard, { 
              backgroundColor: colors.cardBackground,
              shadowColor: colors.shadow,
            }]} 
            onPress={handleMyCohort}
            activeOpacity={0.95}
          >
            <View style={styles.planContent}>
              <View style={styles.cardHeader}>
                <Text style={[styles.planTitle, { color: colors.cardText }]}>My Cohort</Text>
                <Text style={[styles.planPrice, { color: colors.cardText }]}>Free</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.planDescription, { color: colors.cardText }]}>
                  Connect with peers and join group discussions
                </Text>
                <View style={styles.featureRow}>
                  <View style={styles.featureDot} />
                  <Text style={[styles.featureText, { color: colors.cardText }]}>Community access</Text>
                </View>
                <View style={styles.featureRow}>
                  <View style={styles.featureDot} />
                  <Text style={[styles.featureText, { color: colors.cardText }]}>Group support</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* 1-on-1 Mentoring */}
          <TouchableOpacity 
            style={[styles.planCard, { 
              backgroundColor: colors.cardBackground,
              shadowColor: colors.shadow,
            }]} 
            onPress={handleOneOnOneMentor}
            activeOpacity={0.95}
          >
            <View style={styles.planContent}>
              <View style={styles.cardHeader}>
                <Text style={[styles.planTitle, { color: colors.cardText }]}>1-on-1 Mentoring</Text>
                <Text style={[styles.planPrice, { color: colors.cardText }]}>Premium</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.planDescription, { color: colors.cardText }]}>
                  Personal guidance with dedicated mentors
                </Text>
                <View style={styles.featureRow}>
                  <View style={styles.featureDot} />
                  <Text style={[styles.featureText, { color: colors.cardText }]}>Personal sessions</Text>
                </View>
                <View style={styles.featureRow}>
                  <View style={styles.featureDot} />
                  <Text style={[styles.featureText, { color: colors.cardText }]}>Custom learning path</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Advanced Mentorship */}
          <TouchableOpacity 
            style={[styles.planCard, { 
              backgroundColor: colors.cardBackground,
              shadowColor: colors.shadow,
            }]} 
            onPress={handleAdvancedMentorship}
            activeOpacity={0.95}
          >
            <View style={styles.planContent}>
              <View style={styles.cardHeader}>
                <Text style={[styles.planTitle, { color: colors.cardText }]}>Advanced Mentorship</Text>
                <Text style={[styles.planPrice, { color: colors.cardText }]}>Elite</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.planDescription, { color: colors.cardText }]}>
                  Expert-level guidance and career support
                </Text>
                <View style={styles.featureRow}>
                  <View style={styles.featureDot} />
                  <Text style={[styles.featureText, { color: colors.cardText }]}>Industry experts</Text>
                </View>
                <View style={styles.featureRow}>
                  <View style={styles.featureDot} />
                  <Text style={[styles.featureText, { color: colors.cardText }]}>Career advancement</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 4,
  },
  headerSection: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  titleSection: {
    alignItems: 'center',
  },
  largeTitle: {
    fontSize: 52,
    fontWeight: '700',
    fontFamily: 'AminMedium',
    letterSpacing: 0.8,
    lineHeight: 64,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'System',
    letterSpacing: 0,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
  },
  contentSection: {
    paddingHorizontal: 20,
    flex: 1,
    gap: 20,
    alignItems: 'center',
  },
  planCard: {
    width: '100%',
    maxWidth: 320,
    height: 200,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  planContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'System',
    letterSpacing: -0.2,
    lineHeight: 24,
    flex: 1,
  },
  planPrice: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'System',
    letterSpacing: 0,
    lineHeight: 18,
    opacity: 0.8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  planDescription: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'System',
    letterSpacing: 0,
    lineHeight: 20,
    opacity: 0.9,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    opacity: 0.8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'System',
    letterSpacing: 0,
    lineHeight: 18,
    opacity: 0.85,
  },
  bottomSpacing: {
    height: 40,
  },
});
