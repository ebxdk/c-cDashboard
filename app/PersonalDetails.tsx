import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, Pressable, GestureResponderEvent, TextInput, Button, StyleSheet, ScrollView, Platform, TouchableOpacity
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface PersonalDetailsProps {
  visible: boolean;
  onClose: (event?: GestureResponderEvent) => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ visible, onClose }) => {
  const [fullname, setfullname] = useState('');
  const [aboutme, setaboutme] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [height, setHeight] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [company, setCompany] = useState('');
  const [education, setEducation] = useState('');
  const [institution, setInstitution] = useState('');
  const [ageRange, setAgeRange] = useState<[number, number]>([25, 35]);
  const [hobbies, setHobbies] = useState('');
  const [interests, setInterests] = useState('');
  const [languages, setLanguages] = useState('');
  const [religion, setReligion] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [lookingfor, setLookingfor] = useState('');
  const [smoking, setSmoking] = useState('');
  const [drinking, setDrinking] = useState('');
  const [genderModalVisible, setGenderModalVisible] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await AsyncStorage.getItem('profileData');
      if (data) {
        const parsed = JSON.parse(data);
        setfullname(parsed.fullname || '');
        setaboutme(parsed.aboutme || '');
        setGender(parsed.gender || '');
        setDob(parsed.dob || '');
        setHeight(parsed.height || '');
        setLocation(parsed.location || '');
        setOccupation(parsed.occupation || '');
        setCompany(parsed.company || '');
        setEducation(parsed.education || '');
        setInstitution(parsed.institution || '');
        setAgeRange(parsed.ageRange || [25, 35]);
        setHobbies(parsed.hobbies || '');
        setInterests(parsed.interests || '');
        setLanguages(parsed.languages || '');
        setReligion(parsed.religion || '');
        setEthnicity(parsed.ethnicity || '');
        setLookingfor(parsed.lookingfor || '');
        setSmoking(parsed.smoking || '');
        setDrinking(parsed.drinking || '');
      }
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    const data = {
      fullname, aboutme, gender, dob, occupation, education, institution, company, ageRange,
      hobbies, interests, languages, religion, ethnicity, height, smoking, drinking, lookingfor
    };
    await AsyncStorage.setItem('profileData', JSON.stringify(data));
    console.log('Profile saved', data);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sheet}>

          <Pressable onPress={onClose} style={styles.iconClose}>
            <Ionicons name="close" size={24} color="#007AFF" />
          </Pressable>

          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.heading}>Complete Your Profile</Text>

            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#999" value={fullname} onChangeText={setfullname} />
            <TextInput style={styles.input} placeholder="About Me" placeholderTextColor="#999" value={aboutme} onChangeText={setaboutme} />

            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity style={styles.pickerContainer} onPress={() => setGenderModalVisible(true)}>
              <Text style={styles.pickerText}>{gender || 'Select Gender'}</Text>
            </TouchableOpacity>

            <Modal visible={genderModalVisible} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.sheet}>
                  <Text style={styles.heading}>Select Gender</Text>
                  <TouchableOpacity style={styles.optionItem} onPress={() => { setGender('male'); setGenderModalVisible(false); }}>
                    <Text>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionItem} onPress={() => { setGender('female'); setGenderModalVisible(false); }}>
                    <Text>Female</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionItem} onPress={() => { setGender('preferNot'); setGenderModalVisible(false); }}>
                    <Text>Prefer not to say</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.optionItem} onPress={() => setGenderModalVisible(false)}>
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TextInput style={styles.input} placeholder="Date of Birth (YYYY-MM-DD)" placeholderTextColor="#999" value={dob} onChangeText={setDob} />
            <TextInput style={styles.input} placeholder="Height" placeholderTextColor="#999" value={height} onChangeText={setHeight} />
            <TextInput style={styles.input} placeholder="Location" placeholderTextColor="#999" value={location} onChangeText={setLocation} />
            <TextInput style={styles.input} placeholder="Occupation" placeholderTextColor="#999" value={occupation} onChangeText={setOccupation} />
            <TextInput style={styles.input} placeholder="Company" placeholderTextColor="#999" value={company} onChangeText={setCompany} />
            <TextInput style={styles.input} placeholder="Education" placeholderTextColor="#999" value={education} onChangeText={setEducation} />
            <TextInput style={styles.input} placeholder="Institution" placeholderTextColor="#999" value={institution} onChangeText={setInstitution} />

            <View style={styles.sliderContainer}>
              <Text style={styles.label}>Age Preference</Text>
              <View style={styles.rangeInputs}>
                <TextInput
                  style={styles.rangeInput}
                  keyboardType="numeric"
                  value={ageRange[0].toString()}
                  onChangeText={(val) => {
                    const num = Math.max(16, Math.min(Number(val), ageRange[1]));
                    setAgeRange([num, ageRange[1]]);
                  }}
                  placeholder="Min"
                  placeholderTextColor="#999"
                />
                <Text style={{ marginHorizontal: 8 }}>-</Text>
                <TextInput
                  style={styles.rangeInput}
                  keyboardType="numeric"
                  value={ageRange[1].toString()}
                  onChangeText={(val) => {
                    const num = Math.min(100, Math.max(Number(val), ageRange[0]));
                    setAgeRange([ageRange[0], num]);
                  }}
                  placeholder="Max"
                  placeholderTextColor="#999"
                />
              </View>
              <MultiSlider
                values={ageRange}
                min={16}
                max={100}
                step={1}
                onValuesChange={(values: number[]) => setAgeRange([values[0], values[1]])}
                selectedStyle={{ backgroundColor: '#007AFF' }}
                unselectedStyle={{ backgroundColor: '#D3D3D3' }}
                markerStyle={{ backgroundColor: '#007AFF' }}
                sliderLength={600}
              />
            </View>

            <TextInput style={styles.input} placeholder="Hobbies" placeholderTextColor="#999" value={hobbies} onChangeText={setHobbies} />
            <TextInput style={styles.input} placeholder="Interests" placeholderTextColor="#999" value={interests} onChangeText={setInterests} />
            <TextInput style={styles.input} placeholder="Languages" placeholderTextColor="#999" value={languages} onChangeText={setLanguages} />
            <TextInput style={styles.input} placeholder="Religion" placeholderTextColor="#999" value={religion} onChangeText={setReligion} />
            <TextInput style={styles.input} placeholder="Ethnicity" placeholderTextColor="#999" value={ethnicity} onChangeText={setEthnicity} />
            <TextInput style={styles.input} placeholder="Looking for" placeholderTextColor="#999" value={lookingfor} onChangeText={setLookingfor} />
            <TextInput style={styles.input} placeholder="Smoking" placeholderTextColor="#999" value={smoking} onChangeText={setSmoking} />
            <TextInput style={styles.input} placeholder="Drinking" placeholderTextColor="#999" value={drinking} onChangeText={setDrinking} />

            <View style={styles.buttonContainer}>
              <Button title="Save Profile" onPress={handleSubmit} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '90%',
  },
  iconClose: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    marginTop: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    marginTop: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sliderContainer: {
    marginVertical: 20
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rangeInput: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
});

export default PersonalDetails;
