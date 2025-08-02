import React from 'react';
import { increment } from './simpleStore';
import {Button} from 'react-native'

export default function CounterButton() {
  console.log('CounterButton render oldu');

  return <Button onPress={increment} title='Sayacı Arttır'> </Button>;
}
