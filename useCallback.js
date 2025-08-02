import React, { useState, useCallback } from 'react';
import { View, Button, Text } from 'react-native';

// Alt bileşen
const CounterButton = React.memo(({ onIncrement }) => {
  console.log('CounterButton yeniden render edildi');
  console.log(`react memo ici`)
  return <Button title="Arttır" onPress={onIncrement} />;
});

const App = () => {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(false);

  // useCallback ile fonksiyonun referansını sabit tutuyoruz
 //usecallback sayesinde ve memo birlesiminde memo ici prop kontrol ediyor
 //farkliysa calisiyor yoksa ayni oldugu icin tekrar render olmuyor
  const handleIncrement = useCallback(() => {
    console.log(`usecallback ici`)
    setCount((prev) => prev + 1);
  }, []);

 // const handleIncrement = () => {
 //   console.log(`usecallback ici`)
 //   setCount((prev) => prev + 1);
 // };

  return (
    <View style={{ padding: 20 }}>
      <Text>Count: {count}</Text>
      <CounterButton onIncrement={handleIncrement} />
      <Button
        title="Diğer Durumu Değiştir"
        onPress={() => setOtherState(!otherState)}
      />
    </View>
  );
};

export default App;
