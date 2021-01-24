import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TaskList from "./src/components/TaskList";
import * as Animatable from "react-native-animatable";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Deixando um botão "TouchableOpacity" animado

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  // Buscando tarefas ao iniciar o app

  useEffect(() => {
    async function loadTasks() {
      const taskStorage = await AsyncStorage.getItem("@task");
      if (taskStorage) {
        setTask(JSON.parse(taskStorage));
      }
    }
    loadTasks();
  }, []);

  // Salvando caso alguma tarefa alterada

  useEffect(() => {
    async function saveTasks() {
      await AsyncStorage.setItem("@task", JSON.stringify(task));
    }

    saveTasks();
  }, [task]);

  // Adicionar novas tasks

  function handleAdd() {
    if (input === "") return;

    const data = {
      key: input,
      task: input,
    };

    setTask([...task, data]);
    setOpen(false);
    setInput("");
  }

  // Deletar Tasks

  const handleDelete = useCallback((data) => {
    const find = task.filter((r) => r.key !== data.key);
    setTask(find);
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#AB81CD" barStyle="dark-content" />

      {/* Título do app */}

      <View style={styles.content}>
        <Text style={styles.title}>O que preciso fazer hoje?</Text>
      </View>

      {/* Lista */}

      <FlatList
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false}
        data={task}
        keyExtractor={(item) => String(item.key)}
        renderItem={({ item }) => (
          <TaskList data={item} handleDelete={handleDelete} />
        )}
      />

      {/* Página cadastrar tarefa */}

      <Modal 
      animationType="slide" 
      transparent={false} 
      visible={open}>

        <SafeAreaView style={styles.modal}>

          <View style={styles.modalHeader}>

            <TouchableOpacity 
            onPress={() => setOpen(false)}>

              <Ionicons
                style={{ marginLeft: 5, marginRight: 5 }}
                name="md-arrow-back"
                size={40}
                color="#000"
              />

            </TouchableOpacity>

            <Text style={styles.modalTitle}>Nova tarefa</Text>

          </View>

          <View style={styles.modalBody}>
            <TextInput
              multiline={true}
              autoCorrect={false}
              placeholder="Digite sua nova tarefa"
              style={styles.input}
              value={input}
              onChangeText={(texto) => setInput(texto)}
            />

            <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
              <Text style={styles.handleAddText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Botão cadastrar tarefa*/}

      <AnimatedBtn
        style={styles.fab}
        useNativeDriver
        animation="bounceInUp"
        duration={1500}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="ios-add" size={35} color="#FFF" />
      </AnimatedBtn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AB81CD",
  },
  title: {
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 25,
    textAlign: "center",
    color: "#FFF",
  },
  fab: {
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: "#5D408C",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    right: 10,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3,
    },
  },
  modal: {
    flex: 1,
    backgroundColor: "#5D408C",
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  modalTitle: {
    marginLeft: 15,
    fontSize: 20,
    color: "#FFF",
  },
  modalBody: {
    marginTop: 15,
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: "#FFF",
    padding: 15,
    height: 85,
    textAlignVertical: "top",
    color: "#000",
    borderRadius: 5,
  },
  handleAdd: {
    backgroundColor: "#FFF",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5,
  },
  handleAddText: {
    fontSize: 20,
  },
});
