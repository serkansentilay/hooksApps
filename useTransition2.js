import React, { useState, useTransition, useMemo } from 'react';
import { View, TextInput, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';

const bigData = Array(10000)
  .fill(null)
  .map((_, i) => `Kayıt ${i + 1}`);

export default function FilterWithTransition() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [filteredData, setFilteredData] = useState(bigData);

//TextInput'a yazdıkça handleChange çalışıyor.
//query anlık güncelleniyor (yüksek öncelikli).
//Ama filtreleme işlemi startTransition ile düşük öncelikli yapılıyor.
//Böylece kullanıcı yazarken UI takılmıyor.
//isPending ile filtreleme devam ederken yüklenme göstergesi çıkıyor.
//Özet
//Büyük listelerde anlık filtreleme yapılırken React UI’yi yavaşlatabilir.
//useTransition sayesinde ağır filtreleme işlemi arka planda yapılır.
//Kullanıcı inputu her zaman hızlı tepki verir.
//Yüklenme göstergesi ile kullanıcıya işlem devam ediyor mesajı verilir.


  const handleChange = (text) => {
    setQuery(text);

    // Filtreleme işlemi transition içinde yapılacak (düşük öncelikli)
    startTransition(() => {
      const filtered = bigData.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ara..."
        value={query}
        onChangeText={handleChange}
      />
      {isPending && <ActivityIndicator size="large" color="blue" />}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        initialNumToRender={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 10 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 4,
  },
  item: {
    fontSize: 16,
    paddingVertical: 6,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
