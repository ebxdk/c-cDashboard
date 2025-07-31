import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileAgeScreen() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 18);
  const [showPicker, setShowPicker] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleContinue = () => {
    const age = currentYear - selectedYear;
    if (age < 13) {
      Alert.alert('Age Requirement', 'You must be at least 13 years old to use this app.');
      return;
    }
    if (age > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to the next profile setup page
    router.push('/profile-location');
  };

  const openPicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPicker(true);
  };

  const closePicker = () => {
    setShowPicker(false);
  };

  const confirmPicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPicker(false);
  };

  const age = currentYear - selectedYear;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#B8D4F0" translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.subtitle}>
            This helps us personalize your experience and ensure age-appropriate content.
          </Text>
          
          {/* Age Input Section */}
          <View style={styles.inputSection}>
            <TouchableOpacity style={styles.inputContainer} onPress={openPicker}>
              <Text style={styles.inputLabel}>Birth Year</Text>
              <View style={styles.inputValue}>
                <Text style={styles.inputText}>{selectedYear}</Text>
                <Ionicons name="chevron-down" size={20} color="#8E8E93" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.ageDisplay}>
              <Text style={styles.ageText}>Age: {age}</Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.continueButton, age >= 13 && age <= 120 && styles.continueButtonActive]} 
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={closePicker}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerHeader}>
              <TouchableOpacity onPress={closePicker}>
                <Text style={styles.pickerButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.pickerTitle}>Select Birth Year</Text>
              <TouchableOpacity onPress={confirmPicker}>
                <Text style={styles.pickerButton}>Done</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              style={styles.picker}
            >
              {years.map((year) => (
                <Picker.Item 
                  key={year} 
                  label={year.toString()} 
                  value={year}
                  color="#2C3E50"
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'System',
    lineHeight: 32,
  },
  inputSection: {
    width: '100%',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
    fontFamily: 'System',
  },
  inputValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'System',
  },
  ageDisplay: {
    marginTop: 16,
    alignItems: 'center',
  },
  ageText: {
    fontSize: 16,
    color: '#34495E',
    fontFamily: 'System',
    opacity: 0.8,
  },
  buttonContainer: {
    marginTop: 40,
  },
  continueButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
  },
  continueButtonActive: {
    backgroundColor: '#FFF8E7',
    borderColor: '#2C3E50',
  },
  continueButtonText: {
    color: '#2C3E50',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'System',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    fontFamily: 'System',
  },
  pickerButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
    fontFamily: 'System',
  },
  picker: {
    height: 200,
  },
}); 