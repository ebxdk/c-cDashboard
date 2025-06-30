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
    View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Avatar data for companion chat
const avatarData: { [key: string]: any } = {
  'Omar Hassan': require('../assets/images/memoji2.png'),
  'Bilal Ahmed': require('../assets/images/memoji1.png'), // Using memoji1 for the revert
};

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  isMe: boolean;
  avatar: any;
  isSystemMessage?: boolean;
}

export default function CompanionChatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDarkMode = colorScheme === 'dark';
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Omar Hassan',
      message: 'Assalamu alaikum Bilal! Welcome to your personal companion chat. I\'m here to support you on your Islamic journey.',
      time: '9:00 AM',
      isMe: false,
      avatar: avatarData['Omar Hassan'],
    },
    {
      id: 2,
      sender: 'Bilal Ahmed',
      message: 'Wa alaikum assalam Omar! Thank you so much. I\'m still learning and sometimes feel overwhelmed with everything.',
      time: '9:05 AM',
      isMe: true,
      avatar: avatarData['Bilal Ahmed'],
    },
    {
      id: 3,
      sender: 'Omar Hassan',
      message: 'That\'s completely normal, brother. Every Muslim\'s journey is unique. What specific area would you like to focus on today?',
      time: '9:07 AM',
      isMe: false,
      avatar: avatarData['Omar Hassan'],
    },
    {
      id: 4,
      sender: 'Bilal Ahmed',
      message: 'I\'ve been struggling with establishing a consistent prayer routine. Sometimes I miss Fajr because I\'m not used to waking up so early.',
      time: '9:10 AM',
      isMe: true,
      avatar: avatarData['Bilal Ahmed'],
    },
    {
      id: 5,
      sender: 'Omar Hassan',
      message: 'I understand completely. Building the habit of Fajr prayer is challenging even for born Muslims. Let me share some practical tips that have helped many new Muslims.',
      time: '9:12 AM',
      isMe: false,
      avatar: avatarData['Omar Hassan'],
    },
    {
      id: 6,
      sender: 'Omar Hassan',
      message: 'First, try setting multiple alarms 10 minutes apart. Also, there\'s a beautiful Lantern series called "Establishing Prayer Habits" that addresses exactly this challenge.',
      time: '9:13 AM',
      isMe: false,
      avatar: avatarData['Omar Hassan'],
    },
    {
      id: 7,
      sender: 'Bilal Ahmed',
      message: 'That sounds really helpful! I\'ve been trying to go to bed earlier too. Is there a specific time you recommend?',
      time: '9:15 AM',
      isMe: true,
      avatar: avatarData['Bilal Ahmed'],
    },
    {
      id: 8,
      sender: 'Omar Hassan',
      message: 'MashAllah, that\'s excellent thinking! The Prophet (PBUH) encouraged sleeping early. Try to sleep by 10 PM if Fajr is around 5 AM. This gives you 7 hours of rest.',
      time: '9:17 AM',
      isMe: false,
      avatar: avatarData['Omar Hassan'],
    },
    {
      id: 9,
      sender: 'Bilal Ahmed',
      message: 'JazakAllahu khair! I also wanted to ask about making du\'a. Sometimes I feel like I don\'t know the right words to say.',
      time: '9:20 AM',
      isMe: true,
      avatar: avatarData['Bilal Ahmed'],
    },
    {
      id: 10,
      sender: 'Omar Hassan',
      message: 'SubhanAllah, this is such a beautiful question! Allah accepts du\'a in any language, from the heart. You can speak to Allah in English, Arabic, or any language you\'re comfortable with.',
      time: '9:22 AM',
      isMe: false,
      avatar: avatarData['Omar Hassan'],
    },
    {
      id: 11,
      sender: 'Omar Hassan',
      message: 'There\'s a wonderful Lantern collection called "Du\'a for New Muslims" that includes both Arabic du\'as with translations and guidance on making personal du\'as.',
      time: '9:23 AM',
      isMe: false,
      avatar: avatarData['Omar Hassan'],
    },
    {
      id: 12,
      sender: 'Bilal Ahmed',
      message: 'That\'s so comforting to know! Sometimes I worry that I\'m not doing things "correctly" as a new Muslim.',
      time: '9:25 AM',
      isMe: true,
      avatar: avatarData['Bilal Ahmed'],
    },
    {
      id: 13,
      sender: 'Omar Hassan',
      message: 'Brother, your sincerity and eagerness to learn are exactly what Allah loves. Islam is a journey of growth, not perfection. Take it one step at a time.',
      time: '9:27 AM',
      isMe: false,
      avatar: avatarData['Omar Hassan'],
    },
    {
      id: 14,
      sender: 'Bilal Ahmed',
      message: 'Ameen! That really puts my mind at ease. Can we schedule a time to go through some of the Lantern content together?',
      time: '9:30 AM',
      isMe: true,
      avatar: avatarData['Bilal Ahmed'],
    },
    {
      id: 15,
      sender: 'Omar Hassan',
      message: 'Absolutely! How about we meet here every Tuesday and Friday at 9 AM? We can discuss your progress and explore new topics based on your interests.',
      time: '9:32 AM',
      isMe: false,
      avatar: avatarData['Omar Hassan'],
    },
    {
      id: 16,
      sender: 'Bilal Ahmed',
      message: 'Perfect! I\'m looking forward to it. JazakAllahu khair for being so patient and helpful, Omar.',
      time: '9:35 AM',
      isMe: true,
      avatar: avatarData['Bilal Ahmed'],
    },
    {
      id: 17,
      sender: 'Omar Hassan',
      message: 'Wa iyyak, brother! Remember, I\'m always here if you need guidance between our scheduled sessions. May Allah make your journey easy and blessed.',
      time: '9:37 AM',
      isMe: false,
      avatar: avatarData['Omar Hassan'],
    }
  ]);

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

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: 'Bilal Ahmed',
        message: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        isMe: true,
        avatar: avatarData['Bilal Ahmed'],
      };
      
      setMessages([...messages, newMessage]);
      setInputText('');
      
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: slackColors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar 
        barStyle="light-content"
        backgroundColor={slackColors.headerBackground}
        translucent={false}
      />

      {/* Header - matching the companion design */}
      <View style={[styles.header, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.backIcon, { color: '#000' }]}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <View style={styles.headerSubtitleContainer}>
              <View style={styles.titleRowInBox}>
                <IconSymbol name="person.fill" size={16} color="#000" style={{ marginRight: 6, marginTop: 3 }} />
                <Text style={styles.headerTitle}>Omar Hassan</Text>
              </View>
              <Text style={styles.headerSubtitle}>
                1-on-1 Islamic guidance • Online ▼
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.headerRightButton}>
            <IconSymbol name="phone.fill" size={18} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Container */}
      <View style={styles.messagesWrapper}>
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={[styles.messagesContent, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Channel Introduction - Companion style */}
          <View style={styles.channelIntro}>
            <View style={[styles.channelIntroIcon, { backgroundColor: '#4A90E2' }]}>
              <Text style={styles.channelIntroIconText}>👤</Text>
            </View>
            <View style={styles.channelIntroContent}>
              <Text style={[styles.channelIntroTitle, { color: slackColors.primaryText }]}>
                Welcome to Omar Hassan's Personal Companion!
              </Text>
              <Text style={[styles.channelIntroText, { color: slackColors.secondaryText }]}>
                This is your private space for 1-on-1 Islamic guidance with Omar Hassan, your dedicated companion.
              </Text>
              <Text style={[styles.channelIntroSubtext, { color: slackColors.tertiaryText }]}>
                All conversations are confidential
              </Text>
            </View>
          </View>

          {/* Date Divider */}
          <View style={styles.dateDivider}>
            <View style={[styles.dateLine, { backgroundColor: slackColors.separatorColor }]} />
            <View style={[styles.dateContainer, { backgroundColor: slackColors.background }]}>
              <Text style={[styles.dateText, { color: slackColors.secondaryText }]}>Today</Text>
            </View>
            <View style={[styles.dateLine, { backgroundColor: slackColors.separatorColor }]} />
          </View>

          {/* Messages */}
          {messages.map((msg, index) => {
            const prevMessage = messages[index - 1];
            const showSender = !prevMessage || prevMessage.sender !== msg.sender || prevMessage.isSystemMessage !== msg.isSystemMessage;
            const showAvatar = showSender;

            return (
              <View key={msg.id}>
                <View style={[
                  styles.messageRow,
                  msg.isSystemMessage && styles.systemMessageRow,
                  !showSender && styles.messageRowCompact
                ]}>
                  {showAvatar && !msg.isSystemMessage ? (
                    <Image source={msg.avatar} style={styles.messageAvatar} />
                  ) : (
                    <View style={styles.avatarSpacer} />
                  )}
                  
                  <View style={styles.messageContent}>
                    {msg.isSystemMessage ? (
                      <Text style={[styles.systemMessage, { color: slackColors.systemMessageText }]}>
                        <Text style={styles.systemMessageSender}>{msg.sender}</Text> {msg.message}
                      </Text>
                    ) : (
                      <>
                        {showSender && (
                          <View style={styles.messageSenderRow}>
                            <Text style={[styles.messageSender, { color: slackColors.primaryText }]}>
                              {msg.sender}
                            </Text>
                            <Text style={[styles.messageTime, { color: slackColors.tertiaryText }]}>
                              {msg.time}
                            </Text>
                          </View>
                        )}
                        <Text style={[styles.messageText]}>
                          {msg.message}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Input Area - positioned above bottom nav */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.inputIconButton}>
            <Text style={styles.inputIcon}>+</Text>
          </TouchableOpacity>
          
          <TextInput
            style={styles.messageInput}
            placeholder="Message Omar Hassan..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity style={styles.inputIconButton} onPress={handleSendMessage}>
            <Text style={styles.inputIcon}>🎤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* White background behind bottom nav bar */}
      <View style={styles.bottomNavBackground} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 55,
    paddingBottom: 4,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '400',
  },
  headerCenter: {
    flex: 1,
  },
  headerSubtitleContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1,
    marginRight: 8,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: Fonts.system,
    color: '#616061',
    marginLeft: 22,
  },
  headerRightButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  messagesWrapper: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  channelIntro: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingVertical: 16,
  },
  channelIntroIcon: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#4A154B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  channelIntroIconText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  channelIntroContent: {
    flex: 1,
    paddingTop: 8,
  },
  channelIntroTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Fonts.system,
    marginBottom: 4,
  },
  channelIntroText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: Fonts.system,
    lineHeight: 22,
    marginBottom: 8,
  },
  channelIntroSubtext: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: Fonts.system,
  },
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  dateLine: {
    flex: 1,
    height: 1,
  },
  dateContainer: {
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: Fonts.system,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  messageRowCompact: {
    paddingTop: 2,
  },
  systemMessageRow: {
    paddingVertical: 4,
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 8,
  },
  avatarSpacer: {
    width: 44,
  },
  messageContent: {
    flex: 1,
    minWidth: 0,
  },
  messageSenderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  messageSender: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Fonts.system,
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: Fonts.system,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: Fonts.system,
    lineHeight: 24,
    color: '#1D1C1D',
  },
  systemMessage: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: Fonts.system,
    fontStyle: 'italic',
    marginLeft: 44,
  },
  systemMessageSender: {
    fontWeight: '600',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 105,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  inputIconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputIcon: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  messageInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.system,
    maxHeight: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: '#000',
  },
  sendButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNavBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 121,
    backgroundColor: '#FFFFFF',
  },
  titleRowInBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.system,
    color: '#000',
    marginBottom: 2,
  },
}); 