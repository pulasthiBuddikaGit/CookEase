import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { deleteRecipeAsync, renameRecipeAsync } from '../redux/b-slices/recipeSlice';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { saveRecipeImage } from '../firebaseConfig';

const RecipeCard = ({ recipe }) => {
  const dispatch = useDispatch();
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(recipe.title);
  const cardRef = React.useRef();

  const handleDelete = () => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => dispatch(deleteRecipeAsync(recipe.id)) }
      ]
    );
  };

  const handleRename = () => {
    if (isRenaming) {
      dispatch(renameRecipeAsync({ recipeId: recipe.id, newName }));
      setIsRenaming(false);
    } else {
      setIsRenaming(true);
    }
  };

  const saveImage = async () => {
    try {
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 0.8,
      });
      
      // Save to Firebase Storage
      await saveRecipeImage(recipe.id, uri);
      
      // Share the image
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Sharing not available");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Could not save or share the image");
    }
  };

  return (
    <View ref={cardRef} style={styles.card}>
      {isRenaming ? (
        <TextInput
          style={styles.input}
          value={newName}
          onChangeText={setNewName}
          autoFocus
          onBlur={handleRename}
          onSubmitEditing={handleRename}
        />
      ) : (
        <Text style={styles.title}>{recipe.title}</Text>
      )}
      
      <Text style={styles.subtitle}>Ingredients:</Text>
      <Text style={styles.text}>{recipe.ingredients}</Text>
      
      <Text style={styles.subtitle}>Instructions:</Text>
      <Text style={styles.text}>{recipe.fullRecipe}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={handleRename}>
          <Text style={styles.buttonText}>{isRenaming ? "Save" : "Rename"}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={saveImage}>
          <Text style={styles.buttonText}>Save Image</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    marginBottom: 10,
  },
});

export default RecipeCard;