// utils/openaiService.js
import OpenAI from "openai";
import { OPENAI_DIET_KEY } from "./APIkeys"; // Adjust path if needed

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: OPENAI_DIET_KEY,
  dangerouslyAllowBrowser: true
});
// Function to generate diet plan
export const generateDietPlan = async (userData) => {
  try {
    const { age, gender, height, weight, bmi, calories, selectedConditions, country } = userData;
    
    // Create a prompt for OpenAI based on user data
    const prompt = `Generate a personalized diet plan with the following details:
- Age: ${age}
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- BMI: ${bmi}
- Calorie Target: ${calories} Kcal
- Medical Conditions: ${selectedConditions.join(', ')}
- Country: ${country}

Please provide a detailed one-day meal plan aligned with the selected country and its economy, with breakfast, lunch, and dinner. The meal plan should be structured as follows:

1. **Weight, Height, and BMI**:
   - Weight: ${weight} kg
   - Height: ${height} cm
   - BMI: ${bmi}

2. **Meal Plan Structure**:
   For each meal (Breakfast, Lunch, and Dinner):

   - **Meal Type** (e.g., Breakfast, Lunch, Dinner):  
     This should be clearly **treated as a bold header**.
     - **Food Item**: [Name of the food item]
     - **Portion**: [Amount/portion size]
     - **Ingredients**: [List of ingredients]
     - **Instructions**: [Steps to prepare the meal]
     - **Approximate Calories**: [Calories for the meal]

3. **Total Calorie Count for the Day**:
   - [Total calories for the entire day]

**Do not include any tips, recommendations, or snacks**. Ensure that the medical conditions listed are considered in the meal plan. The output should be structured consistently with the following specifications:

- Headers: Make the following bold and slightly larger:
  - Weight, Height, BMI, Breakfast, Lunch, Dinner

- **Subheaders**: Make subheaders (e.g., Food Item, Portion, Ingredients, Instructions, Approximate Calories) **bold and a bit smaller** than the headers.
- **Content Text**: The rest of the text (instructions, food items, etc.) should be normal and easy to read.

**Please format the response with the following specifics**:
- Do **not** use any markdown or special characters like '**' or '##' in the response.
- The **calories** for each meal should be **bolded** and mentioned under the "Approximate Calories" section for each meal.
- The output must be well-structured with each meal type clearly separated and the calorie count at the end of the meal plan.

Example format:

---
Weight: 70 kg  
Height: 175 cm  
BMI: 22.9

--Breakfast--

Food Item: Scrambled Eggs  
Portion: 2 Eggs  
Ingredients:  
  Eggs, Salt, Pepper, Olive oil  
Instructions:  
  Beat eggs with salt and pepper. Heat oil in a pan, cook eggs while stirring for 3-5 minutes.  

Approximate Calories: 300 Kcal



--Lunch--

Food Item: Grilled Chicken Salad  
Portion: 1 Plate  
Ingredients:  
  Chicken breast, Lettuce, Cucumber, Tomatoes, Olive oil, Lemon  
Instructions:  
  Grill chicken, mix with fresh vegetables, drizzle with olive oil and lemon juice.  

Approximate Calories: 500 Kcal



--Dinner-- 

Food Item: Baked Salmon  
Portion: 1 Piece  
Ingredients:  
  Salmon, Garlic, Lemon, Olive oil  
Instructions:  
  Marinate salmon with garlic, lemon, and olive oil, bake at 180°C for 20 minutes.  

Approximate Calories: 400 Kcal

---

Total Calorie Count for the Day: 1200 Kcal

---

This format should be consistent for every diet plan generated, with no markdown characters in the response.
`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or any available model you prefer
      messages: [
        { role: "system", content: "You are a nutrition assistant." },
        { role: "user", content: prompt } // Using the formatted prompt instead of params
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating diet plan:", error);
    throw error;
  }
};

export default openai;