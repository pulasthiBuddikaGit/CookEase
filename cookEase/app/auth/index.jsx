import React from 'react';
import { SafeAreaView } from 'react-native';
import FirebaseAuthTest from '../../components/FirebaseAuthTest';

export default function AuthScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FirebaseAuthTest />
    </SafeAreaView>
  );
}