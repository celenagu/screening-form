// app/index.js

import React from "react";
import {Image} from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Alert, Pressable, Platform, Button, TouchableOpacity, ImageBackground} from 'react-native';
import MenuButton from '../components/menu_button';


import { Link, Stack, useRouter} from 'expo-router';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default function App() {
  const router = useRouter();

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
  const onHistory = () =>{
    router.push({
      pathname: "./screens/history/history"
    });
  }


  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Stack.Screen options = {{
        title: '',
        headerStyle: {
          backgroundColor: '#EEEEEE'
      }
      }}/>

       <Image source={require('../assets/uhn-logo-with-michener.png')}
        style={styles.logo}
        resizeMode="contain"
        />
      <View style={styles.optionsContainer}>
      <Text style={styles.title}>MRI Safety Screening Form</Text>
          <MenuButton label="START" theme="start" onPress={onStart}/>
          <MenuButton label="HISTORY" onPress ={onHistory}/>
          <MenuButton label="SETTINGS" onPress={onSettings}/>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1, 
    backgroundColor: 'white',
  },
  headerContainer:{
    alignSelf: 'stretch',
    backgroundColor: 'lightblue',
    alignItems: 'center',
    padding: 15, // Add padding for better spacing
  },
  logo: {
    width: 300, // Set width
    height: 100, // Set height, 
    marginTop: 50
  },
  bodyContainer: { // New container for the body content
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 70, // Adjust font size if needed
    marginBottom: 60, // Add margin for spacing
    marginHorizontal: 50,
    marginTop: -100,
    color: "#23507D",
    fontWeight: '700'
  },
  optionsContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column', // Arrange buttons horizontally
    justifyContent: 'center', // Space buttons evenly
    width: '100%', // Adjust width as needed
  },
});