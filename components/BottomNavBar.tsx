import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: 'house.fill',
    materialIcon: 'home',
    route: '/' as const,
  },
  {
    label: 'Cohort',
    icon: 'person.3.fill',
    materialIcon: 'groups',
    route: '/cohort' as const,
  },
  {
    label: 'Minara',
    icon: 'sparkles',
    materialIcon: 'smart-toy',
    route: '/minara-chat' as const,
  },
];

export default function BottomNavBar() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const pathname = usePathname();

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme].background,
          shadowColor: colorScheme === 'dark' ? '#000' : '#000',
        },
      ]}
      lightColor="#fff"
      darkColor="#151718"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.route === '/' ? pathname === '/' : pathname.startsWith(item.route);
        return (
          <TouchableOpacity
            key={item.label}
            accessibilityRole="button"
            activeOpacity={0.7}
            style={styles.tabButton}
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
                  ? Colors[colorScheme].tabIconSelected
                  : Colors[colorScheme].tabIconDefault
              }
              style={{ opacity: isActive ? 1 : 0.7 }}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isActive
                    ? Colors[colorScheme].tabIconSelected
                    : Colors[colorScheme].tabIconDefault,
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
    zIndex: 100,
    borderTopWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 32,
    paddingTop: 18,
    paddingBottom: 28,
    backgroundColor: '#fff', // fallback
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
}); 