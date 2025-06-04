import React from 'react';
import { View } from 'react-native';

interface WidgetProps {
  colors: any;
  isDarkMode: boolean;
}

const baseWidgetStyle = {
  flex: 1,
  backgroundColor: '#FFFFFF',
  borderRadius: 30,
  padding: 22,
  margin: 0,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 4,
  borderWidth: 0,
};

export const EventsWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
);

export const MessagesWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
);

export const HabitsWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
);

export const AskMinaraWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
);

export const PrayerWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
);

export const JournalWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
);

export const CohortWidget: React.FC<WidgetProps> = ({ colors, isDarkMode }) => (
  <View style={[baseWidgetStyle, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
  </View>
); 