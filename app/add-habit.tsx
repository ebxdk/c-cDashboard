import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useHabits } from '@/contexts/HabitsContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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

const HABIT_UNITS = [
  { label: 'Minutes', value: 'MIN' },
  { label: 'Hours', value: 'HRS' },
  { label: 'Times', value: 'TIMES' },
  { label: 'Cups', value: 'CUPS' },
  { label: 'Pages', value: 'PAGES' },
  { label: 'Calories', value: 'CAL' },
  { label: 'Steps', value: 'STEPS' },
  { label: 'Miles', value: 'MILES' },
];

export default function AddHabitScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const { addHabit } = useHabits();
  
  const [habitName, setHabitName] = useState('');
  const [habitGoal, setHabitGoal] = useState('');
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [selectedUnit, setSelectedUnit] = useState(HABIT_UNITS[0]);
  const [isInfinite, setIsInfinite] = useState(false);

  const handleSave = () => {
    if (!habitName.trim() || (!isInfinite && !habitGoal.trim())) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const newHabit = {
      id: Date.now().toString(),
      name: habitName.trim(),
      goal: isInfinite ? ('infinite' as const) : (parseInt(habitGoal) || 1),
      current: 0,
      color: selectedColor,
      streak: 0,
      unit: selectedUnit.value,
    };

    addHabit(newHabit);
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleUnitSelect = (unit: typeof HABIT_UNITS[0]) => {
    setSelectedUnit(unit);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleToggleInfinite = () => {
    setIsInfinite(!isInfinite);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Clear goal when switching to infinite
    if (!isInfinite) {
      setHabitGoal('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.headerButton, { 
            backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
          }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <IconSymbol name="xmark" size={24} color={Colors[colorScheme].text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: Colors[colorScheme].text }]}>
          New Habit
        </Text>

        <TouchableOpacity 
          style={[styles.headerButton, { 
            backgroundColor: selectedColor,
            opacity: (!habitName.trim() || (!isInfinite && !habitGoal.trim())) ? 0.5 : 1,
          }]}
          onPress={handleSave}
          activeOpacity={0.7}
          disabled={!habitName.trim() || (!isInfinite && !habitGoal.trim())}
        >
          <IconSymbol name="checkmark" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Habit Name */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
              Habit Name
            </Text>
            <TextInput
              style={[styles.textInput, { 
                backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
                color: Colors[colorScheme].text,
                borderColor: selectedColor,
                borderWidth: habitName.trim() ? 2 : 0,
              }]}
              placeholder="e.g., Read, Exercise, Meditate"
              placeholderTextColor={colorScheme === 'dark' ? '#8E8E93' : '#8E8E93'}
              value={habitName}
              onChangeText={setHabitName}
              maxLength={30}
              autoCapitalize="words"
            />
          </View>

          {/* Habit Type Toggle */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
              Habit Type
            </Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleOption, {
                  backgroundColor: !isInfinite ? selectedColor : (colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7'),
                  borderColor: selectedColor,
                  borderWidth: 2,
                }]}
                onPress={() => !isInfinite ? null : handleToggleInfinite()}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, {
                  color: !isInfinite ? '#FFFFFF' : Colors[colorScheme].text,
                  fontWeight: !isInfinite ? '600' : '400',
                }]}>
                  🎯 Goal-based
                </Text>
                <Text style={[styles.toggleSubtext, {
                  color: !isInfinite ? 'rgba(255,255,255,0.8)' : Colors[colorScheme].text,
                  opacity: !isInfinite ? 1 : 0.6,
                }]}>
                  Complete a daily target
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.toggleOption, {
                  backgroundColor: isInfinite ? selectedColor : (colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7'),
                  borderColor: selectedColor,
                  borderWidth: 2,
                }]}
                onPress={() => isInfinite ? null : handleToggleInfinite()}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, {
                  color: isInfinite ? '#FFFFFF' : Colors[colorScheme].text,
                  fontWeight: isInfinite ? '600' : '400',
                }]}>
                  ♾️ Counter
                </Text>
                <Text style={[styles.toggleSubtext, {
                  color: isInfinite ? 'rgba(255,255,255,0.8)' : Colors[colorScheme].text,
                  opacity: isInfinite ? 1 : 0.6,
                }]}>
                  Track unlimited progress
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Goal - Only show for finite habits */}
          {!isInfinite && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
                Daily Goal
              </Text>
              <View style={styles.goalContainer}>
                <TextInput
                  style={[styles.goalInput, { 
                    backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
                    color: Colors[colorScheme].text,
                    borderColor: selectedColor,
                    borderWidth: habitGoal.trim() ? 2 : 0,
                  }]}
                  placeholder="30"
                  placeholderTextColor={colorScheme === 'dark' ? '#8E8E93' : '#8E8E93'}
                  value={habitGoal}
                  onChangeText={setHabitGoal}
                  keyboardType="numeric"
                  maxLength={4}
                />
                <TouchableOpacity
                  style={[styles.unitSelector, {
                    backgroundColor: selectedColor,
                  }]}
                  onPress={() => {
                    // Could open a picker here, for now just cycle through
                    const currentIndex = HABIT_UNITS.indexOf(selectedUnit);
                    const nextIndex = (currentIndex + 1) % HABIT_UNITS.length;
                    handleUnitSelect(HABIT_UNITS[nextIndex]);
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.unitText}>{selectedUnit.label}</Text>
                  <IconSymbol name="chevron.down" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Unit - Only show for infinite habits */}
          {isInfinite && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
                Unit
              </Text>
              <TouchableOpacity
                style={[styles.unitOnlySelector, {
                  backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
                  borderColor: selectedColor,
                  borderWidth: 2,
                }]}
                onPress={() => {
                  const currentIndex = HABIT_UNITS.indexOf(selectedUnit);
                  const nextIndex = (currentIndex + 1) % HABIT_UNITS.length;
                  handleUnitSelect(HABIT_UNITS[nextIndex]);
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.unitOnlyText, { color: Colors[colorScheme].text }]}>
                  {selectedUnit.label}
                </Text>
                <IconSymbol name="chevron.down" size={16} color={Colors[colorScheme].text} />
              </TouchableOpacity>
            </View>
          )}

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
              Color
            </Text>
            <View style={styles.colorGrid}>
              {HABIT_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorOption, { 
                    backgroundColor: color,
                    transform: [{ scale: selectedColor === color ? 1.1 : 1 }],
                    shadowOpacity: selectedColor === color ? 0.3 : 0.1,
                  }]}
                  onPress={() => handleColorSelect(color)}
                  activeOpacity={0.8}
                >
                  {selectedColor === color && (
                    <IconSymbol name="checkmark" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
              Preview
            </Text>
            <View style={[styles.previewCard, {
              backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
              borderColor: selectedColor,
              borderWidth: 2,
            }]}>
              <View style={[styles.previewRing, { 
                borderColor: selectedColor,
                backgroundColor: isInfinite ? selectedColor : 'transparent',
              }]}>
                <Text style={{ fontSize: 24 }}>
                  {isInfinite ? '♾️' : '🎯'}
                </Text>
              </View>
              <View style={styles.previewText}>
                <Text style={[styles.previewName, { color: Colors[colorScheme].text }]}>
                  {habitName || 'Habit Name'}
                </Text>
                <Text style={[styles.previewGoal, { color: selectedColor }]}>
                  {isInfinite 
                    ? `0 ${selectedUnit.value}` 
                    : `0/${habitGoal || '0'} ${selectedUnit.value}`
                  }
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  textInput: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  goalContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  goalInput: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  unitSelector: {
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  unitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  colorOption: {
    width: (SCREEN_WIDTH - 48 - 48) / 4, // 4 colors per row with gaps
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  previewCard: {
    padding: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  previewRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    flex: 1,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewGoal: {
    fontSize: 16,
    fontWeight: '700',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleOption: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleSubtext: {
    fontSize: 14,
    fontWeight: '400',
  },
  unitOnlySelector: {
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  unitOnlyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 