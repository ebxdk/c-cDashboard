import { useColorScheme } from '@/hooks/useColorScheme';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Fonts } from '../constants/Fonts';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  htmlLink?: string;
  hangoutLink?: string;
}

export default function CalendarPage() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#666666',
    tertiaryText: isDarkMode ? '#636366' : '#999999',
    accent: '#5AC8FA', // Same blue for both themes
    shadow: isDarkMode ? '#000000' : '#000000',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
  };

  // Get current week's start and end dates
  const getCurrentWeekDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek); // Start from Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      start: startOfWeek.toISOString(),
      end: endOfWeek.toISOString(),
    };
  };

  // Fetch events from Google Calendar
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { start, end } = getCurrentWeekDates();
      
      // Access environment variables through Expo Constants
      const apiKey = Constants.expoConfig?.extra?.googleApiKey;
      const calendarId = Constants.expoConfig?.extra?.googleCalendarId;

      console.log('API Key available:', !!apiKey);
      console.log('Calendar ID available:', !!calendarId);

      if (!apiKey || !calendarId) {
        throw new Error('Google Calendar API key or Calendar ID not configured');
      }

      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime&key=${apiKey}`;

      console.log('Fetching from URL:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch events: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched events:', data.items?.length || 0);
      setEvents(data.items || []);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Format date and time for display
  const formatEventDateTime = (event: CalendarEvent) => {
    const startDate = event.start.dateTime || event.start.date;
    const endDate = event.end.dateTime || event.end.date;
    
    if (!startDate) return '';

    const start = new Date(startDate);
    const end = new Date(endDate || startDate);
    
    // Check if it's an all-day event
    if (event.start.date && !event.start.dateTime) {
      return start.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }

    // Format time for regular events
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };

    return {
      date: start.toLocaleDateString('en-US', dateOptions),
      time: start.toLocaleTimeString('en-US', timeOptions),
      endTime: end.toLocaleTimeString('en-US', timeOptions),
    };
  };

  // Extract Luma link from description or location
  const extractLumaLink = (event: CalendarEvent): string | null => {
    const description = event.description || '';
    const location = event.location || '';
    
    // Look for Luma links in description or location
    const lumaRegex = /https?:\/\/lu\.ma\/[^\s)]+/i;
    const descriptionMatch = description.match(lumaRegex);
    const locationMatch = location.match(lumaRegex);
    
    return descriptionMatch?.[0] || locationMatch?.[0] || null;
  };

  // Handle event press - navigate to event detail page
  const handleEventPress = (event: CalendarEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Navigate to event detail page with event data
    router.push({
      pathname: '/event-detail',
      params: { event: JSON.stringify(event) }
    });
  };

  // Render event card
  const renderEventCard = (event: CalendarEvent, index: number) => {
    const dateTime = formatEventDateTime(event);
    const lumaLink = extractLumaLink(event);
    
    return (
      <TouchableOpacity
        key={event.id}
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: 20,
          padding: 24,
          marginBottom: 16,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
          elevation: 8,
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.06)',
        }}
        onPress={() => handleEventPress(event)}
        activeOpacity={0.8}
      >
        {/* Event Title */}
        <Text
          style={{
            fontSize: 20,
            fontWeight: '700',
            color: colors.primaryText,
            marginBottom: 12,
            fontFamily: 'System',
            lineHeight: 24,
            letterSpacing: -0.3,
          }}
        >
          {event.summary}
        </Text>

        {/* Date and Time */}
        {typeof dateTime === 'object' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.accent,
                marginRight: 12,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.accent,
                marginRight: 16,
                fontFamily: 'System',
              }}
            >
              {dateTime.date}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: colors.secondaryText,
                fontFamily: 'System',
              }}
            >
              {dateTime.time}
              {dateTime.endTime !== dateTime.time && ` - ${dateTime.endTime}`}
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.accent,
                marginRight: 12,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: colors.accent,
                fontFamily: 'System',
              }}
            >
              {dateTime}
            </Text>
          </View>
        )}

        {/* Location */}
        {event.location && (
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
            <Text
              style={{
                fontSize: 16,
                marginRight: 12,
                marginTop: 1,
              }}
            >
              📍
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.secondaryText,
                fontFamily: 'System',
                flex: 1,
                lineHeight: 22,
              }}
            >
              {event.location}
            </Text>
          </View>
        )}

        {/* Luma Link Indicator */}
        {lumaLink && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 12,
              paddingTop: 12,
              borderTopWidth: 0.5,
              borderTopColor: colors.border,
            }}
          >
            <View
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 8,
                marginRight: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                }}
              >
                Luma
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                color: colors.tertiaryText,
                fontFamily: 'System',
              }}
            >
              Event link available
            </Text>
          </View>
        )}

        {/* Tap indicator */}
        <View
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: colors.tertiaryText,
            }}
          >
            →
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 80,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text
          style={{
            fontSize: 40,
            fontWeight: '600',
            color: colors.primaryText,
            fontFamily: Fonts.header,
            textAlign: 'left',
            letterSpacing: 0.5,
            lineHeight: 48,
            marginBottom: 32,
            paddingLeft: 4,
          }}
        >
          Upcoming Events
        </Text>

        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 120,
            }}
          >
            <ActivityIndicator
              size="large"
              color={colors.accent}
              style={{ marginBottom: 20 }}
            />
            <Text
              style={{
                fontSize: 17,
                color: colors.secondaryText,
                fontFamily: Fonts.body,
              }}
            >
              Loading events...
            </Text>
          </View>
        ) : error ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 120,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '600',
                color: colors.primaryText,
                marginBottom: 12,
                fontFamily: Fonts.body,
                textAlign: 'center',
              }}
            >
              Unable to load events
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.secondaryText,
                textAlign: 'center',
                marginBottom: 32,
                fontFamily: Fonts.body,
                lineHeight: 22,
                paddingHorizontal: 20,
              }}
            >
              {error}
            </Text>
            <TouchableOpacity
              onPress={fetchEvents}
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: 24,
                paddingVertical: 14,
                borderRadius: 14,
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  fontFamily: Fonts.body,
                }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : events.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 120,
            }}
          >
            <Text
              style={{
                fontSize: 64,
                marginBottom: 24,
              }}
            >
              📅
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.primaryText,
                marginBottom: 12,
                fontFamily: Fonts.body,
                textAlign: 'center',
              }}
            >
              No events this week
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: colors.secondaryText,
                textAlign: 'center',
                fontFamily: Fonts.body,
              }}
            >
              Enjoy your free time! 🎉
            </Text>
          </View>
        ) : (
          <>
            {/* Islamic Greeting Summary */}
            <View
              style={{
                marginBottom: 32,
                paddingHorizontal: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  fontWeight: '600',
                  color: colors.accent,
                  marginBottom: 8,
                  fontFamily: Fonts.header,
                }}
              >
                السلام عليكم
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '500',
                  color: colors.secondaryText,
                  fontFamily: Fonts.body,
                  lineHeight: 34,
                }}
              >
                {events.length === 0 
                  ? "May Allah bless your free time this week! 🤲" 
                  : events.length === 1
                  ? "You have 1 blessed gathering coming up this week, insha'Allah! 🌙"
                  : `You have ${events.length} blessed gatherings coming up this week, insha'Allah! 🌙`
                }
              </Text>
            </View>

            {/* Events List */}
            {events.map((event, index) => renderEventCard(event, index))}
          </>
        )}
      </ScrollView>
    </View>
  );
} 