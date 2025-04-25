import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const CreateClient: React.FC = () => {
  const navigation = useNavigation();

  const [clientName, setClientName] = useState("");
  const [clientDescription, setClientDescription] = useState("");

  const handleCreateClient = async () => {
    if (!clientName || !clientDescription) {
      Alert.alert("Please fill out all fields before submitting.");
      return;
    }

    const clientData = {
      clientName,
      clientDescription,
    };

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Unauthorized", "Token not found. Please login again.");
        return;
      }

      const response = await axios.post("http://localhost:8000/api/clients/add", clientData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      console.log("Client created successfully", response.data);
      Alert.alert("Success", "Client created successfully");
      navigation.goBack();

    } catch (error: any) {
      console.error("Error creating client:", error?.response?.data || error.message);
      Alert.alert("Error", "Something went wrong while creating the client.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create a New Client</Text>

        <TextInput
          label="Client Name"
          value={clientName}
          onChangeText={setClientName}
          style={styles.input}
          theme={{ colors: { primary: "#9333ea" } }}
        />

        <TextInput
          label="Client Description"
          value={clientDescription}
          onChangeText={setClientDescription}
          style={styles.input}
          multiline
          numberOfLines={4}
          theme={{ colors: { primary: "#9333ea" } }}
        />

        <Button mode="contained" onPress={handleCreateClient} style={styles.button}>
          Create Client
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate("Dashboard")}
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

export default CreateClient;
