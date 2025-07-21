import { CalendarEvent } from '../contexts/CalendarContext';
import { Habit } from '../contexts/HabitsContext';

export interface DashboardStats {
  upcomingEvents: number;
  newMessages: number;
  dailyHabits: number;
  completedHabits: number;
  habitCompletionRate: number;
  nextEventTime?: string;
  journalEntriesThisWeek?: number;
  streakDays?: number;
}

export interface DynamicSummary {
  greeting: string;
  message: string;
  emoji: string;
  motivationalPhrase: string;
  stats: {
    events: { count: number; label: string };
    messages: { count: number; label: string };
    habits: { count: number; label: string };
  };
}

// Time-based greetings
const getTimeBasedGreeting = (): string => {
  // Always return "Salam" as requested
  return 'Salam';
};

// Day-based context
const getDayContext = (): { dayType: string; specialMessage?: string } => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const contexts = {
    0: { dayType: 'weekend', specialMessage: 'Perfect day for reflection and family time' },
    1: { dayType: 'week_start', specialMessage: 'New week, fresh opportunities' },
    2: { dayType: 'regular', specialMessage: 'Keep the momentum going' },
    3: { dayType: 'midweek', specialMessage: 'Halfway through - stay strong' },
    4: { dayType: 'pre_friday', specialMessage: 'Preparing hearts for Jummah' },
    5: { dayType: 'jummah', specialMessage: 'Jummah Mubarak! Blessed Friday' },
    6: { dayType: 'weekend', specialMessage: 'Alhamdulillah for this peaceful weekend' }
  };

  return contexts[dayOfWeek as keyof typeof contexts];
};

// Habit-based motivational messages
const getHabitMotivation = (stats: DashboardStats): string => {
  const { completedHabits, dailyHabits, habitCompletionRate } = stats;
  
  if (habitCompletionRate >= 0.8) {
    return 'MashAllah! Your consistency is inspiring 🌟';
  } else if (habitCompletionRate >= 0.5) {
    return 'Good progress! Keep building those positive habits ⚡';
  } else if (completedHabits === 0) {
    return 'Small steps lead to big changes. Start today! 💪';
  } else {
    return 'Every habit completed is a victory. Keep going! 🎯';
  }
};

// Event-based context
const getEventContext = (events: CalendarEvent[]): { timeContext: string; urgency: 'low' | 'medium' | 'high' } => {
  if (events.length === 0) return { timeContext: 'free schedule', urgency: 'low' };
  
  const now = new Date();
  const nextEvent = events[0]; // Assuming events are sorted
  const eventDate = new Date(nextEvent.start.dateTime || nextEvent.start.date || '');
  const timeDiff = eventDate.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  if (hoursDiff <= 2) {
    return { timeContext: 'event starting soon', urgency: 'high' };
  } else if (hoursDiff <= 24) {
    return { timeContext: 'event today', urgency: 'medium' };
  } else {
    return { timeContext: 'upcoming events', urgency: 'low' };
  }
};

// Generate dynamic message based on stats and context
const generateDynamicMessage = (stats: DashboardStats, events: CalendarEvent[]): string => {
  // Consistent template with emojis for each stat type
  return `You have 📅 ${stats.upcomingEvents} event${stats.upcomingEvents !== 1 ? 's' : ''}, 💬 ${stats.newMessages} message${stats.newMessages !== 1 ? 's' : ''}, and ✅ ${stats.dailyHabits - stats.completedHabits} habit${stats.dailyHabits - stats.completedHabits !== 1 ? 's' : ''} awaiting your attention.`;
};

// Get contextual emoji
const getContextualEmoji = (stats: DashboardStats): string => {
  const hour = new Date().getHours();
  const dayContext = getDayContext();
  
  if (dayContext.dayType === 'jummah') return '🕌';
  if (hour >= 6 && hour < 12) return '🌅';
  if (hour >= 12 && hour < 17) return '☀️';
  if (hour >= 17 && hour < 21) return '🌆';
  if (stats.habitCompletionRate >= 0.8) return '⭐';
  if (stats.upcomingEvents > 0) return '📅';
  return '🌙';
};

// Get motivational phrase
const getMotivationalPhrase = (stats: DashboardStats): string => {
  const phrases = {
    high_performance: [
      'MashAllah, you\'re crushing it! 🔥',
      'Keep this beautiful momentum! ✨',
      'Your dedication is inspiring! 🌟',
      'Barakallahu feeki! 💫'
    ],
    good_progress: [
      'You\'re on the right path! 🎯',
      'Steady progress, keep going! 🚀',
      'Building beautiful habits! 💪',
      'Every step counts! ⚡'
    ],
    needs_motivation: [
      'Small steps, big impact! 🌱',
      'You\'ve got this! 💝',
      'Progress over perfection! 🎨',
      'Start where you are! 🔄'
    ],
    friday_special: [
      'Jummah Mubarak! 🕌',
      'Blessed Friday energy! ✨',
      'Spiritual connection day! 💫',
      'Community and growth! 🤝'
    ]
  };
  
  const dayContext = getDayContext();
  
  if (dayContext.dayType === 'jummah') {
    return phrases.friday_special[Math.floor(Math.random() * phrases.friday_special.length)];
  }
  
  if (stats.habitCompletionRate >= 0.8) {
    return phrases.high_performance[Math.floor(Math.random() * phrases.high_performance.length)];
  } else if (stats.habitCompletionRate >= 0.4) {
    return phrases.good_progress[Math.floor(Math.random() * phrases.good_progress.length)];
  } else {
    return phrases.needs_motivation[Math.floor(Math.random() * phrases.needs_motivation.length)];
  }
};

// Main function to generate dynamic summary
export const generateDashboardSummary = (
  events: CalendarEvent[], 
  habits: Habit[], 
  messageCount: number = 0,
  journalEntries: number = 0
): DynamicSummary => {
  // Calculate habit stats
  const completedHabits = habits.filter(habit => habit.current >= (typeof habit.goal === 'number' ? habit.goal : 1)).length;
  const habitCompletionRate = habits.length > 0 ? completedHabits / habits.length : 0;
  
  // Prepare stats
  const stats: DashboardStats = {
    upcomingEvents: events.length,
    newMessages: messageCount,
    dailyHabits: habits.length,
    completedHabits,
    habitCompletionRate,
    journalEntriesThisWeek: journalEntries,
    nextEventTime: events.length > 0 ? events[0].start.dateTime || events[0].start.date : undefined
  };
  
  return {
    greeting: getTimeBasedGreeting(),
    message: generateDynamicMessage(stats, events),
    emoji: getContextualEmoji(stats),
    motivationalPhrase: getMotivationalPhrase(stats),
    stats: {
      events: { count: stats.upcomingEvents, label: stats.upcomingEvents === 1 ? 'event' : 'events' },
      messages: { count: stats.newMessages, label: stats.newMessages === 1 ? 'message' : 'messages' },
      habits: { count: stats.dailyHabits, label: stats.dailyHabits === 1 ? 'habit' : 'habits' }
    }
  };
};

// Additional utility for progress-based insights
export const getProgressInsights = (stats: DashboardStats): string[] => {
  const insights: string[] = [];
  
  if (stats.habitCompletionRate >= 0.8) {
    insights.push('🎯 Excellent habit consistency this week!');
  }
  
  if (stats.upcomingEvents > 0) {
    insights.push(`📅 ${stats.upcomingEvents} spiritual gathering${stats.upcomingEvents > 1 ? 's' : ''} await`);
  }
  
  if (stats.newMessages > 5) {
    insights.push('💬 Active community engagement!');
  }
  
  const dayContext = getDayContext();
  if (dayContext.dayType === 'jummah') {
    insights.push('🕌 Perfect day for spiritual reflection');
  }
  
  return insights;
}; 