

import React, {useState, useEffect} from 'react'
import { Text, StyleSheet, View} from 'react-native'
import {RadioButton} from 'react-native-paper';


const SingleChoice2 = (props) => {
  // Destructure question from props
  const { question, field, form, readOnly} = props;
  const { name, value } = field; // Access field properties
  const { errors, setFieldValue, touched } = form; // Access form properties

  const [isValid, setIsValid] = useState([true, true, true]);

  const [values, setValues] = useState({
    0: value?.[0] || null,
    1: value?.[1] || null,
    2: value?.[2] || null
  })

  useEffect(() => {
    if (readOnly) {
      const parsedResponse = value ? JSON.parse(value) : { "0": null, "1": null, '2': null};
      setValues({
        0: parsedResponse["0"] || null,
        1: parsedResponse["1"] || null,
        2: parsedResponse["2"] || null
      });
    }
  }, [readOnly, value]);

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
                  />
                <RadioButton.Item 
                  label="Yes" 
                  value="yes" 
                  color = '#23507D' 
                  labelStyle={styles.optionText}
                  disabled={readOnly}
                  position='leading'
                  style= {styles.item}
                />
            </RadioButton.Group>

            {isValid[0] &&  errors[name]?.[0] && touched[name]?.[0] && (
                <Text style={styles.errorText}>{errors[name][0]}</Text>
              )}
              

            {/* Conditionally render the second radio group */}
            {values[0]=== 'yes' && (
                <View style={styles.subcontainer}>
                <Text style={styles.text}>{question.subquestions[1]}</Text>
                <RadioButton.Group
                    onValueChange={value => handleSubquestionChange(1, value)} // Assuming new field name 'dialysis'
                    value={values[1]} 
                >
                  <RadioButton.Item 
                    label="No" 
                    value="no" 
                    color = '#23507D' 
                    labelStyle={styles.optionText}
                    disabled={readOnly}
                    position='leading'
                    style= {styles.item}
                    />
                  <RadioButton.Item 
                    label="Yes" 
                    value="yes" 
                    color = '#23507D' 
                    labelStyle={styles.optionText}
                    disabled={readOnly}
                    position='leading'
                    style= {styles.item}
                  />
                </RadioButton.Group>
                {isValid[1] && errors[name]?.[1] && touched[name]?.[1] &&(
                  <Text style={styles.errorText}>{errors[name][1]}</Text>
                )}

                {/* Conditionally render the third radio group */}
                {values[1] === 'yes' && (
                    <>
                        <Text style={styles.text}>{question.subquestions[2]}</Text>
                        <RadioButton.Group
                            onValueChange={value => handleSubquestionChange(2,value)} // Assuming new field name 'kidneyDisease'
                            value={values[2]} 
                        >
                           <RadioButton.Item 
                              label="No" 
                              value="no" 
                              color = '#23507D' 
                              labelStyle={styles.optionText}
                              disabled={readOnly}
                              position='leading'
                              style= {styles.item}
                              />
                            <RadioButton.Item 
                              label="Yes" 
                              value="yes" 
                              color = '#23507D' 
                              labelStyle={styles.optionText}
                              disabled={readOnly}
                              position='leading'
                              style= {styles.item}
                            />
                        </RadioButton.Group>
                        {isValid[2] && errors[name]?.[2] && touched[name]?.[2] &&(
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

export default SingleChoice2;