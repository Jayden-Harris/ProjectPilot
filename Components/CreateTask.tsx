import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SelectList } from "react-native-dropdown-select-list"; 
import Environment from "./env"

const CreateTask: React.FC = () => {
  const navigation = useNavigation();

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [status, setStatus] = useState("Not Started");
  const [showPicker, setShowPicker] = useState(false);
  const url = Environment.env === "dev" ? Environment.dev_url : Environment.prod_url;

  const statusOptions = [
    { key: "1", value: "Not Started" },
    { key: "2", value: "In Progress" },
    { key: "4", value: "On Hold" },
  ];

  const onChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) setDeadline(selectedDate);
  };

  const handleCreateTask = async () => {
    if (!taskName || !taskDescription || !deadline) {
      Alert.alert("Please fill out all required fields before submitting.");
      return;
    }

    const taskData = {
      taskName,
      taskDescription,
      deadline: deadline.toISOString(),
      status,
    };

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Unauthorized", "Token not found. Please login again.");
        return;
      }

      const response = await axios.post(
       `${url}/api/tasks/add`,
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      console.log("Task created successfully", response.data);
      Alert.alert("Success", "Task created successfully");
      navigation.navigate("Dashboard");
    } catch (error: any) {
      console.error("Error creating task:", error?.response?.data || error.message);
      Alert.alert("Error", "Something went wrong while creating the task.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create a New Task</Text>

        <TextInput
          label="Task Name"
          value={taskName}
          onChangeText={setTaskName}
          style={styles.input}
          theme={{ colors: { primary: "#9333ea" } }}
        />

        <TextInput
          label="Task Description"
          value={taskDescription}
          onChangeText={setTaskDescription}
          style={styles.input}
          multiline
          numberOfLines={4}
          theme={{ colors: { primary: "#9333ea" } }}
        />

        <Text style={styles.label}>Deadline</Text>
        <TouchableOpacity
          onPress={() => setShowPicker(!showPicker)}
          style={styles.dateButton}
          activeOpacity={0.7}
        >
          <Text style={styles.dateButtonText}>{deadline.toDateString()}</Text>
        </TouchableOpacity>

        {showPicker && (
          <View style={styles.datePickerWrapper}>
            <DateTimePicker
              value={deadline}
              mode="date"
              display="inline"
              onChange={onChange}
              style={{ width: "100%" }}
            />
          </View>
        )}

        <Text style={styles.label}>Status (Optional)</Text>
        <View style={styles.input}>
          <SelectList
            setSelected={setStatus}
            data={statusOptions}
            save="value"
            placeholder="Select status"
            boxStyles={{ borderColor: "#9333ea" }}
            dropdownStyles={{ borderColor: "#9333ea" }}
          />
        </View>

        <Button mode="contained" onPress={handleCreateTask} style={styles.button}>
          Create Task
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.outlineButton}
          labelStyle={styles.outlineButtonText}
        >
          Cancel
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 70,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#9333ea",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 10,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  datePickerWrapper: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  button: {
    backgroundColor: "#9333ea",
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  outlineButton: {
    borderColor: "#9333ea",
    borderWidth: 2,
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "white",
  },
  outlineButtonText: {
    color: "#9333ea",
    fontWeight: "bold",
  },
});

export default CreateTask;
