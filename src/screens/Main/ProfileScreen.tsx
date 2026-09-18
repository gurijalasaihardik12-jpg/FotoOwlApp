import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuthStore } from '../../store/useAuthStore';
import {
  validateEmail,
  validateMobile,
} from '../../utils/validation';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);

  const updateProfile = useAuthStore(
    (state) => state.updateProfile
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const [editing, setEditing] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setMobile(user.mobile);
      setGender(user.gender);
      setAddress(user.address);
      setCity(user.city);
    }
  }, [user]);

  const handleSave = async () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !gender.trim() ||
      !address.trim() ||
      !city.trim()
    ) {
      Alert.alert(
        'Validation Error',
        'Please fill in all fields.'
      );
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid email.'
      );
      return;
    }

    if (!validateMobile(mobile)) {
      Alert.alert(
        'Validation Error',
        'Mobile number must be exactly 10 digits.'
      );
      return;
    }

    await updateProfile({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      mobile,
      gender,
      address: address.trim(),
      city: city.trim(),
    });

    setEditing(false);

    Alert.alert(
      'Success',
      'Profile updated successfully.'
    );
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        My Profile
      </Text>

      <Text style={styles.label}>
        Full Name
      </Text>

      <TextInput
        style={[
          styles.input,
          !editing && styles.disabledInput,
        ]}
        value={fullName}
        onChangeText={setFullName}
        editable={editing}
      />

      <Text style={styles.label}>
        Email Address
      </Text>

      <TextInput
        style={[
          styles.input,
          !editing && styles.disabledInput,
        ]}
        value={email}
        onChangeText={setEmail}
        editable={editing}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>
        Mobile Number
      </Text>

      <TextInput
        style={[
          styles.input,
          !editing && styles.disabledInput,
        ]}
        value={mobile}
        onChangeText={(text) =>
          setMobile(
            text.replace(/[^0-9]/g, '').slice(0, 10)
          )
        }
        editable={editing}
        keyboardType="number-pad"
        maxLength={10}
      />

      <Text style={styles.label}>
        Gender
      </Text>

      {editing ? (
        <View style={styles.genderRow}>
          {['Male', 'Female', 'Other'].map(
            (item) => (
              <Pressable
                key={item}
                style={[
                  styles.genderButton,
                  gender === item &&
                    styles.selectedGender,
                ]}
                onPress={() =>
                  setGender(item)
                }
              >
                <Text>{item}</Text>
              </Pressable>
            )
          )}
        </View>
      ) : (
        <TextInput
          style={[
            styles.input,
            styles.disabledInput,
          ]}
          value={gender}
          editable={false}
        />
      )}

      <Text style={styles.label}>
        Address
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.addressInput,
          !editing && styles.disabledInput,
        ]}
        value={address}
        onChangeText={setAddress}
        editable={editing}
        multiline
      />

      <Text style={styles.label}>
        City
      </Text>

      <TextInput
        style={[
          styles.input,
          !editing && styles.disabledInput,
        ]}
        value={city}
        onChangeText={setCity}
        editable={editing}
      />

      {!editing ? (
        <Pressable
          style={styles.editButton}
          onPress={() => setEditing(true)}
        >
          <Text style={styles.buttonText}>
            Edit Profile
          </Text>
        </Pressable>
      ) : (
        <>
          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>
              Save Changes
            </Text>
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={() => {
              setFullName(user.fullName);
              setEmail(user.email);
              setMobile(user.mobile);
              setGender(user.gender);
              setAddress(user.address);
              setCity(user.city);
              setEditing(false);
            }}
          >
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </Pressable>
        </>
      )}

      <Pressable
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.buttonText}>
          Logout
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 13,
    fontSize: 16,
    marginBottom: 18,
  },

  disabledInput: {
    backgroundColor: '#eeeeee',
  },

  addressInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },

  genderButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },

  selectedGender: {
    backgroundColor: '#dddddd',
    borderColor: '#111111',
  },

  editButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  saveButton: {
    backgroundColor: '#15803d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelButton: {
    padding: 15,
    alignItems: 'center',
  },

  cancelText: {
    color: '#555555',
    fontSize: 16,
    fontWeight: '600',
  },

  logoutButton: {
    backgroundColor: '#111111',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});