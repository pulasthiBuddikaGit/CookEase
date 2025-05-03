import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  Animated, // Import the Animated API
  Easing, // Import Easing for more animation options
} from "react-native";
import { useRouter } from "expo-router";
import { db, auth } from "../../firebaseConfig";
import { collection, getDocs, updateDoc, doc, deleteDoc, orderBy, query } from "firebase/firestore"; // Import orderBy and query
import { MaterialIcons } from "@expo/vector-icons";
import ProtectedScreen from "../../components/s-components/ProtectedScreen";

export default function RecipeList() {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renameId, setRenameId] = useState(null);
  const [renameText, setRenameText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    require('../../assets/images/imagesB/imageB7.jpg'),
    require('../../assets/images/imagesB/imageB8.jpg'),
    require('../../assets/images/imagesB/imageB9.jpg'),
    require('../../assets/images/imagesB/imageB12.jpg'),
    require('../../assets/images/imagesB/imageB11.jpg'),
    require('../../assets/images/imagesB/imageB10.jpg'),
  ];
  const imageChangeInterval = 8000;
  const slideAnim = useRef(new Animated.Value(0)).current; // Animated value for sliding

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const recipesCollection = collection(db, "recipes");
        const q = query(
          recipesCollection,
          orderBy("createdAt", "desc"), // Order by createdAt in descending order (newest first)
          // Additional filtering for the current user
        );

        const querySnapshot = await getDocs(q);
        const recipeList = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((recipe) => recipe.user_id === auth.currentUser.uid); // Still filter by user
        setRecipes(recipeList);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (currentImageIndex + 1) % images.length;
      Animated.timing(slideAnim, {
        toValue: -styles.topImage.width, // Slide to the left by the image width
        duration: 50, // Animation duration
        easing: Easing.ease,
        useNativeDriver: true, // Improve performance
      }).start(() => {
        setCurrentImageIndex(nextIndex);
        slideAnim.setValue(0); // Reset the slide animation
      });
    }, imageChangeInterval);

    return () => clearInterval(intervalId);
  }, [images.length, imageChangeInterval, styles.topImage.width]);

  const handleRename = async (id, currentIngredients) => {
    setRenameId(id);
    setRenameText(currentIngredients);
  };

  const handleSaveRename = async (id) => {
    try {
      const recipeDoc = doc(db, "recipes", id);
      await updateDoc(recipeDoc, {
        recipe_title: renameText,
      });
      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === id ? { ...recipe, recipe_title: renameText } : recipe
      );
      setRecipes(updatedRecipes);
      setRenameId(null);
    } catch (error) {
      console.error("Error renaming recipe:", error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "recipes", id));
              const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
              setRecipes(updatedRecipes);
            } catch (error) {
              console.error("Error deleting recipe:", error);
              Alert.alert("Error", "Failed to delete recipe.");
            }
          },
        },
      ]
    );
  };
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.recipe_title.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ProtectedScreen allow={["user"]} redirectTo="/admin">
    <View style={styles.container}>
      {/* Image Display */}
      <View style={styles.imageContainer}>
        <Animated.View style={{
          height: styles.topImage.height,
          overflow: 'hidden',
          transform: [{ translateX: slideAnim }]
        }}>
          <Image
            source={images[currentImageIndex]}
            style={[styles.topImage, { position: 'absolute', left: 0 }]}
            resizeMode="cover"
          />
          <Image
            source={images[(currentImageIndex + 1) % images.length]}
            style={[styles.topImage, { position: 'absolute', left: styles.topImage.width }]}
            resizeMode="cover"
          />
        </Animated.View>
      </View>

      <View style={styles.buttonAndHeaderContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Your Recipes</Text>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => router.push("/screens/RecipeInput")}
        >
          <Text style={styles.buttonText}>+ New Recipe</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
  <TextInput
    style={styles.searchInput}
    placeholder="Search by recipe name..."
    value={searchText}
    onChangeText={(text) => setSearchText(text)}
    placeholderTextColor="#999"
  />
  <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
</View>


      {filteredRecipes.length === 0 ? (
  <View style={{ alignItems: "center", marginTop: 100 ,height:1000}}>
    <Text style={{ fontSize: 21, color: "#555" }}>No Recipes</Text>
  </View>
) : (
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recipeCard}>
            {renameId === item.id ? (
              <View>
                <TextInput
                  style={styles.renameInput}
                  value={renameText}
                  onChangeText={setRenameText}
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSaveRename(item.id)}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/screens/RecipeDetails",
                    params: { ...item },
                  })
                }
              >
                <View style={styles.recipeHeader}>
                  <Text style={styles.recipeTitle}>{item.recipe_title}</Text>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity
                      style={styles.renameIcon}
                      onPress={() => handleRename(item.id, item.recipe_title)}
                    >
                      <MaterialIcons name="edit" size={20} color="#00796B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteIcon}
                      onPress={() => handleDelete(item.id)}
                    >
                      <MaterialIcons name="delete" size={20} color="#D32F2F" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.recipeDetails}>
                  -{item.ingredients}
                </Text>
                <Text style={styles.recipeDetails}>
                  -{item.cookingTime}
                </Text>
                <Text style={styles.recipeDetails}>
                  -{item.complexity}
                </Text>
                <Text style={styles.recipeDateTime}>
                  {item.createdAt && item.createdAt.toDate().toLocaleDateString()} |{" "}
                  {item.createdAt && item.createdAt.toDate().toLocaleTimeString()}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
)}
    </View>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#FEF9F3" },
  imageContainer: {
    width: "100%",
    height: 250,
    marginBottom: 20,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row', // aligns input and icon horizontally
    alignItems: 'center', // centers vertically
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 0,
    height: 45,
    width:"99%",
    marginTop:17,
    marginBottom: 15,
    backgroundColor: 'transperant',
  },
  searchIcon: {
  marginLeft: 2,
},
  topImage: {
    width: "100%",
    height: 250,
    borderRadius: 20,
  },
  buttonAndHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 7,
  },
  generateButton: {
    backgroundColor: "#00796B",
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    height: 50,
    justifyContent: 'center',
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold", textAlign: "center" },
  headerContainer: {
    alignItems: "center",
  },
  title: { fontSize: 25, fontWeight: "bold" },
  recipeCard: {
    padding: 15,
    marginVertical: 5,
    marginTop: 2,
    backgroundColor: "white",
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    height: 140,
    width:"98%",
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    width:"95%",
    flex: 1,
    marginBottom: 0,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  
  recipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  recipeTitle: { fontSize: 15, fontWeight: "bold" },
  recipeDetails: { fontWeight: "semi bold",fontSize: 14, color: "#333", marginBottom: 5 },
  recipeDateTime: { fontSize: 12, color: "#777", fontStyle: "italic", marginLeft: 200, marginTop: -30 },
  renameIcon: { padding: 5 },
  deleteIcon: { padding: 5 },
  renameInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: "#00796B",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontWeight: "bold" },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

