import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';

const MAX_LINES = 6;

const MeasureTextView = () => {
  const [text, setText] = useState('Kısa bir cümle.');
  const [height, setHeight] = useState(0);
  const [lineCount, setLineCount] = useState(1);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  //fadeAnim	Animated.Value ile opacity animasyonunu kontrol eder

  const handleLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);

    //View bileşeni çizildikten sonra gerçek boyutu ölçer.
    //event.nativeEvent.layout.height: O anki yüksekliği verir.
    //setHeight ile state’e kaydederiz (ekrana yazmak için).
  };

  const appendText = () => {
    if (lineCount >= MAX_LINES) return;

    setText((prev) => prev + '\nYeni bir satır daha eklendi.');
    setLineCount((prev) => prev + 1);
  };

  // Fade animasyonu tetikleyelim yükseklik değiştiğinde
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      //opacity 1 → 0.4 → 1 olarak değişir.
    ]).start();
  }, [height]);

  useEffect(() => {
    console.log('Yeni yükseklik:', height);
  }, [height]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fadeAnim,
            backgroundColor: height > 150 ? '#ffdddd' : '#ddeeff',
          },
        ]}
        onLayout={handleLayout}
      >
        <Text style={styles.content}>{text}</Text>
      </Animated.View>

      <Text style={styles.heightInfo}>View Yüksekliği: {height}px</Text>

      <Button
        title="Metni Uzat"
        onPress={appendText}
        disabled={lineCount >= MAX_LINES}
      />

      {lineCount >= MAX_LINES && (
        <Text style={styles.warning}>⚠️ Maksimum uzunluğa ulaşıldı.</Text>
      )}
    </ScrollView>
  );
};

export default MeasureTextView;

const styles = StyleSheet.create({
  container: {
    padding: 50,
    alignItems: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  heightInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  warning: {
    color: 'red',
    marginTop: 10,
    fontSize: 16,
  },
});
