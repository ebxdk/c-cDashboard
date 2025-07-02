import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
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
    label: 'Cohort',
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
  const [overlayOpacity] = useState(new Animated.Value(0));

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

  // Hide bottom nav on login page, signup page, verify-email page, setup-face-id page, setup-profile page, question pages, persona-selection page, subscription page, loading screen, match-results page, and index page (after all hooks are called)
  if (pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/verify-email' || pathname === '/setup-face-id' || pathname === '/setup-profile' || pathname.startsWith('/question-') || pathname === '/persona-selection' || pathname === '/subscription' || pathname === '/loading-screen' || pathname === '/match-results') {
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
              router.replace((item.route + '?noAnim=1') as any);
            }}
          >
            <IconSymbol
              name={
                Platform.OS === 'ios' ? (item.icon as any) : (item.materialIcon as any)
              }
              size={28}
              color={
                isActive
                  ? (isInspirePage ? '#FFFFFF' : Colors[colorScheme].tabIconSelected)
                  : (isInspirePage ? 'rgba(255, 255, 255, 0.7)' : Colors[colorScheme].tabIconDefault)
              }
              style={{ opacity: isActive ? 1 : 0.7 }}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isActive
                    ? (isInspirePage ? '#FFFFFF' : Colors[colorScheme].tabIconSelected)
                    : (isInspirePage ? 'rgba(255, 255, 255, 0.7)' : Colors[colorScheme].tabIconDefault),
                  opacity: isActive ? 1 : 0.7,
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 25,
    height: 80,
    borderRadius: 40,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 20,
    zIndex: 50,
    borderWidth: 0.5,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
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
}); 