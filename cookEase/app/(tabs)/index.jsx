import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Animated } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient"; // Using expo-linear-gradient for gradient background


export default function Index() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  // Motivational Tips
  const tips = [
    "💧 Stay hydrated! Drinking more water boosts metabolism by 30%.",
    "🥦 Eat more greens! Leafy veggies improve digestion & energy levels.",
    "🔥 Spicy foods can boost metabolism and help burn calories faster.",
    "🍊 Vitamin C strengthens your immune system try some oranges today!",
    "🏃‍♂️ A short walk after meals helps digestion & lowers blood sugar levels.",
    "🍽️ Mindful eating leads to better digestion and prevents overeating.",
    "💤 Quality sleep helps regulate hunger and improves weight control.",
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [greeting, setGreeting] = useState("");

  // Animation for tip transition
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Get the current greeting based on time
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

  // Auto-switch tips every 5 seconds
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          {/* Greeting */}
          <Text style={styles.greetingText}>{greeting}</Text>

          {/* Motivational Tip */}
          <Animated.View style={[styles.tipContainer, { opacity: fadeAnim }]}>
            <Text style={styles.tipText}>{tips[currentTipIndex]}</Text>
          </Animated.View>

          {/* Section Separator */}
          <Text style={styles.sectionTitle}>Your Activity Summary</Text>

          {/* Data Boxes */}
          <View style={styles.grid}>
            {/*  
            <TouchableOpacity style={styles.box1} activeOpacity={0.8}>
              <Text style={styles.boxTitle1}>Nutrient Intake</Text>
              <Text style={styles.boxSubtitle1}>Track your daily macros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.box1} activeOpacity={0.8}>
              <Text style={styles.boxTitle1}>Ingredient Trends</Text>
              <Text style={styles.boxSubtitle1}>Most used ingredients</Text>
            </TouchableOpacity>
            */}
            <TouchableOpacity style={styles.box2} activeOpacity={0.8}>
              <Text style={styles.boxTitle2}>Total Calories Insight</Text>
              <Text style={styles.boxSubtitle2}>Monitor monthley calorie count</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.box2} activeOpacity={0.8}>
              <Text style={styles.boxTitle2}>Body Weight Insights</Text>
              <Text style={styles.boxSubtitle2}>monitor your weight</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// Screen Dimensions
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    
  },
  container: {
    flex: 1,
    padding: 20,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 35,
    marginTop: 20,
  },
  tipContainer: {
    backgroundColor: "#fffbf1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#00796b",
  },
  tipText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 40,
    marginTop: 20,
    textAlign: "center",
  },
  grid: {
    flexDirection: "column",
    gap: 15,
  },
  box1: {
    width: "100%",
    height: 140,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
  },
  boxTitle1: {
    color: "#555",
    fontSize: 20,
    fontWeight: "bold",
  },
  boxSubtitle1: {
    color: "#444",
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
  },
  box2: {
    width: "100%",
    height: 140,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 5,
  },
  boxTitle2: {
    color: "#555",
    fontSize: 20,
    fontWeight: "bold",
  },
  boxSubtitle2: {
    color: "#444",
    fontSize: 14,
    opacity: 0.8,
    marginTop: 5,
  },
});
