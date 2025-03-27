import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from "firebase/firestore";  // Ensure serverTimestamp is imported
import { getAuth } from "firebase/auth";

// Function to save a diet plan
export const saveDietPlan = async (dietPlanName, weight, height, bmi, dietPlan, totalCalories) => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      throw new Error("User not logged in");
    }

    // Ensure weight, height, bmi, and totalCalories are numbers
    const weightValue = weight ? parseFloat(weight) : 0;  
    const heightValue = height ? parseFloat(height) : 0;
    const bmiValue = bmi ? parseFloat(bmi) : 0;
    const totalCaloriesValue = totalCalories ? parseFloat(totalCalories) : 0;

    // Ensure diet_plan is a string
    const dietPlanText = dietPlan || "No diet plan available";

    // Use the dietPlanName directly here
    const dietData = {
      diet_id: new Date().getTime().toString(),
      user_id: userId,
      diet_plan_name: dietPlanName || "Unnamed Plan", // Default name if missing
      weight: weightValue,  
      height: heightValue,  
      bmi: bmiValue,  
      diet_plan: dietPlanText,  
      total_calories: totalCaloriesValue,  
      date_created: serverTimestamp(),  // Timestamp from Firebase server
    };

    console.log("Saving Diet Plan:", dietData); // Log the object to see it before saving
    
    await addDoc(collection(db, "DietPlans"), dietData);
    console.log("✅ Diet plan saved successfully!");
  } catch (error) {
    console.error("❌ Error saving diet plan:", error);
  }
};

// Function to fetch the latest diet plan
export const getLatestDietPlan = async () => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      throw new Error("User not logged in");
    }

    const dietPlansRef = collection(db, "DietPlans");
    
    // Query the latest diet plan for the user
    const q = query(
      dietPlansRef,
      where("user_id", "==", userId),
      orderBy("date_created", "desc"), // Ensure index is created for this!
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const latestDietPlan = querySnapshot.docs[0].data();
      return latestDietPlan;
    } else {
      return null; // No diet plan found
    }
  } catch (error) {
    console.error("❌ Error fetching latest diet plan:", error);
    throw error;
  }
};

// Function to fetch all previous diet plans (excluding the latest one)
export const getPreviousDietPlans = async () => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      throw new Error("User not logged in");
    }

    const dietPlansRef = collection(db, "DietPlans");

    // Fetch all diet plans for the user (no limit applied)
    const q = query(
      dietPlansRef,
      where("user_id", "==", userId),
      orderBy("date_created", "desc") // Ensure plans are sorted by date_created in descending order
    );

    const querySnapshot = await getDocs(q);

    // Check if we fetched any data
    if (querySnapshot.empty) {
      console.log("No diet plans found for this user");
      return [];
    }

    // Extract diet plan data from the snapshot
    const dietPlans = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,  // Copies all existing properties
        date_created: data.date_created ? data.date_created.toDate() : null, // Converts Timestamp to Date
      };
    });

    // Log the fetched diet plans to ensure they are correct
    console.log("Fetched Diet Plans for user: ", dietPlans);

    // Exclude the most recent diet plan (skip the first document in the array)
    const previousDietPlans = dietPlans.slice(1);  // This skips the most recent diet plan

    // Log previous diet plans to check
    console.log("Previous Diet Plans (after removing the latest one): ", previousDietPlans);

    return previousDietPlans;
  } catch (error) {
    console.error("❌ Error fetching previous diet plans:", error);
    throw error;
  }
};

// Function to fetch a specific diet plan by diet_id
export const getDietPlanById = async (dietId) => {
  try {
    console.log("Fetching diet plan with ID:", dietId);  // Log the ID for debugging

    const dietPlansRef = collection(db, "DietPlans");
    const q = query(dietPlansRef, where("diet_id", "==", String(dietId)));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const dietPlan = querySnapshot.docs[0].data();
      return dietPlan;  // Return the specific diet plan
    } else {
      return null;  // Return null if no matching diet plan is found
    }
  } catch (error) {
    console.error("❌ Error fetching diet plan by id:", error);
    throw error;
  }
};
