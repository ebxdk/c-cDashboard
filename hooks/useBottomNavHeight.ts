import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useBottomNavHeight() {
  const [isVisible, setIsVisible] = useState(true);
  const NAV_HEIGHT = 90; // Standard nav bar height
  
  // Load visibility preference
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
      }
    };

    const interval = setInterval(checkForVisibilityUpdates, 100);
    return () => clearInterval(interval);
  }, [isVisible]);

  return {
    isVisible,
    height: isVisible ? NAV_HEIGHT : 0,
    paddingBottom: isVisible ? NAV_HEIGHT : 20 // Some minimal padding when hidden
  };
} 