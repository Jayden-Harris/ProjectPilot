import React, { useState, useEffect } from "react";
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

const CreateProject: React.FC = () => {
  const navigation = useNavigation();

  const [projectName, setProjectName] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [clientList, setClientList] = useState<{ key: string; value: string }[]>([]);
  const [projectDescription, setProjectDescription] = useState("");
  const [featuresText, setFeaturesText] = useState(""); // New: raw text input
  const [requestedFeatures, setRequestedFeatures] = useState<string[]>([]);
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          Alert.alert("Unauthorized", "Token not found. Please login again.");
          return;
        }

        const response = await axios.get("http://localhost:8000/api/clients", {
          headers: {
            Authorization: token,
          },
        });

        const clients = response.data.clients;

        if (!clients.length) {
          Alert.alert(
            "No Clients Found",
            "You need to add at least one client before creating a project.",
            [
              {
                text: "Go to Create Client",
                onPress: () => navigation.navigate("CreateClient" as never),
              },
            ]
          );
          return;
        }

        const formattedClients = clients.map((client: any, index: number) => ({
          key: String(index + 1),
          value: client.clientName,
        }));

        setClientList(formattedClients);
      } catch (error: any) {
        console.error("Error fetching clients:", error?.response?.data || error.message);
        Alert.alert("Error", "Could not fetch client list.");
      }
    };

    fetchClients();
  }, []);

  const onChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) setDeadline(selectedDate);
  };

  const handleCreateProject = async () => {
    const featuresArray = featuresText
      .split(",")
      .map((feature) => feature.trim())
      .filter(Boolean);

    if (
      !projectName ||
      !selectedClient ||
      !projectDescription ||
      featuresArray.length === 0
    ) {
      Alert.alert("Please fill out all fields before submitting.");
      return;
    }

    const projectData = {
      projectName,
      clientName: selectedClient,
      projectDescription,
      requestedFeatures: featuresArray,
      deadline: deadline.toISOString(),
    };

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Invalid token error");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/api/projects/add",
        projectData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      console.log("Project created successfully", response.data);
      navigation.goBack();
    } catch (error: any) {
      console.error("Error creating project:", error?.response?.data || error.message);
      Alert.alert("Error", "Something went wrong while creating the project.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create a New Project</Text>

        <TextInput
          label="Project Name"
          value={projectName}
          onChangeText={setProjectName}
          style={styles.input}
          theme={{ colors: { primary: "#9333ea" } }}
        />

        <View style={styles.input}>
          <SelectList
            setSelected={setSelectedClient}
            data={clientList}
            save="value"
            placeholder="Select a client"
            boxStyles={{ borderColor: "#9333ea" }}
            dropdownStyles={{ borderColor: "#9333ea" }}
          />
        </View>

        <TextInput
          label="Project Description"
          value={projectDescription}
          onChangeText={setProjectDescription}
          style={styles.input}
          multiline
          numberOfLines={4}
          theme={{ colors: { primary: "#9333ea" } }}
        />

        <TextInput
          label="Requested Features (Separated by commas)"
          value={featuresText}
          onChangeText={setFeaturesText}
          style={styles.input}
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

        <Button mode="contained" onPress={handleCreateProject} style={styles.button}>
          Create Project
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

export default CreateProject;
