import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getLatestDietPlan } from '../../../services/nisalka/dietService'; // Import your diet fetching function

export default function CurrentDiet() {
  const router = useRouter();
  
  const [dietPlan, setDietPlan] = useState(null); // State for diet plan
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        setLoading(true); // Set loading state to true
        setError(null); // Reset error state
        
        const fetchedDietPlan = await getLatestDietPlan();
        if (fetchedDietPlan) {
          setDietPlan(fetchedDietPlan); // Set the fetched diet plan
        } else {
          setError("No diet plan available"); // Set error if no diet plan is found
        }
      } catch (error) {
        setError(error.message); // Set error message if something goes wrong
      } finally {
        setLoading(false); // Set loading state to false after fetching
      }
    };

    fetchDietPlan();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              <Text style={styles.meal}>{dietPlan.diet_plan_name || "N/A"}</Text>

              <Text style={styles.mealTitle}>Date Created:</Text>
              <Text style={styles.meal}>{dietPlan.date_created ? dietPlan.date_created.toDate().toLocaleString() : "N/A"}</Text>

              <Text style={styles.mealTitle}>Weight:</Text>
              <Text style={styles.meal}>{dietPlan.weight ? `${dietPlan.weight} kg` : "N/A"}</Text>

              <Text style={styles.mealTitle}>Height:</Text>
              <Text style={styles.meal}>{dietPlan.height ? `${dietPlan.height} cm` : "N/A"}</Text>

              <Text style={styles.mealTitle}>BMI:</Text>
              <Text style={styles.meal}>{dietPlan.bmi || "N/A"}</Text>

              <Text style={styles.mealTitle}>Total Calories:</Text>
              <Text style={styles.caloriesText}>{dietPlan.total_calories ? `${dietPlan.total_calories} kcal` : "N/A"}</Text>

              <Text style={styles.mealTitle}>Meal Plan:</Text>
              <Text style={styles.meal}>{dietPlan.diet_plan || "No diet plan available"}</Text>
            </>
          ) : (
            <Text style={styles.meal}>No diet plan available.</Text>
          )}
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/diet')}>
          <Text style={styles.editButtonText}>Edit Diet Plan</Text>
        </TouchableOpacity>
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
  dietBox: {backgroundColor: '#fff',padding: 20,borderRadius: 10,borderColor: '#ddd',borderWidth: 1,shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.3,shadowRadius: 4,elevation: 3,marginTop: 10,marginBottom: 10,width: '95%',},
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: '#000' },
  mealContainer: { backgroundColor: '#fff', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  mealTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  meal: { fontSize: 16, color: '#555', paddingLeft: 10 },
  caloriesText: { fontSize: 16, fontWeight: 'bold', color: '#00796b', marginTop: 5 },
  editButton: {backgroundColor: '#d4edda',paddingVertical: 12,paddingHorizontal: 25,borderRadius: 8,marginTop: 10,width: '95%',},
  editButtonText: {color: "#000000",fontSize: 18,fontWeight: "bold",textAlign: "center",},
  deleteButton: {backgroundColor: "#ffcfcf",paddingVertical: 12,paddingHorizontal: 25,borderRadius: 8,marginTop: 10,width: "95%",},
  deleteButtonText: {color: "#ee0808",fontSize: 18,fontWeight: "bold",textAlign: "center",},
});
