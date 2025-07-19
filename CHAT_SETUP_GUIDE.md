# 🚀 Concurrent Chat Management Setup Guide

## Overview

This guide will help you implement **concurrent chat management** for all three chat types in your app using Supabase's real-time capabilities:

1. **🧠 Minara Chat** - AI-powered Islamic assistant
2. **🔒 Group Chat** - Support+ cohort chats & affinity groups  
3. **🤝 Companion Chat** - 1-on-1 companion relationships

## 📋 Prerequisites

- Supabase project set up
- React Native app with Expo
- `@supabase/supabase-js` installed
- User authentication working

## 🗄️ Database Setup

### Step 1: Run the SQL Setup

1. Go to your Supabase Dashboard → SQL Editor
2. Copy and paste the entire contents of `supabase-chat-setup.sql`
3. Run the script to create all tables, functions, and policies

### Step 2: Verify Setup

Check that these tables were created:
- `user_profiles`
- `chat_rooms`
- `chat_participants`
- `chat_messages`
- `ai_chat_sessions`
- `companion_relationships`
- `message_reactions`
- `chat_notifications`

## 🔧 Frontend Integration

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Step 2: Import the Chat API

```typescript
import chatApi from '../lib/chatApi';
```

### Step 3: Initialize User Profile

```typescript
// In your login/signup success handler
const profile = await chatApi.userProfile.upsertProfile({
  full_name: 'User Name',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'User bio',
  is_mentor: false
});
```

## 🧠 Minara Chat Integration

### Replace Mock Data with Real Supabase Data

```typescript
// In minara-chat.tsx
import chatApi from '../lib/chatApi';

// Replace mock chat history with real data
const [chatHistory, setChatHistory] = useState<AIChatSession[]>([]);

useEffect(() => {
  loadAIChatSessions();
}, []);

const loadAIChatSessions = async () => {
  const sessions = await chatApi.ai.getUserSessions();
  setChatHistory(sessions);
};

// Replace mock messages with real data
const [messages, setMessages] = useState<ChatMessage[]>([]);

const loadRoomMessages = async (roomId: string) => {
  const roomMessages = await chatApi.messages.getRoomMessages(roomId);
  setMessages(roomMessages);
};

// Send real messages
const handleSendMessage = async () => {
  if (!message.trim() || !currentChatId) return;
  
  const messageId = await chatApi.messages.sendMessage(
    currentChatId, 
    message.trim(), 
    'text'
  );
  
  if (messageId) {
    setMessage('');
    // Real-time will handle the UI update
  }
};
```

### Add Real-time Subscriptions

```typescript
useEffect(() => {
  if (currentChatId) {
    // Subscribe to real-time messages
    const channel = chatApi.realtime.subscribeToRoomMessages(
      currentChatId,
      (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      }
    );

    return () => {
      chatApi.realtime.unsubscribe(`room:${currentChatId}`);
    };
  }
}, [currentChatId]);
```

## 🔒 Group Chat Integration

### Replace Mock Group Data

```typescript
// In group-chat.tsx
import chatApi from '../lib/chatApi';

// Replace mock messages with real data
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [room, setRoom] = useState<ChatRoom | null>(null);

useEffect(() => {
  loadRoomData();
}, [roomId]);

const loadRoomData = async () => {
  // Load room info
  const roomData = await chatApi.rooms.getRoomById(roomId);
  setRoom(roomData);
  
  // Load messages
  const roomMessages = await chatApi.messages.getRoomMessages(roomId);
  setMessages(roomMessages);
};

// Send real messages
const handleSendMessage = async () => {
  if (!message.trim() || !roomId) return;
  
  const messageId = await chatApi.messages.sendMessage(
    roomId,
    message.trim()
  );
  
  if (messageId) {
    setMessage('');
  }
};
```

### Add Real-time for Group Chats

```typescript
useEffect(() => {
  if (roomId) {
    const channel = chatApi.realtime.subscribeToRoomMessages(
      roomId,
      (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      }
    );

    return () => {
      chatApi.realtime.unsubscribe(`room:${roomId}`);
    };
  }
}, [roomId]);
```

## 🤝 Companion Chat Integration

### Replace Mock Companion Data

```typescript
// In companion-chat.tsx
import chatApi from '../lib/chatApi';

// Replace mock relationship with real data
const [relationship, setRelationship] = useState<CompanionRelationship | null>(null);
const [messages, setMessages] = useState<ChatMessage[]>([]);

useEffect(() => {
  loadCompanionData();
}, []);

const loadCompanionData = async () => {
  // Load user's companion relationships
  const relationships = await chatApi.companion.getUserRelationships();
  
  if (relationships.length > 0) {
    const activeRelationship = relationships[0];
    setRelationship(activeRelationship);
    
    // Load messages for the companion chat room
    const roomMessages = await chatApi.messages.getRoomMessages(
      activeRelationship.id // Use relationship ID as room ID
    );
    setMessages(roomMessages);
  }
};

// Send real messages
const handleSendMessage = async () => {
  if (!message.trim() || !relationship) return;
  
  const messageId = await chatApi.messages.sendMessage(
    relationship.id,
    message.trim()
  );
  
  if (messageId) {
    setInputText('');
  }
};
```

## 🔄 Real-time Features

### Message Reactions

```typescript
// Add reaction to message
const handleAddReaction = async (messageId: string, reaction: string) => {
  await chatApi.reactions.addReaction(messageId, reaction);
};

// Remove reaction
const handleRemoveReaction = async (messageId: string, reaction: string) => {
  await chatApi.reactions.removeReaction(messageId, reaction);
};
```

### Notifications

```typescript
// Subscribe to notifications
useEffect(() => {
  const channel = chatApi.realtime.subscribeToNotifications(
    (notification) => {
      // Handle new notification
      console.log('New notification:', notification);
      // Show toast or update badge
    }
  );

  return () => {
    chatApi.realtime.unsubscribe(`notifications:${userId}`);
  };
}, []);
```

## 🏗️ Room Management

### Create New Rooms

```typescript
// Create support cohort room
const createSupportRoom = async () => {
  const roomId = await chatApi.rooms.createRoom({
    name: 'New Muslim Support Group',
    description: 'A safe space for new Muslims to ask questions',
    type: 'support_cohort',
    emoji: '🤝',
    is_private: false
  });
  
  if (roomId) {
    // Navigate to the new room
    router.push(`/group-chat?roomId=${roomId}`);
  }
};

// Create companion relationship room
const createCompanionRoom = async (mentorId: string) => {
  const relationshipId = await chatApi.companion.createRelationship(
    mentorId,
    currentUserId,
    {
      days: ['tuesday', 'friday'],
      time: '09:00',
      timezone: 'UTC'
    }
  );
  
  if (relationshipId) {
    // Navigate to companion chat
    router.push(`/companion-chat?relationshipId=${relationshipId}`);
  }
};
```

### Join/Leave Rooms

```typescript
// Join a public room
const joinRoom = async (roomId: string) => {
  const success = await chatApi.rooms.joinRoom(roomId);
  if (success) {
    // Navigate to room
    router.push(`/group-chat?roomId=${roomId}`);
  }
};

// Leave a room
const leaveRoom = async (roomId: string) => {
  const success = await chatApi.rooms.leaveRoom(roomId);
  if (success) {
    // Navigate back
    router.back();
  }
};
```

## 🔒 Security & Permissions

The setup includes Row Level Security (RLS) policies that ensure:

- Users can only see messages in rooms they participate in
- Users can only send messages to rooms they're members of
- Users can only edit/delete their own messages
- AI sessions are private to each user
- Companion relationships are only visible to participants

## 📱 Performance Optimization

### Message Pagination

```typescript
const [hasMoreMessages, setHasMoreMessages] = useState(true);
const [messageOffset, setMessageOffset] = useState(0);

const loadMoreMessages = async () => {
  const newMessages = await chatApi.messages.getRoomMessages(
    roomId,
    50,
    messageOffset
  );
  
  if (newMessages.length < 50) {
    setHasMoreMessages(false);
  }
  
  setMessages(prev => [...newMessages, ...prev]);
  setMessageOffset(prev => prev + 50);
};
```

### Optimistic Updates

```typescript
const handleSendMessage = async () => {
  const tempMessage = {
    id: `temp-${Date.now()}`,
    content: message,
    sender_id: currentUserId,
    created_at: new Date().toISOString(),
    // ... other fields
  };
  
  // Add message optimistically
  setMessages(prev => [...prev, tempMessage]);
  setMessage('');
  
  // Send to server
  const messageId = await chatApi.messages.sendMessage(roomId, message);
  
  if (messageId) {
    // Replace temp message with real one
    setMessages(prev => prev.map(msg => 
      msg.id === tempMessage.id 
        ? { ...msg, id: messageId }
        : msg
    ));
  }
};
```

## 🧪 Testing

### Test Real-time Features

1. Open the same chat room in multiple browser tabs/devices
2. Send messages from different tabs
3. Verify messages appear in real-time across all tabs
4. Test reactions and notifications

### Test Security

1. Try to access a room you're not a member of
2. Try to send messages to rooms you don't have access to
3. Verify RLS policies are working correctly

## 🚀 Deployment Checklist

- [ ] SQL setup completed in Supabase
- [ ] Real-time subscriptions enabled
- [ ] RLS policies tested
- [ ] User profiles created on signup
- [ ] Chat API integrated in all three chat components
- [ ] Real-time subscriptions working
- [ ] Message pagination implemented
- [ ] Error handling added
- [ ] Performance optimized

## 🆘 Troubleshooting

### Common Issues

1. **Real-time not working**: Check if real-time is enabled in Supabase dashboard
2. **RLS blocking access**: Verify user is authenticated and has proper permissions
3. **Messages not loading**: Check room_id and user participation
4. **Performance issues**: Implement pagination and optimistic updates

### Debug Commands

```typescript
// Check user authentication
const { data: { user } } = await supabase.auth.getUser();
console.log('Current user:', user);

// Check user profile
const profile = await chatApi.userProfile.getCurrentProfile();
console.log('User profile:', profile);

// Check room access
const rooms = await chatApi.rooms.getUserRooms();
console.log('User rooms:', rooms);
```

## 📞 Support

If you encounter issues:

1. Check Supabase logs in the dashboard
2. Verify all SQL functions are created correctly
3. Test with a simple message first
4. Check network requests in browser dev tools

---

**🎉 Congratulations!** You now have a fully functional concurrent chat management system that supports all three chat types with real-time capabilities, security, and scalability. 