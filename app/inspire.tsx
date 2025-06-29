import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

export default function InspireScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const systemColorScheme = useColorScheme();
  const isDarkMode = systemColorScheme === 'dark';
  const [currentQuoteIndex, setCurrentQuoteIndex] = React.useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);
  
  // Screen width for calculating scroll positions
  const screenWidth = React.useMemo(() => {
    const { width } = require('react-native').Dimensions.get('window');
    return width;
  }, []);

  const islamicQuotes = [
    {
      text: "Indeed, with hardship comes ease.",
      reference: "Quran 94:6"
    },
    {
      text: "Allah is sufficient for us.",
      reference: "Quran 3:173"
    },
    {
      text: "So remember Me; I will remember you.",
      reference: "Quran 2:152"
    },
    {
      text: "The best among you are those who have the best character.",
      reference: "Prophet Muhammad ﷺ"
    },
    {
      text: "Whoever relies upon Allah - He is sufficient for him.",
      reference: "Quran 65:3"
    },
    {
      text: "Be kind, for kindness beautifies everything.",
      reference: "Prophet Muhammad ﷺ"
    },
    {
      text: "Verily, in the remembrance of Allah do hearts find rest.",
      reference: "Quran 13:28"
    },
    {
      text: "The strong person controls himself when angry.",
      reference: "Prophet Muhammad ﷺ"
    },
    {
      text: "And He is with you wherever you are.",
      reference: "Quran 57:4"
    },
    {
      text: "Speak good or remain silent.",
      reference: "Prophet Muhammad ﷺ"
    }
  ];

  // Handle scroll events to update current quote index
  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const cardWidth = screenWidth;
    const newIndex = Math.round(scrollX / cardWidth);
    
    if (newIndex !== currentQuoteIndex && newIndex >= 0 && newIndex < islamicQuotes.length) {
      setCurrentQuoteIndex(newIndex);
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.back();
  };

  // Function to render text with translucent key words
  const renderStyledText = (quote: { text: string; reference: string }) => {
    const keyWords = ['Allah', 'Me', 'He', 'hardship', 'ease', 'kind', 'kindness', 'hearts', 'strong', 'good'];
    const words = quote.text.split(' ');
    
    return (
      <>
        <Text style={{
          textAlign: 'left',
          lineHeight: 52,
          marginBottom: 16,
        }}>
          {words.map((word, index) => {
            const cleanWord = word.replace(/[.,;:!?]/g, '');
            const isKeyWord = keyWords.some(keyWord => 
              cleanWord.toLowerCase() === keyWord.toLowerCase()
            );
            
            return (
              <Text
                key={index}
                style={{
                  opacity: isKeyWord ? 0.7 : 1,
                  fontSize: 36,
                  fontWeight: '800',
                  color: '#FFFFFF',
                  fontFamily: 'System',
                  letterSpacing: -0.6,
                }}
              >
                {word}{index < words.length - 1 ? ' ' : ''}
              </Text>
            );
          })}
        </Text>
        <Text style={{
          fontSize: 18,
          color: '#FFFFFF',
          opacity: 0.9,
          fontFamily: 'System',
          fontWeight: '600',
          textAlign: 'left',
        }}>
          {quote.reference}
        </Text>
      </>
    );
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: isDarkMode ? '#6B9BD1' : '#5A8BC4',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Stack.Screen options={{ 
        headerShown: false,
        animation: params.noAnim === '1' ? 'none' : undefined 
      }} />
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Background gradient layers - Circular gradients */}
      <View style={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: isDarkMode ? '#0A1A2A' : '#081828',
        opacity: 1,
      }} />
      
      <View style={{
        position: 'absolute',
        top: -150,
        right: -150,
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: isDarkMode ? '#0A1A2A' : '#081828',
        opacity: 1,
      }} />
      
      <View style={{
        position: 'absolute',
        top: -200,
        right: -200,
        width: 500,
        height: 500,
        borderRadius: 250,
        backgroundColor: isDarkMode ? '#1A2F4A' : '#0F2A4F',
        opacity: 0.8,
      }} />
      
      <View style={{
        position: 'absolute',
        top: -250,
        right: -250,
        width: 600,
        height: 600,
        borderRadius: 300,
        backgroundColor: isDarkMode ? '#2A4F6A' : '#1F3F5F',
        opacity: 0.6,
      }} />

      <View style={{
        position: 'absolute',
        top: -300,
        right: -300,
        width: 800,
        height: 800,
        borderRadius: 400,
        backgroundColor: isDarkMode ? '#3A5F7A' : '#2F4F6F',
        opacity: 0.4,
      }} />

      <View style={{
        position: 'absolute',
        top: -350,
        right: -350,
        width: 1000,
        height: 1000,
        borderRadius: 500,
        backgroundColor: isDarkMode ? '#4A6F8A' : '#3F5F7F',
        opacity: 0.2,
      }} />
      
      <BlurView
        intensity={400}
        tint="light"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Back button */}
      <TouchableOpacity
        onPress={handleClose}
        style={{
          position: 'absolute',
          top: 60,
          left: 24,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.15)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          overflow: 'hidden',
        }}
        activeOpacity={0.7}
      >
        <BlurView
          intensity={isDarkMode ? 40 : 60}
          tint={isDarkMode ? "dark" : "light"}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 22,
          }}
        />
        <IconSymbol name="chevron.left" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Single Card Container */}
      <View style={{
        flex: 1,
        marginTop: 120,
        marginBottom: 160,
        marginHorizontal: 24,
        borderRadius: 32,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.15)',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 12,
        overflow: 'hidden',
      }}>
        <BlurView
          intensity={isDarkMode ? 40 : 60}
          tint={isDarkMode ? "dark" : "light"}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 32,
          }}
        />
        
        <View style={{
          position: 'absolute',
          top: 2,
          left: 2,
          right: 2,
          bottom: 2,
          borderRadius: 30,
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.08)',
          borderWidth: 0.5,
          borderColor: 'rgba(255, 255, 255, 0.2)',
        }} />

        {/* Horizontal ScrollView with quotes inside the single card */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          style={{
            flex: 1,
          }}
          contentContainerStyle={{
            flexDirection: 'row',
          }}
        >
          {islamicQuotes.map((quote, index) => (
            <View
              key={index}
              style={{
                width: screenWidth - 48, // Full width minus card margins
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                padding: 32,
              }}
            >
              {/* Quote content */}
              <View style={{ 
                zIndex: 1, 
                width: '100%',
              }}>
                {renderStyledText(quote)}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Simple dots indicator */}
      <View style={{
        position: 'absolute',
        bottom: 140,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
      }}>
        {islamicQuotes.map((_, index) => (
          <View
            key={index}
            style={{
              width: index === currentQuoteIndex ? 7 : 5,
              height: index === currentQuoteIndex ? 7 : 5,
              borderRadius: index === currentQuoteIndex ? 3.5 : 2.5,
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.2)',
              opacity: index === currentQuoteIndex ? 1 : 0.5,
              overflow: 'hidden',
            }}
          >
            <BlurView
              intensity={isDarkMode ? 40 : 60}
              tint={isDarkMode ? "dark" : "light"}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: index === currentQuoteIndex ? 3.5 : 2.5,
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
} 