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
      
      Please provide a detailed one day meal plan that is align with sri lankan people and sri lankan economy with breakfast, lunch and dinner.
      Include food items, portions, and approximate calories per meal,and the instructions for making the meal but straight to the point
      and the total calorie count for the day in the end of the complete meal plan .thats it and
      dont add any tips or recommondations or snacks or anything, 
      Ensure all recommendations consider the medical conditions listed.`;

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