import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import {GraphQLQuery} from '@aws-amplify/api';
import {
  createTodo,
  CreateTodoInput,
  CreateTodoMutation,
  deleteTodo,
  DeleteTodoMutation,
  listTodos,
  ListTodosQuery,
} from '../../src';

interface TodoType {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

const TodoScreen = () => {
  const [todoData, setTodoData] = useState<TodoType[] | []>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isFetchData, setIsFetchData] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (isFetchData) {
        const todos = await API.graphql<GraphQLQuery<ListTodosQuery>>(
          graphqlOperation(listTodos),
        );
        const {data} = todos;
        if (data?.listTodos?.items) {
          // if (condition) {

          setTodoData(data.listTodos.items);
          setIsFetchData(false);
          // }
        }
      }
    };
    init();
  }, [isFetchData]);

  const fetchDataFlagHandler = (val: boolean) => {
    setIsFetchData(val);
  };

  async function onDeleteTodo(todoItem: CreateTodoInput) {
    //to be filled in a later step
    try {
      const deleteTodoRes = await API.graphql<GraphQLQuery<DeleteTodoMutation>>(
        graphqlOperation(deleteTodo, {input: {id: todoItem.id}}),
      );
      if (deleteTodoRes.data) {
        fetchDataFlagHandler(true);
      }
    } catch (e) {
      console.log('Delete failed: $e', e);
    }
  }
  const renderTodoList = ({item}: {item: TodoType; index: number}) => {
    return (
      <Pressable
        onLongPress={() => {
          onDeleteTodo(item);
        }}
        style={styles.listView}>
        <Text>{item.name}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={todoData}
        keyExtractor={(item, _index) => item.id}
        renderItem={renderTodoList}
        style={styles.flatListStyle}
        contentContainerStyle={styles.contentContainerStyle}
      />
      <Pressable
        onPress={() => {
          setModalVisible(true);
        }}
        style={[styles.buttonContainer, styles.floatingButton]}>
        <Text style={styles.buttonText}>+ Add Todo</Text>
      </Pressable>
      <AddTodoModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        fetchDataFlagHandler={fetchDataFlagHandler}
      />
    </SafeAreaView>
  );
};

export default TodoScreen;

const AddTodoModal = ({
  modalVisible,
  setModalVisible,
  fetchDataFlagHandler,
}: {
  modalVisible: any;
  setModalVisible: any;
  fetchDataFlagHandler: (val: boolean) => void;
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  async function addTodo() {
    const todo: CreateTodoInput = {
      name: name,
      description: description,
    };
    const addTodoRes = await API.graphql<GraphQLQuery<CreateTodoMutation>>(
      graphqlOperation(createTodo, {input: todo}),
    );

    if (addTodoRes.data) {
      fetchDataFlagHandler(true);
    }

    // await DataStore.save(new Todo({name, description}));
    setModalVisible(false);
    setName('');
    setDescription('');
    //to be filled in a later step
  }

  function closeModal() {
    setModalVisible(false);
  }

  return (
    <Modal
      animationType="fade"
      onRequestClose={closeModal}
      transparent
      visible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalInnerContainer}>
          <Pressable onPress={closeModal} style={styles.modalDismissButton}>
            <Text style={styles.modalDismissText}>X</Text>
          </Pressable>
          <TextInput
            onChangeText={setName}
            placeholder="Name"
            style={styles.modalInput}
          />
          <TextInput
            onChangeText={setDescription}
            placeholder="Description"
            style={styles.modalInput}
          />
          <Pressable onPress={addTodo} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Save Todo</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListStyle: {
    paddingHorizontal: 15,
  },
  contentContainerStyle: {
    // flex: 1,
  },
  listView: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: '#ccc',
    borderRadius: 12,
    marginTop: 10,
  },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: '#4696ec',
    borderRadius: 99,
    paddingHorizontal: 8,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 44,
    elevation: 6,
    shadowOffset: {
      height: 4,
      width: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  modalInnerContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    padding: 16,
  },
  modalInput: {
    borderBottomWidth: 1,
    marginBottom: 16,
    padding: 8,
  },
  modalDismissButton: {
    marginLeft: 'auto',
  },
  modalDismissText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
