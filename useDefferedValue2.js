import React, { useState, useDeferredValue, useMemo } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';

export default function DeferredNumberList() {
  const [number, setNumber] = useState('0');

  // Girdiği sayı değeri erteleniyor
  const deferredNumber = useDeferredValue(number);

  // deferredNumber değiştiğinde listeyi oluştur
  const listData = useMemo(() => {
    const num = parseInt(deferredNumber, 10);
    if (isNaN(num) || num <= 0) return [];
    console.log('Liste oluşturuluyor:', num);
    return Array(num).fill(null).map((_, i) => `Eleman ${i + 1}`);
  }, [deferredNumber]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Sayı girin"
        value={number}
        onChangeText={setNumber}
      />
      <FlatList
        data={listData}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item}</Text>
        )}
        initialNumToRender={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 10 },
  input: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  item: {
    fontSize: 18,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
