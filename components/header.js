//components/Header.js

//NOT CURRENTLY USED 

import { Link, useLocalSearchParams } from "expo-router";
import React, {useContext, useState} from "react";
import { View, Text, StyleSheet, Image , TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons"; 

const Header = () => {
    
    // const isHomeScreen = false; // Determine if is home screen

    // if (title = "Home"){
    //     isHomeScreen = true;
    // }

    // const goBack = () => {

    // }

    return (
        <View style={styles.header}>
            <Image source={require('../assets/uhn-logo-with-michener.png')}
                style={styles.logo}
                resizeMode="contain"/>


        </View>
    );
};

// { isHomeScreen ? (
//     <Image source={require('../assets/uhn-logo-with-michener.png')}
//     style={styles.logo}
//     resizeMode="contain"/>
// ) : (
//     <View>            
//         <TouchableOpacity style={styles.backButton} onPress={goBack}>
//             <Ionicons name="chevron-back" size={24} color="black" /> {/* Add back icon */}
//         </TouchableOpacity>
//         <Text style={styles.title}>
//             {title}
//         </Text>
//     </View>
// )

//     }

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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {

  },
  title:{

  }
});

export default Header; 