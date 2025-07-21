import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useBottomNavHeight } from '@/hooks/useBottomNavHeight';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Mock data for affinity groups
const AFFINITY_GROUPS = [
  { id: '1', emoji: '🍽️', name: 'Halal Foodies Club', tagline: 'Share halal recipes, local halal spots, snacks from different cultures', memberCount: 1247 },
  { id: '2', emoji: '🎮', name: 'Muslim Gamers', tagline: 'Talk about favorite games, set up casual halal game nights', memberCount: 892 },
  { id: '3', emoji: '📚', name: 'Muslim Book/Anime Club', tagline: 'Share your fav Islamic books, anime, manga, or shows', memberCount: 634 },
  { id: '4', emoji: '✈️', name: 'Revert Travel Chat', tagline: 'Talk Umrah dreams, halal travel hacks, Muslim-friendly destinations', memberCount: 456 },
  { id: '5', emoji: '📸', name: 'Aesthetic Muslims', tagline: 'Share Islamic aesthetic pics, clothing inspo, room decor, wallpapers', memberCount: 789 },
  { id: '6', emoji: '🛍️', name: 'Modest Fashion Talk', tagline: 'Share fits, brands, modest wear inspo (hijabi fashion, thobes, etc.)', memberCount: 923 },
  { id: '7', emoji: '💼', name: 'Career & Resume Circle', tagline: 'Job advice, resume tips, halal work discussions', memberCount: 567 },
  { id: '8', emoji: '💸', name: 'Halal Hustle Chat', tagline: 'Side hustles, selling, halal investing, business ideas', memberCount: 834 },
  { id: '9', emoji: '🧠', name: 'Memory & Quran Hacks', tagline: 'Productivity tips, how to stay on track memorizing, habit building', memberCount: 445 },
  { id: '10', emoji: '🎯', name: 'Muslim Productivity Tools', tagline: 'Apps, systems, routines to keep deen + dunya on point', memberCount: 312 },
  { id: '11', emoji: '🌙', name: 'Ramadan Prep & Vibes', tagline: 'Only open during Ramadan seasons — recipes, goals, support', memberCount: 1834 },
  { id: '12', emoji: '💭', name: 'Late Night Deen Thoughts', tagline: 'Chatroom for deep convos about Allah, doubts, afterlife, etc.', memberCount: 678 },
  { id: '13', emoji: '🧎', name: 'Salah Struggles & Wins', tagline: 'Talk honestly about struggles staying consistent, wins, reminders', memberCount: 924 },
  { id: '14', emoji: '🤲', name: 'Du\'a Board', tagline: 'Share what you need du\'a for and make du\'a for others', memberCount: 1245 },
  { id: '15', emoji: '😔', name: 'Loneliness & Isolation', tagline: 'For people who just feel lost or alone in the revert journey', memberCount: 543 },
  { id: '16', emoji: '👨‍👩‍👧‍👦', name: 'Family Drama Vent Room', tagline: 'Talk family struggles, boundaries, non-Muslim tensions', memberCount: 387 },
  { id: '17', emoji: '😤', name: 'Dealing With Anger', tagline: 'Especially for brothers who need a space to cool off, vent', memberCount: 289 },
  { id: '18', emoji: '💕', name: 'Self-Love & Muslim Identity', tagline: 'Loving yourself while growing into your Muslim identity', memberCount: 734 },
  { id: '19', emoji: '🤷‍♂️', name: 'I Don\'t Know What I\'m Doing', tagline: 'A totally non-judgy room for asking even the "dumbest" questions', memberCount: 2145 },
  { id: '20', emoji: '⏱️', name: 'Just Reverted - Day 1 Club', tagline: 'For people who just took shahada or are days/weeks in', memberCount: 678 },
  { id: '21', emoji: '🧕', name: 'How to Be Muslim 101', tagline: 'Practical help: how to pray, make wudu, what to say, what to avoid', memberCount: 1834 },
  { id: '22', emoji: '💬', name: 'Cringe Moments & Mistakes', tagline: 'Laugh and learn from Islamic fails — converts tell all', memberCount: 923 },
];

interface MyGroupsProps {
  joinedGroups: string[];
  onExploreMore: () => void;
  onBack?: () => void;
}

export default function MyGroups({ joinedGroups, onExploreMore, onBack }: MyGroupsProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { paddingBottom } = useBottomNavHeight();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [dismissedCards, setDismissedCards] = useState<string[]>([]);

  const myGroups = AFFINITY_GROUPS.filter(group => joinedGroups.includes(group.id));

  const filteredGroups = myGroups.filter(group => {
    if (!searchQuery) return true;
    return group.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Generate random message counts for groups
  const getMessageCount = (groupId: string): string => {
    const counts = ['1 new message', '2 new messages', '3 new messages', '4+ new messages', '12 new messages', '24+ new messages'];
    const index = parseInt(groupId) % counts.length;
    return counts[index];
  };

  // Get started cards data
  const getStartedCards = [
    {
      id: 'create-group',
      title: 'New group',
      subtitle: 'Start a community around your interests',
      emoji: '➕',
      action: () => {
        console.log('Create group');
      }
    },
    {
      id: 'invite-friends',
      title: 'Invite friends',
      subtitle: 'Share the app with people you know',
      emoji: '👥',
      action: () => {
        console.log('Invite friends');
      }
    },
    {
      id: 'discover-groups',
      title: 'Discover more',
      subtitle: 'Find communities that match your interests',
      emoji: '🌍',
      action: onExploreMore
    },
    {
      id: 'group-settings',
      title: 'Manage groups',
      subtitle: 'Edit your group preferences and settings',
      emoji: '⚙️',
      action: () => {
        console.log('Group settings');
      }
    }
  ];

  const visibleCards = getStartedCards.filter(card => !dismissedCards.includes(card.id));

  const dismissCard = (cardId: string) => {
    setDismissedCards(prev => [...prev, cardId]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        {/* Profile Icon on Left */}
        <TouchableOpacity
          style={[styles.profileButton, { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            // TODO: Profile functionality
          }}
          activeOpacity={0.6}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>

        {/* Centered Title */}
        <Text style={[styles.title, { color: colors.text }]}>Chats</Text>

        {/* Right Action - Add More Groups */}
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onExploreMore();
          }}
          activeOpacity={0.6}
        >
          <Text style={styles.headerButtonIcon}>+</Text>
        </TouchableOpacity>

        {/* Back Button (when needed) */}
        {onBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onBack();
            }}
            activeOpacity={0.6}
          >
            <Text style={[styles.backButtonText, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' }]}>
          <Text style={[styles.searchIcon, { color: colorScheme === 'dark' ? '#8E8E93' : '#6D6D80' }]}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search"
            placeholderTextColor={colorScheme === 'dark' ? '#8E8E93' : '#6D6D80'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {myGroups.length === 0 ? (
        // Empty State
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Groups Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colorScheme === 'dark' ? '#8E8E93' : '#6D6D80' }]}>
            Join some groups to start connecting with your community!
          </Text>
          <TouchableOpacity
            style={[styles.exploreButton, { backgroundColor: colors.text }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onExploreMore();
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.exploreButtonText, { color: colors.background }]}>
              Explore Groups
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Groups List
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.chatList, { paddingBottom: paddingBottom + 100 }]}
          showsVerticalScrollIndicator={false}
        >
          {filteredGroups.map((group, index) => (
            <TouchableOpacity
              key={group.id}
              style={[
                styles.chatRow, 
                { 
                  backgroundColor: colors.background,
                  borderBottomColor: colorScheme === 'dark' ? '#2C2C2E' : '#E5E5E7',
                  borderBottomWidth: index === filteredGroups.length - 1 ? 0 : 0.5
                }
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push({
                  pathname: '/group-chat',
                  params: {
                    groupName: group.name,
                    groupEmoji: group.emoji,
                    groupId: group.id,
                  }
                });
              }}
              activeOpacity={0.6}
            >
              <View style={[styles.chatAvatar, { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' }]}>
                <Text style={styles.chatAvatarEmoji}>{group.emoji}</Text>
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={[styles.chatName, { color: colors.text }]}>{group.name}</Text>
                  <Text style={[styles.chatTime, { color: colorScheme === 'dark' ? '#8E8E93' : '#6D6D80' }]}>Now</Text>
                </View>
                <Text style={[styles.chatPreview, { color: colorScheme === 'dark' ? '#8E8E93' : '#6D6D80', fontWeight: '600' }]} numberOfLines={1}>
                  {getMessageCount(group.id)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* Get started section with cards */}
          {visibleCards.length > 0 && (
            <View style={styles.getStartedSection}>
              <Text style={[styles.getStartedTitle, { color: colors.text }]}>Get started</Text>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsContainer}
                style={styles.cardsScrollView}
              >
                {visibleCards.map((card) => (
                  <View key={card.id} style={styles.cardWrapper}>
                    <TouchableOpacity
                      style={[styles.card, { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F8F9FA' }]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        card.action();
                      }}
                      activeOpacity={0.8}
                    >
                                              {/* X Button */}
                        <TouchableOpacity
                          style={[styles.dismissButton, { backgroundColor: colorScheme === 'dark' ? '#48484A' : '#F0F0F0' }]}
                          onPress={() => dismissCard(card.id)}
                          activeOpacity={0.6}
                        >
                          <Text style={[styles.dismissButtonText, { color: colorScheme === 'dark' ? '#8E8E93' : '#6D6D80' }]}>✕</Text>
                        </TouchableOpacity>

                      {/* Card Content */}
                      <View style={styles.cardContent}>
                        {/* Empty space above button */}
                        <View style={styles.cardTopSpace} />
                        
                        {/* Bottom section with white background */}
                        <View style={styles.cardBottomSection}>
                          <View style={styles.cardButton}>
                            <Text style={styles.cardButtonText}>{card.title}</Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 70,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '400',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: Fonts.system,
    letterSpacing: -0.5,
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    alignSelf: 'center',
    top: '50%',
    transform: [{ translateY: 55 }],
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonIcon: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    fontFamily: Fonts.system,
  },
  scrollView: {
    flex: 1,
  },
  chatList: {
    paddingTop: 8,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  chatAvatarEmoji: {
    fontSize: 28,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
  chatTime: {
    fontSize: 15,
    fontFamily: Fonts.system,
  },
  chatPreview: {
    fontSize: 15,
    fontFamily: Fonts.system,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: Fonts.system,
  },
  emptySubtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: Fonts.system,
    marginBottom: 30,
  },
  exploreButton: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  exploreButtonText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
  getStartedSection: {
    paddingTop: 32,
    paddingBottom: 20,
  },
  getStartedTitle: {
    fontSize: 17,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 16,
    fontFamily: Fonts.system,
  },
  getStartedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  getStartedIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  getStartedEmoji: {
    fontSize: 28,
  },
  getStartedContent: {
    flex: 1,
  },
  getStartedItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Fonts.system,
    marginBottom: 2,
  },
  getStartedItemSubtitle: {
    fontSize: 15,
    fontFamily: Fonts.system,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingRight: 20,
    paddingVertical: 12,
  },
  cardsScrollView: {
    marginTop: 8,
  },
  cardWrapper: {
    marginRight: 16,
    marginVertical: 8,
  },
  card: {
    width: 160,
    height: 180,
    borderRadius: 16,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dismissButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 12,
  },
  cardTopSpace: {
    flex: 1,
  },
  cardBottomSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 8,
  },
  cardButton: {
    backgroundColor: '#E5E5EA',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.system,
    color: '#007AFF',
  },

}); 