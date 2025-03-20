import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { generateDietPlan } from "../../../utils/openaiServiceN"; // Import the OpenAI service

const DietForm = () => {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState("");
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
  const [bmi, setBmi] = useState("");
  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);

  // Toggle selection of medical conditions
  const handleMedicalConditionChange = (condition) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((item) => item !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  const toggleModal = () => setIsModalVisible(!isModalVisible);
  const toggleGenderModal = () => setIsGenderModalVisible(!isGenderModalVisible);

  // Function to calculate BMI
  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const parsedHeight = parseFloat(height);
      const parsedWeight = parseFloat(weight);
      if (!isNaN(parsedHeight) && !isNaN(parsedWeight) && parsedHeight > 0 && parsedWeight > 0) {
        const heightInMeters = parsedHeight / 100;
        const bmiCalculated = parsedWeight / (heightInMeters * heightInMeters);
        setBmi(bmiCalculated.toFixed(2));
      } else {
        setBmi('Invalid input');
      }
    } else {
      setBmi('Enter valid height and weight');
    }
  };

  // Handle height and weight change
  const handleHeightChange = (value) => {
    setHeight(value);
    calculateBMI(value, weight);
  };
  
  const handleWeightChange = (value) => {
    setWeight(value);
    calculateBMI(height, value);
  };

  // Generate diet plan function
  const handleGenerateDietPlan = async () => {
    // Validate inputs
    if (!age || !gender || !height || !weight || !calories) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      
      // Call the OpenAI API service
      const dietPlanText = await generateDietPlan({
        age,
        gender,
        height,
        weight,
        bmi,
        calories,
        selectedConditions
      });

      // Set the diet plan text directly
      setDietPlan(dietPlanText);
      
      // Show alert that the plan is ready
      Alert.alert(
        "Diet Plan Generated", 
        "Your personalized diet plan is ready!",
        [
          { 
            text: "View Plan", 
            onPress: () => {
              // Navigate to results screen with the diet plan text
              router.push({
                pathname: '/screens/n-screens/GeneratedDiet',
                params: { dietPlan: dietPlanText }
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error generating diet plan:", error);
      Alert.alert("Error", "An error occurred while generating your diet plan. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Age:</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge} />

        <Text style={styles.label}>Gender:</Text>
        <TouchableOpacity onPress={toggleGenderModal} style={styles.medicalConditionB}>
          <View style={styles.medicalConditionsBox}>
            {gender ? (
              <Text style={styles.selectedConditionsText}>
                {gender}
              </Text>
            ) : (
              <Text style={styles.selectedConditionsText}>
                No gender selected
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Modal for Gender Selection */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isGenderModalVisible}
          onRequestClose={toggleGenderModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              <TouchableOpacity onPress={() => { setGender("Male"); toggleGenderModal(); }} style={styles.genderButton}>
                <Text style={styles.genderButtonText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setGender("Female"); toggleGenderModal(); }} style={styles.genderButton}>
                <Text style={styles.genderButtonText}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.label}>Height (cm):</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={height} onChangeText={handleHeightChange} />

        <Text style={styles.label}>Weight (kg):</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={handleWeightChange} />

        {/* BMI Calculation */}
        <Text style={styles.label}>BMI:</Text>
        <Text style={styles.input}>{bmi}</Text>

        <Text style={styles.label}>Expected Calorie Count (Kcal):</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={calories} onChangeText={setCalories} />

        {/* Show selected conditions after selecting */}
        <Text style={styles.label}>
            Select Medical Conditions:
        </Text>
        <TouchableOpacity onPress={toggleModal} style={styles.medicalConditionB}>
        <View style={styles.medicalConditionsBox}>
        {selectedConditions.length > 0 ? (
            <Text style={styles.selectedConditionsText}>
            {selectedConditions.join("  |  ")}
            </Text>
        ) : (
            <Text style={styles.selectedConditionsText}>
            No conditions selected
            </Text>
        )}
        </View>
        </TouchableOpacity>
        
        {/* Modal to show the medical conditions */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Medical Conditions</Text>
              {[
                { label: "Diabetes", value: "diabetes" },
                { label: "High Blood Pressure", value: "high_pressure" },
                { label: "Nut Allergies", value: "nut_allergies" },
                { label: "Lactose Intolerance", value: "lactose_intolerance" },
                { label: "Celiac Disease (Gluten Allergy)", value: "celiac_disease" },
                { label: "Shellfish Allergy", value: "shellfish_allergy" },
                { label: "Soy Allergy", value: "soy_allergy" },
                { label: "Peanut Allergy", value: "peanut_allergy" },
                { label: "Egg Allergy", value: "egg_allergy" },
                { label: "Fish Allergy", value: "fish_allergy" },
                { label: "Chronic Kidney Disease", value: "chronic_kidney_disease" },
              ].map((condition) => (
                <TouchableOpacity
                  key={condition.value}
                  style={styles.checkboxContainer}
                  onPress={() => handleMedicalConditionChange(condition.value)}
                >
                  <Text style={styles.checkboxText}>
                    {selectedConditions.includes(condition.value) ? "✓ " : "  "} 
                    {condition.label}
                  </Text>
                </TouchableOpacity>
              ))}
                <TouchableOpacity onPress={toggleModal} style={styles.genderButton}>
                    <Text style={styles.genderButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity 
          style={styles.generateButton} 
          onPress={handleGenerateDietPlan}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.generateButtonText}>Generate Diet Plan</Text>
          )}
        </TouchableOpacity>

        {/* Show results directly if available and not navigating away */}
        {dietPlan && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Your Diet Plan:</Text>
            <Text style={styles.resultText}>{dietPlan}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },
  inputPicker: {
    borderWidth: 1,
    borderColor: "black",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },

  //gender modal styles
  genderButton: {
    padding: 10,
    backgroundColor: "#4CAF50",
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  genderButtonText: {
    fontSize: 18,
    color: "#fff",
  },

  //checkbox styles
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingLeft: 10,
  },
  checkboxText: {
    fontSize: 16,
    color: "#333",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000000",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  
  //medical conditions styles
  medicalConditionB: {
    marginBottom: 20,
    paddingVertical: -18,
    marginTop: -20,
  },
  medicalConditionsBox: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  selectedConditionsText: {
    fontSize: 16,
    color: "black",
    marginBottom: 15,
    flexWrap: "wrap",
  },

  //generate button styles
  generateButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  generateButtonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  //result styles
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
  },
});
  
export default DietForm;