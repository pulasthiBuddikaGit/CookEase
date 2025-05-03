import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function UserTabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarStyle: { backgroundColor: '#d4edda', height: 60 },
      tabBarLabelStyle: { fontSize: 14 },
      tabBarActiveTintColor: '#00796b',
      tabBarInactiveTintColor: '#494949',
      headerStyle: { backgroundColor: '#00796b' },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'CookEase',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="meal"
        options={{
          title: 'My Meals',
          tabBarIcon: ({ color }) => <MaterialIcons name="ramen-dining" size={24} color={color} />,
          tabBarLabel: 'Meal',
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: 'My Diet Plans',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-apple" size={24} color={color} />,
          tabBarLabel: 'Diet',
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'My Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" size={24} color={color} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
