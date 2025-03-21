import React from 'react';
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter} from 'expo-router';

export default function PreviousDiet() {
    const router = useRouter();

  const dietPlan = {
    breakfast: { items: ['Oatmeal with Fruits', 'Green Smoothie'], calories: 400 },
    lunch: { items: ['Grilled Chicken Salad', 'Quinoa with Vegetables'], calories: 600 },
    dinner: { items: ['Baked Salmon', 'Brown Rice'], calories: 500 },
    totalCalories: 1500,
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.dietBox}>
          <Text style={styles.title}>Your Diet Plan</Text>

          {/* Breakfast */}
          <View style={styles.mealContainer}>
            <Text style={styles.mealTitle}>🍳 Breakfast</Text>
            {dietPlan.breakfast.items.map((item, index) => (
              <Text key={index} style={styles.meal}>{item}</Text>
            ))}
            <Text style={styles.caloriesText}> Calories: {dietPlan.breakfast.calories} kcal</Text>
          </View>

          {/* Lunch */}
          <View style={styles.mealContainer}>
            <Text style={styles.mealTitle}>🥗 Lunch</Text>
            {dietPlan.lunch.items.map((item, index) => (
              <Text key={index} style={styles.meal}>{item}</Text>
            ))}
            <Text style={styles.caloriesText}> Calories: {dietPlan.lunch.calories} kcal</Text>
          </View>

          {/* Dinner */}
          <View style={styles.mealContainer}>
            <Text style={styles.mealTitle}>🍽️ Dinner</Text>
            {dietPlan.dinner.items.map((item, index) => (
              <Text key={index} style={styles.meal}>{item}</Text>
            ))}
            <Text style={styles.caloriesText}> Calories: {dietPlan.dinner.calories} kcal</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => router.push('/diet')}>
            <Text style={styles.deleteButtonText}>Delete Diet Plan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1,backgroundColor: '#f9fffb', },
  container: { flex: 1, alignItems: 'center', padding: 16 },
  dietBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    width: '95%',
  },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: 'black' },
  mealContainer: { marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  mealTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  meal: { fontSize: 16, color: '#555', paddingLeft: 10 },
  caloriesText: { fontSize: 16, fontWeight: 'bold', color: '#00796b', marginTop: 5 },
  deleteButton: {
    backgroundColor: "#F55E5E",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    width: "95%",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
