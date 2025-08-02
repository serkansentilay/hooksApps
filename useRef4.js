import React, { useRef, useState } from 'react';
import { View, Text, Button } from 'react-native';

const Stopwatch = () => {
  const intervalRef = useRef(null);      // setInterval ID'sini tutar
  const startTimeRef = useRef(null);     // başlama zamanını tutar
  const elapsedRef = useRef(0);          // geçen süreyi saklar
  const [visibleTime, setVisibleTime] = useState(0); // ekranda gösterilecek zaman

  console.log(`stopwatch alanindayiz`)

  const start = () => {
    if (intervalRef.current !== null) return; // zaten çalışıyorsa çık

    startTimeRef.current = Date.now() - elapsedRef.current;

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const diff = now - startTimeRef.current;
      elapsedRef.current = diff;
      setVisibleTime(Math.floor(diff / 1000)); // sadece görsel amaçlı render
    }, 500);
  };
  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const reset = () => {
    stop();
    elapsedRef.current = 0;
    setVisibleTime(0);
  };

  return (
    <View style={{ padding: 50 }}>
      <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 20 }}>
        {visibleTime} sn
      </Text>

      <Button title="Başlat" onPress={start} />
      <View style={{ height: 10 }} />
      <Button title="Durdur" onPress={stop} />
      <View style={{ height: 10 }} />
      <Button title="Sıfırla" onPress={reset} />
    </View>
  );
};

export default Stopwatch;


/*
const Stopwatch = () => {
  const [count, setCount] = useState(0);
  const ref = useRef(0);

  console.log('🔥 render oldu');

  useEffect(() => {
    const interval = setInterval(() => {
      ref.current += 1;
      console.log('ref güncellendi:', ref.current);

      // Şu satırı yorumla → render durur
      setCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <Text>Sayaç (state): {count}</Text>
    </View>
  );
};
*/