import {StyleSheet, View} from 'react-native';
import React from 'react';
import Home from './app/screens/Home';

const App = () => {
  return (
    <View style={styles.container}>
      {/* <Text>App</Text> */}
      <Home />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
