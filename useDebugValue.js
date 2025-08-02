import React, { useState, useEffect, useDebugValue } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Custom Hook
function useCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCount((c) => c + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Debug amaçlı React DevTools'ta gösterilir
  useDebugValue(count, (val) => `Sayaç: ${val}`);

  return count;
}

// Hook'u kullanan komponent
export default function App() {
  const count = useCounter();

  return (
    <View style={styles.container}>
      {/* Sayıyı mutlaka <Text> içinde gösteriyoruz */}
      <Text style={styles.counterText}>Sayaç: {count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
