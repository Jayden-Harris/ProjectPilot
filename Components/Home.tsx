import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";

const prod_url = ""
const dev_url = "http://localhost:8000"

// Define the types for navigation
type RootStackParamList = {
  Home: undefined;
  AuthPage: undefined;
};

const faqData = [
  {
    question: "Is ProjectPilot free to use?",
    answer: "Yes! The app is completely free to use with no payment required.",
  },
  {
    question: "Can I use ProjectPilot on multiple devices?",
    answer: "Absolutely. Your data syncs seamlessly across all your logged-in devices.",
  },
  {
    question: "Is my data secure?",
    answer: "We use encrypted storage and follow industry best practices to protect your data.",
  },
];

const Home: React.FC = () => {
  const navigation = useNavigation<HomeNavigationProp>(); // Initialize navigation

  const handleGetStarted = () => {
    navigation.navigate("AuthPage"); // Navigate to the AuthPage
  };

  const handleLearnMore = () => {
    navigation.navigate("AboutPage"); // Navigate to the AuthPage
  };

  type HomeNavigationProp = NavigationProp<RootStackParamList, "Home">;

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        navigation.navigate("Dashboard");
      } else {
        navigation.navigate("Home"); // or Login screen
      }
    };

    checkLogin();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* App Title */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>ProjectPilot</Text>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Streamline Your Freelance Workflow</Text>
        <Text style={styles.heroSubtitle}>
          Manage clients, track time, and stay organized with ease.
        </Text>
        <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        {/* Optional secondary CTA */}
        <TouchableOpacity style={styles.secondaryButton} onPress={handleLearnMore}>
          <Text style={styles.secondaryButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>App Features</Text>
        <View style={styles.featuresList}>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Customer Management</Text>
            <Text style={styles.featureDescription}>
              Keep track of client details and project history in one place.
            </Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Time Tracking</Text>
            <Text style={styles.featureDescription}>
              Easily track hours spent on each project with an integrated timer.
            </Text>
          </View>
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>Project Overview</Text>
            <Text style={styles.featureDescription}>
              View project status and timelines to ensure timely delivery.
            </Text>
          </View>
        </View>
      </View>

      {/* FAQ Section */}
      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
        {faqData.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => toggleFaq(index)}
          >
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            {expandedIndex === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} ProjectPilot. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  footer: {
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: "#f3f4f6", // light gray
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  footerText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
    paddingBottom: 10,
  },
  header: {
    backgroundColor: "#9333ea", // Purple color from the app
    paddingTop: 70,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSection: {
    backgroundColor: "#9333ea",
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  heroSubtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
    maxWidth: 300,
  },
  primaryButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButton: {
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: "#ddd",
    borderRadius: 50,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9333ea",
  },
  featuresSection: {
    padding: 20,
    alignItems: "center",
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 20,
    textAlign: "center",
  },
  featuresList: {
    flexDirection: "row",
    justifyContent: "center", // Centers the items horizontally
    alignItems: "center", // Aligns items vertically in the center
    flexWrap: "wrap",
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 15,
    width: "80%", // Keeps the cards responsive to screen size
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4b5563",
    marginBottom: 10,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  featureIcon: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
  testimonialsSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },
  testimonialsTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 10,
    textAlign: "center",
  },
  testimonialCard: {
    backgroundColor: "#f4f4f4",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  testimonialText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 10,
  },
  testimonialAuthor: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4b5563",
    textAlign: "center",
  },
  faqSection: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 20,
  },
  faqTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 15,
    textAlign: "center",
  },
  faqItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4b5563",
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
});

export default Home;
