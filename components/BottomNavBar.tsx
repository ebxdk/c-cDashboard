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

  // Hide bottom nav on login page (after all hooks are called)
  if (pathname === '/') {
    return null;
  }

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: isInspirePage 
            ? (isDarkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.15)') 
            : Colors[colorScheme].background,
          shadowColor: colorScheme === 'dark' ? '#000' : '#000',
          overflow: 'hidden', // Ensure blur effect is contained
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0,0,0,0.04)',
        },
      ]}
      lightColor={isInspirePage 
        ? (isDarkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.15)') 
        : "#fff"}
      darkColor={isInspirePage ? 'rgba(0, 0, 0, 0.25)' : "#151718"}
    >
      {/* Explicit darkening overlay for modal states */}
      <Animated.View
        style={[
          styles.darkeningOverlay,
          {
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
            opacity: overlayOpacity,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
          }
        ]}
        pointerEvents="none"
      />

      {/* Add blur effect when on inspire page */}
      {isInspirePage && (
        <BlurView
          intensity={isDarkMode ? 40 : 60}
          tint={isDarkMode ? "dark" : "light"}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
      
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
    left: 0,
    right: 0,
    bottom: 0,
    height: 104,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 50,
    borderTopWidth: 0.5,
    paddingHorizontal: 32,
    paddingTop: 18,
    paddingBottom: 28,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 2,
  },
  label: {
    fontSize: 11,
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
  },
}); 