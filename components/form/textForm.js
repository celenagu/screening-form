// DynamicTextInput.js (example)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Field, useFormikContext } from 'formik';
import inputBox from './inputBox';
import * as yup from 'yup';

const validationSchema = yup.string().required('This field is required');

const DynamicTextInput = ({ question, name, validate}) => {
  const { values, errors, touched } = useFormikContext(); // Access Formik context

  const setValidationSchema = yup.object().shape({
    name: yup
      .string()
      .required('Field is required'),
  
});

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{question.question}</Text>
      <View style={styles.textBox}>
        <View style={styles.item}>
            <Field
                component={inputBox}
                name={name} // Use the dynamic name
                placeholder={question.placeholder || 'Your answer'}
                validate={validate}
            />
        </View>
      </View>
      {errors[name] && touched[name] && (
        <Text style={styles.errorText}>{errors[name]}</Text>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'pink',
      justifyContent: 'center',
    },
    scrollView: {
      backgroundColor: 'lightgray',
      marginHorizontal: 20,
      alignSelf: 'stretch',
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
    textBox: {
      flex:1,
      flexDirection: 'column',
      margin: 10,
    },
    idBox:{
      flex:1,
      flexDirection: 'row',
      margin: 10,
    },
    item:{
      width: '100%',
      flex: 1,
      flexDirection: 'column',
    },
  
  });
  
export default DynamicTextInput;
