// components/s-components/ProtectedScreen.jsx
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
import { View, ActivityIndicator } from 'react-native';

export default function ProtectedScreen({ allow = [], redirectTo = '/auth', children }) {
  const { role, loading } = useUser();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!loading && role && !allow.includes(role) && !hasRedirected.current) {
      hasRedirected.current = true; 
      router.replace(redirectTo);
    }
  }, [loading, role, allow, redirectTo]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00796b" />
      </View>
    );
  }

  if (!role || !allow.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
