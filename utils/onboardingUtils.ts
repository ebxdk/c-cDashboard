import AsyncStorage from '@react-native-async-storage/async-storage';
import { userProfileApi } from '../lib/chatApi';

export interface OnboardingStatus {
  isEmailVerified: boolean;
  isGenderSelected: boolean;
  isProfileSetup: boolean;
  isPersonaSelected: boolean;
  isQuestionnaireCompleted: boolean;
  isSubscriptionSelected: boolean;
  isOnboardingComplete: boolean;
}

export const onboardingUtils = {
  // Check if user's email is verified
  async isEmailVerified(): Promise<boolean> {
    try {
      const { data: { user } } = await import('../lib/supabaseClient').then(m => m.supabase.auth.getUser());
      return user?.email_confirmed_at !== null;
    } catch (error) {
      console.error('Error checking email verification:', error);
      return false;
    }
  },

  // Check if gender is selected
  async isGenderSelected(): Promise<boolean> {
    try {
      const gender = await AsyncStorage.getItem('user-gender');
      return gender !== null;
    } catch (error) {
      console.error('Error checking gender selection:', error);
      return false;
    }
  },

  // Check if profile setup is completed
  async isProfileSetup(): Promise<boolean> {
    try {
      // Check if user has completed the profile setup flow using AsyncStorage
      const profileSetupComplete = await AsyncStorage.getItem('profile-setup-complete');
      // Default to false for new users (null means not completed)
      return profileSetupComplete === 'true';
    } catch (error) {
      console.error('Error checking profile setup:', error);
      return false;
    }
  },

  // Reset profile setup status (for new users)
  async resetProfileSetupStatus(): Promise<void> {
    try {
      await AsyncStorage.removeItem('profile-setup-complete');
    } catch (error) {
      console.error('Error resetting profile setup status:', error);
    }
  },

  // Reset gender selection (for new users)
  async resetGenderSelection(): Promise<void> {
    try {
      await AsyncStorage.removeItem('user-gender');
    } catch (error) {
      console.error('Error resetting gender selection:', error);
    }
  },

  // Check if AI persona is selected
  async isPersonaSelected(): Promise<boolean> {
    try {
      const persona = await AsyncStorage.getItem('selected-persona');
      return persona !== null;
    } catch (error) {
      console.error('Error checking persona selection:', error);
      return false;
    }
  },

  // Check if questionnaire is completed (all 10 questions)
  async isQuestionnaireCompleted(): Promise<boolean> {
    try {
      const answers = [];
      for (let i = 1; i <= 10; i++) {
        const answer = await AsyncStorage.getItem(`question-${i}-answer`);
        if (answer !== null) {
          answers.push(answer);
        }
      }
      return answers.length === 10;
    } catch (error) {
      console.error('Error checking questionnaire completion:', error);
      return false;
    }
  },

  // Check if subscription is selected
  async isSubscriptionSelected(): Promise<boolean> {
    try {
      const subscription = await AsyncStorage.getItem('selected-subscription');
      return subscription !== null;
    } catch (error) {
      console.error('Error checking subscription selection:', error);
      return false;
    }
  },

  // Get complete onboarding status
  async getOnboardingStatus(): Promise<OnboardingStatus> {
    const [
      isEmailVerified,
      isGenderSelected,
      isProfileSetup,
      isPersonaSelected,
      isQuestionnaireCompleted,
      isSubscriptionSelected
    ] = await Promise.all([
      this.isEmailVerified(),
      this.isGenderSelected(),
      this.isProfileSetup(),
      this.isPersonaSelected(),
      this.isQuestionnaireCompleted(),
      this.isSubscriptionSelected()
    ]);

    const isOnboardingComplete = isEmailVerified && 
                                isGenderSelected &&
                                isProfileSetup && 
                                isPersonaSelected && 
                                isQuestionnaireCompleted && 
                                isSubscriptionSelected;

    return {
      isEmailVerified,
      isGenderSelected,
      isProfileSetup,
      isPersonaSelected,
      isQuestionnaireCompleted,
      isSubscriptionSelected,
      isOnboardingComplete
    };
  },

  // Get the next onboarding step for the user
  async getNextOnboardingStep(): Promise<string | null> {
    const status = await this.getOnboardingStatus();
    
    if (!status.isEmailVerified) {
      return 'verify-email';
    }
    
    if (!status.isGenderSelected) {
      return 'profile-gender';
    }
    
    if (!status.isProfileSetup) {
      return 'profile-picture';
    }
    
    if (!status.isPersonaSelected) {
      return 'persona-selection';
    }
    
    if (!status.isQuestionnaireCompleted) {
      return 'question-1';
    }
    
    if (!status.isSubscriptionSelected) {
      return 'subscription';
    }
    
    return null; // Onboarding complete
  },

  // Mark profile setup as complete
  async markProfileSetupComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem('profile-setup-complete', 'true');
    } catch (error) {
      console.error('Error marking profile setup complete:', error);
    }
  },

  // Mark onboarding as complete (for testing purposes)
  async markOnboardingComplete(): Promise<void> {
    try {
      // Mark profile setup as complete
      await this.markProfileSetupComplete();

      // Set default gender (fallback to female)
      await AsyncStorage.setItem('user-gender', 'female');

      // Create a basic profile if it doesn't exist
      await userProfileApi.upsertProfile({
        full_name: 'Test User',
        bio: 'Test bio for onboarding completion',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        is_mentor: false
      });

      // Set default persona based on gender
      const userGender = await AsyncStorage.getItem('user-gender');
      let defaultPersona;
      
      if (userGender === 'male') {
        defaultPersona = {
          id: 0,
          name: "Ahmed",
          description: "Direct, scholarly & thoughtful approach 📖",
          gender: "male"
        };
      } else {
        defaultPersona = {
          id: 3,
          name: "Amina",
          description: "Soft, nurturing & compassionate tone 🤲",
          gender: "female"
        };
      }
      
      await AsyncStorage.setItem('selected-persona', JSON.stringify(defaultPersona));

      // Set default answers for all questions
      for (let i = 1; i <= 10; i++) {
        await AsyncStorage.setItem(`question-${i}-answer`, '1');
      }

      // Set default subscription
      await AsyncStorage.setItem('selected-subscription', 'support');
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
    }
  }
}; 