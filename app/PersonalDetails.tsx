import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, ScrollView, Picker, Platform } from 'react-native';
import Slider from '@react-native-community/slider';

export default function DatingProfileForm() {
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
  const [agepreference, setAgePreference] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [interests, setInterests] = useState('');
  const [languages, setLanguages] = useState('');
  const [religion, setReligion] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [lookingfor, setLookingfor] = useState('');
  const [smoking, setSmoking] = useState('');   
  const [drinking, setDrinking] = useState('');

    const handleSubmit = () => {
    console.log({ fullname, aboutme, gender, dob, occupation, education, institution, company, agepreference, hobbies, interests, languages, religion, ethnicity, height, smoking, drinking });
    // send data to backend
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Complete Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="fullname"
        value={fullname}
        onChangeText={setfullname}
      />

      <TextInput
        style={styles.input}
        placeholder="fullname"
        value={fullname}
        onChangeText={setaboutme}
      />

      
      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={gender}
        onValueChange={setGender}
        style={styles.picker}
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Prefer not to say" value="preferNot" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={dob}
        onChangeText={setDob}
      />

       <TextInput
        style={styles.input}
        placeholder="Height"
        value={height}
        onChangeText={setHeight}
      />

        <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

   
      <TextInput
        style={styles.input}
        placeholder="Occupation"
        value={occupation}
        onChangeText={setOccupation}
      />

      <TextInput
        style={styles.input}
        placeholder="company"
        value={company}
        onChangeText={setCompany}
      />

       <TextInput
        style={styles.input}
        placeholder="Education"
        value={education}
        onChangeText={setEducation}
      />
       <TextInput
        style={styles.input}
        placeholder="Institution"
        value={institution}
        onChangeText={setInstitution}
      />
       <TextInput
        style={styles.input}
        placeholder="agePreference"
        value={agepreference}
        onChangeText={setAgePreference}
      />

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Age Preference: {agepreference}</Text>
        
        <Slider
          style={styles.slider}
          minimumValue={18}
          maximumValue={100}
          value={parseInt(agepreference) || 25}
          onValueChange={(value) => setAgePreference(value.toString())}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#D3D3D3"
          thumbStyle={styles.sliderThumb}
        />

      </View>
      <TextInput
        style={styles.input}
        placeholder="Hobbies"
        value={hobbies}
        onChangeText={setHobbies}
      />
      <TextInput
        style={styles.input}
        placeholder="Interests"
        value={interests}
        onChangeText={setInterests}
      />
      
      <TextInput
        style={styles.input}
        placeholder="languages"
        value={languages}
        onChangeText={setLanguages}
      />
      
      <TextInput
        style={styles.input}
        placeholder="religion"
        value={religion}
        onChangeText={setReligion}
      />

      <TextInput
        style={styles.input}
        placeholder="Ethnicity"
        value={ethnicity}
        onChangeText={setEthnicity}
      />
      <TextInput
        style={styles.input}
        placeholder="Looking for"
        value={lookingfor}
        onChangeText={setLookingfor}
      />
      <TextInput
        style={styles.input}
        placeholder="Smoking"
        value={smoking}
        onChangeText={setSmoking}
      />
      <TextInput
        style={styles.input}
        placeholder="Drinking"
        value={drinking}
        onChangeText={setDrinking}
      />
      

      <Button title="Save Profile" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  picker: {
    ...Platform.select({
      ios: { height: 150 },
      android: { height: 50 },
    }),
  },
  sliderContainer: {
    marginVertical: 15,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  
});




