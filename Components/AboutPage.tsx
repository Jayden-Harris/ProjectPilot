import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AboutPage: React.FC = () => {
  const navigation = useNavigation(); // Navigation hook

  const handleGetStarted = () => {
    navigation.navigate("AuthPage"); // Navigate to AuthPage
  };

  const handleGoBack = () => {
    navigation.goBack(); // Navigate back to the previous page (Home Page)
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Introduction Section */}
      <View style={styles.section}>
        <Text style={styles.title}>About ProjectPilot</Text>
        <Text style={styles.paragraph}>
          Welcome to ProjectPilot! We are dedicated to providing a seamless experience to freelancers by streamlining project and client management, time tracking, and project organization. Our goal is to help you work smarter, not harder.
        </Text>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Key Features</Text>
        <Text style={styles.paragraph}>
          Our app comes with a variety of features to help you manage your freelance workflow:
        </Text>
        <View style={styles.featuresList}>
          <Text style={styles.feature}>• Customer Management: Keep track of client details and project history.</Text>
          <Text style={styles.feature}>• Time Tracking: Track hours spent on each project.</Text>
          <Text style={styles.feature}>• Project Overview: View project status and timelines.</Text>
        </View>
      </View>


      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginTop: 40,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#9333ea", // Purple color from the app
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#4b5563", // Darker gray for section titles
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: "#6b7280", // Light gray text for paragraphs
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  featuresList: {
    marginLeft: 20,
  },
  feature: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 5,
  },
  subscriptionList: {
    marginTop: 20,
    marginLeft: 20,
  },
  subscriptionTier: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#9333ea", // Purple color for subscription titles
    marginBottom: 5,
  },
  subscriptionPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4b5563", // Darker gray for price
    marginBottom: 10,
  },
  subscriptionDetails: {
    fontSize: 16,
    color: "#6b7280", // Light gray text for subscription details
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 16,
    color: "#4b5563", // Darker gray for contact info
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 30,
    alignItems: "center",
    flexDirection: "row", // Arrange buttons side by side
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#9333ea", // Purple color from the app
    paddingVertical: 12, // Reduced padding for smaller button height
    paddingHorizontal: 30, // Reduced horizontal padding
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginRight: 10, // Add spacing between buttons
  },
  buttonText: {
    fontSize: 16, // Slightly smaller font size
    fontWeight: "600",
    color: "#fff",
  },
});

export default AboutPage;
