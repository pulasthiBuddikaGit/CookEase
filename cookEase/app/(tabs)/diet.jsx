import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getLatestDietPlan } from "../../services/nisalka/dietService";
import ProtectedScreen from "../../components/s-components/ProtectedScreen";

export default function DietPlanScreen() {
  const router = useRouter();
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const userId = getAuth().currentUser?.uid;

  useEffect(() => {
    let isMounted = true; // Prevent state updates on unmounted components

    const fetchDietPlan = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedDietPlan = await getLatestDietPlan(userId);
        if (isMounted) {
          if (fetchedDietPlan) {
            setDietPlan(fetchedDietPlan);
          } else {
            setError("No diet plan available");
          }
        }
      } catch (error) {
        if (isMounted) setError(error.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (userId) {
      fetchDietPlan();
    }

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      setLoading(true);
      setError(null);

      const fetchedDietPlan = await getLatestDietPlan(userId);
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
    <ProtectedScreen allow={["user"]} redirectTo="/admin">
      <ScrollView
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <Text style={styles.title}>Your Health Overview</Text>

          {/* Health Info */}
          <View style={styles.infoContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#00796b" />
            ) : (
              <>
                <InfoBox
                  title="Height (cm)"
                  value={dietPlan?.height ?? "N/A"}
                />
                <InfoBox
                  title="Weight (kg)"
                  value={dietPlan?.weight ?? "N/A"}
                />
                <InfoBox title="BMI" value={dietPlan?.bmi ?? "N/A"} />
              </>
            )}
          </View>

          {/* Calorie Box */}
          <View style={styles.calorieBox}>
            <View style={styles.row}>
              <Text style={styles.infoTitle2}>Total Daily Calories</Text>
              <Text style={styles.infoText2}>
                {loading
                  ? "Loading..."
                  : dietPlan?.total_calories
                  ? `${dietPlan.total_calories} kcal`
                  : "N/A"}
              </Text>
            </View>
          </View>

          {/* Diet Plan */}
          <View style={styles.dietContainer}>
            <Text style={styles.title}>Your Current Diet Plan</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#00796b" />
            ) : error ? (
              <Text style={styles.errorText}>Error: {error}</Text>
            ) : dietPlan ? (
              <>
                <Text style={styles.mealTitle}>Plan Name:</Text>
                <Text style={styles.meal}>{dietPlan.diet_plan_name}</Text>

                <Text style={styles.mealTitle}>Meal Plan:</Text>
                <FlatList
                  data={dietPlan.diet_plan.split("\n")} // Assume meal plan is a string with new lines
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Text style={styles.meal}>• {item}</Text>
                  )}
                  scrollEnabled={false} // Prevents FlatList from interfering with ScrollView
                />
              </>
            ) : (
              <Text style={styles.meal}>No diet plan available.</Text>
            )}

            <View style={styles.btnBOX}>
              <TouchableOpacity
                style={styles.btnM}
                onPress={() => router.push("/screens/n-screens/CurrentDiet")}
              >
                <Text style={styles.btnTextM}>More Details</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.btnC}
            onPress={() => router.push("/screens/n-screens/CreateDiet")}
          >
            <Text style={styles.btnText}>Create New Diet Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn1}
            onPress={() => router.push("/screens/n-screens/DietHistory")}
          >
            <Text style={styles.btnText2}>View My Diet History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ProtectedScreen>
  );
}

// ✅ Reusable Info Box Component
const InfoBox = ({ title, value }) => (
  <View style={styles.infoBox}>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: "#f9fffb" },
  container: { flex: 1, alignItems: "center", padding: 16 },

  // Three Boxes in One Row
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "30%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 14.25,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  infoText: { fontSize: 16, color: "#444" },

  // Calorie Box
  calorieBox: {
    backgroundColor: "#d4edda",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "95%",
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 12,
  },
  infoTitle2: { fontSize: 18, fontWeight: "bold", color: "#000" },
  infoText2: { fontSize: 18, fontWeight: "bold", color: "#00796b" },

  // Diet Plan Box
  dietContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
    width: "95%",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
    marginTop: 10,
    color: "#000",
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00796b",
    marginBottom: 5,
  },
  meal: { fontSize: 16, color: "#000", paddingLeft: 10 },
  errorText: { color: "red", fontSize: 16, textAlign: "center", marginTop: 10 },

  // Custom button styles view more
  btnBOX: { alignItems: "center" },
  btnTextM: { color: "#000", fontSize: 14, fontWeight: "bold" },
  btnM: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    margin: 16,
    width: 120,
    alignItems: "center",
  },

  // Custom button styles
  btnC: {
    backgroundColor: "#d4edda",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    width: "95%",
    alignItems: "center",
  },
  btn1: {
    backgroundColor: "#00796b",
    padding: 15,
    borderRadius: 8,
    margin: 10,
    width: "95%",
    alignItems: "center",
  },
  btnText: { color: "black", fontSize: 16, fontWeight: "bold" },
  btnText2: { color: "white", fontSize: 16, fontWeight: "bold" },
});
