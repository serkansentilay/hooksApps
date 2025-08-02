import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const App = () => {
  const lastClickTime = useRef(null);
  const [count, setCount] = useState(0);

  const handleClick = () => {
    lastClickTime.current = new Date().toLocaleTimeString();
    setCount(count + 1);
  };
  const prevCount = useRef();

    useEffect(() => {
     prevCount.current = count;
    }, [count]);

  return (
    <View style={{ padding: 50 }}>
      <Button title="Tıkla" onPress={handleClick} />
      <Text>Toplam Tıklama: {count}</Text>

      <Text>Son tıklama saati: {lastClickTime.current || 'Henüz yok'}</Text>
      <Text>bir onceki tiklama: {prevCount.current}</Text>

    </View>
  );
};

export default App;
