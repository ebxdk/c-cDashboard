import * as LocalAuthentication from 'expo-local-authentication';

export interface BiometricInfo {
  isAvailable: boolean;
  type: string;
  icon: string;
}

export const checkBiometricAvailability = async (): Promise<BiometricInfo> => {
  try {
    console.log('Checking biometric availability...');
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    console.log('Hardware available:', hasHardware);
    console.log('Biometric enrolled:', isEnrolled);
    
    if (hasHardware && isEnrolled) {
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log('Supported types:', supportedTypes);
      
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        console.log('Face ID detected');
        return {
          isAvailable: true,
          type: 'Face ID',
          icon: '👁️'
        };
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        console.log('Touch ID detected');
        return {
          isAvailable: true,
          type: 'Touch ID',
          icon: '👆'
        };
      } else {
        console.log('Generic biometric detected');
        return {
          isAvailable: true,
          type: 'Biometric',
          icon: '🔐'
        };
      }
    }
    
    console.log('Biometric not available');
    return {
      isAvailable: false,
      type: '',
      icon: ''
    };
  } catch (error) {
    console.log('Biometric check failed:', error);
    return {
      isAvailable: false,
      type: '',
      icon: ''
    };
  }
};

export const authenticateWithBiometric = async (
  promptMessage: string,
  fallbackLabel: string = 'Use passcode',
  cancelLabel: string = 'Cancel'
): Promise<{ success: boolean; error?: any }> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel,
      cancelLabel,
      disableDeviceFallback: false,
    });

    return {
      success: result.success,
      error: result.success ? undefined : 'Authentication failed'
    };
  } catch (error) {
    return {
      success: false,
      error
    };
  }
}; 