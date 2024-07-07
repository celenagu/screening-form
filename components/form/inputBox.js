import React, {useState} from 'react'
import { Text, TextInput, StyleSheet } from 'react-native'

const inputBox = (props) => {
    const {setScroll, question, field, form, placeholder} = props;
    const { name, value, onBlur, onChange} = field; // Access field properties
    const { errors, setFieldValue ,touched, setFieldTouched} = form;

  const [isValid, setIsValid] = useState(true);

  const hasError = errors[name] && touched[name] && (isValid || value==="");

  return (
    <>
      <TextInput
        style={[
          styles.textInput,
          hasError && styles.errorInput
        ]}
        value={value}
        onChangeText={(text) => {
          onChange(name)(text)
          setIsValid(!errors[name])
        }}
        onBlur={() => {
          setFieldTouched(name)
          onBlur(name)
        }}
        name={name}
        placeholder={placeholder}

      />
      {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
    </>
  )
}

const styles = StyleSheet.create({
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
  errorText: {
    textAlign: 'center',
    flexDirection:'column',
    fontSize: 20,
    color: 'red',
  },
  errorInput: {
    borderColor: 'red',
  },
})

export default inputBox