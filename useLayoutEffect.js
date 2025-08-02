import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MeasureView = () => {
  const [height, setHeight] = useState(0);

    //Başlangıçta yükseklik 0’dı.
    //onLayout çağrıldıktan sonra setHeight() ile ölçülen yükseklik state’e yazıldı.
    //React bu state değişikliğini görünce bileşeni tekrar render etti.
    //Bu sayede güncel değer kullanıcıya gösterildi.

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
    //Bu fonksiyon, kutu render edildikten hemen sonra çalışıyor ve otomatik 
    // olarak gelen height bilgisini state'e (height) kaydediyor.

  };

  // <View onLayout={handleLayout} style={styles.box} />
  //Bu satırda mavi kutuyu (View) ekrana yerleştiriyorsun. onLayout sayesinde 
  // React Native bu kutunun boyutunu sana veriyor.


  return (
    <View style={styles.container}>
      <View onLayout={handleLayout} style={styles.box} />
      
      <Text style={styles.text}>Measured height: {height}px</Text>
    </View>
  );
};

export default MeasureView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    height: 120,
    width: 120,
    backgroundColor: 'skyblue',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
});
