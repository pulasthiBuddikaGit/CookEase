import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { getUserDietPlans } from '../../services/nisalka/dietService';
import { LineChart } from 'react-native-chart-kit';
import { getAuth } from "firebase/auth";
import { Ionicons } from '@expo/vector-icons';

const WeightReport = ({ expanded }) => { // Receive expanded prop to conditionally render extra labels
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Controls which 4 points are displayed

  useEffect(() => {
    const fetchUserDietPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        const auth = getAuth();
        const userId = auth.currentUser?.uid;

        if (!userId) {
          setError("User not logged in.");
          setLoading(false);
          return;
        }

        const fetchedDietPlans = await getUserDietPlans(userId);
        const sortedPlans = fetchedDietPlans.sort((a, b) => a.date_created - b.date_created);

        setDietPlans(sortedPlans);

        // Start displaying the most recent 4 plans
        const startIndex = Math.max(sortedPlans.length - 4, 0);
        setCurrentIndex(startIndex);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDietPlans();
  }, []);

  const minIndex = 0;
  const maxIndex = Math.max(dietPlans.length - 4, 0);

  const plansToDisplay = dietPlans.slice(currentIndex, currentIndex + 4);
  const chartLabels = plansToDisplay.map((plan, index) => `Plan ${currentIndex + index + 1}`);
  const chartData = plansToDisplay.map(plan => plan.weight || 0);

  const handleLeftArrow = () => {
    if (currentIndex > minIndex) {
      setCurrentIndex(Math.max(currentIndex - 4, minIndex));
    }
  };

  const handleRightArrow = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(Math.min(currentIndex + 4, maxIndex));
    }
  };

  return (
    <View style={styles.chartContainer}>
      {loading ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : dietPlans.length === 0 ? (
        <Text style={styles.noDataText}>No diet plans found.</Text>
      ) : (
        <View style={styles.row}>
          <TouchableOpacity style={styles.arrow} onPress={handleLeftArrow} disabled={currentIndex === minIndex}>
            <Ionicons name="chevron-back" size={20} color={currentIndex === minIndex ? "#ccc" : "#007b91"} />
          </TouchableOpacity>

          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: chartLabels,
                datasets: [{ data: chartData }],
              }}
              width={Dimensions.get("window").width * 0.65}
              height={180}
              yAxisLabel=""
              yAxisSuffix=" kg"
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0,121,107, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: { r: "4", strokeWidth: "1", stroke: "#00796B" },
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <TouchableOpacity style={styles.arrow} onPress={handleRightArrow} disabled={currentIndex === maxIndex}>
            <Ionicons name="chevron-forward" size={20} color={currentIndex === maxIndex ? "#ccc" : "#007b91"} />
          </TouchableOpacity>
        </View>
      )}

      {expanded && ( // Show the extra labels if expanded is true
        <View style={styles.labelsContainer}>
          {plansToDisplay.map((plan, index) => (
            <View key={index} style={styles.labelRow}>
              <Text style={styles.labelText}>{`Plan ${currentIndex + index + 1} =`}</Text>
              <Text style={styles.weightText}>{`   Weight:  ${plan.weight || "N/A"} kg`}</Text>
              <Text style={styles.dateText}>{`   Date:  ${new Date(plan.date_created).toLocaleDateString()}`}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  chartWrapper: {
    width: Dimensions.get("window").width * 0.65,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  arrow: {
    marginHorizontal: 10,
  },
  noDataText: {
    color: "#555",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  labelsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  labelText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  weightText: {
    fontSize: 16,
    color: "#134f5c",
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
  },
});

export default WeightReport;
