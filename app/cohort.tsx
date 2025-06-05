
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';

export default function CohortScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#000000' : '#F2F2F7',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#8E8E93',
    accent: '#007AFF',
    separator: isDarkMode ? '#38383A' : '#C6C6C8',
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleMyCohort = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Navigate to My Cohort');
  };

  const handleOneOnOneMentor = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Navigate to 1-on-1 with Mentor');
  };

  const handleAdvancedMentorship = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Navigate to Advanced Mentorship');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      {/* Large Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.largeTitle, { color: colors.primaryText }]}>Cohort</Text>
      </View>

      {/* Menu Items */}
      <View style={[styles.menuContainer, { backgroundColor: colors.cardBackground }]}>
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.separator }]} 
          onPress={handleMyCohort}
          activeOpacity={0.6}
        >
          <View style={styles.menuItemContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.menuIcon}>👥</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.menuTitle, { color: colors.primaryText }]}>My Cohort</Text>
              <Text style={[styles.menuSubtitle, { color: colors.secondaryText }]}>
                Connect with your fellow learners
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.secondaryText }]}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.separator }]} 
          onPress={handleOneOnOneMentor}
          activeOpacity={0.6}
        >
          <View style={styles.menuItemContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.menuIcon}>🎯</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.menuTitle, { color: colors.primaryText }]}>1-on-1 with Mentor</Text>
              <Text style={[styles.menuSubtitle, { color: colors.secondaryText }]}>
                Schedule personal guidance sessions
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.secondaryText }]}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={handleAdvancedMentorship}
          activeOpacity={0.6}
        >
          <View style={styles.menuItemContent}>
            <View style={styles.iconContainer}>
              <Text style={styles.menuIcon}>🚀</Text>
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.menuTitle, { color: colors.primaryText }]}>Advanced Mentorship</Text>
              <Text style={[styles.menuSubtitle, { color: colors.secondaryText }]}>
                Access specialized guidance programs
              </Text>
            </View>
            <Text style={[styles.chevron, { color: colors.secondaryText }]}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Back Button - iOS Style */}
      <TouchableOpacity 
        style={[styles.backButton, { backgroundColor: colors.cardBackground }]} 
        onPress={handleBackPress}
        activeOpacity={0.6}
      >
        <Text style={[styles.backButtonText, { color: colors.accent }]}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: 0.4,
  },
  menuContainer: {
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  menuItem: {
    borderBottomWidth: 0.5,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: '400',
    fontFamily: 'System',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 16,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  backButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
});
