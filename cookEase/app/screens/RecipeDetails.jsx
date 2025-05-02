import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ImageBackground } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { db, auth } from "../../firebaseConfig";  // Import Firebase and auth
import { doc, getDoc } from "firebase/firestore";  // Import Firestore functions to get data

export default function RecipeDetails() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const {
    id,
    ingredients,
    recipe,
    cookingTime,
    complexity,
    imageUrl,
  } = params;

  // State to hold recipe data for the authenticated user
  const [userRecipe, setUserRecipe] = useState(null);

  useEffect(() => {
    // Get the current user's recipe if the user is authenticated
    const fetchRecipe = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Assuming each recipe is saved under the user's ID in Firestore
        const recipeRef = doc(db, "recipes", id);  // Access the recipe using its ID
        const docSnap = await getDoc(recipeRef);
        
        if (docSnap.exists()) {
          setUserRecipe(docSnap.data());  // Set the recipe data for the authenticated user
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

  const backgroundImage = require("../../assets/images/imagesB/imageB13.jpg");

  if (!userRecipe) {
    return <Text>Loading...</Text>; // Display loading while fetching user recipe
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
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
        {/*
        <View style={styles.card2}>
          <Text style={styles.heading}>Ingredients:</Text>
          <Text style={styles.text}>{userRecipe.ingredients}</Text>
        </View>
        */}
        
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.description}>{userRecipe.recipe}</Text>
          <Text style={styles.heading1}>Enjoy your meal!</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: 780,
    width: "100%",
    resizeMode: 'cover',
  },
  container: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  content: { alignItems: "center", padding: 0 },
  image: { width: "100%", height: 300, borderRadius: 1, marginBottom: 0.9 },
  card: {
    backgroundColor: "#FEF9F3",
    borderRadius: 50,
    padding: 16,
    marginTop: 0,
    marginBottom: 10,
    width: "100%",
    height: 1150,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    //backdropFilter: 'blur(30px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  card1: {
    backgroundColor: "rgba(230, 221, 165, 0.31)",
    borderRadius: 20,
    padding: 6,
    marginTop: 20,
    marginBottom: 10,
    width: "94%",
    height: 300,
    marginLeft: "3%",
    marginRight:"3%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(230, 221, 165, 0.31)',
  },
  card2: {
    backgroundColor: "rgba(173, 223, 21, 0.98)",
    borderRadius: 20,
    padding: 16,
    marginTop: 0,
    marginBottom: 0,
    width: "45%",
    height: 100,
    marginLeft: 0,
   // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    //backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(230, 221, 165, 0.31)',
  },
  card3: {
    backgroundColor: "#87a397",
    borderRadius: 20,
    padding: 16,
    marginTop: 0,
    marginBottom: 0,
    width: "45%",
    height: 100,
    marginLeft: 0,
   // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    //backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(230, 221, 165, 0.31)',
  },
  
  card5: {
    backgroundColor: "#ebe6d8",
    borderRadius: 20,
    padding: 16,
    marginTop: 0,
    marginBottom: 0,
    width: "45%",
    height: 100,
    marginLeft: 0,
   // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    //backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(230, 221, 165, 0.31)',
  },
  card6: {
    backgroundColor: "#f9f5ea",
    borderRadius: 20,
    padding: 16,
    marginTop: 0,
    marginBottom: 0,
    width: "45%",
    height: 100,
    marginLeft: 0,
   // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    //backdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(230, 221, 165, 0.31)',
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 30, textAlign: "center", color: "#000" },
  description: { fontSize: 16, color: "#000", marginBottom: 50, textAlign: "center", marginTop: 20 },
  heading: { fontSize: 18, fontWeight: "bold", marginTop: 10, textAlign: "center", color: "#000" },
  text: { fontSize: 16, marginBottom: 5, textAlign: "center", color: "#000" },
  buttonContainer: { flexDirection: "row", marginTop: 20, gap: 10 },
  heading1: { fontSize: 28, fontWeight: "bold", marginTop: 10, textAlign: "center", color: "#000" },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
  },
  detailItem: {},
});
