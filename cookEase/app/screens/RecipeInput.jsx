import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import { useRouter } from "expo-router";
import { generateRecipe } from "../../utils/openaiServiceB"; // Import OpenAI function
import ImageProcessing from "../../utils/ImageProcessing ";
import { useSelector, useDispatch } from 'react-redux';
import { addIngredients, clearIngredients } from "../../redux/p-slices/imageProcessingSlice";

export default function RecipeInput() {
  const dispatch = useDispatch();
  const selectedIngredients = useSelector((state) => state.imageProcessing.selectedIngredients); // Get selected ingredients from Redux store

  const [ingredients, setIngredients] = useState('');

  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cookingTime, setCookingTime] = useState("30 minutes"); // Default time
  const [complexity, setComplexity] = useState("Easy"); // Default complexity

  const router = useRouter();

  //pulasthi

  // Update ingredients state when selectedIngredients in Redux changes
  useEffect(() => {
    if (selectedIngredients.length > 0) {
      setIngredients(selectedIngredients.join());
    }
  }, [selectedIngredients]);

  //pulasthi

  //old validateIngredients function
  // const validateIngredients = (text) => {
  //   const validPattern = /^[A-Za-z, ]*$/;
  //   if (validPattern.test(text)) {
  //     setIngredients(text);
  //     setError("");
  //   } else {
  //     setError("Only letters and commas are allowed.");
  //   }
  // };

  // Function to validate and update ingredients
  // const validateIngredients = (text) => {
  //   const validPattern = /^[A-Za-z ,]*$/;
  //   if (validPattern.test(text)) {
  //     setIngredients(text);
  //     // Update Redux store with the manually entered ingredients

  //     //Below code do like this: For example, if text is "Apple, Banana, Carrot", this creates ["Apple", "Banana", "Carrot"].
  //     //why this is needed? Thee text input is a comma-separated string, but Redux needs an array.
  //     const ingredientArray = text.split(",").map(item => item.trim()).filter(item => item !== "");
  //     //It prevents duplication: By clearing the ingredients first and then adding the new array
  //     dispatch(clearIngredients());
  //     // This is the critical line that ensures your manually entered ingredients are saved in Redux and will persist when navigating between screens.
  //     dispatch(addIngredients(ingredientArray)); // Add new ingredients to Redux
      
  //     setError("");
  //   } else {
  //     setError("Only letters and commas are allowed.");
  //   }
  // };

    // Separate validation and text change handlers
  const handleTextChange = (text) => {
      // Set the ingredients state directly without validation
      setIngredients(text);
      
    // Update Redux store with the manually entered ingredients
    // Only update Redux when we have valid text input
    if (validateInput(text)) { 
        //Below code do like this: For example, if text is "Apple, Banana, Carrot", this creates ["Apple", "Banana", "Carrot"].
        //why this is needed? Thee text input is a comma-separated string, but Redux needs an array.  
                                        //without here this space after comma inputing commas manually isn't possible
        const ingredientArray = text.split(", ").map(item => item.trim()).filter(item => item !== "");
        //It prevents duplication: By clearing the ingredients first and then adding the new array
        dispatch(clearIngredients());
        dispatch(addIngredients(ingredientArray));
        setError("");
      }
    };

      // Function to validate input text - only gives error, doesn't block input
  const validateInput = (text) => {
    const validPattern = /^[A-Za-z ,]*$/;
    if (!validPattern.test(text)) {
      setError("Only letters, commas, and spaces are allowed.");
      return false;
    }
    return true;
  };

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim() || ingredients.split(",").length < 2) {
      Alert.alert("Error", "Please enter at least two ingredients.");
      return;
    }

    if (error) {
      Alert.alert("Invalid Input", error);
      return;
    }

    setLoading(true);
    setRecipe("");

    try {
      let generatedRecipe = await generateRecipe(ingredients, cookingTime, complexity);
      generatedRecipe = generatedRecipe.replace(/#/g, "");
      setRecipe(generatedRecipe);
    } catch (error) {
      Alert.alert("Error", "Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Form Section */}
      <View style={styles.formContainer}>
        <Text style={styles.header}>Generate Recipe</Text>

        <Text style={styles.title}>Enter Ingredients</Text>
        {/* <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="Please enter at least two ingredients.                                    E.g. Chicken, Rice, Onion..."
          value={ingredients}
          onChangeText={validateIngredients}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <ImageProcessing/> */}

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="Please enter at least two ingredients. E.g. Chicken, Rice, Onion..."
            value={ingredients} //here
            onChangeText={handleTextChange}
            multiline={true}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/*Pulasthi */}
        <View style={{ marginLeft: 10 }}>
          <ImageProcessing />
        </View>
        {/*Pulasthi */}
        
      </View>


        <Text style={styles.title}>Select Cooking Time</Text>
        <Picker style={styles.picker} selectedValue={cookingTime} onValueChange={(itemValue) => setCookingTime(itemValue)}>
          <Picker.Item label="15 minutes" value="15 minutes" />
          <Picker.Item label="30 minutes" value="30 minutes" />
          <Picker.Item label="45 minutes" value="45 minutes" />
          <Picker.Item label="1 hour" value="1 hour" />
        </Picker>

        <Text style={styles.title}>Select Complexity</Text>
        <Picker style={styles.picker} selectedValue={complexity} onValueChange={(itemValue) => setComplexity(itemValue)}>
          <Picker.Item label="Easy" value="Easy" />
          <Picker.Item label="Medium" value="Medium" />
          <Picker.Item label="Hard" value="Hard" />
        </Picker>

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateRecipe}>
          <Text style={styles.buttonText}>Generate Recipe</Text>
        </TouchableOpacity>
      </View>

      {/* Divider Line */}
      <View style={styles.divider} />

      {/* Recipe Section */}
      {loading && <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />}
      {recipe ? (
        <View style={styles.recipeContainer}>
          <Text style={styles.recipeTitle}>Generated Recipe</Text>
          {recipe.split("\n").map((line, index) => (
            <Text key={index} style={styles.recipeText}>
              {line.trim()}
            </Text>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: "center", backgroundColor: "#D4EDDA" },

  // Glass Effect for Form Container
  

  formContainer: {
    backgroundColor: "white", // Transparent white
    borderRadius: 15, // Rounded corners
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    //elevation: 0, // For Android shadow effect
    borderWidth: 1,
    //borderColor: "rgba(255, 255, 255, 0.3)", // Subtle border
    //backdropFilter: "blur(10px)", // Blur effect
  },

  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15, marginTop: 20 },
  input: { borderWidth: 2, borderColor: "#ccc", borderRadius: 8, padding: 10, height:80 },
  inputError: { borderColor: "red", borderWidth: 2 },
  errorText: { color: "red", marginBottom: 10 },
  picker: { backgroundColor: "rgba(255, 255, 255, 0.5)", height: 55, borderRadius: 5 },
  generateButton: { backgroundColor: "green", paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, width: 300, marginTop: 30, alignItems: "center", alignSelf: "center" },
  buttonText: { color: "white", fontSize: 14, fontWeight: "bold", textAlign: "center" },
  divider: { height: 3, backgroundColor: "gray", marginVertical: 30, borderRadius: 5 },
  recipeContainer: { backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent white
    borderRadius: 15, // Rounded corners
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, // For Android shadow effect
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)", // Subtle border
    backdropFilter: "blur(10px)", // Blur effect 
    },
  recipeTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 30, textAlign: "center" },
  recipeText: { fontSize: 16, lineHeight: 22, marginBottom: 5,textAlign: "center" },
});
