// infoForm.js
import React, {useRef, useEffect} from 'react';
import { View, StyleSheet , Button} from 'react-native';
import { Formik, Form, Field, useFormikContext } from 'formik';
import inputBox from './inputBox';
import * as yup from 'yup';


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
  
});

const InfoForm = ({errors, touched, handleChange, handleBlur}) => {
    // const { values, handleChange, errors, touched, handleSubmit, isValid } = useFormikContext();


    // const handleInputChange = (name, value) => {
    //   handleChange(name)(value);
    //   onEdit(value.userInfo);
    // };

    // should console log every edit to see if its even working

    return(
        <View style = {styles.container}>
              <View style={styles.idBox}>
                <View style={styles.item}>
                  <Field
                      component={inputBox}
                      name="userInfo.fName"
                      placeholder="First Name"
                      onChangeText={handleChange}
                      onBlur={handleBlur}
                      // onChangeText = {(text) => handleInputChange('fName', text)}
                  />
                </View>
                <View style={styles.item}>
                  <Field
                      component={inputBox}
                      name="userInfo.lName"
                      placeholder="Last Name"
                      onChangeText={handleChange}
                      onBlur={handleBlur}
                      // onChangeText = {(text) => handleInputChange('lName', text)}
                  />
                </View>
                <View style={styles.item}>
                  <Field
                      component={inputBox}
                      name="userInfo.dpt"
                      placeholder="Department"
                      onChangeText={handleChange}
                      onBlur={handleBlur}
                      // onChangeText = {(text) => handleInputChange('dpt', text)}
                  />
                </View>
              </View>



        </View>
    );
};


//     return(
//         <View style = {styles.container}>
//             <Formik
//             initialValues={{
//               fName: '',
//               lName: '',
//               dpt: '',
//             }}
//             validationSchema={setValidationSchema}
//             onSubmit={(values) => updateUserInfo(values)}
//           >
//             {({ handleSubmit, isValid }) => (
//               <>
//               <View style={styles.idBox}>
//                 <View style={styles.item}>
//                   <Field
//                       component={inputBox}
//                       name="fName"
//                       placeholder="First Name"
//                   />
//                 </View>
//                 <View style={styles.item}>
//                   <Field
//                       component={inputBox}
//                       name="lName"
//                       placeholder="Last Name"
//                   />
//                 </View>
//                 <View style={styles.item}>
//                   <Field
//                       component={inputBox}
//                       name="dpt"
//                       placeholder="Department"
//                   />
//                 </View>
//               </View>

//               </>
//             )}
//           </Formik>


//         </View>
//     )
// }

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'lightgrey',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      padding: 10,
      textAlign: 'center',
      fontSize: 16,
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
        backgroundColor: 'pink',
        flex: 1,
        flexDirection: 'column',
    }
  });

  export default InfoForm;