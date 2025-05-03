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

    const prompt = `You are a skilled ${country} chef who only creates recipes using real, commonly used cooking ingredients.

You are a recipe generator. Only respond with a recipe if the user input includes valid food items or ingredients. If the input includes any non-edible or irrelevant item, politely reject it with a message like:

That is not a valid food ingredient.

Do not generate a recipe in such cases.

Otherwise, generate a simple ${country} recipe using the following ingredients:  
${ingredientsList.join(", ")}

Cooking Time: ${cookingTime}  
Complexity: ${complexity}   
Country: ${country}

Please include the following sections and formatting:

Title  
[Only the recipe title. Do not write 'Title:' or 'Recipe Name:']

Short Description  
[A very short description of the dish.]

Ingredients  
[List all ingredients with exact amounts. One per line.]

Cooking Instructions  
[Numbered steps. Each on a new line.]

Formatting Instructions:  
- **Make all section headers bold** (Title, Number of Servings, Short Description, Ingredients, Cooking Instructions).  
- Do **not** place the header and content on the same line. The content must be on the line **below** the header.  
- Under "Cooking Instructions", each instruction should be numbered and left-aligned.  
- Do **not** use any symbols like '*', '-', ':', or markdown syntax.  
- Do **not** include nutrition facts, tips, substitutions, or extra notes.  
- Output must be clean, structured, and ready for HTML or app display.  
- If the input includes invalid or non-food items, do **not** generate a recipe. Return only the message: That is not a valid food ingredient.

Example Output:

Vegetable Stir Fry


------------Short Description------------   

A quick and healthy mix of sautéed vegetables in soy sauce.

------------Ingredients------------  

1 cup broccoli  
1 cup bell peppers  
1 carrot  
2 tablespoons soy sauce  
1 tablespoon olive oil  
Salt  

------------Cooking Instructions------------ 

1. Chop all vegetables evenly.  
2. Heat oil in a pan over medium heat.  
3. Add vegetables and stir-fry for 5–7 minutes.  
4. Add soy sauce and salt, mix well.  
5. Serve hot.  

Only respond using this format.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
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
