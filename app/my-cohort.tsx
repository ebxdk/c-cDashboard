import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
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
    View
} from 'react-native';

export default function MyCohortScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';
  const [message, setMessage] = useState('');
  const [inputAnimation] = useState(new Animated.Value(0));
  const scrollViewRef = useRef<ScrollView>(null);
  const [messageAnimations, setMessageAnimations] = useState<{[key: number]: Animated.Value}>({});
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Ahmed',
      message: 'Assalamu alaikum brothers. I hope everyone is doing well today.',
      time: '4:15 PM',
      isMe: false,
      avatar: require('../assets/images/memoji1.png')
    },
    {
      id: 2,
      sender: 'Ustadh Omar',
      message: 'Wa alaikum assalam Ahmed. Alhamdulillah, we are well. How has your day been?',
      time: '4:18 PM',
      isMe: false,
      avatar: require('../assets/images/memoji2.png')
    },
    {
      id: 3,
      sender: 'Yusuf',
      message: 'Wa alaikum assalam. Alhamdulillah, just finished work for the day.',
      time: '4:22 PM',
      isMe: false,
      avatar: require('../assets/images/memoji3.png')
    },
    {
      id: 4,
      sender: 'Ahmed',
      message: 'MashAllah, may Allah bless your efforts. I wanted to ask about tonight.',
      time: '4:25 PM',
      isMe: false,
      avatar: require('../assets/images/memoji1.png')
    },
    {
      id: 5,
      sender: 'Ahmed',
      message: 'What time is Maghrib today? I want to make sure I arrive on time for the iftar.',
      time: '4:26 PM',
      isMe: false,
      avatar: require('../assets/images/memoji1.png')
    },
    {
      id: 6,
      sender: 'Ustadh Omar',
      message: 'Maghrib will be at 6:47 PM today, inshAllah. The iftar starts right after.',
      time: '4:28 PM',
      isMe: false,
      avatar: require('../assets/images/memoji2.png')
    },
    {
      id: 7,
      sender: 'Yusuf',
      message: 'JazakAllahu khair, Ustadh. I appreciate you sharing the timing.',
      time: '4:30 PM',
      isMe: false,
      avatar: require('../assets/images/memoji3.png')
    },
    {
      id: 8,
      sender: 'Ahmed',
      message: 'Perfect timing. That works well with my schedule, alhamdulillah.',
      time: '6:15 PM',
      isMe: false,
      avatar: require('../assets/images/memoji1.png')
    },
    {
      id: 9,
      sender: 'Yusuf',
      message: 'Brothers, I wanted to confirm who will be attending the community iftar this evening.',
      time: '6:30 PM',
      isMe: false,
      avatar: require('../assets/images/memoji3.png')
    },
    {
      id: 10,
      sender: 'Ahmed',
      message: 'I plan to attend, inshAllah. I heard there will be a good program along with the meal.',
      time: '6:32 PM',
      isMe: false,
      avatar: require('../assets/images/memoji1.png')
    },
    {
      id: 11,
      sender: 'Yusuf',
      message: 'Yes, I am looking forward to the discussion and community time. The food is definitely a bonus.',
      time: '6:35 PM',
      isMe: false,
      avatar: require('../assets/images/memoji3.png')
    },
    {
      id: 12,
      sender: 'Ustadh Omar',
      message: 'As long as we come with the right intentions, Allah will bless our gathering, inshAllah.',
      time: '6:37 PM',
      isMe: false,
      avatar: require('../assets/images/memoji2.png')
    },
    {
      id: 13,
      sender: 'Ahmed',
      message: 'SubhanAllah, Ustadh, your words always bring wisdom and perspective.',
      time: '6:38 PM',
      isMe: false,
      avatar: require('../assets/images/memoji1.png')
    },
    {
      id: 14,
      sender: 'Yusuf',
      message: 'Indeed, may Allah guide us to maintain sincere intentions in all our actions.',
      time: '6:39 PM',
      isMe: false,
      avatar: require('../assets/images/memoji3.png')
    },
    {
      id: 15,
      sender: 'Ahmed',
      message: 'Will we begin with du\'a before the meal, or proceed directly to eating?',
      time: '6:40 PM',
      isMe: false,
      avatar: require('../assets/images/memoji1.png')
    },
    {
      id: 16,
      sender: 'Ustadh Omar',
      message: 'We will start with du\'a and some dhikr, then share the meal together.',
      time: '6:42 PM',
      isMe: false,
      avatar: require('../assets/images/memoji2.png')
    },
    {
      id: 17,
      sender: 'Yusuf',
      message: 'Sounds perfect. I will come with an empty stomach and a grateful heart, inshAllah.',
      time: '6:45 PM',
      isMe: false,
      avatar: require('../assets/images/memoji3.png')
    },
    {
      id: 18,
      sender: 'Ahmed',
      message: 'MashAllah, brother Yusuf, that is a beautiful approach to our gathering.',
      time: '6:46 PM',
      isMe: false,
      avatar: require('../assets/images/memoji1.png')
    },
    {
      id: 19,
      sender: 'Ustadh Omar',
      message: 'May Allah bless our iftar. I look forward to seeing you all at the masjid, inshAllah.',
      time: '6:47 PM',
      isMe: false,
      avatar: require('../assets/images/memoji2.png')
    },
    {
      id: 20,
      sender: 'Yusuf',
      message: 'InshAllah, may this gathering bring us closer to Allah and strengthen our brotherhood.',
      time: '6:48 PM',
      isMe: false,
      avatar: require('../assets/images/memoji3.png')
    },
  ]);

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    headerBackground: isDarkMode ? 'rgba(28, 28, 30, 0.8)' : 'rgba(248, 249, 250, 0.8)',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#8E8E93',
    messageBackground: isDarkMode ? '#2C2C2E' : '#E5E5EA',
    myMessageBackground: '#007AFF',
    inputBackground: isDarkMode ? '#1C1C1E' : '#F2F2F7',
    inputBorder: isDarkMode ? '#38383A' : '#C6C6C8',
    onlineIndicator: '#30D158',
    separatorColor: isDarkMode ? '#38383A' : '#C6C6C8',
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Get current time
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      // Create new message
      const newMessage = {
        id: messages.length + 1,
        sender: 'Me',
        message: message.trim(),
        time: timeString,
        isMe: true,
        avatar: undefined, // User messages don't need avatars
      };
      
      // Create animation for the new message
      const messageAnimation = new Animated.Value(0);
      setMessageAnimations(prev => ({
        ...prev,
        [newMessage.id]: messageAnimation
      }));
      
      // Add message to the list
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
      
      // Ultra-smooth iMessage-style animation inspired by "Slam" effect
      Animated.sequence([
        // Phase 1: Quick dramatic entrance
        Animated.timing(messageAnimation, {
          toValue: 0.8,
          duration: 120,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        // Phase 2: Perfect spring settle with natural bounce
        Animated.spring(messageAnimation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 280,
          friction: 12,
          velocity: 1.5,
        })
      ]).start(() => {
        // Perfect timing haptic feedback
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }, 30);
      });
      
      // Auto-scroll with perfect timing
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 120);
    }
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        const duration = Platform.OS === 'ios' ? event.duration : 300;
        Animated.timing(inputAnimation, {
          toValue: 1,
          duration: duration,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), // iOS-style easing curve
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
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94), // iOS-style easing curve
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [inputAnimation]);

  const handleInputFocus = () => {
    // Animation is now handled by keyboard listeners
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleInputBlur = () => {
    // Animation is now handled by keyboard listeners
  };

  const cohortMembers = [
    { id: 1, name: 'Ahmed', avatar: require('../assets/images/memoji1.png'), online: true },
    { id: 2, name: 'Ustadh Omar', avatar: require('../assets/images/memoji2.png'), online: true },
    { id: 3, name: 'Yusuf', avatar: require('../assets/images/memoji3.png'), online: false },
    { id: 4, name: 'Hassan', online: true },
    { id: 5, name: 'Ibrahim', online: false },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent"
        translucent
      />
      
      {/* Frosted Blur Header */}
      <BlurView 
        intensity={isDarkMode ? 60 : 70}
        tint={isDarkMode ? 'dark' : 'light'}
        style={styles.headerBlur}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerCenterContainer}>
            <View style={styles.groupAvatars}>
              {cohortMembers.slice(0, 4).map((member, index) => (
                <View key={member.id} style={[styles.avatarContainer, { 
                  marginLeft: index > 0 ? -8 : 0, 
                  zIndex: 10 - index 
                }]}>
                  {member.avatar ? (
                    <Image source={member.avatar} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatarPlaceholder, { backgroundColor: colors.messageBackground }]}>
                      <Text style={[styles.avatarText, { color: colors.primaryText }]}>
                        {member.name.charAt(0)}
                      </Text>
                    </View>
                  )}
                  {member.online && <View style={[styles.onlineIndicator, { backgroundColor: colors.onlineIndicator }]} />}
                </View>
              ))}
            </View>
            
            <View style={styles.headerTextContainer}>
              <Text style={[styles.groupName, { color: colors.primaryText }]}>My Cohort</Text>
              <Text style={[styles.membersCount, { color: colors.secondaryText }]}>
                {cohortMembers.filter(m => m.online).length} online
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📹</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => {
          const prevMessage = messages[index - 1];
          const showAvatar = !msg.isMe && (!prevMessage || prevMessage.sender !== msg.sender || prevMessage.isMe);
          const isConsecutive = prevMessage && prevMessage.sender === msg.sender && prevMessage.isMe === msg.isMe;
          const messageAnimation = messageAnimations[msg.id];
          
          return (
            <View key={msg.id} style={[
              styles.messageRow, 
              msg.isMe && styles.myMessageRow,
              { marginTop: isConsecutive ? 2 : 12 }
            ]}>
              {!msg.isMe && (
                <View style={styles.avatarSpace}>
                  {showAvatar && (
                    <Image source={msg.avatar} style={styles.messageAvatar} />
                  )}
                </View>
              )}
              <Animated.View style={[
                styles.messageBubble,
                msg.isMe ? 
                  { backgroundColor: colors.myMessageBackground } : 
                  { backgroundColor: colors.messageBackground },
                !isConsecutive && msg.isMe && styles.myMessageBubbleFirst,
                !isConsecutive && !msg.isMe && styles.otherMessageBubbleFirst,
                messageAnimation && {
                  transform: [
                    {
                      scale: messageAnimation.interpolate({
                        inputRange: [0, 0.4, 0.8, 1],
                        outputRange: [0.3, 0.85, 1.08, 1],
                        extrapolate: 'clamp',
                      })
                    },
                    {
                      translateY: messageAnimation.interpolate({
                        inputRange: [0, 0.4, 0.8, 1],
                        outputRange: [15, 3, -2, 0],
                        extrapolate: 'clamp',
                      })
                    },
                    {
                      translateX: messageAnimation.interpolate({
                        inputRange: [0, 0.4, 0.8, 1],
                        outputRange: [msg.isMe ? 12 : -12, msg.isMe ? 2 : -2, msg.isMe ? -1 : 1, 0],
                        extrapolate: 'clamp',
                      })
                    }
                  ],
                  opacity: messageAnimation.interpolate({
                    inputRange: [0, 0.3, 0.8, 1],
                    outputRange: [0, 0.7, 0.95, 1],
                    extrapolate: 'clamp',
                  }),
                  shadowColor: msg.isMe ? '#007AFF' : '#000000',
                  shadowOpacity: messageAnimation.interpolate({
                    inputRange: [0, 0.8, 1],
                    outputRange: [0, 0.15, 0.05],
                    extrapolate: 'clamp',
                  }),
                  shadowRadius: messageAnimation.interpolate({
                    inputRange: [0, 0.8, 1],
                    outputRange: [0, 8, 3],
                    extrapolate: 'clamp',
                  }),
                }
              ]}>
                <Text style={[
                  styles.messageText,
                  { color: msg.isMe ? '#FFFFFF' : colors.primaryText }
                ]}>
                  {msg.message}
                </Text>
              </Animated.View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.inputContainer]}
      >
        <Animated.View 
          style={[
            styles.inputRow,
            {
              transform: [
                {
                  translateY: inputAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -16],
                    extrapolate: 'clamp',
                  })
                },
                {
                  scale: inputAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.01, 1.03],
                    extrapolate: 'clamp',
                  })
                }
              ],
              opacity: inputAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.98],
                extrapolate: 'clamp',
              }),
            }
          ]}
        >
          <TouchableOpacity style={styles.attachButton}>
            <Text style={[styles.attachIcon, { color: colors.secondaryText }]}>➕</Text>
          </TouchableOpacity>
          
          <View style={[styles.inputWrapper, { 
            backgroundColor: colors.inputBackground,
            borderColor: colors.inputBorder 
          }]}>
            <TextInput
              style={[styles.textInput, { color: colors.primaryText }]}
              placeholder="Message..."
              placeholderTextColor={colors.secondaryText}
              value={message}
              onChangeText={setMessage}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onSubmitEditing={handleSendMessage}
              returnKeyType="send"
              multiline
            />
          </View>
          
          {message.trim() ? (
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: colors.myMessageBackground }]}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.attachButton}>
              <Text style={[styles.attachIcon, { color: colors.secondaryText }]}>🎤</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBlur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 54,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerCenterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupAvatars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'System',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  headerTextContainer: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
    lineHeight: 20,
    textAlign: 'center',
  },
  membersCount: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 16,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  actionIcon: {
    fontSize: 16,
  },
  messagesContainer: {
    flex: 1,
    paddingTop: 110, // Account for header height
  },
  messagesContent: {
    padding: 20,
    paddingLeft: 16,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  avatarSpace: {
    width: 30,
    marginRight: 8,
    alignItems: 'center',
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessageBubbleFirst: {
    borderBottomRightRadius: 6,
  },
  otherMessageBubbleFirst: {
    borderBottomLeftRadius: 6,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 18,
  },
  inputContainer: {
    paddingBottom: Platform.OS === 'ios' ? 60 : 50,
    paddingTop: 12,
    paddingHorizontal: 16,
    marginBottom: Platform.OS === 'ios' ? 20 : 15,
    backgroundColor: 'transparent',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  attachButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachIcon: {
    fontSize: 18,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 32,
    justifyContent: 'center',
    borderWidth: 1,
  },
  textInput: {
    fontSize: 16,
    fontFamily: 'System',
    maxHeight: 100,
    minHeight: 20,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
}); 