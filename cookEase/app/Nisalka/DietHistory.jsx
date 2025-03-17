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
          onPress={() => router.push(`/Nisalka/PreviousDiet?id=${item.id}`)}
        >
          <Text style={styles.text}>📅 {item.date}</Text>
          <Text style={styles.text}>🔥 {item.totalCalories} kcal</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  historyItem: { padding: 15, marginBottom: 10, backgroundColor: "#00796b", borderRadius: 10 },
  text: { color: "#fff", fontSize: 16, textAlign: "center" },
});
