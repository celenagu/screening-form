// Yes/no radio group
//Still need to handle errors for this

import React, {useState, useEffect} from 'react'
import { Text, StyleSheet, View} from 'react-native'
import {RadioButton} from 'react-native-paper';


const SingleChoice2 = (props) => {
  // Destructure question from props
  const { question, field, form } = props;
  const { name, value } = field; // Access field properties
  const { errors, setFieldValue } = form; // Access form properties

  const [value0, setValue0] = useState(value ? value : 'no');
  const [value1, setValue1] = useState('no');
  const [value2, setValue2] = useState('no');

  const handleSubquestionChange = (subquestion, newValue) => {
    if (subquestion === question.subquestions[2]){
        setValue2(newValue);
    }
    else if (subquestion === question.subquestions[1]){
        setValue1(newValue);
    }
    else{
        setValue0(newValue);
    }

  };

    useEffect(() => {
        const nestedValues = {
            [question.subquestions[0]]: value0, 
            [question.subquestions[1]]: value1,
            [question.subquestions[2]]: value2
        }
    
        setFieldValue(name, nestedValues);
    }, [value0, value1, value2]); // Run effect only when checked changes
  

  return( 
        <View key = {name} style={styles.container}> 
            <Text style={styles.text}>{question.subquestions[0]}</Text>


            <RadioButton.Group 
                onValueChange={value => handleSubquestionChange(question.subquestions[0], value)} 
                value={value0 || 'no'}
            >
                <RadioButton.Item label="No" value="no" color = 'black'/>
                <RadioButton.Item label="Yes" value="yes" color = 'black'/>
            </RadioButton.Group>

            {/* {console.log(errors)} */}
            {errors[name] && (
            <Text style={styles.errorText}>{errors[name]}</Text>
            )}

            {/* Conditionally render the second radio group */}
            {value0 === 'yes' && (
                <>
                <Text style={styles.text}>{question.subquestions[1]}</Text>
                <RadioButton.Group
                    onValueChange={value => handleSubquestionChange(question.subquestions[1], value)} // Assuming new field name 'dialysis'
                    value={value1 || 'no'} 
                >
                    <RadioButton.Item label="No" value="no" color="black" />
                    <RadioButton.Item label="Yes" value="yes" color="black" />
                </RadioButton.Group>
                {errors[question.subquestions[1]] && <Text style={styles.errorText}>{errors[question.subquestions[1]] }</Text>}

                {/* Add the third question here if needed, similar to the second */}
                {value1 === 'yes' && (
                    <>
                        <Text style={styles.text}>{question.subquestions[2]}</Text>
                        <RadioButton.Group
                            onValueChange={value => handleSubquestionChange(question.subquestions[2],value)} // Assuming new field name 'kidneyDisease'
                            value={value2 || 'no'} 
                        >
                            <RadioButton.Item label="No" value="no" color="black" />
                            <RadioButton.Item label="Yes" value="yes" color="black" />
                        </RadioButton.Group>
                        {errors[question.subquestions[2]]  && <Text style={styles.errorText}>{errors[question.subquestions[2]] }</Text>}
                    </>

                )}
                </>
            )}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightyellow"
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

export default SingleChoice2;