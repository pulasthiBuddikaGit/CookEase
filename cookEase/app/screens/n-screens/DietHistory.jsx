import { View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl, TextInput } from "react-native"; // ✅ Added TextInput
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getPreviousDietPlans } from "../../../services/nisalka/dietService";  // Import the new function

export default function DietHistoryScreen() {
  const router = useRouter();
  const [historyData, setHistoryData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Added state for search

  // Fetch the diet plans on component mount
  useEffect(() => {
    const fetchDietHistory = async () => {
      try {
        const data = await getPreviousDietPlans();
        console.log("Fetched Diet History:", data);  // Log the fetched data to check
        setHistoryData(data);  // Set the previous diet plans
      } catch (error) {
        console.error("Error fetching diet history:", error);
      }
    };

    fetchDietHistory();
  }, []);

  // Handle refresh action
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getPreviousDietPlans();  // Fetch the diet history again
      setHistoryData(data);  // Update the state with new data
    } catch (error) {
      console.error("Error refreshing diet history:", error);
    } finally {
      setRefreshing(false);  // Stop refreshing
    }
  };

  // ✅ Filter history data by search query
  const filteredHistory = historyData.filter((item) =>
    item.diet_plan_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView contentContainerStyle={styles.container}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      <Text style={styles.title}>Diet Plan History</Text>

      {/* ✅ Search Input Field */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search diet plans..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredHistory.map((item) => (
        <TouchableOpacity
          key={item.diet_id}
          style={styles.historyItem}
          onPress={() => {
            console.log("Navigating to PreviousDiet");
            router.push({ pathname: "/screens/n-screens/PreviousDiet", params: { id: item.diet_id } });
            console.log("Navigating to:", `/screens/n-screens/PreviousDiet?id=${item.diet_id}`);

          }}
        >
          <Text style={styles.text}>🍽️ {item.diet_plan_name}</Text>
          <Text style={styles.dateText}>
            {item.date_created
              ? `Created on: ${item.date_created.toLocaleString()}`
              : "No date available"}
          </Text>
        </TouchableOpacity>
      ))}

      {filteredHistory.length === 0 && (
        <Text style={styles.noResultsText}>No matching diet plans found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ScrollView: { flex: 1 },
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f9fffb' },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },

  // ✅ Added search input styling
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  historyItem: { padding: 15, marginBottom: 10,backgroundColor: "#d4edda", borderRadius: 10,borderColor: "#ddd",borderWidth: 1,
    shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.1,shadowRadius: 4,elevation: 3,},

  text: { color: "black", fontSize: 16, textAlign: "center" },
  dateText: { color: "gray", fontSize: 14, textAlign: "center", marginTop: 5 },

  // ✅ Added style for no results
  noResultsText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" },
});
