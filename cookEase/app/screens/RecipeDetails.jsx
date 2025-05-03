import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db, auth } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function RecipeDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const { id } = params;

  const [userRecipe, setUserRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const recipeRef = doc(db, "recipes", id);
        const docSnap = await getDoc(recipeRef);

        if (docSnap.exists()) {
          setUserRecipe(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No authenticated user found.");
      }
    };

    fetchRecipe();
  }, [id]);

  const handleEdit = () => {
    router.push({ pathname: "/screens/EditRecipe", params });
  };

  if (!userRecipe) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <View style={styles.card1}>
        <Text style={styles.title}>{userRecipe.recipe_title}</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.card3}>
            <Text style={styles.heading}>Cooking Time:</Text>
            <Text style={styles.text}>{userRecipe.cookingTime}</Text>
          </View>

          <View style={styles.card6}>
            <Text style={styles.heading}>Complexity:</Text>
            <Text style={styles.text}>{userRecipe.complexity}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.card5}>
            <Text style={styles.heading}>Country:</Text>
            <Text style={styles.text}>{userRecipe.country}</Text>
          </View>
          <View style={styles.card3}>
            <Text style={styles.heading}>Servings:</Text>
            <Text style={styles.text}>{userRecipe.serve}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.description}>{userRecipe.recipe}</Text>
          <Text style={styles.heading1}>Enjoy your meal!</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: "center", padding: 0 },
  card: {
    backgroundColor: "#FEF9F3",
    borderRadius: 50,
    padding: 16,
    marginBottom: 10,
    width: "100%",
    height: 1150,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  card1: {
    //backgroundColor: "rgba(230, 221, 165, 0.31)",
    borderRadius: 20,
    padding: 6,
    marginTop: 20,
    marginBottom: 10,
    width: "94%",
    height: 300,
    marginLeft: "3%",
    marginRight: "3%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    //borderColor: 'rgba(230, 221, 165, 0.31)',
  },
  card3: {
    backgroundColor: "#87a397",
    borderRadius: 20,
    padding: 16,
    width: "45%",
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(230, 221, 165, 0.31)',
  },
  card5: {
    backgroundColor: "#ebe6d8",
    borderRadius: 20,
    padding: 16,
    width: "45%",
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(230, 221, 165, 0.31)',
  },
  card6: {
    backgroundColor: "#f9f5ea",
    borderRadius: 20,
    padding: 16,
    width: "45%",
    height: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(230, 221, 165, 0.31)',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#000"
  },
  description: {
    fontSize: 16,
    color: "#000",
    marginBottom: 50,
    textAlign: "center",
    marginTop: 20
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    color: "#000"
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
    color: "#000"
  },
  heading1: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    color: "#000"
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
});
