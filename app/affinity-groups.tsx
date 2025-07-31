import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Modal, StyleSheet, Text, View } from 'react-native';
import GroupExplorer from './affinity-groups/explorer';
import MyGroups from './affinity-groups/my-groups';
import WelcomeScreen from './affinity-groups/welcome';

export default function AffinityGroupsScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'myGroups'>('welcome');
  const [showExplorer, setShowExplorer] = useState(false);
  const [showMyGroups, setShowMyGroups] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<string>('off-white');

  // Load saved background preference
  useEffect(() => {
    const loadBackgroundPreference = async () => {
      try {
        const savedBackground = await AsyncStorage.getItem('selectedBackground');
        setSelectedBackground(savedBackground || 'off-white');
      } catch (error) {
        console.log('Error loading background preference:', error);
        setSelectedBackground('off-white');
      }
    };
    loadBackgroundPreference();
  }, []);

  // Listen for real-time background updates from settings
  useEffect(() => {
    const checkForBackgroundUpdates = () => {
      const newBackground = (global as any).dashboardBackgroundUpdate;
      if (newBackground && selectedBackground && newBackground !== selectedBackground) {
        setSelectedBackground(newBackground);
        // Clear the global flag
        (global as any).dashboardBackgroundUpdate = null;
      }
    };

    // Only start checking after background is loaded
    if (selectedBackground !== null) {
      const interval = setInterval(checkForBackgroundUpdates, 100);
      return () => clearInterval(interval);
    }
  }, [selectedBackground]);

  // Determine background color based on selection and dark mode
  const getBackgroundColor = () => {
    switch (selectedBackground) {
      case 'white':
        return isDarkMode ? '#1C1C1E' : '#FFFFFF';
      case 'off-white':
        return isDarkMode ? '#000000' : '#FFFAF2';
      case 'pattern-arabic':
        return isDarkMode ? '#1C1C1E' : '#FFFAF2';
      default:
        // For gradients, respect dark mode
        return isDarkMode ? '#1C1C1E' : '#FFFAF2';
    }
  };

  // Helper to get gradient colors based on selected background
  const getGradientColors = (background: string): readonly [string, string, ...string[]] => {
    switch (background) {
      case 'gradient1':
        return ['#667eea', '#764ba2'] as const; // Ocean Breeze
      case 'gradient2':
        return ['#f093fb', '#f5576c'] as const; // Sunset Glow
      case 'gradient3':
        return ['#4facfe', '#00f2fe'] as const; // Forest Dawn
      case 'gradient4':
        return ['#a8edea', '#fed6e3'] as const; // Purple Dream
      case 'gradient5':
        return ['#ffd89b', '#19547b'] as const; // Golden Hour
      case 'gradient6':
        return ['#667eea', '#764ba2'] as const; // Cosmic Dust
      default:
        return ['#667eea', '#764ba2'] as const; // Default to Ocean Breeze
    }
  };

  const colors = {
    background: getBackgroundColor(),
    cardBackground: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? 
                   (isDarkMode ? '#2C2C2E' : '#F8F9FA') : (isDarkMode ? '#1C1C1E' : '#FFFFFF'),
    primaryText: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? 
                (isDarkMode ? '#FFFFFF' : '#000000') : (isDarkMode ? '#FFFFFF' : '#000000'),
    secondaryText: isDarkMode ? '#8E8E93' : '#666666',
  };

  // Load saved groups and determine initial screen
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const savedJoinedGroups = await AsyncStorage.getItem('joinedAffinityGroups');
        
        if (savedJoinedGroups) {
          const parsedGroups = JSON.parse(savedJoinedGroups);
          setJoinedGroups(parsedGroups);
          
          // If user has already joined groups, go straight to groups page
          if (parsedGroups.length > 0) {
            setCurrentScreen('myGroups');
          }
        }
      } catch (error) {
        console.log('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // Save joined groups to storage
  const saveJoinedGroups = async (groups: string[]) => {
    try {
      await AsyncStorage.setItem('joinedAffinityGroups', JSON.stringify(groups));
      // Removed hasJoinedAffinityGroups flag - always show full flow for testing
    } catch (error) {
      console.log('Error saving joined groups:', error);
    }
  };

  // Handle joining a group
  const handleJoinGroup = (groupId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newJoinedGroups = [...joinedGroups, groupId];
    setJoinedGroups(newJoinedGroups);
    saveJoinedGroups(newJoinedGroups);
  };

  // Handle leaving a group
  const handleLeaveGroup = (groupId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newJoinedGroups = joinedGroups.filter(id => id !== groupId);
    setJoinedGroups(newJoinedGroups);
    saveJoinedGroups(newJoinedGroups);
  };

  // Simple navigation functions
  const goToExplorer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowExplorer(true);
  };

  const goToMyGroups = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentScreen('myGroups');
    setShowExplorer(false);
    // Removed setShowMyGroups(true) to prevent duplicate groups pages
  };

  const goBackToWelcome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowExplorer(false);
    setCurrentScreen('welcome');
  };

  const goBackToExplorer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMyGroups(false);
    setShowExplorer(true);
  };

  const goExploreMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMyGroups(false);
    setShowExplorer(true);
  };

  const closeExplorer = () => {
    setShowExplorer(false);
  };

  const closeMyGroups = () => {
    setShowMyGroups(false);
  };

  const renderAffinityGroupsContent = () => (
    <View style={styles.container}>
      {/* Base Screen */}
      {currentScreen === 'welcome' && !showExplorer && !showMyGroups && (
        <WelcomeScreen
          onExploreGroups={goToExplorer}
          onCreateGroup={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Create group functionality
          }}
        />
      )}

      {/* My Groups Screen (when returning user) */}
      {currentScreen === 'myGroups' && !showExplorer && !showMyGroups && (
        <MyGroups
          joinedGroups={joinedGroups}
          onExploreMore={goExploreMore}
        />
      )}

      {/* Explorer Modal with slide up animation */}
      <Modal
        visible={showExplorer}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={goBackToWelcome}
      >
        <GroupExplorer
          joinedGroups={joinedGroups}
          onJoinGroup={handleJoinGroup}
          onLeaveGroup={handleLeaveGroup}
          onViewMyGroups={goToMyGroups}
          onBack={goBackToWelcome}
        />
      </Modal>

      {/* My Groups Modal with horizontal slide animation */}
      <Modal
        visible={showMyGroups}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={currentScreen === 'myGroups' ? closeMyGroups : goBackToExplorer}
      >
        <MyGroups
          joinedGroups={joinedGroups}
          onExploreMore={goExploreMore}
          onBack={currentScreen === 'myGroups' ? closeMyGroups : goBackToExplorer}
        />
      </Modal>
    </View>
  );

  // Show loading while determining initial screen
  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
        {/* Simple loading indicator */}
        <View style={{ opacity: 0.5 }}>
          <Text style={{ fontSize: 16, color: colors.secondaryText }}>Loading...</Text>
        </View>
      </View>
    );
  }

  // Main render with background handling
  return selectedBackground?.startsWith('gradient') ? (
    <LinearGradient
      colors={getGradientColors(selectedBackground)}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {renderAffinityGroupsContent()}
    </LinearGradient>
  ) : (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Enhanced Multi-Layer Parallax Background - Show patterns only for pattern backgrounds */}
      {selectedBackground === 'pattern-arabic' && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: isDarkMode ? 0.05 : 0.08,
          zIndex: 0,
        }}>
          <ImageBackground
            source={require('../assets/images/cc.patterns-01.png')}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            resizeMode="repeat"
          />
        </View>
      )}
      {renderAffinityGroupsContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 