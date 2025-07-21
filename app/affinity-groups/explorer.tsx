import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useBottomNavHeight } from '@/hooks/useBottomNavHeight';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
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

interface GroupExplorerProps {
  joinedGroups: string[];
  onJoinGroup: (groupId: string) => void;
  onLeaveGroup: (groupId: string) => void;
  onViewMyGroups: () => void;
  onBack: () => void;
}

export default function GroupExplorer({ 
  joinedGroups, 
  onJoinGroup, 
  onLeaveGroup, 
  onViewMyGroups, 
  onBack 
}: GroupExplorerProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { paddingBottom } = useBottomNavHeight();
  const colors = Colors[colorScheme];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = AFFINITY_GROUPS.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colorScheme === 'dark' ? '#2C2C2E' : '#E5E5E7' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
          activeOpacity={0.6}
        >
          <Text style={[styles.backIcon, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add channels</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onBack();
          }}
          activeOpacity={0.6}
        >
          <Text style={[styles.closeIcon, { color: colors.text }]}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Groups List */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.groupsList, { paddingBottom: paddingBottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredGroups.map((group) => (
          <View key={group.id} style={[styles.groupRow, { borderBottomColor: colorScheme === 'dark' ? '#2C2C2E' : '#E5E5E7' }]}>
            <View style={styles.groupContent}>
              {/* Square Icon Container */}
              <View style={[
                styles.groupIconContainer, 
                { backgroundColor: colorScheme === 'dark' ? '#2C2C2E' : '#F2F2F7' }
              ]}>
                <Text style={styles.groupEmoji}>{group.emoji}</Text>
              </View>
              
              {/* Group Info */}
              <View style={styles.groupInfo}>
                <Text style={[styles.groupName, { color: colors.text }]} numberOfLines={1}>
                  {group.name}
                </Text>
                <Text style={[styles.groupTagline, { color: colorScheme === 'dark' ? '#8E8E93' : '#6D6D80' }]} numberOfLines={2}>
                  {group.tagline}
                </Text>
              </View>
            </View>

            {/* Clean Plus Button */}
            <TouchableOpacity
              style={[
                styles.addButton,
                joinedGroups.includes(group.id) && styles.addedButton
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (joinedGroups.includes(group.id)) {
                  onLeaveGroup(group.id);
                } else {
                  onJoinGroup(group.id);
                }
              }}
              activeOpacity={0.6}
            >
              <Text style={[
                styles.addButtonText,
                { color: joinedGroups.includes(group.id) ? '#34C759' : (colorScheme === 'dark' ? '#8E8E93' : '#6D6D80') }
              ]}>
                {joinedGroups.includes(group.id) ? '✓' : '+'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Action */}
      {joinedGroups.length > 0 && (
        <View style={[
          styles.bottomAction, 
          { 
            backgroundColor: colors.background,
            borderTopColor: colorScheme === 'dark' ? '#2C2C2E' : '#E5E5E7'
          }
        ]}>
          <TouchableOpacity
            style={[styles.viewGroupsButton, { backgroundColor: colors.text }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onViewMyGroups();
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.viewGroupsText, { color: colors.background }]}>
              View My Groups ({joinedGroups.length})
            </Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 16,
    borderBottomWidth: 0.5,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 28,
    fontWeight: '400',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.system,
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  closeIcon: {
    fontSize: 20,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  groupsList: {
    paddingTop: 0,
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
  },
  groupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  groupIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  groupEmoji: {
    fontSize: 32,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Fonts.system,
    marginBottom: 4,
  },
  groupTagline: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: Fonts.system,
  },
  addButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  addedButton: {
    // No background changes, just text color
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: '300',
    fontFamily: Fonts.system,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
  },
  viewGroupsButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  viewGroupsText: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: Fonts.system,
  },
}); 