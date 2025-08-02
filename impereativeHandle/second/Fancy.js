import React, { useRef, useImperativeHandle, forwardRef , useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  const [borderColor, setBorderColor] = useState('gray');
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    clear: () => { 
      setValue('');
      setBorderColor('gray');
      inputRef.current.clear();
    },
    setValue: (value) => {
        setValue(value);
      inputRef.current.setNativeProps({ text: value });
    },

     validate: () => {
      if (!value.trim()) {
        setBorderColor('red');
        inputRef.current.focus();
        return false;
      } else {
        setBorderColor('green');
        return true;
      }
    }

    //FancyInput, dışarıdan ref alıyor ama DOM'un (TextInput’un) doğrudan
    //  özelliklerini değil, kendi özel APIsini sunuyor.

    //Modülerlik: FancyInput kendi içinde TextInput kullanıyor, ama dışarıya 
    // sadece izin verdiği methodları açıyor.
    //Kontrol: Parent isterse "form gönderildiğinde inputu temizle", "hatalıysa focusla" diyebilir.
    //Encapsulation: İç detaylara parent karışmaz.

    //focus():
    //TextInput'u programatik olarak odaklar.
    //Yani kullanıcı elle tıklamasa bile, klavye açılır ve input'a yazı yazmaya hazır olur.

    //setNativeProps({ text: "..." }):
    //React Native’in performanslı bir şekilde input’un değerini manuel olarak 
    // değiştirmene olanak tanır — re-render olmadan.
    //setNativeProps ile değer değiştirince, input görünür olarak değişir ama onChangeText tetiklenmez.
    //Yani bunu sadece UI müdahalesi için kullanmalısın (örneğin: reset, autofill gibi).


  }));

  return (
    <View style={styles.container}>
      <TextInput
  ref={inputRef}
  placeholder="Bir şey yaz..."
  style={[styles.input, { borderColor }]}
  value={value}
  onChangeText={(text) => setValue(text)}
/>
    </View>
  );
});

export default FancyInput;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
     input: {
    borderWidth: 2,         // varsa da dursun
    borderColor: 'gray',    // varsayılan
    backgroundColor: 'white', // Android için önerilir
    padding: 10,
    borderRadius: 8,
  },
  },
});