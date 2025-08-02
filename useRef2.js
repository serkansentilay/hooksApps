import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const App = () => {
  const inputRef = useRef(null);       // input elementine erişim için
  const clickCountRef = useRef(0);     // tıklama sayısı, ama render edilmez
  const [visibleCount, setVisibleCount] = useState(0); // sadece ekrana gösterilen versiyonu

  const handleFocusAndCount = () => {
    // TextInput'a odaklan
    inputRef.current?.focus();

    // tıklama sayısını artır ama re-render tetikleme
    clickCountRef.current += 1;

    // sadece kullanıcıya göstermek için bir kez render et
    setVisibleCount(clickCountRef.current);

    //Bölüm	Açıklama
    //useRef(null)	TextInput bileşenine erişmek için
    //.current.focus()	Butona basıldığında input'a otomatik odaklanma
    //clickCountRef.current += 1	Sayaç artıyor ama ekran yeniden render edilmiyor
    //setVisibleCount(...)	Ekrandaki metni güncellemek için 1 kez render tetikliyoruz
    
  };

  return (
    <View style={{ padding: 50 }}>
      <TextInput
        ref={inputRef}
        placeholder="Buraya otomatik odaklan"
        style={{
          borderWidth: 1,
          borderColor: '#aaa',
          padding: 10,
          marginBottom: 20,
        }}
      />

      <Button title="Odaklan ve Sayaç Arttır" onPress={handleFocusAndCount} />

      <Text style={{ marginTop: 20, fontSize: 16 }}>
        Toplam tıklama sayısı: {visibleCount}
      </Text>
    </View>
  );
};

export default App;
