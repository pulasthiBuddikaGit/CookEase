import React, { useState } from "react";
import { View, Image, Alert, StyleSheet } from "react-native";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import * as ImagePicker from 'expo-image-picker';
import CameraButton from "../components/p-components/CameraBtn";
import SelectionPopup from "../components/p-components/SelectionPopup";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";


const ImageProcessing = () => {
  
  const [imageUri, setImageUri] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);


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
  //image processing has to be done here
};


  return (
    <View style={styles.container}>
      {/* {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />} */}

      <CameraButton emoji={<MaterialIcons name="center-focus-weak" size={28}/>} onPress={()=> setPopupVisible(true)} />

      <SelectionPopup 
        visible={popupVisible} 
        onSelect={pickImage} 
        onClose={() => setPopupVisible(false)} 
        emojiOne={<MaterialCommunityIcons name="package-variant" size={27}/>}
        emojiTwo={<MaterialCommunityIcons name="carrot" size={29}/>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 300, height: 300, marginBottom: 10, borderRadius: 10 },
});

export default ImageProcessing;
