// Edit Form
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import { useRouter, Stack, useLocalSearchParams} from 'expo-router';
import axios from 'axios';
import { Button } from 'react-native-paper';
import { Formik , Field} from 'formik';


import InputBox from '../../../components/form/inputBox';
import RadioGroup from '../../../components/form/radioGroup';
import MultipleChoice from '../../../components/form/multipleChoice';
import ProcedureList from '../../../components/form/procedureList';
import SigBox from '../../../components/form/sigBox';
import SingleChoice2 from '../../../components/form/singleChoice2';
import SingleChoiceText1 from '../../../components/form/singleChoiceText1';
import SingleChoiceText2 from '../../../components/form/singleChoiceText2';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ViewForm () {
    const router = useRouter();
    const { responseId } = useLocalSearchParams(); 
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchResponse();
    }, [responseId]);

    const fetchResponse = async () => {
        try {
        setIsLoading(true);
          const result = await axios.get(`http://192.168.2.71:8000/responses/${responseId}`);
          if (result.status === 200) {
            setResponse(result.data);
          } else {
            throw new Error('Failed to fetch response');
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
    };

    const linkResponses = (response) => {
        const fixedValues ={
            fName: response.userId.fName,
            lName: response.userId.lName,
            dpt: response.userId.dpt,
            tech: ''
          };

        const responseValues = response.responses.reduce((acc, response) => {
            acc[response.questionId._id] = getResponsesByType(response.questionId, response);
            return acc;
          }, {});
        return {
        ...fixedValues, 
        ...responseValues, 
        };
    }

    const getResponsesByType = (question, response) => {
        switch (question.type) {
          case 'text':
            return response.response;
          case 'multipleChoice':
            const temp = question.answerChoices.map((_, index) => ({
              option: index,
              checked: response.selectedChoices[index].checked,
              text: response.selectedChoices[index].detail
            }))
            return temp;
          case 'singleChoice0':
            return response.response;
          case 'singleChoiceText1':
            return response.response;
            
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
            headerTitle: 'View Form',
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: '#EEEEEE'
            },
            headerRight: () => (
                <Button backgroundColor="blue">Settings</Button>
            )
            }}/>


            <ScrollView style={styles.scrollView}>
                {/* <Text>{JSON.stringify(response, null, 2)}</Text> */}
                {/* {console.log(JSON.stringify(response, null, 2))} */}

                {response ? (
                    <>
                        <Text style={styles.text}>{response.surveyId.text}</Text>


                        <Formik
                        initialValues={linkResponses(response)}
                        onSubmit={() => {}}
                    >
                        {() => (
                            <>  
                                {/* Render user information */}
                                <View style={styles.idBox}>
                                    <View style={styles.item}>
                                        <Text style={styles.idText}>First Name</Text>
                                        <Field
                                            component={InputBox}
                                            name="fName"
                                            placeholder="First Name"
                                            readOnly={true}
                                        />
                                    </View>
                                    <View style={styles.item}>
                                        <Text style={styles.idText}>Last Name</Text>
                                        <Field
                                            component={InputBox}
                                            name="lName"
                                            placeholder="Last Name"
                                            readOnly={true}
                                        />
                                    </View>
                                    <View style={styles.item}>
                                        <Text style={styles.idText}>Department</Text>
                                        <Field
                                            component={InputBox}
                                            name="dpt"
                                            placeholder="Department"
                                            readOnly={true}
                                        />
                                    </View>
                                </View>

                                <View style={styles.dynRender}>
                                    {/* Dynamic rendering of responses */}
                                    {response.responses?.length > 0 &&
                                            response.responses.map((response, index) => {

                                            switch (response.questionId.type) {
                                                case 'text':
                                                return (
                                                    <View  key = {response.questionId._id} style={styles.textInputContainer}>
                                                    <Text style={styles.questionText}>{response.questionId.question}</Text>
                                                        <View style={styles.item}>
                                                            <Field
                                                                component={InputBox}
                                                                name={response.questionId._id} 
                                                                readOnly={true}
                                                                placeholder={'Your answer'}
                                                            />
                                                        </View>
                                                    </View>

                                                );

                                                case 'singleChoice0':
                                                return(
                                                    <View key = {response.questionId._id} style={styles.container}> 
                                                        <Field
                                                        component = {RadioGroup}
                                                        name = {response.questionId._id}
                                                        question = {response.questionId}
                                                        readOnly={true}
                                                        />
                                                    </View>
                                                )
                                                
                                                case 'singleChoice1':
                                                
                                                case 'singleChoice2':
                                                return(
                                                    <View key = {response.questionId._id} style={styles.container}> 
                                                        <Field
                                                        component = {SingleChoice2}
                                                        name = {response.questionId._id}
                                                        question = {response.questionId}
                                                        // setScroll = {setScroll}
                                                        />
                                                    </View>
                                                )

                                                case 'multipleChoice':
                                                return(
                                                    <View key={response.questionId._id} style={styles.container}>
                                                    <Field
                                                        name = {response.questionId._id}
                                                        component={MultipleChoice}         
                                                        question = {response.questionId}
                                                        // setScroll = {setScroll}                 
                                                    />
                                                    </View>
                                                )
                                                case 'singleChoiceText1':
                                                return(
                                                    <View key={response.questionId._id} style={styles.container}>
                                                    <Field
                                                        name = {response.questionId._id}
                                                        component = {SingleChoiceText1}
                                                        question = {response.questionId}
                                                        readOnly={true}
                                                    />
                                                    </View>
                                                )
                                                
                                                case 'singleChoiceText2':
                                                return(
                                                    <View key={response.questionId._id} style={styles.container}>
                                                    <Field
                                                        name = {response.questionId._id}
                                                        component = {SingleChoiceText2}
                                                        question = {response.questionId}
                                                        // setScroll = {setScroll}
                                                    />
                                                    </View>
                                                )
                                                default:
                                                return null;
                                            }
                                        })}

                                <View style={styles.container}>

                                </View>
                                
                                </View>



                            </>
                        )}
                    </Formik>
                    </>


                    ) : (
                        <Text style={styles.text}>No data available</Text>
                    )}
                

            </ScrollView>
            

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
      },
      textInputContainer: {
        backgroundColor: "#F3F3F3",
        marginVertical: 10,
        padding: 10
    
      },
    loading: {
        textAlign: 'center',
        fontSize: 30,
        marginTop: 30
    },
    scrollView: {
        backgroundColor: '#D9D9D9',
        marginHorizontal: 10,
        alignSelf: 'stretch',
      },
    text: {
        padding: 10,
        textAlign: 'left',
        fontSize: 20,
        marginTop: 10,
        marginLeft: 10
    },
    idText: {
        textAlign: 'left',
        fontSize: 18,
        marginTop: 10,
        marginLeft: 15,
        marginBottom: -3
    },
    item:{
        width: '100%',
        flex: 1,
        flexDirection: 'column',
    },
    idBox:{
        flex:1,
        flexDirection: 'row',
        margin: 10,
    },
    textBox: {
        flex:1,
        margin: 5,
    },
    questionText: {
        padding: 10,
        textAlign: 'left',
        fontSize: 20,
        marginTop: 10,
        // marginLeft: 5
    },
    dynRender: {
        flex:1,
        flexDirection: 'column',
        margin: 10,
    }
});

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: 'white',
//       justifyContent: 'center',
//     },
//     scrollView: {
//       backgroundColor: 'lightgray',
//       marginHorizontal: 20,
//       alignSelf: 'stretch',
//     },
//     text: {
//       padding: 10,
//       textAlign: 'left',
//       fontSize: 20,
//       marginTop: 10,
//       marginLeft: 10
//     },
//     idBox:{
//       flex:1,
//       flexDirection: 'row',
//       margin: 10,
//     },
//     item:{
//       width: '100%',
//       flex: 1,
//       flexDirection: 'column',
//     },
//     loading: {
//       textAlign: 'center',
//       fontSize: 30,
//       marginTop: 30
//     },
//     spinning: {
//       textAlign: 'center',
//       fontSize: 30,
//       color: 'white',
//       fontWeight: 'normal'
//     },
//     multipleChoice:{
//       marginTop:10,
//       flex:1,
//       backgroundColor:'pink'
//     },
//     procedureList: {
//       flex:1,
//       flexDirection: 'column',
//       margin: 10,
//     },
//   });
  