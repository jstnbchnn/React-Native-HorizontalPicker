import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';

import HorizontalPicker from './components/HorizontalPicker';

console.disableYellowBox = true;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

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
