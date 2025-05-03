// components/DeleteConfirmationModal.jsx
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

const DeleteConfirmationModal = ({
  visible,
  onCancel,
  onConfirm,
  password,
  setPassword,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirm Delete</Text>
          <Text style={styles.modalMessage}>
            Enter your current password to confirm account deletion.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Current password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onConfirm}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#A3D9C9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    color: '#ff0000',
    fontWeight: '600',
  },
});

export default DeleteConfirmationModal;
