// Patient screening form
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TextInput, Button, Alert} from 'react-native';
import { Stack } from 'expo-router'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import { CheckBox } from 'react-native-elements';

// For form
import { Form, Formik , Field} from 'formik';
import * as yup from 'yup'
import CustomInput from '../../components/form/customInput';

// To interact with backend
import axios from "axios";


export default function Start() {
  const [surveyData, setSurveyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


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

 
          <Formik
            initialValues={{
              fName: '',
              lName: '',
              dpt: '',
            }}
            validationSchema={setValidationSchema}
            onSubmit={values => handleSubmission(values)}
          >
            {({ handleSubmit, isValid }) => (
              <>
              <View style={styles.idBox}>
                <View style={styles.item}>
                  <Field
                      component={CustomInput}
                      name="fName"
                      placeholder="First Name"
                  />
                </View>
                <View style={styles.item}>
                  <Field
                      component={CustomInput}
                      name="lName"
                      placeholder="Last Name"
                  />
                </View>
                <View style={styles.item}>
                  <Field
                      component={CustomInput}
                      name="dpt"
                      placeholder="Department"
                  />
                </View>
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

const setValidationSchema = yup.object().shape({
  fName: yup
    .string()
    .required('First name is required'),
  lName: yup
    .string()
    .required('Last name is required'),
  dpt: yup
    .string()
    .required('Department is required'),

})


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    backgroundColor: 'lightgray',
    marginHorizontal: 20,
    alignSelf: 'stretch',
  },
  text: {
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  textInput: {
    height: 40,
    flex:1,
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
  idBox:{
    flex:1,
    flexDirection: 'row',
    margin: 10,
  },
  item:{
    flex: 1,
    flexDirection: 'column',
  },
  button:{

  }
});
