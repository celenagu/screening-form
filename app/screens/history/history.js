// Search / View Database
import React, { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, Alert, ActivityIndicator, TouchableOpacity, TextInput, Touchable} from 'react-native';
import { Stack, useRouter } from 'expo-router'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// To interact with backend
import axios from "axios";
import { Searchbar, } from 'react-native-paper';

//Passcode protection
import { DEFAULT_PASSCODE } from '@env';
import * as Keychain from 'react-native-keychain';

export default function History() {
  const [surveyData, setSurveyData] = useState([]);
  const [responses, setResponses] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const router = useRouter();

  const onSelect = (responseId) =>{
    router.push({
      pathname: "./viewForm",
      params: {responseId},
    });
  }



  // Triggers fetching survey
  useEffect (() => {
    fetchResponses();
    console.log(DEFAULT_PASSCODE);
  }, []);


  const handlePasscodeSubmit = () => {
    console.log(enteredPasscode);
    if (enteredPasscode === DEFAULT_PASSCODE) {
      setIsLocked(false);
      fetchResponses();
    } else {
      Alert.alert('Incorrect passcode');
    }
  };


  // Handles fetching of survey from client
  const fetchResponses = async () => {
    try{
      setIsLoading(true);
      const response = await axios.get(
      'http://192.168.2.71:8000/responses/users', {timeout: 5000}
      );
      if (response.status === 200){
        const responses = response.data;

        setResponses(responses);
        console.log(JSON.stringify(responses, null, 2));
      }
      else{
        throw new Error('Failed to fetch responses. Error:' + response.status)
      }
    } catch (err) {
      Alert.alert(
        "An error occured while fetching responses."
      )
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("refresh");

  const convertTime = (isoDateString) => {
    const date = new Date(isoDateString);

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC'
    };

    const readableDateString = date.toLocaleString('en-US', options);
    return readableDateString;
  }

  // Locked screen superimposed on loading
  if (isLocked) {
    return (
      <View style={styles.container} >

        <View marginTop={-300} positop>
        <Text style={styles.loading}>Enter passcode</Text>

        <View style={styles.passcodeContainer}> 

        <TextInput
          style={styles.passcodeInput}
          value={enteredPasscode}
          onChangeText={setEnteredPasscode}
          secureTextEntry={true}
        />

          <TouchableOpacity 
                underlineColor="transparent"
                style={styles.passcodeButton} 
                onPress={handlePasscodeSubmit}
                theme={{ colors: { primary: "transparent" } }}
              >
            <FontAwesome style={styles.icon} color='white' name="arrow-right" size={28}/>
          </TouchableOpacity>

        </View>
        </View>

      </View>
    );
  }


  // loading screen appears during fetching of survey
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator 
          size = 'large'
        />
        <Text style={styles.loading}>Loading ...</Text>
      </View>
    );
  }



  return (
    <View style={styles.container}>
        <Stack.Screen options = {{
          headerTitle: 'History',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#EEEEEE'
        }
        }}/>

        {/* bar with sort, filter, search */}

        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchBar}
            placeholder = "Search Here"
          />

          <TouchableOpacity style={styles.searchButton}>
            <FontAwesome style={styles.icon} color='#407EC9' name="search" size={28}/>
          </TouchableOpacity>

        </View>

        <View style={styles.tableHeader}>


        </View>


        {/* keyboardAwareScrollView listing search results */}

        <KeyboardAwareScrollView style={styles.scrollView}> 

          {/* Map through each submission */}
          {responses?.length>0 &&
            responses.reverse().map((response, index) => (
              <View key={index} style={styles.responseContainer}>
                <TouchableOpacity style={styles.button} onPress={() => onSelect(response.responseId)}>
                  <View style={styles.userBox}>
                    <Text style={styles.text}>{response.lName}</Text>
                  </View>
                  <View style={styles.userBox}>
                    <Text style={styles.text}>{response.fName}</Text>
                  </View>
                  <View style={styles.userBox}>
                    <Text style={styles.text}>{response.dpt}</Text>
                  </View>
                  <View style={styles.userBox}>
                    <Text style={styles.dateText}>{convertTime(response.timestamp)}</Text>
                  </View>

                </TouchableOpacity>
            </View>
            ))}

        </KeyboardAwareScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 30
  },
  scrollView: {
    paddingTop: 15,
    marginHorizontal: 20,
    alignSelf: 'stretch',
  },
  responseContainer: {
    flex: 1,
    // backgroundColor: 'lightblue',
  },
  text: {
    fontSize: 20,
    marginLeft: 15,
    fontWeight: '450'
  },
  dateText: {
    fontSize: 16,
    marginLeft: 7,

  },
  tableHeader: {
    height: 60,
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    marginHorizontal: 8,
    backgroundColor: 'white',
    marginVertical: 2,
    alignContent: 'center',
    borderColor: 'grey'
  },
  userBox:{
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'grey'
  },
  dateBox: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',

  },
  searchContainer: {
    backgroundColor: '#407EC9',
    width: '100%',
    flexDirection: 'row'
  },
  searchBar: {
    flex: 1,
    marginLeft: 30,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    textAlignVertical: 'center',
    fontSize: 20,
    borderWidth: 2,
    borderColor: 'white',
    height: 40,
    paddingLeft: 15,
    backgroundColor: 'white'
  },
  searchButton: {
    width: 50,
    marginTop: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 30,
    marginLeft: 9

  },
  icon: {
    alignSelf: 'center'
  },
  passcodeInput: {
    flexDirection: 'column',
    margin: 20,
    marginRight: 10,
    width:  200,
    backgroundColor: 'white',
    borderRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    borderColor: 'gray',
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 25,
    height: 60,
    paddingLeft: 20
  },
  passcodeContainer: {
    flexDirection: 'row',
  },
  passcodeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    marginVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#0D7FB5',
  }
});
