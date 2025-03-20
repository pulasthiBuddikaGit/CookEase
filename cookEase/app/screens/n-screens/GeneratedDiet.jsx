import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const DietResults = () => {
  const router = useRouter();
  const { dietPlan } = useLocalSearchParams();
  const parsedDietPlan = dietPlan ? JSON.parse(dietPlan) : "No diet plan generated";

  // Function to format the diet plan text with proper styling
  const formatDietPlan = (text) => {
    if (!text) return [];
    
    return text.split('\n').map((line, index) => {
      // Check if line is a header (day, meal type)
      if (line.match(/^(Day \d|Breakfast|Lunch|Dinner|Snacks):/i) || 
          line.match(/^(Day \d|BREAKFAST|LUNCH|DINNER|SNACKS)$/i)) {
        return <Text key={index} style={styles.headerText}>{line}</Text>;
      } 
      // Check if line is a subheader
      else if (line.match(/^(Note|Tips|Important|Advice|Recommendations):/i)) {
        return <Text key={index} style={styles.subheaderText}>{line}</Text>;
      }
      // Regular text
      else if (line.trim()) {
        return <Text key={index} style={styles.contentText}>{line}</Text>;
      }
      // Empty line for spacing
      else {
        return <View key={index} style={styles.spacer} />;
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Personalized Diet Plan</Text>
      </View>
      
      <View style={styles.planContainer}>
        {formatDietPlan(parsedDietPlan)}
      </View>
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.push("/screens/n-screens/CreateDiet")}>
        <Text style={styles.backButtonText}>Back to Form</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  planContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#4CAF50',
  },
  subheaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 5,
    color: '#333',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 5,
    color: '#444',
  },
  spacer: {
    height: 10,
  },
  backButton: {
    backgroundColor: '#333',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DietResults;