import React, { useState, useDeferredValue, useMemo } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';

// Örnek çok uzun bir veri listesi
const bigList = Array(10000)
  .fill(null)
  .map((_, i) => `Item ${i + 1}`);

  //.fill(null)
//Array(num) boş elemanlar içerdiği için direkt .map() çalışmaz.
//Çünkü boşluklar “tanımlı ama değer yok” (empty slots) olarak kabul edilir, map onları atlar.
//.fill(null) ile dizideki tüm boşlukları null değeriyle dolduruyoruz.
//Yani [ <5 boş> ] → [null, null, null, null, null] haline geliyor.
//Böylece .map() fonksiyonu dizideki her eleman için çalışır.

//.map() her eleman için bir dönüş değeri yaratır ve yeni bir dizi oluşturur.
//( _ , i ) parametreleri:
//_ : O anki eleman (burada null, ama kullanmıyoruz, bu yüzden ismi _ konmuş. 
// Programcılar genelde “kullanılmayan parametre” için _ kullanır).
//i : Elemanın dizideki indeksi (0’dan başlar).
//Eleman ${i + 1} ifadesi:
//Dizi elemanlarını "Eleman 1", "Eleman 2", ... şeklinde isimlendiriyor.
//i 0’dan başladığı için, kullanıcıya daha anlamlı görünmesi için i + 1 kullanıyoruz.

export default function DeferredSearchExample() {
  const [query, setQuery] = useState('');

  // query'i ertelenmiş bir değer olarak alıyoruz
  const deferredQuery = useDeferredValue(query);

  // deferredQuery değiştiğinde filtrele, query değişince değil
  const filteredList = useMemo(() => {
    console.log('Liste filtreleniyor:', deferredQuery);
    if (!deferredQuery) return bigList;
    return bigList.filter(item =>
      item.toLowerCase().includes(deferredQuery.toLowerCase())
    );
  }, [deferredQuery]);

  //query anlık inputu tutuyor.
//deferredQuery ise query’in ertelenmiş hali.
//useMemo içinde filteredList sadece deferredQuery değiştiğinde güncelleniyor.
//Böylece kullanıcı hızlı yazarken query sürekli değişiyor ama ağır filtreleme hemen tetiklenmiyor.
//Filtreleme işlemi yalnızca input durduğunda veya yavaşladığında gerçekleşiyor.
//Bu sayede UI akıcı kalıyor, donma yaşanmıyor.


  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ara..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 50, padding: 10 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  item: {
    paddingVertical: 4,
    fontSize: 16,
  },
});
