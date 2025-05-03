import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./p-slices/counterSlice";
import recipeReducer from "./b-slices/recipeSlice"
import imageProcessingReducer from "./p-slices/imageProcessingSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer, // Add your reducers here
    recipes: recipeReducer,
    imageProcessing: imageProcessingReducer,
    
  },
});
