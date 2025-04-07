import React, { useState } from "react";
import { View, Image, Alert, StyleSheet,TouchableOpacity,Text } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import CameraButton from "../components/p-components/CameraBtn";
import SelectionPopup from "../components/p-components/SelectionPopup";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import {
  setImageUri,
  setLabels,
  setTexts,
  setScanType,
  setPopupVisible,
} from '../redux/p-slices/imageProcessingSlice';
import { useDispatch, useSelector } from "react-redux";


const ImageProcessing = () => { 
  // const [imageUri, setImageUri] = useState(null);
  // const [popupVisible, setPopupVisible] = useState(false);
  // const [labels, setLabels] = useState([]);
  const dispatch = useDispatch();
  const { imageUri, popupVisible, scanType, labels, texts } = useSelector((state) => state.imageProcessing);

  const router = useRouter();

const pickImage = async () => {
  try{  
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
  }catch(error){
    console.log('Error picking image:',error);
    alert("An error occurred. Please try again later.");
  }
};

const openCamera = async () => {
  try{      
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access camera is required!");
      return;
    }
  
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images','videos'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log(result);
    handleImageResult(result);
  }catch(error){
    console.log('Error opening camera:',error);
    alert("An error occurred. Please try again later.");
  }

};
  
const openGallery = async () => {
  try{
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
        alert("Permission to access gallery is required!");
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        aspect: [4, 3], //his only works when allowsEditing: true
        quality: 1,
    });

    console.log(result);
    handleImageResult(result);
  }catch(error){
    console.log('Error opening gallery:',error);
    alert("An error occurred. Please try again later.");
  }
};
  
// Function to handle the selected image
const handleImageResult = (result) => {
  try{  
    if (!result.canceled && result.assets) {
    dispatch(setImageUri(result.assets[0].uri));
    router.push('screens/analyzeImage');
    //dispatch(setPopupVisible(true));
    }
  }catch(error){
    console.log('Error handling image result:',error);
    alert("An error occurred. Please try again later.");
  }
};

const handleSelection = (type) => {
  try{
    dispatch(setScanType(type));
    console.log("Selected scan type:", type);
    dispatch(setPopupVisible(false));
    pickImage();
  }
  catch(error){
    console.log('Error selecting scan type:',error);
    alert("An error occurred. Please try again later.");
  }
};

return (
  <View style={styles.container}>

      <CameraButton 
        emoji={<MaterialIcons name="center-focus-weak" size={28}/>} 
        onPress={()=> dispatch(setPopupVisible(true))} 
      />

      <SelectionPopup 
        visible={popupVisible} 
        onSelect={handleSelection} 
        onClose={() => dispatch(setPopupVisible(false))} 
        emojiOne={<MaterialCommunityIcons name="package-variant" size={27}/>}
        emojiTwo={<MaterialCommunityIcons name="carrot" size={29}/>}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 300, height: 300, marginBottom: 10, borderRadius: 10 },
  button: {
    backgroundColor: "#00C000",
    padding: 10,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ImageProcessing;
