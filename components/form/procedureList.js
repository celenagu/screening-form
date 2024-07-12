
import React, {useState, useEffect} from 'react'
import { Text, StyleSheet, View, TextInput} from 'react-native'


const ProcedureList = (props) => {
  // Destructure question from props
  const { field, form , readOnly} = props;
  const { name, onBlur, value} = field; // Access field properties
  const {setFieldTouched, setFieldValue} = form; // Access form properties

  const [procedureList, setProcedureList] = useState({
    head: value.head || "",
    neck: value.neck || "",
    spine: value.spine || "",
    abPel: value.abPel || "",
    chest: value.chest || "",
    armsLegs: value.armsLegs || ""
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
                    readOnly={readOnly}
                    color={'black'}
                    placeholderTextColor={'#C3C3C3'}
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
                    readOnly={readOnly}
                    color={'black'}
                    placeholderTextColor={'#C3C3C3'}
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
                    readOnly={readOnly}
                    color={'black'}
                    placeholderTextColor={'#C3C3C3'}
                />
            <TextInput
                    style={styles.textInput}
                    value={procedureList.abPel}
                    placeholder = "Abdomen/Pelvis"
                    onChangeText={(text) => handleTextChange(text, 'abPelvis')}
                    onBlur={() => {
                    setFieldTouched(name)
                    onBlur(name)
                    }}
                    readOnly={readOnly}
                    color={'black'}
                    placeholderTextColor={'#C3C3C3'}
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
                    readOnly={readOnly}
                    color={'black'}
                    placeholderTextColor={'#C3C3C3'}
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
                    readOnly={readOnly}
                    color={'black'}
                    placeholderTextColor={'#C3C3C3'}
                />
            
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    padding: 10,
    paddingBottom: 15,
  },
  item: {
    color: 'black',
    rippleColor: 'grey'
  },
  text: {
    // backgroundColor: 'lightblue',
    padding: 10,
    textAlign: 'left',
    fontSize: 17,
    marginTop: 10,
    marginLeft: 10
  //   margin: 10,
  },
  textInput: {
    height: 40,
    margin: 10,
    marginHorizontal: 15,
    backgroundColor: 'white',
    borderColor: 'gray',
    // borderWidth: StyleSheet.hairlineWidth,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    fontSize: 17,
    paddingStart: 10,
    marginLeft: 20
  },

})

export default ProcedureList;