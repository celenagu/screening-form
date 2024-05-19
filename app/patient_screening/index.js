// Patient screening form
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Pressable, Platform, ImageBackground} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
        <ImageBackground>
            
        </ImageBackground>
        <Text>This is the patient screening form!</Text>
        <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
