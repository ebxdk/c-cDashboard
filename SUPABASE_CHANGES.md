# 🚀 Supabase Changes for Concurrent Chat Management

## 📋 Complete Setup Instructions

### Step 1: Database Setup

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Go to **SQL Editor**

2. **Run the Complete SQL Setup**
   - Copy the entire contents of `supabase-chat-setup.sql`
   - Paste it into the SQL Editor
   - Click **Run** to execute all commands

3. **Verify Tables Created**
   Check that these tables exist in your **Table Editor**:
   - ✅ `user_profiles`
   - ✅ `chat_rooms`
   - ✅ `chat_participants`
   - ✅ `chat_messages`
   - ✅ `ai_chat_sessions`
   - ✅ `companion_relationships`
   - ✅ `message_reactions`
   - ✅ `chat_notifications`

### Step 2: Enable Real-time

1. **Go to Database → Replication**
2. **Enable real-time for these tables:**
   - ✅ `chat_messages`
   - ✅ `chat_participants`
   - ✅ `chat_rooms`
   - ✅ `message_reactions`
   - ✅ `chat_notifications`

### Step 3: Authentication Setup

1. **Go to Authentication → Settings**
2. **Enable Email Auth** (if not already enabled)
3. **Configure OAuth providers** (Google, Apple) if needed

### Step 4: Row Level Security (RLS)

The SQL setup automatically creates RLS policies, but verify they're enabled:

1. **Go to Authentication → Policies**
2. **Check that RLS is enabled** on all chat tables
3. **Verify policies exist** for:
   - User profile access
   - Room participation
   - Message sending/receiving
   - AI session privacy

## 🔧 Frontend Integration Steps

### Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js
```

### Step 2: Environment Variables

Add to your `.env` file:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: User Profile Creation

Update your login/signup success handlers:

```typescript
// In login.tsx and signup.tsx
import chatApi from '../lib/chatApi';

// After successful authentication
const profile = await chatApi.userProfile.upsertProfile({
  full_name: 'User Name',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'User bio',
  is_mentor: false
});
```

### Step 4: Replace Chat Components

1. **Replace `group-chat.tsx`** with `group-chat-supabase.tsx`
2. **Update navigation** to pass room IDs:
   ```typescript
   router.push(`/group-chat?roomId=${roomId}`);
   ```

## 🧪 Testing the Setup

### Test 1: User Authentication
```typescript
// Check if user is authenticated
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);
```

### Test 2: Create a Test Room
```typescript
// Create a test support cohort room
const roomId = await chatApi.rooms.createRoom({
  name: 'Test Support Group',
  description: 'A test group for new Muslims',
  type: 'support_cohort',
  emoji: '🤝',
  is_private: false
});
console.log('Created room:', roomId);
```

### Test 3: Send a Test Message
```typescript
// Send a test message
const messageId = await chatApi.messages.sendMessage(
  roomId,
  'Hello from Supabase!'
);
console.log('Sent message:', messageId);
```

### Test 4: Real-time Messages
```typescript
// Subscribe to real-time messages
const channel = chatApi.realtime.subscribeToRoomMessages(
  roomId,
  (newMessage) => {
    console.log('New message:', newMessage);
  }
);
```

## 📱 Sample Data for Testing

### Create Sample Users
```sql
-- Insert sample user profiles (replace with real auth.users IDs)
INSERT INTO user_profiles (id, email, full_name, avatar_url, bio, is_mentor) VALUES
  ('11111111-1111-1111-1111-111111111111', 'omar@example.com', 'Omar Hassan', 'https://example.com/omar.jpg', 'Experienced Islamic mentor', TRUE),
  ('22222222-2222-2222-2222-222222222222', 'bilal@example.com', 'Bilal Ahmed', 'https://example.com/bilal.jpg', 'New Muslim seeking guidance', FALSE);
```

### Create Sample Rooms
```sql
-- Insert sample chat rooms
INSERT INTO chat_rooms (id, name, description, type, emoji, is_private, created_by) VALUES
  ('default-engineering-room', 'Engineering Team', 'A space for engineering discussions', 'affinity_group', '🔒', FALSE, '11111111-1111-1111-1111-111111111111'),
  ('new-muslim-support', 'New Muslim Support', 'Support group for new Muslims', 'support_cohort', '🤝', FALSE, '11111111-1111-1111-1111-111111111111');
```

### Add Sample Participants
```sql
-- Add participants to rooms
INSERT INTO chat_participants (room_id, user_id, role) VALUES
  ('default-engineering-room', '11111111-1111-1111-1111-111111111111', 'admin'),
  ('default-engineering-room', '22222222-2222-2222-2222-222222222222', 'member'),
  ('new-muslim-support', '11111111-1111-1111-1111-111111111111', 'admin'),
  ('new-muslim-support', '22222222-2222-2222-2222-222222222222', 'member');
```

### Add Sample Messages
```sql
-- Insert sample messages
INSERT INTO chat_messages (room_id, sender_id, content, message_type) VALUES
  ('default-engineering-room', '11111111-1111-1111-1111-111111111111', 'Welcome to the engineering team!', 'text'),
  ('default-engineering-room', '22222222-2222-2222-2222-222222222222', 'Thank you! Excited to be here.', 'text'),
  ('new-muslim-support', '11111111-1111-1111-1111-111111111111', 'Assalamu alaikum everyone!', 'text'),
  ('new-muslim-support', '22222222-2222-2222-2222-222222222222', 'Wa alaikum assalam!', 'text');
```

## 🔒 Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] User authentication working
- [ ] Users can only access their own data
- [ ] Room participation verified
- [ ] Message permissions working
- [ ] Real-time subscriptions secure

## 🚀 Performance Optimization

### Database Indexes
The SQL setup includes optimized indexes for:
- Message queries by room
- User participation lookups
- Timestamp-based sorting
- Reaction counts

### Real-time Optimization
- Messages are paginated (50 per load)
- Real-time subscriptions are cleaned up
- Optimistic updates for better UX

## 🆘 Troubleshooting

### Common Issues

1. **"Access denied" errors**
   - Check if user is authenticated
   - Verify RLS policies
   - Ensure user is a room participant

2. **Real-time not working**
   - Check if real-time is enabled in Supabase
   - Verify table subscriptions
   - Check network connectivity

3. **Messages not loading**
   - Verify room_id is correct
   - Check user participation
   - Look for SQL errors in logs

### Debug Commands

```typescript
// Check authentication
const { data: { user } } = await supabase.auth.getUser();
console.log('Auth user:', user);

// Check user profile
const profile = await chatApi.userProfile.getCurrentProfile();
console.log('User profile:', profile);

// Check room access
const rooms = await chatApi.rooms.getUserRooms();
console.log('User rooms:', rooms);

// Check room messages
const messages = await chatApi.messages.getRoomMessages(roomId);
console.log('Room messages:', messages);
```

## 📞 Support

If you encounter issues:

1. **Check Supabase logs** in the dashboard
2. **Verify SQL functions** are created correctly
3. **Test with simple operations** first
4. **Check network requests** in browser dev tools
5. **Review RLS policies** in the dashboard

---

**🎉 You're all set!** Your app now has a fully functional concurrent chat management system with real-time capabilities, security, and scalability. 