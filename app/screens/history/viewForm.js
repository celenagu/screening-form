// Edit Form
// require('dotenv').config();

import React, { useEffect, useState } from 'react';
import { Alert, View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Modal, SafeAreaView, TouchableWithoutFeedback} from 'react-native';
import { Link, Stack, useLocalSearchParams, useRouter} from 'expo-router';
import axios from 'axios';
import { Divider} from 'react-native-paper';
import { Formik , Field} from 'formik';
import Entypo from '@expo/vector-icons/Entypo';


import InputBox from '../../../components/form/inputBox';
import RadioGroup from '../../../components/form/radioGroup';
import MultipleChoice from '../../../components/form/multipleChoice';
import ProcedureList from '../../../components/form/procedureList';
import SigBox from '../../../components/form/sigBox';
import SingleChoice2 from '../../../components/form/singleChoice2';
import SingleChoiceText1 from '../../../components/form/singleChoiceText1';
import SingleChoiceText2 from '../../../components/form/singleChoiceText2';

import {URL} from '@env';


export default function ViewForm () {
    const router = useRouter();
    const { responseId } = useLocalSearchParams(); 
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const uri = URL;

    useEffect(() => {
        fetchResponse();
    }, [responseId]);

    const fetchResponse = async () => {
        try {
        setIsLoading(true);
          const result = await axios.get(`${URL}/responses/${responseId}`);
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
            tech: response.tech,
            techSig: 'data:image/png;base64,' + response.techSig,
            userSig: 'data:image/png;base64,' + response.userSig,
            procedureList: {
                head: response.procedureList.head,
                neck: response.procedureList.neck,
                spine: response.procedureList.spine,
                abPel: response.procedureList.abPel,
                chest: response.procedureList.chest,
                armsLegs: response.procedureList.armsLegs
            }
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
            return response.response;
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

      const convertTime = (isoDateString) => {
        const date = new Date(isoDateString);
    
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          timeZone: 'EST'
        };
    
        const readableDateString = date.toLocaleString('en-US', options);
        return readableDateString;
      }

      const confirmDelete = () => {
        Alert.alert(
            'Delete',
            'Are you sure you want to delete?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete',
                onPress: handleDelete, // Call handleDelete function if user presses Delete
                style: 'destructive',
              },
            ],
            { cancelable: true }
          );
      }

      const handleDelete = async () => {
        try{
            const temp = await axios.delete(`${URL}/responses/${responseId}`);
            setModalOpen(false);
            Alert.alert('Deleted', 'Item deleted successfully');
            router.back();
        } catch (error) {
          console.error('Error deleting item:', error);
          Alert.alert('Error', 'Failed to delete item');
        }

        setModalOpen(false);
      }
    
    const onExport = () => {
        Alert.alert('Export', 'Work in progress');
    }

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
            headerTintColor: '#0D7FB5',
            headerTitleStyle: {
                color: 'black'
            },
            headerStyle: {
                backgroundColor: '#EEEEEE'
            },
            headerRight: () => (
                <TouchableOpacity onPress={() => setModalOpen(true)}>
                    <Entypo marginRight={10} color={'#0D7FB5'}size={28} name='dots-three-horizontal'/>
                </TouchableOpacity>
            )
            }}/>

            <SafeAreaView>
                <Modal transparent visible={modalOpen}>
                    <TouchableWithoutFeedback style={styles.modalBackground} onPress={() => setModalOpen(false)}>
                        <View style={styles.overlay}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContainer}>

                                    <TouchableOpacity style={styles.button} onPress={confirmDelete}>
                                        <Text style={styles.buttonText}>Delete</Text>
                                    </TouchableOpacity>
                                    <Divider/>

                                    <TouchableOpacity style={styles.button} onPress={onExport}>
                                        <Text style={styles.buttonText}>Export</Text>
                                    </TouchableOpacity>


                                </View>
                            </TouchableWithoutFeedback>
                         </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </SafeAreaView>


            <ScrollView style={styles.scrollView}>

                {response ? (
                    <>
                        {/* Render Date */}

                        <Text 
                            style={styles.text} 
                            alignSelf={'center'}
                            marginTop={20}
                        >
                            {convertTime(response.timestamp)}
                        </Text>

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
                                        <Text style={styles.idText}>Unit</Text>
                                        <Field
                                            component={InputBox}
                                            name="dpt"
                                            placeholder="Unit"
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
                                                    <Text style={styles.text}>{response.questionId.question}</Text>
                                                        <View style={styles.textBox}>
                                                            <View style={styles.item}>
                                                                <Field
                                                                    component={InputBox}
                                                                    name={response.questionId._id} 
                                                                    readOnly={true}
                                                                    placeholder={'Your answer'}
                                                                />
                                                            </View>
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
                                                        readOnly={true}
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
                                                        readOnly={true}               
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
                                                        readOnly={true}
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

                        {/* List of previous surgeries */}
                            <View style={styles.procedureList}>
                            <View style={styles.item}>
                            <Field
                                name = "procedureList"
                                component = {ProcedureList}
                                readOnly={true}
                                />
                            </View>
                        </View> 

                            {/* Patient Signature */}

                            <View style={styles.container}>
                            <View style={styles.sigBox}>
                                <Field
                                    name = "userSig"
                                    component = {SigBox}
                                    text = "Screenee Signature Here"
                                    readOnly={true}
                                />
                            </View>
                            </View> 

                        
                        <View style={styles.footer}>
                        <Text style={styles.text}>The following must be filled out by the MRI technologist. </Text>
                        <Divider style={styles.div}/>
                            {/* Foot of form: Technologist Dropdown */}
                                <Text style={styles.text}>Name of MRI Technologist </Text>
                                <View style={styles.textBox}>
                                <View style={styles.item}>
                                <Field
                                    name = "tech"
                                    placeholder = "MRI Technologist Name"
                                    component = {InputBox}
                                    readOnly={true}
                                />
                                </View>
                                </View>

                            {/* Technologist signature */}

                            <View >
                                <Field
                                    name = "techSig"
                                    component = {SigBox}
                                    readOnly={true}
                                    text = "MRI Technologist Signature Here"
                                />
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
        fontSize: 17,
        marginTop: 10,
        marginLeft: 10,
        lineHeight:27
    },
    idText: {
        textAlign: 'left',
        fontSize: 17,
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
        flexDirection: 'column',
        margin: 10,
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
    },
    procedureList: {
        flex:1,
        flexDirection: 'column',
        margin: 10,
      },
    sigBox: {
        flex: 1,
        padding: 10,
        // width: '100%',
        backgroundColor: "#F3F3F3",
        margin: 10
    },
    footer:{
        flex: 1,
        padding: 10,
        // width: '100%',
        backgroundColor: "#F3F3F3",
        margin: 10
    },
    div: {
        marginVertical: 15,
        color: 'black'
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: 'flex-start',
        alignItems: 'flex-end'
    },
    modalBackground: {
        flex:1,
        width: '100%',
        height: '100%',
    },
    modalContainer: {
        backgroundColor: 'white',
        width: 150,
        // height: 400,
        zIndex: 1,
        borderRadius: 30,
        margin: 20, 
        marginTop: 90,
        flexDirection: 'column'
    },
    button : {
        width: '100%',
        alignItems: 'center',
        padding: 25

    },
    buttonText: {
        fontSize: 18

    }
});