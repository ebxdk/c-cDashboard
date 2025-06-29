import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Linking,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { CalendarEvent } from '../contexts/CalendarContext';

interface EventLink {
  type: string;
  url: string;
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';

  // Parse the event data from params
  const event: CalendarEvent = params.event ? JSON.parse(params.event as string) : null;

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    cardBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#666666',
    tertiaryText: isDarkMode ? '#636366' : '#999999',
    accent: '#5AC8FA',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    shadow: isDarkMode ? '#000000' : '#000000',
  };

  if (!event) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: colors.primaryText }}>Event not found</Text>
      </View>
    );
  }

  // Format date and time for display
  const formatEventDateTime = (event: CalendarEvent) => {
    const startDate = event.start.dateTime || event.start.date;
    const endDate = event.end.dateTime || event.end.date;
    
    if (!startDate) return { date: '', time: '', duration: '' };

    const start = new Date(startDate);
    const end = new Date(endDate || startDate);
    
    // Check if it's an all-day event
    if (event.start.date && !event.start.dateTime) {
      return {
        date: start.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: 'All day',
        duration: '',
      };
    }

    // Calculate duration
    const durationMs = end.getTime() - start.getTime();
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    let duration = '';
    if (durationHours > 0) {
      duration = `${durationHours}h`;
      if (durationMinutes > 0) {
        duration += ` ${durationMinutes}m`;
      }
    } else if (durationMinutes > 0) {
      duration = `${durationMinutes}m`;
    }

    return {
      date: start.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: `${start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })} - ${end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })}`,
      duration,
    };
  };

  // Extract links from description
  const extractLinks = (event: CalendarEvent): EventLink[] => {
    const description = event.description || '';
    const links: EventLink[] = [];
    
    // Luma links
    const lumaRegex = /https?:\/\/lu\.ma\/[^\s)]+/gi;
    const lumaMatches = description.match(lumaRegex);
    if (lumaMatches) {
      lumaMatches.forEach(link => {
        links.push({ type: 'Luma', url: link });
      });
    }
    
    // Google Meet links
    const meetRegex = /https?:\/\/meet\.google\.com\/[^\s)]+/gi;
    const meetMatches = description.match(meetRegex);
    if (meetMatches) {
      meetMatches.forEach(link => {
        links.push({ type: 'Google Meet', url: link });
      });
    }
    
    // Zoom links
    const zoomRegex = /https?:\/\/[^\s]*zoom[^\s]*/gi;
    const zoomMatches = description.match(zoomRegex);
    if (zoomMatches) {
      zoomMatches.forEach(link => {
        links.push({ type: 'Zoom', url: link });
      });
    }
    
    // Generic links
    const genericRegex = /https?:\/\/[^\s]+/gi;
    const genericMatches = description.match(genericRegex);
    if (genericMatches) {
      genericMatches.forEach(link => {
        if (!lumaMatches?.includes(link) && !meetMatches?.includes(link) && !zoomMatches?.includes(link)) {
          links.push({ type: 'Link', url: link });
        }
      });
    }
    
    return links;
  };

  const handleLinkPress = (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  };

  const dateTime = formatEventDateTime(event);
  const links = extractLinks(event);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 120,
          paddingHorizontal: 24,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Title */}
        <View style={{ marginBottom: 32 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '700',
              color: colors.primaryText,
              fontFamily: 'System',
              lineHeight: 38,
              letterSpacing: -0.6,
            }}
          >
            {event.summary}
          </Text>
        </View>

        {/* Date & Time Section */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: colors.cardBackground,
              borderRadius: 20,
              padding: 24,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDarkMode ? 0.3 : 0.12,
              shadowRadius: 12,
              elevation: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: colors.accent,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <Text style={{ fontSize: 18, color: '#FFFFFF' }}>📅</Text>
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.primaryText,
                  fontFamily: 'System',
                  letterSpacing: -0.2,
                }}
              >
                Date & Time
              </Text>
            </View>
            
            <View style={{ marginLeft: 52 }}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '500',
                  color: colors.primaryText,
                  fontFamily: 'System',
                  marginBottom: 6,
                  letterSpacing: -0.1,
                }}
              >
                {dateTime.date}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.secondaryText,
                  fontFamily: 'System',
                  marginBottom: dateTime.duration ? 6 : 0,
                  letterSpacing: -0.1,
                }}
              >
                {dateTime.time}
              </Text>
              {dateTime.duration && (
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.tertiaryText,
                    fontFamily: 'System',
                    letterSpacing: -0.1,
                  }}
                >
                  Duration: {dateTime.duration}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Location Section */}
        {event.location && (
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 20,
                padding: 24,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDarkMode ? 0.3 : 0.12,
                shadowRadius: 12,
                elevation: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#FF3B30',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}
                >
                  <Text style={{ fontSize: 18, color: '#FFFFFF' }}>📍</Text>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.primaryText,
                    fontFamily: 'System',
                    letterSpacing: -0.2,
                  }}
                >
                  Location
                </Text>
              </View>
              
              <View style={{ marginLeft: 52 }}>
                <Text
                  style={{
                    fontSize: 17,
                    color: colors.primaryText,
                    fontFamily: 'System',
                    lineHeight: 24,
                    letterSpacing: -0.1,
                  }}
                >
                  {event.location}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Links Section */}
        {links.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 20,
                padding: 24,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDarkMode ? 0.3 : 0.12,
                shadowRadius: 12,
                elevation: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#34C759',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}
                >
                  <Text style={{ fontSize: 18, color: '#FFFFFF' }}>🔗</Text>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.primaryText,
                    fontFamily: 'System',
                    letterSpacing: -0.2,
                  }}
                >
                  Links
                </Text>
              </View>
              
              <View style={{ marginLeft: 52 }}>
                {links.map((link, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleLinkPress(link.url)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 16,
                      borderBottomWidth: index < links.length - 1 ? 0.5 : 0,
                      borderBottomColor: colors.border,
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '500',
                          color: colors.accent,
                          fontFamily: 'System',
                          marginBottom: 4,
                          letterSpacing: -0.1,
                        }}
                      >
                        {link.type}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: colors.tertiaryText,
                          fontFamily: 'System',
                          letterSpacing: -0.1,
                        }}
                        numberOfLines={1}
                      >
                        {link.url}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 18,
                        color: colors.tertiaryText,
                        marginLeft: 16,
                      }}
                    >
                      →
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Description Section */}
        {event.description && (
          <View style={{ marginBottom: 32 }}>
            <View
              style={{
                backgroundColor: colors.cardBackground,
                borderRadius: 20,
                padding: 24,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDarkMode ? 0.3 : 0.12,
                shadowRadius: 12,
                elevation: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#AF52DE',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}
                >
                  <Text style={{ fontSize: 18, color: '#FFFFFF' }}>📝</Text>
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: colors.primaryText,
                    fontFamily: 'System',
                    letterSpacing: -0.2,
                  }}
                >
                  Description
                </Text>
              </View>
              
              <View style={{ marginLeft: 52 }}>
                <Text
                  style={{
                    fontSize: 17,
                    color: colors.primaryText,
                    fontFamily: 'System',
                    lineHeight: 26,
                    letterSpacing: -0.1,
                  }}
                >
                  {event.description.replace(/https?:\/\/[^\s]+/g, '').trim()}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
} 