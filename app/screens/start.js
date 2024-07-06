// Patient screening form

import React, { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, Alert, ActivityIndicator} from 'react-native';
import { Stack } from 'expo-router'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Spinner from 'react-native-loading-spinner-overlay';

// For form
import { Formik , Field} from 'formik';
import * as yup from 'yup'
import inputBox from '../../components/form/inputBox';
import RadioGroup from '../../components/form/radioGroup';
import multipleChoice from '../../components/form/multipleChoice';
import SingleChoice2 from '../../components/form/singleChoice2';
import SingleChoiceText1 from '../../components/form/singleChoiceText1';
import SingleChoiceText2 from '../../components/form/singleChoiceText2';
import procedureList from '../../components/form/procedureList';

// To interact with backend
import axios from "axios";


export default function Start() {
  const [surveyData, setSurveyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const formikRef = useRef(null); 
  

  // Triggers fetching survey
  useEffect (() => {
    fetchSurvey();
  }, []);

  // Handles fetching of survey from client
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

  // Function to handle submission of data
  const handleSubmission =  async (values) => {
    try {
      setHasSubmitted(true);
      setIsSpinning(true);
      
      const payload = {
          ...values,
          surveyId: surveyData._id,  
      };

      await axios.post("http://192.168.2.71:8000/submit", payload);
      setIsSpinning(false);
      Alert.alert("Submission successful", "You have successfully submitted the form");
    } catch (error) {
        setIsSpinning(false);
        Alert.alert("Submission Error", "An error occurred during submission");
        console.log("Submission failed", error);
    }
  };

  // Define initial question values for given survey
  const getInitialQuestionValues = (questions) => {
    const fixedValues ={
      fName: '',
      lName: '',
      dpt: '',
    };

    const questionValues = questions.reduce((acc, question) => {
      acc[question._id] = getInitialQuestionValue(question);
      return acc;
    }, {});

    return {
      ...fixedValues, 
      ...questionValues, 
    };
  };

  // Defines intial values based on question type
  const getInitialQuestionValue = (question) => {
    switch (question.type) {
      case 'text':
        return '';
      case 'multipleChoice':
        const temp = question.answerChoices.map((_, index) => ({
          option: index,
          checked: false,
          text: ""
        }))
        return temp;
      case 'singleChoice0':
        return null;
      case 'singleChoiceText1':
      case 'singleChoiceText2':
      case 'singleChoice2':
      case 'singleChoice1':
        const arr = {};
        question.subquestions?.forEach((_, index) => {
          arr[index] = null;
        })
        return arr;
      default:
        return null;
    }
  };

  // Builds validation schema for given survey
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

    questions.forEach((question) => {
      schemaFields[question._id] = getQuestionValidationSchema(question); 
    });

    return yup.object().shape({...schemaFields}); // Create schema with all fields
  };

  // Definition of validation schema based on question type
  const getQuestionValidationSchema = (question) => {
    switch (question.type) {
      case 'text':
        return yup.string().required('This field is required');
      case 'singleChoice0':
        return yup.string().required('Please select an option');
      case 'singleChoice1':
      case 'singleChoice2':
        return yup.object({
          "0": yup.string().required('This field is required'),
          "1": yup.string().when('0', {
            is: 'yes',
            then: () => yup.string().required('This field is required'),
            otherwise: () => yup.string().notRequired()
          }),
          "2": yup.string().when('1', {
            is: 'yes',
            then: () => yup.string().required('This field is required'),
            otherwise: () => yup.string().notRequired()
          }),
        })
      case 'singleChoiceText1': // Add validation for these types
        return yup.object({
          "0": yup.string().required('This field is required'),
          "1": yup.string().when('0', {
            is: 'yes',
            then: () => yup.string().required('This field is required'),
            otherwise: () => yup.string().notRequired()
          }),
        })
      case 'singleChoiceText2':
        return yup.object({
          "0": yup.string().required('This field is required'),
          "1": yup.string().when('0', {
            is: 'yes',
            then: () => yup.string().required('This field is required'),
            otherwise: () => yup.string().notRequired()
          }),
          "2": yup.string().when('1', {
            is: 'yes',
            then: () => yup.string().required('This field is required'),
            otherwise: () => yup.string().notRequired()
          }),
        })
      case 'multipleChoice':
        return yup.array().of(
              yup.object({
                checked: yup.boolean().required(),
                option: yup.number().required(),
                text: yup.string().when('checked', {
                  is: true,
                  then: () => yup.string().required("This field is required"),
                  otherwise: () => yup.string().notRequired()
                })
              })
            ) 
      default:
        return yup.mixed();
    }
  };

  // loading screen appears during fetching of survey
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator 
          size = 'large'
        />
        <Text style={styles.loading}>Loading ...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
       <Stack.Screen options = {{
        headerTitle: 'Start',
        headerTitleAlign: 'center',
        }}/>

        <KeyboardAwareScrollView style={styles.scrollView}>

          {/* Appears when submitting survey */}
          <Spinner
            visible={isSpinning}
            textContent={'Loading...'}
            textStyle={styles.spinning}
          />
          
          <Text style={styles.text}>This is the patient screening form!</Text>

          {/* Fetched from server */}
          <Text style={styles.text}>{surveyData.description}</Text>

          <Text style={styles.text}>{surveyData.text}</Text>

          <Formik
            initialValues={getInitialQuestionValues(surveyData.questions || [])}
            validationSchema={buildValidationSchema(surveyData.questions || [])}
            onSubmit={values => handleSubmission(values)}
            // onSubmit={values => console.log("test", JSON.stringify(values, null, 2),)}
            innerRef={formikRef}
            validateOnChange={hasSubmitted}
            validateOnBlur={hasSubmitted}
          >
            {({handleSubmit}) => (
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
                            <View  key = {question._id} style={styles.container}>
                              <Text style={styles.text}>{question.question}</Text>
                                <View style={styles.textBox}>
                                  <View style={styles.item}>
                                      <Field
                                          component={inputBox}
                                          name={question._id} 
                                          placeholder={'Your answer'}
                                      />
                                  </View>
                                </View>
                            </View>

                          );

                        case 'singleChoice0':
                          return(
                            <View key = {question._id} style={styles.container}> 
                                <Field
                                  component = {RadioGroup}
                                  name = {question._id}
                                  question = {question}
                                />
                            </View>
                          )
                        
                        case 'singleChoice1':
                        
                        case 'singleChoice2':
                          return(
                            <View key = {question._id} style={styles.container}> 
                                <Field
                                  component = {SingleChoice2}
                                  name = {question._id}
                                  question = {question}
                                />
                            </View>
                          )

                        case 'multipleChoice':
                          return(
                            <View key={question._id} style={styles.container}>
                              <Field
                                name = {question._id}
                                component={multipleChoice}         
                                question = {question}                 
                              />
                            </View>
                          )
                        case 'singleChoiceText1':
                          return(
                            <View key={question._id} style={styles.container}>
                              <Field
                                name = {question._id}
                                component = {SingleChoiceText1}
                                question = {question}
                              />
                            </View>
                          )
                        
                        case 'singleChoiceText2':
                          return(
                            <View key={question._id} style={styles.container}>
                              <Field
                                name = {question._id}
                                component = {SingleChoiceText2}
                                question = {question}
                              />
                            </View>
                          )
                        default:
                          return null;
                      }
                  })}
                
                </View>
                
                {/* List of prior surgeries */}
                <View style={styles.procedureList}>
                  <View style={styles.item}>
                  <Field
                      name = "procedureList"
                      component = {procedureList}
                    />
                  </View>
                </View> 


                {/* Patient Signature */}





                {/* Foot of form: Technologist Dropdown */}






                {/* Technologist signature */}




                


                
                {/* Button to submit survey */}
                <Button
                  onPress={ () => {
                    setIsSpinning(true);
                    formikRef.current.validateForm().then((errors) => {
                      if (Object.keys(errors).length === 0) {
                        handleSubmit();
                      } else {
                        handleSubmit(); 
                        Alert.alert(
                          "Validation Error",
                          "Please verify you have fully completed the form."
                        );
                      }
                    }).finally(() => {
                      setIsSpinning(false);
                    })
                  }}
                  title="SUBMIT"
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
    backgroundColor: 'white',
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
  loading: {
    textAlign: 'center',
    fontSize: 30,
    marginTop: 30
  },
  spinning: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    fontWeight: 'normal'
  },
  multipleChoice:{
    marginTop:10,
    flex:1,
    backgroundColor:'pink'
  },
  procedureList: {
    flex:1,
    flexDirection: 'column',
    margin: 10,
  }
});
