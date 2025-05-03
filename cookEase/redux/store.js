import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./p-slices/counterSlice";
import recipeReducer from "./b-slices/recipeSlice"

export const store = configureStore({
  reducer: {
    counter: counterReducer,

    recipes: recipeReducer,

    
  },
});
