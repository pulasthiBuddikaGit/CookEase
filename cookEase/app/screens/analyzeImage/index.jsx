import React, { useState } from "react";
import { View, StyleSheet,Image,TouchableOpacity,Text, ScrollView, Pressable } from "react-native";
import { useSelector,useDispatch } from "react-redux";
import { addIngredients, setLabels, setTexts, clearLabels } from "../../../redux/p-slices/imageProcessingSlice"
import * as FileSystem from 'expo-file-system';
import axios from "axios";
import Constants from 'expo-constants';
import { useRouter } from "expo-router";


const analyzeImage = () => {
  const dispatch = useDispatch();
  const { imageUri, scanType, labels, texts } = useSelector((state) => state.imageProcessing);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);

  const router = useRouter();
  
  const toggleLabel = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter(item => item !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleSubmit = () => {
    if (selectedLabels.length < 1) {
      alert("Please select at least two ingredients.");
      return;
    }
    // Navigate to recipeInput screen with ingredients
    // Add selected ingredients to redux store
    dispatch(addIngredients(selectedLabels));
    router.push('/screens/RecipeInput');
    
    // Clear labels after submission
    dispatch(clearLabels());
  };

  const analyzeImageFunction = async (uri) => {
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}  contentContainerStyle={styles.scrollViewContainer}>
        {imageUri && 
          <Image 
            source={{ uri: imageUri }}
            style={styles.image} 
            resizeMode="contain"
          />
        }
        <TouchableOpacity style={styles.button} onPress={()=>analyzeImageFunction(imageUri)}>
          <Text style={styles.buttonText}>Analyze Image</Text>
        </TouchableOpacity>

        {scanType === 'ingredient' && labels.length > 0 && (
        <View>
          <Text style={styles.heading}>Select Ingredients:</Text>
          {labels.map((label, index) => {
            const isSelected = selectedLabels.includes(label.description);
            return (
              <Pressable
                key={index}
                onPress={() => toggleLabel(label.description)}
                style={[
                  styles.labelItem,
                  isSelected && styles.labelItemSelected
                ]}
              >
                <Text>
                  {label.description} ({Math.round(label.score * 100)}%)
                </Text>
              </Pressable>
            );
          })}
          <Pressable onPress={handleSubmit} style={styles.submitBtn}>
            <Text style={styles.submitText}>Next</Text>
          </Pressable>
        </View>
      )}

        {scanType === 'package' && texts.length > 0 && (
          <View>
            <Text style={styles.textHeading}>Package Text:</Text>
            {texts[0] && (  // The first element contains the full text
              <Text style={styles.resultText}>{texts[0].description}</Text>
            )}
            <Text style={{fontSize: 18, fontWeight: 'bold', marginTop: 10}}>Text Blocks:</Text>
            {texts.slice(1).map((text, index) => (  // Skip the first element which is the full text
              <Text key={index} style={{fontSize: 14}}>
                {text.description}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      justifyContent: "center", 
      alignItems: "center", 
      backgroundColor: "#D4EDDA" 
    },
    image: {
      width: 300,
      height: 460,
      marginBottom: 5,
    },
    button: {
      backgroundColor: "#4caf50",
      padding: 10,
      borderRadius: 8,
      width: "70%",
      alignItems: "center",
      marginVertical: 5,
    },
    buttonText: {
      color: "black",
      fontSize: 17,
      fontWeight: "bold",
    },
    textHeading:{
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 20,
    },
    resultText:{
      fontSize: 16,
      marginTop: 5,
    },
    resultTextBottom:{
      marginBottom: 30,
    },
    scrollView: {
      padding: 10,
    },
    scrollViewContainer: {
      alignItems: "center",
    },

    heading: { 
      fontSize: 18,
      fontWeight: 'bold', 
      marginBottom: 10,
      marginTop: 20, 
    },
    labelItem: {
      padding: 8,
      marginVertical: 4,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      backgroundColor: '#f9f9f9',
    },
    labelItemSelected: {
      backgroundColor: '#d0f0c0',
      borderColor: '#4caf50',
    },
    submitBtn: {
      backgroundColor: '#4caf50',
      padding: 12,
      marginTop: 16,
      marginBottom:30,
      borderRadius: 6,
      alignItems: 'center',
    },
    submitText: {
      color: '#fff',
      fontWeight: 'bold',
    }
});

export default analyzeImage;
