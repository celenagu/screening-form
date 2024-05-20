// app/_layout.js
import { Stack } from 'expo-router';
import {Image, StyleSheet} from 'react-native';


function LogoTitle() {
  return (
    <Image source={require('../assets/uhn-logo-with-michener.png')}
        style={styles.logo}
        resizeMode="contain"/>
  );
}

export default function Layout() {
  return <Stack 
    screenOptions={{ 
      headerTitle: props => <LogoTitle {...props} />,
      headerTitleAlign: 'center',
    }} 
  
  
  />;
}

const styles = StyleSheet.create({
  logo: {
      width: 200, // Set width
      height: 100, // Set height
  },
  header:{
  alignSelf: 'stretch',
  backgroundColor: 'lightblue',
  alignItems: 'center',
  padding: 15,
  },
});