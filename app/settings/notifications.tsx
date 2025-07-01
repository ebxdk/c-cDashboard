import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsSettingsScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [journalReminders, setJournalReminders] = useState(true);
  const [habitReminders, setHabitReminders] = useState(true);
  const [minaraMessages, setMinaraMessages] = useState(true);
  const [groupMessages, setGroupMessages] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);

  const colors = {
    background: isDarkMode ? '#000000' : '#F2F2F7',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#666666',
    tertiaryText: isDarkMode ? '#636366' : '#999999',
    accent: '#007AFF',
    border: isDarkMode ? '#38383A' : '#C6C6C8',
    separator: isDarkMode ? '#38383A' : '#C6C6C8',
  };

  const handleToggle = (setter: (value: boolean) => void, currentValue: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setter(!currentValue);
  };

  const NotificationRow = ({ 
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
      <View style={styles.notificationRow}>
        <View style={styles.notificationLeft}>
          {icon && <Text style={styles.notificationIcon}>{icon}</Text>}
          <View style={styles.notificationInfo}>
            <Text style={[styles.notificationTitle, { color: colors.primaryText }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.notificationSubtitle, { color: colors.secondaryText }]}>{subtitle}</Text>
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

  return (
    <View style={styles.popupCardWrapper}>
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
          <Text style={[styles.pageTitle, { color: colors.primaryText }]}>Notifications</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Master Controls */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>MASTER CONTROLS</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <NotificationRow
                title="Push Notifications"
                subtitle="Allow notifications on this device"
                value={pushNotifications}
                onToggle={() => handleToggle(setPushNotifications, pushNotifications)}
                icon="📱"
              />
              <NotificationRow
                title="Email Notifications"
                subtitle="Receive updates via email"
                value={emailNotifications}
                onToggle={() => handleToggle(setEmailNotifications, emailNotifications)}
                showSeparator
                icon="📧"
              />
            </View>
          </View>

          {/* Daily & Weekly */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>REGULAR UPDATES</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <NotificationRow
                title="Daily Reminders"
                subtitle="Morning motivation and evening reflection"
                value={dailyReminders}
                onToggle={() => handleToggle(setDailyReminders, dailyReminders)}
                icon="🌅"
              />
              <NotificationRow
                title="Weekly Digest"
                subtitle="Summary of your progress and insights"
                value={weeklyDigest}
                onToggle={() => handleToggle(setWeeklyDigest, weeklyDigest)}
                showSeparator
                icon="📊"
              />
            </View>
          </View>

          {/* Feature-specific */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>FEATURE NOTIFICATIONS</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <NotificationRow
                title="Journal Reminders"
                subtitle="Daily prompts for reflection"
                value={journalReminders}
                onToggle={() => handleToggle(setJournalReminders, journalReminders)}
                icon="📔"
              />
              <NotificationRow
                title="Habit Reminders"
                subtitle="Track your daily practices"
                value={habitReminders}
                onToggle={() => handleToggle(setHabitReminders, habitReminders)}
                showSeparator
                icon="✅"
              />
              <NotificationRow
                title="Minara Messages"
                subtitle="AI assistant notifications"
                value={minaraMessages}
                onToggle={() => handleToggle(setMinaraMessages, minaraMessages)}
                showSeparator
                icon="🤖"
              />
              <NotificationRow
                title="Group Messages"
                subtitle="Community and cohort updates"
                value={groupMessages}
                onToggle={() => handleToggle(setGroupMessages, groupMessages)}
                showSeparator
                icon="👥"
              />
            </View>
          </View>

          {/* System */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>SYSTEM</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <NotificationRow
                title="System Updates"
                subtitle="App updates and maintenance notices"
                value={systemUpdates}
                onToggle={() => handleToggle(setSystemUpdates, systemUpdates)}
                icon="⚙️"
              />
            </View>
          </View>

          {/* Notification Schedule */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>SCHEDULE SETTINGS</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <TouchableOpacity style={styles.scheduleRow} activeOpacity={0.7}>
                <View style={styles.scheduleLeft}>
                  <Text style={styles.scheduleIcon}>🕘</Text>
                  <View>
                    <Text style={[styles.scheduleTitle, { color: colors.primaryText }]}>Quiet Hours</Text>
                    <Text style={[styles.scheduleSubtitle, { color: colors.secondaryText }]}>10:00 PM - 8:00 AM</Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.tertiaryText }]}>›</Text>
              </TouchableOpacity>
              <View style={[styles.separator, { backgroundColor: colors.separator }]} />
              <TouchableOpacity style={styles.scheduleRow} activeOpacity={0.7}>
                <View style={styles.scheduleLeft}>
                  <Text style={styles.scheduleIcon}>📅</Text>
                  <View>
                    <Text style={[styles.scheduleTitle, { color: colors.primaryText }]}>Reminder Times</Text>
                    <Text style={[styles.scheduleSubtitle, { color: colors.secondaryText }]}>Customize when you receive reminders</Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.tertiaryText }]}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.sectionContainer}>
            <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
              <Text style={[styles.infoTitle, { color: colors.primaryText }]}>🔔 Notification Tips</Text>
              <Text style={[styles.infoText, { color: colors.secondaryText }]}>
                Enable notifications to stay consistent with your Stoic practice. You can always fine-tune these settings later based on your preferences.
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
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  notificationLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 14,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  scheduleLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleIcon: {
    fontSize: 20,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  scheduleSubtitle: {
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
    fontSize: 24,
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