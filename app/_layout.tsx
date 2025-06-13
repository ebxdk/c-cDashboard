import {
    DefaultTheme,
    ThemeProvider
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import BottomNavBar from '../components/BottomNavBar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'AminMedium': require('../assets/fonts/Amin Medium.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="cohort" options={{ headerShown: false }} />
          <Stack.Screen name="my-cohort" options={{ headerShown: false }} />
          <Stack.Screen name="minara-chat" options={{ headerShown: false }} />
          <Stack.Screen name="calendar" options={{ headerShown: false }} />
          <Stack.Screen name="event-detail" options={{ headerShown: false }} />
          <Stack.Screen name="habits" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <BottomNavBar />
        <StatusBar style="dark" hidden={true} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
