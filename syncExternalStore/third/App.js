import React from 'react';
import CounterDisplay from './CounterDisplay';
import CounterButton from './CounterButton';
import { SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView>
      <CounterDisplay />
      <CounterDisplay />
      <CounterButton />
    </SafeAreaView>
  );
}
