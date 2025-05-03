import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function AdminTabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin Portal',
          tabBarLabel: 'Admin',
          tabBarIcon: ({ color }) => <FontAwesome name="dashboard" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
