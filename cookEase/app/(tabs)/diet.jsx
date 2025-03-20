import React from 'react';
import { useRouter } from "expo-router";
import { Text, View,StyleSheet, ScrollView,TouchableOpacity } from 'react-native';

export default function DietPlanScreen() {

    const router = useRouter();

    // Example user data
    const userData = {
      height: "175",
      weight: "70",
      bmi: "22.9",
    };
    const dietPlan = {
        breakfast: {
          items: ['Oatmeal with Fruits', 'Green Smoothie'],
          calories: 400,
        },
        lunch: {
          items: ['Grilled Chicken Salad', 'Quinoa with Vegetables'],
          calories: 600,
        },
        dinner: {
          items: ['Baked Salmon', 'Brown Rice'],
          calories: 500,
        },
        totalCalories: 1500,
        infoText2: 1500,
      };
  
    return (
      <ScrollView decelerationRate={0.5} scrollEventThrottle={2} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Your Health Overview</Text>
  
          {/* Three Boxes in One Row */}
          <View style={styles.infoContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Height (cm)</Text>
              <Text style={styles.infoText}>{userData.height}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Weight (kg)</Text>
              <Text style={styles.infoText}>{userData.weight}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>BMI</Text>
              <Text style={styles.infoText}>{userData.bmi}</Text>
            </View>
          </View>


        <View style={styles.calorieBox}>
        <View style={styles.row}>
            <Text style={styles.infoTitle2}>Total Daily Calories</Text>
            <Text style={styles.infoText2}>{dietPlan.infoText2} kcal</Text>
        </View>
        </View>
       

        {/* View Box for Diet Plan */}
        <View style={styles.dietBox}>
        <Text style={styles.title}>Your Diet Plan</Text>

        {/* Breakfast Section */}
        <View style={styles.mealContainer}>
          <Text style={styles.mealTitle}>🍳 Breakfast</Text>
          {dietPlan.breakfast.items.map((item, index) => (
            <Text key={index} style={styles.meal}>{item}</Text>
          ))}
          <Text style={styles.caloriesText}>🔥 Calories: {dietPlan.breakfast.calories} kcal</Text>
        </View>

        {/* Lunch Section */}
        <View style={styles.mealContainer}>
          <Text style={styles.mealTitle}>🥗 Lunch</Text>
          {dietPlan.lunch.items.map((item, index) => (
            <Text key={index} style={styles.meal}>{item}</Text>
          ))}
          <Text style={styles.caloriesText}>🔥 Calories: {dietPlan.lunch.calories} kcal</Text>
        </View>

        {/* Dinner Section */}
        <View style={styles.mealContainer}>
          <Text style={styles.mealTitle}>🍽️ Dinner</Text>
          {dietPlan.dinner.items.map((item, index) => (
            <Text key={index} style={styles.meal}>{item}</Text>
          ))}
          <Text style={styles.caloriesText}>🔥 Calories: {dietPlan.dinner.calories} kcal</Text>
        </View>

        <View style={styles.btnBOX}>
        <TouchableOpacity style={styles.btnM} onPress={() => router.push("/screens/n-screens/CurrentDiet")}>
            <Text style={styles.btnTextM}>More Details</Text>
        </TouchableOpacity>
        </View>
        </View>


        {/* Custom button for "Create New Diet Plan" */}
        <TouchableOpacity style={styles.btnC} onPress={() => router.push("/screens/n-screens/CreateDiet")}>
            <Text style={styles.btnText}>Create New Diet Plan</Text>
        </TouchableOpacity>

        {/* Custom button for "Current Diet Plan" */}
        <TouchableOpacity style={styles.btn1} onPress={() => router.push("/screens/n-screens/DietHistory")}>
            <Text style={styles.btnText}>Diet History</Text>
        </TouchableOpacity>
    
         
        </View>
      </ScrollView>
    );
  }


  
  const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 60,
    },
    // Three Boxes in One Row
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    infoBox: {
      backgroundColor: '#e0f7fa',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      width: '30%', // Adjusted width to fit three in one row
      elevation: 3, // Android shadow
      shadowColor: '#000', // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    infoTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#00796b',
      marginBottom: 8,
    },
    infoText: {
      fontSize: 16,
      color: '#333',
    },
    
    calorieBox: {
        backgroundColor: '#f3e5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        width: '95%',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      row: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        margin: 12,
      },
      infoTitle2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    
      },
      infoText2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',

        },



    
    dietBox: {
        backgroundColor: 'white',
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
      title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
        marginTop: 10,
        color: '#00796b',
      },
      mealContainer: {
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        
      },
      mealTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
      },
      meal: {
        fontSize: 16,
        color: '#555',
        paddingLeft: 10,
      },
      caloriesText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
        marginTop: 5,
      },

      btnBOX:{
        alignItems:'center'
      },      
      btnTextM:{
        color: 'green', 
        fontSize: 11, 
      },
      btnM: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        width: 100,
        alignItems: 'center',
      },



    btnC: {
        backgroundColor: 'green',
        padding: 15,
        borderRadius: 8,
        margin: 10,
        width: "95%",
        alignItems: 'center',
      },
      btn1: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 8,
        margin: 10,
        width: "95%",
        alignItems: 'center',
      },
      btnText: {
        color: 'white', 
        fontSize: 16, 
        fontWeight: 'bold',
      },
      
  });