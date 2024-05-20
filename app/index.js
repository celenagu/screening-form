// app/index.js

import React from "react";
import {Image} from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Alert, Pressable, Platform, Button, TouchableOpacity, ImageBackground} from 'react-native';
import MenuButton from '../components/menu_button';


import { Link, Stack, useRouter} from 'expo-router';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
// import {vw, vh} from 'react-native-viewport-units';

export default function App() {
  const router = useRouter();
  // const { setTitle } = useContext(HeaderContext);

  const onStart = () =>{
    router.push({
      pathname: "./screens/start"
    });
  }
  const onSettings = () =>{
    router.push({
      pathname: "./screens/settings"
    });
  }
  const onSearch = () =>{
    router.push({
      pathname: "./screens/search"
    });
  }


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Stack.Screen options = {{
        title: 'Home'
      }}/>

      <View style={styles.bodyContainer}>
        <Text style={styles.title}>Patient Screening Form</Text>
        
      </View>
      <View style={styles.optionsContainer}>
          <MenuButton label="START" theme="start" onPress={onStart}/>
          <MenuButton label="SETTINGS" onPress={onSettings}/>
          <MenuButton label="SEARCH" onPress ={onSearch}/>
      </View>


    </View>
  );
}

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