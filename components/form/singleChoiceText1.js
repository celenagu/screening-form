
import React, {useState, useEffect} from 'react'
import { Text, StyleSheet, View, TextInput} from 'react-native'
import {RadioButton} from 'react-native-paper';


const SingleChoiceText1 = (props) => {
  // Destructure question from props
  const { question, field, form } = props;
  const { name, onBlur, onChange, value } = field; // Access field properties
  const { errors, touched, setFieldTouched, setFieldValue} = form; // Access form properties

  const [values, setValues] = useState({
    0: value?.[0] || null,
    1: value?.[1] || null,
  })

  const [isValid, setIsValid] = useState([true, true]);
  
  const hasError = isValid[1] && errors[name]?.[1] && touched[name]?.[1];

  const handleSubquestionChange = (subquestionIndex, newValue) => {
    let newValues = { ...values, [subquestionIndex]: newValue };

    if (subquestionIndex === 0 && newValue === 'no'){
    newValues = {
        ...values,
        [subquestionIndex]: newValue,
        1: ''
    };
    }
    
    setValues(newValues);
    setFieldValue(name, newValues);
    // Update validity based on error presence
    const newIsValid = [...isValid];
    newIsValid[subquestionIndex] = !errors[name]?.[subquestionIndex];
    setIsValid(newIsValid);
  };
  

  const handleTextChange = (text) => {
    const newValues = { ...values, 1: text };
    setValues(newValues);
    setFieldValue(name, newValues);

    // Update validity based on error presence
    const newIsValid = [...isValid];
    newIsValid[1] = !errors[name]?.[1];
    setIsValid(newIsValid);
  };

  return( 
        <View key = {name} style={styles.container}> 
            <Text style={styles.text}>{question.subquestions[0]}</Text>


            <RadioButton.Group 
                onValueChange={value => handleSubquestionChange(0, value)} 
                value={values[0]}
            >
                <RadioButton.Item label="No" value="no" color = 'black' labelStyle={styles.optionText}/>
                <RadioButton.Item label="Yes" value="yes" color = 'black' labelStyle={styles.optionText}/>
            </RadioButton.Group>

             {isValid[0] &&  errors[name]?.[0] && touched[name]?.[0] && (
                <Text style={styles.errorText}>{errors[name][0]}</Text>
               )}


            {/* Conditionally render the text field */}
            {values[0] === 'yes' && (
                <>
                <Text style={styles.text}>{question.subquestions[1]}</Text>
                <TextInput
                    style={[
                        styles.textInput,
                        hasError && styles.errorInput
                        ]}
                    value={values[1]}
                    placeholder='Your Answer'
                    onChangeText={handleTextChange}
                    onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                    }}
                />
                {hasError && (
                  <Text style={styles.errorText}>{errors[name][1]}</Text>
                )}
                </>
            )}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightcyan"
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
  textInput: {
    height: 40,
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    fontSize: 20,
    paddingStart: 10
  },
  optionText: {
    textAlign: 'left',
    fontSize: 18,
    marginLeft: 15
  },
})

export default SingleChoiceText1;