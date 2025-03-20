// utils/openaiService.js
import OpenAI from "openai";

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true
});

// Function to generate diet plan
export const generateDietPlan = async (userData) => {
  try {
    const { age, gender, height, weight, bmi, calories, selectedConditions } = userData;
    
    // Create a prompt for OpenAI based on user data
    const prompt = `Generate a personalized diet plan with the following details:
      - Age: ${age}
      - Gender: ${gender}
      - Height: ${height} cm
      - Weight: ${weight} kg
      - BMI: ${bmi}
      - Calorie Target: ${calories} Kcal
      - Medical Conditions: ${selectedConditions.join(', ')}
      
      Please provide a detailed 7-day meal plan with breakfast, lunch, dinner, and snacks.
      Include food items, portions, and approximate calories. Provide practical advice for meal preparation.
      Ensure all recommendations consider the medical conditions listed.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or any available model you prefer
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