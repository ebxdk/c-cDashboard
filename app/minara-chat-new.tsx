import { useColorScheme } from '@/hooks/useColorScheme';
import { StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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
    TouchableWithoutFeedback,
    View,
    Alert
} from 'react-native';
import chatApi, { AIChatSession, ChatMessage, UserProfile } from '../lib/chatApi';
import { supabase } from '../lib/supabaseClient';

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

// Clean ChatGPT-style formatting for AI responses
const formatAIResponse = (text: string, colors: any, isDarkMode: boolean, isGenerating: boolean, cursorAnimation: Animated.Value) => {
  if (!text) return null;
  
  // Split text into paragraphs for proper spacing
  const paragraphs = text.split(/\n\s*\n/);
  const formattedElements: React.ReactElement[] = [];
  let elementKey = 0;
  
  // Enhanced Arabic text processing with STRICT line separation
  const processArabicText = (text: string): React.ReactElement[] => {
    const segments: React.ReactElement[] = [];
    let segmentKey = elementKey * 1000 + Math.random() * 1000;
    
    // Check if text actually contains Arabic characters before processing
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    
    // If no Arabic text, return as-is with normal English styling
    if (!hasArabic) {
      return [
        <View key={`no-arabic-wrapper-${elementKey}-${segmentKey}`} style={{
          width: '100%',
          marginVertical: 4,
        }}>
          <Text style={{ 
            color: colors.primaryText,
            fontSize: 18,
            lineHeight: 26,
            width: '100%',
            flexShrink: 1,
            paddingVertical: 4,
            textAlign: 'left',
          }}>
            {text}
          </Text>
        </View>
      ];
    }
    
    // Enhanced Arabic detection with word boundaries
    const arabicRegex = /[\u0600-\u06FF][\u0600-\u06FF\s\u060C\u061B\u061F\u0640\u064B-\u065F\u0670\u06D6-\u06ED\u06F0-\u06F9\u0750-\u077F\(\)\[\]\{\}\"\'،\.:\,0-9\(\)\[\]\{\};]*[\u0600-\u06FF]/g;
    
    // Split text into segments with FORCED line breaks between Arabic and English
    let lastIndex = 0;
    let match;
    const segments_data: Array<{
      type: 'english' | 'arabic';
      text: string;
      start: number;
      end: number;
    }> = [];
    
    // Collect all Arabic matches
    while ((match = arabicRegex.exec(text)) !== null) {
      // Add any English text before this Arabic match
      if (match.index > lastIndex) {
        const englishText = text.slice(lastIndex, match.index);
        // Don't trim to preserve spacing, but ensure we have actual content
        if (englishText && englishText.trim()) {
          segments_data.push({
            type: 'english',
            text: englishText.trim(), // Trim for clean display
            start: lastIndex,
            end: match.index
          });
        }
      }
      
      // Add the Arabic text
      const arabicText = match[0];
      if (arabicText && arabicText.trim()) {
        segments_data.push({
          type: 'arabic',
          text: arabicText.trim(), // Trim for clean display
          start: match.index,
          end: match.index + match[0].length
        });
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining English text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText && remainingText.trim()) {
        segments_data.push({
          type: 'english',
          text: remainingText.trim(), // Trim for clean display
          start: lastIndex,
          end: text.length
        });
      }
    }
    
    // Reset regex
    arabicRegex.lastIndex = 0;
    
    // Render segments with STRICT separation and NEW LINE enforcement
    segments_data.forEach((segment, index) => {
      if (segment.type === 'arabic') {
        // FORCE NEW LINE: Add Arabic text with complete line separation
        segments.push(
          <View key={`arabic-line-break-${elementKey}-${segmentKey++}`} style={{
            width: '100%',
            marginTop: index === 0 ? 0 : 20, // Force clear separation from previous content
            marginBottom: 20, // Force clear separation from next content
          }}>
            <View style={{
              paddingVertical: 24,
              paddingHorizontal: 24,
              backgroundColor: isDarkMode ? 'rgba(135, 206, 235, 0.08)' : 'rgba(135, 206, 235, 0.12)',
              borderRadius: 16,
              borderRightWidth: 4,
              borderRightColor: '#87CEEB',
              borderLeftWidth: 0,
              width: '100%',
              maxWidth: '100%',
              alignSelf: 'stretch',
              marginHorizontal: 0,
              minHeight: 80,
              shadowColor: isDarkMode ? '#000000' : '#87CEEB',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: isDarkMode ? 0.2 : 0.08,
              shadowRadius: 3,
              elevation: 2,
              overflow: 'visible',
              justifyContent: 'center',
              alignItems: 'stretch',
            }}>
              <Text
                style={{
                  color: '#4A90E2',
                  fontWeight: '500',
                  fontSize: 20,
                  lineHeight: 38,
                  textAlign: 'right',
                  direction: 'rtl',
                  fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'Noto Sans Arabic',
                  width: '100%',
                  flexShrink: 1,
                  flexWrap: 'wrap',
                  paddingVertical: 8,
                  paddingHorizontal: 4,
                  textAlignVertical: 'center',
                  includeFontPadding: false,
                  writingDirection: 'rtl',
                  letterSpacing: 0,
                  textShadowColor: 'transparent',
                  textDecorationLine: 'none',
                  maxWidth: '100%',
                  overflow: 'visible',
                  wordWrap: 'break-word' as any,
                }}
                numberOfLines={0}
                ellipsizeMode="clip"
                adjustsFontSizeToFit={false}
                allowFontScaling={true}
                selectable={false}
              >
                {segment.text}
              </Text>
            </View>
          </View>
        );
      } else {
        // FORCE NEW LINE: Add English text with complete line separation
        segments.push(
          <View key={`english-line-break-${elementKey}-${segmentKey++}`} style={{
            width: '100%',
            marginTop: index === 0 ? 0 : 20, // Force clear separation from previous content
            marginBottom: 20, // Force clear separation from next content
          }}>
            <Text style={{
              color: colors.primaryText,
              fontSize: 18,
              lineHeight: 26,
              width: '100%',
              flexShrink: 1,
              paddingVertical: 4,
              textAlign: 'left',
            }}>
              {segment.text}
            </Text>
          </View>
        );
      }
    });
    
    return segments;
  };
  
  // Process each paragraph
  paragraphs.forEach((paragraph, index) => {
    if (paragraph.trim()) {
      const processedParagraph = processArabicText(paragraph.trim());
      formattedElements.push(...processedParagraph);
      elementKey++;
    }
  });
  
  // Add cursor animation for generating state
  if (isGenerating) {
    formattedElements.push(
      <Animated.Text
        key="cursor"
        style={{
          color: colors.primaryText,
          fontSize: 18,
          opacity: cursorAnimation,
        }}
      >
        |
      </Animated.Text>
    );
  }
  
  return formattedElements;
};

export default function MinaraChatScreen() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';
  
  // Supabase integration states
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [aiSessions, setAiSessions] = useState<AIChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [cursorAnimation] = useState(new Animated.Value(1));
  const [message, setMessage] = useState('');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [sideMenuAnimation] = useState(new Animated.Value(340));
  const [overlayOpacity] = useState(new Animated.Value(0));
  const [inputAnimation] = useState(new Animated.Value(0));
  const [messageAnimations, setMessageAnimations] = useState<{[key: number]: Animated.Value}>({});
  const [menuButtonScale] = useState(new Animated.Value(1));
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Dropdown states for ChatGPT-style selector
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedApp, setSelectedApp] = useState('MinaraX');
  const [dropdownAnimation] = useState(new Animated.Value(0));
  const [dropdownButtonScale] = useState(new Animated.Value(1));
  
  const scrollViewRef = useRef<ScrollView>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const params = useLocalSearchParams();

  // Supabase integration functions
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load current user profile
      const userProfile = await chatApi.userProfile.getCurrentProfile();
      setCurrentUser(userProfile);
      
      // Load AI chat sessions
      const sessions = await chatApi.ai.getUserSessions();
      setAiSessions(sessions);
      
      // Set first session as current if available
      if (sessions.length > 0) {
        setCurrentSessionId(sessions[0].id);
        await loadSessionMessages(sessions[0].id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load chat data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      // For AI chat, use the AI-specific function that bypasses room participant checks
      const sessionMessages = await chatApi.ai.getSessionMessages(sessionId);
      setMessages(sessionMessages);
    } catch (error) {
      console.error('Error loading session messages:', error);
    }
  };



  // Function to generate descriptive chat title from first message
  const generateChatTitle = (message: string): string => {
    // Clean the message
    const cleanMessage = message.trim().toLowerCase();
    
    // Common Islamic topics and keywords
    const islamicTopics = {
      'prayer': 'Prayer Guidance',
      'wudu': 'Wudu & Ablution',
      'quran': 'Quran Study',
      'hadith': 'Hadith Discussion',
      'ramadan': 'Ramadan & Fasting',
      'hajj': 'Hajj & Umrah',
      'halal': 'Halal & Haram',
      'zakat': 'Zakat & Charity',
      'dua': 'Duas & Supplications',
      'salah': 'Prayer Times',
      'islamic': 'Islamic Knowledge',
      'prophet': 'Prophet Muhammad ﷺ',
      'allah': 'Allah & Tawheed',
      'jannah': 'Paradise & Afterlife',
      'sunnah': 'Sunnah Practices',
      'fiqh': 'Islamic Law',
      'aqeedah': 'Islamic Beliefs',
      'tajweed': 'Quran Recitation',
      'sadaqah': 'Charity & Giving',
      'dhikr': 'Remembrance of Allah'
    };
    
    // Check for Islamic topics first
    for (const [keyword, title] of Object.entries(islamicTopics)) {
      if (cleanMessage.includes(keyword)) {
        return title;
      }
    }
    
    // Check for question patterns
    if (cleanMessage.includes('what is') || cleanMessage.includes('what are')) {
      const words = cleanMessage.split(' ');
      const topicIndex = words.indexOf('is') + 1;
      if (topicIndex < words.length) {
        const topic = words.slice(topicIndex, topicIndex + 3).join(' ');
        return `${topic.charAt(0).toUpperCase() + topic.slice(1)}`;
      }
    }
    
    if (cleanMessage.includes('how to') || cleanMessage.includes('how do')) {
      const words = cleanMessage.split(' ');
      const topicIndex = words.indexOf('to') + 1;
      if (topicIndex < words.length) {
        const topic = words.slice(topicIndex, topicIndex + 3).join(' ');
        return `How to ${topic.charAt(0).toUpperCase() + topic.slice(1)}`;
      }
    }
    
    // Check for specific topics
    if (cleanMessage.includes('pillars')) return 'Five Pillars of Islam';
    if (cleanMessage.includes('shahada')) return 'Shahada & Faith';
    if (cleanMessage.includes('fasting')) return 'Fasting & Ramadan';
    if (cleanMessage.includes('charity')) return 'Charity & Zakat';
    if (cleanMessage.includes('pilgrimage')) return 'Hajj & Pilgrimage';
    if (cleanMessage.includes('morning') || cleanMessage.includes('evening')) return 'Morning/Evening Duas';
    if (cleanMessage.includes('food') || cleanMessage.includes('eating')) return 'Halal Food & Diet';
    if (cleanMessage.includes('finance') || cleanMessage.includes('banking')) return 'Islamic Finance';
    if (cleanMessage.includes('family') || cleanMessage.includes('marriage')) return 'Family & Marriage';
    if (cleanMessage.includes('education') || cleanMessage.includes('learning')) return 'Islamic Education';
    
    // Default: use first few words of the message
    const words = cleanMessage.split(' ').slice(0, 4);
    if (words.length > 0) {
      const title = words.join(' ').charAt(0).toUpperCase() + words.join(' ').slice(1);
      return title.length > 30 ? title.substring(0, 30) + '...' : title;
    }
    
    return 'New Chat';
  };

  // Convert AI sessions to chat history format for UI
  const chatHistory: ChatHistory[] = aiSessions.map(session => ({
    id: session.id,
    title: session.title,
    lastMessage: session.last_message || 'No messages yet',
    timestamp: new Date(session.updated_at).toLocaleDateString()
  }));

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
    dropdownBackground: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    dropdownBorder: isDarkMode ? 'rgba(84, 84, 88, 0.3)' : '#E5E5EA',
    dropdownShadow: '#000000',
    dropdownItemText: isDarkMode ? '#FFFFFF' : '#000000',
    dropdownDivider: isDarkMode ? 'rgba(84, 84, 88, 0.6)' : '#E5E5EA',
    checkmarkColor: '#007AFF',
  };

  const handleBackPress = () => {
    console.log('Back button pressed - navigating back');
    Alert.alert('Back Button', 'Back button pressed! Navigating back...');
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.back();
    } catch (error) {
      console.error('Error navigating back:', error);
      // Fallback: try to go to dashboard
      router.push('/dashboard');
    }
  };

  const toggleSideMenu = () => {
    const newState = !showSideMenu;
    const toValue = newState ? 0 : 340;
    
    Animated.parallel([
      Animated.spring(sideMenuAnimation, {
        toValue,
        useNativeDriver: false,
        tension: 120,
        friction: 9,
      }),
      Animated.timing(overlayOpacity, {
        toValue: newState ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
    
    setShowSideMenu(newState);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleNewChat = async () => {
    try {
      // Create a new chat session
      const newSessionId = await chatApi.ai.createSession('New Chat');
      if (newSessionId) {
        setCurrentSessionId(newSessionId);
        setMessages([]);
        setMessage('');
        setMessageAnimations({});
        
        // Reload sessions list and reorder - new session should be at top
        const updatedSessions = await chatApi.ai.getUserSessions();
        setAiSessions(updatedSessions);
        
        // Close side menu
        toggleSideMenu();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      Alert.alert('Error', 'Failed to create new chat session.');
    }
  };

  const handleChatSelect = async (chat: ChatHistory) => {
    // Load the selected chat's messages
    setCurrentSessionId(chat.id);
    await loadSessionMessages(chat.id);
    
    // Reorder sessions - move selected chat to top
    setAiSessions(prevSessions => {
      const selectedSession = prevSessions.find(session => session.id === chat.id);
      if (selectedSession) {
        const otherSessions = prevSessions.filter(session => session.id !== chat.id);
        return [selectedSession, ...otherSessions];
      }
      return prevSessions;
    });
    
    // Reset message animations for the loaded chat
    const newAnimations: {[key: number]: Animated.Value} = {};
    messages.forEach(msg => {
      newAnimations[parseInt(msg.id)] = new Animated.Value(1); // Already visible
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
      
      const mode = 'minara';
      const apiUrl = `https://minara-3-ebadkhan5487.replit.app/api/${mode}/stream?query=${encodeURIComponent(userMessage)}`;
      
      // Add timeout to prevent hanging requests
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, 30000); // 30 second timeout
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-API-Key': 'ebadkhan5487minara',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'MinaraApp/1.0',
        },
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}: ${response.statusText}`);
      }

      // Check if response has content
      const responseText = await response.text();
      
      if (!responseText || responseText.trim().length === 0) {
        throw new Error('Empty response from server');
      }
      
      const lines = responseText.split('\n');
      let hasContent = false;
      let aiResponseText = '';
      
      // Process each line with error handling
      for (let i = 0; i < lines.length; i++) {
        // Check if generation was stopped
        if (abortController.signal.aborted) {
          break;
        }
        
        const line = lines[i].trim();
        
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.substring(6);
            if (jsonStr === '[DONE]') {
              break;
            }
            
            const parsed = JSON.parse(jsonStr);
            
            // Only collect content from content type messages
            if (parsed.type === 'content' && parsed.content) {
              hasContent = true;
              aiResponseText += parsed.content;
              
              // Update the message in smaller batches for better real-time formatting
              setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId
                  ? { ...msg, content: aiResponseText }
                  : msg
              ));
              
              // Reduced haptic feedback frequency for better performance
              const trimmedContent = parsed.content.trim();
              if (trimmedContent.length > 15 && i % 15 === 0) {
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                } catch (error) {
                  // Silently handle haptic errors
                  console.log('Haptic feedback error:', error);
                }
              }
              
              // Auto-scroll with optimized frequency for smoother experience
              setTimeout(() => {
                if (scrollViewRef.current && !isUserScrolling) {
                  scrollViewRef.current.scrollToEnd({ 
                    animated: true 
                  });
                }
              }, 150);
              
              // Reduced delay for better streaming speed and real-time formatting
              await new Promise(resolve => setTimeout(resolve, 3));
            }
          } catch (parseError) {
            // Skip lines that can't be parsed as JSON
            console.log('Skipping unparseable line:', line);
          }
        }
      }
      
      // If no content was received, show an error
      if (!hasContent) {
        throw new Error('No content received from the server. The AI service may be temporarily unavailable.');
      }
      
      // Update session last message
      if (currentSessionId) {
        await chatApi.ai.updateSessionLastMessage(currentSessionId, aiResponseText);
      }
      
    } catch (error: any) {
      console.error('Error fetching AI response:', error);
      
      let errorMessage = 'Sorry, I encountered an unexpected error. Please try again.';
      
      if (error.name === 'AbortError') {
        console.log('Generation was stopped by user');
        errorMessage = '[Generation stopped]';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Unable to connect to the AI service. Please check your internet connection and try again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'The request timed out. Please try again with a shorter message.';
      } else if (error.message.includes('status')) {
        errorMessage = `Server error: ${error.message}. Please try again later.`;
      } else if (error.message.includes('Empty response')) {
        errorMessage = 'The AI service returned an empty response. Please try again.';
      } else if (error.message.includes('No content received')) {
        errorMessage = error.message;
      }
      
      // Update message with appropriate error
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId
          ? { ...msg, content: msg.content + (msg.content ? '\n\n' : '') + errorMessage }
          : msg
      ));
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
    if (!message.trim() || !currentSessionId || !currentUser) return;
    
    const userMessage = message.trim();
    setMessage('');
    
    try {
      // Send user message to Supabase using AI-specific function
      const userMessageId = await chatApi.ai.sendSessionMessage(
        currentSessionId,
        userMessage,
        'text'
      );
      
      if (userMessageId) {
        // Add user message to local state
        const newUserMessage: ChatMessage = {
          id: userMessageId,
          room_id: currentSessionId,
          sender_id: currentUser.id,
          content: userMessage,
          message_type: 'text',
          is_edited: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          sender_profile: currentUser
        };
        
        setMessages(prev => [...prev, newUserMessage]);
        
        // Create AI message placeholder
        const aiMessageId = `ai-${Date.now()}`;
        const aiMessage: ChatMessage = {
          id: aiMessageId,
          room_id: currentSessionId,
          sender_id: 'ai-assistant',
          content: '',
          message_type: 'ai_response',
          is_edited: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // Generate AI response
        await generateAIResponse(userMessage, aiMessageId);
        
        // Update session last message and title if this is the first message
        const currentSession = aiSessions.find(session => session.id === currentSessionId);
        const isFirstMessage = messages.length === 0;
        
        if (isFirstMessage && currentSession?.title === 'New Chat') {
          // Generate descriptive title from the first message
          const descriptiveTitle = generateChatTitle(userMessage);
          
          // Update session with new title and last message
          await chatApi.ai.updateSessionLastMessage(currentSessionId, userMessage);
          
          // Update session title in Supabase (we'll need to add this function)
          try {
            await supabase
              .from('ai_chat_sessions')
              .update({ title: descriptiveTitle })
              .eq('id', currentSessionId);
          } catch (error) {
            console.error('Error updating session title:', error);
          }
          
          // Update local state with new title
          setAiSessions(prevSessions => {
            const updatedSessions = prevSessions.map(session => 
              session.id === currentSessionId 
                ? { ...session, title: descriptiveTitle, last_message: userMessage }
                : session
            );
            // Move current session to top
            const currentSession = updatedSessions.find(session => session.id === currentSessionId);
            const otherSessions = updatedSessions.filter(session => session.id !== currentSessionId);
            return currentSession ? [currentSession, ...otherSessions] : updatedSessions;
          });
        } else {
          // Just update last message for existing conversations
          await chatApi.ai.updateSessionLastMessage(currentSessionId, userMessage);
          
          // Reorder sessions - move current session to top when message is sent
          setAiSessions(prevSessions => {
            const currentSession = prevSessions.find(session => session.id === currentSessionId);
            if (currentSession) {
              const otherSessions = prevSessions.filter(session => session.id !== currentSessionId);
              return [currentSession, ...otherSessions];
            }
            return prevSessions;
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleSuggestionPress = async (suggestion: string) => {
    setMessage(suggestion);
    
    // If this is a new chat, update the title based on the suggestion
    const currentSession = aiSessions.find(session => session.id === currentSessionId);
    if (currentSession?.title === 'New Chat') {
      const descriptiveTitle = generateChatTitle(suggestion);
      
      // Update session title in Supabase
      try {
        await supabase
          .from('ai_chat_sessions')
          .update({ title: descriptiveTitle })
          .eq('id', currentSessionId);
        
        // Update local state
        setAiSessions(prevSessions => 
          prevSessions.map(session => 
            session.id === currentSessionId 
              ? { ...session, title: descriptiveTitle }
              : session
          )
        );
      } catch (error) {
        console.error('Error updating session title:', error);
      }
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleDropdown = () => {
    const newState = !showDropdown;
    
    Animated.parallel([
      Animated.timing(dropdownAnimation, {
        toValue: newState ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(dropdownButtonScale, {
        toValue: newState ? 0.95 : 1,
        useNativeDriver: true,
      }),
    ]).start();
    
    setShowDropdown(newState);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleAppSelect = (appName: string) => {
    setSelectedApp(appName);
    toggleDropdown();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleScholarXSelection = () => {
    setSelectedApp('ScholarX');
    toggleDropdown();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  // Load user data and create new session on component mount
  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        
        // Load current user profile
        const userProfile = await chatApi.userProfile.getCurrentProfile();
        setCurrentUser(userProfile);
        
        // Load AI chat sessions
        const sessions = await chatApi.ai.getUserSessions();
        setAiSessions(sessions);
        
        // Create a new session for this chat
        const newSessionId = await chatApi.ai.createSession('New Chat');
        if (newSessionId) {
          setCurrentSessionId(newSessionId);
          setMessages([]);
          
          // Reload sessions list to include the new session
          const updatedSessions = await chatApi.ai.getUserSessions();
          setAiSessions(updatedSessions);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        Alert.alert('Error', 'Failed to initialize chat. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeChat();
  }, []);

  // Real-time subscriptions for AI chat
  useEffect(() => {
    if (currentSessionId) {
      // Subscribe to real-time messages for this session
      const channel = chatApi.realtime.subscribeToRoomMessages(
        currentSessionId,
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
        chatApi.realtime.unsubscribe(`room:${currentSessionId}`);
      };
    }
  }, [currentSessionId]);

  // Cursor animation for generating state
  useEffect(() => {
    if (isGenerating) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(cursorAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(cursorAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [isGenerating, cursorAnimation]);

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.loadingText, { color: colors.primaryText }]}>Loading Minara Chat...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={handleBackPress} 
          style={[styles.backButton, { backgroundColor: colors.inputBackground }]}
          activeOpacity={0.7}
        >
          <Text style={[styles.backButtonText, { color: colors.primaryText }]}>←</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <TouchableOpacity onPress={toggleDropdown} style={styles.appSelector}>
            <Animated.Text style={[
              styles.appSelectorText,
              { 
                color: colors.primaryText,
                transform: [{ scale: dropdownButtonScale }]
              }
            ]}>
              {selectedApp}
            </Animated.Text>
            <Text style={[styles.dropdownArrow, { color: colors.secondaryText }]}>▼</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={toggleSideMenu} style={styles.menuButton}>
          <Animated.Text style={[
            styles.menuButtonText,
            { 
              color: colors.primaryText,
              transform: [{ scale: menuButtonScale }]
            }
          ]}>
            ☰
          </Animated.Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          style={styles.mainContent}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 100}
        >
        {/* Messages Area */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="never"
          onScrollBeginDrag={() => setIsUserScrolling(true)}
          onScrollEndDrag={() => setIsUserScrolling(false)}
          onContentSizeChange={() => {
            if (!isUserScrolling) {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }
          }}
          onLayout={() => {
            if (!isUserScrolling) {
              scrollViewRef.current?.scrollToEnd({ animated: false });
            }
          }}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[
              styles.messageContainer,
              msg.sender_id === currentUser?.id ? styles.userMessage : styles.aiMessage
            ]}>
              <View style={[
                styles.messageBubble,
                msg.sender_id === currentUser?.id 
                  ? { backgroundColor: colors.userMessageBackground }
                  : { backgroundColor: colors.messageBackground }
              ]}>
                {msg.sender_id === currentUser?.id ? (
                  <Text style={[styles.messageText, { color: '#FFFFFF' }]}>
                    {msg.content}
                  </Text>
                ) : (
                  <View>
                    {formatAIResponse(msg.content, colors, isDarkMode, isGenerating && currentGenerationId === msg.id, cursorAnimation)}
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground }]}>
          <TextInput
            style={[
              styles.textInput,
              { 
                color: colors.primaryText,
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder
              }
            ]}
            placeholder="Message Minara..."
            placeholderTextColor={colors.secondaryText}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 300);
            }}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              { 
                backgroundColor: message.trim() ? colors.userMessageBackground : colors.secondaryText,
                opacity: message.trim() ? 1 : 0.5
              }
            ]}
            onPress={handleSendMessage}
            disabled={!message.trim() || isGenerating}
          >
            <Text style={styles.sendButtonText}>
              {isGenerating ? '⏹️' : '→'}
            </Text>
          </TouchableOpacity>
        </View>
              </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {/* Side Menu */}
      {showSideMenu && (
        <Animated.View 
          style={[
            styles.sideMenuOverlay,
            { opacity: overlayOpacity }
          ]}
        >
          <TouchableOpacity 
            style={styles.sideMenuOverlayTouchable}
            onPress={toggleSideMenu}
          />
        </Animated.View>
      )}
      
      <Animated.View 
        style={[
          styles.sideMenu,
          { 
            backgroundColor: colors.sideMenuBackground,
            transform: [{ translateX: sideMenuAnimation }]
          }
        ]}
      >
        <View style={styles.sideMenuHeader}>
          <View style={styles.sideMenuHeaderTop}>
            <TouchableOpacity 
              style={styles.sideMenuBackButton}
              onPress={toggleSideMenu}
            >
              <Text style={[styles.sideMenuBackButtonText, { color: colors.primaryText }]}>←</Text>
            </TouchableOpacity>
            <Text style={[styles.sideMenuTitle, { color: colors.primaryText }]}>Chat History</Text>
          </View>
          <TouchableOpacity 
            style={[styles.newChatButton, { backgroundColor: colors.newChatBackground }]}
            onPress={handleNewChat}
          >
            <Text style={[styles.newChatButtonText, { color: colors.sideMenuAccent }]}>
              + New Chat
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.chatHistoryContainer}>
          {chatHistory.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={[
                styles.chatHistoryItem,
                { 
                  backgroundColor: currentSessionId === chat.id 
                    ? colors.sideMenuItemHover 
                    : 'transparent'
                }
              ]}
              onPress={() => handleChatSelect(chat)}
            >
              <Text style={[styles.chatHistoryTitle, { color: colors.primaryText }]}>
                {chat.title}
              </Text>
              <Text style={[styles.chatHistorySubtitle, { color: colors.secondaryText }]}>
                {chat.lastMessage}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Suggestions */}
      {messages.length === 0 && (
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsTitle, { color: colors.primaryText }]}>
            How can I help you today?
          </Text>
          <View style={styles.suggestionsGrid}>
            {suggestionPrompts.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionCard,
                  { 
                    backgroundColor: colors.suggestionBackground,
                    borderColor: colors.suggestionBorder
                  }
                ]}
                onPress={() => handleSuggestionPress(suggestion.prompt)}
              >
                <Text style={[styles.suggestionTitle, { color: colors.primaryText }]}>
                  {suggestion.title}
                </Text>
                <Text style={[styles.suggestionSubtitle, { color: colors.secondaryText }]}>
                  {suggestion.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
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
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(255,255,255,0.95)',
    zIndex: 10,
  },
  backButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  appSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  appSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  dropdownArrow: {
    fontSize: 12,
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 100, // Add space for navigation bar
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 40, // More space above input to prevent overlap
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
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
    paddingBottom: 30, // Extra padding to stay above navigation bar
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(255,255,255,0.98)', // More opaque background
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    fontSize: 16,
    marginRight: 12,
    borderWidth: 1,
    lineHeight: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sideMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  sideMenuOverlayTouchable: {
    flex: 1,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 340,
    zIndex: 1001,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.1)',
  },
  sideMenuHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sideMenuHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sideMenuBackButton: {
    padding: 8,
    marginRight: 12,
  },
  sideMenuBackButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  sideMenuTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  newChatButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  newChatButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  chatHistoryContainer: {
    flex: 1,
  },
  chatHistoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  chatHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  chatHistorySubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '50%',
    left: 16,
    right: 16,
    transform: [{ translateY: -100 }],
  },
  suggestionsTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  suggestionSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
}); 