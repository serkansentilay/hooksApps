import React, { useState, useMemo } from 'react';
import { View, Button, Text } from 'react-native';

const App = () => {
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 6]);
  const [forceRender, setForceRender] = useState(0); // sadece render tetiklemek için
    console.log(`app iicnde conosle log `)
  // useMemo ile çift sayıların toplamı sadece numbers değişince hesaplanır
  const evenTotal = useMemo(() => {
    console.log('🔢 Çift sayıların toplamı hesaplanıyor...');
    return numbers
      .filter((n) => n % 2 === 0)
      .reduce((sum, n) => sum + n, 0);
  }, [numbers]);

    //numbers dizisine her tıkladığında yeni sayı ekleniyor → useMemo tetikleniyor.
    //Ama sadece "Sadece Render Tetikle" butonuna basarsan:
    //Sadece App bileşeni render olur,
    //numbers değişmediği için evenTotal yeniden hesaplanmaz
    //console.log('Çift sayıların toplamı hesaplanıyor...') çıkmaz ✅



  return (
    <View style={{ padding: 50 }}>
      <Text style={{ fontSize: 18 }}>Sayılar: {numbers.join(', ')}</Text>
      <Text style={{ fontSize: 18, marginVertical: 10 }}>
        Çift Sayıların Toplamı: {evenTotal}
      </Text>

      <Button
        title="Yeni Sayı Ekle (random)"
        onPress={() => {
          const newNumber = Math.floor(Math.random() * 100);
          setNumbers((prev) => [...prev, newNumber]);
        }}
      />

      <View style={{ height: 10 }} />

      <Button
        title="Sadece Render Tetikle"
        onPress={() => setForceRender((prev) => prev + 1)}
      />
    </View>
  );
};

export default App;
