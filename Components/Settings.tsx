import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileSettings: React.FC = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<{ name: string; email: string; password: string }>({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    };
    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      if (!user.name || !user.email || !user.password) {
        Alert.alert("Error", "All fields are required!");
        return;
      }

      // Save updated user data to AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(user));
      Alert.alert("Success", "Your changes have been saved!");
      navigation.goBack(); // Navigate back after saving
    } catch (error) {
      Alert.alert("Error", "Failed to save changes. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.form}>
        {/* Username Field */}
        <TextInput
          style={styles.input}
          value={user.name}
          onChangeText={(text) => setUser({ ...user, name: text })}
          placeholder="Username"
        />

        {/* Email Field */}
        <TextInput
          style={styles.input}
          value={user.email}
          onChangeText={(text) => setUser({ ...user, email: text })}
          placeholder="Email"
          keyboardType="email-address"
        />

        {/* Password Field */}
        <TextInput
          style={styles.input}
          value={user.password}
          onChangeText={(text) => setUser({ ...user, password: text })}
          placeholder="Password"
          secureTextEntry
        />

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("token");
       
            navigation.navigate("Home");
          }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Go Back to Home Button */}
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.goBackButtonText}>Go Back to Home</Text>
        </TouchableOpacity>
        {/* Logout Button */}
        
      </View>
    </View>
  );
};

export default ProfileSettings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  
  saveButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#9333ea",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  saveButtonText: {
    color: "#9333ea",
    fontSize: 16,
    fontWeight: "600",
  },
  
  goBackButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#9333ea",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  goBackButtonText: {
    color: "#9333ea",
    fontSize: 16,
    fontWeight: "600",
  },
  
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#9333ea",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },
  logoutButtonText: {
    color: "#9333ea",
    fontSize: 16,
    fontWeight: "600",
  },
});
