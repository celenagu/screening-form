
import React, {useState, useEffect} from 'react'
import { Text, StyleSheet, View, TextInput} from 'react-native'


const ProcedureList = (props) => {
  // Destructure question from props
  const { field, form } = props;
  const { name, onBlur} = field; // Access field properties
  const {setFieldTouched, setFieldValue} = form; // Access form properties

  const [procedureList, setProcedureList] = useState({
    head: "",
    neck: "",
    spine: "",
    abPel: "",
    chest: "",
    armsLegs: ""
  });

  const handleTextChange = (text, procedure) => {
    const newList = { ...procedureList, [procedure]: text };
    setProcedureList(newList);
    setFieldValue(name, newList);

  };

  return( 
        <View key = {name} style={styles.container}> 
            <Text style={styles.text}>
                Please list ALL surgeries/procedures you may have had to your:
                </Text>
            <TextInput
                    style={styles.textInput}
                    value={procedureList.head}
                    placeholder = "Head"
                    onChangeText={(text) => handleTextChange(text, 'head')}
                    onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                    }}
                />
            <TextInput
                    style={styles.textInput}
                    value={procedureList.neck}
                    placeholder = "Neck"
                    onChangeText={(text) => handleTextChange(text, 'neck')}
                    onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                    }}
                />
            <TextInput
                    style={styles.textInput}
                    value={procedureList.spine}
                    placeholder = "Spine"
                    onChangeText={(text) => handleTextChange(text, 'spine')}
                    onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                    }}
                />
            <TextInput
                    style={styles.textInput}
                    value={procedureList.abPelvis}
                    placeholder = "Abdomen/Pelvis"
                    onChangeText={(text) => handleTextChange(text, 'abPelvis')}
                    onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                    }}
                />
            <TextInput
                    style={styles.textInput}
                    value={procedureList.chest}
                    placeholder = "Chest"
                    onChangeText={(text) => handleTextChange(text, 'chest')}
                    onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                    }}
                />
            <TextInput
                    style={styles.textInput}
                    value={procedureList.armsLegs}
                    placeholder = "Arms/Legs"
                    onChangeText={(text) => handleTextChange(text, 'armsLegs')}
                    onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                    }}
                />
            
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightcyan"
  },
  item: {
    color: 'black',
    rippleColor: 'grey'
  },
  text: {
    backgroundColor: 'lightblue',
    padding: 10,
    textAlign: 'left',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10
  //   margin: 10,
  },
  textInput: {
    height: 40,
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    fontSize: 20,
    paddingStart: 10
  },

})

export default ProcedureList;