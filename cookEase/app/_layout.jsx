import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";

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
    <Stack>
      <Stack.Screen name="auth/index" options={{ headerShown: true }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      
      <Stack.Screen name="Nisalka/CreateDiet" options={{ title: "Create Diet Plan" }} />
      <Stack.Screen name="Nisalka/GeneratedDiet" options={{ title: "Generated Diet Plan" }} />
      <Stack.Screen name="Nisalka/CurrentDiet" options={{ title: "Current Diet Plan" }} />
      <Stack.Screen name="Nisalka/DietHistory" options={{ title: "Diet Plan History" }} />
      <Stack.Screen name="Nisalka/PreviousDiet" options={{ title: "Previous Diet Plan" }} />

    </Stack> 
    </Provider>
  );
}


// App starts, layout.jsx loads
// Since app/index.js exists, it's rendered as the first screen
// It renders FirebaseAuthTest component