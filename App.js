import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import HorizontalPicker from './components/HorizontalPicker'
console.disableYellowBox = true;

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <HorizontalPicker
        min={1}
        max={50}
        initialValue={11}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
