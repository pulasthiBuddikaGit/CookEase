// app/(tabs)/user.jsx
import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { signOut, deleteUser } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import Icon from "react-native-vector-icons/MaterialIcons";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import ProtectedScreen from "../../components/s-components/ProtectedScreen";
import {
  getUserDocument,
  deleteUserDocument,
} from "../../services/senudi/userService";

const defaultPhotoURL =
  "https://www.pngitem.com/pimgs/m/146-1468479_default-profile-picture-png-transparent-png.png";

const User = () => {
  const [status, setStatus] = useState("");
  const [photoURL, setPhotoURL] = useState(defaultPhotoURL);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const router = useRouter();

  const loadUserProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await user.reload();
      const firestoreData = await getUserDocument(user.uid);

      setDisplayName(firestoreData?.displayName || user.displayName || "N/A");
      setEmail(user.email);
      setAge(firestoreData?.age || "N/A");
      setPhotoURL(firestoreData?.photoURL || user.photoURL || defaultPhotoURL);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile();
    }, [])
  );

  const handleSignOut = async () => {
    try {
      setStatus("Signing out...");
      await signOut(auth);
      setStatus("Signed out successfully");
      router.replace("/auth");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleEditAccount = () => router.push("/account/edit");
  const handleDeleteCancel = () => setIsDeleteModalVisible(false);
  const handleDeleteAccount = () => setIsDeleteModalVisible(true);

  const handleDeleteConfirm = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No active user");

      const credential = EmailAuthProvider.credential(
        user.email,
        "user-password"
      );
      await reauthenticateWithCredential(user, credential);

      // Delete from Firestore
      await deleteUserDocument(user.uid);

      // Delete from Firebase Auth
      await deleteUser(user);

      // Redirect after successful deletion
      router.replace("/auth");
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        Alert.alert(
          "Session Expired",
          "Please sign in again to delete your account."
        );
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };

  return (
    <ProtectedScreen allow={["user"]} redirectTo="/admin">
      <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>
        <Image
          source={{ uri: photoURL }}
          style={styles.profileImage}
          onError={() => setPhotoURL(defaultPhotoURL)}
        />
        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userEmail}>{email}</Text>
        <Text style={styles.userAge}>Age: {age}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleEditAccount}>
            <Icon
              name="edit"
              size={20}
              color="#000"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Edit Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDeleteAccount}
          >
            <Icon
              name="delete"
              size={20}
              color="#ff0000"
              style={styles.buttonIcon}
            />
            <Text style={[styles.buttonText, styles.deleteButtonText]}>
              Delete Account
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Icon
              name="logout"
              size={20}
              color="#000"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <DeleteConfirmationModal
          visible={isDeleteModalVisible}
          onCancel={handleDeleteCancel}
          onSuccess={() => router.replace("/auth")}
          userId={auth.currentUser?.uid}
          authUser={auth.currentUser}
        />
      </View>
    </ProtectedScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#00796b",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  userAge: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 30,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#A3D9C9",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
    width: "80%",
    justifyContent: "center",
  },
  deleteButton: { backgroundColor: "#ffebee" },
  buttonIcon: { marginRight: 10 },
  buttonText: { fontSize: 16, color: "#000" },
  deleteButtonText: { color: "#ff0000" },
});

export default User;
