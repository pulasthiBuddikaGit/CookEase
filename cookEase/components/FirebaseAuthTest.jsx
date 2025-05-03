// components/FirebaseAuthTest.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";
import {
  createUserDocument,
  getUserDocument,
} from "../services/senudi/userService";

export default function FirebaseAuthTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setStatus("User is signed in");

        try {
          const doc = await getUserDocument(user.uid);
          const userRole = doc?.role || "user";
          setRole(userRole);

          // Redirect based on role
          if (userRole === "admin") {
            router.replace("/(admin-tabs)/admin");
          } else {
            router.replace("/(tabs)/");
          }
        } catch (err) {
          console.error("Failed to fetch user document:", err);
        }
      } else {
        setUser(null);
        setRole("");
        setStatus("User is signed out");
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = async () => {
    try {
      setStatus("Creating account...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await createUserDocument(user.uid, {
        email: user.email,
        role: "user",
        createdAt: new Date(),
      });

      setUser(user);
      setStatus("Account created and saved to Firestore");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleSignIn = async () => {
    try {
      setStatus("Signing in...");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      setStatus("Signed in successfully");

      // ✅ Routing handled by onAuthStateChanged
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      setStatus("Signing out...");
      await signOut(auth);
      setUser(null);
      setStatus("Signed out successfully");
      setRole("");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>COOKEASE</Text>
      <Text style={styles.status}>{status}</Text>

      {user ? (
        <View style={styles.userBox}>
          <Text style={styles.userText}>User ID: {user.uid}</Text>
          <Text style={styles.userText}>Email: {user.email}</Text>
          <Text style={styles.userText}>Role: {role}</Text>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.buttonText}>SIGN OUT</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.authButton} onPress={handleSignUp}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.authButton} onPress={handleSignIn}>
              <Text style={styles.buttonText}>SIGN IN</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4fdfc",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d6b",
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  input: {
    height: 50,
    backgroundColor: "#e9f3ff",
    borderColor: "#3f86f7",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 18,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: "column",
    gap: 12,
  },
  authButton: {
    backgroundColor: "#3f86f7",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#3f86f7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  signOutButton: {
    backgroundColor: "#ef5350",
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  userBox: {
    backgroundColor: "#e0f2f1",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
  },
  userText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
  },
});
