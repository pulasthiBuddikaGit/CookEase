import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ImageProcessing from "../../utils/ImageProcessing ";
import { useRouter } from "expo-router";
import ProtectedScreen from "../../components/s-components/ProtectedScreen";

const sampleRecipes = [
  {
    id: "1",
    title: "🍗 Chicken Curry",
    description: "Cook chicken with spices and serve hot!",
    ingredients: ["Chicken", "Spices", "Oil"],
    date: "March 21, 2025",
    time: "12:30 PM",
  },
  {
    id: "2",
    title: "🥗 Salad Bowl",
    description: "Mix lettuce, tomatoes, and dressing.",
    ingredients: ["Lettuce", "Tomato", "Dressing"],
    date: "March 20, 2025",
    time: "7:00 PM",
  },
  {
    id: "3",
    title: "🍝 Pasta",
    description: "Boil pasta, add sauce, and enjoy!",
    ingredients: ["Pasta", "Tomato Sauce", "Cheese"],
    date: "March 19, 2025",
    time: "8:45 PM",
  },
  {
    id: "4",
    title: "🍳 Omelette",
    description: "Beat eggs, add veggies, and cook!",
    ingredients: ["Eggs", "Onions", "Peppers"],
    date: "March 18, 2025",
    time: "9:00 AM",
  },
  {
    id: "5",
    title: "🍕 Margherita Pizza",
    description: "Bake dough with cheese and tomato.",
    ingredients: ["Dough", "Cheese", "Tomato"],
    date: "March 17, 2025",
    time: "6:30 PM",
  },
  {
    id: "6",
    title: "🥪 Sandwich",
    description: "Layer bread with cheese and veggies.",
    ingredients: ["Bread", "Cheese", "Lettuce"],
    date: "March 16, 2025",
    time: "12:00 PM",
  },
  {
    id: "7",
    title: "🍛 Fried Rice",
    description: "Stir-fry rice with vegetables.",
    ingredients: ["Rice", "Carrots", "Soy Sauce"],
    date: "March 15, 2025",
    time: "8:00 PM",
  },
  {
    id: "8",
    title: "🥣 Porridge",
    description: "Boil oats in milk for a healthy meal.",
    ingredients: ["Oats", "Milk", "Honey"],
    date: "March 14, 2025",
    time: "7:00 AM",
  },
  {
    id: "9",
    title: "🍜 Ramen",
    description: "Cook noodles with broth and toppings.",
    ingredients: ["Noodles", "Broth", "Egg"],
    date: "March 13, 2025",
    time: "9:15 PM",
  },
  {
    id: "10",
    title: "🧁 Cupcakes",
    description: "Bake small cakes with icing.",
    ingredients: ["Flour", "Sugar", "Butter"],
    date: "March 12, 2025",
    time: "3:45 PM",
  },
];

export default function RecipeList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecipes = sampleRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedScreen allow={["user"]} redirectTo="/admin">
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => router.push("/screens/RecipeInput")}
        >
          <Text style={styles.buttonText}>Recipe</Text>
        </TouchableOpacity>

        {/* Title and Search Bar */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>History</Text>
        </View>

        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeCard}
              onPress={() =>
                router.push({
                  pathname: "/screens/RecipeDetails",
                  params: { ...item },
                })
              }
            >
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <Text style={styles.recipeDescription}>{item.description}</Text>
              <Text style={styles.recipeDetails}>
                Ingredients: {item.ingredients.join(", ")}
              </Text>
              <Text style={styles.recipeDateTime}>
                {item.date} | {item.time}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#D4EDDA" },

  // Centered Green Button
  generateButton: {
    backgroundColor: "green",
    paddingVertical: 19,
    paddingHorizontal: 0,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
    width: "80%",
    height: 70,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Header (Title + Search Bar)
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: { fontSize: 22, fontWeight: "bold" },
  searchBar: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    flex: 0,
    marginLeft: 0,
  },

  // Recipe List Styling
  recipeCard: {
    padding: 15,
    marginVertical: 8,
    marginTop: 1,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5, // Shadow effect for Android
    shadowColor: "#000", // Shadow effect for iOS
    //shadowOffset: { width: 0, height: 2 },
    height: 150,
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  recipeTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  recipeDescription: { fontSize: 14, color: "#555", marginBottom: 5 },
  recipeDetails: { fontSize: 14, color: "#333", marginBottom: 5 },
  recipeDateTime: {
    fontSize: 12,
    color: "#777",
    fontStyle: "italic",
    marginLeft: 180,
    marginTop: 30,
  },
});
