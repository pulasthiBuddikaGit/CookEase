import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function DietHistoryScreen() {
  const router = useRouter();

  // Dummy history data (Replace with Redux state or Firebase data)
  const historyData = [
    { id: 1, date: "2025-03-07", totalCalories: 1800 },
    { id: 2, date: "2025-03-06", totalCalories: 2000 },
    { id: 3, date: "2025-03-05", totalCalories: 1700 },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Diet Plan History</Text>
      {historyData.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.historyItem}
          onPress={() => {console.log("Navigating to PreviousDiet"); router.push(`/screens/n-screens/PreviousDiet?id=${item.id}`)}}
        >
          <Text style={styles.text}>📅 {item.date}</Text>
          <Text style={styles.text}>🔥 {item.totalCalories} kcal</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f9fffb', },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  historyItem: { 
    padding: 15, 
    marginBottom: 10,
    backgroundColor: "#d4edda", 
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, },
  text: { color: "black", fontSize: 16, textAlign: "center" },
});
