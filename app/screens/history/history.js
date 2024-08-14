// Search / View Database
// require('dotenv').config();

import React, { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, Alert, ActivityIndicator, TouchableOpacity, Touchable, RefreshControl, FlatList} from 'react-native';
import { Stack, useRouter } from 'expo-router'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay';
import FontAwesome from '@expo/vector-icons/FontAwesome';


// To interact with backend
import axios from "axios";
import { Searchbar, Divider, TextInput} from 'react-native-paper';


//Passcode protection
import { PASSCODE, URL } from '@env';


export default function History() {
  const [responses, setResponses] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [sortField, setSortField] = useState('lName');
  const [sortOrder, setSortOrder] = useState('desc');
  const [resultsNum, setResultsNum] =useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResponses, setFilteredResponses] =useState([]);
  const [sortedResponses, setSortedResponses] = useState([]);

  const passcode = PASSCODE;
  const uri = URL;

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
  }, []);



  const handlePasscodeSubmit = () => {
    console.log(enteredPasscode);
    if (enteredPasscode === PASSCODE) {
      setIsLocked(false);
      fetchResponses();
    } else {
      Alert.alert('Incorrect passcode');
    }
  };


  // Handles fetching of survey from server
  const fetchResponses = async (isRefreshing = false) => {
    try{
      if(!isRefreshing) {
        setIsLoading(true);
      }
      const response = await axios.get(
      `${URL}/responses/users`, {timeout: 10000}
      );
      if (response.status === 200){
        const responses = response.data;

        setResponses(responses);
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

  const onRefresh = async () => {
    try{ 
      setRefreshing(true);
      await fetchResponses(true);
      await fetchResponses(true);
    } catch (err) {
      console.error("Error fetching responses:", err);
    } finally {
      setRefreshing(false);
    }
  }

  console.log("refresh");

  const convertTime = (isoDateString) => {
    const date = new Date(isoDateString);

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'EST'
    };

    let readableDateString = date.toLocaleString('en-CA', options);
    readableDateString = readableDateString.replace(' at ', ', ');
    return readableDateString;
  }

  const handleSort = (field) => {
    
    const order = (sortField === field && sortOrder === 'desc') ? 'asc' : 'desc';
    setSortField(field);
    setSortOrder(order);

    if (sortField !== field) {
      const sorted = sortResponses(filteredResponses, field, order);
      setSortedResponses(sorted);
    }
  };

  const sortResponses = (responses) => {
    return responses.sort((a, b) => {
      const fieldA = a[sortField] ? a[sortField].toString().toLowerCase() : '';
      const fieldB = b[sortField] ? b[sortField].toString().toLowerCase() : '';

      if (sortOrder === 'desc') {
        return fieldA > fieldB ? 1 : -1;
      } else {
        return fieldA < fieldB ? 1 : -1;
      }
    });
  };


  const filterResponses = (responses, query) => {
    if (!query) return responses;

    return responses.filter(response => {
      return Object.keys(response).some(key =>{ 
        let value = response[key];
        if (key === 'timestamp') {
          value = convertTime(value);
        }
        return value.toString().toLowerCase().includes(query.toLowerCase())
     });
    });
  };

  useEffect(() => {
    const filtered = filterResponses(responses, searchQuery);
    setFilteredResponses(filtered);
  }, [responses, searchQuery]);

  useEffect(() => {
    const sorted = sortResponses(filteredResponses);
    setSortedResponses(sorted);
    setResultsNum(sorted.length);
  }, [filteredResponses, sortField, sortOrder]);


   useEffect (() => {
    const filtered = filterResponses(responses, searchQuery);
    setFilteredResponses(filtered);
    setSortedResponses(sortResponses([...filteredResponses]));
  }, [responses, searchQuery, sortField, sortOrder])


  useEffect(() => {
    setResultsNum(sortedResponses.length);
  }, [sortedResponses]); 

  const renderItem = ({ item }) => (
    <View style={styles.responseContainer}>
      <TouchableOpacity style={styles.button} onPress={() => onSelect(item.responseId)}>
        <View style={styles.userBox}>
          <Text style={styles.text}>{item.lName}</Text>
        </View>
        <View style={styles.userBox}>
          <Text style={styles.text}>{item.fName}</Text>
        </View>
        <View style={styles.userBox}>
          <Text style={styles.text}>{item.dpt}</Text>
        </View>
        <View style={styles.userBox}>
          <Text style={styles.text}>{item.title}</Text>
        </View>
        <View style={styles.userBox}>
          <Text style={styles.dateText}>{convertTime(item.timestamp)}</Text>
        </View>
      </TouchableOpacity>
      <Divider />
    </View>
  );

  // Locked screen superimposed on loading
  if (isLocked) {
    return (
      <View style={styles.lockContainer} >
       <Stack.Screen options = {{
          headerTitle: 'History',
          headerTitleAlign: 'center',
          headerTintColor: '#0D7FB5',
          headerStyle: {
            backgroundColor: '#EEEEEE'
        },
          headerTitleStyle: {
            color: 'black'
          },
        }}/>

        <View marginTop={-300} >
        <Text style={styles.loading}>Enter passcode</Text>

        <View style={styles.passcodeContainer}> 

        <TextInput
          style={styles.passcodeInput}
          value={enteredPasscode}
          onChangeText={setEnteredPasscode}
          secureTextEntry={true}
          underlineColor='transparent'
          underlineStyle={{ height:0}}
          activeUnderlineColor='#23507D'
        />

          <TouchableOpacity 
                underlineColor="transparent"
                style={styles.passcodeButton} 
                onPress={handlePasscodeSubmit}
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
          headerTintColor: '#0D7FB5',
          headerStyle: {
            backgroundColor: '#EEEEEE'
          },          
          headerTitleStyle: {
            color: 'black'
          },
        }}/>

        {/* bar with search */}


        <View style={styles.searchContainer}>
          
          <TextInput 
            style={styles.searchBar}
            placeholder = "Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            underlineColor='transparent'
            left = {<TextInput.Icon icon='magnify'/>}
            underlineStyle={{ height:0}}
            activeUnderlineColor='#23507D'
          />

        </View>
        <View style={styles.searchContainer}>
          <Text style={styles.counterText}>Number of results: {resultsNum}</Text>
        </View>

        <View style={styles.tableHeader}>
            <TouchableOpacity style={styles.headerButton} onPress={() => handleSort('lName')}>
                <View style={styles.userBox}>
                    <Text style={styles.text} >Last Name {sortField === 'lName' && (sortOrder === 'desc' ? '↓' : '↑')}</Text>
                  </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={() => handleSort('fName')}>
                <View style={styles.userBox}>
                    <Text style={styles.text}>First Name {sortField === 'fName' && (sortOrder === 'asc' ? '↑' : '↓')}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={() => handleSort('dpt')}>
                  <View style={styles.userBox}>
                    <Text style={styles.text}>Unit {sortField === 'dpt' && (sortOrder === 'asc' ? '↑' : '↓')}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={() => handleSort('title')}>
                  <View style={styles.userBox}>
                    <Text style={styles.text}>Title {sortField === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={() => handleSort('timestamp')}>
                  <View style={styles.userBox}>
                    <Text style={styles.text}>Date {sortField === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}</Text>
                  </View>
              </TouchableOpacity>
        </View>

        <View style={styles.scrollView}> 
            <FlatList
            data={sortedResponses}
            keyExtractor={(item) => item.responseId.toString()}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={styles.flatListContent}
          />

        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loading: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 30
  },
  scrollView: {
    alignSelf: 'stretch',
    flex:1
  },
  responseContainer: {
    flex: 1,
    // backgroundColor: 'lightblue',
  },
  text: {
    fontSize: 17,
    marginLeft: 7,
    fontWeight: "450"
  },
  dateText: {
    fontSize: 14,
    marginLeft: 7,

  },
  tableHeader: {
    height: 60,
    flexDirection: 'row',
    backgroundColor: '#E8E8E8',
    width: '100%',
    paddingHorizontal:30
  },
  headerButton: {
    flex:1
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    backgroundColor: 'white',
    alignContent: 'center',
    borderColor: 'grey',
    paddingVertical: 2,
    paddingHorizontal:30
  },
  userBox:{
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBox: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',

  },
  searchContainer: {
    backgroundColor: '#0D7FB5',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 30,
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
    fontSize: 18,
    height: 60,
    // paddingLeft: 5
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
  },
  lockContainer: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    justifyContent: 'center',
    fontWeight: "600",
  }
});
