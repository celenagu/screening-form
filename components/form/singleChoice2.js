// Yes/no radio group

import React, {useState, useRef} from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity, View} from 'react-native'
import {RadioButton} from 'react-native-paper';
import {useFormikContext } from 'formik';






const SingleChoice2 = (props) => {
  // Destructure question from props
  const { question, field, form } = props;
  const { name, value } = field; // Access field properties
  const { errors, setFieldValue } = form; // Access form properties

  const [value1, setValue1] = useState(
    value || initialState
  );
  const [value2, setValue2] = useState(
    value || initialState
  );

  const initialState = Object.fromEntries(
    question.subquestions.map(subquestion => [subquestion, ''])
  );
  
  const handleValueChange0 = (name, newValue) => {
    setFieldValue(question.question, newValue);
  };

  const handleValueChange1 = (name, newValue) => {
    setValue1(newValue);
    setFieldValue(name, newValue) 
  };

  const handleValueChange2 = (name, newValue) => {
    setValue2(newValue);
    setFieldValue(name, newValue) 
  };

  


  return( 
        <View key = {name} style={styles.container}> 
            <Text style={styles.text}>{name}</Text>


            <RadioButton.Group 
                onValueChange={value => handleValueChange0(name, value)} 
                value={value || ''}
            >
                <RadioButton.Item label="No" value="no" color = 'black'/>
                <RadioButton.Item label="Yes" value="yes" color = 'black'/>
            </RadioButton.Group>

            {/* {console.log(errors)} */}
            {errors[name] && (
            <Text style={styles.errorText}>{errors[name]}</Text>
            )}

            {/* Conditionally render the second radio group */}
            {value === 'yes' && (
                <>
                <Text style={styles.text}>{question.subquestions[0]}</Text>
                <RadioButton.Group
                    onValueChange={value => handleValueChange1(question.subquestions[0], value)} // Assuming new field name 'dialysis'
                    value={value1 || ''} // Use a separate field for dialysis
                >
                    <RadioButton.Item label="No" value="no" color="black" />
                    <RadioButton.Item label="Yes" value="yes" color="black" />
                </RadioButton.Group>
                {errors.dialysis && <Text style={styles.errorText}>{errors.dialysis}</Text>}

                {/* Add the third question here if needed, similar to the second */}
                {value1 === 'yes' && (
                    <>
                        <Text style={styles.text}>{question.subquestions[1]}</Text>
                        <RadioButton.Group
                            onValueChange={value => handleValueChange2(question.subquestions[1],value)} // Assuming new field name 'kidneyDisease'
                            value={value2 || ''} // Use a separate field for kidneyDisease
                        >
                            <RadioButton.Item label="No" value="no" color="black" />
                            <RadioButton.Item label="Yes" value="yes" color="black" />
                        </RadioButton.Group>
                        {errors.kidneyDisease && <Text style={styles.errorText}>{errors.kidneyDisease}</Text>}
                    </>

                )}
                </>
            )}
        

        
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightyellow"
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
})

export default SingleChoice2;