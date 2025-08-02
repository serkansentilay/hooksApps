import React, { useState, useTransition } from 'react';
import { View, Button, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';

export default function TransitionExample() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  const handlePress = () => {
    startTransition(() => {
      setCount(c => c + 1);

      // Ağır iş: büyük liste oluşturma simülasyonu
      const newItems = Array(10000)
        .fill(null)
        .map((_, i) => `Eleman ${i + 1} - Güncelleme ${count + 1}`);
      setItems(newItems);
    });
  };

  //handlePress içinde startTransition kullanarak büyük liste güncellemesini düşük öncelikli yaptık.
//Böylece butona basınca UI takılmadı, ActivityIndicator ile yüklenme gösterildi.
//Kullanıcı arayüzü her zaman hızlı ve akıcı kaldı.


  return (
    <View style={styles.container}>
      <Button title={`Sayacı Artır: ${count}`} onPress={handlePress} />
      {isPending && <ActivityIndicator size="large" color="blue" />}
      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.item}>{item}</Text>}
        initialNumToRender={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 10 },
  item: { fontSize: 16, paddingVertical: 4, borderBottomWidth: 1, borderColor: '#ddd' },
});
