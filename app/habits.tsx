import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAIN_RING_SIZE = 280;
const MAIN_RING_STROKE_WIDTH = 56;
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

interface Habit {
  id: string;
  name: string;
  goal: number | 'infinite';
  current: number;
  color: string;
  streak: number;
  unit: string;
}

// Mock data
const MOCK_HABITS: Habit[] = [
  {
    id: '1',
    name: 'Move',
    goal: 110,
    current: 0,
    color: HABIT_COLORS[0],
    streak: 5,
    unit: 'CAL',
  },
  {
    id: '2',
    name: 'Exercise',
    goal: 30,
    current: 22,
    color: HABIT_COLORS[1],
    streak: 12,
    unit: 'MIN',
  },
  {
    id: '3',
    name: 'Stand',
    goal: 12,
    current: 8,
    color: HABIT_COLORS[2],
    streak: 8,
    unit: 'HRS',
  },
  {
    id: '4',
    name: 'Water',
    goal: 8,
    current: 5,
    color: HABIT_COLORS[3],
    streak: 3,
    unit: 'CUPS',
  },
];

const PreviewRing: React.FC<{ habit: Habit; isActive: boolean; onPress: () => void }> = ({ habit, isActive, onPress }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const circumference = 2 * Math.PI * (PREVIEW_RING_SIZE / 2 - PREVIEW_RING_STROKE_WIDTH / 2);
  
  let progress = 0;
  if (habit.goal !== 'infinite') {
    progress = Math.min(habit.current / habit.goal, 1);
  }

  const strokeDasharray = habit.goal === 'infinite' ? undefined : circumference;
  const strokeDashoffset = habit.goal === 'infinite' ? undefined : circumference * (1 - progress);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.previewRingContainer}>
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
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][MOCK_HABITS.indexOf(habit) % 7]}
      </Text>
    </TouchableOpacity>
  );
};

const MainRing: React.FC<{ habit: Habit }> = ({ habit }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const circumference = 2 * Math.PI * (MAIN_RING_SIZE / 2 - MAIN_RING_STROKE_WIDTH / 2);
  const player = useAudioPlayer(require('../assets/clicksound.mp3'));
  
  let progress = 0;
  if (habit.goal !== 'infinite') {
    progress = Math.min(habit.current / habit.goal, 1);
  }

  const strokeDasharray = habit.goal === 'infinite' ? undefined : circumference;
  const strokeDashoffset = habit.goal === 'infinite' ? undefined : circumference * (1 - progress);

  const handleRingPress = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Play sound
    try {
      player.replay();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.mainRingContainer}
      onPress={handleRingPress}
      activeOpacity={0.9}
    >
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
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${MAIN_RING_SIZE / 2} ${MAIN_RING_SIZE / 2})`}
        />
      </Svg>
      
      {/* Centered wave emoji in the middle of the ring */}
      <View style={{
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: MAIN_RING_SIZE,
        height: MAIN_RING_SIZE,
      }}>
        <Text style={{
          fontSize: 64,
          textAlign: 'center',
        }}>👋</Text>
      </View>

      {/* Arrow indicator at progress point */}
      {progress > 0 && (
        <View 
          style={[
            styles.progressIndicator,
            {
              backgroundColor: habit.color,
              transform: [
                { rotate: `${progress * 360 - 90}deg` },
                { translateY: -(MAIN_RING_SIZE / 2 - MAIN_RING_STROKE_WIDTH / 2) },
              ],
            },
          ]}
        >
          <IconSymbol name="chevron.right" size={16} color="#000" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function HabitsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const panRef = useRef<PanGestureHandler>(null);

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
        newIndex = Math.min(MOCK_HABITS.length - 1, currentIndex + 1);
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
    console.log('Add new habit');
  };

  const handlePreviewPress = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentIndex(index);
  };

  const currentHabit = MOCK_HABITS[currentIndex];

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
      </View>

      {/* Top preview rings */}
      <View style={styles.previewContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.previewScrollContent}
        >
          {MOCK_HABITS.map((habit, index) => (
            <PreviewRing
              key={habit.id}
              habit={habit}
              isActive={index === currentIndex}
              onPress={() => handlePreviewPress(index)}
            />
          ))}
        </ScrollView>
      </View>

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
          <MainRing habit={currentHabit} />
        </Animated.View>
      </PanGestureHandler>

      {/* Stats below the ring */}
      <View style={styles.statsContainer}>
        <Text style={[styles.habitName, { color: Colors[colorScheme].text }]}>
          {currentHabit.name}
        </Text>
        <Text style={[styles.habitStats, { color: currentHabit.color }]}>
          {currentHabit.current}/{currentHabit.goal}{currentHabit.unit}
        </Text>
      </View>

      {/* Add button */}
      <TouchableOpacity 
        style={[styles.addButton, { 
          backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          shadowColor: colorScheme === 'dark' ? '#FFF' : '#000',
        }]}
        onPress={handleAddHabit}
        activeOpacity={0.7}
      >
        <IconSymbol name="plus" size={20} color={Colors[colorScheme].text} />
      </TouchableOpacity>
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
  },
  previewRingWrapper: {
    padding: 6,
    borderRadius: 40,
  },
  activePreviewRing: {
    // Dynamic background color applied inline
  },
  previewDay: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: -50,
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
    marginBottom: 140,
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
    position: 'absolute',
    bottom: 110,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
}); 