import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CameraButton = ({ emoji, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.emoji}>{emoji}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#00C000",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
    boxShadow: "5px 6px 4px rgba(0,0,0,0.2)",
  },
  emoji: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CameraButton;
