import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated, RefreshControl } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient"; // Using expo-linear-gradient for gradient background
import CalorieReport from "../../components/n-components/CalorieReport"; // Import the CalorieReport component
import WeightReport from "../../components/n-components/WeightReport"; // Import the WeightReport component
import PieChartScreen from '../../components/PieChart';

export default function Index() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  // 🔄 Refresh logic
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Add data reload logic here if needed
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Motivational Tips
  const tips = [
    "💧 Stay hydrated! Drinking more water boosts metabolism by 30%.",
    "🥦 Eat more greens! Leafy veggies improve digestion & energy levels.",
    "🔥 Spicy foods can boost metabolism and help burn calories faster.",
    "🍊 Vitamin C strengthens your immune system try some oranges today!",
    "🏃‍♂️ A short walk after meals helps digestion & lowers blood sugar levels.",
    "🍽️ Mindful eating leads to better digestion and prevents overeating.",
    "💤 Quality sleep helps regulate hunger and improves weight control.",
    "🍏 An apple a day keeps the doctor away! Apples are rich in fiber.",
    "🥑 Healthy fats are your friend! Avocados, nuts, and olive oil boost brain function.",
    "🚶‍♀️ Take the stairs! Small habits like using stairs improve cardiovascular health.",
    "💪 Strength training not only builds muscles but also boosts metabolism.",
    "🍵 Green tea is packed with antioxidants and may help burn fat naturally.",
    "🐟 Eat more omega-3s! Salmon, walnuts, and flaxseeds support brain health.",
    "🥗 Add more colors to your plate. A variety of fruits & veggies = more nutrients!",
    "🏋️‍♂️ Exercise boosts mood! Just 30 minutes of activity reduces stress.",
    "🌿 Herbs and spices like turmeric & ginger have anti-inflammatory properties.",
    "🌞 Get some sunshine! Vitamin D is essential for bone health and immunity.",
    "🥤 Avoid sugary drinks. Choose water or herbal teas to cut down on empty calories.",
    "🍚 Portion control matters. Even healthy foods can lead to weight gain if eaten in excess.",
    "🚰 Start your day with water. Drinking a glass in the morning kickstarts metabolism.",
    "📱 Limit screen time before bed. Blue light disrupts your sleep cycle.",
    "🍽️ Slow down while eating. Chewing food properly aids digestion and prevents overeating.",
    "🍋 Lemon water aids digestion and provides a boost of Vitamin C.",
    "🧘 Practice mindfulness. Stress impacts health—try meditation or deep breathing exercises.",
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [greeting, setGreeting] = useState("");
  const [expandedWeight, setExpandedWeight] = useState(false);
  const [expandedCalories, setExpandedCalories] = useState(false);

  const toggleWeightExpand = () => {
    setExpandedWeight((prev) => !prev);
  };

  const toggleCaloriesExpand = () => {
    setExpandedCalories((prev) => !prev);
  };

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning ☀️");
    } else if (currentHour < 16) {
      setGreeting("Good Afternoon 🌤️");
    } else if (currentHour < 20) {
      setGreeting("Good Evening 🌙");
    } else {
      setGreeting("Good Night 🌚");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={['#b2d6d2','#d4ffda']} style={styles.backgroundImage}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={ // ✅ Pull-to-refresh control added here
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.container}>
          <Text style={styles.greetingText}>{greeting}</Text>

          <Animated.View style={[styles.tipContainer, { opacity: fadeAnim }]}>
            <Text style={styles.tipText}>{tips[currentTipIndex]}</Text>
          </Animated.View>

          <Text style={styles.sectionTitle}>Your Activity Summary</Text>

          <View style={styles.grid}>
            <View style={[styles.box2, expandedWeight && styles.expandedBox]}>
              <Text style={styles.boxTitle2}>Total Weight Insight</Text>
              <Text style={styles.boxSubtitle2}>Monitor your weight</Text>

              <View style={styles.chartContainer}>
                <WeightReport expanded={expandedWeight} />
              </View>

              <TouchableOpacity style={styles.moreButton} onPress={toggleWeightExpand}>
                <Text style={styles.moreButtonText}>{expandedWeight ? "Collapse" : "More Details"}</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.box2, expandedCalories && styles.expandedBox]}>
              <Text style={styles.boxTitle2}>Total Calorie Insight</Text>
              <Text style={styles.boxSubtitle2}>Monitor your total calorie count</Text>
              
              <View style={styles.chartContainer}>
                <CalorieReport expanded={expandedCalories} />
              </View>
              <TouchableOpacity style={styles.moreButton} onPress={toggleCaloriesExpand}>
                <Text style={styles.moreButtonText}>{expandedCalories ? "Collapse" : "More Details"}</Text>
              </TouchableOpacity>
            </View>

            <View>
              <PieChartScreen />
            </View>
          </View>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20 },
  greetingText: { fontSize: 26, fontWeight: "bold", color: "#333", marginBottom: 35, marginTop: 20 },
  tipContainer: { backgroundColor: "#fffbf1", padding: 15, borderRadius: 10, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: "#00796b" },
  tipText: { fontSize: 16, fontWeight: "500", color: "#000" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#000", marginBottom: 40, marginTop: 20, textAlign: "center" },
  grid: { flexDirection: "column", gap: 15 },

  box2: {
    width: "100%",
    height: 350,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
  },
  expandedBox: { height: 500 },
  boxTitle2: { color: "#555", fontSize: 20, fontWeight: "bold", marginTop: 40 },
  boxSubtitle2: { color: "#444", fontSize: 14, opacity: 0.8 },
  chartContainer: { margin: 10, alignItems: "center", justifyContent: "center", marginBottom: 10, marginRight: 10 },
  moreButton: {
    marginBottom: 40,
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
  },
  moreButtonText: { color: "#00796b", fontSize: 12, fontWeight: "bold" },
});
