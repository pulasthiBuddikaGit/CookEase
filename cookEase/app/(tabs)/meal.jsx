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
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import ProtectedScreen from "../../components/s-components/ProtectedScreen";

export default function RecipeList() {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [renameId, setRenameId] = useState(null);
  const [renameText, setRenameText] = useState("");
  const [searchText, setSearchText] = useState("");
  
  const fetchRecipes = async () => {
    try {
      if (!refreshing) setLoading(true);

      const recipesCollection = collection(db, "recipes");
      const q = query(recipesCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const recipeList = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((recipe) => recipe.user_id === auth.currentUser?.uid);

      setRecipes(recipeList);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  

  const onRefresh = () => {
    setRefreshing(true);
    fetchRecipes();
  };

  const handleRename = (id, title) => {
    setRenameId(id);
    setRenameText(title);
  };

  const handleSaveRename = async (id) => {
    try {
      const recipeDoc = doc(db, "recipes", id);
      await updateDoc(recipeDoc, { recipe_title: renameText });
      const updated = recipes.map((r) =>
        r.id === id ? { ...r, recipe_title: renameText } : r
      );
      setRecipes(updated);
      setRenameId(null);
    } catch (err) {
      console.error("Rename failed:", err);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Recipe", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "recipes", id));
            setRecipes((prev) => prev.filter((r) => r.id !== id));
          } catch (err) {
            Alert.alert("Error", "Failed to delete recipe.");
          }
        },
      },
    ]);
  };

  const filteredRecipes = recipes.filter((r) =>
    r.recipe_title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ProtectedScreen allow={["user"]} redirectTo="/admin">
    <View style={styles.container}>
      

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

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by recipe name..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
        <MaterialIcons name="search" size={24} color="#666" style={styles.searchIcon} />
      </View>

      {filteredRecipes.length === 0 && !loading ? (
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <Text style={{ fontSize: 21, color: "#555" }}>No Recipes</Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <View style={styles.recipeCard}>
              {renameId === item.id ? (
                <>
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
                </>
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
                  <Text style={styles.recipeDetails}>- {item.ingredients}</Text>
                  <Text style={styles.recipeDetails}>- {item.cookingTime}</Text>
                  <Text style={styles.recipeDetails}>- {item.complexity}</Text>
                  <Text style={styles.recipeDateTime}>
                    {item.createdAt?.toDate().toLocaleDateString()} |{" "}
                    {item.createdAt?.toDate().toLocaleTimeString()}
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
    overflow: "hidden",
  },
  topImage: {
    width: "100%",
    height: 250,
    borderRadius: 20,
  },
  buttonAndHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 7,
  },
  headerContainer: { alignItems: "center" },
  title: { fontSize: 25, fontWeight: "bold" },
  generateButton: {
    backgroundColor: "#00796B",
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    height: 50,
    justifyContent: "center",
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 45,
    width: "99%",
    marginTop: 17,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    height: "100%",
    borderRadius: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  recipeCard: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 3,
  },
  recipeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  recipeTitle: { fontSize: 15, fontWeight: "bold" },
  recipeDetails: { fontSize: 14, color: "#333", marginBottom: 5 },
  recipeDateTime: {
    fontSize: 12,
    color: "#777",
    fontStyle: "italic",
    marginLeft: 200,
    marginTop: -30,
  },
  renameIcon: { padding: 5 },
  deleteIcon: { padding: 5 },
  iconContainer: { flexDirection: "row", alignItems: "center" },
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

