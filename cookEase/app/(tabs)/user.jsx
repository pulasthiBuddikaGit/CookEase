import React, { useState } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const User = () => {
    const [status, setStatus] = useState('');
    const router = useRouter();

    const handleSignOut = async () => {
        try {
          setStatus('Signing out...');
          await signOut(auth);
        //   setUser(null);
          setStatus('Signed out successfully');
          router.replace('/auth');
        } catch (error) {
          setStatus(`Error: ${error.message}`);
        }
      };

    return (
        <View>
            <Text>User</Text>
            <Text style={styles.status}>{status}</Text>            
            <Button title="Sign Out" onPress={handleSignOut} />
        </View>
    );
};

const styles = StyleSheet.create({
    status: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      color: '#666',
    }
});

export default User;