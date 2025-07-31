/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useState, useEffect} from 'react'
import { StatusBar,StyleSheet, Alert,useColorScheme, View, SafeAreaView, Text } from 'react-native';

console.log("1 kez calisirm ben")
function App() {
  const [age, setAge] = useState(42);
  const [count, setCount] = useState(0);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  //usestate ifade degistirmek icin ve birde baslangic degeri alir ilk renderda kullanir
  console.log(`keyfime gore`)
  const isDarkMode = useColorScheme() === 'dark';

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    Alert.alert(`You clicked ${count} times`)
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Text>hello</Text>
     </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
