import { IconSymbol } from '@/components/ui/IconSymbol';
import { Fonts } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
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

// Avatar data for cohort members - gender-specific
const maleAvatarData: { [key: string]: any } = {
  'Omar Malik': require('../assets/images/memoji1.png'),
  'Ahmed Hassan': require('../assets/images/memoji2.png'),
  'Yusuf Ali': require('../assets/images/memoji3.png'),
  'Ahmed': require('../assets/images/memoji1.png'),
  'Omar': require('../assets/images/memoji2.png'),
  'Tariq Syed': require('../assets/images/memoji3.png'),
  'Bilal Khan': require('../assets/images/memoji1.png'),
  'Samir Ali': require('../assets/images/memoji2.png')
};

const femaleAvatarData: { [key: string]: any } = {
  'Amara Hassan': require('../assets/images/femalememoji1.png'),
  'Zara Ahmed': require('../assets/images/femalememoji2.png'),
  'Layla Mohamed': require('../assets/images/femalememoji3.png'),
  'Fatima Rahman': require('../assets/images/femalememoji1.png'),
  'Amina': require('../assets/images/femalememoji2.png'),
  'Zara': require('../assets/images/femalememoji3.png'),
  'Layla': require('../assets/images/femalememoji1.png'),
  'Fatima': require('../assets/images/femalememoji2.png')
};

// Male cohort members data
const maleCohortMembers = [
  { name: 'Omar Malik', online: true },
  { name: 'Ahmed Hassan', online: true },
  { name: 'Yusuf Ali', online: false },
  { name: 'Ahmed', online: true },
  { name: 'Omar', online: false },
  { name: 'Tariq Syed', online: true },
  { name: 'Bilal Khan', online: false },
  { name: 'Samir Ali', online: true }
];

// Female cohort members data
const femaleCohortMembers = [
  { name: 'Amara Hassan', online: true },
  { name: 'Zara Ahmed', online: true },
  { name: 'Layla Mohamed', online: false },
  { name: 'Fatima Rahman', online: true },
  { name: 'Amina', online: false },
  { name: 'Zara', online: true },
  { name: 'Layla', online: false },
  { name: 'Fatima', online: true }
];

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  isMe: boolean;
  avatar: any;
  isSystemMessage?: boolean;
}

export default function MyCohortScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const isDarkMode = colorScheme === 'dark';
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputText, setInputText] = useState('');
  const [userGender, setUserGender] = useState<string | null>(null);
  const [cohortMembers, setCohortMembers] = useState(maleCohortMembers);
  const [avatarData, setAvatarData] = useState(maleAvatarData);

  // Load user gender and set appropriate cohort members
  useEffect(() => {
    const loadUserGender = async () => {
      try {
        const gender = await AsyncStorage.getItem('user-gender');
        setUserGender(gender);
        
        if (gender === 'male') {
          setCohortMembers(maleCohortMembers);
          setAvatarData(maleAvatarData);
          setMessages(generateMaleMessages());
        } else if (gender === 'female') {
          setCohortMembers(femaleCohortMembers);
          setAvatarData(femaleAvatarData);
          setMessages(generateFemaleMessages());
        } else {
          // Fallback to male members if no gender is set
          setCohortMembers(maleCohortMembers);
          setAvatarData(maleAvatarData);
          setMessages(generateMaleMessages());
        }
      } catch (error) {
        console.error('Error loading user gender:', error);
        setCohortMembers(maleCohortMembers);
        setAvatarData(maleAvatarData);
        setMessages(generateMaleMessages());
      }
    };
    
    loadUserGender();
  }, []);

  const generateMaleMessages = (): Message[] => [
    {
      id: 1,
      sender: 'Omar Malik',
      message: 'joined #my-cohort.',
      time: '9:15 AM',
      isMe: false,
      avatar: maleAvatarData['Omar Malik'],
      isSystemMessage: true,
    },
    {
      id: 2,
      sender: 'Ahmed Hassan',
      message: 'joined #my-cohort.',
      time: '9:22 AM',
      isMe: false,
      avatar: maleAvatarData['Ahmed Hassan'],
      isSystemMessage: true,
    },
    {
      id: 3,
      sender: 'Yusuf Ali',
      message: 'joined #my-cohort.',
      time: '10:05 AM',
      isMe: false,
      avatar: maleAvatarData['Yusuf Ali'],
      isSystemMessage: true,
    },
    {
      id: 4,
      sender: 'Omar Malik',
      message: 'Assalamu alaikum everyone! Hope you\'re all having a blessed day.',
      time: '10:30 AM',
      isMe: false,
      avatar: maleAvatarData['Omar Malik'],
    },
    {
      id: 5,
      sender: 'Ahmed Hassan',
      message: 'Wa alaikum assalam! Alhamdulillah, it\'s been a productive morning.',
      time: '10:35 AM',
      isMe: false,
      avatar: maleAvatarData['Ahmed Hassan'],
    },
    {
      id: 6,
      sender: 'Yusuf Ali',
      message: 'Assalamu alaikum brothers. Just finished my morning prayers.',
      time: '10:42 AM',
      isMe: false,
      avatar: maleAvatarData['Yusuf Ali'],
    },
    {
      id: 7,
      sender: 'Ahmed',
      message: 'joined #my-cohort.',
      time: '10:45 AM',
      isMe: false,
      avatar: maleAvatarData['Ahmed'],
      isSystemMessage: true,
    },
    {
      id: 8,
      sender: 'Omar Malik',
      message: 'Welcome Ahmed! How\'s everyone\'s Quran study going?',
      time: '10:48 AM',
      isMe: false,
      avatar: maleAvatarData['Omar Malik'],
    },
    {
      id: 9,
      sender: 'Omar',
      message: 'joined #my-cohort.',
      time: '11:15 AM',
      isMe: false,
      avatar: maleAvatarData['Omar'],
      isSystemMessage: true,
    },
    {
      id: 10,
      sender: 'Tariq Syed',
      message: 'joined #my-cohort.',
      time: '11:18 AM',
      isMe: false,
      avatar: maleAvatarData['Tariq Syed'],
      isSystemMessage: true,
    },
    {
      id: 11,
      sender: 'Omar',
      message: 'Assalamu alaikum everyone! Excited to be part of this community.',
      time: '11:20 AM',
      isMe: false,
      avatar: maleAvatarData['Omar'],
    },
    {
      id: 12,
      sender: 'Ahmed Hassan',
      message: 'Welcome Omar and Tariq! Great to have more brothers joining.',
      time: '11:22 AM',
      isMe: false,
      avatar: maleAvatarData['Ahmed Hassan'],
    },
    {
      id: 13,
      sender: 'Bilal Khan',
      message: 'joined #my-cohort.',
      time: '11:30 AM',
      isMe: false,
      avatar: maleAvatarData['Bilal Khan'],
      isSystemMessage: true,
    },
    {
      id: 14,
      sender: 'Omar',
      message: 'Anyone up for a study session later today?',
      time: '11:33 AM',
      isMe: false,
      avatar: maleAvatarData['Omar'],
    },
    {
      id: 15,
      sender: 'Samir Ali',
      message: 'joined #my-cohort.',
      time: '11:35 AM',
      isMe: false,
      avatar: maleAvatarData['Samir Ali'],
      isSystemMessage: true,
    },
    {
      id: 16,
      sender: 'Yusuf Ali',
      message: 'I\'m in for the study session! What time works for everyone?',
      time: '11:40 AM',
      isMe: false,
      avatar: maleAvatarData['Yusuf Ali'],
    },
    {
      id: 17,
      sender: 'Omar',
      message: 'How about 7 PM? We can discuss the tafsir we\'ve been reading.',
      time: '11:43 AM',
      isMe: false,
      avatar: maleAvatarData['Omar'],
    },
    {
      id: 18,
      sender: 'Ahmed',
      message: 'Perfect timing! I\'ll prepare some notes.',
      time: '11:45 AM',
      isMe: false,
      avatar: maleAvatarData['Ahmed'],
    },
    {
      id: 19,
      sender: 'Omar Malik',
      message: 'Great initiative Omar! This is exactly what we need.',
      time: '11:50 AM',
      isMe: false,
      avatar: maleAvatarData['Omar Malik'],
    },
    {
      id: 20,
      sender: 'Omar',
      message: 'JazakAllah khair! Looking forward to learning together.',
      time: '12:00 PM',
      isMe: false,
      avatar: maleAvatarData['Omar'],
    }
  ];

  const generateFemaleMessages = (): Message[] => [
    {
      id: 1,
      sender: 'Amara Hassan',
      message: 'joined #my-cohort.',
      time: '9:15 AM',
      isMe: false,
      avatar: femaleAvatarData['Amara Hassan'],
      isSystemMessage: true,
    },
    {
      id: 2,
      sender: 'Zara Ahmed',
      message: 'joined #my-cohort.',
      time: '9:22 AM',
      isMe: false,
      avatar: femaleAvatarData['Zara Ahmed'],
      isSystemMessage: true,
    },
    {
      id: 3,
      sender: 'Layla Mohamed',
      message: 'joined #my-cohort.',
      time: '10:05 AM',
      isMe: false,
      avatar: femaleAvatarData['Layla Mohamed'],
      isSystemMessage: true,
    },
    {
      id: 4,
      sender: 'Amara Hassan',
      message: 'Assalamu alaikum sisters! Hope you\'re all having a blessed day.',
      time: '10:30 AM',
      isMe: false,
      avatar: femaleAvatarData['Amara Hassan'],
    },
    {
      id: 5,
      sender: 'Zara Ahmed',
      message: 'Wa alaikum assalam! Alhamdulillah, it\'s been a beautiful morning.',
      time: '10:35 AM',
      isMe: false,
      avatar: femaleAvatarData['Zara Ahmed'],
    },
    {
      id: 6,
      sender: 'Layla Mohamed',
      message: 'Assalamu alaikum everyone. Just finished my morning prayers.',
      time: '10:42 AM',
      isMe: false,
      avatar: femaleAvatarData['Layla Mohamed'],
    },
    {
      id: 7,
      sender: 'Fatima Rahman',
      message: 'joined #my-cohort.',
      time: '10:45 AM',
      isMe: false,
      avatar: femaleAvatarData['Fatima Rahman'],
      isSystemMessage: true,
    },
    {
      id: 8,
      sender: 'Amara Hassan',
      message: 'Welcome Fatima! How\'s everyone\'s Quran study going?',
      time: '10:48 AM',
      isMe: false,
      avatar: femaleAvatarData['Amara Hassan'],
    },
    {
      id: 9,
      sender: 'Amina',
      message: 'joined #my-cohort.',
      time: '11:15 AM',
      isMe: false,
      avatar: femaleAvatarData['Amina'],
      isSystemMessage: true,
    },
    {
      id: 10,
      sender: 'Zara',
      message: 'joined #my-cohort.',
      time: '11:18 AM',
      isMe: false,
      avatar: femaleAvatarData['Zara'],
      isSystemMessage: true,
    },
    {
      id: 11,
      sender: 'Amina',
      message: 'Assalamu alaikum everyone! Excited to be part of this community.',
      time: '11:20 AM',
      isMe: false,
      avatar: femaleAvatarData['Amina'],
    },
    {
      id: 12,
      sender: 'Zara Ahmed',
      message: 'Welcome Amina and Zara! Great to have more sisters joining.',
      time: '11:22 AM',
      isMe: false,
      avatar: femaleAvatarData['Zara Ahmed'],
    },
    {
      id: 13,
      sender: 'Layla',
      message: 'joined #my-cohort.',
      time: '11:30 AM',
      isMe: false,
      avatar: femaleAvatarData['Layla'],
      isSystemMessage: true,
    },
    {
      id: 14,
      sender: 'Amina',
      message: 'Anyone interested in a study session later today?',
      time: '11:33 AM',
      isMe: false,
      avatar: femaleAvatarData['Amina'],
    },
    {
      id: 15,
      sender: 'Fatima',
      message: 'joined #my-cohort.',
      time: '11:35 AM',
      isMe: false,
      avatar: femaleAvatarData['Fatima'],
      isSystemMessage: true,
    },
    {
      id: 16,
      sender: 'Layla Mohamed',
      message: 'I\'m in for the study session! What time works for everyone?',
      time: '11:40 AM',
      isMe: false,
      avatar: femaleAvatarData['Layla Mohamed'],
    },
    {
      id: 17,
      sender: 'Amina',
      message: 'How about 7 PM? We can discuss the tafsir we\'ve been reading.',
      time: '11:43 AM',
      isMe: false,
      avatar: femaleAvatarData['Amina'],
    },
    {
      id: 18,
      sender: 'Fatima Rahman',
      message: 'Perfect timing! I\'ll prepare some notes.',
      time: '11:45 AM',
      isMe: false,
      avatar: femaleAvatarData['Fatima Rahman'],
    },
    {
      id: 19,
      sender: 'Amara Hassan',
      message: 'Great initiative Amina! This is exactly what we need.',
      time: '11:50 AM',
      isMe: false,
      avatar: femaleAvatarData['Amara Hassan'],
    },
    {
      id: 20,
      sender: 'Amina',
      message: 'JazakAllah khair! Looking forward to learning together.',
      time: '12:00 PM',
      isMe: false,
      avatar: femaleAvatarData['Amina'],
    }
  ];

  const [messages, setMessages] = useState<Message[]>(generateMaleMessages());

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
        sender: 'You',
        message: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        isMe: true,
        avatar: null,
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
      <StatusBar 
        barStyle="light-content"
        backgroundColor={slackColors.headerBackground}
        translucent={false}
      />

      {/* Header - matching the image design */}
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
                <IconSymbol name="lock.fill" size={16} color="#000" style={{ marginRight: 6, marginTop: 3 }} />
                <Text style={styles.headerTitle}>my-cohort</Text>
              </View>
              <Text style={styles.headerSubtitle}>
                {cohortMembers.length} members • 2 tabs ▼
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.headerRightButton}>
            <IconSymbol name="headphones" size={18} color="#000" />
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
          {/* Channel Introduction - Slack style */}
          <View style={styles.channelIntro}>
            <View style={styles.channelIntroIcon}>
              <Text style={styles.channelIntroIconText}>#</Text>
            </View>
            <View style={styles.channelIntroContent}>
              <Text style={[styles.channelIntroTitle, { color: slackColors.primaryText }]}>
                Welcome to #my-cohort!
              </Text>
              <Text style={[styles.channelIntroText, { color: slackColors.secondaryText }]}>
                This channel is for Islamic brotherhood and learning. {cohortMembers.length} members are here.
              </Text>
              <Text style={[styles.channelIntroSubtext, { color: slackColors.tertiaryText }]}>
                View channel details
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
            const showAvatar = showSender && !msg.isMe;

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
            placeholder="Message #my-cohort"
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