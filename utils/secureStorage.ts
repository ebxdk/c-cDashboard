import * as SecureStore from 'expo-secure-store';

export interface StoredCredentials {
  email: string;
  password: string;
}

export const storeCredentials = async (email: string, password: string): Promise<boolean> => {
  try {
    await SecureStore.setItemAsync('user_email', email);
    await SecureStore.setItemAsync('user_password', password);
    console.log('Credentials stored securely');
    return true;
  } catch (error) {
    console.error('Failed to store credentials:', error);
    return false;
  }
};

export const getStoredCredentials = async (): Promise<StoredCredentials | null> => {
  try {
    const email = await SecureStore.getItemAsync('user_email');
    const password = await SecureStore.getItemAsync('user_password');
    
    if (email && password) {
      return { email, password };
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve credentials:', error);
    return null;
  }
};

export const clearStoredCredentials = async (): Promise<boolean> => {
  try {
    await SecureStore.deleteItemAsync('user_email');
    await SecureStore.deleteItemAsync('user_password');
    console.log('Stored credentials cleared');
    return true;
  } catch (error) {
    console.error('Failed to clear credentials:', error);
    return false;
  }
};

export const hasStoredCredentials = async (): Promise<boolean> => {
  try {
    const email = await SecureStore.getItemAsync('user_email');
    const password = await SecureStore.getItemAsync('user_password');
    return !!(email && password);
  } catch (error) {
    console.error('Failed to check stored credentials:', error);
    return false;
  }
}; 