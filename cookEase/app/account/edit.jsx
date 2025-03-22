// app/account/edit.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function EditAccount() {
  const router = useRouter();
  const currentUser = auth.currentUser;

  const defaultPhotoURL = 'https://www.pngitem.com/pimgs/m/146-1468479_default-profile-picture-png-transparent-png.png'; // Default silhouette

  const [displayName, setDisplayName] = useState(currentUser?.displayName || 'Jane_Doe');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || ''); // Allow empty string
  const [displayPhotoURL, setDisplayPhotoURL] = useState(currentUser?.photoURL || defaultPhotoURL);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('27');
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({
    displayName: '',
    photoURL: '',
    password: '',
    age: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { displayName: '', photoURL: '', password: '', age: '' };

    // Validate User Name
    if (!displayName) {
      newErrors.displayName = 'User Name is required';
      isValid = false;
    } else if (displayName.length < 3) {
      newErrors.displayName = 'User Name must be at least 3 characters long';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(displayName)) {
      newErrors.displayName = 'User Name can only contain letters, numbers, and underscores';
      isValid = false;
    }

    // Validate Photo URL (optional, but if provided, must be valid)
    if (photoURL && !/^(https?:\/\/)/i.test(photoURL)) {
      newErrors.photoURL = 'URL must start with http:// or https:// (base64 URLs are not supported)';
      isValid = false;
    } else if (photoURL && photoURL.length > 2048) {
      newErrors.photoURL = 'URL is too long (max 2048 characters)';
      isValid = false;
    }

    // Validate Password
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      isValid = false;
    }

    // Validate Age
    if (!age) {
      newErrors.age = 'Age is required';
      isValid = false;
    } else if (isNaN(age) || age < 1 || age > 120) {
      newErrors.age = 'Age must be a number between 1 and 120';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setStatus('Please fix the errors in the form');
      return;
    }

    try {
      setStatus('Saving changes...');

      // If photoURL is empty, set it to null
      const finalPhotoURL = photoURL.trim() === '' ? null : photoURL;

      // Update display name and photo URL
      await updateProfile(currentUser, {
        displayName: displayName,
        photoURL: finalPhotoURL,
      });

      setStatus('Profile updated successfully');
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.navigate('/(tabs)/user') },
      ]);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  const handleCancel = () => {
    router.navigate('/(tabs)/user');
  };

  const handleBack = () => {
    router.navigate('/(tabs)/user');
  };

  // Handle image load error
  const handleImageError = () => {
    setIsImageLoading(false);
    setErrors({ ...errors, photoURL: 'Failed to load image. Please check the URL.' });
    setDisplayPhotoURL(defaultPhotoURL);
  };

  // Handle image load start
  const handleImageLoadStart = () => {
    setIsImageLoading(true);
    setErrors({ ...errors, photoURL: '' });
  };

  // Handle image load success
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Handle photo URL change
  const handlePhotoURLChange = (text) => {
    setPhotoURL(text);
    if (text.trim() === '') {
      // If the input is cleared, revert to the default image for display
      setDisplayPhotoURL(defaultPhotoURL);
      setErrors({ ...errors, photoURL: '' });
    } else {
      setDisplayPhotoURL(text);
      setErrors({ ...errors, photoURL: '' });
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="arrow-back" size={24} color="#00796b" />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Profile Image Preview */}
        <View style={styles.profileImageContainer}>
          {isImageLoading && (
            <ActivityIndicator size="small" color="#00796b" style={styles.loader} />
          )}
          <Image
            source={{ uri: displayPhotoURL }}
            style={styles.profileImage}
            onLoadStart={handleImageLoadStart}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>{displayName}</Text>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Profile Picture URL Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Profile Picture URL:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={photoURL}
                onChangeText={handlePhotoURLChange}
                placeholder="Enter image URL (e.g., http://example.com/image.jpg)"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
              <Icon name="image" size={20} color="#00796b" style={styles.inputIcon} />
            </View>
            {errors.photoURL ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={14} color="#d32f2f" style={styles.errorIcon} />
                <Text style={styles.errorText}>{errors.photoURL}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>User Name:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={(text) => {
                  setDisplayName(text);
                  setErrors({ ...errors, displayName: '' });
                }}
                placeholder="Enter your name"
                placeholderTextColor="#999"
              />
              <Icon name="edit" size={20} color="#00796b" style={styles.inputIcon} />
            </View>
            {errors.displayName ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={14} color="#d32f2f" style={styles.errorIcon} />
                <Text style={styles.errorText}>{errors.displayName}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors({ ...errors, password: '' });
                }}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry
              />
              <Icon name="lock" size={20} color="#00796b" style={styles.inputIcon} />
            </View>
            {errors.password ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={14} color="#d32f2f" style={styles.errorIcon} />
                <Text style={styles.errorText}>{errors.password}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age:</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={(text) => {
                  setAge(text);
                  setErrors({ ...errors, age: '' });
                }}
                placeholder="Enter your age"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <Icon name="person" size={20} color="#00796b" style={styles.inputIcon} />
            </View>
            {errors.age ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={14} color="#d32f2f" style={styles.errorIcon} />
                <Text style={styles.errorText}>{errors.age}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Status Message */}
        {status ? <Text style={styles.status}>{status}</Text> : null}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
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
});
