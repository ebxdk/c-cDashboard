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

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  isMe: boolean;
  avatar?: any;
  isSystemMessage?: boolean;
}

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

  const formatDate = (dateString: string) => {
    const dates = ['May 5th', 'May 13th', 'May 14th'];
    const currentIndex = dates.indexOf(dateString);
    return currentIndex !== -1 ? dates[currentIndex] : dateString;
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
                {groupName}
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

      {/* Expanded Card - Separate from header, positioned absolutely on screen */}
      {isHeaderExpanded && (
        <Animated.View style={[
          styles.expandedCard, 
          { 
            backgroundColor: chatColors.headerCardBackground,
            height: headerExpansionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [56, 320],
              extrapolate: 'clamp',
            }),
            left: headerExpansionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [56, 16],
              extrapolate: 'clamp',
            }),
            right: headerExpansionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [56, 16],
              extrapolate: 'clamp',
            }),
            borderRadius: headerExpansionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [12, 16],
              extrapolate: 'clamp',
            }),
            shadowOpacity: headerExpansionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.15],
              extrapolate: 'clamp',
            }),
            shadowRadius: headerExpansionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 12],
              extrapolate: 'clamp',
            }),
            shadowOffset: {
              width: 0,
              height: headerExpansionAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 4],
                extrapolate: 'clamp',
              }),
            },
            elevation: headerExpansionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 8],
              extrapolate: 'clamp',
            }),
            opacity: headerExpansionAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            transform: [{
              scale: headerExpansionAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
                extrapolate: 'clamp',
              })
            }]
          }
        ]}>
          {/* Compact Header Content */}
          <View style={styles.expandedCardHeader}>
            <View style={styles.groupTitleRow}>
              <Text style={[styles.hashIcon, { color: chatColors.channelColor }]}>🔒</Text>
              <Text style={[styles.groupTitle, { color: chatColors.primaryText }]}>
                {groupName}
              </Text>
            </View>
            <Text style={[styles.memberInfo, { color: chatColors.secondaryText }]}>
              {groupMembers.length} members • 2 tabs
            </Text>
          </View>

          {/* Expanded Content */}
          <Animated.View style={[
            styles.expandedContent,
            {
              opacity: headerExpansionAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0, 1],
                extrapolate: 'clamp',
              }),
              transform: [{
                translateY: headerExpansionAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-5, 0],
                  extrapolate: 'clamp',
                })
              }]
            }
          ]}>
            {/* Group Description */}
            <Text style={[styles.expandedDescription, { color: chatColors.secondaryText }]}>
              {groupDescription}
            </Text>

            {/* Action Buttons */}
            <View style={styles.expandedActions}>
              <TouchableOpacity style={[styles.expandedActionButton, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.expandedActionIcon, { color: chatColors.primaryText }]}>👥</Text>
                <Text style={[styles.expandedActionText, { color: chatColors.primaryText }]}>Add people</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.expandedActionButton, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.expandedActionIcon, { color: chatColors.primaryText }]}>⚙️</Text>
                <Text style={[styles.expandedActionText, { color: chatColors.primaryText }]}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.expandedActionButton, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.expandedActionIcon, { color: chatColors.primaryText }]}>🔇</Text>
                <Text style={[styles.expandedActionText, { color: chatColors.primaryText }]}>Mute</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.expandedActionButton, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.expandedActionIcon, { color: chatColors.primaryText }]}>⭐</Text>
                <Text style={[styles.expandedActionText, { color: chatColors.primaryText }]}>Star</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.expandedActionButton, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.expandedActionIcon, { color: chatColors.primaryText }]}>📋</Text>
                <Text style={[styles.expandedActionText, { color: chatColors.primaryText }]}>View details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.expandedActionButton, { backgroundColor: 'transparent' }]}>
                <Text style={[styles.expandedActionIcon, { color: '#FF6B6B' }]}>🚪</Text>
                <Text style={[styles.expandedActionText, { color: '#FF6B6B' }]}>Leave</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      )}
      
      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Channel Introduction */}
        <View style={[styles.channelIntro, { backgroundColor: chatColors.channelIntroBackground }]}>
          <View style={styles.channelIntroHeader}>
            <Text style={[styles.channelIntroIcon, { color: chatColors.channelColor }]}>🔒</Text>
            <Text style={[styles.channelIntroTitle, { color: chatColors.primaryText }]}>{groupName}</Text>
          </View>
          <Text style={[styles.channelIntroText, { color: chatColors.secondaryText }]}>
            This is the very beginning of the 🔒{groupName} channel.
          </Text>
          
          {/* Action Buttons */}
          <View style={styles.channelIntroActions}>
            <TouchableOpacity style={[styles.channelIntroButton, { backgroundColor: chatColors.messageHover }]}>
              <Text style={[styles.channelIntroButtonIcon, { color: chatColors.primaryText }]}>✏️</Text>
              <Text style={[styles.channelIntroButtonText, { color: chatColors.primaryText }]}>Add description</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.channelIntroButton, { backgroundColor: chatColors.messageHover }]}>
              <Text style={[styles.channelIntroButtonIcon, { color: chatColors.primaryText }]}>👥</Text>
              <Text style={[styles.channelIntroButtonText, { color: chatColors.primaryText }]}>Add people</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pro Notice - Separate Card */}
        <View style={[styles.proNoticeCard, { backgroundColor: chatColors.messageHover }]}>
          <View style={[styles.proTag, { backgroundColor: chatColors.proTagBackground }]}>
            <Text style={styles.proTagText}>PRO</Text>
          </View>
          <Text style={[styles.proNoticeText, { color: chatColors.secondaryText }]}>
            Messages and files older than 90 days are hidden on your current plan.
          </Text>
          <TouchableOpacity>
            <Text style={[styles.proNoticeLink, { color: '#1264A3' }]}>Learn more about Slack Pro</Text>
          </TouchableOpacity>
        </View>

        {messages.map((msg, index) => {
          const prevMessage = messages[index - 1];
          const nextMessage = messages[index + 1];
          const showSender = !prevMessage || prevMessage.sender !== msg.sender || prevMessage.isSystemMessage !== msg.isSystemMessage;
          const showAvatar = showSender && !msg.isMe;
          const isLastInGroup = !nextMessage || nextMessage.sender !== msg.sender || nextMessage.isMe !== msg.isMe || nextMessage.isSystemMessage !== msg.isSystemMessage;
          const isFirstInGroup = showSender;
          
          // Show date dividers
          let showDateDivider = false;
          let dateText = '';
          if (index === 0) {
            showDateDivider = true;
            dateText = 'Apr 8th';
          } else if (index === 2) {
            showDateDivider = true;
            dateText = 'Apr 11th';
          } else if (index === 3) {
            showDateDivider = true;
            dateText = 'May 5th';
          }
          
          return (
            <React.Fragment key={msg.id}>
              {showDateDivider && (
                <View style={styles.dateDivider}>
                  <View style={[styles.dateLine, { backgroundColor: chatColors.separatorColor }]} />
                  <Text style={[styles.dateText, { color: chatColors.tertiaryText }]}>{dateText}</Text>
                  <View style={[styles.dateLine, { backgroundColor: chatColors.separatorColor }]} />
                </View>
              )}
              
              <View style={[
                styles.messageRow,
                { 
                  paddingTop: isFirstInGroup ? 12 : 2,
                  paddingBottom: isLastInGroup ? 8 : 0,
                }
              ]}>
                {/* Avatar column */}
                <View style={styles.avatarColumn}>
                  {showAvatar && msg.avatar ? (
                    <Image 
                      source={msg.avatar} 
                      style={[styles.messageAvatar, { 
                        borderColor: chatColors.avatarBorder 
                      }]} 
                    />
                  ) : showAvatar ? (
                    <View style={[styles.avatarPlaceholder, { 
                      backgroundColor: chatColors.messageHover,
                      borderColor: chatColors.avatarBorder 
                    }]}>
                      <Text style={[styles.avatarText, { color: chatColors.primaryText }]}>
                        {msg.sender.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  ) : null}
                </View>
                
                {/* Message content */}
                <View style={styles.messageContent}>
                  {/* Sender name and timestamp */}
                  {showSender && (
                    <View style={styles.messageHeader}>
                      <Text style={[styles.senderName, { color: chatColors.primaryText }]}>
                        {msg.sender}
                      </Text>
                      <Text style={[styles.messageTime, { color: chatColors.tertiaryText }]}>
                        {msg.time}
                      </Text>
                    </View>
                  )}
                  
                  {/* Message text */}
                  <View style={styles.messageTextContainer}>
                    <Text style={[
                      styles.messageText, 
                      { 
                        color: msg.isSystemMessage ? chatColors.systemMessageText : chatColors.primaryText,
                        fontStyle: msg.isSystemMessage ? 'italic' : 'normal'
                      }
                    ]}>
                      {msg.message}
                    </Text>
                  </View>
                </View>
              </View>
            </React.Fragment>
          );
        })}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.inputContainer, { 
          backgroundColor: chatColors.background,
          borderTopColor: chatColors.separatorColor,
        }]}
      >
        <Animated.View 
          style={[
            styles.inputRow,
            {
              transform: [
                {
                  translateY: inputAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                    extrapolate: 'clamp',
                  })
                }
              ],
            }
          ]}
        >
          <View style={[styles.inputWrapper, { 
            backgroundColor: chatColors.inputBackground,
            borderColor: chatColors.inputBorder 
          }]}>
            <TouchableOpacity style={styles.attachButton}>
              <Text style={[styles.attachIcon, { color: chatColors.tertiaryText }]}>+</Text>
            </TouchableOpacity>
            
            <TextInput
              style={[styles.textInput, { color: chatColors.primaryText }]}
              placeholder={`Message ${groupName}`}
              placeholderTextColor={chatColors.tertiaryText}
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              multiline
            />
            
            <TouchableOpacity style={styles.emojiButton}>
              <Text style={[styles.emojiIcon, { color: chatColors.tertiaryText }]}>😊</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mentionButton}>
              <Text style={[styles.mentionIcon, { color: chatColors.tertiaryText }]}>@</Text>
            </TouchableOpacity>
            
            {message.trim() ? (
              <TouchableOpacity 
                style={[styles.sendButton, { backgroundColor: chatColors.channelColor }]}
                onPress={handleSendMessage}
              >
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.micButton}>
                <Text style={[styles.micIcon, { color: chatColors.tertiaryText }]}>🎤</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  messageRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarColumn: {
    width: 40,
    alignItems: 'center',
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 0,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
  messageContent: {
    flex: 1,
    paddingLeft: 8,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  senderName: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
    fontFamily: Fonts.system,
  },
  messageTime: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: Fonts.system,
    opacity: 0.7,
  },
  messageTextContainer: {
    paddingLeft: 0,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Fonts.system,
    fontWeight: '400',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 104, // Position above the 104px tall bottom nav bar
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  attachButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  attachIcon: {
    fontSize: 18,
    fontWeight: '400',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.system,
    maxHeight: 100,
    paddingVertical: 0,
  },
  emojiButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emojiIcon: {
    fontSize: 16,
  },
  mentionButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  mentionIcon: {
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  micButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  micIcon: {
    fontSize: 16,
  },
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginVertical: 8,
  },
  dateLine: {
    flex: 1,
    height: 1,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Fonts.system,
    marginHorizontal: 16,
  },
  slackHeader: {
    paddingTop: 54, // Account for status bar
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    minHeight: 70,
    position: 'relative',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  backIcon: {
    fontSize: 18,
    fontWeight: '400',
  },
  headerInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  headerCard: {
    position: 'absolute',
    top: 66,
    left: 56,
    right: 56,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    overflow: 'hidden',
  },
  headerCardContent: {
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hashIcon: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 6,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: Fonts.system,
  },
  memberInfo: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: Fonts.system,
    opacity: 0.7,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 16,
  },
  headerActionIcon: {
    fontSize: 16,
  },
  
  channelIntro: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 8,
  },
  channelIntroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  channelIntroIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  channelIntroTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.system,
  },
  channelIntroText: {
    fontSize: 17,
    fontWeight: '400',
    fontFamily: Fonts.system,
    lineHeight: 24,
    marginBottom: 20,
  },
  channelIntroActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  channelIntroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    minHeight: 56,
  },
  channelIntroButtonIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  channelIntroButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
  proNoticeCard: {
    marginHorizontal: 8,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'column',
  },
  proTag: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  proTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
  proNoticeText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: Fonts.system,
    lineHeight: 20,
    marginBottom: 8,
    marginTop: 8,
  },
  proNoticeLink: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.system,
    textDecorationLine: 'underline',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
    zIndex: 1,
  },
  expandIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  expandedContent: {
    paddingTop: 16,
    paddingHorizontal: 0,
  },
  expandedDescription: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: Fonts.system,
    lineHeight: 22,
    marginBottom: 24,
  },
  expandedActions: {
    flexDirection: 'column',
    marginTop: 16,
  },
  expandedActionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 0,
    marginBottom: 0,
  },
  expandedActionIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  expandedActionText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: Fonts.system,
    flex: 1,
  },
  headerSpacer: {
    flex: 1,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999, // Very high z-index to cover everything including bottom nav
  },
  modalOverlayTouchable: {
    flex: 1,
  },
  headerCardTrigger: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 16,
  },
  expandedCard: {
    position: 'absolute',
    top: 66, // Position where the header card should be
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    overflow: 'hidden',
    zIndex: 10000, // Higher than modal overlay to stay visible
  },
  expandedCardHeader: {
    paddingVertical: 4,
    marginBottom: 8,
  },
}); 