import Constants from 'expo-constants';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CalendarEvent {
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

interface CalendarContextType {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  getNextUpcomingEvent: () => CalendarEvent | null;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

interface CalendarProviderProps {
  children: React.ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock events for testing when API is not configured
  const getMockEvents = (): CalendarEvent[] => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0); // 7 PM tomorrow
    
    const dayAfter = new Date(now);
    dayAfter.setDate(now.getDate() + 2);
    dayAfter.setHours(14, 30, 0, 0); // 2:30 PM day after tomorrow
    
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 5);
    nextWeek.setHours(0, 0, 0, 0); // All day event
    
    return [
      {
        id: 'mock-1',
        summary: 'Community Iftar',
        description: 'Join us for a blessed iftar gathering with the community. Bring your family and friends!',
        location: 'Islamic Center of Greater Cincinnati',
        start: {
          dateTime: tomorrow.toISOString(),
        },
        end: {
          dateTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        },
      },
      {
        id: 'mock-2',
        summary: 'Friday Prayer (Jummah)',
        description: 'Weekly congregational Friday prayer',
        location: 'Masjid Al-Noor',
        start: {
          dateTime: dayAfter.toISOString(),
        },
        end: {
          dateTime: new Date(dayAfter.getTime() + 45 * 60 * 1000).toISOString(), // 45 minutes later
        },
      },
      {
        id: 'mock-3',
        summary: 'Islamic Study Circle',
        description: 'Weekly study of Quran and Hadith',
        location: 'Community Center',
        start: {
          date: nextWeek.toISOString().split('T')[0], // All day event
        },
        end: {
          date: nextWeek.toISOString().split('T')[0],
        },
      },
    ];
  };

  // Get next 7 days from today
  const getNext7Days = () => {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOf7Days = new Date(startOfToday);
    endOf7Days.setDate(startOfToday.getDate() + 7);
    endOf7Days.setHours(23, 59, 59, 999);

    return {
      start: startOfToday.toISOString(),
      end: endOf7Days.toISOString(),
    };
  };

  // Fetch events from Google Calendar
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const { start, end } = getNext7Days();
      
      // Access environment variables through Expo Constants
      const apiKey = Constants.expoConfig?.extra?.googleApiKey;
      const calendarId = Constants.expoConfig?.extra?.googleCalendarId;

      if (!apiKey || !calendarId) {
        console.log('Google Calendar API not configured, using mock data');
        // Use mock data when API is not configured
        setTimeout(() => {
          setEvents(getMockEvents());
          setLoading(false);
        }, 1000); // Simulate loading time
        return;
      }

      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime&key=${apiKey}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch events: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched events for next 7 days:', data.items?.length || 0);
      setEvents(data.items || []);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Get the next upcoming event
  const getNextUpcomingEvent = (): CalendarEvent | null => {
    if (events.length === 0) return null;

    const now = new Date();
    
    // Filter events that haven't started yet
    const upcomingEvents = events.filter(event => {
      const eventStart = new Date(event.start.dateTime || event.start.date || '');
      
      // For all-day events, compare with start of today
      if (event.start.date && !event.start.dateTime) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventStart >= today;
      }
      
      // For timed events, compare with current time
      return eventStart > now;
    });

    // Return the first upcoming event (events are already sorted by start time)
    return upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  };

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const value: CalendarContextType = {
    events,
    loading,
    error,
    fetchEvents,
    getNextUpcomingEvent,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}; 