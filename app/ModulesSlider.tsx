import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const SLIDER_HEIGHT = 300;
const SLIDE_INTERVAL = 4000;
const SLIDER_HORIZONTAL_PADDING = 20;
const SLIDER_CARD_RADIUS = 22;

const slides = [
  {
    image: require('../assets/images/LanternDealingWithRejection.png'),
    category: 'GUIDANCE',
    title: 'Dealing with Rejection and Judgment from Non-Muslims',
  },
  {
    image: require('../assets/images/LanternHowToTellFamily.png'),
    category: 'FAMILY',
    title: `How to Tell Your Family You've Converted to Islam: A Practical Guide`,
  },
  {
    image: require('../assets/images/LanternLight.png'),
    category: 'INSPIRATION',
    title: 'A Light Along the Way',
  },
];

export default function ModulesSlider() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % slides.length;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * (screenWidth - SLIDER_HORIZONTAL_PADDING * 2), animated: true });
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const onMomentumScrollEnd = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (screenWidth - SLIDER_HORIZONTAL_PADDING * 2));
    setActiveIndex(index);
  };

  return (
    <View style={styles.sliderOuterContainer}>
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          style={styles.scrollView}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {slides.map((slide, idx) => (
            <View key={idx} style={styles.slide}>
              <Image
                source={slide.image}
                style={styles.image}
                resizeMode="cover"
              />
              <LinearGradient
                colors={[
                  'rgba(0,0,0,0)',
                  'rgba(0,0,0,0.02)',
                  'rgba(0,0,0,0.08)',
                  'rgba(0,0,0,0.24)',
                  'rgba(0,0,0,0.48)',
                  'rgba(0,0,0,0.72)'
                ]}
                locations={[0, 0.3, 0.5, 0.7, 0.85, 1]}
                style={styles.gradientOverlay}
              />
              <View style={styles.titleContainer}>
                <Text style={styles.categoryText}>{slide.category}</Text>
                <Text style={styles.titleText}>{slide.title}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.dotsContainer}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, activeIndex === idx && styles.activeDot]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderOuterContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
  },
  sliderContainer: {
    width: screenWidth - SLIDER_HORIZONTAL_PADDING * 2,
    height: SLIDER_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: SLIDER_CARD_RADIUS,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
    position: 'relative',
  },
  scrollView: {
    width: screenWidth - SLIDER_HORIZONTAL_PADDING * 2,
    height: SLIDER_HEIGHT,
  },
  slide: {
    width: screenWidth - SLIDER_HORIZONTAL_PADDING * 2,
    height: SLIDER_HEIGHT,
    borderRadius: SLIDER_CARD_RADIUS,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: SLIDER_CARD_RADIUS,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    borderBottomLeftRadius: SLIDER_CARD_RADIUS,
    borderBottomRightRadius: SLIDER_CARD_RADIUS,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 28,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
  },
  categoryText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: 'System',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'left',
    letterSpacing: -0.4,
    lineHeight: 28,
    fontFamily: 'System',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
}); 