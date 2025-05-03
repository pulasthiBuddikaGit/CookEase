// app/account/edit.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateProfile, updatePassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { updateUserDocument, getUserDocument } from '../../services/senudi/userService';

export default function EditAccount() {
  const router = useRouter();
  const currentUser = auth.currentUser;
  const defaultPhotoURL = 'https://www.pngitem.com/pimgs/m/146-1468479_default-profile-picture-png-transparent-png.png';

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [displayPhotoURL, setDisplayPhotoURL] = useState(defaultPhotoURL);
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({ displayName: '', photoURL: '', password: '', newPassword: '', age: '', gender: '', country: '' });
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    const loadUserData = async () => {
      const doc = await getUserDocument(currentUser.uid);
      const name = doc?.displayName || currentUser.displayName || '';
      const photo = doc?.photoURL || currentUser.photoURL || '';
      const userAge = doc?.age?.toString() || '';
      const userGender = doc?.gender || '';
      const userCountry = doc?.country || '';

      setDisplayName(name);
      setPhotoURL(photo);
      setDisplayPhotoURL(photo || defaultPhotoURL);
      setAge(userAge);
      setGender(userGender);
      setCountry(userCountry);
    };
    loadUserData();
  }, [currentUser]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { displayName: '', photoURL: '', password: '', newPassword: '', age: '', gender: '', country: '' };

    if (!displayName || displayName.length < 3 || !/^[a-zA-Z0-9_]+$/.test(displayName)) {
      newErrors.displayName = 'Enter a valid username (3+ chars, letters/numbers/underscores only)';
      isValid = false;
    }

    if (photoURL && !/^(https?:\/\/)/i.test(photoURL)) {
      newErrors.photoURL = 'Invalid image URL';
      isValid = false;
    }

    if (newPassword && (newPassword.length < 6 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword))) {
      newErrors.newPassword = 'Password must be 6+ chars with upper, lower and number';
      isValid = false;
    }

    if (newPassword && !password) {
      newErrors.password = 'Enter current password to update new password';
      isValid = false;
    }

    if (!age || isNaN(age) || age < 1 || age > 120) {
      newErrors.age = 'Age must be 1-120';
      isValid = false;
    }

    if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
      newErrors.gender = 'Select Male, Female or Other';
      isValid = false;
    }

    if (!country) {
      newErrors.country = 'Country is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setStatus('Please fix the errors');
      return;
    }

    try {
      setStatus('Saving...');
      const finalPhotoURL = photoURL.trim() === '' ? null : photoURL;

      if (newPassword) {
        await updatePassword(currentUser, newPassword);
      }

      await updateProfile(currentUser, { displayName, photoURL: finalPhotoURL });
      await updateUserDocument(currentUser.uid, { displayName, photoURL: finalPhotoURL, age: parseInt(age), gender, country });

      setStatus('Saved successfully');
      Alert.alert('Success', 'Profile updated!', [{ text: 'OK', onPress: () => router.navigate('/(tabs)/user') }]);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  const handleCancel = () => router.navigate('/(tabs)/user');
  const handleBack = () => router.navigate('/(tabs)/user');

  const handleImageError = () => {
    setIsImageLoading(false);
    setErrors({ ...errors, photoURL: 'Image failed to load' });
    setDisplayPhotoURL(defaultPhotoURL);
  };

  const handlePhotoURLChange = (text) => {
    setPhotoURL(text);
    setDisplayPhotoURL(text.trim() === '' ? defaultPhotoURL : text);
    setErrors({ ...errors, photoURL: '' });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="arrow-back" size={24} color="#00796b" />
      </TouchableOpacity>
      <View style={styles.content}>
        <View style={styles.profileImageContainer}>
          {isImageLoading && <ActivityIndicator size="small" color="#00796b" style={styles.loader} />}
          <Image source={{ uri: displayPhotoURL }} style={styles.profileImage} onLoadStart={() => setIsImageLoading(true)} onLoad={() => setIsImageLoading(false)} onError={handleImageError} />
        </View>
        <Text style={styles.title}>{displayName}</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Profile Picture URL:</Text>
            <TextInput style={styles.input} value={photoURL} onChangeText={handlePhotoURLChange} placeholder="http://example.com/image.jpg" />
            {errors.photoURL ? <Text style={styles.errorText}>{errors.photoURL}</Text> : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>User Name:</Text>
            <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} placeholder="Enter your name" />
            {errors.displayName ? <Text style={styles.errorText}>{errors.displayName}</Text> : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password:</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter current password"
                secureTextEntry={!currentPasswordVisible}
              />
              <TouchableOpacity onPress={() => setCurrentPasswordVisible(!currentPasswordVisible)}>
                <MaterialCommunityIcons name={currentPasswordVisible ? 'eye-off' : 'eye'} size={22} color="#333" />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password:</Text>
            <View style={styles.passwordWrapper}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry={!newPasswordVisible}
              />
              <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
                <MaterialCommunityIcons name={newPasswordVisible ? 'eye-off' : 'eye'} size={22} color="#333" />
              </TouchableOpacity>
            </View>
            {errors.newPassword ? <Text style={styles.errorText}>{errors.newPassword}</Text> : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age:</Text>
            <TextInput style={styles.input} value={age} onChangeText={setAge} placeholder="Enter your age" keyboardType="numeric" />
            {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender (Male/Female/Other):</Text>
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)} style={styles.picker}>
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country:</Text>
            <TextInput style={styles.input} value={country} onChangeText={setCountry} placeholder="Enter your country" />
            {errors.country ? <Text style={styles.errorText}>{errors.country}</Text> : null}
          </View>
        </View>

        {status ? <Text style={styles.status}>{status}</Text> : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}><Text style={styles.buttonText}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  content: {
    backgroundColor: '#E6F5F3',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#00796b',
    marginBottom: 30,
    letterSpacing: 1,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#b0bec5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  inputIcon: {
    marginLeft: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ef5350',
  },
  errorIcon: {
    marginRight: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  status: {
    fontSize: 14,
    color: '#00796b',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
  },
  cancelButton: {
    backgroundColor: '#A3D9C9',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButton: {
    backgroundColor: '#A3D9C9',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#3f86f7',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e9f3ff',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b0bec5',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 40,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b0bec5',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 40,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
