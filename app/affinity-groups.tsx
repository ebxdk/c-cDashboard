import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Mock data for affinity groups
const AFFINITY_GROUPS = [
  // Lifestyle & Fun
  { id: '1', emoji: '🍽️', name: 'Halal Foodies Club', tagline: 'Share halal recipes, local halal spots, snacks from different cultures', category: 'Lifestyle & Fun', categoryColor: '#FF6B6B' },
  { id: '2', emoji: '🎮', name: 'Muslim Gamers', tagline: 'Talk about favorite games, set up casual halal game nights', category: 'Lifestyle & Fun', categoryColor: '#FF6B6B' },
  { id: '3', emoji: '📚', name: 'Muslim Book/Anime Club', tagline: 'Share your fav Islamic books, anime, manga, or shows', category: 'Lifestyle & Fun', categoryColor: '#FF6B6B' },
  { id: '4', emoji: '✈️', name: 'Revert Travel Chat', tagline: 'Talk Umrah dreams, halal travel hacks, Muslim-friendly destinations', category: 'Lifestyle & Fun', categoryColor: '#FF6B6B' },
  { id: '5', emoji: '📸', name: 'Aesthetic Muslims', tagline: 'Share Islamic aesthetic pics, clothing inspo, room decor, wallpapers', category: 'Lifestyle & Fun', categoryColor: '#FF6B6B' },
  { id: '6', emoji: '🛍️', name: 'Modest Fashion Talk', tagline: 'Share fits, brands, modest wear inspo (hijabi fashion, thobes, etc.)', category: 'Lifestyle & Fun', categoryColor: '#FF6B6B' },
  
  // Skill-Building & Productivity
  { id: '7', emoji: '💼', name: 'Career & Resume Circle', tagline: 'Job advice, resume tips, halal work discussions', category: 'Skill-Building', categoryColor: '#4ECDC4' },
  { id: '8', emoji: '💸', name: 'Halal Hustle Chat', tagline: 'Side hustles, selling, halal investing, business ideas', category: 'Skill-Building', categoryColor: '#4ECDC4' },
  { id: '9', emoji: '🧠', name: 'Memory & Quran Hacks', tagline: 'Productivity tips, how to stay on track memorizing, habit building', category: 'Skill-Building', categoryColor: '#4ECDC4' },
  { id: '10', emoji: '🎯', name: 'Muslim Productivity Tools', tagline: 'Apps, systems, routines to keep deen + dunya on point', category: 'Skill-Building', categoryColor: '#4ECDC4' },
  
  // Faith & Deep Conversations
  { id: '11', emoji: '🌙', name: 'Ramadan Prep & Vibes', tagline: 'Only open during Ramadan seasons — recipes, goals, support', category: 'Faith & Deep Thoughts', categoryColor: '#A78BFA' },
  { id: '12', emoji: '💭', name: 'Late Night Deen Thoughts', tagline: 'Chatroom for deep convos about Allah, doubts, afterlife, etc.', category: 'Faith & Deep Thoughts', categoryColor: '#A78BFA' },
  { id: '13', emoji: '🧎', name: 'Salah Struggles & Wins', tagline: 'Talk honestly about struggles staying consistent, wins, reminders', category: 'Faith & Deep Thoughts', categoryColor: '#A78BFA' },
  { id: '14', emoji: '🤲', name: 'Du\'a Board', tagline: 'Share what you need du\'a for and make du\'a for others', category: 'Faith & Deep Thoughts', categoryColor: '#A78BFA' },
  
  // Emotional & Social Support
  { id: '15', emoji: '😔', name: 'Loneliness & Isolation', tagline: 'For people who just feel lost or alone in the revert journey', category: 'Emotional Support', categoryColor: '#F59E0B' },
  { id: '16', emoji: '👨‍👩‍👧‍👦', name: 'Family Drama Vent Room', tagline: 'Talk family struggles, boundaries, non-Muslim tensions', category: 'Emotional Support', categoryColor: '#F59E0B' },
  { id: '17', emoji: '😤', name: 'Dealing With Anger', tagline: 'Especially for brothers who need a space to cool off, vent', category: 'Emotional Support', categoryColor: '#F59E0B' },
  { id: '18', emoji: '💕', name: 'Self-Love & Muslim Identity', tagline: 'Loving yourself while growing into your Muslim identity', category: 'Emotional Support', categoryColor: '#F59E0B' },
  
  // New Muslim Survival Toolkit
  { id: '19', emoji: '🤷‍♂️', name: 'I Don\'t Know What I\'m Doing', tagline: 'A totally non-judgy room for asking even the "dumbest" questions', category: 'New Muslim Toolkit', categoryColor: '#10B981' },
  { id: '20', emoji: '⏱️', name: 'Just Reverted - Day 1 Club', tagline: 'For people who just took shahada or are days/weeks in', category: 'New Muslim Toolkit', categoryColor: '#10B981' },
  { id: '21', emoji: '🧕', name: 'How to Be Muslim 101', tagline: 'Practical help: how to pray, make wudu, what to say, what to avoid', category: 'New Muslim Toolkit', categoryColor: '#10B981' },
  { id: '22', emoji: '💬', name: 'Cringe Moments & Mistakes', tagline: 'Laugh and learn from Islamic fails — converts tell all', category: 'New Muslim Toolkit', categoryColor: '#10B981' },
];

const CATEGORIES = [
  { id: 'all', name: 'All Groups', color: '#6B7280' },
  { id: 'lifestyle', name: 'Lifestyle & Fun', color: '#FF6B6B' },
  { id: 'skill', name: 'Skill-Building', color: '#4ECDC4' },
  { id: 'faith', name: 'Faith & Deep Thoughts', color: '#A78BFA' },
  { id: 'support', name: 'Emotional Support', color: '#F59E0B' },
  { id: 'toolkit', name: 'New Muslim Toolkit', color: '#10B981' },
];

export default function AffinityGroupsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const colors = Colors[colorScheme];
  
  const [currentView, setCurrentView] = useState<'store' | 'myGroups'>('store');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [mutedGroups, setMutedGroups] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedGroupForJoin, setSelectedGroupForJoin] = useState<any>(null);
  const [fabAnimation] = useState(new Animated.Value(0));

  // Filter groups based on search and category
  const filteredGroups = AFFINITY_GROUPS.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    
    const categoryMatch: { [key: string]: string } = {
      'lifestyle': 'Lifestyle & Fun',
      'skill': 'Skill-Building',
      'faith': 'Faith & Deep Thoughts',
      'support': 'Emotional Support',
      'toolkit': 'New Muslim Toolkit'
    };
    
    return matchesSearch && group.category === categoryMatch[selectedCategory];
  });

  const myGroups = AFFINITY_GROUPS.filter(group => joinedGroups.includes(group.id));

  const handleJoinGroup = (groupId: string) => {
    const group = AFFINITY_GROUPS.find(g => g.id === groupId);
    if (joinedGroups.includes(groupId)) {
      // If already joined, leave immediately
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setJoinedGroups(prev => prev.filter(id => id !== groupId));
    } else {
      // If not joined, show confirmation modal
      setSelectedGroupForJoin(group);
      setShowJoinModal(true);
    }
  };

  const confirmJoinGroup = () => {
    if (selectedGroupForJoin) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const wasEmpty = joinedGroups.length === 0;
      setJoinedGroups(prev => [...prev, selectedGroupForJoin.id]);
      setShowJoinModal(false);
      setSelectedGroupForJoin(null);
      
      // Animate FAB up if this is the first group joined
      if (wasEmpty) {
        Animated.spring(fabAnimation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    }
  };

  const cancelJoinGroup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowJoinModal(false);
    setSelectedGroupForJoin(null);
  };

  const handleMuteGroup = (groupId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (mutedGroups.includes(groupId)) {
      setMutedGroups(prev => prev.filter(id => id !== groupId));
    } else {
      setMutedGroups(prev => [...prev, groupId]);
    }
  };

  const toggleSearch = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
    }
  };

  const handleFabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentView('myGroups');
  };

  const GroupCard = ({ group, isInMyGroups = false }: { group: any, isInMyGroups?: boolean }) => {
    const isJoined = joinedGroups.includes(group.id);
    const isMuted = mutedGroups.includes(group.id);

    return (
      <View style={[
        styles.groupCard,
        {
          backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#FFFFFF',
          borderColor: colorScheme === 'dark' ? '#2C2C2E' : 'rgba(0,0,0,0.08)',
          shadowColor: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        }
      ]}>
        {/* Group emoji and mute icon */}
        <View style={styles.cardHeader}>
          <Text style={styles.groupEmoji}>{group.emoji}</Text>
          {isInMyGroups && isMuted && (
            <TouchableOpacity onPress={() => handleMuteGroup(group.id)}>
              <Text style={styles.muteIcon}>🔕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Group info */}
        <Text style={[styles.groupName, { color: colors.text }]} numberOfLines={2}>
          {group.name}
        </Text>
        <Text style={[styles.groupTagline, { color: colors.tint }]} numberOfLines={3}>
          {group.tagline}
        </Text>

        {/* Category badge */}
        <View style={[styles.categoryBadge, { backgroundColor: group.categoryColor + '20' }]}>
          <Text style={[styles.categoryText, { color: group.categoryColor }]}>
            {group.category}
          </Text>
        </View>

        {/* Action button */}
        {!isInMyGroups && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: isJoined ? '#FF3B30' : '#007AFF',
              }
            ]}
            onPress={() => handleJoinGroup(group.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>
              {isJoined ? 'Leave Group' : 'Join Group'}
            </Text>
          </TouchableOpacity>
        )}

        {/* My Groups specific actions */}
        {isInMyGroups && (
          <View style={styles.myGroupActions}>
            <TouchableOpacity
              style={[styles.muteButton, { backgroundColor: isMuted ? '#FF9500' : '#8E8E93' }]}
              onPress={() => handleMuteGroup(group.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.muteButtonText}>
                {isMuted ? 'Unmute' : 'Mute'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chatButton, { backgroundColor: '#007AFF' }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push({
                  pathname: '/group-chat',
                  params: {
                    groupName: group.name,
                    groupEmoji: group.emoji,
                  }
                });
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.chatButtonText}>Open Chat</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderStoreView = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.background }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Find Your People!
        </Text>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.background }]}
          onPress={toggleSearch}
          activeOpacity={0.7}
        >
          <Text style={[styles.searchButtonText, { color: colors.text }]}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <View style={[
            styles.searchBar,
            {
              backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
              borderColor: colorScheme === 'dark' ? '#3C3C3E' : 'rgba(0,0,0,0.08)',
            }
          ]}>
            <Text style={[styles.searchIcon, { color: colors.tint }]}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search groups..."
              placeholderTextColor={colors.tint}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <TouchableOpacity onPress={toggleSearch} style={styles.searchClose}>
              <Text style={[styles.searchCloseText, { color: colors.tint }]}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Category Chips */}
      <View style={styles.categoryWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                  borderColor: category.color,
                }
              ]}
              onPress={() => {
                setSelectedCategory(category.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.categoryChipText,
                {
                  color: selectedCategory === category.id ? '#FFFFFF' : category.color,
                }
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Groups Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.groupsGrid}
        showsVerticalScrollIndicator={false}
      >
        {filteredGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      {joinedGroups.length > 0 && currentView === 'store' && (
        <Animated.View
          style={[
            styles.fabContainer,
            {
              transform: [
                {
                  translateY: fabAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
                {
                  scale: fabAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 1.1, 1],
                  }),
                },
              ],
              opacity: fabAnimation,
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: '#000000' }]}
            onPress={handleFabPress}
            activeOpacity={0.8}
          >
            <View style={styles.fabContent}>
              <Text style={styles.fabIcon}>✓</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );

  const renderMyGroupsView = () => (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.background }]}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Your Groups
        </Text>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.background }]}
          onPress={toggleSearch}
          activeOpacity={0.7}
        >
          <Text style={[styles.searchButtonText, { color: colors.text }]}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input (only when active) */}
      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <View style={[
            styles.searchBar,
            {
              backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7',
              borderColor: colorScheme === 'dark' ? '#3C3C3E' : 'rgba(0,0,0,0.08)',
            }
          ]}>
            <Text style={[styles.searchIcon, { color: colors.tint }]}>🔍</Text>
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search your groups..."
              placeholderTextColor={colors.tint}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <TouchableOpacity onPress={toggleSearch} style={styles.searchClose}>
              <Text style={[styles.searchCloseText, { color: colors.tint }]}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Groups Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.groupsGrid}
        showsVerticalScrollIndicator={false}
      >
        {myGroups.filter(group => {
          if (!showSearch || !searchQuery) return true;
          return group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 group.tagline.toLowerCase().includes(searchQuery.toLowerCase());
        }).map((group) => (
          <GroupCard key={group.id} group={group} isInMyGroups={true} />
        ))}
      </ScrollView>

      {/* Discover More Groups Button */}
      <TouchableOpacity
        style={[styles.discoverButton, { backgroundColor: '#34C759' }]}
        onPress={() => {
          setCurrentView('store');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.discoverButtonText}>+ Discover More Groups</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      {joinedGroups.length === 0 || currentView === 'store' ? renderStoreView() : renderMyGroupsView()}
      
      {/* Join Confirmation Modal */}
      <Modal
        visible={showJoinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelJoinGroup}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            {selectedGroupForJoin && (
              <>
                <Text style={styles.modalEmoji}>{selectedGroupForJoin.emoji}</Text>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Join {selectedGroupForJoin.name}?
                </Text>
                <Text style={[styles.modalDescription, { color: colors.tint }]}>
                  {selectedGroupForJoin.tagline}
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={cancelJoinGroup}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={confirmJoinGroup}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.confirmButtonText}>Join Group</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: 60,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.system,
  },
  categoryWrapper: {
    height: 40,
    marginBottom: 16,
  },
  categoryScrollContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 12,
    minWidth: 100,
    height: 40,
    justifyContent: 'center',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.system,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: 0,
  },
  groupsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  groupCard: {
    width: (SCREEN_WIDTH - 60) / 2,
    marginBottom: 20,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  groupEmoji: {
    fontSize: 32,
  },
  muteIcon: {
    fontSize: 16,
    opacity: 0.7,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 20,
    fontFamily: Fonts.system,
  },
  groupTagline: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
    opacity: 0.8,
    fontFamily: Fonts.system,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
  actionButton: {
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
  myGroupActions: {
    flexDirection: 'row',
    gap: 8,
  },
  muteButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  muteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
  chatButton: {
    flex: 2,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
  switchViewButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  switchViewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.system,
  },
  discoverButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  discoverButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: Fonts.system,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  searchButtonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  searchClose: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchCloseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalContainer: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    maxWidth: 320,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Fonts.system,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: Fonts.system,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 120, // Higher above the bottom nav bar
    alignSelf: 'center',
    zIndex: 1000,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 28,
  },
}); 