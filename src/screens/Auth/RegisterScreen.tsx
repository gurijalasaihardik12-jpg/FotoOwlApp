import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';

import { useAuthStore } from '../../store/useAuthStore';
import {
  validateEmail,
  validateMobile,
  validatePassword,
  passwordsMatch,
} from '../../utils/validation';

const cities = [
  'Hyderabad',
  'Bangalore',
  'Chennai',
  'Mumbai',
  'Delhi',
  'London',
];

export default function RegisterScreen() {
  const register = useAuthStore((state) => state.register);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !gender ||
      !mobile.trim() ||
      !address.trim() ||
      !city ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (!validateMobile(mobile)) {
      Alert.alert(
        'Validation Error',
        'Mobile number must contain exactly 10 digits.'
      );
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Validation Error',
        'Password must be at least 6 characters.'
      );
      return;
    }

    if (!passwordsMatch(password, confirmPassword)) {
      Alert.alert(
        'Validation Error',
        'Password and Confirm Password do not match.'
      );
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      gender,
      mobile,
      address: address.trim(),
      city,
      password,
    };

    try {
      setLoading(true);

      const success = await register(newUser);

      if (!success) {
        Alert.alert(
          'Registration Failed',
          'An account with this email already exists.'
        );
        return;
      }

      Alert.alert(
        'Success',
        'Your account has been created successfully.'
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Something went wrong while creating your account.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.logo}>FotoOwl</Text>

      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Register to explore beautiful images.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Gender</Text>

      <View style={styles.genderContainer}>
        {['Male', 'Female', 'Other'].map((item) => (
          <Pressable
            key={item}
            style={styles.genderOption}
            onPress={() => setGender(item)}
          >
            <View
              style={[
                styles.radioOuter,
                gender === item && styles.radioSelected,
              ]}
            >
              {gender === item && <View style={styles.radioInner} />}
            </View>

            <Text>{item}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={(text) =>
          setMobile(text.replace(/[^0-9]/g, '').slice(0, 10))
        }
        keyboardType="number-pad"
        maxLength={10}
      />

      <TextInput
        style={[styles.input, styles.addressInput]}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <Pressable
        style={styles.input}
        onPress={() => setCityModalVisible(true)}
      >
        <Text style={city ? styles.cityText : styles.placeholder}>
          {city || 'Select City'}
        </Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Pressable
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Register'}
        </Text>
      </Pressable>

      <Modal
        visible={cityModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select City</Text>

            {cities.map((item) => (
              <Pressable
                key={item}
                style={styles.cityOption}
                onPress={() => {
                  setCity(item);
                  setCityModalVisible(false);
                }}
              >
                <Text style={styles.cityOptionText}>{item}</Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.cancelButton}
              onPress={() => setCityModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#ffffff',
  },

  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 25,
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 5,
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },

  addressInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },

  genderContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 20,
  },

  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  radioSelected: {
    borderColor: '#000',
  },

  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },

  button: {
    backgroundColor: '#111111',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  placeholder: {
    color: '#999999',
    fontSize: 16,
  },

  cityText: {
    color: '#000000',
    fontSize: 16,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  cityOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  cityOptionText: {
    fontSize: 17,
  },

  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },

  cancelText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
});