// Yes/no radio group
//Still need to handle errors for this

import React, {useState, useEffect} from 'react'
import { Text, StyleSheet, View, TextInput} from 'react-native'
import {RadioButton} from 'react-native-paper';


const SingleChoiceText2 = (props) => {
  // Destructure question from props
  const { question, field, form } = props;
  const { name, onBlur, onChange, value } = field; // Access field properties
  const { errors, touched, setFieldTouched, setFieldValue} = form; // Access form properties

  const [values, setValues] = useState({
    0: value?.[0] || null,
    1: value?.[1] || null,
    2: value?.[2] || null,
  })

  const [isValid, setIsValid] = useState([true, true, true]);
  
  const hasError = isValid[2] && errors[name]?.[2] && touched[name]?.[2];

  const handleSubquestionChange = (subquestionIndex, newValue) => {
    let newValues = { ...values, [subquestionIndex]: newValue };

    if (subquestionIndex <= 1 && newValue === 'no'){
        newValues = {
          ...values,
          [subquestionIndex]: newValue,
          2: null
        };
        if (subquestionIndex === 0 && newValue === 'no'){
          newValues = {
            ...values,
            [subquestionIndex]: newValue,
            1: null
          };
        }
      }

    setValues(newValues);
    setFieldValue(name, newValues);
    const newIsValid = [...isValid];
    newIsValid[subquestionIndex] = !errors[name]?.[subquestionIndex];
    setIsValid(newIsValid);
    
  };
  
  

  const handleTextChange = (text) => {
    const newValues = { ...values, 2: text };
    setValues(newValues);
    setFieldValue(name, newValues);

    const newIsValid = [...isValid];
    newIsValid[2] = !errors[name]?.[2];
    setIsValid(newIsValid);
  };

  return( 
        <View key = {name} style={styles.container}> 
            <Text style={styles.text}>{question.subquestions[0]}</Text>


            <RadioButton.Group 
                onValueChange={value => handleSubquestionChange(0, value)} 
                value={values[0]}
            >
                <RadioButton.Item style= {styles.item} position='leading' label="No" value="no" color = '#23507D' labelStyle={styles.optionText}/>
                <RadioButton.Item style= {styles.item} position='leading' label="Yes" value="yes" color = '#23507D' labelStyle={styles.optionText}/>
            </RadioButton.Group>

             {isValid[0] && errors[name]?.[0] && touched[name]?.[0] && (
                <Text style={styles.errorText}>{errors[name][0]}</Text>
               )}

            
            {values[0]=== 'yes' && (
                <View style={styles.subcontainer}>
                <Text style={styles.text}>{question.subquestions[1]}</Text>
                <RadioButton.Group
                    onValueChange={value => handleSubquestionChange(1, value)} // Assuming new field name 'dialysis'
                    value={values[1]} 
                >
                    <RadioButton.Item style= {styles.item} position='leading' label="No" value="no" color='#23507D' labelStyle={styles.optionText}/>
                    <RadioButton.Item style= {styles.item} position='leading' label="Yes" value="yes" color='#23507D' labelStyle={styles.optionText}/>
                </RadioButton.Group>
                {isValid[1] && errors[name]?.[1] && touched[name]?.[1] && (
                  <Text style={styles.errorText}>{errors[name][1]}</Text>
                )}


                {/* Conditionally render the text field */}
                {values[1] === 'yes' && (
                    <>
                    <Text style={styles.text}>{question.subquestions[2]}</Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            hasError && styles.errorInput
                            ]}
                        value={values[2]}
                        placeholder='Your Answer'
                        onChangeText={handleTextChange}
                        onBlur={() => {
                        setFieldTouched(name)
                        onBlur(name)
                        }}
                    />
                    {hasError &&(
                    <Text style={styles.errorText}>{errors[name][2]}</Text>
                )}
                </>

            )}
            </View>
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
  subcontainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    margin: 15,
    marginLeft: 30,
    padding: 10,
    paddingTop: -10
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
  textInput: {
    height: 40,
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    fontSize: 20,
    paddingStart: 10,
    marginLeft: 30
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

export default SingleChoiceText2;