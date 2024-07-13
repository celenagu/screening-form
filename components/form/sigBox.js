import SignatureScreen from 'react-native-signature-canvas'
import React, { useState, useEffect, useRef} from 'react';
import { Text, View, SafeAreaView,TouchableOpacity, StyleSheet, TextInput, Modal, Image} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {BlurView} from 'expo-blur';
import { Stack } from 'expo-router'; 


const SigBox = (props) => {
    const { text, field, form, readOnly} = props;
    const { name, value } = field; // Access field properties
    const { errors, setFieldValue} = form;

    const [isValid, setIsValid] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [signature, setSignature] = useState(value || null);
    const [temp, setTemp] = useState(null);
    const ref = useRef();
    
    
    const handleOK = (signature) => {
        let base64Data = signature;

        if(signature){
            base64Data = signature.replace('data:image/png;base64,', '');
        } 

        setTemp(signature);
        setFieldValue(name, base64Data); // Set form field value
      };
    
      // Called after ref.current.readSignature() reads an empty string
      const handleEmpty =() => {
        setIsValid(false);
        handleReadSignature();
        handleOK(null);
      };
    
    
      // Called after end of stroke
      const handleEnd = () => {
        ref.current.readSignature();
      };
    
      // Called after ref.current.getData()
      const handleData = (data) => {
        console.log(data);
      };

    const handleUndo = async () => {
        ref.current.undo();
        await handleReadSignature();
        handleOK(ref.current.signature);
      };
    
    const handleRedo = async () => {
        ref.current.redo();
        await handleReadSignature();
        handleOK(ref.current.signature);
      };
    
    const handleStartDrawing = () => {
        setIsValid(true);
      };
    
    const handleConfirm = () => {
      setSignature(temp);
      setModalOpen(false)
      

    }

    
    const handleReadSignature = async () => {
        try {
            await new Promise(resolve => {
                ref.current.readSignature(resolve);
            });
        } catch (error) {
            console.error('Error reading signature:', error);
        }
    };

    return (
      <View style={styles.container}>

        <SafeAreaView >
                <Modal  transparent visible={modalOpen}>
                <View style={styles.overlay}>
                  <BlurView intensity={6} style={styles.blur} experimentalBlurMethod='dimezisBlurView'>
                      <View style={styles.modalBackground}>
                          <View style={styles.modalContainer}>
                          <Text style={styles.textSign}>Please sign below</Text>

                            {/* canvas */}
                          <View style = {styles.modalRow}>
                            <View style = {styles.modalCanvas}>
                                <SignatureScreen
                                    ref={ref}
                                    onEnd={handleEnd}
                                    showsVerticalScrollIndicator={false}
                                    onOK={handleOK}
                                    onEmpty={handleEmpty}
                                    onGetData={handleData}
                                    autoClear={false}
                                    descriptionText=""
                                    onBegin={handleStartDrawing}
                                    dotSize= {3}
                                    webStyle={
                                        `.m-signature-pad {
                                            position: fixed;
                                            margin: auto;
                                            width: 100%%;
                                            height: 100%;
                                        }
                                        body,html { 
                                            position:relative; 
                                        }`
                                    }
                                />
                            </View>
 
                              {/* Buttons  */}
                              <View style={styles.column}>
                                  <TouchableOpacity
                                      style={[styles.setButton]}
                                      onPress={handleUndo}
                                      >
                                      <Text style={styles.text}>Undo</Text>
                                  </TouchableOpacity>

                                  <TouchableOpacity
                                      style={[styles.setButton, 
                                        // {backgroundColor: '#0D7FB5'}
                                      ]}
                                      onPress={handleRedo}
                                      >
                                      <Text style={styles.text}>Redo</Text>
                                  </TouchableOpacity>

                              </View>
                          </View>

                            <TouchableOpacity
                                  style={[styles.confirm]}
                                  onPress={handleConfirm}
                                  >
                                  <Text style={styles.confirmText}>Confirm</Text>

                            </TouchableOpacity>


                          </View>
                      </View>
                    </BlurView>
                  </View>

                </Modal>


        </SafeAreaView>


      <Text style={styles.textSign}>{text}</Text>

                                      

        {readOnly ? (
          <View style = {styles.canvas} width={'80%'} alignSelf={'center'}>
            <Image
              style={{ width: '100%', height: '100%' }}
              source={{
                uri: signature
              }}
            />
          </View>
        ) : (
          <>
            <View style = {styles.row}>
              <View style = {styles.canvas}>
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={{
                    uri: signature
                  }}
                />
              </View>
  

              <View style={styles.column}>

                  <TouchableOpacity
                      style={[styles.setButton, ]}
                      onPress={() => setModalOpen(true)}
                      >
                      <Text style={styles.text}>Edit</Text>
                  </TouchableOpacity>
              </View>

          </View>

          {!isValid && errors[name] &&  (
            <Text style={styles.errorText}>{errors[name]}</Text>
          )}
          </>
        )}

      </View>

    );
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F3F3F3",
    },
    canvas: {
        flex: 1,
        margin: 30,
        marginTop: 10,
        height:250,
        backgroundColor: "white",
        borderColor: 'black',
        borderRadius:15,
    },
    column: {
        flexDirection: 'column',
        marginRight: 30
      },
    textSign: {
        padding: 10,
        textAlign: 'left',
        fontSize: 17,
        marginTop: 10,
        marginLeft: 10
      //   margin: 10,
      },
    text: {
        color: '#0D7FB5',
        fontWeight: '600',
        fontSize: 16
      },
    setButton: {
        // backgroundColor: 'deepskyblue',
        textAlign: 'center',
        fontWeight: '300',
        color: '#fff',
        marginHorizontal: 10,
        marginVertical: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        borderColor: '#0D7FB5',
        borderWidth: 2.5,
        // backgroundColor: '#0D7FB5'
      },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        width: '100%',
        height: '30%'
      },
      errorText: {
        textAlign: 'center',
        flexDirection:'column',
        fontSize: 17,
        color: 'red',
        marginTop: -25,
        marginBottom: 15
      },
      modalBackground: {
        flex:1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems:'center',
        width: '100%',
        height: '100%',
        
      },
      modalContainer: {
        width : '80%',
        height: 400,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        alignItems:'start',
        justifyContent: 'flex-start'

      }, 
      blur: {
        width: '100%',
        height: '100%',
        position: 'absolute',

      },
      overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000
    },
      modalRow: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        // padding: 10,
        width: '100%',
        height: '30%',
        marginTop: 80
      },
      modalCanvas: {
        flex: 1,
        margin: 30,
        marginTop: 10,
        height:200,
        backgroundColor: "white",
        borderColor: 'black',
        borderRadius:15,
      },
      confirm: {
        textAlign: 'center',
        fontWeight: '300',
        color: '#fff',
        marginHorizontal: 10,
        marginTop: 60,
        marginVertical: 55,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignSelf: 'center',
        backgroundColor: '#0D7FB5'
      },
      confirmText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 20,
        alignSelf: 'center'
      }
    });


  export default SigBox;