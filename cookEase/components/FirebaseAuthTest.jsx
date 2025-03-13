// components/FirebaseAuthTest.js
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';

export default function FirebaseAuthTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('');

  const router = useRouter();

  // Check if user is already signed in
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setStatus('User is signed in');
      } else {
        setUser(null);
        setStatus('User is signed out');
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = async () => {
    try {
      setStatus('Creating account...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setStatus('Account created successfully');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleSignIn = async () => {
    try {
      setStatus('Signing in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setStatus('Signed in successfully');

      // Navigate to tabs after successful sign in
      router.replace('/(tabs)');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      setStatus('Signing out...');
      await signOut(auth);
      setUser(null);
      setStatus('Signed out successfully');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Firebase Auth Test</Text>
      
      <Text style={styles.status}>{status}</Text>
      
      {user ? (
        <View style={styles.userInfo}>
          <Text>User ID: {user.uid}</Text>
          <Text>Email: {user.email}</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </View>
      ) : (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.buttons}>
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Sign In" onPress={handleSignIn} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  form: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userInfo: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});