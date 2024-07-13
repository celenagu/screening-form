
import React, {useState, useEffect} from 'react'
import { Text, StyleSheet, View, TextInput} from 'react-native'
import {RadioButton} from 'react-native-paper';


const SingleChoiceText1 = (props) => {
  // Destructure question from props
  const { question, field, form, readOnly} = props;
  const { name, onBlur, onChange, value } = field; // Access field properties
  const { errors, touched, setFieldTouched, setFieldValue} = form; // Access form properties

  const [values, setValues] = useState({
    0: value?.[0] || null,
    1: value?.[1] || null,
  })

  // Set initial values based on readOnly prop
  useEffect(() => {
    if (readOnly) {
      const parsedResponse = value ? JSON.parse(value) : { "0": null, "1": null };
      setValues({
        0: parsedResponse["0"] || null,
        1: parsedResponse["1"] || null,
      });
    }
  }, [readOnly, value]);


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
            </RadioButton.Group>

             {isValid[0] &&  errors[name]?.[0] && touched[name]?.[0] && (
                <Text style={styles.errorText}>{errors[name][0]}</Text>
               )}


            {/* Conditionally render the text field */}
            {values[0] === 'yes' && (
                <View style={styles.subcontainer}>
                <Text style={styles.text}>{question.subquestions[1]}</Text>
                <TextInput
                    style={[
                        styles.textInput,
                        hasError && styles.errorInput
                        ]}
                    value={values[1]}
                    placeholder='Your Answer'
                    onChangeText={handleTextChange}
                    placeholderTextColor={'#C3C3C3'}
                    editable={!readOnly}
                    onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                    }}
                />
                {hasError && (
                  <Text style={styles.errorText}>{errors[name][1]}</Text>
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
    fontSize: 17,
    marginTop: 5,
    marginLeft: 10,
    lineHeight:30
  //   margin: 10,
  },
  errorText: {
    textAlign: 'center',
    flexDirection:'column',
    fontSize: 17,
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
    fontSize: 17,
    paddingStart: 10,
    marginLeft: 20,
    color: 'black'
  },
  optionText: {
    textAlign: 'left',
    fontSize: 16,
    marginLeft: 15,
    color: 'black'
  },
  item : {
    marginLeft: 15
  }
})

export default SingleChoiceText1;