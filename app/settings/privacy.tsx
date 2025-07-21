import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function PrivacySettingsScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [dataEncryption, setDataEncryption] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const colors = {
    background: isDarkMode ? '#000000' : '#F2F2F7',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#666666',
    tertiaryText: isDarkMode ? '#636366' : '#999999',
    accent: '#007AFF',
    border: isDarkMode ? '#38383A' : '#C6C6C8',
    separator: isDarkMode ? '#38383A' : '#C6C6C8',
    destructive: '#FF3B30',
  };

  const handleToggle = (setter: (value: boolean) => void, currentValue: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(!currentValue);
  };

  const handleDangerousAction = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    switch (action) {
      case 'clearChat':
        Alert.alert(
          'Clear Chat History',
          'This will permanently delete all your chat conversations with Minara. This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: () => console.log('Chat cleared') }
          ]
        );
        break;
      case 'logoutAll':
        Alert.alert(
          'Log Out All Devices',
          'This will log you out of all devices except this one. You\'ll need to sign in again on other devices.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out All', style: 'destructive', onPress: () => console.log('Logged out all') }
          ]
        );
        break;
      case 'deleteAccount':
        Alert.alert(
          'Delete Account',
          'This will permanently delete your account and all associated data. This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') }
          ]
        );
        break;
    }
  };

  const ToggleRow = ({ 
    title, 
    subtitle, 
    value, 
    onToggle, 
    showSeparator = false,
    icon 
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onToggle: () => void;
    showSeparator?: boolean;
    icon?: string;
  }) => (
    <>
      <View style={styles.toggleRow}>
        <View style={styles.toggleLeft}>
          {icon && <Text style={styles.toggleIcon}>{icon}</Text>}
          <View style={styles.toggleInfo}>
            <Text style={[styles.toggleTitle, { color: colors.primaryText }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.toggleSubtitle, { color: colors.secondaryText }]}>{subtitle}</Text>
            )}
          </View>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.accent + '40' }}
          thumbColor={value ? colors.accent : '#f4f3f4'}
          ios_backgroundColor={colors.border}
        />
      </View>
      {showSeparator && (
        <View style={[styles.separator, { backgroundColor: colors.separator }]} />
      )}
    </>
  );

  const ActionRow = ({ 
    title, 
    subtitle, 
    onPress, 
    showSeparator = false,
    icon,
    isDestructive = false
  }: {
    title: string;
    subtitle?: string;
    onPress: () => void;
    showSeparator?: boolean;
    icon?: string;
    isDestructive?: boolean;
  }) => (
    <>
      <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.actionLeft}>
          {icon && <Text style={styles.actionIcon}>{icon}</Text>}
          <View style={styles.actionInfo}>
            <Text style={[
              styles.actionTitle, 
              { color: isDestructive ? colors.destructive : colors.primaryText }
            ]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.actionSubtitle, { color: colors.secondaryText }]}>{subtitle}</Text>
            )}
          </View>
        </View>
        <Text style={[styles.chevron, { color: colors.tertiaryText }]}>›</Text>
      </TouchableOpacity>
      {showSeparator && (
        <View style={[styles.separator, { backgroundColor: colors.separator }]} />
      )}
    </>
  );

  return (
    <View style={[styles.popupCardWrapper, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).then(() => router.back())}
            activeOpacity={0.7}
          >
            <Text style={[styles.backIcon, { color: colors.primaryText }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { color: colors.primaryText }]}>Privacy & Security</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Authentication */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>AUTHENTICATION</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <ToggleRow
                title="Face ID / Touch ID"
                subtitle="Use biometric authentication to unlock"
                value={faceIdEnabled}
                onToggle={() => handleToggle(setFaceIdEnabled, faceIdEnabled)}
                icon="🔐"
              />
              <ToggleRow
                title="Biometric Login"
                subtitle="Quick access with fingerprint or face"
                value={biometricEnabled}
                onToggle={() => handleToggle(setBiometricEnabled, biometricEnabled)}
                showSeparator
                icon="👆"
              />
              <ToggleRow
                title="Auto-Lock"
                subtitle="Lock app when inactive for 5 minutes"
                value={autoLock}
                onToggle={() => handleToggle(setAutoLock, autoLock)}
                showSeparator
                icon="🔒"
              />
            </View>
          </View>

          {/* Data Protection */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>DATA PROTECTION</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <ToggleRow
                title="End-to-End Encryption"
                subtitle="Your data is encrypted and secure"
                value={dataEncryption}
                onToggle={() => handleToggle(setDataEncryption, dataEncryption)}
                icon="🛡️"
              />
              <ActionRow
                title="Data Export"
                subtitle="Download your personal data"
                onPress={() => console.log('Export data')}
                showSeparator
                icon="📁"
              />
              <ActionRow
                title="Privacy Dashboard"
                subtitle="See what data we collect and why"
                onPress={() => console.log('Privacy dashboard')}
                showSeparator
                icon="📊"
              />
            </View>
          </View>

          {/* Chat & Messaging */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>CHAT & MESSAGING</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <ActionRow
                title="Chat Visibility Settings"
                subtitle="Who can message you"
                onPress={() => console.log('Chat visibility')}
                icon="👥"
              />
              <ActionRow
                title="Block List"
                subtitle="Manage blocked users"
                onPress={() => console.log('Block list')}
                showSeparator
                icon="🚫"
              />
              <ActionRow
                title="Clear Chat History"
                subtitle="Delete all conversations with Minara"
                onPress={() => handleDangerousAction('clearChat')}
                showSeparator
                icon="🗑️"
                isDestructive
              />
            </View>
          </View>

          {/* Analytics & Tracking */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>ANALYTICS & TRACKING</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <ToggleRow
                title="Analytics"
                subtitle="Help improve the app with usage data"
                value={analyticsEnabled}
                onToggle={() => handleToggle(setAnalyticsEnabled, analyticsEnabled)}
                icon="📈"
              />
              <ActionRow
                title="Ad Preferences"
                subtitle="Manage personalized ads"
                onPress={() => console.log('Ad preferences')}
                showSeparator
                icon="🎯"
              />
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>ACCOUNT ACTIONS</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <ActionRow
                title="Log Out All Devices"
                subtitle="Sign out from all other devices"
                onPress={() => handleDangerousAction('logoutAll')}
                icon="📱"
                isDestructive
              />
              <ActionRow
                title="Delete My Account"
                subtitle="Permanently delete account and data"
                onPress={() => handleDangerousAction('deleteAccount')}
                showSeparator
                icon="⚠️"
                isDestructive
              />
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.sectionContainer}>
            <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.infoTitle, { color: colors.primaryText }]}>🔒 Your Privacy Matters</Text>
              <Text style={[styles.infoText, { color: colors.secondaryText }]}>
                We're committed to protecting your privacy. Your personal reflections and data are encrypted and stored securely. We never sell your personal information.
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  popupCardWrapper: {
    flex: 1,
    // Remove top border radius as requested
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginTop: 0, // Adjusted for no top border radius
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
  },
  scrollContent: {
    paddingBottom: 100,
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  toggleLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleIcon: {
    fontSize: 20,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 18,
    fontWeight: '300',
  },
  separator: {
    height: 0.5,
    marginLeft: 16,
  },
  infoCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  headerSpacer: {
    flex: 1,
  },
}); 