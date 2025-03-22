// app/(tabs)/user.jsx
import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';

const User = () => {
  const [status, setStatus] = useState('');
  const [photoURL, setPhotoURL] = useState(null); // Initialize as null
  const defaultPhotoURL = 'https://www.pngitem.com/pimgs/m/146-1468479_default-profile-picture-png-transparent-png.png'; // Default silhouette
  const router = useRouter();

  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      // Refresh the current user data
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
      if (updatedUser) {
        setPhotoURL(updatedUser.photoURL || defaultPhotoURL);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      setPhotoURL(defaultPhotoURL); // Fallback to default on error
    }
  };

  // Fetch user data when the page mounts
  useEffect(() => {
    if (auth.currentUser) {
      setPhotoURL(auth.currentUser.photoURL || defaultPhotoURL);
    }
  }, []);

  // Refresh user data when the page regains focus
  useFocusEffect(
    React.useCallback(() => {
      refreshUserData();
    }, [])
  );

  const handleSignOut = async () => {
    try {
      setStatus('Signing out...');
      await signOut(auth);
      setStatus('Signed out successfully');
      router.replace('/auth');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleEditAccount = () => {
    router.push('/account/edit');
  };

  const handleDeleteAccount = () => {
    // Show confirmation pop-up
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Delete canceled'), // Close the pop-up
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // For now, do nothing (as per request)
            console.log('Delete confirmed (no action taken)');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: photoURL }}
          style={styles.profileImage}
          onError={() => setPhotoURL(defaultPhotoURL)} // Fallback to default on error
        />
        <Text style={styles.userName}>Jane Doe</Text>
        <Text style={styles.userEmail}>janedoe@gmail.com</Text>
      </View>

      {/* Status Message */}
      <Text style={styles.status}>{status}</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleEditAccount}>
          <Icon name="edit" size={20} color="#000" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Edit Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
          <Icon name="delete" size={20} color="#ff0000" style={styles.buttonIcon} />
          <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#e0f7fa',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  deleteButtonText: {
    color: '#ff0000',
  },
});

export default User;
