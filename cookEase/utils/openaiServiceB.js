import OpenAI from "openai";
import { OPENAI_API_KEY } from "@env";


const openai = new OpenAI({
  apiKey: OPENAI_API_KEY, // Use the API key from .env
  dangerouslyAllowBrowser: true
});

export const generateRecipe = async (ingredientsInput, cookingTime, complexity) => {
  try {
    const ingredientsList = ingredientsInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    if (ingredientsList.length === 0) {
      throw new Error("Please provide at least one ingredient.");
    }

    const prompt = `Generate a simple Sri Lankan recipe using the following ingredients: 
    ${ingredientsList.join(", ")}.

    - Cooking Time: ${cookingTime}
    - Complexity: ${complexity}

    Provide:
    - Recipe title
    - A short description
    - Ingredients list with exact amounts
    - Step-by-step cooking instructions
    - Estimated cooking time
    - Number of servings.

    Do NOT include nutrition information, tips, or substitutions. Keep the response clear and structured.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional chef." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
};

export default openai;
