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
        fontSize: 33,
        alignItems:'center',
        textAlign: 'center',
        fontWeight: 'bold',
      },
    buttonLabel2: {
        // flex: 1,
        color: '#407EC9',
        fontSize: 33,
        alignItems:'center',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    major: {
        backgroundColor: '#407EC9',
        borderWidth: 7,
        borderColor: '#407EC9',
        width: "100%",
        borderRadius: 10,
        padding: "2%",
        marginTop: '5%'
    },
    minor: {
        backgroundColor: '#f0f8ff',
        borderWidth: 7,
        borderColor: '#407EC9',
        width: "100%",
        borderRadius: 10,
        padding: "2%",
        marginTop: '5%'
    },
});