import React, { useState } from "react";
import { View, Image, Alert, StyleSheet } from "react-native";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import * as ImagePicker from 'expo-image-picker';
import CameraButton from "../../components/p-components/CameraBtn";
import SelectionPopup from "../../components/p-components/SelectionPopup";
import { MaterialIcons } from "@expo/vector-icons";

const ImageProcessing = () => {
  
  const [imageUri, setImageUri] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(null);

  // Function to open camera and capture image
//   const handleCaptureImage = async () => {
//     const options = { mediaType: "photo", quality: 1 };
//     const result = await launchCamera(options);

//     if (result.assets) {
//       setSelectedImage(result.assets[0].uri);
//       setPopupVisible(true); // Show popup after capturing image
//     }
//   };

const pickImage = async () => {
// Show an alert to let the user choose between Camera and Gallery
Alert.alert(
    "Select Image",
    "Choose an option",
    [
    { text: "Cancel", style: "cancel" },
    {
        text: "Choose from Gallery",
        onPress: async () => await openGallery(),
    },
    {
        text: "Take Photo",
        onPress: async () => await openCamera(),
    },
    ],
    { cancelable: true }
);
};

  // Function to open the camera
const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access camera is required!");
      return;
    }
  
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images','videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log(result);
    handleImageResult(result);
};
  
// Function to open the gallery
const openGallery = async () => {

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
      alert("Permission to access gallery is required!");
      return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images','videos'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
  });

  console.log(result);
  handleImageResult(result);
};
  
// Function to handle the selected image
const handleImageResult = (result) => {
  if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
      setPopupVisible(true);
  }
};

const processImage = async (mode) => {
  setPopupVisible(false);
};

  // Function to process image based on selected option
  // const processImage = async (mode) => {
  //   setPopupVisible(false);
  //   if (!selectedImage) return;

  //   const API_KEY = "YOUR_GOOGLE_CLOUD_VISION_API_KEY";
  //   const base64Image = await fetch(selectedImage)
  //     .then((response) => response.blob())
  //     .then((blob) => new Promise((resolve) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => resolve(reader.result.split(",")[1]);
  //       reader.readAsDataURL(blob);
  //     }));

  //   const requestPayload = {
  //     requests: [
  //       {
  //         image: { content: base64Image },
  //         features: [{ type: mode === "text" ? "TEXT_DETECTION" : "LABEL_DETECTION" }],
  //       },
  //     ],
  //   };

  //   try {
  //     const response = await fetch(
  //       `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(requestPayload),
  //       }
  //     );
  //     const data = await response.json();
  //     handleApiResponse(data, mode);
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to process image.");
  //   }
  // };

  // Function to handle API response
  // const handleApiResponse = (data, mode) => {
  //   if (mode === "text") {
  //     const textAnnotations = data.responses[0]?.textAnnotations || [];
  //     Alert.alert("Detected Text", textAnnotations.length ? textAnnotations[0].description : "No text found.");
  //   } else {
  //     const labels = data.responses[0]?.labelAnnotations || [];
  //     Alert.alert(
  //       "Detected Ingredients",
  //       labels.length ? labels.map((label) => label.description).join(", ") : "No ingredients found."
  //     );
  //   }
  // };

  return (
    <View style={styles.container}>
      {/* {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />} */}
      <CameraButton emoji={<MaterialIcons name="center-focus-weak" size={28}/>} onPress={pickImage} />
      <SelectionPopup visible={popupVisible} onSelect={processImage} onClose={() => setPopupVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 300, height: 300, marginBottom: 10, borderRadius: 10 },
});

export default ImageProcessing;
