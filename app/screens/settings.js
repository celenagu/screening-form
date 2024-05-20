// Edit Form
import { StyleSheet, Text, View} from 'react-native';
import { Stack} from 'expo-router';

export default function Settings() {

  return (
    <View style={styles.container}>
        <Stack.Screen options = {{
          headerTitle: 'Settings',
          headerTitleAlign: 'center',
        }}/>
        <Text>This is the settings screen!</Text>

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
