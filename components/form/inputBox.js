import React, {useState} from 'react'
import { Text, TextInput, StyleSheet } from 'react-native'

const inputBox = (props) => {
  const {
    // field and form are objects from Formik library
    field: { name, onBlur, onChange, value },   // related to single input field within the form
    form: { errors, touched, setFieldTouched }, // represents overall state and functionality of the form
    ...inputProps
  } = props

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
        {...inputProps}
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