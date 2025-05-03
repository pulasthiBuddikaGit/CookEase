// app/(tabs)/admin.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
import ProtectedScreen from "../../components/s-components/ProtectedScreen";
import { getAllNonAdminUsers } from "../../services/senudi/userService";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Admin() {
  const router = useRouter();

  const [dimensions, setDimensions] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });

  const [tooltip, setTooltip] = useState({ visible: false, value: "", x: 0, y: 0 });
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);
  const [userAgeData, setUserAgeData] = useState([0, 0]);
  const [monthlyUserData, setMonthlyUserData] = useState(new Array(12).fill(0));
  const [countryData, setCountryData] = useState({});

  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get("window");
      setDimensions({ width, height });
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      const users = await getAllNonAdminUsers();
      const ageCounts = { Female: 0, Male: 0 };
      const monthlyCounts = new Array(12).fill(0);
      const countryCounts = {};

      users.forEach((u) => {
        const gender = u.gender || "Other";
        ageCounts[gender] = (ageCounts[gender] || 0) + 1;

        const createdAt = u.createdAt?.toDate?.() || new Date();
        const month = createdAt.getMonth();
        monthlyCounts[month]++;

        const country = u.country || "Other";
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      });

      setUserAgeData([ageCounts["Female"] || 0, ageCounts["Male"] || 0]);
      setMonthlyUserData(monthlyCounts);
      setCountryData(countryCounts);
    };

    loadUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const chartWidth = dimensions.width - 120;
  const chartHeight = Math.max(dimensions.height * 0.25, 180);
  const labelFontSize = Math.max(dimensions.width * 0.02, 8);

  const userAgeGroupData = {
    labels: ["Female", "Male"],
    datasets: [{ data: userAgeData }],
  };

  const totalUsersData = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        data: monthlyUserData,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const usersByCountryData = Object.entries(countryData).map(
    ([country, value], index) => ({
      name: country,
      population: Number(
        ((value / Object.values(countryData).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
      ),
      color: ["#000", "#42a5f5", "#66bb6a", "#bdbdbd", "#ff8a65"][index % 5],
      legendFontColor: "#333",
      legendFontSize: 14,
    })
  );

  const chartConfig = {
    backgroundColor: "#f9f9f9",
    backgroundGradientFrom: "#f9f9f9",
    backgroundGradientTo: "#f9f9f9",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 121, 107, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 5 },
    propsForLabels: { fontSize: labelFontSize },
    propsForDots: { r: "4", strokeWidth: "2", stroke: "#ffa726" },
    propsForBackgroundLines: { strokeDasharray: "5, 5" },
  };

  return (
    <ProtectedScreen allow={["admin"]} redirectTo="/auth">
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* User Age Group Chart */}
        <View style={[styles.card, { minHeight: chartHeight + 50 }]}>
          <Text style={styles.cardTitle}>User Age Group</Text>
          <BarChart
            data={userAgeGroupData}
            width={chartWidth}
            height={chartHeight}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={0}
          />
        </View>

        {/* Monthly Users Line Chart */}
        <View style={[styles.card, { minHeight: chartHeight + 50 }]}>
          <Text style={styles.cardTitle}>Total Users</Text>
          <LineChart
            data={totalUsersData}
            width={chartWidth}
            height={chartHeight}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            chartConfig={chartConfig}
            style={styles.chart}
            bezier
            withDots
            withShadow
            onDataPointClick={({ value, x, y }) => {
              setTooltip({ visible: true, value: `${value} users`, x, y });
              setTimeout(() => setTooltip({ visible: false, value: "", x: 0, y: 0 }), 2000);
            }}
          />
          {tooltip.visible && (
            <View style={[styles.tooltip, { left: tooltip.x - 50, top: tooltip.y - 40 }]}>
              <Text style={styles.tooltipText}>{tooltip.value}</Text>
            </View>
          )}
        </View>

        {/* Pie Chart: Users by Country */}
        {usersByCountryData.length > 0 && (
          <View style={[styles.card, { alignItems: "center" }]}>
            <Text style={styles.cardTitle}>Users by Country</Text>
            <PieChart
              data={usersByCountryData}
              width={dimensions.width - 40}
              height={250}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
              style={styles.chart}
            />
          </View>
        )}
      </ScrollView>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  signOutButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginRight: 16,
    backgroundColor: "#ef5350",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 10,
  },
  signOutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    alignSelf: "center"
  },
  chart: {
    marginVertical: 8,
    borderRadius: 5,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#333",
    borderRadius: 5,
    padding: 5,
    zIndex: 1000,
  },
  tooltipText: { color: "#fff", fontSize: 12 },
  legend: {
    marginTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: "#333",
    fontSize: 14,
  },
});
