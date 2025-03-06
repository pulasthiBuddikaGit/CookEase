import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./p-slices/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer, // Add your reducers here
  },
});
