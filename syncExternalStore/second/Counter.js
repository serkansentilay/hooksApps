// Counter.js
import {View, Button, Text} from 'react-native';
import React, { useSyncExternalStore } from 'react';
import store from './store';

function Counter() {
  // Redux store'a abone oluyoruz
  const state = useSyncExternalStore(
    store.subscribe,
    store.getState
  );

  const count = state.count;

  return (
    <View style={{padding:50}}>
      <Text>Sayı: {count}</Text>
      <Button title='Arttır' onPress={() => store.dispatch({ type: 'INCREMENT' })}>
        
      </Button>
    </View>
  );
}

export default Counter;
