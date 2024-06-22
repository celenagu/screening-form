// Patient screening form


// Remove components i guess
// render different types of questions
// figure out submission

import React, { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TextInput, Button, Alert} from 'react-native';
import { Stack } from 'expo-router'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import { CheckBox } from 'react-native-elements';

// For form
import { Form, Formik , Field} from 'formik';
import * as yup from 'yup'
import inputBox from '../../components/form/inputBox';
import RadioGroup from '../../components/form/radioGroup';
import multipleChoice from '../../components/form/multipleChoice';
import SingleChoice2 from '../../components/form/singleChoice2';

import {Checkbox} from 'react-native-paper';
// import Checkbox from 'react-native-paper';



// To interact with backend
import axios from "axios";
import multiplChoice from '../../components/form/multipleChoice';


export default function Start() {
  const [surveyData, setSurveyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedValue, setSelectedValue] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const formikRef = useRef(null); 
  

  // Triggers fetching survey
  useEffect (() => {
    fetchSurvey();
  }, []);

  const check = () => {
    console.log(selectedAnswers);
    console.log(selectedValue);
  };
  

  const fetchSurvey = async () => {
    try{
      setIsLoading(true);
      const response = await axios.get(
      'http://192.168.2.71:8000/surveys/latest'
      );
      if (response.status === 200){
        const surveyData = response.data;

        setSurveyData(surveyData);
      }
      else{
        throw new Error('Failed to fetch survey data. Error:' + response.status)
      }
    } catch (err) {
      Alert.alert(
        "An error occured while fetching the survey."
      )
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("refresh");
  // console.log(surveyData);
  // console.log("Questions:", surveyData.questions);


  // Function to handle submission of data
  const handleSubmission =  (values) => {
    console.log("hello");
    setHasSubmitted(true);
    setIsLoading(true);

    console.log("Hello");
    axios.post("http://192.168.2.71:8000/submit", values).then((res) => {
    console.log(res);
    setIsLoading(false);
    Alert.alert(
        "Submission successful",
        "You have successfully submitted the form"
      )
    }).catch((error) => {
      setIsLoading(false);
      Alert.alert(
        "Submission Error",
        "An error occured during submission"
      )
      console.log("Submisson failed", error)
    });

    // send a POST request to backend API to submit form


  };


  // Define initial values for questions
  const getInitialQuestionValues = (questions) => {
    const fixedValues ={
      fName: 'default',
      lName: 'default',
      dpt: 'default',
    };


    // idk how to fix this and i could not be bothered so true = unchecked and false = checked lol
    const mcValues = questions.reduce((acc, question) => {
      if (question.type === 'multipleChoice') {
        acc[question.question] = question.answerChoices.reduce((acc2, choice) => {
          acc2[choice] = false;
          return acc2;
        }, {});
      }
      return acc; // Return acc for both multipleChoice and other questions
    }, {});

    const singleChoiceText = questions.reduce((acc, question) => {
      if (question.type === 'singleChoiceText1') {
        acc[question.question] = question.subquestions.reduce((acc2, subquestion) => {
          acc2[subquestion] = '';
          return acc2;
        }, {});
      }
      return acc; // Return acc for both multipleChoice and other questions
    }, {});

    const singleChoiceValues = questions.reduce((acc, question) => {
      if (question.type === 'singleChoice2' || question.type === 'singleChoice1') {
        acc[question.question] = question.subquestions.reduce((acc2, subquestion) => {
          acc2[subquestion] = 'no';
          return acc2;
        }, {});
      }
      return acc; // Return acc for both multipleChoice and other questions
    }, {});

    const questionValues = questions.reduce((acc, question) => {
      acc[question.question] = getInitialQuestionValue(question);
      return acc;
    }, {});

    // console.log({...fixedValues, ...questionValues, ...mcValues})


    return {
      ...fixedValues, 
      ...questionValues, 
      ...mcValues, 
      ...singleChoiceValues,
      ...singleChoiceText
    };
  };

  const getInitialQuestionValue = (question) => {
    switch (question.type) {
      case 'text':
        return 'hello';
      case 'multipleChoice':
        return true;
      case 'boolean':
        return false;
      default:
        return null;
    }
  };

  
  



  const buildValidationSchema = (questions) => {
    const schemaFields = {
      fName: yup
        .string()
        .required('First name is required'),
      lName: yup
        .string()
        .required('Last name is required'),
      dpt: yup
        .string()
        .required('Department is required'),
    };

    // questions.forEach((question) => {
    //   schemaFields[question.question] = getQuestionValidationSchema(question); 
    // });
    
    // console.log(schemaFields);

    return yup.object().shape(schemaFields); // Create schema with all fields
  };

  const getQuestionValidationSchema = (question) => {
    switch (question.type) {
      case 'text':
        return yup.string().required('This field is required');
      case 'singleChoice0':
        return yup.string().required('Please select an option'); 
      case 'singleChoiceText1': // Add validation for these types
      case 'singleChoiceText2':
      case 'singleChoice2':
        return yup.string().required('Please select an option'); 
      case 'multipleChoice':
        return yup.array().min(1, 'Please select at least one option');
      // ... handle other question types ...
      default:
        return yup.mixed();
    }
  };

  const handleValueChange = (name, newValue) => {
    setSelectedValue(prevValues => ({
      ...prevValues,
      [name]: newValue,
    }));
    if (formikRef.current && formikRef.current.errors[name]) { // Check if formikRef is initialized
      formikRef.current.setFieldError(name, undefined); 
    }
  };

  const handleMultipleChoiceChange = (name, answerChoice, isChecked) => {
    setSelectedAnswers(prevAnswers => {
      const updatedQuestion = {...prevAnswers[name]}; //copy current question's answers
      updatedQuestion[answerChoice] = isChecked;
      return{
        ...prevAnswers,
        [answerChoice]: updatedQuestion,
      };
    });
  };
  
  // useEffect(() => {
  //   console.log(selectedAnswers); // Log the updated state after changes
  // }, [selectedAnswers]); 



  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Loading ...</Text>
      </View>
    );
  }

// console.log(getInitialQuestionValues(surveyData.questions || []));


  return (
    <View style={styles.container}>
       <Stack.Screen options = {{
        headerTitle: 'Start',
        headerTitleAlign: 'center',
        }}/>

        <KeyboardAwareScrollView style={styles.scrollView}>
          
          <Text style={styles.text}>This is the patient screening form!</Text>

          <Text style={styles.text}>
            This form MUST be reviewed by the MRI Technologist,
            with the patient or Substitute Decision Maker, 
            prior to the patient entering the MRI room, for every appointment.
          </Text>

          <Text style={styles.text}>
            Before your MRI scan, you must remove ALL metallic objects including 
            hearing aids, keys, pagers, cell phones, hair pins, jewelry, body piercing jewelry,
            watch, safety pins, magnetic strip cards, pens, coins, etc. You will be asked to change 
            into hospital supplied MRI approved clothing, as any street clothing and metal may not be 
            safe to be worn in the MRI room. Glasses, dentures, partial plates, wigs/hairpieces
            and hearing aids will be removed closer to the MRI room. 
          </Text>

          {/* Fetched from server */}
          <Text style={styles.text}>{surveyData.description}</Text>


          {/* <Text style={styles.text}>{firstQuestion.question}</Text> */}

          {surveyData.questions?.length > 0 && (
            <>
              {/* Mapping through questions and rendering in Text components */}
              {surveyData.questions.map((question, index) => (
                <Text key={index} style={styles.text}>
                  {index + 1}. {question.question}
                </Text>

              ))}
            </>
          )}


          <Formik
            initialValues={getInitialQuestionValues(surveyData.questions || [])}
            validationSchema={buildValidationSchema(surveyData.questions || [])}
            // onSubmit={values => handleSubmission(values)}
            onSubmit={values => console.log(JSON.stringify(values, null, 2))}
            innerRef={formikRef}
            validateOnChange={false}
            validateOnBlur={false}
          >
            {({ handleSubmit, isValid, touched, errors, dirty, values}) => (
              <>

              {/* Info Box */}

              <View style={styles.idBox}>
                <View style={styles.item}>
                  <Field
                      component={inputBox}
                      name="fName"
                      placeholder="First Name"
                  />
                </View>
                <View style={styles.item}>
                  <Field
                      component={inputBox}
                      name="lName"
                      placeholder="Last Name"
                  />
                </View>
                <View style={styles.item}>
                  <Field
                      component={inputBox}
                      name="dpt"
                      placeholder="Department"
                  />
                </View>
              </View>
              
              {/* End of Info Box */}

              {/* Beginning of dynamic rendering of questions */}

              <View style={styles.textBox}>
                  {surveyData.questions?.length > 0 &&
                    surveyData.questions.map((question, index) => {

                      switch (question.type) {
                        case 'text':
                          return (
                            <View  key = {question.question} style={styles.container}>
                              <Text style={styles.text}>{question.question}</Text>
                                <View style={styles.textBox}>
                                  <View style={styles.item}>
                                      <Field
                                          component={inputBox}
                                          name={question.question} // Use the dynamic name
                                          placeholder={'Your answer'}
                                      />
                                  </View>
                                </View>
                            </View>

                          );

                        case 'singleChoice0':
                          return(
                            <View key = {question.question} style={styles.container}> 
                                <Field
                                  component = {RadioGroup}
                                  name = {question.question}
                                />
                            </View>
                          )
                        
                        case 'singleChoice1':
                        
                        case 'singleChoice2':
                          return(
                            <View key = {question.question} style={styles.container}> 
                                <Field
                                  component = {SingleChoice2}
                                  name = {question.question}
                                  question = {question}
                                />
                            </View>
                          )

                        case 'multipleChoice':
                          return(
                            <View key={question.question} style={styles.container}>
                              <Field
                                name = {question.question}
                                component={multipleChoice}         
                                question = {question}                 
                              />
                            </View>
                          )
                        case 'singleChoiceText1':
                        
                        case 'singleChoiceText2':

          
                        default:
                          return null;
                      }
                  })}
                </View> 



                

                {/* <Button
                  title='check'
                  onPress={check}
                /> */}



                <Button
                  onPress={handleSubmit}
                  title="SUBMIT"
                  // disabled={!isValid || !dirty}
                />
              </>
            )}
          </Formik>
        </KeyboardAwareScrollView>

      

    </View>
  );
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
  },
  scrollView: {
    backgroundColor: 'lightgray',
    marginHorizontal: 20,
    alignSelf: 'stretch',
  },
  text: {
    padding: 10,
    textAlign: 'left',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10
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
  errorText: {
    textAlign: 'center',
    flexDirection:'column',
    fontSize: 20,
    color: 'red',
  },
  loading: {
    textAlign: 'center',
    fontSize: 30
  },
  multipleChoice:{
    marginTop:10,
    flex:1,
    backgroundColor:'pink'
  }

});
