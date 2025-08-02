import React, { useState, useCallback } from 'react';
import { View, Button, Text } from 'react-native';

// Sayaç bileşeni
const CounterDisplay = React.memo(({ count, onIncrement }) => {
  console.log('🧮 CounterDisplay yeniden render edildi');
    //Kullanıcı "Arttır" butonuna basınca count artıyor.
    //Bu count prop olarak CounterDisplay'a geçtiği için, bu bir değişikliktir.
    //React.memo fark eder:
    //“Aa, count değişti! Render etmem gerek!”
    //💡 Yani burada count değiştiği için CounterDisplay yeniden render edilir
    //→ console.log('🧮 CounterDisplay yeniden render edildi') tekrar çalışır.

 return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 20 }}>Sayaç: {count}</Text>
      <Button title="Arttır" onPress={onIncrement} />
    </View>
  );
});

const App = () => {
  const [count, setCount] = useState(0);
  const [themeToggle, setThemeToggle] = useState(false); // rastgele başka bir state

  // useCallback ile sabit referanslı fonksiyon
    const handleIncrement = useCallback(() => {
    console.log('➕ Sayaç arttırıldı');
    setCount((prev) => prev + 1);
  }, []);
 //const handleIncrement = () => {
 //   console.log('➕ Sayaç arttırıldı');
 //   setCount((prev) => prev + 1);
 // };


  return (
    <View style={{ padding: 50 }}>
      <Button
        title="Tema Değiştir (Diğer State)"
        onPress={() => setThemeToggle(!themeToggle)}
      />

      <CounterDisplay count={count} onIncrement={handleIncrement} />
    </View>
  );
};

export default App;
