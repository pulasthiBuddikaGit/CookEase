import React from "react";
import { View, Text, ScrollView, StyleSheet, Button, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function RecipeDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const title = params.title || "Unknown Recipe";
  const description = params.description || "No description available.";
  const ingredients = Array.isArray(params.ingredients) ? params.ingredients : [];
  const instructions = params.instructions || "No instructions available.";

  const handleEdit = () => {
    // Navigate to an edit screen (if implemented)
    router.push({ pathname: "/editRecipe", params });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => console.log("Recipe deleted") }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <Text style={styles.heading}>Ingredients:</Text>
      {ingredients.length > 0 ? (
        ingredients.map((item, index) => (
          <Text key={index} style={styles.text}>• {item}</Text>
        ))
      ) : (
        <Text style={styles.text}>No ingredients provided.</Text>
      )}

      <Text style={styles.heading}>Instructions:</Text>
      <Text style={styles.text}>{instructions}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Edit"  color="#4CAF50" /> 
        <Button title="Delete"  color="#D32F2F" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#D4EDDA" },
  content: { alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  description: { fontSize: 16, color: "#666", marginBottom: 10, textAlign: "center" },
  heading: { fontSize: 18, fontWeight: "bold", marginTop: 10, textAlign: "center" },
  text: { fontSize: 16, marginBottom: 5, textAlign: "center" },
  buttonContainer: { flexDirection: "row", marginTop: 20, gap: 10 },
});
