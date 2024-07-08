// Yes/no radio group

import React, {useState, useRef} from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity, View} from 'react-native'
import {RadioButton} from 'react-native-paper';
import {useFormikContext } from 'formik';

const RadioGroup = (props) => {

  const { question, field, form, readOnly} = props;
  const { name, value } = field; // Access field properties
  const { errors, setFieldValue, touched } = form; // Access form properties

  const [isValid, setIsValid] = useState(true);
  
  const handleValueChange = (name, newValue) => {
    setFieldValue(name, newValue);
    setIsValid(!errors[name]);
  };


  return( 
        <View key = {name} style={styles.container}> 
        <Text style={styles.text}>{question.question}</Text>


        <RadioButton.Group 
            onValueChange={(value) => handleValueChange(name, value)} 
            value={value || ''}
        >
                <RadioButton.Item 
                  label="No" 
                  value="no" 
                  color = 'black' 
                  labelStyle={styles.optionText}
                  disabled={readOnly}
                  />
                <RadioButton.Item 
                  label="Yes" 
                  value="yes" 
                  color = 'black' 
                  labelStyle={styles.optionText}
                  disabled={readOnly}
                />
        </RadioButton.Group>
        
        {isValid && errors[name] && touched[name] && (
          <Text style={styles.errorText}>{errors[name]}</Text>
        )}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgreen",
    width: '100%'
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
  optionText: {
    textAlign: 'left',
    fontSize: 18,
    marginLeft: 15
  },
})

export default RadioGroup;