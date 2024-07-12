// Multiple Choice Box 

import React, {useState, useRef, useEffect} from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Checkbox} from 'react-native-paper';
import {useFormikContext } from 'formik';

const MultipleChoice = (props) => {
  // Destructure question from props
  const { question, field, form, readOnly } = props;
  const { name, value } = field; // Access field properties
  const { errors, setFieldValue ,touched, setFieldTouched} = form; // Access form properties

  const initialCheckedState = value.reduce((acc, choice) => {
    acc[choice.option] = choice.checked
    return acc
  }, {})

  const initialDetailsState = value.map(choice => choice.text)

  const [checked, setChecked] = useState(initialCheckedState);
  const [details, setDetails] = useState(initialDetailsState);
  const [isValid, setIsValid] = useState(Array(question.answerChoices.length).fill(true));

  const handleMultipleChoiceChange = (index) => {
    setChecked((prevChecked) => ({
      ...prevChecked,
      [index]: !prevChecked[index],
    }));

    // if the current index is checked (meaning the text box is hidden), the values in the text box are reset
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
            color = '#23507D'
            status={checked[index] ? 'checked' : 'unchecked'}
            onPress={() => handleMultipleChoiceChange(index)}
            labelStyle = {styles.optionText}
            position='leading'
            style = {styles.item}
            disabled = {readOnly}
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
                    readOnly = {readOnly}
                    placeholderTextColor={'#C3C3C3'}
                    color='black'
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
    backgroundColor: "#F3F3F3",
    width: '100%',
    padding:10,
    marginTop: 10,
    paddingBottom: 15
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
    marginTop: 10,
    marginLeft: 10,
    lineHeight:27
  //   margin: 10,
  },
  optionText: {
    textAlign: 'left',
    fontSize: 16,
    marginLeft: 15,
    color: 'black',
  },
  multipleChoice:{
    flex:1,
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
    // borderWidth: 5,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    fontSize: 16,
    paddingStart: 10,
    marginLeft: 80,
    marginRight: 50
  },
  item: {
    marginLeft: 15,
  }
})

export default MultipleChoice;

