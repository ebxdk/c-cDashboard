import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Linking,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { BottomSheet } from '../components/BottomSheet';
import { Fonts } from '../constants/Fonts';
import { CalendarEvent, useCalendar } from '../contexts/CalendarContext';
import { generateAvatarFromEvent, UserAvatar } from '../utils/avatarUtils';

interface EventSummaryCard {
  id: string;
  avatar: UserAvatar;
  dateRange: string;
  duration: string;
  title: string;
  description: string;
  location?: string;
  event: CalendarEvent;
}

export default function CalendarPage() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';
  const { events, loading, error, fetchEvents } = useCalendar();
  const [summaryCards, setSummaryCards] = useState<EventSummaryCard[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string>('off-white');

  // Load saved background preference
  useEffect(() => {
    const loadBackgroundPreference = async () => {
      try {
        const savedBackground = await AsyncStorage.getItem('selectedBackground');
        setSelectedBackground(savedBackground || 'off-white');
      } catch (error) {
        console.log('Error loading background preference:', error);
        setSelectedBackground('off-white');
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
        return isDarkMode ? '#1C1C1E' : '#FFFFFF';
      case 'off-white':
        return isDarkMode ? '#000000' : '#FFFAF2';
      case 'pattern-arabic':
        return isDarkMode ? '#1C1C1E' : '#FFFAF2';
      default:
        // For gradients, respect dark mode
        return isDarkMode ? '#1C1C1E' : '#FFFAF2';
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

  const colors = {
    background: getBackgroundColor(),
    cardBackground: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? 
                   (isDarkMode ? '#2C2C2E' : '#F8F9FA') : (isDarkMode ? '#1C1C1E' : '#FFFFFF'),
    primaryText: (selectedBackground === 'white' || selectedBackground === 'off-white' || selectedBackground === 'pattern-arabic') ? 
                (isDarkMode ? '#FFFFFF' : '#000000') : (isDarkMode ? '#FFFFFF' : '#000000'),
    secondaryText: isDarkMode ? '#8E8E93' : '#666666',
    tertiaryText: isDarkMode ? '#636366' : '#8E8E93',
    accent: '#007AFF',
    shadow: isDarkMode ? '#000000' : '#000000',
    border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  };

  // Handle event press - open modal
  const handleEventPress = (event: CalendarEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedEvent(event);
    setModalVisible(true);
  };

  // Close modal safely
  const closeModal = () => {
    setModalVisible(false);
    // Clear selected event after a small delay to avoid crashes
    setTimeout(() => {
      setSelectedEvent(null);
    }, 300);
  };

  // Format date and time for display in modal
  const formatEventDateTime = (event: CalendarEvent) => {
    const startDate = event.start.dateTime || event.start.date;
    const endDate = event.end.dateTime || event.end.date;
    
    if (!startDate) return '';

    const start = new Date(startDate);
    const end = new Date(endDate || startDate);
    
    // Check if it's an all-day event
    if (event.start.date && !event.start.dateTime) {
      return start.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return {
      date: start.toLocaleDateString('en-US', dateOptions),
      time: start.toLocaleTimeString('en-US', timeOptions),
      endTime: end.toLocaleTimeString('en-US', timeOptions),
    };
  };

  // Extract links from description
  const extractLinks = (event: CalendarEvent) => {
    const description = event.description || '';
    const links: { type: string; url: string }[] = [];
    
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
    
    return links;
  };

  const handleLinkPress = (url: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  };

  // Render avatar component
  const renderAvatar = (avatar: UserAvatar, size: number = 60) => {
    if (avatar.imageUrl) {
      return (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            backgroundColor: avatar.backgroundColor,
          }}
        >
          <Image
            source={{ uri: avatar.imageUrl }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
            onError={(error) => {
              console.log('Failed to load profile image:', error.nativeEvent.error);
            }}
          />
        </View>
      );
    }

    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: avatar.backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: size * 0.4,
            fontWeight: '600',
            color: avatar.textColor,
            fontFamily: 'System',
          }}
        >
          {avatar.value}
        </Text>
      </View>
    );
  };

  // Create summary cards from actual events (instant, synchronous)
  const createSummaryCards = (events: CalendarEvent[]): EventSummaryCard[] => {
    if (events.length === 0) return [];

    const cards: EventSummaryCard[] = [];

    for (const event of events) {
      const avatar = generateAvatarFromEvent(event); // Now synchronous!
      const startDate = new Date(event.start.dateTime || event.start.date || '');
      const endDate = new Date(event.end.dateTime || event.end.date || startDate);

      // Calculate duration
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Format date range
      const formatDateRange = () => {
        const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        
        if (diffDays <= 1 || startDay === endDay) {
          return `${startMonth} ${startDay}`;
        } else {
          return `${startMonth} ${startDay} - ${endDay}`;
        }
      };

      // Create description with time information
      const createDescription = (event: CalendarEvent) => {
        // Check if it's an all-day event
        if (event.start.date && !event.start.dateTime) {
          return `All day event 📅`;
        }

        // Format time for regular events
        const timeOptions: Intl.DateTimeFormatOptions = {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        };

        const startTime = startDate.toLocaleTimeString('en-US', timeOptions);
        const endTime = endDate.toLocaleTimeString('en-US', timeOptions);

        // Calculate duration in hours and minutes
        const durationMs = endDate.getTime() - startDate.getTime();
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        // Create time description with emojis
        if (startTime === endTime) {
          return `${startTime} ⏰`;
        } else if (durationHours === 0 && durationMinutes <= 60) {
          return `${startTime} - ${endTime} ⏱️`;
        } else if (durationHours === 1) {
          return `${startTime} - ${endTime} (1 hour) ⏰`;
        } else if (durationHours > 1) {
          return `${startTime} - ${endTime} (${durationHours} hours) ⏰`;
        } else {
          return `${startTime} - ${endTime} ⏱️`;
        }
      };

      // Format duration
      const duration = diffDays > 1 ? `${diffDays}d event` : '';

      cards.push({
        id: event.id,
        avatar,
        dateRange: formatDateRange(),
        duration,
        title: event.summary,
        description: createDescription(event),
        location: event.location,
        event: event
      });
    }

    return cards;
  };

  // Load summary cards when events change (now instant!)
  useEffect(() => {
    const cards = createSummaryCards(events);
    setSummaryCards(cards);
  }, [events]);

  // Render summary card matching the screenshot
  const renderSummaryCard = (card: EventSummaryCard, index: number) => {
    return (
      <TouchableOpacity
        key={card.id}
        style={{
          backgroundColor: colors.cardBackground,
          borderRadius: 20,
          padding: 20,
          marginBottom: 16,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
          borderWidth: 1,
          borderColor: colors.border,
        }}
        onPress={() => handleEventPress(card.event)}
        activeOpacity={0.8}
      >
        {/* Header with avatar and menu */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 16,
        }}>
          {/* Profile Avatar */}
          {renderAvatar(card.avatar, 60)}
          
          <View style={{ flex: 1 }} />
          
          {/* Three dots menu */}
          <TouchableOpacity style={{
            padding: 4,
          }}>
            <Text style={{
            fontSize: 20,
              color: colors.tertiaryText,
              fontWeight: '600',
            }}>
              ⋯
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View>
          {/* Title - use actual event title */}
          <Text style={{
            fontSize: 24,
            fontWeight: '600',
            color: colors.primaryText,
            fontFamily: 'System',
            marginBottom: 6,
            lineHeight: 28,
          }}>
            {card.title}
        </Text>

          {/* Host Information */}
          {card.avatar.displayName && (
            <Text style={{
              fontSize: 14,
              color: colors.secondaryText,
              fontFamily: 'System',
              marginBottom: 8,
              fontWeight: '500',
            }}>
              Hosted by {card.avatar.displayName}
            </Text>
          )}

          {/* Date and duration */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <Text style={{
                fontSize: 16,
                fontWeight: '600',
              color: colors.primaryText,
                fontFamily: 'System',
            }}>
              {card.dateRange}
            </Text>
            {card.duration && (
              <>
                <View style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.tertiaryText,
                  marginHorizontal: 8,
                }} />
                <Text style={{
                fontSize: 16,
                  color: colors.tertiaryText,
                fontFamily: 'System',
                }}>
                  {card.duration}
            </Text>
              </>
            )}
          </View>

          {/* Description with emojis */}
          <Text style={{
                fontSize: 16,
            color: colors.tertiaryText,
                fontFamily: 'System',
                lineHeight: 22,
          }}>
            {card.description}
            </Text>

          {/* Location if available */}
          {card.location && (
            <Text style={{
                fontSize: 14,
                color: colors.tertiaryText,
                fontFamily: 'System',
              marginTop: 4,
              fontStyle: 'italic',
            }}>
              📍 {card.location}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCalendarContent = () => (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 80,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Simple Page Header */}
        <View style={{
          marginBottom: 32,
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 36,
                fontWeight: '700',
                color: colors.primaryText,
                fontFamily: 'System',
                letterSpacing: -0.5,
              }}>
                My Plans
              </Text>
            </View>
            
            {/* Subscribe Button */}
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // TODO: Add Google Calendar subscription functionality
                const calendarId = 'your-calendar-id@gmail.com'; // Replace with actual calendar ID
                const subscribeUrl = `https://calendar.google.com/calendar/u/0?cid=${encodeURIComponent(calendarId)}`;
                Linking.openURL(subscribeUrl);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.cardBackground,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: colors.shadow,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              activeOpacity={0.7}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: '#4285F4',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}>
                <Text style={{ fontSize: 12 }}>📅</Text>
              </View>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: colors.primaryText,
                fontFamily: Fonts.body,
              }}>
                Subscribe
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text style={{
            fontSize: 16,
            color: colors.secondaryText,
            fontFamily: 'System',
          }}>
            Upcoming Islamic events from Revert Reach, key Islamic days, and important reminders
        </Text>
        </View>

        {loading ? (
          <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 120,
          }}>
            <ActivityIndicator
              size="large"
              color={colors.accent}
              style={{ marginBottom: 20 }}
            />
            <Text style={{
                fontSize: 17,
                color: colors.secondaryText,
                fontFamily: Fonts.body,
            }}>
              Loading events...
            </Text>
          </View>
        ) : error ? (
          <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 120,
          }}>
            <Text style={{
                fontSize: 64,
                marginBottom: 24,
            }}>
              ⚠️
            </Text>
            <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.primaryText,
                marginBottom: 12,
                fontFamily: Fonts.body,
                textAlign: 'center',
            }}>
              Unable to load events
            </Text>
            <Text style={{
                fontSize: 17,
                color: colors.secondaryText,
                textAlign: 'center',
                fontFamily: Fonts.body,
                marginBottom: 24,
            }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={fetchEvents}
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
              }}
              activeOpacity={0.8}
            >
              <Text style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '600',
                  fontFamily: Fonts.body,
              }}>
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : events.length === 0 ? (
          <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingTop: 120,
          }}>
            <Text style={{
                fontSize: 64,
                marginBottom: 24,
            }}>
              📅
            </Text>
            <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: colors.primaryText,
                marginBottom: 12,
                fontFamily: Fonts.body,
                textAlign: 'center',
            }}>
              No events in the next 7 days
            </Text>
            <Text style={{
                fontSize: 17,
                color: colors.secondaryText,
                textAlign: 'center',
                fontFamily: Fonts.body,
            }}>
              Enjoy your free time! 🎉
            </Text>
          </View>
        ) : (
          <>
            {/* Summary Cards */}
            {summaryCards.map((card, index) => renderSummaryCard(card, index))}
          </>
        )}
      </ScrollView>

      {/* Event Details Bottom Sheet */}
      <BottomSheet
        visible={modalVisible}
        onClose={closeModal}
        snapPoint={45}
        enableBackdropDismiss={true}
        enableSwipeToDismiss={true}
        backgroundColor={colors.cardBackground}
        handleColor={colors.tertiaryText}
        horizontalMargin={12}
        bottomMargin={24}
      >
        <View style={{
          flex: 1,
          paddingHorizontal: 20,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 8,
            paddingBottom: 24,
            position: 'relative',
          }}>
            <TouchableOpacity
              onPress={closeModal}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.19)' : 'rgba(0, 0, 0, 0.07)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: 13,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.62)' : 'rgba(0, 0, 0, 0.51)',
                fontWeight: '700',
                lineHeight: 13,
              }}>
                ✕
              </Text>
            </TouchableOpacity>
            <Text style={{
              fontSize: 28,
              fontWeight: '700',
              color: colors.primaryText,
              fontFamily: Fonts.body,
              letterSpacing: -0.6,
              marginTop: 16,
            }}>
              Event Details
            </Text>
          </View>

          {selectedEvent && (
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                padding: 16,
                paddingBottom: 20,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Action Buttons */}
              <View style={{ gap: 16 }}>
                
                {/* Main Google Meet Button (if available) */}
                {(() => {
                  const links = extractLinks(selectedEvent);
                  const googleMeetLink = links.find(link => link.type === 'Google Meet');
                  
                  if (googleMeetLink) {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          handleLinkPress(googleMeetLink.url);
                          closeModal();
                        }}
                        style={{
                          backgroundColor: '#4285F4',
                          borderRadius: 16,
                          padding: 20,
                          alignItems: 'center',
                          shadowColor: colors.shadow,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.15,
                          shadowRadius: 8,
                          elevation: 8,
                        }}
                        activeOpacity={0.9}
                      >
                        <View style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginBottom: 12,
                        }}>
                          <Text style={{ fontSize: 24 }}>📹</Text>
                        </View>
                        <Text style={{
                          fontSize: 18,
                          fontWeight: '700',
                          color: '#FFFFFF',
                          marginBottom: 4,
                          fontFamily: Fonts.body,
                        }}>
                          Join Google Meet
                        </Text>
                        <Text style={{
                          fontSize: 14,
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontFamily: Fonts.body,
                          textAlign: 'center',
                        }}>
                          Tap to join the meeting
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })()}

                {/* Other Meeting Links */}
                {(() => {
                  const links = extractLinks(selectedEvent);
                  const otherLinks = links.filter(link => link.type !== 'Google Meet');
                  return otherLinks.map((link, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        handleLinkPress(link.url);
                        closeModal();
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: colors.cardBackground,
                        borderRadius: 12,
                        padding: 16,
                        shadowColor: colors.shadow,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.accent,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                      }}>
                        <Text style={{ fontSize: 18 }}>
                          {link.type === 'Zoom' ? '💻' : 
                           link.type === 'Luma' ? '🎟️' : '🔗'}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: colors.primaryText,
                          marginBottom: 2,
                          fontFamily: Fonts.body,
                        }}>
                          {link.type === 'Zoom' ? 'Join Zoom Meeting' :
                           link.type === 'Luma' ? 'RSVP on Luma' : 'Open Link'}
                        </Text>
                        <Text style={{
                          fontSize: 13,
                          color: colors.secondaryText,
                          fontFamily: Fonts.body,
                        }}>
                          Tap to open
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ));
                })()}

                {/* Location Button */}
                {selectedEvent.location && (
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      const encodedLocation = encodeURIComponent(selectedEvent.location || '');
                      Linking.openURL(`https://maps.apple.com/?q=${encodedLocation}`);
                      closeModal();
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.cardBackground,
                      borderRadius: 12,
                      padding: 16,
                      shadowColor: colors.shadow,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#34C759',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}>
                      <Text style={{ fontSize: 18 }}>📍</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: colors.primaryText,
                        marginBottom: 2,
                        fontFamily: Fonts.body,
                      }}>
                        Open in Maps
                      </Text>
                      <Text style={{
                        fontSize: 13,
                        color: colors.secondaryText,
                        fontFamily: Fonts.body,
                      }} numberOfLines={2}>
                        {selectedEvent.location}
              </Text>
            </View>
                  </TouchableOpacity>
                )}

                {/* Google Calendar Button (Big) */}
                {selectedEvent.htmlLink && (
                  <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                    <TouchableOpacity
                      onPress={() => {
                        handleLinkPress(selectedEvent.htmlLink!);
                        closeModal();
                      }}
                      style={{
                        borderRadius: 24,
                        padding: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: colors.shadow,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 8,
                        elevation: 8,
                        width: 280,
                        height: 220,
                        overflow: 'hidden',
                      }}
                      activeOpacity={0.9}
                    >
                    <LinearGradient
                      colors={['#A8C8E8', '#8FB5D8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    />
                    <View style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 20,
                    }}>
                      <Text style={{ fontSize: 28 }}>📅</Text>
                    </View>
                    <Text style={{
                      fontSize: 20,
                      fontWeight: '700',
                      color: '#FFFFFF',
                      marginBottom: 6,
                      fontFamily: Fonts.body,
                      textAlign: 'center',
                    }}>
                      View in Google Calendar
                    </Text>
                    <Text style={{
                      fontSize: 15,
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontFamily: Fonts.body,
                      textAlign: 'center',
                      paddingHorizontal: 20,
                      lineHeight: 20,
                    }}>
                      RSVP and view event details
                    </Text>
                  </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </BottomSheet>
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
      {renderCalendarContent()}
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
          opacity: isDarkMode ? 0.05 : 0.08,
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
      {renderCalendarContent()}
    </View>
  );
} 