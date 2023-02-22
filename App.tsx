import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import {GraphQLQuery} from '@aws-amplify/api';
import {listTodos} from './src/graphql/queries';
import {ListTodosQuery} from './src/API';
import Home from './app/screens/Home';

const App = () => {
  useEffect(() => {
    console.log('CALL');

    const init = async () => {
      const todos = await API.graphql<GraphQLQuery<ListTodosQuery>>(
        graphqlOperation(listTodos),
      );
      if (todos) {
        const {data} = todos;
        console.log('TODO >>>> ', data?.listTodos?.items);
      }
    };
    init();
    // return () => {

    // }
  }, []);

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
