import React, { createContext, ReactNode, useContext, useState } from 'react';

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

export interface Habit {
  id: string;
  name: string;
  goal: number | 'infinite';
  current: number;
  color: string;
  streak: number;
  unit: string;
}

// Mock data
const INITIAL_HABITS: Habit[] = [
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

interface HabitsContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};

interface HabitsProviderProps {
  children: ReactNode;
}

export const HabitsProvider: React.FC<HabitsProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

  const addHabit = (habitData: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === id ? { ...habit, ...updates } : habit
      )
    );
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const value: HabitsContextType = {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
  };

  return (
    <HabitsContext.Provider value={value}>
      {children}
    </HabitsContext.Provider>
  );
}; 