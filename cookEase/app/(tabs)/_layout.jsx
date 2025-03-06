import FontAwesome from '@expo/vector-icons/FontAwesome';
import {MaterialIcons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={({
      tabBarStyle: { backgroundColor: '#f0f0f0', height: 60 },
      tabBarLabelStyle: { fontSize: 14 },
      tabBarActiveTintColor: '#00796b',
      tabBarInactiveTintColor: '#494949', 
      })}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'CookEase',
          tabBarIcon: ({ color }) => (<FontAwesome size={28} name="home" color={color} />)
          ,
          tabBarLabel: 'Home', 
        }}
      />
      <Tabs.Screen
        name="meal"
        options={{
          title: 'My Meals',
          tabBarIcon: ({ color }) =>( 
            <MaterialIcons name="ramen-dining" size={28} color={color} /> //when you use material icons you have replace all the capital letters by simple and replace spaces with dash
          ),
          tabBarLabel: 'Meal',  
        }}
      />
        <Tabs.Screen
        name="diet"
        options={{
          title: 'My Diet Plans',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="food-apple" size={28} color={color} />
          ),
          tabBarLabel: 'Diet',         
        }}
      />
        <Tabs.Screen
        name="user"
        options={{
          title: 'My profile',
          tabBarIcon: ({ color }) => (<FontAwesome size={28} name="user-o" color={color} />),
          tabBarLabel: 'Profile', 
          
        }}
      />
    </Tabs>
  );
}
