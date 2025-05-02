import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function PieChartScreen() {
  const [data, setData] = useState([]);
  const [recipeCount, setRecipeCount] = useState(0);
  const [topCountry, setTopCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([fetchCountryData(), fetchRecipeCountAndTopCountry()]);
    setLoading(false);
  };

  const fetchRecipeCountAndTopCountry = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const q = query(collection(db, "recipes"), where("user_id", "==", userId));
      const snapshot = await getDocs(q);
      setRecipeCount(snapshot.size);

      const countryCount = {};
      snapshot.forEach((doc) => {
        const country = doc.data().country;
        if (country) {
          countryCount[country] = (countryCount[country] || 0) + 1;
        }
      });

      let top = null;
      let max = 0;

      for (const country in countryCount) {
        if (countryCount[country] > max) {
          max = countryCount[country];
          top = country;
        }
      }

      setTopCountry(top);
    } catch (error) {
      console.error("Error fetching recipe count or top country:", error);
    }
  };

  const fetchCountryData = async () => {
    try {
      const userId = auth.currentUser?.uid;
      const q = query(collection(db, "recipes"), where("user_id", "==", userId));
      const querySnapshot = await getDocs(q);

      const countryCount = {};
      querySnapshot.forEach((doc) => {
        const recipe = doc.data();
        const country = recipe.country || "Unknown";
        countryCount[country] = (countryCount[country] || 0) + 1;
      });

      // Sort countries by count in descending order and take top 3
      const topCountries = Object.entries(countryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      const fixedColors = ["#436850", "#ADBC9F", "#0D330E"];

      const chartData = topCountries.map(([country, count], index) => ({
        name: country,
        population: count,
        color: fixedColors[index % fixedColors.length],
        legendFontColor: "#333",
        legendFontSize: 10,
      }));

      setData(chartData);
    } catch (error) {
      console.error("Error fetching recipes:", error);
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.detailsContainer}>
        <View style={styles.card1}>
          <Text style={styles.cardText}>Total Recipes:</Text>
          <Text style={styles.cardTextBold}>{recipeCount || "0"}</Text>
        </View>
        <View style={styles.card1}>
          <Text style={styles.cardText}>Favorite Cuisine:</Text>
          <Text style={styles.cardTextBold}>{topCountry || "no country"}</Text>
        </View>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.title}>Your Top Recipe Cuisines</Text>
        {data.length > 0 ? (
          <PieChart
            data={data}
            width={Dimensions.get("window").width - 50}
            height={250}
            chartConfig={{
              backgroundColor: "#f5f5f5",
              backgroundGradientFrom: "#f5f5f5",
              backgroundGradientTo: "#f5f5f5",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => "#333",
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            hasLegend={true}
            center={[0, 0]}
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>No recipes yet</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 10,
  },
  card1: {
    backgroundColor: "#fffbf1",
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  cardTextBold: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fffbf1",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    width:"100%",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 5,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 40,
  },
});
