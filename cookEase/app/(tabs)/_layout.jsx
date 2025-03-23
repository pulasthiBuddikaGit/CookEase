// app/(tabs)/_layout.jsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (

    <Tabs screenOptions={({
      tabBarStyle: { backgroundColor: '#d4edda', height: 60 },
      tabBarLabelStyle: { fontSize: 14 },
      tabBarActiveTintColor: '#00796b',
      tabBarInactiveTintColor: '#494949',
      headerStyle: { backgroundColor: '#00796b' },
      headerTintColor: '#fffbf1',
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center',
    })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'CookEase',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="meal"
        options={{
          title: 'My Meals',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="ramen-dining" size={28} color={color} />
          ),
          tabBarLabel: 'Meal',
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: 'My Diet Plans',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-apple" size={28} color={color} />,
          tabBarLabel: 'Diet',
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: 'My profile',
          tabBarIcon: ({ color }) => (<MaterialCommunityIcons size={30} name="account" color={color} />),
          tabBarLabel: 'Profile',
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin Portal',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="dashboard" color={color} />,
          tabBarLabel: 'Admin',
        }}
      />
    </Tabs>
  );
}
