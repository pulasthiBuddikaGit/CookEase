import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput, Alert,RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { getLatestDietPlan, updateDietPlan } from '../../../services/nisalka/dietService'; // Import your diet fetching function

export default function CurrentDiet() {
  const router = useRouter();
  
  const [dietPlan, setDietPlan] = useState(null); // State for diet plan
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode
  const [refreshing, setRefreshing] = useState(false);

  // Editable fields state
  const [dietPlanName, setDietPlanName] = useState('');
  const [diet, setDiet] = useState('');
  const [totalCalories, setTotalCalories] = useState('');

  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const fetchedDietPlan = await getLatestDietPlan();
        if (fetchedDietPlan) {
          setDietPlan(fetchedDietPlan);
          setDietPlanName(fetchedDietPlan.diet_plan_name || "");
          setDiet(fetchedDietPlan.diet_plan || "");
          setTotalCalories(fetchedDietPlan.total_calories || "");
        } else {
          setError("No diet plan available");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDietPlan();
  }, []);

  // Function to handle updating the diet plan
  const handleUpdateDietPlan = async () => {
    if (dietPlan) {
      // Call the updateDietPlan function from dietService
      console.log('Diet ID:', dietPlan.diet_id);
      try {
        await updateDietPlan(
          dietPlan.diet_id,  // Use the existing diet plan's ID
          dietPlanName,  
          dietPlan.weight,  
          dietPlan.height,  
          dietPlan.bmi,  
          diet,  
          totalCalories
        );
        
        // Show alert after successful update
        Alert.alert("Success", "Your diet plan has been updated successfully.", [
          { text: "OK", onPress: () => setIsEditing(false) } // Close editing mode on OK
        ]);
      } catch (error) {
        Alert.alert("Error", "There was an error updating your diet plan.");
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setLoading(true);
      setError(null);
  
      const fetchedDietPlan = await getLatestDietPlan(dietPlan.diet_id);
      if (fetchedDietPlan) {
        setDietPlan(fetchedDietPlan);
      } else {
        setError("No diet plan available");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop the refresh indicator
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <View style={styles.container}>
        <View style={styles.dietBox}>
          <Text style={styles.title}>Your Diet Plan</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#00796b" />
          ) : error ? (
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : dietPlan ? (
            <>
              <Text style={styles.mealTitle}>Plan Name:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={dietPlanName}
                  onChangeText={(text) => setDietPlanName(text)}
                />
              ) : (
                <Text style={styles.meal}>{dietPlan.diet_plan_name || "N/A"}</Text>
              )}

              <Text style={styles.mealTitle}>Weight:</Text>
              <Text style={styles.meal}>{dietPlan.weight ? `${dietPlan.weight} kg` : "N/A"}</Text>

              <Text style={styles.mealTitle}>Height:</Text>
              <Text style={styles.meal}>{dietPlan.height ? `${dietPlan.height} cm` : "N/A"}</Text>

              <Text style={styles.mealTitle}>BMI:</Text>
              <Text style={styles.meal}>{dietPlan.bmi || "N/A"}</Text>

              <Text style={styles.mealTitle}>Total Calories:</Text>
              <Text style={styles.caloriesText}>{dietPlan.total_calories ? `${dietPlan.total_calories} kcal` : "N/A"}</Text>

              <Text style={styles.mealTitle}>Meal Plan:</Text>
              {isEditing ? (
                <TextInput
                style={[styles.input, styles.multiLineInput]} // Add custom styling if needed
                value={diet}
                onChangeText={(text) => setDiet(text)}
                multiline // Enable multi-line input
                numberOfLines={80} // Optional: Set the number of lines displayed
              />
              ) : (
                <Text style={styles.meal}>{dietPlan.diet_plan || "No diet plan available"}</Text>
              )}
            </>
          ) : (
            <Text style={styles.meal}>No diet plan available.</Text>
          )}
        </View>

        {isEditing ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateDietPlan}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>Edit Diet Plan</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.deleteButton} onPress={() => router.push('/diet')}>
          <Text style={styles.deleteButtonText}>Delete Diet Plan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#f9fffb' },
  container: { flex: 1, alignItems: 'center', padding: 16 },
  dietBox: { backgroundColor: '#fff', padding: 20, borderRadius: 10, borderColor: '#ddd', borderWidth: 1, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3, marginTop: 10, marginBottom: 10, width: '95%', },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#000' },
  mealContainer: { backgroundColor: '#fff', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  mealTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  meal: { fontSize: 16, color: '#555', paddingLeft: 10 },
  caloriesText: { fontSize: 16, fontWeight: 'bold', color: '#00796b', marginTop: 5 },
  editButton: { backgroundColor: '#d4edda', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, marginTop: 10, width: '95%', },
  editButtonText: { color: "#000000", fontSize: 18, fontWeight: "bold", textAlign: "center", },
  saveButton: { backgroundColor: '#00796b', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, marginTop: 10, width: '95%', },
  saveButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold", textAlign: "center", },
  deleteButton: { backgroundColor: "#ffcfcf", paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, marginTop: 10, width: "95%", },
  deleteButtonText: { color: "#ee0808", fontSize: 18, fontWeight: "bold", textAlign: "center", },
  input: { padding: 10, fontSize: 16, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 , width: '100%'},
  multiLineInput: {
    minHeight: 80,  // Adjust the height for multi-line input
    textAlignVertical: 'top',  // Ensure text starts from the top
  },
});
