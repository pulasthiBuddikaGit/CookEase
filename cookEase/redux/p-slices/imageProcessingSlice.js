import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  imageUri: null,
  labels: [],
  texts: [],
  scanType: null, // 'package' or 'ingredient'
  popupVisible: false,
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
  },
});

export const {
  setImageUri,
  setLabels,
  setTexts,
  setScanType,
  setPopupVisible,
  resetImageProcessing,
} = imageProcessingSlice.actions;

export default imageProcessingSlice.reducer;