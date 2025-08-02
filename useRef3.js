import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';

const App = () => {
  const scrollViewRef = useRef(null);     // ScrollView'a erişim
  const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`));
    //useRef(null) bir “kutu” (objedir) oluşturur:
    //{ current: null }
    //React, <ScrollView ref={scrollViewRef} /> satırını gördüğünde, bu 
    // kutunun .current alanına ScrollView bileşenine ait gerçek referansı 
    // (native component) yerleştirir.
    //Artık scrollViewRef.current bize gerçek ScrollView DOM (ya da native view) referansını verir.
    //Ne Zaman Dolduruluyor?
    //React, bileşen mount (ilk yükleme) olduğunda ref'e erişimi otomatik olarak sağlar.

  const addItemAndScroll = () => {
    const newItem = `Item ${items.length + 1}`;
    setItems([...items, newItem]);

    // setState hemen çalışmaz, bu yüzden kaydırma işini biraz ertelemek gerekir
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    //Burada artık .current içinde gerçek bir ScrollView örneği var ve biz onun 
    // scrollToEnd() adında bir metodunu çağırıyoruz.
    
    //scrollToEnd() fonksiyonu çağrılır, ScrollView en alta kayar.
    //Neden setTimeout kullandık?
    //Çünkü setItems([...]) çalıştığında React hemen DOM'u güncellemez.
    //Scroll işlemi için öğeler DOM'a eklenmiş olmalı. Küçük bir gecikme (setTimeout)
    //  ile ScrollView hazır hale gelir, sonra kaydırırız.
  };

  //Ne	Nasıl?
    //ScrollView'a manuel erişim	useRef(null) + ref={scrollViewRef}
    //Otomatik en sona kaydırma	scrollViewRef.current.scrollToEnd()
    //React’te scroll sonrası güncelleme	setTimeout(..., 100) ile küçük gecikme


    //scrollViewRef.current = 'yeni değer'
    //desen bile, React bunu takip etmez. Yani bu bir "gizli alan" gibidir,
    //  sadece senin kontrolündedir. Bu yüzden "kontrol dışı ama yararlı" diyebiliriz.
    //💬 Kısa Özet
    //useRef, render’lar arasında sabit kalan bir obje üretir.
    //.current, bileşene veya herhangi bir mutable değere erişmeni sağlar.
    //DOM veya native bileşenlere doğrudan erişmek için kullanılır (React Native'de 
    // de TextInput, ScrollView, FlatList, vs).
    //Değeri değiştirsen bile render tetiklemez.
    //Performanslı, sessiz, arka kapı gibidir.

  return (
    <View style={{ flex: 1, padding: 50 }}>
      <Button title="Yeni Eleman Ekle ve Alta Kay" onPress={addItemAndScroll} />

      <ScrollView
        ref={scrollViewRef}
        style={{ marginTop: 20, borderWidth: 1, borderColor: '#ccc' }}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {items.map((item, index) => (
          <Text key={index} style={{ padding: 10, fontSize: 16 }}>
            {item}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

export default App;
