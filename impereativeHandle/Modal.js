 import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View, Text, Modal, Button, StyleSheet } from 'react-native';

const MyModal = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false)
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Bu bir modal!</Text>
          <Button title="Kapat" onPress={() => setVisible(false)} />
        </View>
      </View>
    </Modal>
  );
});

export default MyModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10
  }
});
