// Patient screening form


import React, { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, Alert, ActivityIndicator} from 'react-native';
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
  const handleSubmission =  (values) => {
    console.log("hello");
    setHasSubmitted(true);
    // setIsLoading(true);
    setIsSpinning(true);

    console.log("Hello");
    axios.post("http://192.168.2.71:8000/submit", values).then((res) => {
    console.log(res);
    console.log(values)
    // setIsLoading(false);
    setIsSpinning(false);
    Alert.alert(
        "Submission successful",
        "You have successfully submitted the form"
      )
    }).catch((error) => {
      // setIsLoading(false);
      setIsSpinning(false);
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
      fName: '',
      lName: '',
      dpt: '',
    };

    const mcValues = questions.reduce((acc, question) => {
      if (question.type === 'multipleChoice') {
        acc[question._id] = question.answerChoices.map((_, index) => ({
          option: index,
          checked: false,
          text: ""
        }))
      }
      return acc;
    }, {});

    const singleChoiceText = questions.reduce((acc, question) => {
      if (question.type === 'singleChoiceText1' || question.type === 'singleChoiceText2') {
        const arr = {};
        question.subquestions?.forEach((subquestion, index) => {
          arr[index]= null;
        });
        acc[question._id] = arr;
      }
      return acc; // Return acc for both multipleChoice and other questions
    }, {});

    const singleChoiceValues = questions.reduce((acc, question) => {
      if (question.type === 'singleChoice2' || question.type === 'singleChoice1') {
        const arr = {};
        question.subquestions?.forEach((subquestion, index) => {
          arr[index]= null;
        });
        acc[question._id] = arr;
      }
      return acc; // Return acc for both multipleChoice and other questions
    }, {});

    const questionValues = questions.reduce((acc, question) => {
      acc[question._id] = getInitialQuestionValue(question);
      return acc;
    }, {});

    // console.log({...fixedValues, ...questionValues, ...mcValues});


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
        return '';
      // case 'multipleChoice':
      //   return {
      //     selectedChoices: [],
      //     details: question.answerChoices.reduce((clarificationsAcc, choice) => {
      //       clarificationsAcc[choice] = 'Hello'; // Initialize clarification for each choice
      //       return clarificationsAcc;
      //     }, {})
      //   };
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

    questions.forEach((question) => {
      schemaFields[question._id] = getQuestionValidationSchema(question); 
    });

    return yup.object().shape({...schemaFields}); // Create schema with all fields
  };

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

          <Spinner
            visible={isSpinning}
            textContent={'Loading...'}
            textStyle={styles.spinning}
          />
          
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

          <Formik
            initialValues={getInitialQuestionValues(surveyData.questions || [])}
            validationSchema={buildValidationSchema(surveyData.questions || [])}
            // onSubmit={values => handleSubmission(values)}
            onSubmit={values => console.log("test", JSON.stringify(values, null, 2),)}
            innerRef={formikRef}
            validateOnChange={hasSubmitted}
            validateOnBlur={hasSubmitted}
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
                            <View  key = {question._id} style={styles.container}>
                              <Text style={styles.text}>{question.question}</Text>
                                <View style={styles.textBox}>
                                  <View style={styles.item}>
                                      <Field
                                          component={inputBox}
                                          name={question._id} // Use the dynamic name
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

                  {/* {console.log(JSON.stringify(values, null, 2))} */}

                

                {/* <Button
                  title='check'
                  onPress={check}
                /> */}



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
  errorText: {
    textAlign: 'center',
    flexDirection:'column',
    fontSize: 20,
    color: 'red',
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
  }

});
