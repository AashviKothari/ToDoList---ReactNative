import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
const COLORS = { primary: "#1f145c", blue: "#0099ff", white: "#fff" };
export default function App() {
  // set default tasks
  const [todos, setTodos] = React.useState([
    { id: 1, task: "first task", completed: true },
    { id: 2, task: "Second task", completed: false },
  ]);

  React.useEffect(()=>{
    getFromUser();
  },[]);

  React.useEffect(()=>{
    saveTodoTouserDevice(todos);
  }, [todos])
  // set new task
  const [textInput, setTextInput] = React.useState("");

  // function to display todo items
  const ListItem = ({ todo }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 15,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? "line-through" : "none",
            }}
          >
            {todo?.task}
          </Text>
        </View>

        {/* Check if task is completed, if no, */}
        {!todo?.completed && (
          <TouchableOpacity
            style={[styles.actionIcons]}
            onPress={() => markTodoComplete(todo?.id)}
          >
            <Icon name="done" sixe={20} color={COLORS.white} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionIcons, { backgroundColor: "red" }]}
          onPress={() => deleteTodo(todo?.id)}
        >
          <Icon name="delete" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    );
  };

  // Add a task
  const addTodo = () => {
    if (textInput == "") {
      Alert.alert("Error", "Please input Todo!");
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      console.log(id);
      setTodos([...todos, newTodo]);
      setTextInput("");
    }
  };
  // Save to user device
  const saveTodoTouserDevice = async(todos)=>{
    try{
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos',stringifyTodos);
    } catch (e){
      console.log(e)
    }
  };

  // Get From users device
  const getFromUser = async() =>{
    try{
      const todos = await AsyncStorage.getItem('todos');
      if(todos != null){
        setTodos(JSON.parse(todos));
      }
    }
    catch(e){
      console.log(e)
    }
  }

  // Mark as complete
  const markTodoComplete = (todoId) => {
    const newTodos = todos.map((item) => {
      if (item.id == todoId) {
        return { ...item, completed: true };
      }
      return item;
    });
    setTodos(newTodos);
  };

  // Delete Todo
  const deleteTodo = (todoId) => {
    const newTodo1 = todos.filter((item) => item.id != todoId);
    setTodos(newTodo1);
  };

  // Delete all Todo
  const deleteAll = () => {
    Alert.alert("Confirm", "clear all tasks?", [
      {
        text: "Yes",
        onPress: () => setTodos([]),
      },
      {
        text: "No",
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.blue }}>
      {/* HEADER  */}
      <View style={styles.header}>
        <Text
          style={{ fontWeight: "bold", fontSize: 30, color: COLORS.primary }}
        >
          TODO APP
        </Text>
        <Icon name="delete" size={25} color="red" onPress={deleteAll} />
      </View>

      {/* LIST OF TASK */}
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        data={todos}
        renderItem={({ item }) => <ListItem todo={item} />}
      />

      {/* FOOTER + INPUT  */}
      <View style={styles.footer}>
        <View style={styles.inputCont}>
          <TextInput
            value={textInput}
            onChangeText={(text) => setTextInput(text)}
            placeholder="Add Todo Item"
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color={COLORS.white} size={30} />
          </View>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    color: COLORS.blue,
    backgroundColor: COLORS.blue,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  inputCont: {
    backgroundColor: COLORS.white,
    elevation: 7,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    elevation: 12,
    borderRadius: 7,
    // justifyContent: 'center',
    marginVertical: 10,
  },

  actionIcons: {
    height: 25,
    width: 25,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    marginBottom: 0,
    borderRadius: 3,
  },
});
