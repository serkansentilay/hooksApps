import React ,{ useSyncExternalStore } from 'react';
import { subscribe, getSnapshot } from './simpleStore';
import {Text} from "react-native"
export default function CounterDisplay() {
  const count = useSyncExternalStore(subscribe, getSnapshot);

  console.log('CounterDisplay render oldu');

  return <Text>Sayaç değeri: {count}</Text>;
}
