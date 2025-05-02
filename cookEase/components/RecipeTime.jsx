import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import moment from "moment";

export default function RecipesOverTimeChart() {
  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState([]);
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const q = query(collection(db, "recipes"), where("user_id", "==", userId));
      const snapshot = await getDocs(q);

      const counts = {};

      snapshot.forEach((doc) => {
        const recipe = doc.data();
        const createdAt = recipe.created_at?.toDate?.();
        if (createdAt) {
          const month = moment(createdAt).format("MMM YYYY");
          counts[month] = (counts[month] || 0) + 1;
        }
      });

      // Sort months chronologically
      const sortedMonths = Object.keys(counts).sort(
        (a, b) => moment(a, "MMM YYYY").toDate() - moment(b, "MMM YYYY").toDate()
      );

      const chartLabels = sortedMonths;
      const chartData = sortedMonths.map((month) => counts[month]);

      setLabels(chartLabels);
      setDataPoints(chartData);
    } catch (error) {
      console.error("Error loading chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recipes Added Over Time</Text>
      {dataPoints.length > 0 ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data: dataPoints }],
          }}
          width={Dimensions.get("window").width - 32}
          height={260}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#f0f0f0",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: () => "#555",
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#4E944F",
            },
          }}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noDataText}>No data to show</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  chart: {
    borderRadius: 12,
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
  },
});
