import { createSlice } from "@reduxjs/toolkit";

const recipeSlice = createSlice({
  name: "recipes",
  initialState: { list: [] },
  reducers: {
    setRecipes: (state, action) => {
      state.list = action.payload;
    },
    addRecipe: (state, action) => {
      state.list.push(action.payload);
    },
  },
});

export const { setRecipes, addRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;
