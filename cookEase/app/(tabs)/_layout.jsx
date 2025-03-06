import FontAwesome from '@expo/vector-icons/FontAwesome';
import {MaterialIcons} from '@expo/vector-icons';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="meal"
        options={{
          title: 'Meal',
          tabBarIcon: ({ color }) =>( 
            <MaterialIcons name="ramen-dining" size={28} color={color} /> //when you use material icons you have replace all the capital letters by simple and replace spaces with dash
          )  
        }}
      />
        <Tabs.Screen
        name="diet"
        options={{
          title: 'Diet',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="food" size={28} color={color} />
          )        
        }}
      />
        <Tabs.Screen
        name="user"
        options={{
          title: 'User',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user-o" color={color} />,
        }}
      />
    </Tabs>
  );
}
