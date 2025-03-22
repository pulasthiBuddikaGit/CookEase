// app/(tabs)/admin.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Admin() {
  // State for dynamic dimensions
  const [dimensions, setDimensions] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });

  // State for tooltips
  const [tooltip, setTooltip] = useState({ visible: false, value: '', x: 0, y: 0 });

  // State for selected bar/pie slice
  const [selectedBarIndex, setSelectedBarIndex] = useState(null);
  const [selectedPieIndex, setSelectedPieIndex] = useState(null);

  // Update dimensions on screen resize (e.g., orientation change)
  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setDimensions({ width, height });
    };

    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

  // Calculate chart dimensions dynamically
  const chartWidth = dimensions.width - 120; // Increased padding to make chart smaller
  const chartHeight = Math.max(dimensions.height * 0.25, 180); // Reduced height (25% of screen height, minimum 180)
  const labelFontSize = Math.max(dimensions.width * 0.02, 8); // Slightly smaller font size for labels

  // Data for User Age Group (Bar Chart)
  const userAgeGroupData = {
    labels: ['Female', 'Male'],
    datasets: [
      {
        data: [20000, 30000],
      },
    ],
  };

  // Data for Total Users (Line Chart)
  const totalUsersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [5000, 7000, 6000, 10000, 12000, 9000, 11000],
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // This year (black)
        strokeWidth: 2,
      },
      {
        data: [4000, 6000, 5000, 8000, 10000, 7000, 9000],
        color: (opacity = 1) => `rgba(66, 165, 245, ${opacity})`, // Last year (blue)
        strokeWidth: 2,
      },
    ],
  };

  // Data for Devices Used (Bar Chart)
  const devicesUsedData = {
    labels: ['Linux', 'Mac', 'iOS', 'Android', 'Other'],
    datasets: [
      {
        data: [10000, 25000, 15000, 5000, 5000],
      },
    ],
  };

  // Data for Users by Country (Pie Chart)
  const usersByCountryData = [
    {
      name: 'United States',
      population: 52.1,
      color: selectedPieIndex === 0 ? '#333' : '#000',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Canada',
      population: 22.8,
      color: selectedPieIndex === 1 ? '#82b1ff' : '#42a5f5',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Mexico',
      population: 13.9,
      color: selectedPieIndex === 2 ? '#81c784' : '#66bb6a',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'Other',
      population: 11.2,
      color: selectedPieIndex === 3 ? '#e0e0e0' : '#bdbdbd',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  const chartConfig = {
    backgroundColor: '#f9f9f9',
    backgroundGradientFrom: '#f9f9f9',
    backgroundGradientTo: '#f9f9f9',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 121, 107, ${opacity})`, // Teal color for bars
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 5,
    },
    propsForLabels: {
      fontSize: labelFontSize, // Dynamic font size
    },
    propsForDots: {
      r: '4', // Smaller dots for smaller chart
      strokeWidth: '2',
      stroke: '#ffa726',
    },
    propsForBackgroundLines: {
      strokeDasharray: '5, 5', // Dashed grid lines
    },
  };

  // Function to handle bar chart tap (User Age Group and Devices Used)
  const handleBarChartPress = (index, label, value) => {
    setSelectedBarIndex(index);
    Alert.alert(
      'Data Point',
      `${label}: ${value}K`,
      [{ text: 'OK', onPress: () => setSelectedBarIndex(null) }]
    );
  };

  // Function to handle pie chart tap (Users by Country)
  const handlePieChartPress = (index) => {
    setSelectedPieIndex(index);
    Alert.alert(
      'Data Point',
      `${usersByCountryData[index].name}: ${usersByCountryData[index].population}%`,
      [{ text: 'OK', onPress: () => setSelectedPieIndex(null) }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Admin Portal</Text>
      </View>

      {/* User Age Group Section */}
      <View style={[styles.card, { minHeight: chartHeight + 50 }]}>
        <Text style={styles.cardTitle}>User Age Group</Text>
        <TouchableOpacity
          onPress={(event) => {
            const x = event.nativeEvent.locationX;
            const barWidth = chartWidth / userAgeGroupData.labels.length;
            const index = Math.floor(x / barWidth);
            if (index >= 0 && index < userAgeGroupData.labels.length) {
              handleBarChartPress(index, userAgeGroupData.labels[index], userAgeGroupData.datasets[0].data[index]);
            }
          }}
        >
          <BarChart
            data={{
              ...userAgeGroupData,
              datasets: [
                {
                  data: userAgeGroupData.datasets[0].data.map((value, i) =>
                    i === selectedBarIndex ? value + 1000 : value
                  ),
                },
              ],
            }}
            width={chartWidth}
            height={chartHeight}
            yAxisLabel=""
            yAxisSuffix="K"
            fromZero
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={0}
          />
        </TouchableOpacity>
      </View>

      {/* Total Users Section */}
      <View style={[styles.card, { minHeight: chartHeight + 50 }]}>
        <Text style={styles.cardTitle}>Total Users</Text>
        <LineChart
          data={totalUsersData}
          width={chartWidth}
          height={chartHeight}
          yAxisLabel=""
          yAxisSuffix="K"
          fromZero
          chartConfig={chartConfig}
          style={styles.chart}
          bezier
          withDots={true}
          withShadow={true}
          onDataPointClick={({ value, dataset, x, y }) => {
            setTooltip({
              visible: true,
              value: `${value}K (${dataset === totalUsersData.datasets[0] ? 'This Year' : 'Last Year'})`,
              x,
              y,
            });
            setTimeout(() => setTooltip({ visible: false, value: '', x: 0, y: 0 }), 2000);
          }}
        />
        {tooltip.visible && (
          <View
            style={[
              styles.tooltip,
              {
                left: Math.min(tooltip.x - 50, dimensions.width - 120),
                top: tooltip.y - 40,
              },
            ]}
          >
            <Text style={styles.tooltipText}>{tooltip.value}</Text>
          </View>
        )}
      </View>

      {/* Devices Used Section */}
      <View style={[styles.card, { minHeight: chartHeight + 50 }]}>
        <Text style={styles.cardTitle}>Devices Used</Text>
        <TouchableOpacity
          onPress={(event) => {
            const x = event.nativeEvent.locationX;
            const barWidth = chartWidth / devicesUsedData.labels.length;
            const index = Math.floor(x / barWidth);
            if (index >= 0 && index < devicesUsedData.labels.length) {
              handleBarChartPress(index, devicesUsedData.labels[index], devicesUsedData.datasets[0].data[index]);
            }
          }}
        >
          <BarChart
            data={{
              ...devicesUsedData,
              datasets: [
                {
                  data: devicesUsedData.datasets[0].data.map((value, i) =>
                    i === selectedBarIndex ? value + 1000 : value
                  ),
                },
              ],
            }}
            width={chartWidth}
            height={chartHeight}
            yAxisLabel=""
            yAxisSuffix="K"
            fromZero
            chartConfig={chartConfig}
            style={styles.chart}
            verticalLabelRotation={30}
          />
        </TouchableOpacity>
      </View>

      {/* Users by Country Section */}
      <View style={[styles.card, { minHeight: chartHeight + 80 }]}>
        <Text style={styles.cardTitle}>Users by Country</Text>
        <TouchableOpacity
          onPress={(event) => {
            const x = event.nativeEvent.locationX;
            const sliceWidth = chartWidth / usersByCountryData.length;
            const index = Math.floor(x / sliceWidth);
            if (index >= 0 && index < usersByCountryData.length) {
              handlePieChartPress(index);
            }
          }}
        >
          <PieChart
            data={usersByCountryData}
            width={chartWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </TouchableOpacity>
        <View style={styles.legend}>
          {usersByCountryData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={[styles.legendText, { fontSize: labelFontSize }]}>{`${item.name}: ${item.population}%`}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4caf50',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 5,
    paddingLeft: 30, // Increased padding for y-axis labels
    paddingRight: 30, // Increased padding for right side
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#333',
    borderRadius: 5,
    padding: 5,
    zIndex: 1000,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
  legend: {
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    color: '#333',
  },
});