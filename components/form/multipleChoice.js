// Multiple Choice Box 


import React, {useState, useRef} from 'react'
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

  const handleMultipleChoiceChange = (answerChoice) => {
    setChecked(prevChecked => ({
      ...prevChecked,
      [answerChoice]: !prevChecked[answerChoice],
    }));

    setFieldValue(question.question, checked);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{question.question}</Text>

      {question.answerChoices?.map((answerChoice, index) => (
        <View key={index} style={styles.multipleChoice}>

          <Checkbox.Item
            label = {answerChoice}
            color = 'black'
            status={checked[answerChoice] ? 'checked' : 'unchecked'}
            onPress={() => handleMultipleChoiceChange(answerChoice)}
          />
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
  }
})

export default multipleChoice;