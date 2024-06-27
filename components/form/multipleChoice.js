// Multiple Choice Box 


import React, {useState, useRef, useEffect} from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Checkbox} from 'react-native-paper';
import {useFormikContext } from 'formik';






const multipleChoice = (props) => {



  // Destructure question from props
  const { question, field, form } = props;
  const { name, value } = field; // Access field properties
  const { errors, setFieldValue } = form; // Access form properties

  const initialCheckedState = Object.fromEntries(
    question.answerChoices.map(choice => [choice, false])
  );

  const [checked, setChecked] = useState(
    value || initialCheckedState
  );

  const [values, setValues] = useState(value || []);

  const handleMultipleChoiceChange = (answerChoice) => {
    setChecked(prevChecked => ({
      ...prevChecked,
      [answerChoice]: !prevChecked[answerChoice],
    }));

    setValues(prevSelected => {
      if (prevSelected.includes(answerChoice)) {
        return prevSelected.filter(choice => choice !== answerChoice);
      } else {
        return [...prevSelected, answerChoice];
      }
    });
  };

  // const handleMultipleChoiceChange = (answerChoice, index) => {
  //   setChecked(prevChecked => ({
  //     ...prevChecked,
  //     [answerChoice]: !prevChecked[answerChoice],
  //   }));

  //   values[index] = !prevChecked;
  // };

    useEffect(() => {
      console.log(values);
        setFieldValue(question.question, values); // Update Formik value after state update
    }, [checked]); // Run effect only when checked changes

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{question.question}</Text>

      {question.answerChoices?.map((answerChoice, index) => (
        <View key={index} style={styles.multipleChoice}>

          <Checkbox.Item
            label = {answerChoice}
            color = 'black'
            status={checked[answerChoice] ? 'checked' : 'unchecked'}
            onPress={() => handleMultipleChoiceChange(answerChoice, index)}
          />
          {/* {errors[answerChoice] && <Text style={styles.errorText}>{errors[answerChoice] }</Text>} */}
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
})

export default multipleChoice;