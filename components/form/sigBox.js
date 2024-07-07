import SignatureScreen from 'react-native-signature-canvas'
import React, { useState, useEffect, useRef} from 'react';
import { Text, View, SafeAreaView,TouchableOpacity, StyleSheet, TextInput} from 'react-native';

//issue: sometimes does not register touches properly

const SigBox = (props) => {
    const { text, setScroll, question, field, form } = props;
    const { name, value } = field; // Access field properties
    const { errors, setFieldValue ,touched, setFieldTouched, onBlur} = form;

    const [isValid, setIsValid] = useState(false);
    const ref = useRef();
    
    
    const handleOK = (signature) => {
        let base64Data = signature;

        if(signature){
            base64Data = signature.replace('data:image/png;base64,', '');
        } 

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
        setScroll(true);
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
        setScroll(false);
        setIsValid(true);
      };

    
    const handleReadSignature = async () => {
        try {
            await new Promise(resolve => {
                ref.current.readSignature(resolve);
            });
        } catch (error) {
            console.error('Error reading signature:', error);
        }
    };

    const handleBlur = () => {
      console.log("blur");
      setScroll(true); // Set scroll to true when component loses focus
      setFieldTouched(name, true); // Mark field as touched in Formik
    };
  
    return (
      <View style={styles.container}>
      <Text style={styles.textSign}>{text}</Text>

      <View style = {styles.row}>
        <View style = {styles.canvas}>
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
                    `.m-signature-pad--footer
                        .save {
                            display: none;
                        }
                        .clear {
                            display: none;
                        }
                    .m-signature-pad {
                        position: fixed;
                        margin: auto;
                        width: 100%%;
                        height: 100%;
                    }
                    body,html { 
                        position:relative; 
                    }`
                }
                onBlur = {handleBlur}
            />
        </View>
 

            <View style={styles.column}>
                <TouchableOpacity
                    style={[styles.setButton, {backgroundColor: 'red'}]}
                    onPress={handleUndo}
                    >
                    <Text style={styles.text}>Undo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.setButton, {backgroundColor: 'red'}]}
                    onPress={handleRedo}
                    >
                    <Text style={styles.text}>Redo</Text>
                </TouchableOpacity>
            </View>

        </View>

        {!isValid && errors[name] &&  (
          <Text style={styles.errorText}>{errors[name]}</Text>
        )}
      </View>

    );
  };

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        justifyContent: "center",
        padding: 10,
        width: '100%',
        height: 300,
        backgroundColor: 'cornsilk'
    },
    canvas: {
        flex: 1,
        margin: 30,
        marginTop: 10
    },
    column: {
        flexDirection: 'column',
        marginRight: 30
      },
    textSign: {
        backgroundColor: 'lightblue',
        padding: 10,
        textAlign: 'left',
        fontSize: 20,
        marginTop: 10,
        marginLeft: 10
      //   margin: 10,
      },
    text: {
        color: '#fff',
        fontWeight: '900',
      },
    setButton: {
        backgroundColor: 'deepskyblue',
        textAlign: 'center',
        fontWeight: '300',
        color: '#fff',
        marginHorizontal: 10,
        marginVertical: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
      },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "center",
        // height: 800,
        padding: 10,
        width: '100%'
      },
      errorText: {
        textAlign: 'center',
        flexDirection:'column',
        fontSize: 20,
        color: 'red',
      },
    });


  export default SigBox;