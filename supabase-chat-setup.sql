-- =====================================================
-- SUPABASE CHAT BACKEND SETUP
-- Concurrent Chat Management for All Chat Types
-- =====================================================

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- =====================================================
-- 1. USER PROFILES & AUTHENTICATION
-- =====================================================

-- Extended user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  is_mentor BOOLEAN DEFAULT FALSE,
  mentor_specialties TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CHAT ROOMS (for all chat types)
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('support_cohort', 'companion_1on1', 'affinity_group')),
  emoji TEXT DEFAULT '💬',
  is_private BOOLEAN DEFAULT FALSE,
  max_participants INTEGER DEFAULT 100,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CHAT PARTICIPANTS (for all chat types)
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(room_id, user_id)
);

-- =====================================================
-- 4. CHAT MESSAGES (unified for all chat types)
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'ai_response', 'file', 'image')),
  reply_to_id UUID REFERENCES chat_messages(id),
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. AI CHAT SESSIONS (for Minara Chat)
-- =====================================================

CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  last_message TEXT,
  ai_model TEXT DEFAULT 'minara-x',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. COMPANION RELATIONSHIPS (for Companion Chat)
-- =====================================================

CREATE TABLE IF NOT EXISTS companion_relationships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentor_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'paused', 'ended')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  meeting_schedule JSONB, -- {"days": ["tuesday", "friday"], "time": "09:00", "timezone": "UTC"}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mentor_id, mentee_id)
);

-- =====================================================
-- 7. AFFINITY GROUPS (for Group Chat)
-- =====================================================

CREATE TABLE IF NOT EXISTS affinity_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'engineering', 'design', 'product', etc.
  emoji TEXT DEFAULT '🔒',
  is_private BOOLEAN DEFAULT TRUE,
  max_members INTEGER DEFAULT 50,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. MESSAGE REACTIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL, -- emoji or text
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, reaction)
);

-- =====================================================
-- 9. CHAT NOTIFICATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS chat_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('mention', 'reply', 'reaction', 'system')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Chat messages indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);

-- Chat participants indexes
CREATE INDEX IF NOT EXISTS idx_chat_participants_room_id ON chat_participants(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON chat_participants(user_id);

-- AI chat sessions indexes
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_user_id ON ai_chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_sessions_updated_at ON ai_chat_sessions(updated_at);

-- Companion relationships indexes
CREATE INDEX IF NOT EXISTS idx_companion_relationships_mentor_id ON companion_relationships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_companion_relationships_mentee_id ON companion_relationships(mentee_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_chat_notifications_user_id ON chat_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_notifications_is_read ON chat_notifications(is_read);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE companion_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE affinity_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_notifications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Chat rooms policies
CREATE POLICY "Users can view rooms they participate in" ON chat_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE room_id = chat_rooms.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can create rooms" ON chat_rooms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Chat participants policies
CREATE POLICY "Users can view participants in their rooms" ON chat_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_participants cp2
      WHERE cp2.room_id = chat_participants.room_id AND cp2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join public rooms" ON chat_participants
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chat_rooms 
      WHERE id = room_id AND NOT is_private
    )
  );

-- Chat messages policies
CREATE POLICY "Users can view messages in their rooms" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE room_id = chat_messages.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their rooms" ON chat_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chat_participants 
      WHERE room_id = chat_messages.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can edit their own messages" ON chat_messages
  FOR UPDATE USING (sender_id = auth.uid());

-- AI chat sessions policies
CREATE POLICY "Users can view their own AI sessions" ON ai_chat_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own AI sessions" ON ai_chat_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own AI sessions" ON ai_chat_sessions
  FOR UPDATE USING (user_id = auth.uid());

-- Companion relationships policies
CREATE POLICY "Users can view their companion relationships" ON companion_relationships
  FOR SELECT USING (mentor_id = auth.uid() OR mentee_id = auth.uid());

CREATE POLICY "Users can create companion relationships" ON companion_relationships
  FOR INSERT WITH CHECK (mentor_id = auth.uid() OR mentee_id = auth.uid());

-- =====================================================
-- FUNCTIONS FOR CHAT OPERATIONS
-- =====================================================

-- Function to create a new chat room
CREATE OR REPLACE FUNCTION create_chat_room(
  room_name TEXT,
  room_description TEXT,
  room_type TEXT,
  room_emoji TEXT DEFAULT '💬',
  is_private_room BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_room_id UUID;
BEGIN
  INSERT INTO chat_rooms (name, description, type, emoji, is_private, created_by)
  VALUES (room_name, room_description, room_type, room_emoji, is_private_room, auth.uid())
  RETURNING id INTO new_room_id;
  
  -- Automatically add creator as admin participant
  INSERT INTO chat_participants (room_id, user_id, role)
  VALUES (new_room_id, auth.uid(), 'admin');
  
  RETURN new_room_id;
END;
$$;

-- Function to get user's chat rooms
CREATE OR REPLACE FUNCTION get_user_chat_rooms()
RETURNS TABLE (
  room_id UUID,
  room_name TEXT,
  room_description TEXT,
  room_type TEXT,
  room_emoji TEXT,
  is_private BOOLEAN,
  participant_count BIGINT,
  last_message_content TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cr.id,
    cr.name,
    cr.description,
    cr.type,
    cr.emoji,
    cr.is_private,
    COUNT(cp.user_id)::BIGINT as participant_count,
    cm.content as last_message_content,
    cm.created_at as last_message_time
  FROM chat_rooms cr
  INNER JOIN chat_participants cp ON cr.id = cp.room_id
  LEFT JOIN LATERAL (
    SELECT content, created_at 
    FROM chat_messages 
    WHERE room_id = cr.id 
    ORDER BY created_at DESC 
    LIMIT 1
  ) cm ON true
  WHERE cp.user_id = auth.uid()
  GROUP BY cr.id, cr.name, cr.description, cr.type, cr.emoji, cr.is_private, cm.content, cm.created_at
  ORDER BY cm.created_at DESC NULLS LAST;
END;
$$;

-- Function to get room messages with pagination
CREATE OR REPLACE FUNCTION get_room_messages(
  target_room_id UUID,
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  message_id UUID,
  sender_id UUID,
  sender_name TEXT,
  sender_avatar TEXT,
  content TEXT,
  message_type TEXT,
  reply_to_id UUID,
  is_edited BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  reactions JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is participant
  IF NOT EXISTS (
    SELECT 1 FROM chat_participants 
    WHERE room_id = target_room_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: User is not a participant in this room';
  END IF;
  
  RETURN QUERY
  SELECT 
    cm.id,
    cm.sender_id,
    up.full_name,
    up.avatar_url,
    cm.content,
    cm.message_type,
    cm.reply_to_id,
    cm.is_edited,
    cm.created_at,
    COALESCE(
      (SELECT jsonb_object_agg(reaction, COUNT(*))
       FROM message_reactions mr
       WHERE mr.message_id = cm.id
       GROUP BY mr.message_id), 
      '{}'::jsonb
    ) as reactions
  FROM chat_messages cm
  INNER JOIN user_profiles up ON cm.sender_id = up.id
  WHERE cm.room_id = target_room_id
  ORDER BY cm.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- Function to send a message
CREATE OR REPLACE FUNCTION send_message(
  target_room_id UUID,
  message_content TEXT,
  message_type TEXT DEFAULT 'text',
  reply_to_message_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_message_id UUID;
BEGIN
  -- Check if user is participant
  IF NOT EXISTS (
    SELECT 1 FROM chat_participants 
    WHERE room_id = target_room_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied: User is not a participant in this room';
  END IF;
  
  -- Insert the message
  INSERT INTO chat_messages (room_id, sender_id, content, message_type, reply_to_id)
  VALUES (target_room_id, auth.uid(), message_content, message_type, reply_to_message_id)
  RETURNING id INTO new_message_id;
  
  -- Update last read timestamp for sender
  UPDATE chat_participants 
  SET last_read_at = NOW()
  WHERE room_id = target_room_id AND user_id = auth.uid();
  
  RETURN new_message_id;
END;
$$;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_chat_sessions_updated_at BEFORE UPDATE ON ai_chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample user profiles (replace with real auth.users)
-- INSERT INTO user_profiles (id, email, full_name, avatar_url, bio, is_mentor) VALUES
--   ('11111111-1111-1111-1111-111111111111', 'omar@example.com', 'Omar Hassan', 'https://example.com/omar.jpg', 'Experienced Islamic mentor', TRUE),
--   ('22222222-2222-2222-2222-222222222222', 'bilal@example.com', 'Bilal Ahmed', 'https://example.com/bilal.jpg', 'New Muslim seeking guidance', FALSE);

-- =====================================================
-- REAL-TIME SUBSCRIPTION SETUP
-- =====================================================

-- Enable real-time for all chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_notifications;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

SELECT 'Supabase Chat Backend Setup Complete!' as status; 