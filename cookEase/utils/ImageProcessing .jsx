import React, { useState } from "react";
import { View, Image, Alert, StyleSheet,TouchableOpacity,Text } from "react-native";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import * as ImagePicker from 'expo-image-picker';
import CameraButton from "../components/p-components/CameraBtn";
import SelectionPopup from "../components/p-components/SelectionPopup";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';


const ImageProcessing = () => {
  
  const [imageUri, setImageUri] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [labels, setLabels] = useState([]);


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
      mediaTypes: ['images'],
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

const analyzeImage = async () => {
  try{

    if(!imageUri){
      alert("Please select an image first!");
      return;
    }

//    console.log("API URL:", Constants.expoConfig?.extra?.VISION_API_KEY); // ✅ Log to check env values
    const apiKey = Constants.expoConfig?.extra?.VISION_API_KEY;    
    const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    //READ THE IMAGE FILE FROM LOCAL uri and convert it to base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64
    });

    const requestData = {
      requests: [
        {
          image: {
            content: base64
          },
          features: [
            {
              type: "LABEL_DETECTION",
              maxResults: 5
            }
          ]
        }
      ]
    };

    //send our data to the API
    const apiResponse = await axios.post(apiURL, requestData);
    setLabels(apiResponse.data.responses[0].labelAnnotations);
  }
  catch(error){
    console.log('Error analyzing image:',error);
    alert("An error occurred. Please try again later.");
  }
}

  return (
    <View style={styles.container}>
      {imageUri && 
        <Image 
          source={{ uri: imageUri }}
          style={styles.image} 
        />
      }

      <CameraButton emoji={<MaterialIcons name="center-focus-weak" size={28}/>} onPress={()=> setPopupVisible(true)} />

      <SelectionPopup 
        visible={popupVisible} 
        onSelect={pickImage} 
        onClose={() => setPopupVisible(false)} 
        emojiOne={<MaterialCommunityIcons name="package-variant" size={27}/>}
        emojiTwo={<MaterialCommunityIcons name="carrot" size={29}/>}
      />

      <TouchableOpacity style={styles.button} onPress={analyzeImage}>
        <Text style={styles.buttonText}>Analyze Image</Text>
      </TouchableOpacity>
      {
        labels.length > 0 && (
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>Labels:</Text>
            {labels.map((label, index) => (
              <Text key={index} style={{fontSize: 16}}>{label.description}</Text>
            ))}
          </View>
        )
      }
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
