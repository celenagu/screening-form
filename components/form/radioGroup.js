// Yes/no radio group

import React from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity, View} from 'react-native'
import {RadioButton} from 'react-native-paper';
import {useFormikContext } from 'formik';


const RadioGroup = ({ question, name }) => {
const { values, errors, touched } = useFormikContext(); // Access Formik context

const [value, setValue] = React.useState('first');

return (
    <>
      <Text style={styles.text}>{question.question}</Text>
        <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
            <RadioButton.Item label="No" value="first" color = 'black'/>
            <RadioButton.Item label="Yes" value="second" color = 'black'/>
        </RadioButton.Group>
    </>

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
})

export default RadioGroup;