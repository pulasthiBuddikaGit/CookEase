import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { saveDietPlan } from "../../../services/nisalka/dietService";

const DietResults = () => {
  const router = useRouter();
  const { dietPlan } = useLocalSearchParams();
  const parsedDietPlan = dietPlan ? (typeof dietPlan === 'string' ? JSON.parse(dietPlan) : dietPlan) : "No diet plan generated";
  
  const [dietPlanName, setDietPlanName] = useState('');  // State to store user input for diet plan name
  const [isModalVisible, setIsModalVisible] = useState(false); // To control modal visibility

  // Function to format the diet plan text with proper styling
  const formatDietPlan = (text) => {
    if (!text) return [];
    
    return text.split('\n').map((line, index) => {
      // Check if line is a header (day, meal type)
      if (line.match(/^(Weight|Height|BMI|Breakfast|Lunch|Dinner):/i)) {
        return <Text key={index} style={styles.headerText}>{line}</Text>;
      } 
      // Check if line is a subheader
      else if (line.match(/^(Food Item|Portion|Ingredients|Instructions|Approximate Calories|Total Calorie Count for the Day):/i)) {
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

  const handleSaveDietPlan = async () => {
    try {
      if (!parsedDietPlan || typeof parsedDietPlan !== 'string') {
        console.error("Invalid diet plan data");
        return;
      }
      // Prompt user to enter a diet plan name if it's empty
      if (!dietPlanName) {
        setIsModalVisible(true); // Show the modal for name input
        return;
      }
      
      // Extract weight, height, and BMI from the generated diet plan
      const weightMatch = parsedDietPlan.match(/Weight:\s*(\d+)/i);
      const heightMatch = parsedDietPlan.match(/Height:\s*(\d+)/i);
      const bmiMatch = parsedDietPlan.match(/BMI:\s*([\d.]+)/i);
      const totalCaloriesMatch = parsedDietPlan.match(/Total Calorie Count for the Day:\s*(\d+)/i);
  
      const weight = weightMatch ? parseInt(weightMatch[1], 10) : null;
      const height = heightMatch ? parseInt(heightMatch[1], 10) : null;
      const bmi = bmiMatch ? parseFloat(bmiMatch[1]) : null;
      const totalCalories = totalCaloriesMatch ? parseInt(totalCaloriesMatch[1], 10) : null;
  
      // Save diet plan to Firebase
      await saveDietPlan(
        dietPlanName, 
        weight, 
        height, 
        bmi, 
        parsedDietPlan,  // Save full text diet plan
        totalCalories
      );
  
      Alert.alert(
        "Success", 
        "Diet Plan Saved Successfully!", 
        [{ text: "OK", onPress: () => router.push("/diet") }]
      );
    } catch (error) {
      console.error("Error saving diet plan:", error);
    }
  };

  // Function to handle save with the user-provided name
  const handleSaveWithName = (name) => {
    if (name.trim() === "") {
      Alert.alert("Error", "Please provide a valid name for the diet plan.");
      return;
    }
    setDietPlanName(name);
    setIsModalVisible(false);  // Close the modal
    handleSaveDietPlan();  // Call the save diet plan function after setting the name
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.planContainer}>
        {formatDietPlan(parsedDietPlan)}
        <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveDietPlan()}>
          <Text style={styles.saveButtonText}>Save Diet Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.genButton} onPress={() => router.push("/screens/n-screens/CreateDiet")}>
          <Text style={styles.genButtonText}>Generate Another Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/diet")}>
          <Text style={styles.backButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for diet plan name input */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Diet Plan Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter diet plan name"
              value={dietPlanName}
              onChangeText={setDietPlanName}
            />
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => handleSaveWithName(dietPlanName)}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1,backgroundColor: '#f9fffb',},
  planContainer: {padding: 20,backgroundColor: 'white',borderRadius: 10,margin: 10,
    shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 5,elevation: 3,},
  headerText: {fontSize: 18,fontWeight: 'bold',marginTop: 10,marginBottom: 5,color: '#00796b',},
  subheaderText: {fontSize: 16,fontWeight: 'bold',marginTop: 8,marginBottom: 5,color: '#000',},
  contentText: {fontSize: 16,lineHeight: 22,marginBottom: 5,color: '#555',},
  spacer: {height: 10,},
  saveButton: {backgroundColor: '#00796b',padding: 15,marginTop: 25,marginBottom: 10,borderRadius: 8,alignItems: 'center',
    elevation: 3,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.2,shadowRadius: 4,},
  saveButtonText: {color: '#fff',fontSize: 16,fontWeight: 'bold',},
  genButton: {backgroundColor: '#d4edda',padding: 15,marginBottom: 10,borderRadius: 8,alignItems: 'center',
    elevation: 3,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.2,shadowRadius: 4,},
  genButtonText: {color: '#000',fontSize: 16,fontWeight: 'bold',},
  backButton: {backgroundColor: '#333',padding: 15,borderRadius: 8,alignItems: 'center',elevation: 3,
    shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.2,shadowRadius: 4,},
  backButtonText: {color: '#fff',fontSize: 16,fontWeight: 'bold',},
  modalOverlay: {flex: 1,justifyContent: 'center',alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)',},
  modalContainer: {width: 300,padding: 20,backgroundColor: 'white',borderRadius: 10,elevation: 5,},
  modalTitle: {fontSize: 18,fontWeight: 'bold',marginBottom: 15,},
  modalInput: {height: 40,borderColor: '#ccc',borderWidth: 1,borderRadius: 8,paddingHorizontal: 10,marginBottom: 15,},
  modalButton: {backgroundColor: '#00796b',padding: 10,borderRadius: 8,marginTop: 10,alignItems: 'center',},
  modalButtonText: {color: '#fff',fontSize: 16,fontWeight: 'bold',},
});

export default DietResults;
