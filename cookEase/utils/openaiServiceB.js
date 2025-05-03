import OpenAI from "openai";
import {OPENAI_MEAL_KEY} from "./APIkeys";

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: OPENAI_MEAL_KEY,
  dangerouslyAllowBrowser: true,
});

export const generateRecipe = async (ingredientsInput, cookingTime, complexity,userId,country,serve) => {
  try {
    const ingredientsList = ingredientsInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    if (ingredientsList.length === 0) {
      throw new Error("Please provide at least one ingredient.");
    }

    const prompt = `Generate a simple recipe using ONLY the following ingredients: 
    ${ingredientsList.join(", ")}.

   - Cooking Time: ${cookingTime}  
- Complexity: ${complexity}  
- Number of Servings: ${serve}  
- Country: ${country}  

Please format the output clearly using the following structure:

Title  
[Only the recipe title. No label like 'Title:' or 'Recipe Name:']

Number of Servings  
[Show the number of servings on a new line]

Short Description  
[Provide a very short description of the dish, get the user input Number of Servings ]

Ingredients  
[List of ingredients with exact amounts]

Cooking Instructions  
[Step-by-step instructions. Each step on a new line.]

Formatting Rules:  
- Use clear section headers (e.g., "Number of Servings", "Ingredients", "Cooking Instructions") — make them bold and use '-' before the header.
- Do NOT write the header and content on the same line.
- Write content of Cooking Instructions with number points and left align.
- Do NOT use symbols like '**', ':', '-', or markdown.
- Do NOT include nutritional info, tips, or substitutions.
- Keep everything clean, structured, and suitable for direct HTML rendering or app display.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an experienced home cook who creates easy and delicious recipes for families using simple techniques." },
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
