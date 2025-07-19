-- =====================================================
-- AI CHAT SESSION FUNCTIONS
-- Bypass RLS policies to avoid infinite recursion
-- =====================================================

-- Function to get AI session messages
CREATE OR REPLACE FUNCTION get_ai_session_messages(
  session_id UUID,
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  room_id UUID,
  sender_id UUID,
  content TEXT,
  message_type TEXT,
  reply_to_id UUID,
  is_edited BOOLEAN,
  edited_at TIMESTAMPTZ,
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
    WHERE id = session_id 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to AI session';
  END IF;

  -- Return messages with sender profile
  RETURN QUERY
  SELECT 
    cm.id,
    cm.room_id,
    cm.sender_id,
    cm.content,
    cm.message_type,
    cm.reply_to_id,
    cm.is_edited,
    cm.edited_at,
    cm.created_at,
    cm.updated_at,
    to_jsonb(up.*) as sender_profile
  FROM chat_messages cm
  LEFT JOIN user_profiles up ON cm.sender_id = up.id
  WHERE cm.room_id = session_id
  ORDER BY cm.created_at ASC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- Function to insert AI session message
CREATE OR REPLACE FUNCTION insert_ai_session_message(
  session_id UUID,
  sender_id UUID,
  message_content TEXT,
  message_type TEXT DEFAULT 'text'
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
    WHERE id = session_id 
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to AI session';
  END IF;

  -- Verify the sender is the authenticated user
  IF sender_id != auth.uid() THEN
    RAISE EXCEPTION 'Sender ID must match authenticated user';
  END IF;

  -- Insert the message
  INSERT INTO chat_messages (
    room_id,
    sender_id,
    content,
    message_type,
    is_edited,
    created_at,
    updated_at
  ) VALUES (
    session_id,
    sender_id,
    message_content,
    message_type,
    false,
    NOW(),
    NOW()
  ) RETURNING id INTO message_id;

  -- Update session last message
  UPDATE ai_chat_sessions 
  SET last_message = message_content,
      updated_at = NOW()
  WHERE id = session_id;

  -- Return the message ID
  RETURN QUERY SELECT message_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_ai_session_messages(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION insert_ai_session_message(UUID, UUID, TEXT, TEXT) TO authenticated; 