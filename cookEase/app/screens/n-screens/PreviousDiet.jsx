import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getDietPlanById } from "../../../services/nisalka/dietService";  // Assuming you have a function to fetch by id

export default function PreviousDiet() {
  const router = useRouter();
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Destructure safely to avoid issues if `router.query` is undefined
  const { id } = useLocalSearchParams(); // Ensure router.query is defined before accessing 'id'

  // Log the router query to check if 'id' is being passed properly
  useEffect(() => {
    console.log("Router Query:", router.query); // Check if 'id' is present here
  }, [router.query]);

  useEffect(() => {
    // Only proceed if `id` is available in router.query
    if (id) {
      const fetchDietPlan = async () => {
        try {
          setLoading(true); // Set loading state to true before fetch
          const data = await getDietPlanById(id);
          console.log("Fetched Diet Plan:", data);
          setDietPlan(data);
        } catch (error) {
          console.error("Error fetching diet plan:", error);
        } finally {
          setLoading(false); // Stop loading once data is fetched or error
        }
      };

      fetchDietPlan();
    } else {
      console.log("No diet ID available in query");
      setLoading(false); // Stop loading if no ID is found
    }
  }, [id]); // Run the effect when `id` changes or updates

  // If loading, show a loading message
  if (loading) {
    return <Text>Loading...</Text>;
  }

  // If diet plan is not found, display a message
  if (!dietPlan) {
    return <Text>No diet plan found.</Text>;
  }

  // Render the fetched diet plan
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{dietPlan.diet_plan_name}</Text>
      <Text style={styles.text}>Date Created: {dietPlan.date_created ? dietPlan.date_created.toDate().toLocaleString() : "N/A"}</Text>
      <Text style={styles.text}>Total Calories: {dietPlan.total_calories} kcal</Text>
      <Text style={styles.text}>Weight: {dietPlan.weight} kg</Text>
      <Text style={styles.text}>Height: {dietPlan.height} cm</Text>
      <Text style={styles.text}>BMI: {dietPlan.bmi}</Text>
      <Text style={styles.text}>Diet Plan Details:</Text>
      <Text style={styles.text}>{dietPlan.diet_plan}</Text>

      <TouchableOpacity style={styles.deleteButton} onPress={() => router.push('/diet')}>
        <Text style={styles.deleteButtonText}>Delete Diet Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f9fffb' },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  text: { fontSize: 16, color: "black", marginBottom: 10 },
  deleteButton: {backgroundColor: "#ffcfcf",paddingVertical: 12,paddingHorizontal: 25,borderRadius: 8,marginTop: 10,width: "95%",},
  deleteButtonText: {color: "#ee0808",fontSize: 18,fontWeight: "bold",textAlign: "center",},
});
