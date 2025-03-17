import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./p-slices/counterSlice";
import counterReducerN from "./n-slices/SliceN";

export const store = configureStore({
  reducer: {
    counter: counterReducer, // Add your reducers here
    counterN: counterReducerN,

  },
});
