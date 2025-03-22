import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
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
