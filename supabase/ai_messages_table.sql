-- =====================================================
-- AI MESSAGES TABLE
-- Separate table to avoid RLS recursion issues
-- =====================================================

-- Drop existing functions first
DROP FUNCTION IF EXISTS get_ai_session_messages_simple(UUID, INTEGER, INTEGER);
DROP FUNCTION IF EXISTS insert_ai_session_message_simple(UUID, UUID, TEXT, TEXT, BOOLEAN);

-- Drop existing table if it exists
DROP TABLE IF EXISTS ai_messages CASCADE;

-- Create dedicated AI messages table
CREATE TABLE ai_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'ai_response', 'system')),
  is_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_messages_session_id ON ai_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON ai_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_messages_sender_id ON ai_messages(sender_id);

-- Enable RLS
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Simple RLS policy: users can only access their own AI messages
DROP POLICY IF EXISTS "Users can access their own AI messages" ON ai_messages;
CREATE POLICY "Users can access their own AI messages" ON ai_messages
  FOR ALL USING (
    session_id IN (
      SELECT id FROM ai_chat_sessions WHERE user_id = auth.uid()
    )
  );

-- Function to get AI session messages
CREATE OR REPLACE FUNCTION get_ai_session_messages_simple(
  p_session_id UUID,
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  message_id UUID,
  session_id UUID,
  sender_id UUID,
  content TEXT,
  message_type TEXT,
  is_ai BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  sender_profile JSONB
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Verify the session belongs to the authenticated user
  IF NOT EXISTS (
    SELECT 1 FROM ai_chat_sessions 
    WHERE id = p_session_id 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to AI session';
  END IF;

  -- Return messages with sender profile
  RETURN QUERY
  SELECT 
    am.id as message_id,
    am.session_id,
    am.sender_id,
    am.content,
    am.message_type,
    am.is_ai,
    am.created_at,
    am.updated_at,
    to_jsonb(up.*) as sender_profile
  FROM ai_messages am
  LEFT JOIN user_profiles up ON am.sender_id = up.id
  WHERE am.session_id = p_session_id
  ORDER BY am.created_at ASC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- Function to insert AI session message
CREATE OR REPLACE FUNCTION insert_ai_session_message_simple(
  p_session_id UUID,
  p_sender_id UUID,
  message_content TEXT,
  message_type TEXT DEFAULT 'text',
  is_ai_message BOOLEAN DEFAULT false
)
RETURNS TABLE (
  id UUID
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  message_id UUID;
BEGIN
  -- Verify the session belongs to the authenticated user
  IF NOT EXISTS (
    SELECT 1 FROM ai_chat_sessions 
    WHERE id = p_session_id 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to AI session';
  END IF;

  -- Verify the sender is the authenticated user (for non-AI messages)
  IF NOT is_ai_message AND p_sender_id != auth.uid() THEN
    RAISE EXCEPTION 'Sender ID must match authenticated user';
  END IF;

  -- Insert the message
  INSERT INTO ai_messages (
    session_id,
    sender_id,
    content,
    message_type,
    is_ai
  ) VALUES (
    p_session_id,
    p_sender_id,
    message_content,
    message_type,
    is_ai_message
  ) RETURNING id INTO message_id;

  -- Update session last message
  UPDATE ai_chat_sessions 
  SET last_message = message_content,
      updated_at = NOW()
  WHERE id = p_session_id;

  -- Return the message ID
  RETURN QUERY SELECT message_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_ai_session_messages_simple(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION insert_ai_session_message_simple(UUID, UUID, TEXT, TEXT, BOOLEAN) TO authenticated;

-- Grant table permissions
GRANT ALL ON ai_messages TO authenticated; 