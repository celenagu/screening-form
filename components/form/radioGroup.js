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
                  color = '#23507D'
                  labelStyle={styles.optionText}
                  disabled={readOnly}
                  position='leading'
                  style= {styles.item}
                  />
                <RadioButton.Item 
                  label="Yes" 
                  value="yes" 
                  color = '#23507D'
                  labelStyle={styles.optionText}
                  disabled={readOnly}
                  position='leading'
                  style= {styles.item}
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
    backgroundColor: "#F3F3F3",
    width: '100%',
    marginVertical: 10,
    padding: 10
  },
  item: {
    color: 'black',
    rippleColor: 'grey'
  },
  errorInput: {
    borderColor: 'red',
  },
  text: {
    // backgroundColor: 'lightblue',
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
  item : {
    marginLeft: 15
  }
})

export default RadioGroup;