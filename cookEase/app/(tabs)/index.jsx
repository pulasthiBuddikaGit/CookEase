import { View, Text, Button, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../../redux/p-slices/counterSlice";

export default function Index() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <View style={styles.centered}>
      <Text>Counter: {count}</Text>
      <View style={styles.buttonContainer}>
        <Button  title="Increment" onPress={() => dispatch(increment())} style={styles.btn}/>
        <Button title="Decrement" onPress={() => dispatch(decrement())}  style={styles.btn}/>

        <TouchableOpacity onPress={() => dispatch(increment())} style={styles.btn}>
          <Text style={styles.btnText}>Just to test responsiveness</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

//take the app running device screen's width and height
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 5
  },
  btn:{
    width: width * 0.8, // 90% of screen width
    height: height * 0.2, // 30% of screen height
    backgroundColor: "#007AFF", // iOS Blue
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

// app/(tabs)/auth-test.jsx
// import { SafeAreaView } from 'react-native';
// import FirebaseAuthTest from '../../components/FirebaseAuthTest';

// export default function AuthTestScreen() {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <FirebaseAuthTest />
//     </SafeAreaView>
//   );
// }