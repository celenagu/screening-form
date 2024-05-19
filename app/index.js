import React from 'react';
import {Image} from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Alert, Pressable, Platform, Button, TouchableOpacity, ImageBackground} from 'react-native';
import MenuButton from '../components/menu_button';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
// import {vw, vh} from 'react-native-viewport-units';

export default function App() {

  const onStart = () =>{
    alert("Start was pressed");
  }
  const onSettings = () =>{
    alert("Settings was pressed");
  }
  const onSearch = () =>{
    alert("Search was pressed");
  }


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.headerContainer}>
        <Image source={require('../assets/uhn-logo-with-michener.png')}
          style={styles.logo}
          resizeMode="contain"/>
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.title}>Patient Screening Form</Text>
        
      </View>
      <View style={styles.optionsContainer}>
          <MenuButton label="START" theme="start" onPress={onStart}/>
          <MenuButton label="SETTINGS"  onPress={onSettings}/>
          <MenuButton label="SEARCH" onPress ={onSearch}/>
      </View>

      



      
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     fontSize: 40,
//     textAlign: 'center',
//     fontWeight: 'bold',
//     backgroundColor: '#f0f8ff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
  
//   logo:{
//     // flex: 5,
//     width: '50%',
//     height: '20%',
//     // marginTop: '-20%',
//     justifyContent: 'center',
//     alignItems:'center',
//     // backgroundColor: 'red',
//   },
//    title:{
//     flexDirection: 'column',
//     // flex: 1,
//     height: '10%',
//     fontSize: 40,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   footerContainer: {
//     backgroundColor: 'red',
//     // flex: 1/3,
//     alignItems: 'center',
//   },
//   optionsContainer: {
//     width:'30%',
//     // flex:,
//     position: 'center',
//     backgroundColor: 'blue',
//     justifyContent:'center',
//     // bottom: 80,
//   },
//   headerContainer:{
//     padding: 20,
//     // flex: 1/3,
//     color: 'red',
//   },
// });

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1, 
    backgroundColor: '#f0f8ff',
  },
  headerContainer:{
    alignSelf: 'stretch',
    backgroundColor: 'lightblue',
    alignItems: 'center',
    padding: 15, // Add padding for better spacing
  },
  logo: {
    width: 200, // Set width
    height: 100, // Set height
  },
  bodyContainer: { // New container for the body content
    flex: 1,
    backgroundColor: 'pink',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 80, // Adjust font size if needed
    marginBottom: 20, // Add margin for spacing
  },
  optionsContainer: {
    flex: 3,
    backgroundColor: 'plum',
    flexDirection: 'column', // Arrange buttons horizontally
    justifyContent: 'center', // Space buttons evenly
    width: '100%', // Adjust width as needed
  },
});