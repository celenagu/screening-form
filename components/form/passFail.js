// Yes/no radio group

import React, {useState, useRef} from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity, View} from 'react-native'
import {RadioButton, Divider} from 'react-native-paper';
import {useFormikContext } from 'formik';

const PassFail = (props) => {

  const { question, field, form, readOnly} = props;
  const { name, value } = field; // Access field properties
  const { errors, setFieldValue, touched } = form; // Access form properties

  const [isValid, setIsValid] = useState(true);
  
  const handleValueChange = (newValue) => {
    setFieldValue(name, newValue);
    setIsValid(!errors[name]);
  };


  return( 
        <View key = {name} style={styles.container}> 
        <Text style={styles.text}>{question}</Text>

        <View style={styles.row}>
            <TouchableOpacity
                style={[styles.button, 
                    value==='Pass' && styles.pressedButtonPass
                ]}
                onPress={() => handleValueChange('Pass')}
            >
                <Text style={styles.buttonText}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, 
                    value==='Fail' && styles.pressedButtonFail
                ]}
                onPress={() => handleValueChange('Fail')}
            >
                <Text style={styles.buttonText}>Fail</Text>
            </TouchableOpacity>

        </View>


        {/* <RadioButton.Group 
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
                  mode = 'android'
                  />
                <RadioButton.Item 
                  label="Yes" 
                  value="yes" 
                  color = '#23507D'
                  labelStyle={styles.optionText}
                  disabled={readOnly}
                  position='leading'
                  style= {styles.item}
                  mode = 'android'
                />
        </RadioButton.Group> */}
        
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
    fontSize: 17,
    lineHeight:30,
    marginTop: 10,
    fontWeight: 'bold',
    marginLeft: 10
  },
  errorText: {
    textAlign: 'center',
    flexDirection:'column',
    fontSize: 17,
    color: 'red',
  },
  optionText: {
    textAlign: 'left',
    fontSize: 16,
    marginLeft: 15,
    color: 'black'
  },
  item : {
    marginLeft: 15
  },
  row: {
    flexDirection: 'row',
    with: '100%',
    marginHorizontal: 20,
    justifyContent: 'space-evenly',
    
  }, 
  button: {
    backgroundColor: '#a3a3a3',
    padding: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 50
  },
  pressedButtonPass: {
    backgroundColor: '#50914c',
    padding: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginVertical: 10
  },
  pressedButtonFail: {
    backgroundColor: '#e63e3e',
    padding: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginVertical: 10
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white'
  }
})

export default PassFail;