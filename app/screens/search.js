// Search / View Database
import { StyleSheet, Text, View} from 'react-native';
import {Stack} from 'expo-router';

export default function Search() {
  return (
    
    <View style={styles.container}>
        <Stack.Screen options = {{
          headerTitle: 'Search',
          headerTitleAlign: 'center',
        }}/>
        <Text>This is the search screen!</Text>

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
