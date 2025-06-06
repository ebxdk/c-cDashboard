import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

// Function to format AI responses with markdown-like styling in real-time
const formatAIResponse = (text: string, colors: any, isDarkMode: boolean) => {
  if (!text) return null;
  
  // Arabic text detection regex - UPDATED to capture entire phrases/verses
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+/g;
  
  // Process text line by line to maintain proper formatting
  const lines = text.split('\n');
  const formattedElements: React.ReactElement[] = [];
  let elementKey = 0;
  
  // Process text with Arabic highlighting (enhanced) - UNIFIED PHRASES
  const processTextWithArabic = (text: string, startKey: number, colors: any, isDarkMode: boolean): React.ReactElement[] => {
    const segments: React.ReactElement[] = [];
    let segmentKey = startKey;
    let currentIndex = 0;
    
    // Find Arabic text matches - NOW CAPTURES ENTIRE PHRASES/VERSES
    const arabicMatches: Array<{ start: number; end: number; text: string }> = [];
    let match;
    const arabicRegexForMatching = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+/g;
    
    while ((match = arabicRegexForMatching.exec(text)) !== null) {
      // Trim whitespace from the matched text but keep the positions
      const matchedText = match[0];
      const trimmedText = matchedText.trim();
      
      if (trimmedText.length > 0) {
        // Find the actual start and end positions of the trimmed text
        const startOffset = matchedText.indexOf(trimmedText);
        arabicMatches.push({
          start: match.index + startOffset,
          end: match.index + startOffset + trimmedText.length,
          text: trimmedText
        });
      }
    }
    
    // Process Arabic matches with enhanced styling - UNIFIED BLOCKS
    arabicMatches.forEach(arabicMatch => {
      // Add text before Arabic
      if (arabicMatch.start > currentIndex) {
        const beforeText = text.slice(currentIndex, arabicMatch.start);
        if (beforeText) {
          segments.push(
            <Text key={segmentKey++} style={{
              fontSize: 18, // Bigger regular text
              color: colors.primaryText,
              fontFamily: 'System',
            }}>
              {beforeText}
            </Text>
          );
        }
      }
      
      // Add Arabic text in a modern card wrapper
      segments.push(
        <View key={segmentKey++} style={{
          backgroundColor: isDarkMode ? 'rgba(28, 28, 30, 0.8)' : 'rgba(248, 249, 250, 0.9)',
          borderRadius: 12,
          paddingHorizontal: 20,
          paddingVertical: 16,
          marginVertical: 12,
          marginHorizontal: 4,
          borderWidth: 1,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
          shadowColor: isDarkMode ? '#000000' : '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.08,
          shadowRadius: 8,
          elevation: 2,
          width: '100%',
          alignSelf: 'flex-start',
          flexDirection: 'column',
        }}>
          <Text style={{
            fontSize: 19,
            fontWeight: '500',
            color: isDarkMode ? '#FFFFFF' : '#1A1A1A',
            fontFamily: 'System',
            letterSpacing: 0.3,
            textAlign: 'right',
            lineHeight: 30,
            width: '100%',
            flexWrap: 'wrap',
          }}>
            {arabicMatch.text}
          </Text>
        </View>
      );
      
      currentIndex = arabicMatch.end;
    });
    
    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      if (remainingText) {
        segments.push(
          <Text key={segmentKey++} style={{
            fontSize: 18, // Bigger regular text
            color: colors.primaryText,
            fontFamily: 'System',
          }}>
            {remainingText}
          </Text>
        );
      }
    }
    
    // If no Arabic text found, return the original text
    if (segments.length === 0) {
      segments.push(
        <Text key={segmentKey++} style={{
          fontSize: 18, // Bigger regular text
          color: colors.primaryText,
          fontFamily: 'System',
        }}>
          {text}
        </Text>
      );
    }
    
    return segments;
  };
  
  lines.forEach((line, lineIndex) => {
    if (!line.trim()) {
      // Empty line - add minimal spacing (ChatGPT style)
      if (lineIndex > 0 && lineIndex < lines.length - 1) {
        formattedElements.push(
          <Text key={elementKey++} style={{ fontSize: 18, lineHeight: 8 }}>{'\n'}</Text>
        );
      }
      return;
    }
    
    // Check for headers (ChatGPT-like sizing)
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const headerText = headerMatch[2];
      
      // ChatGPT-like header sizing with enhanced styling - BIGGER SIZES
      let fontSize = 18;
      let fontWeight: '600' | '700' | '800' = '600';
      let marginTop = 20;
      let marginBottom = 12;
      let letterSpacing = 0;
      
      switch (level) {
        case 1:
          fontSize = 32; // Bigger, more prominent
          fontWeight = '800';
          marginTop = 24;
          marginBottom = 16;
          letterSpacing = -0.5;
          break;
        case 2:
          fontSize = 28; // Bigger H2
          fontWeight = '700';
          marginTop = 22;
          marginBottom = 14;
          letterSpacing = -0.3;
          break;
        case 3:
          fontSize = 24; // Bigger H3
          fontWeight = '700';
          marginTop = 20;
          marginBottom = 12;
          letterSpacing = -0.2;
          break;
        case 4:
          fontSize = 22; // Bigger H4
          fontWeight = '600';
          marginTop = 18;
          marginBottom = 10;
          letterSpacing = -0.1;
          break;
        default:
          fontSize = 20; // Bigger H5/H6
          fontWeight = '600';
          marginTop = 16;
          marginBottom = 8;
      }
      
      // Process header text for Arabic highlighting
      const headerElements = processTextWithArabic(headerText, 0, colors, isDarkMode);
      
      formattedElements.push(
        <Text key={elementKey++} style={{
          fontSize,
          fontWeight,
          color: colors.primaryText,
          marginTop: lineIndex === 0 ? 0 : marginTop,
          marginBottom,
          fontFamily: 'System',
          lineHeight: fontSize * 1.3,
          letterSpacing,
          // Add subtle glow effect for headers
          textShadowColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        }}>
          {headerElements}
        </Text>
      );
      return; // IMPORTANT: Return here to prevent duplicate processing
    }
    
    // Process regular text with inline formatting
    const processInlineFormatting = (text: string): React.ReactElement[] => {
      const segments: React.ReactElement[] = [];
      let segmentKey = 0;
      let currentIndex = 0;
      
      // Find all formatting patterns with enhanced regex
      const patterns = [
        { regex: /\*\*([^*]+)\*\*/g, type: 'bold' },
        { regex: /\*([^*]+)\*/g, type: 'italic' },
        { regex: /`([^`]+)`/g, type: 'code' },
        { regex: /~~([^~]+)~~/g, type: 'strikethrough' },
        { regex: /__([^_]+)__/g, type: 'underline' },
      ];
      
      const matches: Array<{
        start: number;
        end: number;
        content: string;
        type: string;
      }> = [];
      
      patterns.forEach(pattern => {
        let match;
        const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            content: match[1],
            type: pattern.type
          });
        }
      });
      
      // Sort matches by position
      matches.sort((a, b) => a.start - b.start);
      
      // Process matches and text between them
      matches.forEach(match => {
        // Add text before match
        if (match.start > currentIndex) {
          const beforeText = text.slice(currentIndex, match.start);
          segments.push(...processTextWithArabic(beforeText, segmentKey, colors, isDarkMode));
          segmentKey += 10; // Leave room for Arabic segments
        }
        
        // Add formatted match with enhanced styling
        switch (match.type) {
          case 'bold':
            segments.push(
              <Text key={segmentKey++} style={{
                fontWeight: '700',
                fontSize: 18, // Bigger bold text
                color: colors.primaryText,
                fontFamily: 'System',
                // Add subtle glow for bold text
                textShadowColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: { width: 0, height: 0.5 },
                textShadowRadius: 1,
              }}>
                {match.content}
              </Text>
            );
            break;
          case 'italic':
            segments.push(
              <Text key={segmentKey++} style={{
                fontStyle: 'italic',
                fontSize: 18, // Bigger italic text
                color: isDarkMode ? '#E8E8E8' : '#2C2C2C',
                fontFamily: 'System',
                letterSpacing: 0.2,
              }}>
                {match.content}
              </Text>
            );
            break;
          case 'code':
            segments.push(
              <Text key={segmentKey++} style={{
                fontFamily: 'Courier',
                fontSize: 17, // Bigger code text
                color: isDarkMode ? '#FF6B9D' : '#E91E63',
                backgroundColor: isDarkMode ? 'rgba(255, 107, 157, 0.15)' : 'rgba(233, 30, 99, 0.08)',
                paddingHorizontal: 6,
                paddingVertical: 3,
                borderRadius: 6,
                // Add subtle border and shadow
                borderWidth: 1,
                borderColor: isDarkMode ? 'rgba(255, 107, 157, 0.3)' : 'rgba(233, 30, 99, 0.2)',
                shadowColor: isDarkMode ? '#FF6B9D' : '#E91E63',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
              }}>
                {match.content}
              </Text>
            );
            break;
          case 'strikethrough':
            segments.push(
              <Text key={segmentKey++} style={{
                textDecorationLine: 'line-through',
                fontSize: 18, // Bigger strikethrough text
                color: isDarkMode ? '#888888' : '#666666',
                fontFamily: 'System',
              }}>
                {match.content}
              </Text>
            );
            break;
          case 'underline':
            segments.push(
              <Text key={segmentKey++} style={{
                textDecorationLine: 'underline',
                fontSize: 18, // Bigger underline text
                color: isDarkMode ? '#64B5F6' : '#1976D2',
                fontFamily: 'System',
              }}>
                {match.content}
              </Text>
            );
            break;
        }
        
        currentIndex = match.end;
      });
      
      // Add remaining text
      if (currentIndex < text.length) {
        const remainingText = text.slice(currentIndex);
        segments.push(...processTextWithArabic(remainingText, segmentKey, colors, isDarkMode));
      }
      
      return segments;
    };
    
    // Process the line
    const lineElements = processInlineFormatting(line);
    
    formattedElements.push(
      <Text key={elementKey++} style={{
        fontSize: 18, // Bigger body text size (was 16px)
        lineHeight: 28, // Better line spacing for bigger text (was 26px)
        fontFamily: 'System',
        marginBottom: 4, // Tighter spacing between paragraphs
        letterSpacing: 0.1, // Subtle letter spacing for better readability
      }}>
        {lineElements}
      </Text>
    );
  });
  
  return (
    <View style={{ 
      flex: 1,
      // Add subtle background gradient effect
      backgroundColor: 'transparent',
    }}>
      {formattedElements}
    </View>
  );
};

export default function MinaraChatScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';
  const [message, setMessage] = useState('');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [sideMenuAnimation] = useState(new Animated.Value(340));
  const [overlayOpacity] = useState(new Animated.Value(0));
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputAnimation] = useState(new Animated.Value(0));
  const [messageAnimations, setMessageAnimations] = useState<{[key: number]: Animated.Value}>({});
  const [menuButtonScale] = useState(new Animated.Value(1));
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [allChats, setAllChats] = useState<{[key: string]: Message[]}>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null);
  const [cursorAnimation] = useState(new Animated.Value(1));
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sample chat history data with actual stored messages
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'Prayer Times Discussion',
      lastMessage: 'What time is Maghrib today?',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      title: 'Quran Study Session',
      lastMessage: 'Help me understand Surah Al-Fatiha',
      timestamp: 'Yesterday'
    },
    {
      id: '3',
      title: 'Islamic Finance Question',
      lastMessage: 'Is cryptocurrency halal?',
      timestamp: '3 days ago'
    },
    {
      id: '4',
      title: 'Ramadan Preparation',
      lastMessage: 'How to prepare for Ramadan?',
      timestamp: '1 week ago'
    }
  ]);

  // Initialize sample chat data
  useEffect(() => {
    const sampleChats = {
      '1': [
        {
          id: 1,
          text: 'What time is Maghrib today?',
          isUser: true,
          timestamp: '2:30 PM'
        },
        {
          id: 2,
          text: 'MashAllah, that\'s a wonderful question. Maghrib time varies by location, but generally it\'s at sunset. For today, in most locations, it would be around 6:45 PM. I recommend checking your local Islamic center or prayer time app for the exact time in your area.',
          isUser: false,
          timestamp: '2:31 PM'
        }
      ],
      '2': [
        {
          id: 1,
          text: 'Help me understand Surah Al-Fatiha',
          isUser: true,
          timestamp: 'Yesterday 3:15 PM'
        },
        {
          id: 2,
          text: 'SubhanAllah, Surah Al-Fatiha is the opening chapter of the Quran and is recited in every unit of prayer. It\'s a beautiful supplication that includes praise of Allah, seeking guidance, and asking to be on the straight path. Would you like me to explain any specific verses?',
          isUser: false,
          timestamp: 'Yesterday 3:16 PM'
        }
      ],
      '3': [
        {
          id: 1,
          text: 'Is cryptocurrency halal?',
          isUser: true,
          timestamp: '3 days ago 1:20 PM'
        },
        {
          id: 2,
          text: 'Alhamdulillah, this is a complex topic that scholars have different opinions on. Some consider it permissible as a digital asset, while others have concerns about speculation and volatility. The key factors to consider are: avoiding excessive speculation (gharar), ensuring it\'s not used for haram activities, and understanding the underlying technology. I recommend consulting with a qualified Islamic scholar for your specific situation.',
          isUser: false,
          timestamp: '3 days ago 1:22 PM'
        }
      ],
      '4': [
        {
          id: 1,
          text: 'How to prepare for Ramadan?',
          isUser: true,
          timestamp: '1 week ago 5:00 PM'
        },
        {
          id: 2,
          text: 'MashAllah, preparing for Ramadan is a beautiful spiritual journey. Here are some key preparations: 1) Start adjusting your sleep schedule gradually, 2) Begin reading more Quran daily, 3) Increase your dhikr and duas, 4) Plan your iftar meals and suhoor, 5) Set spiritual goals for the month, 6) Seek forgiveness and make amends with others. May Allah grant you a blessed Ramadan!',
          isUser: false,
          timestamp: '1 week ago 5:02 PM'
        }
      ]
    };
    setAllChats(sampleChats);
  }, []);

  // Suggestion prompts data
  const suggestionPrompts = [
    {
      title: "Learn about Islam",
      subtitle: "What are the 5 pillars of Islam?",
      prompt: "What are the 5 pillars of Islam?"
    },
    {
      title: "Prayer Guidance",
      subtitle: "How do I perform Wudu correctly?",
      prompt: "How do I perform Wudu correctly?"
    },
    {
      title: "Quran Study",
      subtitle: "Help me understand Quran verses",
      prompt: "Help me understand Quran verses"
    },
    {
      title: "Islamic History",
      subtitle: "Tell me about Prophet Muhammad's life",
      prompt: "Tell me about Prophet Muhammad's life"
    },
    {
      title: "Daily Duas",
      subtitle: "What are some morning and evening duas?",
      prompt: "What are some morning and evening duas?"
    },
    {
      title: "Halal Guidelines",
      subtitle: "What foods are halal and haram?",
      prompt: "What foods are halal and haram?"
    },
    {
      title: "Ramadan",
      subtitle: "How should I prepare for Ramadan?",
      prompt: "How should I prepare for Ramadan?"
    },
    {
      title: "Islamic Finance",
      subtitle: "What is Islamic banking?",
      prompt: "What is Islamic banking?"
    }
  ];

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    primaryText: isDarkMode ? '#FFFFFF' : '#000000',
    secondaryText: isDarkMode ? '#8E8E93' : '#6B7280',
    tertiaryText: isDarkMode ? '#636366' : '#9CA3AF',
    messageBackground: isDarkMode ? '#2C2C2E' : '#F2F2F7',
    userMessageBackground: '#007AFF',
    inputBackground: isDarkMode ? '#1C1C1E' : '#F7F7F7',
    inputBorder: isDarkMode ? '#38383A' : '#E0E0E0',
    suggestionBackground: isDarkMode ? '#1C1C1E' : '#F9F9F9',
    suggestionBorder: isDarkMode ? '#38383A' : '#E0E0E0',
    sideMenuBackground: isDarkMode ? '#000000' : '#FFFFFF',
    sideMenuItemBackground: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(59, 130, 246, 0.05)',
    sideMenuItemHover: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(59, 130, 246, 0.08)',
    newChatBackground: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)',
    sideMenuBorder: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(229, 231, 235, 0.8)',
    sideMenuAccent: '#3B82F6',
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const toggleSideMenu = () => {
    const newState = !showSideMenu;
    const toValue = newState ? 0 : 340; // Slide to right when closing
    const overlayValue = newState ? 1 : 0;
    
    // Animate menu button press
    Animated.sequence([
      Animated.timing(menuButtonScale, {
        toValue: 0.85,
        duration: 100,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(menuButtonScale, {
        toValue: 1,
        duration: 150,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      })
    ]).start();
    
    // Only update state immediately when opening, delay when closing for exit animation
    if (newState) {
      setShowSideMenu(newState);
    }
    
    // Apple-like spring animation for opening, refined timing for closing
    if (newState) {
      // Opening: Use spring for natural, buttery smooth feel
      Animated.parallel([
        Animated.spring(sideMenuAnimation, {
          toValue,
          useNativeDriver: true,
          stiffness: 250,
          damping: 28,
          mass: 0.8,
          velocity: 0,
        }),
        Animated.timing(overlayOpacity, {
          toValue: overlayValue,
          duration: 320,
          easing: Easing.bezier(0.23, 1, 0.32, 1), // More buttery easing curve
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Closing: Use precise timing for clean, sophisticated exit
      Animated.parallel([
        Animated.timing(sideMenuAnimation, {
          toValue,
          duration: 320,
          easing: Easing.bezier(0.32, 0.72, 0, 1), // Apple's exit easing
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: overlayValue,
          duration: 280,
          easing: Easing.bezier(0.4, 0, 0.2, 1), // Faster overlay fade
          useNativeDriver: true,
        })
      ]).start((finished) => {
        // Only update state after animation completes when closing
        if (finished) {
          setShowSideMenu(newState);
        }
      });
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleNewChat = () => {
    // Generate a new chat ID
    const newChatId = Date.now().toString();
    
    // Clear current messages and reset state
    setMessages([]);
    setMessage('');
    setMessageAnimations({});
    setCurrentChatId(newChatId);
    
    // Close side menu
    toggleSideMenu();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleChatSelect = (chat: ChatHistory) => {
    // Save current chat if it exists and has messages
    if (currentChatId && messages.length > 0) {
      setAllChats(prev => ({
        ...prev,
        [currentChatId]: messages
      }));
    }
    
    // Load the selected chat's messages
    const chatMessages = allChats[chat.id] || [];
    setMessages(chatMessages);
    setCurrentChatId(chat.id);
    
    // Reset message animations for the loaded chat
    const newAnimations: {[key: number]: Animated.Value} = {};
    chatMessages.forEach(msg => {
      newAnimations[msg.id] = new Animated.Value(1); // Already visible
    });
    setMessageAnimations(newAnimations);
    
    // Close side menu
    toggleSideMenu();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Scroll to bottom after loading
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const generateAIResponse = async (userMessage: string, aiMessageId: string) => {
    try {
      setIsGenerating(true);
      setCurrentGenerationId(aiMessageId);
      
      // Create abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      
      const mode = 'minara'; // You can make this dynamic if needed
      const apiUrl = `https://fd9eee7e-d0c0-4bb1-bf17-3cf5bb5b602d-00-dnzft2cr6llb.worf.replit.dev/api/${mode}/stream?query=${encodeURIComponent(userMessage)}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-API-Key': 'ebadkhan5487minara',
          'Accept': 'application/json',
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // React Native compatible streaming approach
      // Since ReadableStream.getReader() may not be available, we'll use response.text()
      // and simulate streaming by processing the response incrementally
      
      const responseText = await response.text();
      const lines = responseText.split('\n');
      
      // Process each line with a small delay to simulate real-time streaming
      for (let i = 0; i < lines.length; i++) {
        // Check if generation was stopped
        if (abortController.signal.aborted) {
          break;
        }
        
        const line = lines[i].trim();
        
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.substring(6); // Remove "data: " prefix
            const parsed = JSON.parse(jsonStr);
            
            // Only collect content from content type messages
            if (parsed.type === 'content' && parsed.content) {
              // Update the message in real-time
              setMessages(prev => prev.map(msg => 
                msg.id === parseInt(aiMessageId)
                  ? { ...msg, text: msg.text + parsed.content }
                  : msg
              ));
              
              // Add throttled haptic feedback for meaningful content
              const trimmedContent = parsed.content.trim();
              if (trimmedContent.length > 2) {
                // Only trigger haptic for meaningful content chunks (more than 2 characters)
                // and throttle to prevent excessive calls
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                } catch (error) {
                  // Silently handle haptic errors to prevent crashes
                  console.log('Haptic feedback error:', error);
                }
              }
              
              // Auto-scroll as content comes in with smoother behavior
              setTimeout(() => {
                if (scrollViewRef.current && !isUserScrolling) {
                  // Only auto-scroll if user hasn't manually scrolled recently
                  scrollViewRef.current.scrollToEnd({ 
                    animated: true 
                  });
                }
              }, 150);
              
              // Add a small delay to simulate streaming effect
              await new Promise(resolve => setTimeout(resolve, 20));
            }
          } catch (parseError) {
            // Skip lines that can't be parsed as JSON
            console.log('Skipping unparseable line:', line);
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Generation was stopped by user');
        // Update message to show it was stopped
        setMessages(prev => prev.map(msg => 
          msg.id === parseInt(aiMessageId)
            ? { ...msg, text: msg.text + '\n\n[Generation stopped]' }
            : msg
        ));
      } else {
        console.error('Error fetching AI response:', error);
        // Fallback to error message
        setMessages(prev => prev.map(msg => 
          msg.id === parseInt(aiMessageId)
            ? { ...msg, text: 'Sorry, I encountered an error while connecting to the server. Please check your internet connection and try again.' }
            : msg
        ));
      }
    } finally {
      setIsGenerating(false);
      setCurrentGenerationId(null);
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      // If no current chat, create a new one
      let chatId = currentChatId;
      if (!chatId) {
        chatId = Date.now().toString();
        setCurrentChatId(chatId);
      }
      
      // Add user message
      const userMessage: Message = {
        id: messages.length + 1,
        text: message.trim(),
        isUser: true,
        timestamp: timeString,
      };
      
      // Create animation for user message
      const userMessageAnimation = new Animated.Value(0);
      setMessageAnimations(prev => ({
        ...prev,
        [userMessage.id]: userMessageAnimation
      }));
      
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      const currentMessage = message.trim();
      setMessage('');
      
      // Create placeholder AI message for real-time updates
      const aiMessageId = (newMessages.length + 1).toString();
      const aiMessage: Message = {
        id: parseInt(aiMessageId),
        text: '',
        isUser: false,
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
      };
      
      // Create animation for AI message
      const aiMessageAnimation = new Animated.Value(0);
      setMessageAnimations(prev => ({
        ...prev,
        [aiMessage.id]: aiMessageAnimation
      }));
      
      // Add the placeholder message immediately
      const messagesWithAI = [...newMessages, aiMessage];
      setMessages(messagesWithAI);
      
      // Update chat history with new message
      const updateChatHistory = (lastMessage: string, isNewChat: boolean = false) => {
        setChatHistory(prev => {
          const existingChatIndex = prev.findIndex(chat => chat.id === chatId);
          const now = new Date();
          const timestamp = 'Just now';
          
          if (existingChatIndex >= 0) {
            // Update existing chat
            const updated = [...prev];
            updated[existingChatIndex] = {
              ...updated[existingChatIndex],
              lastMessage,
              timestamp
            };
            // Move to top
            const [updatedChat] = updated.splice(existingChatIndex, 1);
            return [updatedChat, ...updated];
          } else if (isNewChat) {
            // Create new chat entry
            const title = currentMessage.length > 30 
              ? currentMessage.substring(0, 30) + '...' 
              : currentMessage;
            const newChatEntry: ChatHistory = {
              id: chatId!,
              title,
              lastMessage,
              timestamp
            };
            return [newChatEntry, ...prev];
          }
          return prev;
        });
      };
      
      // Update chat history with user message
      updateChatHistory(currentMessage, !currentChatId);
      
      // Save to allChats
      setAllChats(prev => ({
        ...prev,
        [chatId!]: messagesWithAI
      }));
      
      // Animate user message
      Animated.sequence([
        Animated.timing(userMessageAnimation, {
          toValue: 0.8,
          duration: 120,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.spring(userMessageAnimation, {
          toValue: 1,
          useNativeDriver: true,
          stiffness: 280,
          damping: 20,
          mass: 1,
        })
      ]).start();
      
      // Animate AI message placeholder
      Animated.sequence([
        Animated.timing(aiMessageAnimation, {
          toValue: 0.8,
          duration: 120,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: true,
        }),
        Animated.spring(aiMessageAnimation, {
          toValue: 1,
          useNativeDriver: true,
          stiffness: 280,
          damping: 20,
          mass: 1,
        })
      ]).start();
      
      // Auto-scroll for user message
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
          setIsUserScrolling(false); // Reset user scrolling when sending new message
        }
      }, 200);
      
      // Start streaming AI response
      await generateAIResponse(currentMessage, aiMessageId);
      
      // Update chat history and allChats with final AI response after streaming completes
      setTimeout(() => {
        setMessages(currentMessages => {
          const finalAIMessage = currentMessages.find(msg => msg.id === parseInt(aiMessageId));
          if (finalAIMessage && finalAIMessage.text) {
            updateChatHistory(finalAIMessage.text);
            setAllChats(prev => ({
              ...prev,
              [chatId!]: currentMessages
            }));
          }
          return currentMessages;
        });
      }, 1000);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setMessage(suggestion);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        const duration = Platform.OS === 'ios' ? event.duration : 300;
        Animated.timing(inputAnimation, {
          toValue: 1,
          duration: duration,
          easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
          useNativeDriver: false,
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
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, [inputAnimation]);

  // Reset side panel when component unmounts or navigation occurs
  useEffect(() => {
    return () => {
      // Close side panel when component unmounts (navigation away)
      if (showSideMenu) {
        setShowSideMenu(false);
        sideMenuAnimation.setValue(340);
        overlayOpacity.setValue(0);
      }
      
      // Clean up scroll timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [showSideMenu, sideMenuAnimation, overlayOpacity]);

  // Animate cursor blinking when generating
  useEffect(() => {
    if (isGenerating) {
      const blinkAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(cursorAnimation, {
            toValue: 0.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(cursorAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      blinkAnimation.start();
      return () => blinkAnimation.stop();
    } else {
      cursorAnimation.setValue(1);
    }
  }, [isGenerating, cursorAnimation]);
  
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBackPress}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.backIcon, { color: colors.secondaryText }]}>✕</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.primaryText }]}>
            Minara AI
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={toggleSideMenu}
          style={styles.menuButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Animated.View 
            style={[
              styles.hamburgerMenu,
              {
                transform: [{ scale: menuButtonScale }]
              }
            ]}
          >
            <View style={[styles.hamburgerLine, { backgroundColor: colors.primaryText }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: colors.primaryText }]} />
            <View style={[styles.hamburgerLine, { backgroundColor: colors.primaryText }]} />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Side Menu */}
      <Animated.View 
        style={[
          styles.sideMenu,
          {
            transform: [{ translateX: sideMenuAnimation }],
            backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
            borderLeftWidth: StyleSheet.hairlineWidth,
            borderLeftColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
            shadowColor: '#000000',
            shadowOffset: { width: -8, height: 0 },
            shadowOpacity: isDarkMode ? 0.6 : 0.15,
            shadowRadius: 24,
            elevation: 16,
          }
        ]}
        pointerEvents={showSideMenu ? 'auto' : 'none'}
      >
        <SafeAreaView style={styles.sideMenuContent}>
          {/* Side Menu Header */}
          <View style={styles.sideMenuHeader}>
            <Text style={[styles.sideMenuTitle, { color: colors.primaryText }]}>
              Chats
            </Text>
            <TouchableOpacity 
              onPress={handleNewChat}
              style={[styles.newChatButton, { backgroundColor: colors.sideMenuItemBackground }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.newChatIcon, { color: colors.sideMenuAccent }]}>✎</Text>
            </TouchableOpacity>
          </View>

          {/* New Chat Button */}
          <TouchableOpacity 
            style={[styles.newChatCard, { 
              backgroundColor: colors.newChatBackground,
              borderWidth: 1,
              borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)',
            }]}
            onPress={handleNewChat}
            activeOpacity={0.7}
          >
            <View style={[styles.newChatIconContainer, { backgroundColor: colors.sideMenuAccent }]}>
              <Text style={styles.newChatCardIcon}>+</Text>
            </View>
            <Text style={[styles.newChatText, { color: colors.primaryText }]}>
              New Chat
            </Text>
          </TouchableOpacity>

          {/* Chat History */}
          <View style={styles.chatHistorySection}>
            <Text style={[styles.sectionTitle, { color: colors.tertiaryText }]}>
              Recent
            </Text>
            <ScrollView 
              showsVerticalScrollIndicator={false}
              style={styles.chatHistoryList}
              scrollEnabled={showSideMenu}
            >
              {chatHistory.map((chat) => (
                <TouchableOpacity
                  key={chat.id}
                  style={[styles.chatHistoryItem, {
                    backgroundColor: colors.sideMenuItemBackground,
                  }]}
                  onPress={() => handleChatSelect(chat)}
                  activeOpacity={0.6}
                  disabled={!showSideMenu}
                >
                  <View style={styles.chatItemContent}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.chatTitle, { color: colors.primaryText }]} numberOfLines={1}>
                        {chat.title}
                      </Text>
                      <Text style={[styles.chatLastMessage, { color: colors.secondaryText }]} numberOfLines={1}>
                        {chat.lastMessage}
                      </Text>
                    </View>
                    <Text style={[styles.chatTimestamp, { color: colors.tertiaryText }]}>
                      {chat.timestamp}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Overlay to close side menu */}
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
            pointerEvents: showSideMenu ? 'auto' : 'none',
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.25)',
          }
        ]}
      >
        <TouchableOpacity 
          style={{ flex: 1 }}
          onPress={toggleSideMenu}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Messages Area */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={[
          styles.messagesContent,
          {
            justifyContent: messages.length > 0 ? 'flex-start' : 'flex-end',
            paddingTop: messages.length > 0 ? 20 : 40,
          }
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          const currentOffset = event.nativeEvent.contentOffset.y;
          setScrollPosition(currentOffset);
        }}
        onScrollBeginDrag={() => {
          setIsUserScrolling(true);
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
        }}
        onScrollEndDrag={() => {
          // Reset user scrolling flag after 2 seconds of no scrolling
          scrollTimeoutRef.current = setTimeout(() => {
            setIsUserScrolling(false);
          }, 2000);
        }}
        scrollEventThrottle={16}
      >
        {messages.map((msg, index) => {
          const prevMessage = messages[index - 1];
          const isConsecutive = prevMessage && prevMessage.isUser === msg.isUser;
          const messageAnimation = messageAnimations[msg.id];
          
          if (msg.isUser) {
            // User messages in bubbles (existing style)
            return (
              <View key={msg.id} style={[
                styles.messageRow, 
                styles.userMessageRow,
                { marginTop: isConsecutive ? 4 : 20 }
              ]}>
                <Animated.View style={[
                  styles.messageBubble,
                  { backgroundColor: colors.userMessageBackground },
                  !isConsecutive && styles.userMessageBubbleFirst,
                  messageAnimation && {
                    transform: [
                      {
                        scale: messageAnimation.interpolate({
                          inputRange: [0, 0.4, 0.8, 1],
                          outputRange: [0.3, 0.85, 1.02, 1],
                          extrapolate: 'clamp',
                        })
                      }
                    ],
                    opacity: messageAnimation.interpolate({
                      inputRange: [0, 0.3, 0.8, 1],
                      outputRange: [0, 0.7, 0.95, 1],
                      extrapolate: 'clamp',
                    }),
                  }
                ]}>
                  <Text style={[
                    styles.messageText,
                    { color: '#FFFFFF' }
                  ]}>
                    {msg.text}
                  </Text>
                </Animated.View>
              </View>
            );
          } else {
            // AI messages without bubbles (full width)
            return (
              <View key={msg.id} style={[
                styles.aiMessageContainer,
                { marginTop: isConsecutive ? 8 : 24 }
              ]}>
                <Animated.View style={[
                  styles.aiMessageContent,
                  {
                    backgroundColor: 'transparent',
                    paddingHorizontal: 0,
                  },
                  messageAnimation && {
                    transform: [
                      {
                        scale: messageAnimation.interpolate({
                          inputRange: [0, 0.4, 0.8, 1],
                          outputRange: [0.95, 0.98, 1.01, 1],
                          extrapolate: 'clamp',
                        })
                      }
                    ],
                    opacity: messageAnimation.interpolate({
                      inputRange: [0, 0.3, 0.8, 1],
                      outputRange: [0, 0.7, 0.95, 1],
                      extrapolate: 'clamp',
                    }),
                  }
                ]}>
                  <View style={[
                    styles.aiMessageText,
                    {
                      paddingHorizontal: 0,
                      paddingVertical: 0,
                    }
                  ]}>
                    {formatAIResponse(msg.text, colors, isDarkMode)}
                    {isGenerating && currentGenerationId === msg.id.toString() && (
                      <Animated.Text style={{ 
                        color: colors.primaryText, 
                        fontSize: 16,
                        opacity: cursorAnimation,
                        marginLeft: 2
                      }}>
                        ▊
                      </Animated.Text>
                    )}
                  </View>
                </Animated.View>
              </View>
            );
          }
        })}
      </ScrollView>

      {/* Bottom Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputSection}
      >
        {/* Suggestion Cards Slider */}
        {messages.length <= 1 && (
          <Animated.View style={[
            styles.suggestionsContainer,
            {
              opacity: inputAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
              transform: [{
                translateY: inputAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -50],
                  extrapolate: 'clamp',
                })
              }]
            }
          ]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsScrollContent}
              decelerationRate="fast"
              snapToInterval={280}
              snapToAlignment="start"
            >
              {suggestionPrompts.map((suggestion, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.suggestionCard, 
                    { backgroundColor: colors.suggestionBackground, borderColor: colors.suggestionBorder },
                    index === 0 && styles.firstSuggestionCard,
                    index === suggestionPrompts.length - 1 && styles.lastSuggestionCard
                  ]}
                  onPress={() => handleSuggestionPress(suggestion.prompt)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.suggestionTitle, { color: colors.primaryText }]}>
                    {suggestion.title}
                  </Text>
                  <Text style={[styles.suggestionSubtitle, { color: colors.secondaryText }]}>
                    {suggestion.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
        
        {/* Input Row */}
        <View style={styles.inputRowContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.plusButton}>
              <Text style={[styles.plusIcon, { color: colors.secondaryText }]}>+</Text>
            </TouchableOpacity>
            
            <View style={[styles.inputWrapper, { 
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder 
            }]}>
              <TextInput
                style={[styles.textInput, { color: colors.primaryText }]}
                placeholder="Ask anything"
                placeholderTextColor={colors.secondaryText}
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
                multiline
                maxLength={1000}
              />
              {message.trim() && (
                <TouchableOpacity 
                  onPress={handleSendMessage}
                  style={styles.sendButton}
                >
                  <Text style={styles.sendIcon}>↗</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <TouchableOpacity style={styles.micButton}>
              <Text style={styles.micIcon}>🎤</Text>
            </TouchableOpacity>
            
            {isGenerating ? (
              <TouchableOpacity 
                style={styles.stopButton}
                onPress={stopGeneration}
              >
                <View style={[styles.stopIcon, { backgroundColor: '#FF3B30' }]} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.audioButton}>
                <View style={styles.audioWaves}>
                  <View style={[styles.audioWave, { backgroundColor: colors.primaryText }]} />
                  <View style={[styles.audioWave, { backgroundColor: colors.primaryText }]} />
                  <View style={[styles.audioWave, { backgroundColor: colors.primaryText }]} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 12,
    zIndex: 1000,
  },
  menuButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerMenu: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hamburgerLine: {
    width: '100%',
    height: 2,
    borderRadius: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'AminMedium',
    letterSpacing: 0.5,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '300',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    minHeight: '100%',
  },
  messageRow: {
    width: '100%',
    alignItems: 'flex-start',
  },
  userMessageRow: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '85%',
    minWidth: 60,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  userMessageBubbleFirst: {
    borderBottomRightRadius: 8,
  },
  aiMessageBubbleFirst: {
    borderBottomLeftRadius: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'System',
  },
  inputSection: {
    paddingBottom: 34,
    paddingTop: 16,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsScrollContent: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  suggestionCard: {
    width: 260,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 12,
  },
  firstSuggestionCard: {
    marginLeft: 0,
  },
  lastSuggestionCard: {
    marginRight: 0,
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'System',
  },
  suggestionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 18,
  },
  inputRowContainer: {
    paddingHorizontal: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  plusButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  plusIcon: {
    fontSize: 20,
    fontWeight: '300',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'System',
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  micButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  micIcon: {
    fontSize: 18,
  },
  audioButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  audioWaves: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  audioWave: {
    width: 3,
    height: 12,
    borderRadius: 1.5,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 340,
    bottom: 0,
    zIndex: 1001,
    paddingLeft: 16,
    paddingRight: 16,
  },
  sideMenuContent: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  sideMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
    paddingHorizontal: 0,
  },
  sideMenuTitle: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'System',
    letterSpacing: -0.4,
  },
  newChatButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
  },
  newChatIcon: {
    fontSize: 22,
    fontWeight: '400',
  },
  chatHistorySection: {
    flex: 1,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 20,
    fontFamily: 'System',
    textTransform: 'uppercase',
    letterSpacing: -0.08,
    paddingHorizontal: 8,
  },
  chatHistoryList: {
    flex: 1,
    paddingHorizontal: 0,
    marginTop: 8,
  },
  chatHistoryItem: {
    padding: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 0,
  },
  chatItemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
    marginBottom: 2,
    letterSpacing: -0.32,
  },
  chatLastMessage: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 20,
    letterSpacing: -0.24,
  },
  chatTimestamp: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'System',
    textAlign: 'right',
    marginLeft: 12,
    minWidth: 70,
    letterSpacing: -0.08,
  },
  newChatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    marginBottom: 32,
    borderWidth: 1,
  },
  newChatIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  newChatCardIcon: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  newChatText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
    letterSpacing: -0.24,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  aiMessageContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  aiMessageContent: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  aiMessageText: {
    width: '100%',
  },
  stopButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stopIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
  },
}); 