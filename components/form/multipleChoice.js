// Multiple Choice Box 

import React, {useState, useRef, useEffect} from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Checkbox} from 'react-native-paper';
import {useFormikContext } from 'formik';

const multipleChoice = (props) => {
  // Destructure question from props
  const { question, field, form } = props;
  const { name, value } = field; // Access field properties
  const { errors, setFieldValue ,touched, setFieldTouched, onBlur} = form; // Access form properties

  const initialCheckedState = Object.fromEntries(
    question.answerChoices.map((choice, index) => [index, false])
  );

  const [checked, setChecked] = useState(initialCheckedState);
  const [details, setDetails] = useState(Array(question.answerChoices.length).fill(''));
  const [isValid, setIsValid] = useState(Array(question.answerChoices.length).fill(true));

  const handleMultipleChoiceChange = (index) => {
    setChecked((prevChecked) => ({
      ...prevChecked,
      [index]: !prevChecked[index],
    }));

    if (checked[index] === true){
      const newDetails = [...details];
      newDetails[index] = "";
      setDetails(newDetails);
    }
  };

  const handleTextChange = (text, index) => {
    const newDetails = [...details];
    newDetails[index] = text;
    setDetails(newDetails);

    const newIsValid = [...isValid];
    newIsValid[index] = !(errors[question._id] && errors[question._id][index] && errors[question._id][index].text);
    setIsValid(newIsValid);
  }

    useEffect(() => {
      const newCombination =  question.answerChoices.map((_, index) => ({
        option: index,
        checked: checked[index],
        text: details[index]
      }));

      setFieldValue(question._id, newCombination);

    }, [checked, details]); // Run effect only when checked or details changes

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{question.question}</Text>

      {/* For each multiple choice option, render... */}
      {question.answerChoices?.map((answerChoice, index) => (
        <View key={index} style={styles.multipleChoice}>

          <Checkbox.Item
            label = {answerChoice}
            color = 'black'
            status={checked[index] ? 'checked' : 'unchecked'}
            onPress={() => handleMultipleChoiceChange(index)}
            labelStyle = {styles.optionText}
          />

          {checked[index] && (
                <>
                <TextInput
                    style={[
                        styles.textInput,
                        isValid[index] &&
                        errors[question._id] &&
                        errors[question._id][index] &&
                        errors[question._id][index].text &&
                        touched[question._id] &&
                        touched[question._id][index] &&
                        touched[question._id][index].text &&
                        styles.errorInput
                        ]}
                    value={details[index]}
                    placeholder='Please Clarify/Identify'
                    onChangeText={(text) => handleTextChange(text, index)}
                    onBlur={() => {
                      setFieldTouched(name)
                    }}
                />
                {isValid[index] && 
                  errors[question._id] &&
                  errors[question._id][index] &&
                  errors[question._id][index].text &&
                  touched[question._id] &&
                  touched[question._id][index] &&
                  touched[question._id][index].text && (
                  <Text style={styles.errorText}>{errors[question._id][index].text}</Text>
                )}
                </>
            )}
        </View>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink"
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
  optionText: {
    textAlign: 'left',
    fontSize: 18,
    marginLeft: 15
  },
  multipleChoice:{
    marginTop:10,
    flex:1,
    backgroundColor:'pink'
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
    // borderWidth: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    fontSize: 20,
    paddingStart: 10,
    marginLeft: 30,
    marginRight: 50
  },
})

export default multipleChoice;

