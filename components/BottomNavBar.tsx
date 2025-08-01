import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: 'house.fill',
    materialIcon: 'home',
    route: '/dashboard' as const,
  },
  {
    label: 'Connect',
    icon: 'person.3.fill',
    materialIcon: 'groups',
    route: '/cohort' as const,
  },
  {
    label: 'Affinity Groups',
    icon: 'person.2.fill',
    materialIcon: 'group',
    route: '/affinity-groups' as const,
  },
];

export default function BottomNavBar() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const pathname = usePathname();
  const isInspirePage = pathname === '/inspire';
  const isDarkMode = colorScheme === 'dark';
  const [isVisible, setIsVisible] = useState(true); // Control visibility
  const [overlayOpacity] = useState(new Animated.Value(0));
  const [indicatorPosition] = useState(new Animated.Value(0));

  // Load visibility preference and listen for updates
  useEffect(() => {
    const loadVisibilityPreference = async () => {
      try {
        const savedPreference = await AsyncStorage.getItem('showBottomNav');
        if (savedPreference !== null) {
          setIsVisible(JSON.parse(savedPreference));
        }
      } catch (error) {
        console.log('Error loading nav bar visibility preference:', error);
      }
    };
    loadVisibilityPreference();
  }, []);

  // Listen for real-time visibility updates from settings
  useEffect(() => {
    const checkForVisibilityUpdates = () => {
      const newVisibility = (global as any).bottomNavVisibilityUpdate;
      if (newVisibility !== undefined && newVisibility !== isVisible) {
        setIsVisible(newVisibility);
        // Clear the global flag
        (global as any).bottomNavVisibilityUpdate = undefined;
      }
    };

    const interval = setInterval(checkForVisibilityUpdates, 100);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Listen for modal overlay events with immediate response
  useEffect(() => {
    if (pathname === '/group-chat') {
      const checkForOverlay = () => {
        const hasModalOverlay = (global as any).groupChatModalExpanded || false;
        const targetOpacity = hasModalOverlay ? 1 : 0;
        
        // Animate to match the main overlay timing
        Animated.timing(overlayOpacity, {
          toValue: targetOpacity,
          duration: 300, // Match the main overlay animation duration
          useNativeDriver: true,
        }).start();
      };
      
      // Check immediately and then periodically
      checkForOverlay();
      const interval = setInterval(checkForOverlay, 50); // Faster polling for responsiveness
      return () => clearInterval(interval);
    } else {
      // Reset opacity when leaving group chat
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [pathname, overlayOpacity]);

  // Update indicator position when active tab changes
  useEffect(() => {
    const activeIndex = NAV_ITEMS.findIndex(item => 
      item.route === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.route)
    );
    
    console.log('Active tab index:', activeIndex, 'for pathname:', pathname);
    
    if (activeIndex !== -1) {
      Animated.spring(indicatorPosition, {
        toValue: activeIndex,
        useNativeDriver: true,
        tension: 300,
        friction: 30,
      }).start();
    }
  }, [pathname, indicatorPosition]);

  // Hide bottom nav on login page, signup page, verify-email page, setup-face-id page, profile pages, question pages, persona-selection page, subscription page, loading screen, match-results page, people-matches page, and index page (after all hooks are called)
  if (pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/verify-email' || pathname === '/setup-face-id' || pathname.startsWith('/profile-') || pathname.startsWith('/question-') || pathname === '/persona-selection' || pathname === '/subscription' || pathname === '/loading-screen' || pathname === '/match-results' || pathname === '/people-matches') {
    return null;
  }

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: 'transparent', // Back to transparent for blur effect
          shadowColor: colorScheme === 'dark' ? '#000' : '#000',
          overflow: 'hidden', // Ensure blur effect is contained
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0,0,0,0.08)',
          // Add additional shadow layers for more depth
          ...(Platform.OS === 'ios' && {
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.25,
            shadowRadius: 32,
          }),
          // Add a subtle inner shadow effect
          ...(Platform.OS === 'android' && {
            elevation: 20,
          }),
        },
      ]}
      lightColor="transparent"
      darkColor="transparent"
    >
      {/* Main blur background */}
      <BlurView
        intensity={isDarkMode ? 50 : 80}
        tint={isDarkMode ? "dark" : "light"}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 40,
        }}
      />

      {/* Subtle color overlay for better contrast */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDarkMode 
              ? 'rgba(0, 0, 0, 0.15)' 
              : 'rgba(255, 255, 255, 0.15)',
            borderRadius: 40,
          }
        ]}
        pointerEvents="none"
      />

      {/* Explicit darkening overlay for modal states */}
      <Animated.View
        style={[
          styles.darkeningOverlay,
          {
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
            opacity: overlayOpacity,
            borderRadius: 40,
          }
        ]}
        pointerEvents="none"
      />

      {/* Remove the conditional blur for inspire page since we now have blur everywhere */}
      
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.route === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.route);
        return (
          <TouchableOpacity
            key={item.label}
            accessibilityRole="button"
            activeOpacity={0.7}
            style={[styles.tabButton, { zIndex: 1 }]} // Ensure buttons are above blur
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.replace({
                pathname: item.route,
                params: { fromNavbar: 'true' }
              });
            }}
          >
            <IconSymbol
              name={
                Platform.OS === 'ios' ? (item.icon as any) : (item.materialIcon as any)
              }
              size={28}
              color={isDarkMode ? '#888888' : '#666666'} // Same color for all icons
              style={{ opacity: 1 }}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isDarkMode ? '#888888' : '#666666', // Same color for all labels
                  opacity: 1,
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* Animated indicator bar */}
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: '#007AFF', // Neon blue color
            transform: [
              {
                translateX: indicatorPosition.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: [50, 144, 237], // Micro adjustment: Cohort tiny tiny tiny tiny bit more right
                })
              }
            ]
          }
        ]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    left: 40,
    right: 40,
    bottom: 25,
    height: 72,
    borderRadius: 40,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 20,
    zIndex: 50,
    borderWidth: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 3,
    paddingHorizontal: 8,
  },
  label: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 1,
    letterSpacing: 0.1,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  darkeningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
  },
  indicator: {
    position: 'absolute',
    bottom: 4,
    height: 3,
    width: 24, // Small glowy bar, not long at all
    borderRadius: 1.5,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 12,
    left: 0, // Start from left edge
  },
}); 