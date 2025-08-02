import React, { useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import FancyInput from './Fancy';

const App = () => {
  const inputRef = useRef();

  return (
    <View style={styles.container}>
      <FancyInput ref={inputRef} />

      <View style={styles.buttonGroup}>
        <Button title="Fokusla" onPress={() => inputRef.current.focus()} />
        <Button title="Temizle" onPress={() => inputRef.current.clear()} />
        <Button title="Ön değer ver" onPress={() => inputRef.current.setValue('Merhaba')} />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10
  }
});
