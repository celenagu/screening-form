// Yes/no radio group

import React, {useState, useRef} from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity, View} from 'react-native'
import {RadioButton} from 'react-native-paper';
import {useFormikContext } from 'formik';






const RadioGroup = (props) => {
  const {
    // field and form are objects from Formik library
    field: { name, value },   // related to single input field within the form
    form: { errors, setFieldValue }, // represents overall state and functionality of the form
    ...inputProps
  } = props
  
  const handleValueChange = (name, newValue) => {
    setFieldValue(name, newValue);
  };


  return( 
        <View key = {name} style={styles.container}> 
        <Text style={styles.text}>{name}</Text>


        <RadioButton.Group 
            onValueChange={value => handleValueChange(name, value)} 
            value={value || ''}
        >
              <RadioButton.Item label="No" value="no" color = 'black'/>
              <RadioButton.Item label="Yes" value="yes" color = 'black'/>
        </RadioButton.Group>

        {/* {console.log(errors)} */}
        {errors[name] && (
          <Text style={styles.errorText}>{errors[name]}</Text>
        )}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgreen"
  },
  item: {
    color: 'black',
    rippleColor: 'grey'
  },
  errorInput: {
    borderColor: 'red',
  },
  text: {
    backgroundColor: 'lightblue',
    padding: 10,
    textAlign: 'left',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10
  //   margin: 10,
  },
  errorText: {
    textAlign: 'center',
    flexDirection:'column',
    fontSize: 20,
    color: 'red',
  },
})

export default RadioGroup;