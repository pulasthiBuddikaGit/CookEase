import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import RecipeInput from "./screens/RecipeInput";
import RecipeDetails from "./screens/RecipeDetails";

// This is the root layout of the app. It is the first component that is rendered when the app starts.
// It is responsible for setting up the Redux store and the navigation stack.
// The navigation stack is used to navigate between different screens in the app.
// The navigation stack is defined using the Stack component from the expo-router package.
// The Stack component takes a list of screens as its children.
// The Screen component takes a name prop which is used to identify the screen.
// The options prop is used to configure the screen.

export default function RootLayout() {
  return(
    <Provider store={store}>
      <Stack screenOptions={{
        headerStyle: { backgroundColor: '#00796b' },
        headerTintColor: '#fff', 
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
        headerTitleAlign: 'center',
      }}>
    
      <Stack.Screen name="auth/index" options={{ headerShown: true , title:"Login page"}} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="screens/n-screens/CreateDiet" options={{ title: "Diet Plan Creation" }} />
      <Stack.Screen name="screens/n-screens/GeneratedDiet" options={{ title: "Your Personalized Diet Plan" }} />
      <Stack.Screen name="screens/n-screens/CurrentDiet" options={{ title: "Your Current Diet Plan" }} />
      <Stack.Screen name="screens/n-screens/DietHistory" options={{ title: "My History" }} />
      <Stack.Screen name="screens/n-screens/PreviousDiet" options={{ title: "Previous Diet Plan" }} />
      <Stack.Screen name="account/edit" options={{ headerShown: true }} />
      <Stack.Screen name="RecipeInput" options={{RecipeInput}} />
      <Stack.Screen name="RecipeDetails" options={{ RecipeDetails}} />
    </Stack> 
    </Provider>
  );
}


// App starts, layout.jsx loads
// Since app/index.js exists, it's rendered as the first screen
// It renders FirebaseAuthTest component
