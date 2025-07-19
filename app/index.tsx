import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { startAsync, makeRedirectUri } from 'expo-auth-session';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    image: require('../assets/images/brotherhood.png'),
    title: 'Find Your Companion',
    subtitle: 'Get 1:1 Islamic guidance from knowledgeable companions in your faith journey.',
  },
  {
    id: 2,
    image: require('../assets/images/sisterhood.png'),
    title: 'Thrive in Your Deen',
    subtitle: 'Access tools, community, and guidance to grow stronger in your faith.',
  },
];

// Apple Logo SVG Component
const AppleLogo = ({ width = 20, height = 24, color = '#000000' }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
      fill={color}
    />
  </Svg>
);

// Add GoogleLogo SVG
const GoogleLogo = ({ width = 24, height = 24 }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path fill="#4285F4" d="M21.805 10.023h-9.765v3.955h5.627c-.242 1.236-1.457 3.627-5.627 3.627-3.386 0-6.145-2.803-6.145-6.25s2.759-6.25 6.145-6.25c1.93 0 3.227.82 3.97 1.527l2.713-2.64C17.13 2.82 15.02 1.75 12.04 1.75c-3.386 0-6.145 2.803-6.145 6.25 0 1.07.28 2.08.768 2.945z"/>
    <Path fill="#34A853" d="M3.153 7.345l3.285 2.41c.89-1.73 2.57-2.955 4.602-2.955 1.13 0 2.16.387 2.97 1.02l2.713-2.64C15.02 2.82 12.91 1.75 9.93 1.75c-3.386 0-6.145 2.803-6.145 6.25 0 1.07.28 2.08.768 2.945z"/>
    <Path fill="#FBBC05" d="M12.04 21.75c2.98 0 5.09-.98 6.77-2.68l-3.11-2.55c-.86.58-2.01.98-3.66.98-2.86 0-5.28-1.93-6.15-4.57l-3.22 2.49c1.62 3.18 5.13 5.33 9.37 5.33z"/>
    <Path fill="#EA4335" d="M21.805 10.023h-9.765v3.955h5.627c-.242 1.236-1.457 3.627-5.627 3.627-3.386 0-6.145-2.803-6.145-6.25s2.759-6.25 6.145-6.25c1.93 0 3.227.82 3.97 1.527l2.713-2.64C17.13 2.82 15.02 1.75 12.04 1.75 6.477 1.75 2 6.227 2 11.75s4.477 10 10.04 10c5.77 0 9.56-4.047 9.56-9.75 0-.656-.07-1.15-.16-1.477z" opacity=".1"/>
  </Svg>
);

export default function LoginScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef<any>(null);
  const autoSlideTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [userInteracting, setUserInteracting] = useState(false);
  const userInteractionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Create infinite scroll by duplicating slides
  const infiniteSlides = [...SLIDES, ...SLIDES, ...SLIDES]; // Triple the slides for smooth infinite scroll
  const totalSlides = infiniteSlides.length;
  const originalSlidesCount = SLIDES.length;

  // Clear auto-slide timer
  const clearAutoSlide = () => {
    if (autoSlideTimer.current) {
      clearInterval(autoSlideTimer.current);
      autoSlideTimer.current = null;
    }
  };

  // Start auto-slide timer
  const startAutoSlide = () => {
    clearAutoSlide();
    autoSlideTimer.current = setInterval(() => {
      if (!userInteracting) {
        setCurrentSlide((prev) => {
          const nextSlide = (prev + 1) % originalSlidesCount;
          const currentScrollIndex = originalSlidesCount + nextSlide;
          slideRef.current?.scrollTo({
            x: currentScrollIndex * SCREEN_WIDTH,
            animated: true,
          });
          return nextSlide;
        });
      }
    }, 6000); // Increased from 4000 to 6000 (6 seconds instead of 4)
  };

  // Handle user interaction start
  const handleUserInteractionStart = () => {
    setUserInteracting(true);
    clearAutoSlide();
    
    // Clear any existing timeout
    if (userInteractionTimeout.current) {
      clearTimeout(userInteractionTimeout.current);
    }
  };

  // Handle user interaction end with delay
  const handleUserInteractionEnd = () => {
    // Give user 3 seconds after they stop interacting before resuming auto-scroll
    userInteractionTimeout.current = setTimeout(() => {
      setUserInteracting(false);
      startAutoSlide();
    }, 3000); // 3 second pause after user stops interacting
  };

  // Auto-slide functionality with infinite scroll
  useEffect(() => {
    // Start from the middle set of slides
    const initialIndex = originalSlidesCount;
    slideRef.current?.scrollTo({
      x: initialIndex * SCREEN_WIDTH,
      animated: false,
    });
    setCurrentSlide(0);

    startAutoSlide();

    return () => {
      clearAutoSlide();
      if (userInteractionTimeout.current) {
        clearTimeout(userInteractionTimeout.current);
      }
    };
  }, []);

  // Handle manual scroll with infinite scroll logic
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const slideIndex = Math.round(scrollPosition / SCREEN_WIDTH);
    const normalizedIndex = slideIndex % originalSlidesCount;
    setCurrentSlide(normalizedIndex);
  };

  // Handle scroll begin (user starts scrolling)
  const handleScrollBegin = () => {
    handleUserInteractionStart();
  };

  // Handle scroll end for infinite scroll reset
  const handleScrollEnd = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const slideIndex = Math.round(scrollPosition / SCREEN_WIDTH);
    
    // Reset to middle set if we're at the beginning or end
    if (slideIndex < originalSlidesCount / 2) {
      // We're in the first set, jump to the second set
      const newIndex = slideIndex + originalSlidesCount;
      slideRef.current?.scrollTo({
        x: newIndex * SCREEN_WIDTH,
        animated: false,
      });
    } else if (slideIndex >= totalSlides - originalSlidesCount / 2) {
      // We're in the last set, jump to the second set
      const newIndex = slideIndex - originalSlidesCount;
      slideRef.current?.scrollTo({
        x: newIndex * SCREEN_WIDTH,
        animated: false,
      });
    }
    
    // Resume auto-scroll after user interaction ends
    handleUserInteractionEnd();
  };

  const handleSignUpWithEmail = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to sign-up page
    router.push('/signup');
  };

  const handleSignUpWithApple = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to dashboard for now - you can change this to actual Apple sign-up flow
    router.push('/dashboard');
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to login screen
    router.push('/login');
  };

  const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  const redirectUri = makeRedirectUri({
    scheme: 'yourapp', // must match your app.json
    // useProxy: true, // Uncomment if using Expo Go and supported
  });

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const authUrl = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUri)}`;
      const result = await startAsync({ authUrl });
      console.log('Google Auth result:', result);
      Alert.alert('Google Auth Result', JSON.stringify(result, null, 2));
      // Optionally, show a Toast (if you have a Toast library)
      // Toast.show(JSON.stringify(result));
      if (result.type === 'success' && result.url) {
        // Supabase will handle the session automatically if you use supabase-js v2+
      } else {
        Alert.alert('Google Sign-Up cancelled or failed', `Result type: ${result.type}`);
      }
    } catch (err) {
      console.error('Google Auth error:', err);
      Alert.alert('Google Auth Exception', String(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const renderSlide = (slide: typeof SLIDES[0], index: number) => (
    <View key={`slide-${index}`} style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image 
          source={slide.image} 
          style={[
            styles.slideImage,
            slide.id === 2 && styles.sisterhoodImage // Apply bigger styling for sisterhood
          ]} 
          resizeMode="contain" 
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {SLIDES.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor: index === currentSlide ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
              width: index === currentSlide ? 40 : 20,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B8D4F0" translucent={false} />
      
      {/* Login Button - Top Right */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      {/* Slides Container */}
      <Animated.ScrollView
        ref={slideRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        style={styles.slidesContainer}
      >
        {infiniteSlides.map((slide, index) => renderSlide(slide, index))}
      </Animated.ScrollView>

      {/* Pagination Dots - always right below the carousel */}
      {renderPagination()}

      {/* Bottom Buttons - always at the bottom */}
      <View style={styles.bottomContainer} pointerEvents="box-none">
        {/* Spacer to move everything lower */}
        <View style={{ height: 40 }} />

        <TouchableOpacity style={styles.signUpEmailButton} onPress={handleSignUpWithEmail}>
          <Text style={styles.signUpEmailButtonText}>Sign up with email</Text>
        </TouchableOpacity>

        {/* Separator for social sign up */}
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>Or sign up with:</Text>
          <View style={styles.separatorLine} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton} onPress={handleSignUpWithApple}>
            <AppleLogo width={28} height={28} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignUp} disabled={isGoogleLoading}>
            {isGoogleLoading ? (
              <Text style={{ color: '#2C3E50', fontWeight: 'bold' }}>...</Text>
            ) : (
              <GoogleLogo width={28} height={28} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By continuing, you agree to our <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0', // Light blue background from cohort tab
  },
  loginButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    backgroundColor: '#FFF8E7', // Changed to off-white yellowish
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loginButtonText: {
    color: '#2C3E50', // Changed from white to dark color for better contrast
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  slidesContainer: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
    paddingBottom: 280,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  slideImage: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_WIDTH * 0.95,
    maxWidth: 580,
    maxHeight: 580,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  slideSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#34495E',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'System',
    opacity: 0.8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    position: 'absolute',
    bottom: 240,
    left: 0,
    right: 0,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: -20, // Move the whole bottom section lower
    left: 0,
    right: 0,
    paddingHorizontal: 30,
    paddingBottom: 50,
    paddingTop: 30,
  },
  signUpEmailButton: {
    backgroundColor: '#FFF8E7', // Changed to off-white yellowish
    paddingVertical: 14, // Changed from 16 to 14 to match Apple button
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signUpEmailButtonText: {
    color: '#000000', // Changed back to black
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
  signUpAppleButton: {
    backgroundColor: '#FFF8E7', // Changed to off-white yellowish to match email button
    paddingVertical: 14, // Reduced from 16 to 14 to make it slimmer
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
    gap: 8,
  },
  signUpAppleButtonText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
  termsContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  termsText: {
    fontSize: 12,
    color: '#34495E',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: 'System',
    opacity: 0.7,
    flexWrap: 'wrap',
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  sisterhoodImage: {
    width: SCREEN_WIDTH * 1.2,
    height: SCREEN_WIDTH * 1.2,
    maxWidth: 700,
    maxHeight: 700,
    marginTop: 50,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    gap: 24,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF8E7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 10,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#34495E',
    opacity: 0.3,
  },
  separatorText: {
    color: '#34495E',
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 10,
    fontFamily: 'System',
  },
}); 