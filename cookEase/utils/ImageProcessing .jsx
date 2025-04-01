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
      allowsEditing: true,
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
        aspect: [4, 3],
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
    //dispatch(setPopupVisible(true));
    // analyzeImage(result.assets[0].uri);
    }
  }catch(error){
    console.log('Error handling image result:',error);
    alert("An error occurred. Please try again later.");
  }
};

const analyzeImage = async (uri) => {
  try{
    if(!uri){
      alert("Please select an image first!");
      return;
    }
    if (!scanType) {
      alert("Please select a scan type first!");
      return;
    }

    console.log("API URL:", Constants.expoConfig?.extra?.VISION_API_KEY); // ✅ Log to check env values
    const apiKey = Constants.expoConfig?.extra?.VISION_API_KEY;    
    const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    //READ THE IMAGE FILE FROM LOCAL uri and convert it to base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64
    });

    const featureType = scanType === 'package' ? 'TEXT_DETECTION' : 'LABEL_DETECTION';

    const requestData = {
      requests: [
        {
          image: {
            content: base64
          },
          features: [
            {
              maxResults: 5,
              type: featureType,
            }
          ]
        }
      ]
    };

    //send our data to the API
    const apiResponse = await axios.post(apiURL, requestData);

    console.log("API Response of LABEL:", apiResponse.data.responses[0].labelAnnotations || []);
    console.log("API Response of INGREDIANT:", apiResponse.data.responses[0].textAnnotations || []);

    //labels and texts are global states
    setLabels(apiResponse.data.responses[0].labelAnnotations);
    if(scanType === 'package'){
      dispatch(setTexts(apiResponse.data.responses[0].textAnnotations || []));
    }
    else{
      dispatch(setLabels(apiResponse.data.responses[0].labelAnnotations || []))
    }


  }
  catch(error){
    console.log('Error analyzing image:',error);
    alert("An error occurred. Please try again later.");
  }
}

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

      {imageUri && 
        <Image 
          source={{ uri: imageUri }}
          style={styles.image} 
        />
      }

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

      <TouchableOpacity style={styles.button} onPress={()=>analyzeImage(imageUri)}>
        <Text style={styles.buttonText}>Analyze Image</Text>
      </TouchableOpacity>
      
      {/* Display results based on scan type */}
      {scanType === 'ingredient' && labels.length > 0 && (
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Ingredients Detected:</Text>
          {labels.map((label, index) => (
            <Text key={index} style={{fontSize: 16}}>
              {label.description} ({Math.round(label.score * 100)}%)
            </Text>
          ))}
        </View>
      )}

      {scanType === 'package' && texts.length > 0 && (
        <View style={{marginTop: 20}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Package Text:</Text>
          {texts[0] && (  // The first element contains the full text
            <Text style={{fontSize: 16}}>{texts[0].description}</Text>
          )}
          <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Text Blocks:</Text>
          {texts.slice(1).map((text, index) => (  // Skip the first element which is the full text
            <Text key={index} style={{fontSize: 14}}>
              {text.description}
            </Text>
          ))}
        </View>
      )}
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
