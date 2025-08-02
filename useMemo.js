import React, { useState, useMemo } from 'react';
import { View, TextInput, Text, FlatList } from 'react-native';

const names = [
  'Ali', 'Ayşe', 'Mehmet', 'Fatma', 'Ahmet', 'Zeynep', 'Hüseyin', 'Elif'
];

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [counter, setCounter] = useState(0);

  // 🔍 Her render'da yeniden filtreleme yapmamak için useMemo
  const filteredNames = useMemo(() => {
    console.log('🔍 Filtreleme yapılıyor...');
    return names.filter((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]); // sadece searchTerm değişirse hesapla

  return (
    <View style={{ padding: 50 }}>
      <TextInput
        placeholder="Ara..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{
          padding: 10,
          borderColor: '#ccc',
          borderWidth: 1,
          marginBottom: 10,
        }}
      />

      <FlatList
        data={filteredNames}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ fontSize: 18 }}>{item}</Text>
        )}
      />

      <Text onPress={() => setCounter(counter + 1)} style={{ marginTop: 20 }}>
        Sayaç: {counter} (tıklayıp render tetikle)
      </Text>
    </View>
  );
};

export default App;
