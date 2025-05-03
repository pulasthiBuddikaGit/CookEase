// services/senudi/userService.js
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc ,
} from "firebase/firestore";

export const createUserDocument = async (uid, data) => {
  if (!uid) return;
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, data, { merge: true });
};

export const getUserDocument = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
};

export const updateUserDocument = async (uid, data) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return updateDoc(userRef, data);
  } else {
    return setDoc(userRef, data);
  }
};

export const deleteUserDocument = async (uid) => {
  if (!uid) return;
  await deleteDoc(doc(db, "users", uid));
};

export const getAllNonAdminUsers = async () => {
  const q = query(collection(db, "users"), where("role", "!=", "admin"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};
