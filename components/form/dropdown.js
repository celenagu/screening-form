import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AutocompleteInput from 'react-native-autocomplete-input';
import AntDesign from '@expo/vector-icons/AntDesign';


const DropdownComponent = (props) => {
  const {data, field, form, placeholder, readOnly} = props;
  const { name, value, onBlur, onChange} = field; // Access field properties
  const { errors, setFieldValue ,touched, setFieldTouched} = form;

  const [query, setQuery] = useState(value || '');
  const [filteredData, setFilteredData] = useState(data);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const hasError = errors[name] && touched[name] && (isValid || value==="");

  // Update local state and form value when field value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  

  const handleSearch = (text) => {
    setQuery(text);
    const newData = data.filter((item) => item.toLowerCase().includes(text.toLowerCase()));
    setFilteredData(newData);
    setIsDropdownVisible(true);
  };

  const handleSelectItem = (item) => {
    setQuery(item);
    setFieldValue(name, item); // Update form value
    setIsDropdownVisible(false); // Hide dropdown
    setIsValid(false); // Clear validation error
  };



  return (
    <View style={styles.container}>

      <TextInput
        style={[
            styles.textInput,
            hasError && styles.errorInput
        ]}
        placeholder={placeholder}
        value={query}
        onChangeText={(text) => {
          handleSearch(text);
          onChange(name)(text);
          setIsValid(!errors[name]);
          setFieldValue(name, text);
        }}
        onFocus={() => 
          setIsDropdownVisible(true)
        } // Show dropdown on focus
        onBlur={() => { 
          setIsDropdownVisible(false);
          setFieldTouched(name);
          onBlur(name);
        }}
        editable={!readOnly}
      />
      {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
      {isDropdownVisible && filteredData.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
          keyboardShouldPersistTaps={'handled'}
          scrollEnabled={false} 
            data={filteredData}
            keyExtractor={(item) => item}
            
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelectItem(item)}
              >
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.list}
          />
        </View>
       )} 
    </View>
  );
};


const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top:55, // Adjust this value to control the dropdown's vertical position
    left: 0,
    right: 0,
    borderRadius: 5,
    zIndex: 10, // Ensures the dropdown appears above other components
    marginHorizontal: 10
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  container: {
    flex: 1,
    // backgroundColor: 'pink',
    justifyContent: 'flex-start',
    position: 'relative'
  },
  list: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    zIndex: 10,
    fontSize: 30,
    borderRadius: 5,
  },
  textInput: {
    height: 40,
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingStart: 10,
    fontSize: 17,

  },
  itemText : {
    fontSize: 16,
    marginHorizontal: 10,
    marginVertical: 3
  },
  errorText: {
    textAlign: 'center',
    flexDirection:'column',
    fontSize: 17,
    color: 'red',
  },
  errorInput: {
    borderColor: 'red',
  },
});

export default DropdownComponent;