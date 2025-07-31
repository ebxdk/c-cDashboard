import {
    DefaultTheme,
    ThemeProvider
} from '@react-navigation/native';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import BottomNavBar from '../components/BottomNavBar';
import { CalendarProvider } from '../contexts/CalendarContext';
import { HabitsProvider } from '../contexts/HabitsContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Preload all images used throughout the app
const preloadImages = async () => {
  const imageAssets = [
    // Memoji images
    require('../assets/images/memoji1.png'),
    require('../assets/images/memoji2.png'),
    require('../assets/images/memoji3.png'),
    require('../assets/images/femalememoji1.png'),
    require('../assets/images/femalememoji2.png'),
    require('../assets/images/femalememoji3.png'),
    
    // Module/Lantern images
    require('../assets/images/LanternDealingWithRejection.png'),
    require('../assets/images/LanternHowToTellFamily.png'),
    require('../assets/images/LanternLight.png'),
    
    // Onboarding images
    require('../assets/images/brotherhood.png'),
    require('../assets/images/sisterhood.png'),
    
    // Pattern and background images
    require('../assets/images/cc.patterns-01.png'),
    
    // Logo images
    require('../assets/images/Jane_Logo_Color_RGB.png'),
  ];

  const cacheImages = imageAssets.map(image => {
    return Asset.fromModule(image).downloadAsync();
  });

  return Promise.all(cacheImages);
};

// Preload all audio files used throughout the app
const preloadAudio = async () => {
  const audioAssets = [
    // Sound effects
    require('../assets/clicksound.mp3'),
  ];

  const cacheAudio = audioAssets.map(audio => {
    return Asset.fromModule(audio).downloadAsync();
  });

  return Promise.all(cacheAudio);
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'AminMedium': require('../assets/fonts/Amin Medium.ttf'),
  });
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    async function loadAssets() {
      try {
        // Preload all images and audio
        await preloadImages();
        await preloadAudio();
        setAssetsLoaded(true);
      } catch (error) {
        console.warn('Error preloading assets:', error);
        setAssetsLoaded(true); // Continue even if preloading fails
      }
    }

    loadAssets();
  }, []);

  useEffect(() => {
    if (loaded && assetsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, assetsLoaded]);

  if (!loaded || !assetsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CalendarProvider>
        <HabitsProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen name="verify-email" options={{ headerShown: false }} />
                            <Stack.Screen 
                name="setup-face-id" 
                options={{ 
                  headerShown: false
                }} 
              />
              <Stack.Screen name="profile-picture" options={{ 
                headerShown: false,
                animation: 'slide_from_right',
              }} />
              <Stack.Screen name="profile-about" options={{ 
                headerShown: false,
                animation: 'slide_from_right',
              }} />
              <Stack.Screen name="profile-age" options={{ 
                headerShown: false,
                animation: 'slide_from_right',
              }} />
              <Stack.Screen name="profile-location" options={{ 
                headerShown: false,
                animation: 'slide_from_right',
              }} />
              <Stack.Screen name="profile-gender" options={{ 
                headerShown: false,
                animation: 'slide_from_right',
              }} />
 
              <Stack.Screen name="persona-selection" options={{ headerShown: false }} />
              <Stack.Screen name="question-1" options={{ headerShown: false }} />
              <Stack.Screen name="question-2" options={{ headerShown: false }} />
              <Stack.Screen name="question-3" options={{ headerShown: false }} />
              <Stack.Screen name="question-4" options={{ headerShown: false }} />
              <Stack.Screen name="question-5" options={{ headerShown: false }} />
              <Stack.Screen name="question-6" options={{ headerShown: false }} />
              <Stack.Screen name="question-7" options={{ headerShown: false }} />
              <Stack.Screen name="question-8" options={{ headerShown: false }} />
              <Stack.Screen name="question-9" options={{ headerShown: false }} />
              <Stack.Screen name="question-10" options={{ headerShown: false }} />
              <Stack.Screen name="subscription" options={{ headerShown: false }} />
              <Stack.Screen name="loading-screen" options={{ headerShown: false }} />
              <Stack.Screen name="match-results" options={{ headerShown: false }} />
              <Stack.Screen name="people-matches" options={{ headerShown: false }} />
              <Stack.Screen 
                name="dashboard" 
                options={({ route }) => ({ 
                  headerShown: false,
                  animation: (route.params as any)?.fromNavbar ? 'fade' : 'slide_from_right',
                  animationDuration: (route.params as any)?.fromNavbar ? 200 : 300,
                })} 
              />
              <Stack.Screen 
                name="cohort" 
                options={({ route }) => ({ 
                  headerShown: false,
                  animation: (route.params as any)?.fromNavbar ? 'fade' : 'slide_from_right',
                  animationDuration: (route.params as any)?.fromNavbar ? 200 : 300,
                })} 
              />
              <Stack.Screen name="my-cohort" options={{ headerShown: false }} />
              <Stack.Screen name="minara-chat" options={{ headerShown: false }} />
              <Stack.Screen name="calendar" options={{ headerShown: false }} />
              <Stack.Screen name="event-detail" options={{ headerShown: false }} />
              <Stack.Screen name="habits" options={{ headerShown: false }} />
              <Stack.Screen name="add-habit" options={{ headerShown: false }} />
              <Stack.Screen name="journal" options={{ headerShown: false }} />
              <Stack.Screen 
                name="affinity-groups" 
                options={({ route }) => ({ 
                  headerShown: false,
                  animation: (route.params as any)?.fromNavbar ? 'fade' : 'slide_from_right',
                  animationDuration: (route.params as any)?.fromNavbar ? 200 : 300,
                })} 
              />
              <Stack.Screen 
                name="settings-main" 
                options={{ 
                  headerShown: false,
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }} 
              />
              <Stack.Screen 
                name="settings" 
                options={{ 
                  headerShown: false,
                }} 
              />
              <Stack.Screen name="+not-found" />
            </Stack>
            <BottomNavBar />
            <StatusBar style="dark" hidden={true} />
          </ThemeProvider>
        </HabitsProvider>
      </CalendarProvider>
    </GestureHandlerRootView>
  );
}
