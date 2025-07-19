import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { userProfileApi, chatRoomsApi, chatMessagesApi } from '../lib/chatApi';

export default function ChatTestScreen() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [testRoom, setTestRoom] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const testUserProfile = async () => {
    try {
      const profile = await userProfileApi.getCurrentProfile();
      setUserProfile(profile);
      Alert.alert('Success', 'User profile loaded!');
    } catch (error) {
      Alert.alert('Error', `Failed to load profile: ${error}`);
    }
  };

  const testCreateRoom = async () => {
    try {
      const roomId = await chatRoomsApi.createRoom({
        name: 'Test Support Group',
        type: 'support_cohort',
        emoji: '🤝'
      });
      
      if (roomId) {
        setTestRoom({ id: roomId, name: 'Test Support Group' });
        Alert.alert('Success', `Room created with ID: ${roomId}`);
      } else {
        Alert.alert('Error', 'Failed to create room');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to create room: ${error}`);
    }
  };

  const testSendMessage = async () => {
    if (!testRoom) {
      Alert.alert('Error', 'Create a room first');
      return;
    }

    try {
      const messageId = await chatMessagesApi.sendMessage(
        testRoom.id,
        'Hello from test! 🚀'
      );
      
      if (messageId) {
        Alert.alert('Success', `Message sent with ID: ${messageId}`);
        // Load messages
        const roomMessages = await chatMessagesApi.getRoomMessages(testRoom.id);
        setMessages(roomMessages);
      } else {
        Alert.alert('Error', 'Failed to send message');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to send message: ${error}`);
    }
  };

  const testLoadMessages = async () => {
    if (!testRoom) {
      Alert.alert('Error', 'Create a room first');
      return;
    }

    try {
      const roomMessages = await chatMessagesApi.getRoomMessages(testRoom.id);
      setMessages(roomMessages);
      Alert.alert('Success', `Loaded ${roomMessages.length} messages`);
    } catch (error) {
      Alert.alert('Error', `Failed to load messages: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Supabase Chat Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Profile</Text>
        <TouchableOpacity style={styles.button} onPress={testUserProfile}>
          <Text style={styles.buttonText}>Test User Profile</Text>
        </TouchableOpacity>
        {userProfile && (
          <Text style={styles.result}>
            ✅ Profile: {userProfile.full_name} ({userProfile.email})
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chat Room</Text>
        <TouchableOpacity style={styles.button} onPress={testCreateRoom}>
          <Text style={styles.buttonText}>Create Test Room</Text>
        </TouchableOpacity>
        {testRoom && (
          <Text style={styles.result}>
            ✅ Room: {testRoom.name} (ID: {testRoom.id})
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Messages</Text>
        <TouchableOpacity style={styles.button} onPress={testSendMessage}>
          <Text style={styles.buttonText}>Send Test Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={testLoadMessages}>
          <Text style={styles.buttonText}>Load Messages</Text>
        </TouchableOpacity>
        {messages.length > 0 && (
          <Text style={styles.result}>
            ✅ Messages: {messages.length} loaded
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next Steps</Text>
        <Text style={styles.instruction}>
          1. Run the SQL setup in Supabase Dashboard{'\n'}
          2. Enable real-time for all tables{'\n'}
          3. Test each function above{'\n'}
          4. Replace your chat components
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  section: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  result: {
    fontSize: 14,
    color: '#28a745',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#d4edda',
    borderRadius: 5,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 