import { IconSymbol } from '@/components/ui/IconSymbol';
import { Fonts } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import chatApi, { CompanionRelationship, ChatMessage, UserProfile } from '../lib/chatApi';

const { width: screenWidth } = Dimensions.get('window');

// Avatar data for companion chat
const avatarData: { [key: string]: any } = {
  'Omar Hassan': require('../assets/images/memoji2.png'),
  'Bilal Ahmed': require('../assets/images/memoji1.png'),
};

export default function CompanionChatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDarkMode = colorScheme === 'dark';
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');

  // Supabase integration states
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentRelationship, setCurrentRelationship] = useState<CompanionRelationship | null>(null);
  const [relationships, setRelationships] = useState<CompanionRelationship[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data and relationships
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load current user profile
      const userProfile = await chatApi.userProfile.getCurrentProfile();
      setCurrentUser(userProfile);
      
      // Load user's companion relationships
      const userRelationships = await chatApi.companion.getUserRelationships();
      setRelationships(userRelationships);
      
      // Set first relationship as current if available
      if (userRelationships.length > 0) {
        setCurrentRelationship(userRelationships[0]);
        await loadRelationshipMessages(userRelationships[0].id);
      } else {
        // Create a sample relationship for demo purposes
        await createSampleRelationship();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load companion data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createSampleRelationship = async () => {
    try {
      // Create a sample mentor-mentee relationship
      const relationshipId = await chatApi.companion.createRelationship(
        'mentor-id', // This would be a real mentor ID
        currentUser?.id || 'current-user-id',
        {
          days: ['Tuesday', 'Friday'],
          time: '09:00',
          timezone: 'UTC'
        }
      );
      
      if (relationshipId) {
        // Reload relationships
        const userRelationships = await chatApi.companion.getUserRelationships();
        setRelationships(userRelationships);
        
        if (userRelationships.length > 0) {
          setCurrentRelationship(userRelationships[0]);
          await loadRelationshipMessages(userRelationships[0].id);
        }
      }
    } catch (error) {
      console.error('Error creating sample relationship:', error);
    }
  };

  const loadRelationshipMessages = async (relationshipId: string) => {
    try {
      // For companion chat, we'll use the relationship ID as the room ID
      const relationshipMessages = await chatApi.messages.getRoomMessages(relationshipId);
      setMessages(relationshipMessages);
      
      // If no messages exist, create a welcome message
      if (relationshipMessages.length === 0) {
        await createWelcomeMessage(relationshipId);
      }
    } catch (error) {
      console.error('Error loading relationship messages:', error);
    }
  };

  const createWelcomeMessage = async (relationshipId: string) => {
    try {
      await chatApi.messages.sendMessage(
        relationshipId,
        "Assalamu alaikum! Welcome to your personal companion chat. I'm here to support you on your Islamic journey.",
        'system'
      );
    } catch (error) {
      console.error('Error creating welcome message:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  // Real-time subscriptions for companion chat
  useEffect(() => {
    if (currentRelationship) {
      // Subscribe to real-time messages for this relationship
      const channel = chatApi.realtime.subscribeToRoomMessages(
        currentRelationship.id,
        (newMessage) => {
          // Only add messages that aren't already in the list
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (!exists) {
              return [...prev, newMessage];
            }
            return prev;
          });
        }
      );

      return () => {
        chatApi.realtime.unsubscribe(`room:${currentRelationship.id}`);
      };
    }
  }, [currentRelationship]);

  // Slack-style color scheme
  const slackColors = {
    background: isDarkMode ? '#1A1D21' : '#FFFFFF',
    headerBackground: isDarkMode ? '#350D36' : '#4A154B',
    sidebarBackground: isDarkMode ? '#1A1D21' : '#F8F8F8',
    primaryText: isDarkMode ? '#FFFFFF' : '#1D1C1D',
    secondaryText: isDarkMode ? '#ABABAD' : '#616061',
    tertiaryText: isDarkMode ? '#868686' : '#868686',
    channelText: '#FFFFFF',
    inputBackground: isDarkMode ? '#222529' : '#FFFFFF',
    inputBorder: isDarkMode ? '#565856' : '#E1E1E1',
    separatorColor: isDarkMode ? '#565856' : '#E1E1E1',
    systemMessageText: isDarkMode ? '#ABABAD' : '#616061',
    channelColor: '#4A154B',
    messageHover: isDarkMode ? '#2C2D30' : '#F8F8F8',
    onlineGreen: '#007A5A',
    mentionBackground: isDarkMode ? '#2C2D30' : '#FFF2CC',
    threadBorder: isDarkMode ? '#565856' : '#E1E1E1',
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentRelationship || !currentUser) return;

    const messageContent = inputText.trim();
    setInputText('');

    try {
      // Send message to Supabase
      const messageId = await chatApi.messages.sendMessage(
        currentRelationship.id,
        messageContent,
        'text'
      );

      if (messageId) {
        // Message will be added via real-time subscription
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        // Scroll to bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const getMessageAvatar = (message: ChatMessage) => {
    if (message.sender_id === currentUser?.id) {
      return avatarData['Bilal Ahmed']; // Current user avatar
    } else {
      return avatarData['Omar Hassan']; // Mentor avatar
    }
  };

  const getMessageSenderName = (message: ChatMessage) => {
    if (message.sender_id === currentUser?.id) {
      return currentUser?.full_name || 'You';
    } else {
      return currentRelationship?.mentor_profile?.full_name || 'Mentor';
    }
  };

  const isCurrentUserMessage = (message: ChatMessage) => {
    return message.sender_id === currentUser?.id;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: slackColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.loadingText, { color: slackColors.primaryText }]}>Loading Companion Chat...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: slackColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: slackColors.headerBackground }]}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: slackColors.channelText }]}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.channelName, { color: slackColors.channelText }]}>
            {currentRelationship?.mentor_profile?.full_name || 'Mentor'}
          </Text>
          <Text style={[styles.channelStatus, { color: slackColors.channelText }]}>
            ● Online
          </Text>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <Text style={[styles.moreButtonText, { color: slackColors.channelText }]}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View key={message.id} style={styles.messageContainer}>
            {message.message_type === 'system' ? (
              <View style={styles.systemMessageContainer}>
                <Text style={[styles.systemMessageText, { color: slackColors.systemMessageText }]}>
                  {message.content}
                </Text>
              </View>
            ) : (
              <View style={[
                styles.messageBubble,
                isCurrentUserMessage(message) ? styles.userMessage : styles.mentorMessage
              ]}>
                <View style={styles.messageHeader}>
                  <Image source={getMessageAvatar(message)} style={styles.avatar} />
                  <Text style={[styles.senderName, { color: slackColors.primaryText }]}>
                    {getMessageSenderName(message)}
                  </Text>
                  <Text style={[styles.messageTime, { color: slackColors.secondaryText }]}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text style={[styles.messageText, { color: slackColors.primaryText }]}>
                  {message.content}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: slackColors.inputBackground }]}>
        <TextInput
          style={[
            styles.textInput,
            {
              color: slackColors.primaryText,
              backgroundColor: slackColors.inputBackground,
              borderColor: slackColors.inputBorder
            }
          ]}
          placeholder="Message your mentor..."
          placeholderTextColor={slackColors.secondaryText}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: inputText.trim() ? slackColors.onlineGreen : slackColors.secondaryText,
              opacity: inputText.trim() ? 1 : 0.5
            }
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
  },
  channelStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  moreButton: {
    padding: 8,
  },
  moreButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    marginBottom: 16,
  },
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemMessageText: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  mentorMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  textInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 