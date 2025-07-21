import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();
  
  const [name, setName] = useState('Marcus Aurelius');
  const [email, setEmail] = useState('marcus@stoicapp.com');
  const [bio, setBio] = useState('Seeking wisdom through daily reflection and Stoic practice.');
  const [location, setLocation] = useState('San Francisco, CA');
  const [joinDate] = useState('March 2024');

  const colors = {
    background: isDarkMode ? '#000000' : '#F2F2F7',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#666666',
    tertiaryText: isDarkMode ? '#636366' : '#999999',
    accent: '#007AFF',
    border: isDarkMode ? '#38383A' : '#C6C6C8',
    separator: isDarkMode ? '#38383A' : '#C6C6C8',
    inputBackground: isDarkMode ? '#2C2C2E' : '#F2F2F7',
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Profile Updated', 'Your profile has been saved successfully.', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleChangePhoto = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Change Profile Photo',
      'Choose a new profile photo',
      [
        { text: 'Camera', onPress: () => console.log('Camera') },
        { text: 'Photo Library', onPress: () => console.log('Photo Library') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

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
          <Text style={[styles.pageTitle, { color: colors.primaryText }]}>Edit Profile</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Photo Section */}
          <View style={styles.sectionContainer}>
            <View style={[styles.photoSection, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.photoContainer}>
                <View style={[styles.photoPlaceholder, { backgroundColor: colors.accent + '20' }]}>
                  <Text style={[styles.photoInitials, { color: colors.accent }]}>MA</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.changePhotoButton, { backgroundColor: colors.accent }]}
                  onPress={handleChangePhoto}
                  activeOpacity={0.8}
                >
                  <Text style={styles.changePhotoIcon}>📷</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.photoLabel, { color: colors.secondaryText }]}>Tap to change photo</Text>
            </View>
          </View>

          {/* Basic Information */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>BASIC INFORMATION</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Full Name</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.inputBackground, 
                    color: colors.primaryText,
                    borderColor: colors.border
                  }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.tertiaryText}
                />
              </View>
              
              <View style={[styles.separator, { backgroundColor: colors.separator }]} />
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Email</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.inputBackground, 
                    color: colors.primaryText,
                    borderColor: colors.border
                  }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.tertiaryText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={[styles.separator, { backgroundColor: colors.separator }]} />
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Location</Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.inputBackground, 
                    color: colors.primaryText,
                    borderColor: colors.border
                  }]}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Enter your location"
                  placeholderTextColor={colors.tertiaryText}
                />
              </View>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>ABOUT</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.secondaryText }]}>Bio</Text>
                <TextInput
                  style={[styles.textArea, { 
                    backgroundColor: colors.inputBackground, 
                    color: colors.primaryText,
                    borderColor: colors.border
                  }]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us about yourself and your Stoic journey..."
                  placeholderTextColor={colors.tertiaryText}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Account Information */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>ACCOUNT</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.secondaryText }]}>Member Since</Text>
                <Text style={[styles.infoValue, { color: colors.primaryText }]}>{joinDate}</Text>
              </View>
              <View style={[styles.separator, { backgroundColor: colors.separator }]} />
              <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                <Text style={[styles.actionTitle, { color: colors.primaryText }]}>Change Password</Text>
                <Text style={[styles.chevron, { color: colors.tertiaryText }]}>›</Text>
              </TouchableOpacity>
              <View style={[styles.separator, { backgroundColor: colors.separator }]} />
              <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                <Text style={[styles.actionTitle, { color: colors.primaryText }]}>Privacy Settings</Text>
                <Text style={[styles.chevron, { color: colors.tertiaryText }]}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionHeader, { color: colors.secondaryText }]}>PREFERENCES</Text>
            <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
              <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                <View style={styles.actionLeft}>
                  <Text style={styles.actionIcon}>🌍</Text>
                  <Text style={[styles.actionTitle, { color: colors.primaryText }]}>Language & Region</Text>
                </View>
                <Text style={[styles.chevron, { color: colors.tertiaryText }]}>›</Text>
              </TouchableOpacity>
              <View style={[styles.separator, { backgroundColor: colors.separator }]} />
              <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
                <View style={styles.actionLeft}>
                  <Text style={styles.actionIcon}>🔔</Text>
                  <Text style={[styles.actionTitle, { color: colors.primaryText }]}>Notification Preferences</Text>
                </View>
                <Text style={[styles.chevron, { color: colors.tertiaryText }]}>›</Text>
              </TouchableOpacity>
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
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  photoSection: {
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoInitials: {
    fontSize: 32,
    fontWeight: '700',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoIcon: {
    fontSize: 16,
  },
  photoLabel: {
    fontSize: 14,
  },
  inputGroup: {
    marginVertical: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 80,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 18,
    fontWeight: '300',
  },
  separator: {
    height: 0.5,
    marginVertical: 8,
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