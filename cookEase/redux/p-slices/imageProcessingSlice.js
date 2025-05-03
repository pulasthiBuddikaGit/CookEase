import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  imageUri: null,
  labels: [],
  texts: [],
  scanType: null, // 'package' or 'ingredient'
  popupVisible: false,
  selectedIngredients: []
};

const imageProcessingSlice = createSlice({
  name: 'imageProcessing',
  initialState,
  reducers: {
    setImageUri: (state, action) => {
      state.imageUri = action.payload;
    },
    setLabels: (state, action) => {
      state.labels = action.payload;
    },
    clearLabels: (state) => {
      state.labels = [];
    },
    clearTexts: (state) => {
      state.texts = [];
    },
    setTexts: (state, action) => {
      state.texts = action.payload;
    },
    setScanType: (state, action) => {
      state.scanType = action.payload;
    },
    setPopupVisible: (state, action) => {
      state.popupVisible = action.payload;
    },
    resetImageProcessing: (state) => {
      return initialState;
    },
    addIngredients(state, action) {
      state.selectedIngredients = [...state.selectedIngredients, ...action.payload];
    },
    clearIngredients(state) {
      state.selectedIngredients = [];
    }
  },
});

export const {
  setImageUri,
  setLabels,
  clearLabels,
  setTexts,
  clearTexts,
  setScanType,
  setPopupVisible,
  resetImageProcessing,
  addIngredients, 
  clearIngredients,
} = imageProcessingSlice.actions;

export default imageProcessingSlice.reducer;