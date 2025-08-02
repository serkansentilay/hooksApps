import React, { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot, increment } from './useSyncExternalStore';
import {View, Text, Button} from 'react-native'

function Counter() {
  // Store'dan state'i okuyup değişiklikleri dinliyoruz
  const count = useSyncExternalStore(subscribe, getSnapshot);
//useSyncExternalStore üç argüman alır: subscribe (abonelik fonksiyonu), getSnapshot
//  (anlık veri alma fonksiyonu) ve opsiyonel olarak getServerSnapshot (sunucu tarafı için).
//React, subscribe fonksiyonu ile mağaza değişikliklerine abone olur.
//getSnapshot ile her renderda güncel değeri alır.
//Store güncellendiğinde, React bu hook sayesinde bileşeni yeniden render eder.
//Çalışma prensibi
//Butona bastığında increment() çağrılır.
//Store içindeki değer artar.
//increment fonksiyonu tüm aboneleri (listener’ları) çağırır.
//useSyncExternalStore bunu algılar ve React bileşeni yeniden render eder.
//Güncel değer ekranda gösterilir.
//Özet
//useSyncExternalStore dış bir veri kaynağına React hook ile güvenli ve uyumlu şekilde bağlanmayı sağlar.
//Concurrent rendering ile uyumludur, server-side rendering sırasında sorun çıkarmaz.
//Kendi global store’unuzu veya dış state yönetim kütüphanelerini bağlamak için ideal.



  return (
    <View style={{padding:50}} >
      <Text>Sayaç: {count}</Text>
      <Button title='Arttir' onPress={increment}></Button>
    </View>
  );
}

export default Counter;
