import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-svg-charts";

export default function PieChartComponent() {
  // Hardcoded demo data
  const demoData = [
    { key: "Chicken", value: 4, svg: { fill: "#ff6384" } },
    { key: "Salad", value: 3, svg: { fill: "#36a2eb" } },
    { key: "Pasta", value: 5, svg: { fill: "#ffce56" } },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Categories</Text>
      <PieChart style={styles.chart} data={demoData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", padding: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  chart: { height: 200, width: 200 },
});
