// Patient screening form


// Remove components i guess
// render different types of questions
// figure out submission

import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TextInput, Button, Alert} from 'react-native';
import { Stack } from 'expo-router'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import { CheckBox } from 'react-native-elements';

// For form
import { Form, Formik , Field} from 'formik';
import * as yup from 'yup'
import inputBox from '../../components/form/inputBox';
import InfoForm from '../../components/form/infoForm';
import DynamicTextInput from '../../components/form/textForm';
import RadioGroup from '../../components/form/radioGroup';



// To interact with backend
import axios from "axios";


export default function Start() {
  const [surveyData, setSurveyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfoEdited, setUserInfoEdited] = useState(false);
  
  const handleUserInfoEdit = (value) => {
    console.log(value);
    // setUserInfoEdited(true);
  }

  //Triggers fetching survey
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

  console.log(surveyData);
  console.log("Questions:", surveyData.questions);


  // Function to handle submission of data
  const handleSubmission = (values) => {

    console.log(values);

    // send a POST request to backend API to submit form

    axios.post("http://192.168.2.71:8000/submit", values).then((res) => {
      console.log(res);
      Alert.alert(
        "Submission successful",
        "You have successfully submitted the form"
      )
    }).catch((error) => {
      Alert.alert(
        "Submission Error",
        "An error occured during submission"
      )
      console.log("Submisson failed", error)
    });
  };


  // Define initial values for questions
  const getInitialQuestionValues = (questions) => {
    return questions.reduce((acc, question) => {
      acc[question.name] = getInitialQuestionValue(question);
      return acc;
    }, {});
  };

  const getInitialQuestionValue = (question) => {
    switch (question.type) {
      case 'text':
        return '';
      case 'number':
        return 0;
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
      "Enter your height": yup
        .string()
        .required('Field is required.'),
    };

    questions.forEach((question) => {
      schemaFields[question.question] = getQuestionValidationSchema(question); 
    });
    
    console.log(schemaFields);

    return yup.object().shape(schemaFields); // Create schema with all fields
  };

  const getQuestionValidationSchema = (question) => {
    switch (question.type) {
      case 'text':
        return yup.string().required('This field is required');
      case 'singleChoice0':
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


  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading ...</Text>
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
            initialValues={{
              fName: '',
              lName: '',
              dpt: '',
            }}
            validationSchema={buildValidationSchema(surveyData.questions || [])}
            onSubmit={values => handleSubmission(values)}
          >
            {({ handleSubmit, isValid }) => (
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
                            <View  key = {index} style={styles.container}>
                              <Text style={styles.text}>{question.question}</Text>
                                <View style={styles.textBox}>
                                  <View style={styles.item}>
                                    {console.log(question.question)}
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
                          // return(
                          //   // <RadioGroup key = {index} question = {question} name = {question.question}/>
                          // );

                        default:
                          return null;
                      }
                  })}
                </View>



                <Button
                  onPress={handleSubmit}
                  title="SUBMIT"
                  disabled={!isValid}
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

});
