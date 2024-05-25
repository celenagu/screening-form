// Patient screening form
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TextInput, Button} from 'react-native';
import { Stack } from 'expo-router'; 
// import { CheckBox } from 'react-native-elements';

// For form
import { Form, Formik , Field} from 'formik';
import * as yup from 'yup'
import CustomInput from '../../components/form/customInput';

// To manage SQLite Database





export default function Start() {



  return (
    <View style={styles.container}>
       <Stack.Screen options = {{
        headerTitle: 'Start',
        headerTitleAlign: 'center',
        }}/>

        {/* Eventually the onSubmit here will save to db */}
        <ScrollView style={styles.scrollView}>
          
          <Text style={styles.text}>This is the patient screening form!</Text>

 
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              dpt: '',
            }}
            validationSchema={setValidationSchema}
            onSubmit={values => console.log(values)}
          >
            {({ handleSubmit, isValid }) => (
              <>
              <View style={styles.idBox}>
                <View style={styles.item}>
                  <Field
                      component={CustomInput}
                      name="firstName"
                      placeholder="First Name"
                  />
                </View>
                <View style={styles.item}>
                  <Field
                      component={CustomInput}
                      name="lastName"
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
        </ScrollView>

      

    </View>
  );
}

const setValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required'),
  lastName: yup
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
    backgroundColor: 'pink',
    marginHorizontal: 20,
    alignSelf: 'stretch',
  },
  text: {
    padding: 10,
    textAlign: 'center',
    fontSize: 20,
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
