import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";  // Import useNavigation hook
import AsyncStorage from "@react-native-async-storage/async-storage";
import Environment from "./env";

const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const url = Environment.env === "dev" ? Environment.dev_url : Environment.prod_url;

  // Get the navigation object
  const navigation = useNavigation();

  const handleSubmit = async () => {
    const baseUrl = `${url}/api/auth`; 
  
    if (isRegister) {
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
  
      try {
        const response = await fetch(`${baseUrl}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });
  
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
        
        // Save token and user info
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
        
        navigation.navigate("Dashboard");
      } catch (error: any) {
        console.error("Registration error:", error.message);
        alert(error.message);
      }
    } else {
      try {
        const response = await fetch(`${baseUrl}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

         // Save token and user info
         await AsyncStorage.setItem("token", data.token);
         await AsyncStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
        navigation.navigate("Dashboard"); // Change this route if needed
      } catch (error: any) {
        console.error("Login error:", error.message);
        alert(error.message);
      }
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section with X */}
      <View style={styles.headerSection}>
        {/* X in the top-left */}
        <Text style={styles.appName}>ProjectPilot</Text>
        <Text style={styles.appSubtitle}>
          {isRegister ? "Create your account" : "Welcome back!"}
        </Text>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#6b7280"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#6b7280"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#6b7280"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}

        {/* Button Container */}
        <View style={styles.buttonContainer}>
          {/* Submit Button */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isRegister ? "Register" : "Login"}</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Switch between Login/Register */}
        <TouchableOpacity
          onPress={() => setIsRegister(!isRegister)}
          style={styles.switchTextContainer}
        >
          <Text style={styles.switchText}>
            {isRegister ? "Already have an account? Login" : "Don’t have an account? Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
    paddingBottom: 30,
  },
  headerSection: {
    backgroundColor: "#9333ea",
    paddingVertical: 67,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
   
  },
  appName: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  appSubtitle: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  formSection: {
    padding: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#4b5563",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#9333ea",
    paddingVertical: 12,  // Reduced padding to make the button smaller
    paddingHorizontal: 35,  // Reduced horizontal padding
    borderRadius: 50,
    marginTop: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 0.45,  // Fixed width
    marginRight: 10, // Add space between buttons
  },
  cancelButton: {
    backgroundColor: "#fff",
    borderColor: "#9333ea",
    borderWidth: 2,
    paddingVertical: 12,  // Reduced padding to make the button smaller
    paddingHorizontal: 35,  // Reduced horizontal padding
    borderRadius: 50,
    marginTop: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 0.45,  // Fixed width
  },
  cancelButtonText: {
    color: "#9333ea",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  switchTextContainer: {
    marginTop: 20,
  },
  switchText: {
    fontSize: 16,
    color: "#9333ea",
    textAlign: "center",
  },
});

export default AuthPage;
