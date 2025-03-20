import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const SelectionPopup = ({ visible, onSelect, onClose }) => {
  return (
    <Modal transparent={true} animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Select What You Wanna Scan</Text>
          <TouchableOpacity style={styles.button} onPress={() => onSelect("text")}>
            <Text style={styles.buttonText}>Package?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => onSelect("label")}>
            <Text style={styles.buttonText}>Ingredient?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#fff",
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  cancelText: {
    color: "#000",
  },
});

export default SelectionPopup;
