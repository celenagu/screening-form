import { StyleSheet , Pressable, View, Text, TouchableOpacity} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function MenuButton ({ label, theme , onPress}) {
    if (theme === "start"){
        return(
                <View>
                <TouchableOpacity style={styles.major} onPress={onPress}>
                    <Text style={styles.buttonLabel1}>{label}</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View>
        <TouchableOpacity style={styles.minor} onPress={onPress}>
            <Text style={styles.buttonLabel2}>{label}</Text>
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    buttonLabel1: {
        // flex: 1,
        color: 'white',
        fontSize: 40,
        alignItems:'center',
        textAlign: 'center',
        fontWeight: 'bold',
      },
    buttonLabel2: {
        // flex: 1,
        color: '#23507D',
        fontSize: 30,
        alignItems:'center',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    major: {
        backgroundColor: '#23507D',
        // borderWidth: 7,
        // // borderColor: '#407EC9',
        width: 200,
        borderRadius: 10,
        padding: "2%",
        marginTop: '5%'
    },
    minor: {
        backgroundColor: '#D9D9D9',
        // borderWidth: 7,
        // borderColor: '#23507D',
        width: 200,
        borderRadius: 10,
        padding: "2%",
        marginTop: '5%'
    },
});