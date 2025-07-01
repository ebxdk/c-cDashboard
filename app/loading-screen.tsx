import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import Svg, { Line } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Memoji data arranged more evenly across the screen with no overlaps
const MEMOJI_DATA = [
  // Top row - better distribution
  { 
    id: 1, 
    image: require('../assets/images/memoji1.png'), 
    x: SCREEN_WIDTH * 0.08, 
    y: SCREEN_HEIGHT * 0.05,
    color: '#F4A6A6'
  },
  { 
    id: 2, 
    image: require('../assets/images/femalememoji2.png'), 
    x: SCREEN_WIDTH * 0.45, 
    y: SCREEN_HEIGHT * 0.02,
    color: '#A8E6CF'
  },
  { 
    id: 3, 
    image: require('../assets/images/memoji2.png'), 
    x: SCREEN_WIDTH * 0.82, 
    y: SCREEN_HEIGHT * 0.05,
    color: '#DDA0DD'
  },
  
  // Second row - more coverage
  { 
    id: 4, 
    image: require('../assets/images/femalememoji3.png'), 
    x: -SCREEN_WIDTH * 0.03, 
    y: SCREEN_HEIGHT * 0.18,
    color: '#C7CEEA'
  },
  { 
    id: 5, 
    image: require('../assets/images/memoji3.png'), 
    x: SCREEN_WIDTH * 0.68, 
    y: SCREEN_HEIGHT * 0.16,
    color: '#FFDFBA'
  },
  
  // Third row - middle coverage
  { 
    id: 6, 
    image: require('../assets/images/femalememoji1.png'), 
    x: SCREEN_WIDTH * 0.15, 
    y: SCREEN_HEIGHT * 0.28,
    color: '#FFB3E6'
  },
  { 
    id: 7, 
    image: require('../assets/images/memoji1.png'), 
    x: SCREEN_WIDTH * 0.55, 
    y: SCREEN_HEIGHT * 0.26,
    color: '#FFB3BA'
  },
  { 
    id: 8, 
    image: require('../assets/images/femalememoji2.png'), 
    x: SCREEN_WIDTH * 0.92, 
    y: SCREEN_HEIGHT * 0.32,
    color: '#FFDAC1'
  },
  
  // Fourth row - center area
  { 
    id: 9, 
    image: require('../assets/images/memoji2.png'), 
    x: SCREEN_WIDTH * 0.02, 
    y: SCREEN_HEIGHT * 0.42,
    color: '#BFBFFF'
  },
  { 
    id: 10, 
    image: require('../assets/images/femalememoji3.png'), 
    x: SCREEN_WIDTH * 0.35, 
    y: SCREEN_HEIGHT * 0.40,
    color: '#E6E6FA'
  },
  { 
    id: 11, 
    image: require('../assets/images/memoji3.png'), 
    x: SCREEN_WIDTH * 0.75, 
    y: SCREEN_HEIGHT * 0.44,
    color: '#F0E68C'
  },
  
  // Fifth row - lower middle
  { 
    id: 12, 
    image: require('../assets/images/femalememoji1.png'), 
    x: SCREEN_WIDTH * 0.18, 
    y: SCREEN_HEIGHT * 0.54,
    color: '#98FB98'
  },
  { 
    id: 13, 
    image: require('../assets/images/memoji1.png'), 
    x: SCREEN_WIDTH * 0.58, 
    y: SCREEN_HEIGHT * 0.56,
    color: '#F5DEB3'
  },
  
  // Sixth row - bottom area
  { 
    id: 14, 
    image: require('../assets/images/femalememoji2.png'), 
    x: -SCREEN_WIDTH * 0.02, 
    y: SCREEN_HEIGHT * 0.68,
    color: '#FFE4E1'
  },
  { 
    id: 15, 
    image: require('../assets/images/memoji2.png'), 
    x: SCREEN_WIDTH * 0.38, 
    y: SCREEN_HEIGHT * 0.70,
    color: '#E0FFFF'
  },
  { 
    id: 16, 
    image: require('../assets/images/femalememoji3.png'), 
    x: SCREEN_WIDTH * 0.85, 
    y: SCREEN_HEIGHT * 0.66,
    color: '#FFEFD5'
  },
  
  // Bottom row - some cut off
  { 
    id: 17, 
    image: require('../assets/images/memoji3.png'), 
    x: SCREEN_WIDTH * 0.12, 
    y: SCREEN_HEIGHT * 0.82,
    color: '#F0F8FF'
  },
  { 
    id: 18, 
    image: require('../assets/images/femalememoji1.png'), 
    x: SCREEN_WIDTH * 0.65, 
    y: SCREEN_HEIGHT * 0.80,
    color: '#DDA0DD'
  },
  { 
    id: 19, 
    image: require('../assets/images/memoji1.png'), 
    x: SCREEN_WIDTH * 0.95, 
    y: SCREEN_HEIGHT * 0.88,
    color: '#FFB3BA'
  },
  
  // Additional memojis for better coverage
  { 
    id: 20, 
    image: require('../assets/images/femalememoji2.png'), 
    x: SCREEN_WIDTH * 0.25, 
    y: SCREEN_HEIGHT * 0.12,
    color: '#A8E6CF'
  },
  { 
    id: 21, 
    image: require('../assets/images/memoji2.png'), 
    x: SCREEN_WIDTH * 0.28, 
    y: SCREEN_HEIGHT * 0.95,
    color: '#C7CEEA'
  },
  
  // Right middle edge memoji
  { 
    id: 22, 
    image: require('../assets/images/memoji1.png'), 
    x: SCREEN_WIDTH * 0.95, 
    y: SCREEN_HEIGHT * 0.5,
    color: '#FFD700'
  },
];

export default function LoadingScreen() {
  const router = useRouter();
  
  // Pop up animations for memojis
  const popAnimations = useRef(
    MEMOJI_DATA.map(() => new Animated.Value(0))
  ).current;
  
  // Scale animations for popping effect
  const scaleAnimations = useRef(
    MEMOJI_DATA.map(() => new Animated.Value(0))
  ).current;
  
  // Gentle floating animation for memojis
  const floatAnimations = useRef(
    MEMOJI_DATA.map(() => new Animated.Value(0))
  ).current;
  
  // Line animations - using state to track progress
  const [lineProgress, setLineProgress] = useState<number[]>(
    MEMOJI_DATA.map(() => 0)
  );

  // Track animation phases
  const [memojiAnimationsCompleted, setMemojiAnimationsCompleted] = useState(0);
  const [allLinesCompleted, setAllLinesCompleted] = useState(false);
  const totalMemojis = MEMOJI_DATA.length;

  useEffect(() => {
    // PHASE 1: Start pop up animations for all memojis first
    popAnimations.forEach((popAnim, index) => {
      const scaleAnim = scaleAnimations[index];
      const floatAnim = floatAnimations[index];
      
      // Smooth staggered delay - more gradual appearance
      const staggeredDelay = (index * 120) + Math.random() * 200;
      
      setTimeout(() => {
        // Smoother pop up animation with gentle bouncy effect
        Animated.parallel([
          Animated.sequence([
            Animated.timing(popAnim, {
              toValue: 1,
              duration: 500, // Longer for smoother animation
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.spring(scaleAnim, {
              toValue: 1.05, // Gentler overshoot
              tension: 120, // Lower tension for smoother animation
              friction: 8, // Higher friction for less bouncy, smoother effect
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1, // Settle to normal size
              tension: 100,
              friction: 10, // Higher friction for smooth settling
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => {
          // Start floating animation after pop up
          Animated.loop(
            Animated.sequence([
              Animated.timing(floatAnim, {
                toValue: 1,
                duration: 2500 + (index * 50), // Slower, more graceful floating
                useNativeDriver: true,
              }),
              Animated.timing(floatAnim, {
                toValue: 0,
                duration: 2500 + (index * 50), // Slower, more graceful floating
                useNativeDriver: true,
              }),
            ])
          ).start();
          
          // Mark this memoji animation as completed
          setMemojiAnimationsCompleted(prev => prev + 1);
        });
      }, staggeredDelay);
    });
  }, []);

  // PHASE 2: Start line connections only after all memojis have appeared
  useEffect(() => {
    if (memojiAnimationsCompleted === totalMemojis) {
      // Wait a brief moment, then start connecting all memojis
      setTimeout(() => {
        startAllProximityConnections();
      }, 500); // Brief pause after all memojis appear
    }
  }, [memojiAnimationsCompleted]);

  // PHASE 3: Navigate only after all animations are complete
  useEffect(() => {
    if (memojiAnimationsCompleted === totalMemojis && allLinesCompleted) {
      // Everything is complete, wait longer to admire the beautiful network
      const timer = setTimeout(() => {
        router.replace('/dashboard');
      }, 1500); // Longer pause to appreciate the complete, satisfying network
      
      return () => clearTimeout(timer);
    }
  }, [memojiAnimationsCompleted, allLinesCompleted, router]);

  // Create all proximity connections simultaneously
  const startAllProximityConnections = () => {
    const connectionLines = getConnectionLines();
    let completedLines = 0;
    
    console.log(`Creating ${connectionLines.length} connections for full network`);
    
    // Start all line animations with a beautiful, slower wave effect
    connectionLines.forEach((line, lineIndex) => {
      // Create a more gradual wave-like stagger based on distance from center
      const centerX = SCREEN_WIDTH / 2;
      const centerY = SCREEN_HEIGHT / 2;
      const distanceFromCenter = Math.sqrt(
        Math.pow(line.x1 - centerX, 2) + Math.pow(line.y1 - centerY, 2)
      );
      const staggerDelay = (distanceFromCenter / SCREEN_WIDTH) * 1500; // Slower wave spread
      
      setTimeout(() => {
        const startTime = Date.now();
        const duration = 1200; // Much longer for more satisfying animation
        
        const animateLine = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Use more sophisticated easing for smoother, more satisfying animation
          const easedProgress = progress < 0.5 
            ? 4 * progress * progress * progress // Ease-in cubic for first half
            : 1 - Math.pow(-2 * progress + 2, 3) / 2; // Ease-out cubic for second half
          
          setLineProgress(prev => {
            const newProgress = [...prev];
            const oldProgress = newProgress[line.index] || 0;
            newProgress[line.index] = Math.max(oldProgress, easedProgress);
            
            // Add haptic feedback when line starts (progress crosses 0.1) and completes
            if (oldProgress < 0.1 && easedProgress >= 0.1) {
              // Light haptic when line starts drawing
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } else if (oldProgress < 1 && easedProgress >= 1) {
              // Subtle haptic when line completes
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            
            return newProgress;
          });
          
          if (progress < 1) {
            requestAnimationFrame(animateLine);
          } else {
            completedLines++;
            // Check if all lines are completed
            if (completedLines === connectionLines.length) {
              // Medium haptic when all connections are complete
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setAllLinesCompleted(true);
            }
          }
        };
        
        requestAnimationFrame(animateLine);
      }, staggerDelay);
    });
  };

  // Function to calculate all proximity connections
  const getConnectionLines = () => {
    const lines: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      index: number;
      opacity: number;
    }> = [];
    
    MEMOJI_DATA.forEach((memoji, index) => {
      // Connect each memoji to ALL other memojis around it
      MEMOJI_DATA.forEach((otherMemoji, otherIndex) => {
        if (index !== otherIndex && index < otherIndex) { // Avoid duplicate lines
          const distance = Math.sqrt(
            Math.pow(memoji.x - otherMemoji.x, 2) + 
            Math.pow(memoji.y - otherMemoji.y, 2)
          );
          
          // Connect to ALL memojis within a generous radius around each one
          if (distance < SCREEN_WIDTH * 0.5) { // Increased radius for more connections
            // Vary opacity based on distance - closer = more visible
            const maxDistance = SCREEN_WIDTH * 0.5;
            const opacity = Math.max(0.05, 0.3 - (distance / maxDistance) * 0.25);
            
            lines.push({
              x1: memoji.x,
              y1: memoji.y,
              x2: otherMemoji.x,
              y2: otherMemoji.y,
              index: index,
              opacity: opacity,
            });
          }
        }
      });
    });
    
    return lines;
  };

  const renderMemoji = (memoji: typeof MEMOJI_DATA[0], index: number) => {
    const popOpacity = popAnimations[index];
    const scale = scaleAnimations[index];
    const floatTransform = floatAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5], // Subtle floating
    });

    return (
      <Animated.View
        key={memoji.id}
        style={[
          styles.memojiContainer,
          {
            left: memoji.x - 40,
            top: memoji.y - 40,
            backgroundColor: memoji.color,
            opacity: popOpacity,
            transform: [
              { scale: scale },
              { translateY: floatTransform }
            ],
          },
        ]}
      >
        <Image source={memoji.image} style={styles.memojiImage} />
      </Animated.View>
    );
  };

  const connectionLines = getConnectionLines();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      {/* Animated connecting lines */}
      <Svg 
        style={StyleSheet.absoluteFill} 
        width={SCREEN_WIDTH} 
        height={SCREEN_HEIGHT}
      >
        {connectionLines.map((line, lineIndex) => {
          const progress = lineProgress[line.index] || 0;
          const currentX = line.x1 + (line.x2 - line.x1) * progress;
          const currentY = line.y1 + (line.y2 - line.y1) * progress;
          
          // Create a more satisfying opacity curve
          const opacityProgress = Math.sin(progress * Math.PI / 2); // Sine curve for smoother fade-in
          
          return (
            <Line
              key={lineIndex}
              x1={line.x1}
              y1={line.y1}
              x2={currentX}
              y2={currentY}
              stroke={`rgba(0, 0, 0, ${line.opacity * opacityProgress * 1.2})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="10,5"
              strokeDashoffset={progress > 0 ? 0 : 15}
            />
          );
        })}
      </Svg>
      
      {/* Memoji avatars */}
      {MEMOJI_DATA.map((memoji, index) => renderMemoji(memoji, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0', // Match onboarding blue background
    overflow: 'hidden', // Ensure no overflow is visible
  },
  memojiContainer: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memojiImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
}); 