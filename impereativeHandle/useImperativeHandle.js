import React, { useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MyModal from './Modal'; // yukarıdaki dosya

const App = () => {
  const modalRef = useRef();

  return (
    <View style={styles.container}>
      <Button title="Modalı Aç" onPress={() => modalRef.current.open()} />
      <Button title="Modalı Kapat" onPress={() => modalRef.current.close()} />
      <MyModal ref={modalRef} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
