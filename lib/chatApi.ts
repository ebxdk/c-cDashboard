// =====================================================
// CHAT API - SUPABASE INTEGRATION
// Concurrent Chat Management for All Chat Types
// =====================================================

import { supabase } from './supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  timezone: string;
  is_mentor: boolean;
  mentor_specialties?: string[];
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'support_cohort' | 'companion_1on1' | 'affinity_group';
  emoji: string;
  is_private: boolean;
  max_participants: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ChatParticipant {
  id: string;
  room_id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  joined_at: string;
  last_read_at: string;
  is_active: boolean;
  user_profile?: UserProfile;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'system' | 'ai_response' | 'file' | 'image';
  reply_to_id?: string;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  updated_at: string;
  sender_profile?: UserProfile;
  reactions?: Record<string, number>;
}

export interface AIChatSession {
  id: string;
  user_id: string;
  title: string;
  last_message?: string;
  ai_model: string;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  session_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'ai_response' | 'system';
  is_ai: boolean;
  created_at: string;
  updated_at: string;
  sender_profile?: UserProfile;
}

export interface CompanionRelationship {
  id: string;
  mentor_id: string;
  mentee_id: string;
  status: 'pending' | 'active' | 'paused' | 'ended';
  start_date: string;
  end_date?: string;
  meeting_schedule?: {
    days: string[];
    time: string;
    timezone: string;
  };
  created_at: string;
  mentor_profile?: UserProfile;
  mentee_profile?: UserProfile;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  reaction: string;
  created_at: string;
}

export interface ChatNotification {
  id: string;
  user_id: string;
  room_id: string;
  message_id: string;
  type: 'mention' | 'reply' | 'reaction' | 'system';
  is_read: boolean;
  created_at: string;
}

// =====================================================
// USER PROFILE API
// =====================================================

export const userProfileApi = {
  // Get current user's profile
  async getCurrentProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      
      // If profile doesn't exist, create one
      if (error.code === 'PGRST116') {
        console.log('Creating new user profile...');
        return await this.upsertProfile({
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url || null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          is_mentor: false,
          mentor_specialties: []
        });
      }
      return null;
    }

    return data;
  },

  // Create or update user profile
  async upsertProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        email: user.email!,
        ...profile
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting user profile:', error);
      return null;
    }

    return data;
  },

  // Get user profile by ID
  async getProfileById(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }
};

// =====================================================
// CHAT ROOMS API
// =====================================================

export const chatRoomsApi = {
  // Create a new chat room
  async createRoom(roomData: {
    name: string;
    description?: string;
    type: ChatRoom['type'];
    emoji?: string;
    is_private?: boolean;
  }): Promise<string | null> {
    const { data, error } = await supabase.rpc('create_chat_room', {
      room_name: roomData.name,
      room_description: roomData.description || '',
      room_type: roomData.type,
      room_emoji: roomData.emoji || '💬',
      is_private_room: roomData.is_private || false
    });

    if (error) {
      console.error('Error creating chat room:', error);
      return null;
    }

    return data;
  },

  // Get user's chat rooms
  async getUserRooms(): Promise<ChatRoom[]> {
    const { data, error } = await supabase.rpc('get_user_chat_rooms');

    if (error) {
      console.error('Error fetching user rooms:', error);
      return [];
    }

    return data || [];
  },

  // Get room by ID
  async getRoomById(roomId: string): Promise<ChatRoom | null> {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) {
      console.error('Error fetching room:', error);
      return null;
    }

    return data;
  },

  // Join a room
  async joinRoom(roomId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('chat_participants')
      .insert({
        room_id: roomId,
        user_id: user.id,
        role: 'member'
      });

    if (error) {
      console.error('Error joining room:', error);
      return false;
    }

    return true;
  },

  // Leave a room
  async leaveRoom(roomId: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('chat_participants')
      .delete()
      .eq('room_id', roomId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error leaving room:', error);
      return false;
    }

    return true;
  }
};

// =====================================================
// CHAT MESSAGES API
// =====================================================

export const chatMessagesApi = {
  // Send a message
  async sendMessage(roomId: string, content: string, messageType: ChatMessage['message_type'] = 'text', replyToId?: string): Promise<string | null> {
    const { data, error } = await supabase.rpc('send_message', {
      target_room_id: roomId,
      message_content: content,
      message_type: messageType,
      reply_to_message_id: replyToId || null
    });

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    return data;
  },

  // Get room messages with pagination
  async getRoomMessages(roomId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    const { data, error } = await supabase.rpc('get_room_messages', {
      target_room_id: roomId,
      limit_count: limit,
      offset_count: offset
    });

    if (error) {
      console.error('Error fetching room messages:', error);
      return [];
    }

    return data || [];
  },

  // Edit a message
  async editMessage(messageId: string, newContent: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_messages')
      .update({
        content: newContent,
        is_edited: true,
        edited_at: new Date().toISOString()
      })
      .eq('id', messageId);

    if (error) {
      console.error('Error editing message:', error);
      return false;
    }

    return true;
  },

  // Delete a message
  async deleteMessage(messageId: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      console.error('Error deleting message:', error);
      return false;
    }

    return true;
  }
};

// =====================================================
// AI CHAT SESSIONS API (for Minara Chat)
// =====================================================

export const aiChatApi = {
  // Create new AI chat session
  async createSession(title: string, aiModel: string = 'minara-x'): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .insert({
        user_id: user.id,
        title,
        ai_model: aiModel
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating AI session:', error);
      return null;
    }

    return data.id;
  },

  // Get user's AI chat sessions
  async getUserSessions(): Promise<AIChatSession[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching AI sessions:', error);
      return [];
    }

    return data || [];
  },

  // Update session last message
  async updateSessionLastMessage(sessionId: string, lastMessage: string): Promise<boolean> {
    const { error } = await supabase
      .from('ai_chat_sessions')
      .update({ last_message: lastMessage })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating AI session:', error);
      return false;
    }

    return true;
  },

  // Get AI session messages (using dedicated AI messages table)
  async getSessionMessages(sessionId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    try {
      // First try the dedicated AI messages table
      const { data, error } = await supabase
        .from('ai_messages')
        .select(`
          *,
          sender_profile:user_profiles(*)
        `)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching AI messages from dedicated table:', error);
        // Fallback to RPC if table doesn't exist
        return await this.getSessionMessagesRPC(sessionId, limit, offset);
      }

      // Convert AI messages to ChatMessage format
      return (data || []).map(msg => ({
        id: msg.id,
        room_id: msg.session_id,
        sender_id: msg.sender_id,
        content: msg.content,
        message_type: msg.message_type,
        reply_to_id: undefined,
        is_edited: false,
        edited_at: undefined,
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        sender_profile: msg.sender_profile,
        reactions: {}
      }));
    } catch (error) {
      console.error('Error in getSessionMessages:', error);
      return await this.getSessionMessagesRPC(sessionId, limit, offset);
    }
  },

  // RPC fallback for getting messages
  async getSessionMessagesRPC(sessionId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase.rpc('get_ai_session_messages_simple', {
        p_session_id: sessionId,
        limit_count: limit,
        offset_count: offset
      });

      if (error) {
        console.error('Error fetching AI session messages via RPC:', error);
        return [];
      }

      // Convert RPC result to ChatMessage format
      return (data || []).map((msg: any) => ({
        id: msg.message_id || msg.id,
        room_id: msg.session_id,
        sender_id: msg.sender_id,
        content: msg.content,
        message_type: msg.message_type,
        reply_to_id: undefined,
        is_edited: false,
        edited_at: undefined,
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        sender_profile: msg.sender_profile,
        reactions: {}
      }));
    } catch (error) {
      console.error('Error in getSessionMessagesRPC:', error);
      return [];
    }
  },



  // Send message to AI session (using dedicated AI messages table)
  async sendSessionMessage(sessionId: string, content: string, messageType: ChatMessage['message_type'] = 'text'): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Try the dedicated AI messages table first
      const { data, error } = await supabase
        .from('ai_messages')
        .insert({
          session_id: sessionId,
          sender_id: user.id,
          content,
          message_type: messageType,
          is_ai: false
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error sending AI message to dedicated table:', error);
        // Fallback to RPC if table doesn't exist
        return await this.sendSessionMessageRPC(sessionId, content, messageType);
      }

      // Update session last message
      await supabase
        .from('ai_chat_sessions')
        .update({ 
          last_message: content,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      return data.id;
    } catch (error) {
      console.error('Error in sendSessionMessage:', error);
      return await this.sendSessionMessageRPC(sessionId, content, messageType);
    }
  },

  // RPC fallback for sending messages
  async sendSessionMessageRPC(sessionId: string, content: string, messageType: ChatMessage['message_type'] = 'text'): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase.rpc('insert_ai_session_message_simple', {
        p_session_id: sessionId,
        p_sender_id: user.id,
        message_content: content,
        message_type: messageType,
        is_ai_message: false
      });

      if (error) {
        console.error('Error sending AI session message via RPC:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in sendSessionMessageRPC:', error);
      return null;
    }
  },


};

// =====================================================
// COMPANION RELATIONSHIPS API (for Companion Chat)
// =====================================================

export const companionApi = {
  // Create companion relationship
  async createRelationship(mentorId: string, menteeId: string, meetingSchedule?: any): Promise<string | null> {
    const { data, error } = await supabase
      .from('companion_relationships')
      .insert({
        mentor_id: mentorId,
        mentee_id: menteeId,
        meeting_schedule: meetingSchedule
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating companion relationship:', error);
      return null;
    }

    return data.id;
  },

  // Get user's companion relationships
  async getUserRelationships(): Promise<CompanionRelationship[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('companion_relationships')
      .select(`
        *,
        mentor_profile:user_profiles!companion_relationships_mentor_id_fkey(*),
        mentee_profile:user_profiles!companion_relationships_mentee_id_fkey(*)
      `)
      .or(`mentor_id.eq.${user.id},mentee_id.eq.${user.id}`)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching companion relationships:', error);
      return [];
    }

    return data || [];
  },

  // Update relationship status
  async updateRelationshipStatus(relationshipId: string, status: CompanionRelationship['status']): Promise<boolean> {
    const { error } = await supabase
      .from('companion_relationships')
      .update({ status })
      .eq('id', relationshipId);

    if (error) {
      console.error('Error updating relationship status:', error);
      return false;
    }

    return true;
  }
};

// =====================================================
// MESSAGE REACTIONS API
// =====================================================

export const reactionsApi = {
  // Add reaction to message
  async addReaction(messageId: string, reaction: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('message_reactions')
      .insert({
        message_id: messageId,
        user_id: user.id,
        reaction
      });

    if (error) {
      console.error('Error adding reaction:', error);
      return false;
    }

    return true;
  },

  // Remove reaction from message
  async removeReaction(messageId: string, reaction: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('message_reactions')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', user.id)
      .eq('reaction', reaction);

    if (error) {
      console.error('Error removing reaction:', error);
      return false;
    }

    return true;
  },

  // Get message reactions
  async getMessageReactions(messageId: string): Promise<MessageReaction[]> {
    const { data, error } = await supabase
      .from('message_reactions')
      .select('*')
      .eq('message_id', messageId);

    if (error) {
      console.error('Error fetching message reactions:', error);
      return [];
    }

    return data || [];
  }
};

// =====================================================
// REAL-TIME SUBSCRIPTIONS
// =====================================================

export class ChatRealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();

  // Subscribe to room messages
  subscribeToRoomMessages(roomId: string, callback: (message: ChatMessage) => void): RealtimeChannel {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();

    this.channels.set(`room:${roomId}`, channel);
    return channel;
  }

  // Subscribe to user's rooms
  async subscribeToUserRooms(callback: (room: ChatRoom) => void): Promise<RealtimeChannel> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const channel = supabase
      .channel(`user_rooms:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_participants',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const room = await chatRoomsApi.getRoomById(payload.new.room_id);
            if (room) callback(room);
          }
        }
      )
      .subscribe();

    this.channels.set(`user_rooms:${user.id}`, channel);
    return channel;
  }

  // Subscribe to notifications
  async subscribeToNotifications(callback: (notification: ChatNotification) => void): Promise<RealtimeChannel> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          callback(payload.new as ChatNotification);
        }
      )
      .subscribe();

    this.channels.set(`notifications:${user.id}`, channel);
    return channel;
  }

  // Unsubscribe from channel
  unsubscribe(channelKey: string): void {
    const channel = this.channels.get(channelKey);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelKey);
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll(): void {
    this.channels.forEach((channel, key) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
  }
}

// =====================================================
// EXPORT MAIN API OBJECT
// =====================================================

export const chatApi = {
  userProfile: userProfileApi,
  rooms: chatRoomsApi,
  messages: chatMessagesApi,
  ai: aiChatApi,
  companion: companionApi,
  reactions: reactionsApi,
  realtime: new ChatRealtimeManager()
};

export default chatApi; 