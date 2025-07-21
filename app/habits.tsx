import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { Habit, useHabits } from '@/contexts/HabitsContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ImageBackground,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAIN_RING_SIZE = 260;
const MAIN_RING_STROKE_WIDTH = 52;
const PREVIEW_RING_SIZE = 70;
const PREVIEW_RING_STROKE_WIDTH = 16;

// Apple-inspired habit colors
const HABIT_COLORS = [
  '#FF3B30', // Red
  '#FF9500', // Orange  
  '#FFCC00', // Yellow
  '#34C759', // Green
  '#007AFF', // Blue
  '#5856D6', // Purple
  '#FF2D92', // Pink
  '#00C7BE', // Teal
];

const PreviewRing: React.FC<{ 
  habit: Habit; 
  isActive: boolean; 
  onPress: () => void; 
  onDelete: () => void;
  onShowDeleteBubble: (position: { x: number; y: number }) => void;
}> = ({ habit, isActive, onPress, onDelete, onShowDeleteBubble }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const circumference = 2 * Math.PI * (PREVIEW_RING_SIZE / 2 - PREVIEW_RING_STROKE_WIDTH / 2);
  const ringRef = useRef<View>(null);

  let progress = 0;
  if (habit.goal !== 'infinite') {
    progress = Math.min(habit.current / habit.goal, 1);
  }

  const strokeDasharray = habit.goal === 'infinite' ? undefined : circumference;
  const strokeDashoffset = habit.goal === 'infinite' ? undefined : circumference * (1 - progress);

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Measure the ring position on screen
    ringRef.current?.measureInWindow((x, y, width, height) => {
      // Position bubble at top-right corner of the ring
      onShowDeleteBubble({
        x: x + width - 8,
        y: y - 8
      });
    });
  };

  return (
    <View style={styles.previewRingContainer} ref={ringRef}>
      <TouchableOpacity 
        onPress={onPress} 
        onLongPress={handleLongPress}
        activeOpacity={0.7} 
        style={styles.previewRingTouchable}
      >
        <View style={[
          styles.previewRingWrapper, 
          isActive && [styles.activePreviewRing, { 
            backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' 
          }]
        ]}>
          <Svg width={PREVIEW_RING_SIZE} height={PREVIEW_RING_SIZE}>
            {/* Background ring */}
            <Circle
              cx={PREVIEW_RING_SIZE / 2}
              cy={PREVIEW_RING_SIZE / 2}
              r={PREVIEW_RING_SIZE / 2 - PREVIEW_RING_STROKE_WIDTH / 2}
              stroke={colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              strokeWidth={PREVIEW_RING_STROKE_WIDTH}
              fill="transparent"
            />
            {/* Progress ring */}
            <Circle
              cx={PREVIEW_RING_SIZE / 2}
              cy={PREVIEW_RING_SIZE / 2}
              r={PREVIEW_RING_SIZE / 2 - PREVIEW_RING_STROKE_WIDTH / 2}
              stroke={habit.color}
              strokeWidth={PREVIEW_RING_STROKE_WIDTH}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${PREVIEW_RING_SIZE / 2} ${PREVIEW_RING_SIZE / 2})`}
            />
          </Svg>
        </View>
        <Text style={[styles.previewDay, { color: Colors[colorScheme].text }]}>
          {habit.name}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const MainRing: React.FC<{ 
  habit: Habit; 
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  setShowCelebration: (show: boolean) => void;
  celebrationAnimations: any[];
  celebrationEmojis: string[];
}> = ({ habit, updateHabit, setShowCelebration, celebrationAnimations, celebrationEmojis }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const circumference = 2 * Math.PI * (MAIN_RING_SIZE / 2 - MAIN_RING_STROKE_WIDTH / 2);
  const player = useAudioPlayer(require('../assets/clicksound.mp3'));
  const isPlayingRef = useRef(false);

  // Animation values for bouncy effects
  const ringScale = useRef(new Animated.Value(1)).current;
  const emojiScale = useRef(new Animated.Value(1)).current;
  const emojiRotation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  let progress = 0;
  const wasComplete = useRef<{[key: string]: boolean}>({});
  if (habit.goal !== 'infinite') {
    progress = Math.min(habit.current / habit.goal, 1);
  }

  const strokeDasharray = habit.goal === 'infinite' ? undefined : circumference;
  const strokeDashoffset = habit.goal === 'infinite' ? undefined : circumference * (1 - progress);

  // Ensure audio player is ready
  useEffect(() => {
    const prepareAudio = async () => {
      try {
        // Load the audio if needed
        if (player) {
          console.log('Audio player initialized');
        }
      } catch (error) {
        console.log('Error preparing audio:', error);
      }
    };
    
    prepareAudio();
  }, [player]);

  // Check if habit just completed and start pulse animation
  useEffect(() => {
    const habitWasComplete = wasComplete.current[habit.id] || false;
    
    if (habit.goal !== 'infinite' && progress >= 1 && !habitWasComplete) {
      wasComplete.current[habit.id] = true;
      triggerCelebration();
      // Start continuous pulse animation
      startPulseAnimation();
    } else if (progress < 1 && habitWasComplete) {
      // When progress drops below 1, reset the completion tracking
      // This ensures celebration will trigger again when reaching the goal
      wasComplete.current[habit.id] = false;
      // Stop pulse animation
      pulseAnimation.stopAnimation();
      pulseAnimation.setValue(1);
    } else if (progress >= 1 && habitWasComplete) {
      // Already complete, just start pulse animation without celebration
      startPulseAnimation();
    } else if (progress < 1) {
      // Not complete, stop pulse animation
      pulseAnimation.stopAnimation();
      pulseAnimation.setValue(1);
    }
  }, [progress, habit.id, habit.current]);

  const startPulseAnimation = () => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
  };

  const triggerCelebration = () => {
    setShowCelebration(true);

    // Enhanced celebration haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 100);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 200);

    // Animate celebration emojis falling from top
    const animations = celebrationAnimations.map((emoji, index) => {
      // Reset positions
      emoji.translateY.setValue(SCREEN_HEIGHT);
      emoji.translateX.setValue(Math.random() * SCREEN_WIDTH);
      emoji.rotation.setValue(0);
      emoji.scale.setValue(0.5 + Math.random() * 0.5);

      return Animated.parallel([
        Animated.timing(emoji.translateY, {
          toValue: -100,
          duration: 3000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(emoji.rotation, {
          toValue: 360 * (Math.random() > 0.5 ? 1 : -1),
          duration: 3000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(emoji.scale, {
            toValue: 1 + Math.random() * 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(emoji.scale, {
            toValue: 0,
            duration: 500,
            delay: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.stagger(100, animations).start(() => {
      setShowCelebration(false);
    });
  };

  const handleRingPress = () => {
    // Enhanced bouncy haptic feedback sequence for satisfying feel
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Add a bouncy secondary feedback after a short delay
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 80);

    // And a third subtle one for the bouncy effect
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 150);

    // Update habit progress
    if (habit.goal !== 'infinite') {
      // Increment by 1 unit, but don't exceed the goal
      const newCurrent = Math.min(habit.current + 1, habit.goal);
      updateHabit(habit.id, { current: newCurrent });
    } else {
      // For infinite goals, just increment
      updateHabit(habit.id, { current: habit.current + 1 });
    }

    // Bouncy ring animation
    Animated.sequence([
      Animated.timing(ringScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(ringScale, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Bouncy emoji animation with rotation
    Animated.parallel([
      Animated.sequence([
        Animated.timing(emojiScale, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(emojiScale, {
          toValue: 1,
          friction: 4,
          tension: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(emojiRotation, {
          toValue: 15,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(emojiRotation, {
          toValue: 0,
          friction: 5,
          tension: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Improved sound handling
    const playSound = async () => {
      try {
        console.log('Attempting to play sound...');
        
        // Check if player exists
        if (!player) {
          console.log('Player not available');
          return;
        }

        // Stop any current playback
        if (isPlayingRef.current) {
          console.log('Stopping current playback...');
          await player.pause();
          isPlayingRef.current = false;
          // Small delay to ensure stop is processed
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        // Reset to beginning and play
        console.log('Seeking to start and playing...');
        await player.seekTo(0);
        await player.play();
        isPlayingRef.current = true;
        console.log('Sound should be playing now');

        // Reset flag after sound duration
        setTimeout(() => {
          isPlayingRef.current = false;
          console.log('Sound playback finished');
        }, 300);

      } catch (error) {
        console.log('Error playing sound:', error);
        isPlayingRef.current = false;
        
        // Fallback: try a simpler approach
        try {
          console.log('Trying fallback sound approach...');
          player?.play();
        } catch (fallbackError) {
          console.log('Fallback sound also failed:', fallbackError);
        }
      }
    };

    // Call the async function
    playSound();
  };

  return (
    <TouchableOpacity onPress={handleRingPress} activeOpacity={0.8} style={styles.mainRingContainer}>
      <Animated.View style={[
        { 
          transform: [
            { scale: ringScale },
            ...(progress >= 1 ? [{ scale: pulseAnimation }] : [])
          ] 
        },
        progress >= 1 && {
          shadowColor: habit.color,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.6,
          shadowRadius: 20,
          elevation: 20,
        }
      ]}>
        <Svg width={MAIN_RING_SIZE} height={MAIN_RING_SIZE}>
        {/* Background ring */}
        <Circle
          cx={MAIN_RING_SIZE / 2}
          cy={MAIN_RING_SIZE / 2}
          r={MAIN_RING_SIZE / 2 - MAIN_RING_STROKE_WIDTH / 2}
          stroke={colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
          strokeWidth={MAIN_RING_STROKE_WIDTH}
          fill="transparent"
        />
        {/* Progress ring */}
        <Circle
          cx={MAIN_RING_SIZE / 2}
          cy={MAIN_RING_SIZE / 2}
          r={MAIN_RING_SIZE / 2 - MAIN_RING_STROKE_WIDTH / 2}
          stroke={habit.color}
          strokeWidth={MAIN_RING_STROKE_WIDTH}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={habit.goal === 'infinite' ? undefined : strokeDasharray}
          strokeDashoffset={habit.goal === 'infinite' ? undefined : strokeDashoffset}
          transform={`rotate(-90 ${MAIN_RING_SIZE / 2} ${MAIN_RING_SIZE / 2})`}
        />
      </Svg>
      </Animated.View>

      {/* Centered emoji in the middle of the ring with bouncy animation */}
      <Animated.View style={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: MAIN_RING_SIZE,
        height: MAIN_RING_SIZE,
        transform: [
          { scale: emojiScale },
          { 
            rotate: emojiRotation.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
      }}>
        <Text style={{
          fontSize: 64,
          textAlign: 'center',
        }}>{habit.goal === 'infinite' ? '♾️' : '👋'}</Text>
      </Animated.View>

    </TouchableOpacity>
  );
};

export default function HabitsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const params = useLocalSearchParams();
  const { habits, updateHabit, deleteHabit } = useHabits();
  
  // Get the habit index from params, default to 0
  const initialHabitIndex = params.habitIndex ? parseInt(params.habitIndex as string, 10) : 0;
  const validInitialIndex = Math.max(0, Math.min(initialHabitIndex, habits.length - 1));
  
  const [currentIndex, setCurrentIndex] = useState(validInitialIndex);
  const [showCelebration, setShowCelebration] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const panRef = useRef<PanGestureHandler>(null);
  
  // Delete bubble state
  const [showDeleteBubble, setShowDeleteBubble] = useState(false);
  const [deleteBubblePosition, setDeleteBubblePosition] = useState({ x: 0, y: 0 });
  const [habitToDelete, setHabitToDelete] = useState<{ id: string; index: number } | null>(null);
  const bubbleScale = useRef(new Animated.Value(0)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  
  // Update current index when habits change or when we get a new habitIndex param
  useEffect(() => {
    if (params.habitIndex) {
      const newIndex = parseInt(params.habitIndex as string, 10);
      const validIndex = Math.max(0, Math.min(newIndex, habits.length - 1));
      setCurrentIndex(validIndex);
    }
  }, [params.habitIndex, habits.length]);
  
  // Celebration animations for background
  const celebrationEmojis = ['🎉', '🥳', '🎊', '🎈', '🎁'];
  const celebrationAnimations = useRef(
    Array.from({ length: 20 }, () => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(SCREEN_HEIGHT),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(0),
    }))
  ).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === 5) { // END state
      const { translationX, velocityX } = event.nativeEvent;
      const threshold = SCREEN_WIDTH * 0.3;

      let newIndex = currentIndex;

      if (translationX > threshold || velocityX > 500) {
        // Swipe right - go to previous habit
        newIndex = Math.max(0, currentIndex - 1);
      } else if (translationX < -threshold || velocityX < -500) {
        // Swipe left - go to next habit
        newIndex = Math.min(habits.length - 1, currentIndex + 1);
      }

      if (newIndex !== currentIndex) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCurrentIndex(newIndex);
      }

      // Reset animation
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  };

  const handleAddHabit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/add-habit');
  };

  const handlePreviewPress = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentIndex(index);
  };

  const handleShowDeleteBubble = (position: { x: number; y: number }, habitId: string, habitIndex: number) => {
    setDeleteBubblePosition(position);
    setHabitToDelete({ id: habitId, index: habitIndex });
    setShowDeleteBubble(true);
    
    // Animate bubble in
    Animated.parallel([
      Animated.spring(bubbleScale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      Animated.timing(bubbleOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideBubble = () => {
    Animated.parallel([
      Animated.spring(bubbleScale, {
        toValue: 0,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      Animated.timing(bubbleOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowDeleteBubble(false);
      setHabitToDelete(null);
    });
  };

  const handleDeleteHabit = (habitId: string, deletedIndex: number) => {
    deleteHabit(habitId);
    
    // Adjust current index if necessary
    if (deletedIndex < currentIndex) {
      // If we deleted a habit before the current one, shift current index back
      setCurrentIndex(currentIndex - 1);
    } else if (deletedIndex === currentIndex) {
      // If we deleted the current habit, adjust to a valid index
      const newIndex = Math.min(currentIndex, habits.length - 2); // -2 because we're about to delete one
      setCurrentIndex(Math.max(0, newIndex));
    }
    // If deletedIndex > currentIndex, no adjustment needed
  };

  const handleConfirmDelete = () => {
    if (habitToDelete) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      hideBubble();
      setTimeout(() => {
        handleDeleteHabit(habitToDelete.id, habitToDelete.index);
      }, 150);
    }
  };

  const currentHabit = habits[currentIndex];

  // If no habits exist, show empty state
  if (habits.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { 
              backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
            }]}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].text} />
          </TouchableOpacity>

          {/* Add button */}
          <TouchableOpacity 
            style={[styles.addButton, { 
              backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
            }]}
            onPress={handleAddHabit}
            activeOpacity={0.7}
          >
            <IconSymbol name="plus" size={24} color={Colors[colorScheme].text} />
          </TouchableOpacity>
        </View>

        {/* Empty state */}
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateTitle, { color: Colors[colorScheme].text }]}>
            No Habits Yet
          </Text>
          <Text style={[styles.emptyStateSubtitle, { color: Colors[colorScheme].text, opacity: 0.6 }]}>
            Tap the + button to create your first habit
          </Text>
        </View>
      </View>
    );
  }

  // Load saved background preference
  const [selectedBackground, setSelectedBackground] = useState<string>('gradient1');
  useEffect(() => {
    const loadBackgroundPreference = async () => {
      try {
        const savedBackground = await AsyncStorage.getItem('selectedBackground');
        setSelectedBackground(savedBackground || 'gradient1');
      } catch (error) {
        console.log('Error loading background preference:', error);
        setSelectedBackground('gradient1');
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
        return colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF';
      case 'off-white':
        return colorScheme === 'dark' ? '#000000' : '#FFFAF2';
      case 'pattern-arabic':
        return colorScheme === 'dark' ? '#1C1C1E' : '#FFFAF2';
      default:
        // For gradients, respect dark mode
        return colorScheme === 'dark' ? '#1C1C1E' : '#FFFAF2';
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

  // Enhanced colors with background support
  const colors = {
    ...Colors[colorScheme],
    background: getBackgroundColor(),
    cardBackground: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? 
                   (colorScheme === 'dark' ? '#2C2C2E' : '#F8F9FA') : (colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF'),
    text: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? 
          (colorScheme === 'dark' ? '#FFFFFF' : '#000000') : (colorScheme === 'dark' ? '#FFFFFF' : '#000000'),
  };

  const renderHabitsContent = () => (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { 
            backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
          }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>

        {/* Add button */}
        <TouchableOpacity 
          style={[styles.addButton, { 
            backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
          }]}
          onPress={handleAddHabit}
          activeOpacity={0.7}
        >
          <IconSymbol name="plus" size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      {/* Top preview rings */}
      <View style={styles.previewContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.previewScrollContent}
        >
          {habits.map((habit, index) => (
            <PreviewRing
              key={habit.id}
              habit={habit}
              isActive={index === currentIndex}
              onPress={() => handlePreviewPress(index)}
              onDelete={() => {
                handleDeleteHabit(habit.id, index);
              }}
              onShowDeleteBubble={(position) => handleShowDeleteBubble(position, habit.id, index)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Celebration Animation Background */}
      {showCelebration && (
        <View style={styles.celebrationBackground} pointerEvents="none">
          {celebrationAnimations.map((emoji, index) => (
            <Animated.View
              key={index}
              style={[
                styles.celebrationEmoji,
                {
                  transform: [
                    { translateX: emoji.translateX },
                    { translateY: emoji.translateY },
                    { 
                      rotate: emoji.rotation.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                    { scale: emoji.scale },
                  ],
                },
              ]}
            >
              <Text style={styles.celebrationEmojiText}>
                {celebrationEmojis[index % celebrationEmojis.length]}
              </Text>
            </Animated.View>
          ))}
        </View>
      )}

      {/* Main content */}
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <MainRing 
            habit={currentHabit} 
            updateHabit={updateHabit}
            setShowCelebration={setShowCelebration}
            celebrationAnimations={celebrationAnimations}
            celebrationEmojis={celebrationEmojis}
          />
        </Animated.View>
      </PanGestureHandler>

      {/* Stats below the ring */}
      <View style={styles.statsContainer}>
        <Text style={[styles.habitName, { color: Colors[colorScheme].text }]}>
          {currentHabit.name}
        </Text>
        <Text style={[styles.habitStats, { color: currentHabit.color }]}>
          {currentHabit.goal === 'infinite' 
            ? `${currentHabit.current} ${currentHabit.unit}` 
            : `${currentHabit.current}/${currentHabit.goal} ${currentHabit.unit}`
          }
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtonsContainer}>
        {/* Rewind button */}
        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            opacity: currentHabit.current > 0 ? 1 : 0.3,
          }]}
          onPress={() => {
            if (currentHabit.current > 0) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              updateHabit(currentHabit.id, { current: currentHabit.current - 1 });
            }
          }}
          activeOpacity={0.7}
          disabled={currentHabit.current <= 0}
        >
          <IconSymbol name="arrow.uturn.backward" size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>

        {/* Reset button */}
        <TouchableOpacity 
          style={[styles.actionButton, { 
            backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            opacity: currentHabit.current > 0 ? 1 : 0.3,
          }]}
          onPress={() => {
            if (currentHabit.current > 0) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              // Reset habit progress to 0 - this will trigger the useEffect
              // to reset completion tracking, allowing celebrations on next completion
              updateHabit(currentHabit.id, { current: 0 });
            }
          }}
          activeOpacity={0.7}
          disabled={currentHabit.current <= 0}
        >
          <IconSymbol name="arrow.clockwise" size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      {/* Screen-level Delete Bubble Modal */}
      <Modal
        visible={showDeleteBubble}
        transparent={true}
        animationType="none"
        statusBarTranslucent={true}
      >
        <View style={styles.modalContainer}>
          {/* Frosted glass blur overlay like Apple 3D Touch */}
          <Animated.View style={[styles.blurContainer, { opacity: bubbleOpacity }]}>
            <BlurView 
              intensity={20}
              style={styles.blurOverlay}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
            />
          </Animated.View>
          
          {/* Invisible touchable overlay to catch taps anywhere to dismiss */}
          <TouchableOpacity 
            onPress={hideBubble}
            style={styles.modalOverlay}
            activeOpacity={1}
          />
          
          {/* Delete Bubble positioned absolutely */}
          <Animated.View 
            style={[
              styles.modalDeleteBubble,
              {
                backgroundColor: colorScheme === 'dark' ? '#FF453A' : '#FF3B30',
                transform: [{ scale: bubbleScale }],
                opacity: bubbleOpacity,
                left: deleteBubblePosition.x,
                top: deleteBubblePosition.y,
              }
            ]}
          >
            <TouchableOpacity 
              onPress={handleConfirmDelete}
              style={styles.modalDeleteButton}
              activeOpacity={0.8}
            >
              <Text style={styles.modalDeleteIcon}>🗑️</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );

  // Main render with background handling
  return selectedBackground?.startsWith('gradient') ? (
    <LinearGradient
      colors={getGradientColors(selectedBackground)}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {renderHabitsContent()}
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
          opacity: colorScheme === 'dark' ? 0.05 : 0.08,
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
      {renderHabitsContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  previewScrollContent: {
    paddingHorizontal: 40,
    gap: 18,
    alignItems: 'center',
  },
  previewRingContainer: {
    alignItems: 'center',
    gap: 10,
    position: 'relative',
  },
  previewRingTouchable: {
    alignItems: 'center',
    gap: 10,
  },
  previewRingWrapper: {
    padding: 6,
    borderRadius: 40,
  },
  activePreviewRing: {
    // Dynamic background color applied inline
  },
  previewDay: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -25,
  },
  mainRingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressIndicator: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    top: MAIN_RING_SIZE / 2,
    left: MAIN_RING_SIZE / 2,
    marginLeft: -20,
    marginTop: -20,
  },
  statsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 15,
    gap: 8,
    paddingHorizontal: 20,
  },
  habitName: {
    fontSize: 38,
    fontWeight: '700',
    letterSpacing: -1,
    textAlign: 'center',
  },
  habitStats: {
    fontSize: 52,
    fontWeight: '200',
    letterSpacing: -2,
    textAlign: 'center',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
    textAlign: 'center',
    opacity: 0.6,
  },
  celebrationBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  celebrationEmoji: {
    position: 'absolute',
  },
  celebrationEmojiText: {
    fontSize: 32,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 120,
    gap: 40,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBubble3D: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 999999, // Maximum elevation for Android
    zIndex: 999999, // Maximum z-index to ensure it's on top of everything
  },
  deleteBubbleButton3D: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  deleteBubbleIcon: {
    fontSize: 16,
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: -1000, // Cover entire screen including status bar area
    left: -1000,
    right: -1000,
    bottom: -1000,
    zIndex: 999998, // Just below the delete bubble
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurOverlay: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalDeleteBubble: {
    position: 'absolute',
    width: 60, // Made even bigger
    height: 60, // Made even bigger
    borderRadius: 30, // Adjusted for new size
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalDeleteButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30, // Adjusted for new size
  },
  modalDeleteIcon: {
    fontSize: 28, // Made bigger to match new bubble size
  },
});