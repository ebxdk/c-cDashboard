import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const options = { 
  headerShown: false,
  presentation: 'modal',
  headerTitle: '',
  headerStyle: { display: 'none' }
};

// Alternative exports for different navigation setups
export const screenOptions = { headerShown: false };
export const navigationOptions = { headerShown: false };

// Custom Face ID Icon Component
const FaceIdIcon = ({ size = 20, color = "#007AFF" }) => (
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

// Star Icon for Pro features
const StarIcon = ({ size = 16, color = "#FFD700" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
  </Svg>
);

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');

  const colors = {
    background: isDarkMode ? '#000000' : '#F2F2F7',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#666666',
    tertiaryText: isDarkMode ? '#636366' : '#999999',
    accent: '#007AFF',
    border: isDarkMode ? '#38383A' : '#C6C6C8',
    separator: isDarkMode ? '#38383A' : '#C6C6C8',
    proGradient: ['#007AFF', '#5856D6'],
    upgradeBackground: isDarkMode ? '#1A237E' : '#E3F2FD',
  };

  const handleSettingPress = (setting: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    switch (setting) {
      case 'editProfile':
        router.push('/settings/edit-profile');
        break;
      case 'faceId':
        router.push('/setup-face-id');
        break;
      case 'theme':
        router.push('/settings/theme');
        break;
      case 'background':
        router.push('/settings/background');
        break;
      case 'fontSize':
        router.push('/settings/font-size');
        break;
      case 'faceAuth':
        router.push('/setup-face-id');
        break;
      case 'sessionControl':
        router.push('/settings/privacy');
        break;
      case 'chatVisibility':
        router.push('/settings/privacy');
        break;
      case 'clearChat':
        router.push('/settings/privacy');
        break;
      case 'inAppNotifications':
        router.push('/settings/notifications');
        break;
      case 'emailNotifications':
        router.push('/settings/notifications');
        break;
      case 'switchPlan':
        Alert.alert('Switch Plan', 'Choose from Companion+, Mentorship+, or Support+ plans.');
        break;
      case 'subscriptionInfo':
        Alert.alert('Subscription Info', 'Manage your current subscription.');
        break;
      case 'deleteAccount':
        router.push('/settings/privacy');
        break;
      case 'aiPersona':
        router.push('/settings/ai-preferences');
        break;
      case 'language':
        router.push('/settings/ai-preferences');
        break;
      case 'terms':
        Alert.alert('Terms of Service', 'View our terms and conditions.');
        break;
      case 'privacy':
        Alert.alert('Privacy Policy', 'Learn about our privacy practices.');
        break;
      case 'support':
        Alert.alert('Contact Support', 'Get help or send feedback.');
        break;
      case 'faq':
        Alert.alert('FAQ / Help Center', 'Find answers to common questions.');
        break;
      case 'notifications':
        router.push('/settings/notifications');
        break;
      case 'appearance':
        router.push('/settings/theme');
        break;
      case 'account':
        Alert.alert('Account', 'Manage your account settings.');
        break;
      case 'help':
        Alert.alert('Help & Support', 'Get help or contact support.');
        break;
      case 'upgrade':
        Alert.alert('Upgrade to Pro', 'Choose from Companion+, Mentorship+, or Support+ plans.');
        break;
      case 'habits':
        router.push('/habits');
        break;
      case 'journal':
        router.push('/journal');
        break;
      case 'calendar':
        router.push('/calendar');
        break;
      case 'minara':
        router.push('/minara-chat');
        break;
      case 'affinityGroups':
        router.push('/affinity-groups');
        break;
      case 'cohort':
        router.push('/cohort');
        break;
      default:
        console.log(`Navigate to ${setting}`);
    }
  };

  const handleFaceIdToggle = (value: boolean) => {
    setFaceIdEnabled(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (value) {
      router.push('/setup-face-id');
    }
  };

  const handleNotificationsToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleEmailNotificationsToggle = (value: boolean) => {
    setEmailNotifications(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.popupCardWrapper}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header with close button */}
        <View style={styles.header}>
          <Text style={[styles.settingsTitle, { color: colors.primaryText }]}>Settings.</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeIcon, { color: '#000000' }]}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Unlock Card */}
          <View style={styles.unlockCard}>
            {/* Gradient background layers for smooth transition */}
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#7A9BC8', // Darkest blue at bottom
              borderRadius: 32,
            }} />
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: '20%',
              backgroundColor: '#A8C1E0', // Medium-dark blue
              borderRadius: 32,
            }} />
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: '60%',
              backgroundColor: '#C5D9F1', // Lightest blue at top
              borderRadius: 32,
            }} />
            
            {/* Frosty blue blur overlay */}
            <BlurView
              intensity={45}
              tint="light"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 32,
                backgroundColor: 'rgba(181, 208, 237, 0.3)',
              }}
            />

            <Text style={[styles.unlockTitle, { zIndex: 1 }]}>Unlock all our exercises, prompts, AI features, iCloud Sync, and more</Text>
            <Text style={[styles.unlockSubtitle, { zIndex: 1 }]}>With Stoic Premium Plans</Text>
            <TouchableOpacity 
              style={[styles.unlockButton, { zIndex: 1 }]}
              onPress={() => handleSettingPress('upgrade')}
              activeOpacity={0.8}
            >
              <Text style={styles.unlockButtonText}>Try 7 Days for Free</Text>
            </TouchableOpacity>
          </View>

          {/* Personalize Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>PROFILE SETTINGS</Text>
            
            <View style={styles.personalizeCards}>
              <TouchableOpacity 
                style={styles.personalizeCard} 
                activeOpacity={0.7}
                onPress={() => handleSettingPress('editProfile')}
              >
                <Text style={styles.personalizeIcon}>👤</Text>
                <Text style={[styles.personalizeTitle, { color: colors.primaryText }]}>Edit</Text>
                <Text style={[styles.personalizeSubtitle, { color: colors.primaryText }]}>Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.personalizeCard} 
                activeOpacity={0.7}
                onPress={() => handleSettingPress('theme')}
              >
                <Text style={styles.personalizeIcon}>🎨</Text>
                <Text style={[styles.personalizeTitle, { color: colors.primaryText }]}>Theme</Text>
                <Text style={[styles.personalizeSubtitle, { color: colors.primaryText }]}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Appearance & Display Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>APPEARANCE & DISPLAY</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <SettingRow
                title="Background Customization"
                colors={colors}
                onPress={() => handleSettingPress('background')}
              />
              <SettingRow
                title="Font Size"
                colors={colors}
                onPress={() => handleSettingPress('fontSize')}
                showSeparator
              />
            </View>
          </View>

          {/* Privacy & Security Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>PRIVACY & SECURITY</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <SettingRow
                title="Face Authentication"
                colors={colors}
                onPress={() => handleSettingPress('faceAuth')}
              />
              <SettingRow
                title="Session Control"
                colors={colors}
                onPress={() => handleSettingPress('sessionControl')}
                showSeparator
              />
              <SettingRow
                title="Chat Visibility Settings"
                colors={colors}
                onPress={() => handleSettingPress('chatVisibility')}
                showSeparator
              />
              <SettingRow
                title="Clear Chat History"
                colors={colors}
                onPress={() => handleSettingPress('clearChat')}
                showSeparator
              />
            </View>
          </View>

          {/* Notification Settings */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>NOTIFICATION SETTINGS</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <SettingRow
                title="In-App Notifications"
                colors={colors}
                onPress={() => handleSettingPress('inAppNotifications')}
              />
              <SettingRow
                title="Email Notifications"
                colors={colors}
                onPress={() => handleSettingPress('emailNotifications')}
                showSeparator
              />
            </View>
          </View>

          {/* Account Settings */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>ACCOUNT SETTINGS</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <SettingRow
                title="Switch Plan"
                colors={colors}
                onPress={() => handleSettingPress('switchPlan')}
              />
              <SettingRow
                title="Subscription Info"
                colors={colors}
                onPress={() => handleSettingPress('subscriptionInfo')}
                showSeparator
              />
              <SettingRow
                title="Delete My Account"
                colors={colors}
                onPress={() => handleSettingPress('deleteAccount')}
                showSeparator
              />
            </View>
          </View>

          {/* AI Preferences */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>AI PREFERENCES</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <SettingRow
                title="AI Persona"
                colors={colors}
                onPress={() => handleSettingPress('aiPersona')}
              />
              <SettingRow
                title="Language Preference"
                colors={colors}
                onPress={() => handleSettingPress('language')}
                showSeparator
              />
            </View>
          </View>

          {/* Legal & Help */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>LEGAL & HELP</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <SettingRow
                title="Terms of Service"
                colors={colors}
                onPress={() => handleSettingPress('terms')}
              />
              <SettingRow
                title="Privacy Policy"
                colors={colors}
                onPress={() => handleSettingPress('privacy')}
                showSeparator
              />
              <SettingRow
                title="Contact Support"
                colors={colors}
                onPress={() => handleSettingPress('support')}
                showSeparator
              />
              <SettingRow
                title="FAQ / Help Center"
                colors={colors}
                onPress={() => handleSettingPress('faq')}
                showSeparator
              />
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </View>
  );
}

interface SettingRowProps {
  title: string;
  subtitle?: string;
  colors: any;
  onPress: () => void;
  showSeparator?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  title,
  subtitle,
  colors,
  onPress,
  showSeparator = false,
}) => {
  return (
    <>
      <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.settingLeft}>
          <Text style={[styles.settingTitle, { color: colors.primaryText }]}>{title}</Text>
        </View>
        <View style={styles.settingRight}>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.secondaryText }]}>{subtitle}</Text>
          )}
          <Text style={[styles.chevron, { color: colors.tertiaryText }]}>›</Text>
        </View>
      </TouchableOpacity>
      {showSeparator && (
        <View style={[styles.separator, { backgroundColor: colors.separator }]} />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  popupCardWrapper: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderTopLeftRadius: 64,
    borderTopRightRadius: 64,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginTop: 12,
    marginBottom: 0,
    marginHorizontal: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  container: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
    borderRadius: 24,
  },
  scrollContent: {
    paddingTop: 40,
    paddingBottom: 100,
  },
  unlockCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: 'transparent',
    borderRadius: 32,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  unlockTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
    textAlign: 'center',
  },
  unlockSubtitle: {
    fontSize: 14,
    color: '#5A7BA8',
    marginBottom: 20,
    textAlign: 'center',
  },
  unlockButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  personalizeCards: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
  },
  personalizeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  personalizeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  personalizeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  personalizeSubtitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 50,
  },
  settingLeft: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingSubtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  chevron: {
    fontSize: 18,
    fontWeight: '300',
  },
  separator: {
    height: 0.5,
    marginLeft: 16,
  },
  bottomSpacing: {
    height: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: '800',
  },
  settingsTitle: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'left',
    letterSpacing: -1.2,
  },
}); 