import { Redirect } from 'expo-router';

//In Expo Router, if a folder contains an index.js file, it becomes the default screen for that route.
//So this is the default screen for the / route.(entry screen)
export default function Index() {
  return <Redirect href="/auth" />;
}