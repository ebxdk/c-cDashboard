import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood?: string;
}

export default function JournalPage() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  // Refs for text inputs
  const titleInputRef = useRef<TextInput>(null);
  const contentInputRef = useRef<TextInput>(null);

  // Animated values for ultra-smooth spring animations
  const modalTranslateY = useSharedValue(screenHeight);
  const overlayOpacity = useSharedValue(0);
  const fabOpacity = useSharedValue(1);
  const fabScale = useSharedValue(1);
  
  // Background scaling for Apple-native modal effect
  const backgroundScale = useSharedValue(1);
  const backgroundBorderRadius = useSharedValue(0);
  
  // Smooth animated keyboard values for consistent spring animations
  const keyboardAnimatedHeight = useSharedValue(0);
  const toolbarTranslateY = useSharedValue(0);

  // Keyboard event listeners with smooth spring animations
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', 
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
        
        // Use the same spring configuration as the rest of the page
        const keyboardSpring = {
          damping: 30,
          stiffness: 200,
          mass: 0.8,
          overshootClamping: false,
          restDisplacementThreshold: 0.001,
          restSpeedThreshold: 0.001,
        };
        
        keyboardAnimatedHeight.value = withSpring(e.endCoordinates.height, keyboardSpring);
        // Move toolbar up to sit 5px above keyboard (keyboard height - current bottom position + 5px gap)
        toolbarTranslateY.value = withSpring(-e.endCoordinates.height + 110 - 6, keyboardSpring);
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
        
        // Use the same spring configuration as the rest of the page
        const keyboardSpring = {
          damping: 30,
          stiffness: 200,
          mass: 0.8,
          overshootClamping: false,
          restDisplacementThreshold: 0.001,
          restSpeedThreshold: 0.001,
        };
        
        keyboardAnimatedHeight.value = withSpring(0, keyboardSpring);
        // Return toolbar to its original position
        toolbarTranslateY.value = withSpring(0, keyboardSpring);
      }
    );

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#666666',
    tertiaryText: isDarkMode ? '#636366' : '#999999',
    accent: '#6C63FF', // Purple accent
    modalBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    inputBackground: isDarkMode ? '#2C2C2E' : '#F2F2F7',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    buttonBackground: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  };

  // Gradient colors based on theme - only purple for dark mode, white for light mode
  const gradientColors = isDarkMode
    ? ['#18122B', '#443C68', '#6B4C93'] as const // Deep purple gradient for dark mode
    : ['#FFFFFF', '#FFFFFF'] as const;

  const handleNewEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Apple-native FAB press animation - keep this responsive
    fabScale.value = withSpring(0.95, {
      damping: 60,
      stiffness: 300,
      mass: 0.4,
    }, () => {
      fabScale.value = withSpring(1, {
        damping: 60,
        stiffness: 300,
        mass: 0.4,
      });
    });
    
    // Clear editing state for new entry
    setEditingEntry(null);
    setEntryTitle('');
    setEntryContent('');
    
    setModalVisible(true);
    
    // Faster spring configuration for modal
    const modalSpring = {
      damping: 280,
      stiffness: 800,
      mass: 2,
    };
    
    // Faster fluid spring for background scaling
    const backgroundSpring = {
      damping: 30,
      stiffness: 200,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
    };
    
    // Modal and background use different optimized timings
    modalTranslateY.value = withSpring(0, modalSpring);
    backgroundScale.value = withSpring(0.85, backgroundSpring);
    backgroundBorderRadius.value = withSpring(28, backgroundSpring);
    
    // Auto-focus title input after modal animation starts
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100); // Small delay to ensure modal is visible
    
    // Quicker overlay timing to match spring speed
    overlayOpacity.value = withTiming(1, { 
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) // Smooth ease-out
    });
    
    // Quicker FAB fade
    fabOpacity.value = withTiming(0, {
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
  };

  const handleEditEntry = (entry: JournalEntry) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Set editing state and populate fields
    setEditingEntry(entry);
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    
    setModalVisible(true);
    
    // Same modal animation as new entry
    const modalSpring = {
      damping: 280,
      stiffness: 800,
      mass: 2,
    };
    
    const backgroundSpring = {
      damping: 30,
      stiffness: 200,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
    };
    
    modalTranslateY.value = withSpring(0, modalSpring);
    backgroundScale.value = withSpring(0.85, backgroundSpring);
    backgroundBorderRadius.value = withSpring(28, backgroundSpring);
    
    // Auto-focus title input after modal animation starts
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 100);
    
    overlayOpacity.value = withTiming(1, { 
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    
    fabOpacity.value = withTiming(0, {
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
  };

  const handleSaveEntry = () => {
    // Only save if there's content
    if (entryTitle.trim() || entryContent.trim()) {
      if (editingEntry) {
        // Update existing entry
        const updatedEntry: JournalEntry = {
          ...editingEntry,
          title: entryTitle.trim() || 'Untitled Entry',
          content: entryContent.trim(),
        };
        
        setJournalEntries(prev => 
          prev.map(entry => 
            entry.id === editingEntry.id ? updatedEntry : entry
          )
        );
      } else {
        // Create new entry
        const newEntry: JournalEntry = {
          id: Date.now().toString(),
          title: entryTitle.trim() || 'Untitled Entry',
          content: entryContent.trim(),
          date: new Date(),
        };
        
        setJournalEntries(prev => [newEntry, ...prev]); // Add to beginning of array
      }
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    closeModal();
  };

  const closeModal = () => {
    Keyboard.dismiss();
    
    // Faster spring configuration for modal dismissal
    const modalSpring = {
      damping: 320,
      stiffness: 700,
      mass: 2.5,
    };
    
    // Faster fluid spring for background scaling return
    const backgroundSpring = {
      damping: 30,
      stiffness: 200,
      mass: 0.8,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
    };
    
    // Modal and background use different optimized timings
    modalTranslateY.value = withSpring(screenHeight, modalSpring);
    backgroundScale.value = withSpring(1, backgroundSpring);
    backgroundBorderRadius.value = withSpring(0, backgroundSpring);
    
    // Quicker overlay fade to match spring speed
    overlayOpacity.value = withTiming(0, { 
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, () => {
      // Hide modal after animation completes
      runOnJS(setModalVisible)(false);
      runOnJS(setEntryTitle)('');
      runOnJS(setEntryContent)('');
      runOnJS(setEditingEntry)(null);
    });
    
    // Quicker FAB restore
    fabOpacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
  };

  const handleCloseModal = () => {
    closeModal();
  };

  const handleSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement search functionality
  };

  const handleMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement menu functionality
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    };
    return today.toLocaleDateString('en-US', options);
  };

  const formatEntryDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getTimeOfDay = (date: Date) => {
    const hour = date.getHours();
    if (hour < 12) return '🌅 Morning';
    if (hour < 17) return '☀️ Afternoon';
    if (hour < 21) return '🌆 Evening';
    return '🌙 Night';
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Pan gesture handler for modal - safer implementation to prevent crashes
  const modalPanGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      'worklet';
      context.startY = 0;
    },
    onActive: (event, context: any) => {
      'worklet';
      // Only allow downward gestures
      if (event.translationY > 0) {
        context.startY = event.translationY;
      }
    },
    onEnd: (event) => {
      'worklet';
      // If user pulls down more than 50px or with sufficient velocity, dismiss keyboard
      if (event.translationY > 50 || event.velocityY > 500) {
        try {
          runOnJS(Keyboard.dismiss)();
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
          // Safely handle any errors
          console.log('Gesture handler error:', error);
        }
      }
    },
    onFail: () => {
      'worklet';
      // Handle gesture failure gracefully
    },
    onCancel: () => {
      'worklet';
      // Handle gesture cancellation gracefully
    },
  });

  // Animated styles - simplified
  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: backgroundScale.value }],
      borderRadius: backgroundBorderRadius.value,
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value * 0.4,
    };
  });

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: modalTranslateY.value }],
    };
  });

  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: fabScale.value }],
      opacity: fabOpacity.value,
    };
  });

  // Smooth toolbar animation style matching the page's spring configuration
  const toolbarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: toolbarTranslateY.value }],
    };
  });

  // Reset animation values when modal is hidden
  useEffect(() => {
    if (!modalVisible) {
      modalTranslateY.value = screenHeight;
      backgroundScale.value = 1;
      backgroundBorderRadius.value = 0;
      overlayOpacity.value = 0;
      fabScale.value = 1;
      fabOpacity.value = 1;
      // Reset toolbar animation values
      keyboardAnimatedHeight.value = 0;
      toolbarTranslateY.value = 0;
    }
  }, [modalVisible]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Main Journal Page with background scaling */}
      <Animated.View style={[{ flex: 1, overflow: 'hidden' }, backgroundAnimatedStyle]}>
        <LinearGradient
          colors={gradientColors}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {/* Header */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 24,
              paddingTop: 20,
              paddingBottom: 10,
            }}>
              {/* Left side - Journal title */}
              <Text style={{
                fontSize: 34,
                fontWeight: '700',
                color: colors.primaryText,
                fontFamily: 'System',
                letterSpacing: -0.5,
              }}>
                Journal
              </Text>

              {/* Right side - Search and Menu buttons */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={handleSearch}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.buttonBackground,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      stroke={colors.primaryText}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleMenu}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.buttonBackground,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 7m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 17m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
                      stroke={colors.primaryText}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>

            {/* Center Content - Adjusted for bottom nav bar */}
            {journalEntries.length === 0 ? (
              // Empty state
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 40,
                paddingBottom: 120, // Account for bottom nav bar
              }}>
                {/* App Icon/Logo - Smaller standalone emoji */}
                <Text style={{ 
                  fontSize: 60, // Reduced from 80
                  marginBottom: 16, // Reduced gap
                }}>📝</Text>

                {/* Main Text - Smaller */}
                <Text style={{
                  fontSize: 26, // Reduced from 32
                  fontWeight: '700',
                  color: colors.primaryText,
                  fontFamily: 'System',
                  textAlign: 'center',
                  marginBottom: 10, // Reduced from 12
                  letterSpacing: -0.5,
                }}>
                  Begin Your Journal
                </Text>

                {/* Simple subtitle with Islamic touch */}
                <Text style={{
                  fontSize: 16, // Reduced from 18
                  fontWeight: '400',
                  color: colors.secondaryText,
                  fontFamily: 'System',
                  textAlign: 'center',
                  lineHeight: 22,
                  marginBottom: 8,
                }}>
                  Reflect with gratitude • بامتنان
                </Text>

                <Text style={{
                  fontSize: 14, // Reduced from 16
                  fontWeight: '400',
                  color: colors.tertiaryText,
                  fontFamily: 'System',
                  textAlign: 'center',
                  lineHeight: 20,
                }}>
                  Tap the plus button to get started.
                </Text>
              </View>
            ) : (
              // Journal entries feed
              <ScrollView 
                style={{ flex: 1, paddingTop: 20 }}
                contentContainerStyle={{ paddingBottom: 180 }} // Account for FAB and bottom nav
                showsVerticalScrollIndicator={false}
              >
                {journalEntries.map((entry, index) => (
                  <TouchableOpacity
                    key={entry.id}
                    onPress={() => handleEditEntry(entry)}
                    activeOpacity={0.8}
                    style={{
                      marginHorizontal: 20,
                      marginBottom: 16,
                      backgroundColor: colors.modalBackground,
                      borderRadius: 16,
                      padding: 20,
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDarkMode ? 0.3 : 0.1,
                      shadowRadius: 8,
                      elevation: 4,
                      borderWidth: isDarkMode ? 1 : 0,
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    }}
                  >
                    {/* Entry Header */}
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: 12,
                    }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 18,
                          fontWeight: '600',
                          color: colors.primaryText,
                          fontFamily: 'System',
                          marginBottom: 4,
                        }}>
                          {entry.title}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={{
                            fontSize: 13,
                            fontWeight: '500',
                            color: colors.accent,
                            fontFamily: 'System',
                          }}>
                            {getTimeOfDay(entry.date)}
                          </Text>
                          <Text style={{
                            fontSize: 13,
                            fontWeight: '400',
                            color: colors.secondaryText,
                            fontFamily: 'System',
                          }}>
                            {formatEntryDate(entry.date)}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Entry menu */}
                      <TouchableOpacity style={{
                        padding: 4,
                        borderRadius: 8,
                      }}>
                        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 7m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 17m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
                            stroke={colors.tertiaryText}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </TouchableOpacity>
                    </View>

                    {/* Entry Content */}
                    <Text style={{
                      fontSize: 15,
                      fontWeight: '400',
                      color: colors.primaryText,
                      fontFamily: 'System',
                      lineHeight: 22,
                    }}>
                      {entry.content}
                    </Text>

                    {/* Entry Footer */}
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 16,
                      paddingTop: 12,
                      borderTopWidth: 1,
                      borderTopColor: colors.border,
                    }}>
                      <View style={{ flexDirection: 'row', gap: 16 }}>
                        {/* Bookmark */}
                        <TouchableOpacity>
                          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                            <Path
                              d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                              stroke={colors.tertiaryText}
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </Svg>
                        </TouchableOpacity>
                        
                        {/* Share */}
                        <TouchableOpacity>
                          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                            <Path
                              d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"
                              stroke={colors.tertiaryText}
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </Svg>
                        </TouchableOpacity>
                      </View>

                      {/* Word count */}
                      <Text style={{
                        fontSize: 12,
                        fontWeight: '400',
                        color: colors.tertiaryText,
                        fontFamily: 'System',
                      }}>
                        {entry.content.split(' ').length} words
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Floating Action Button - Adjusted for bottom nav bar */}
            <View style={{
              position: 'absolute',
              bottom: 140, // Positioned above bottom nav bar
              left: 0,
              right: 0,
              alignItems: 'center',
            }}>
              <Animated.View style={fabAnimatedStyle}>
                <TouchableOpacity
                  onPress={handleNewEntry}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: colors.accent,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: colors.accent,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 8,
                  }}
                >
                  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 5v14M5 12h14"
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      {/* Modal overlay and content */}
      {modalVisible && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
          {/* Always black overlay regardless of theme */}
          <Animated.View style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000000', // Always black
            },
            overlayAnimatedStyle
          ]} />

          {/* Modal content with Apple-native animation */}
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <PanGestureHandler onGestureEvent={modalPanGestureHandler}>
                <Animated.View style={[
                  {
                    backgroundColor: colors.modalBackground,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: screenHeight * 0.9,
                    paddingTop: 20,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                  },
                  modalAnimatedStyle
                ]}>
                  {/* Drag indicator */}
                  <View style={{
                    width: 40,
                    height: 4,
                    backgroundColor: colors.tertiaryText,
                    borderRadius: 2,
                    alignSelf: 'center',
                    marginBottom: 16,
                    opacity: 0.5,
                  }} />

                  {/* Modal Header */}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    paddingBottom: 20,
                  }}>
                    {/* Bookmark Icon */}
                    <TouchableOpacity style={{
                      width: 32,
                      height: 32,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                          stroke={colors.accent}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </TouchableOpacity>

                    {/* Date */}
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: colors.primaryText,
                      fontFamily: 'System',
                    }}>
                      {getCurrentDate()}
                    </Text>

                    {/* Right side buttons */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                      <TouchableOpacity>
                        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 7m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M12 17m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"
                            stroke={colors.accent}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </TouchableOpacity>
                      
                      <TouchableOpacity onPress={handleSaveEntry}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: colors.accent,
                          fontFamily: 'System',
                        }}>
                          {editingEntry ? 'Save' : 'Done'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Content */}
                  <ScrollView 
                    style={{ flex: 1, paddingHorizontal: 20 }}
                    contentContainerStyle={{ 
                      paddingBottom: keyboardVisible ? keyboardHeight + 80 : 120,
                      minHeight: '100%',
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    keyboardDismissMode="interactive"
                    automaticallyAdjustContentInsets={false}
                    contentInsetAdjustmentBehavior="never"
                  >
                    {/* Title Input */}
                    <View style={{ marginBottom: 20 }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '400',
                        color: colors.secondaryText,
                        fontFamily: 'System',
                        marginBottom: 8,
                      }}>
                        Title
                      </Text>
                      <TextInput
                        ref={titleInputRef}
                        value={entryTitle}
                        onChangeText={setEntryTitle}
                        placeholder="Start writing..."
                        placeholderTextColor={colors.tertiaryText}
                        style={{
                          fontSize: 18,
                          fontWeight: '400',
                          color: colors.primaryText,
                          fontFamily: 'System',
                          borderBottomWidth: 1,
                          borderBottomColor: colors.accent,
                          paddingBottom: 8,
                        }}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          contentInputRef.current?.focus();
                        }}
                        blurOnSubmit={false}
                      />
                    </View>

                    {/* Content Input */}
                    <TextInput
                      ref={contentInputRef}
                      value={entryContent}
                      onChangeText={setEntryContent}
                      placeholder="How was your day? What are you grateful for?"
                      placeholderTextColor={colors.tertiaryText}
                      multiline
                      style={{
                        fontSize: 16,
                        fontWeight: '400',
                        color: colors.primaryText,
                        fontFamily: 'System',
                        height: keyboardVisible ? 150 : 250,
                        textAlignVertical: 'top',
                        paddingBottom: 20,
                      }}
                      returnKeyType="default"
                      scrollEnabled={true}
                    />
                  </ScrollView>

                  {/* Toolbar - Modern bubble-style design with smooth animations */}
                  <Animated.View style={[{
                    position: 'absolute',
                    bottom: 110, // Keep consistent position, use only transform for movement
                    left: 0,
                    right: 0,
                    alignItems: 'center', // Center the bubble
                    justifyContent: 'center',
                  }, toolbarAnimatedStyle]}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 24, // Bubble shape
                      backgroundColor: isDarkMode ? 'rgba(28, 28, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: isDarkMode ? 0.4 : 0.15,
                      shadowRadius: 16,
                      elevation: 12,
                      borderWidth: isDarkMode ? 1 : 0.5,
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      maxWidth: 280, // Compact width
                    }}>
                      {/* Font Style */}
                      <TouchableOpacity style={{ 
                        padding: 10,
                        borderRadius: 12,
                        backgroundColor: 'transparent',
                        minWidth: 36,
                        alignItems: 'center',
                      }}>
                        <Text style={{ 
                          fontSize: 16, 
                          fontWeight: '600',
                          color: colors.primaryText 
                        }}>Aa</Text>
                      </TouchableOpacity>

                      {/* Magic Wand */}
                      <TouchableOpacity style={{ 
                        padding: 10,
                        borderRadius: 12,
                        backgroundColor: 'transparent',
                        minWidth: 36,
                        alignItems: 'center',
                      }}>
                        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M15 4V2m0 14v-2M8 9h2m10 0h2M17.8 11.8L19 13M17.8 6.2L19 5M3.8 11.8L5 13M3.8 6.2L5 5"
                            stroke={colors.primaryText}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </TouchableOpacity>

                      {/* Image */}
                      <TouchableOpacity style={{ 
                        padding: 10,
                        borderRadius: 12,
                        backgroundColor: 'transparent',
                        minWidth: 36,
                        alignItems: 'center',
                      }}>
                        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21"
                            stroke={colors.primaryText}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </TouchableOpacity>

                      {/* Camera */}
                      <TouchableOpacity style={{ 
                        padding: 10,
                        borderRadius: 12,
                        backgroundColor: 'transparent',
                        minWidth: 36,
                        alignItems: 'center',
                      }}>
                        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                            stroke={colors.primaryText}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <Path
                            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                            stroke={colors.primaryText}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </TouchableOpacity>

                      {/* Location */}
                      <TouchableOpacity style={{ 
                        padding: 10,
                        borderRadius: 12,
                        backgroundColor: 'transparent',
                        minWidth: 36,
                        alignItems: 'center',
                      }}>
                        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
                            stroke={colors.primaryText}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <Path
                            d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                            stroke={colors.primaryText}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </TouchableOpacity>
                    </View>
                  </Animated.View>
                </Animated.View>
              </PanGestureHandler>
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
    </View>
  );
} 