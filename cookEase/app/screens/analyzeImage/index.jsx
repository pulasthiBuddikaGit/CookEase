// import React, { useState } from "react";
// import { View, StyleSheet,Image,TouchableOpacity,Text, ScrollView, Pressable } from "react-native";
// import { useSelector,useDispatch } from "react-redux";
// import { addIngredients, setLabels, setTexts, clearLabels, clearTexts } from "../../../redux/p-slices/imageProcessingSlice"
// import * as FileSystem from 'expo-file-system';
// import axios from "axios";
// import Constants from 'expo-constants';
// import { useRouter } from "expo-router";


// const analyzeImage = () => {
//   const dispatch = useDispatch();
//   const { imageUri, scanType, labels, texts } = useSelector((state) => state.imageProcessing);
//   const [selectedLabels, setSelectedLabels] = useState([]);
//   const [selectedTexts, setSelectedTexts] = useState([]);

//   const router = useRouter();
  
//   const toggleLabel = (label) => {
//     if (selectedLabels.includes(label)) {
//       setSelectedLabels(selectedLabels.filter(item => item !== label));
//     } else {
//       setSelectedLabels([...selectedLabels, label]);
//     }
//   };

//   const toggleText = (text) => {
//     if (selectedTexts.includes(text)) {
//       setSelectedTexts(selectedTexts.filter(t => t !== text));
//     } else {
//       setSelectedTexts([...selectedTexts, text]);
//     }
//   };

//   const handleSubmit = () => {
//     if (selectedLabels.length < 1) {
//       alert("Please select at least two ingredients.");
//       return;
//     }
//     // Navigate to recipeInput screen with ingredients
//     // Add selected ingredients to redux store
//     dispatch(addIngredients(selectedLabels));
//     router.push('/screens/RecipeInput');
    
//     // Clear labels after submission
//     dispatch(clearLabels());
//   };  

//   const handlePackageSubmit = () => {
//     if (selectedTexts.length < 1) {
//       alert("Please select at least two ingredients.");
//       return;
//     }
//     // Navigate to recipeInput screen with ingredients
//     // Add selected ingredients to redux store
//     dispatch(addIngredients(selectedTexts));
//     router.push('/screens/RecipeInput');
    
//     // Clear texts after submission
//     dispatch(clearTexts());
//   };

//   const analyzeImageFunction = async (uri) => {
//     try{
//       if(!uri){
//         alert("Please select an image first!");
//         return;
//       }
//       if (!scanType) {
//         alert("Please select a scan type first!");
//         return;
//       }
  
//       console.log("API URL:", Constants.expoConfig?.extra?.VISION_API_KEY); // ✅ Log to check env values
//       const apiKey = Constants.expoConfig?.extra?.VISION_API_KEY;    
//       const apiURL = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
  
//       //READ THE IMAGE FILE FROM LOCAL uri and convert it to base64
//       const base64 = await FileSystem.readAsStringAsync(imageUri, {
//         encoding: FileSystem.EncodingType.Base64
//       });
  
//       const featureType = scanType === 'package' ? 'TEXT_DETECTION' : 'LABEL_DETECTION';
  
//       const requestData = {
//         requests: [
//           {
//             image: {
//               content: base64
//             },
//             features: [
//               {
//                 maxResults: 5,
//                 type: featureType,
//               }
//             ]
//           }
//         ]
//       };
  
//       //send our data to the API
//       const apiResponse = await axios.post(apiURL, requestData);
  
//       console.log("API Response of LABEL:", apiResponse.data.responses[0].labelAnnotations || []);
//       console.log("API Response of INGREDIANT:", apiResponse.data.responses[0].textAnnotations || []);
  
//       //labels and texts are global states
//       setLabels(apiResponse.data.responses[0].labelAnnotations);
//       if(scanType === 'package'){
//         dispatch(setTexts(apiResponse.data.responses[0].textAnnotations || []));
//       }
//       else{
//         dispatch(setLabels(apiResponse.data.responses[0].labelAnnotations || []))
//       }
  
  
//     }
//     catch(error){
//       console.log('Error analyzing image:',error);
//       alert("An error occurred. Please try again later.");
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollView}  contentContainerStyle={styles.scrollViewContainer}>
//         {imageUri && 
//           <Image 
//             source={{ uri: imageUri }}
//             style={styles.image} 
//             resizeMode="contain"
//           />
//         }
//         <TouchableOpacity style={styles.button} onPress={()=>analyzeImageFunction(imageUri)}>
//           <Text style={styles.buttonText}>Analyze Image</Text>
//         </TouchableOpacity>

//         {scanType === 'ingredient' && labels.length > 0 && (
//         <View>
//           <Text style={styles.heading}>Select Ingredients:</Text>
//           {labels.map((label, index) => {
//             const isSelected = selectedLabels.includes(label.description);
//             return (
//               <Pressable
//                 key={index}
//                 onPress={() => toggleLabel(label.description)}
//                 style={[
//                   styles.labelItem,
//                   isSelected && styles.labelItemSelected
//                 ]}
//               >
//                 <Text>
//                   {label.description} ({Math.round(label.score * 100)}%)
//                 </Text>
//               </Pressable>
//             );
//           })}
//           <Pressable onPress={handleSubmit} style={styles.submitBtn}>
//             <Text style={styles.submitText}>Next</Text>
//           </Pressable>
//         </View>
//       )}

//       {scanType === 'package' && texts.length > 0 && (
//         <View>
//           <View style={styles.packageTextContainer}>
//             <Text style={styles.selectTextHeading}>Package Text:</Text>
//             {texts[0] && (
//               <Text style={styles.packageText}>{texts[0].description}</Text>
//             )}
//           </View>

//           <Text style={styles.selectTextBlockHeading}>Tap to Select Text Blocks:</Text>
//           <View style={styles.textBlocksContainer}>
//             {texts.slice(1).map((text, index) => {
//               const isSelected = selectedTexts.includes(text.description);
//               return (
//                 <Pressable
//                   key={index}
//                   onPress={() => toggleText(text.description)}
//                   style={[
//                     styles.textItem,
//                     isSelected && styles.textItemSelected
//                   ]}
//                 >
//                   <Text numberOfLines={1} style={styles.textLabel}>
//                     {text.description}
//                   </Text>
//                 </Pressable>
//               );
//             })}
//           </View>

//           <Pressable onPress={handlePackageSubmit} style={styles.submitPackageBtn}>
//             <Text style={styles.submitText}>Next</Text>
//           </Pressable>
//         </View>
//       )}

//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//     container: { 
//       flex: 1, 
//       justifyContent: "center", 
//       alignItems: "center", 
//       backgroundColor: "#D4EDDA" 
//     },
//     image: {
//       width: 300,
//       height: 460,
//       marginBottom: 5,
//     },
//     button: {
//       backgroundColor: "#4caf50",
//       padding: 10,
//       borderRadius: 8,
//       width: "70%",
//       alignItems: "center",
//       marginVertical: 5,
//     },
//     buttonText: {
//       color: "black",
//       fontSize: 17,
//       fontWeight: "bold",
//     },

//     resultTextBottom:{
//       marginBottom: 30,
//     },
//     scrollView: {
//       padding: 10,
//     },
//     scrollViewContainer: {
//       alignItems: "center",
//     },

//     heading: { 
//       fontSize: 18,
//       fontWeight: 'bold', 
//       marginBottom: 10,
//       marginTop: 20, 
//     },
//     labelItem: {
//       padding: 8,
//       marginVertical: 4,
//       borderWidth: 1,
//       borderColor: '#ccc',
//       borderRadius: 6,
//       backgroundColor: '#f9f9f9',
//     },
//     labelItemSelected: {
//       backgroundColor: '#d0f0c0',
//       borderColor: '#4caf50',
//     },

//     submitBtn: {
//       backgroundColor: '#4caf50',
//       padding: 12,
//       marginTop: 16,
//       marginBottom:30,
//       borderRadius: 6,
//       alignItems: 'center',
//     },
//     submitText: {
//       color: '#fff',
//       fontWeight: 'bold',
//     },

//     selectTextBlockHeading: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginTop: 10,
//       marginBottom: 10,
//     },
    
//     textBlocksContainer: {
//       flexDirection: 'row',
//       flexWrap: 'wrap',
//       justifyContent: 'flex-start',
//       marginBottom: 20,
//     },
    
//     textItem: {
//       paddingVertical: 6,
//       paddingHorizontal: 10,
//       margin: 6,
//       backgroundColor: '#eee',
//       borderRadius: 8,
//       maxWidth: '45%',
//       flexGrow: 1,
//       flexShrink: 1,
//       alignSelf: 'flex-start',
//       borderWidth: 1,
//       borderColor: '#ccc',
//     },
    
//     textItemSelected: {
//       backgroundColor: '#b3e5fc', // Light blue
//       borderColor: '#0288d1',     // Darker border when selected
//     },
    
//     textLabel: {
//       fontSize: 14,
//       color: '#333',
//     },

//     submitPackageBtn: {
//       backgroundColor: '#4caf50',
//       padding: 12,
//       marginTop: 1,
//       marginBottom: 30,
//       borderRadius: 6,
//       alignItems: 'center',
//       alignSelf: 'center',
//       width: '70%',
//     },

//     packageTextContainer: {
//       alignItems: 'center',
//       paddingHorizontal: 5,
//       marginBottom: 8,
//     },

//     packageText: {
//       fontSize: 16,
//       textAlign: 'center',
//       color: '#333',
//       marginTop: 5,
//       maxWidth: 300,
//     },
    
//     selectTextHeading: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       textAlign: 'left',
//       paddingTop: 10,
//       paddingBottom: 1,
//       color: '#000',
//       width: '100%'  //why I make this child element full width?so it can respect textAlign: 'left'.
//     },    
    
// });

// export default analyzeImage;



import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { addIngredients, setLabels, setTexts, clearLabels, clearTexts } from "../../../redux/p-slices/imageProcessingSlice";
import * as FileSystem from 'expo-file-system';
import axios from "axios";
import Constants from 'expo-constants';
import { useRouter } from "expo-router";

const analyzeImage = () => {
  const dispatch = useDispatch();
  const { imageUri, scanType, labels, texts } = useSelector((state) => state.imageProcessing);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // loading state

  const router = useRouter();
  
  const toggleLabel = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter(item => item !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const toggleText = (text) => {
    if (selectedTexts.includes(text)) {
      setSelectedTexts(selectedTexts.filter(t => t !== text));
    } else {
      setSelectedTexts([...selectedTexts, text]);
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

  const handlePackageSubmit = () => {
    if (selectedTexts.length < 1) {
      alert("Please select at least two ingredients.");
      return;
    }
    // Navigate to recipeInput screen with ingredients
    // Add selected ingredients to redux store
    dispatch(addIngredients(selectedTexts));
    router.push('/screens/RecipeInput');
    
    // Clear texts after submission
    dispatch(clearTexts());
  };

  const analyzeImageFunction = async (uri) => {
    try {
      if(!uri) {
        alert("Please select an image first!");
        return;
      }
      if (!scanType) {
        alert("Please select a scan type first!");
        return;
      }
      
      setIsLoading(true);

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
      if(scanType === 'package') {
        dispatch(setTexts(apiResponse.data.responses[0].textAnnotations || []));
      } else {
        dispatch(setLabels(apiResponse.data.responses[0].labelAnnotations || []));
      }
      
      setIsLoading(false);

    } catch(error) {
      console.log('Error analyzing image:', error);
      alert("An error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  // Skeleton loader component for labels
  const LabelSkeleton = () => (
    <View>
      <View style={styles.skeletonHeading} />
      {[1, 2, 3, 4, 5].map((_, index) => (
        <View key={index} style={styles.skeletonLabelItem} />
      ))}
      <View style={styles.skeletonSubmitBtn} />
    </View>
  );

  // Skeleton loader component for package text
  const PackageSkeleton = () => (
    <View>
      <View style={styles.skeletonHeading} />
      <View style={styles.skeletonPackageText} />
      <View style={styles.skeletonHeading} />
      <View style={styles.textBlocksContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
          <View key={index} style={styles.skeletonTextItem} />
        ))}
      </View>
      <View style={styles.skeletonSubmitBtn} />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        {imageUri && 
          <Image 
            source={{ uri: imageUri }}
            style={styles.image} 
            resizeMode="contain"
          />
        }
        {/* new */}
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]} 
          onPress={() => !isLoading && analyzeImageFunction(imageUri)}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? "Analyzing..." : "Analyze Image"}</Text>
        </TouchableOpacity>
        
        {/* new */}
        {isLoading && scanType === 'ingredient' && <LabelSkeleton />}
        {isLoading && scanType === 'package' && <PackageSkeleton />}

        {!isLoading && scanType === 'ingredient' && labels.length > 0 && (
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

        {!isLoading && scanType === 'package' && texts.length > 0 && (
          <View>
            <View style={styles.packageTextContainer}>
              <Text style={styles.selectTextHeading}>Package Text:</Text>
              {texts[0] && (
                <Text style={styles.packageText}>{texts[0].description}</Text>
              )}
            </View>

            <Text style={styles.selectTextBlockHeading}>Tap to Select Text Blocks:</Text>
            <View style={styles.textBlocksContainer}>
              {texts.slice(1).map((text, index) => {
                const isSelected = selectedTexts.includes(text.description);
                return (
                  <Pressable
                    key={index}
                    onPress={() => toggleText(text.description)}
                    style={[
                      styles.textItem,
                      isSelected && styles.textItemSelected
                    ]}
                  >
                    <Text numberOfLines={1} style={styles.textLabel}>
                      {text.description}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable onPress={handlePackageSubmit} style={styles.submitPackageBtn}>
              <Text style={styles.submitText}>Next</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#A5D6A7", // lighter green
    opacity: 0.7,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  labelItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  labelItemSelected: {
    backgroundColor: "#e8f5e9",
    borderColor: "#4CAF50",
  },
  submitBtn: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  packageTextContainer: {
    marginBottom: 20,
  },
  selectTextHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  packageText: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    fontSize: 14,
  },
  selectTextBlockHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  textBlocksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  textItem: {
    padding: 10,
    margin: 5,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    width: "46%",
  },
  textItemSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196F3",
  },
  textLabel: {
    fontSize: 14,
  },
  submitPackageBtn: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  // Skeleton styles
  skeletonHeading: {
    height: 24,
    width: "60%",
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 15,
  },
  skeletonLabelItem: {
    height: 50,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  skeletonSubmitBtn: {
    height: 50,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginTop: 20,
  },
  skeletonPackageText: {
    height: 150,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 20,
  },
  skeletonTextItem: {
    height: 44,
    margin: 5,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
    width: "46%",
  },
});

export default analyzeImage;
