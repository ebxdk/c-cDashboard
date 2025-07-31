import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'South Korea',
  'India',
  'Brazil',
  'Mexico',
  'Spain',
  'Italy',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Finland',
  'Switzerland',
  'Austria',
  'Belgium',
  'Ireland',
  'New Zealand',
  'Singapore',
  'Hong Kong',
  'Taiwan',
  'Thailand',
  'Vietnam',
  'Philippines',
  'Malaysia',
  'Indonesia',
  'China',
  'Russia',
  'Ukraine',
  'Poland',
  'Czech Republic',
  'Hungary',
  'Romania',
  'Bulgaria',
  'Greece',
  'Portugal',
  'Turkey',
  'Israel',
  'United Arab Emirates',
  'Saudi Arabia',
  'Egypt',
  'South Africa',
  'Nigeria',
  'Kenya',
  'Ghana',
  'Morocco',
  'Tunisia',
  'Algeria',
  'Libya',
  'Sudan',
  'Ethiopia',
  'Uganda',
  'Tanzania',
  'Zimbabwe',
  'Zambia',
  'Botswana',
  'Namibia',
  'Mozambique',
  'Angola',
  'Congo',
  'Cameroon',
  'Chad',
  'Niger',
  'Mali',
  'Burkina Faso',
  'Senegal',
  'Guinea',
  'Sierra Leone',
  'Liberia',
  'Ivory Coast',
  'Togo',
  'Benin',
  'Central African Republic',
  'Gabon',
  'Equatorial Guinea',
  'São Tomé and Príncipe',
  'Cape Verde',
  'Mauritania',
  'Western Sahara',
  'Eritrea',
  'Djibouti',
  'Somalia',
  'Comoros',
  'Madagascar',
  'Mauritius',
  'Seychelles',
  'Malawi',
  'Lesotho',
  'Eswatini',
  'Burundi',
  'Rwanda',
  'Democratic Republic of the Congo',
  'Republic of the Congo',
];

export default function ProfileLocationScreen() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleCountrySelect = (country: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCountry(country);
  };

  const handleContinue = async () => {
    if (!selectedCountry) {
      Alert.alert('Required Field', 'Please select your location.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Navigate to the next page (persona selection)
    router.push('/persona-selection');
  };

  // Filter and group countries by first letter
  const groupedCountries = useMemo(() => {
    const filtered = countries.filter(country =>
      country.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const grouped = filtered.reduce((acc, country) => {
      const firstLetter = country.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(country);
      return acc;
    }, {} as Record<string, string[]>);
    
    return Object.keys(grouped)
      .sort()
      .reduce((acc, key) => {
        acc[key] = grouped[key].sort();
        return acc;
      }, {} as Record<string, string[]>);
  }, [searchQuery]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" translucent={false} />
      
      {/* iOS-style Navigation Header */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Select Country</Text>
        <View style={styles.rightSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Country List */}
      <ScrollView 
        style={styles.countryList}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(groupedCountries).map(([letter, countryList]) => (
          <View key={letter}>
            <Text style={styles.sectionHeader}>{letter}</Text>
            {countryList.map((country) => (
              <TouchableOpacity
                key={country}
                style={styles.countryItem}
                onPress={() => handleCountrySelect(country)}
              >
                <Text style={styles.countryText}>{country}</Text>
                {selectedCountry === country && (
                  <Ionicons name="checkmark" size={20} color="#2C3E50" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.continueButton, selectedCountry && styles.continueButtonActive]} 
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8D4F0',
  },
  navigationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#B8D4F0',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  rightSpacer: {
    width: 44,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#B8D4F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(44, 62, 80, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#2C3E50',
    paddingVertical: 4,
  },
  countryList: {
    flex: 1,
    backgroundColor: '#B8D4F0',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2C3E50',
    backgroundColor: '#B8D4F0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    paddingTop: 8,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#B8D4F0',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(44, 62, 80, 0.1)',
  },
  countryText: {
    fontSize: 17,
    color: '#2C3E50',
    fontWeight: '400',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#B8D4F0',
  },
  continueButton: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 14,
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
  },
}); 