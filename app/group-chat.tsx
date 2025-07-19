import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import chatApi, { ChatMessage, ChatRoom, UserProfile } from '../lib/chatApi';

// Mock avatar data
const avatarData: { [key: string]: any } = {
  'Ahmed': { uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  'Fatima': { uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
  'Omar': { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  'Ebad Khan': { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  'Abdullah Shahid': { uri: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face' },
  'Mohammad Hadi': { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  'Ahmed Javed': { uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  'Mujtaba Saighani': { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
};

// Mock group members data
const groupMembers = [
  { id: '1', name: 'Mohammad Hadi', role: 'Admin', joinedDate: 'May 5th', avatar: avatarData['Mohammad Hadi'] },
  { id: '2', name: 'Ahmed Javed', role: 'Member', joinedDate: 'May 13th', avatar: avatarData['Ahmed Javed'] },
  { id: '3', name: 'Mujtaba Saighani', role: 'Member', joinedDate: 'May 14th', avatar: avatarData['Mujtaba Saighani'] },
  { id: '4', name: 'Ebad Khan', role: 'Admin', joinedDate: 'May 14th', avatar: avatarData['Ebad Khan'] },
  { id: '5', name: 'Abdullah Shahid', role: 'Member', joinedDate: 'April 20th', avatar: avatarData['Abdullah Shahid'] },
  { id: '6', name: 'Ahmed', role: 'Member', joinedDate: 'April 15th', avatar: avatarData['Ahmed'] },
  { id: '7', name: 'Omar', role: 'Member', joinedDate: 'April 10th', avatar: avatarData['Omar'] },
];

export default function GroupChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const isDarkMode = colorScheme === 'dark';
  const colors = Colors[colorScheme];
  
  // Supabase integration states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [messageOffset, setMessageOffset] = useState(0);
  
  const [message, setMessage] = useState('');
  const [inputAnimation] = useState(new Animated.Value(0));
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [headerExpansionAnimation] = useState(new Animated.Value(0));
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Get room ID from params (fallback to default for demo)
  const roomId = params.roomId as string || 'default-engineering-room';
  const groupName = params.groupName as string || 'engineering';
  const groupEmoji = params.groupEmoji as string || '🔒';
  const groupDescription = params.groupDescription as string || 'A space for engineering discussions, collaboration, and team updates. Share your progress, ask questions, and connect with fellow engineers.';

  const chatColors = {
    background: isDarkMode ? '#1A1D21' : '#FFFFFF',
    headerBackground: isDarkMode ? '#1A1D21' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#1D1C1D',
    secondaryText: isDarkMode ? '#ABABAD' : '#616061',
    tertiaryText: isDarkMode ? '#868686' : '#868686',
    messageHover: isDarkMode ? '#2C2D30' : '#F8F8F8',
    inputBackground: isDarkMode ? '#222529' : '#FFFFFF',
    inputBorder: isDarkMode ? '#565856' : '#E1E1E1',
    separatorColor: isDarkMode ? '#565856' : '#E1E1E1',
    threadBorder: isDarkMode ? '#565856' : '#E1E1E1',
    avatarBorder: isDarkMode ? '#565856' : '#E1E1E1',
    modalBackground: isDarkMode ? '#1A1D21' : '#FFFFFF',
    modalOverlay: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
    systemMessageText: isDarkMode ? '#ABABAD' : '#616061',
    channelColor: '#007A5A',
    headerCardBackground: isDarkMode ? '#2C2D30' : '#F8F8F8',
    channelIntroBackground: isDarkMode ? '#1A1D21' : '#FFFFFF',
    proTagBackground: '#8B5CF6',
  };

  // Supabase integration functions
  const loadRoomData = async () => {
    try {
      setIsLoading(true);
      
      // Load current user profile
      const userProfile = await chatApi.userProfile.getCurrentProfile();
      setCurrentUser(userProfile);
      
      // Load room info
      const roomData = await chatApi.rooms.getRoomById(roomId);
      setRoom(roomData);
      
      // Load messages
      const roomMessages = await chatApi.messages.getRoomMessages(roomId);
      setMessages(roomMessages);
      
      // Join room if not already a participant
      if (roomData && userProfile) {
        await chatApi.rooms.joinRoom(roomId);
      }
    } catch (error) {
      console.error('Error loading room data:', error);
      Alert.alert('Error', 'Failed to load chat data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!hasMoreMessages || isLoading) return;
    
    try {
      const newMessages = await chatApi.messages.getRoomMessages(
        roomId,
        50,
        messageOffset
      );
      
      if (newMessages.length < 50) {
        setHasMoreMessages(false);
      }
      
      setMessages(prev => [...newMessages, ...prev]);
      setMessageOffset(prev => prev + 50);
    } catch (error) {
      console.error('Error loading more messages:', error);
    }
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleHeaderPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newExpandedState = !isHeaderExpanded;
    setIsHeaderExpanded(newExpandedState);
    
    // Set global flag for bottom nav overlay
    (global as any).groupChatModalExpanded = newExpandedState;
    
    Animated.spring(headerExpansionAnimation, {
      toValue: newExpandedState ? 1 : 0,
      useNativeDriver: false,
      tension: 120,
      friction: 9,
      velocity: 0,
    }).start();
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !roomId || !currentUser) return;
    
    try {
      // Send message to Supabase
      const messageId = await chatApi.messages.sendMessage(
        roomId,
        message.trim()
      );
      
      if (messageId) {
        setMessage('');
        
        // Scroll to bottom after a short delay
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const dates = ['May 5th', 'May 13th', 'May 14th'];
    const currentIndex = dates.indexOf(dateString);
    return currentIndex !== -1 ? dates[currentIndex] : dateString;
  };

  // Helper function to check if message is from current user
  const isMessageFromCurrentUser = (message: ChatMessage) => {
    return currentUser && message.sender_id === currentUser.id;
  };

  // Helper function to get sender name
  const getSenderName = (message: ChatMessage) => {
    if (isMessageFromCurrentUser(message)) {
      return 'You';
    }
    return message.sender_profile?.full_name || 'Unknown User';
  };

  // Helper function to get sender avatar
  const getSenderAvatar = (message: ChatMessage) => {
    if (message.sender_profile?.avatar_url) {
      return { uri: message.sender_profile.avatar_url };
    }
    // Fallback to mock avatar data
    const senderName = getSenderName(message);
    return avatarData[senderName] || avatarData['Ahmed'];
  };

  // Load room data on component mount
  useEffect(() => {
    loadRoomData();
  }, [roomId]);

  // Real-time subscriptions
  useEffect(() => {
    if (roomId) {
      // Subscribe to real-time messages
      const channel = chatApi.realtime.subscribeToRoomMessages(
        roomId,
        (newMessage) => {
          setMessages(prev => [...prev, newMessage]);
          
          // Scroll to bottom for new messages
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      );

      return () => {
        chatApi.realtime.unsubscribe(`room:${roomId}`);
      };
    }
  }, [roomId]);

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        const duration = Platform.OS === 'ios' ? event.duration : 300;
        Animated.timing(inputAnimation, {
          toValue: 1,
          duration: duration,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (event) => {
        const duration = Platform.OS === 'ios' ? event.duration : 300;
        Animated.timing(inputAnimation, {
          toValue: 0,
          duration: duration,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [inputAnimation]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: chatColors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.loadingText, { color: chatColors.primaryText }]}>Loading chat...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: chatColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      
      {/* Modal Overlay - appears when header is expanded */}
      {isHeaderExpanded && (
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              backgroundColor: chatColors.modalOverlay,
              opacity: headerExpansionAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.modalOverlayTouchable}
            onPress={handleHeaderPress}
            activeOpacity={1}
          />
        </Animated.View>
      )}
      
      {/* Top Navigation Bar */}
      <View style={[
        styles.slackHeader, 
        { 
          backgroundColor: chatColors.headerBackground,
          borderBottomColor: chatColors.separatorColor,
        }
      ]}>
        {/* Fixed Header Row */}
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.backIcon, { color: chatColors.primaryText }]}>←</Text>
          </TouchableOpacity>
          
          {/* Header Card Trigger - Compact Version */}
          <TouchableOpacity 
            style={styles.headerCardTrigger}
            onPress={handleHeaderPress}
            activeOpacity={0.8}
          >
            <View style={styles.groupTitleRow}>
              <Text style={[styles.hashIcon, { color: chatColors.channelColor }]}>🔒</Text>
              <Text style={[styles.groupTitle, { color: chatColors.primaryText }]}>
                {room?.name || groupName}
              </Text>
              <Animated.Text style={[
                styles.expandIcon, 
                { 
                  color: chatColors.secondaryText,
                  transform: [{
                    rotate: headerExpansionAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                      extrapolate: 'clamp',
                    })
                  }]
                }
              ]}>
                ▼
              </Animated.Text>
            </View>
            <Text style={[styles.memberInfo, { color: chatColors.secondaryText }]}>
              {groupMembers.length} members • 2 tabs
            </Text>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerActionButton}>
              <Text style={[styles.headerActionIcon, { color: chatColors.primaryText }]}>🎧</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onScrollBeginDrag={() => {
            // Load more messages when scrolling to top
            if (hasMoreMessages) {
              loadMoreMessages();
            }
          }}
        >
          {messages.map((message) => (
            <View key={message.id} style={styles.messageContainer}>
              <View style={styles.messageHeader}>
                <Image 
                  source={getSenderAvatar(message)} 
                  style={styles.avatar}
                />
                <View style={styles.messageInfo}>
                  <Text style={[styles.senderName, { color: chatColors.primaryText }]}>
                    {getSenderName(message)}
                  </Text>
                  <Text style={[styles.messageTime, { color: chatColors.secondaryText }]}>
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
              </View>
              <Text style={[styles.messageText, { color: chatColors.primaryText }]}>
                {message.content}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <Animated.View 
          style={[
            styles.inputContainer,
            {
              backgroundColor: chatColors.inputBackground,
              borderTopColor: chatColors.inputBorder,
              transform: [{
                translateY: inputAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                  extrapolate: 'clamp',
                })
              }]
            }
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { 
                color: chatColors.primaryText,
                backgroundColor: chatColors.inputBackground,
              }
            ]}
            placeholder="Message #engineering"
            placeholderTextColor={chatColors.secondaryText}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              { 
                backgroundColor: message.trim() ? chatColors.channelColor : chatColors.secondaryText,
                opacity: message.trim() ? 1 : 0.5
              }
            ]}
            onPress={handleSendMessage}
            disabled={!message.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
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
  slackHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerCardTrigger: {
    flex: 1,
    marginHorizontal: 12,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  hashIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 4,
  },
  expandIcon: {
    fontSize: 12,
    fontWeight: '600',
  },
  memberInfo: {
    fontSize: 13,
    fontWeight: '400',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    padding: 8,
  },
  headerActionIcon: {
    fontSize: 18,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalOverlayTouchable: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 12,
    fontWeight: '400',
  },
  messageText: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 20,
    marginLeft: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    minHeight: 36,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    fontSize: 15,
    marginRight: 8,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 