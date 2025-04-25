import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Animated,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from "react-native-animatable";

const ProjectDashboard: React.FC = () => {
  const navigation = useNavigation();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<any>({});
  const [featuresText, setFeaturesText] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const fetchProjects = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8000/api/projects", {
        headers: {
          Authorization: token,
        },
      });
      setProjects(res.data.projects);
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert("Session expired. Please log in again.");
        navigation.navigate("AuthPage");
      } else {
        Alert.alert("Failed to load projects.");
        console.error("Fetch failed:", error);
      }
    }
  };

  const deleteProject = async (projectId: string) => {
    const token = await AsyncStorage.getItem("token");
    try {
      await axios.delete("http://localhost:8000/api/projects/delete", {
        headers: { Authorization: token },
        data: { projectId },
      });
      Alert.alert("Project deleted");
      setModalVisible(false);
      fetchProjects();
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert("Session expired. Please log in again.");
        navigation.navigate("AuthPage");
      } else {
        Alert.alert("Failed to delete project.");
      }
    }
  };

  const saveChanges = async () => {
    const token = await AsyncStorage.getItem("token");
    const cleanedFeatures = featuresText
      .split(",")
      .map(f => f.trim())
      .filter(f => f.length > 0);

    try {
      await axios.put(
        "http://localhost:8000/api/projects/edit",
        {
          projectId: editedProject._id,
          updates: {
            projectName: editedProject.projectName,
            clientName: editedProject.clientName,
            projectDescription: editedProject.projectDescription,
            requestedFeatures: cleanedFeatures,
            status: editedProject.status,
            deadline: editedProject.deadline,
          },
        },
        {
          headers: { Authorization: token },
        }
      );

      Alert.alert("Project updated successfully!");
      setIsEditing(false);
      setModalVisible(false);
      fetchProjects();
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert("Session expired. Please log in again.");
        navigation.navigate("AuthPage");
      } else {
       Alert.alert("Failed to update project. Please try again later");
        console.error("Update failed:", error);
      }
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setEditedProject({
        ...editedProject,
        deadline: selectedDate.toISOString(),
      });
    }
  };

  const openModal = (project: any) => {
    setSelectedProject(project);
    setEditedProject({ ...project });
    setFeaturesText((project.requestedFeatures || []).join(", "));
    setIsEditing(false);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>My Projects</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CreateProject")}>
          <Text style={styles.addButtonText}>+ New Project</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {projects.length === 0 ? (
          <Text style={styles.emptyText}>No projects found</Text>
        ) : (
          projects.map((project: any, i) => (
            <Animatable.View
              key={project._id}
              animation="fadeInUp"
              delay={i * 100}
              duration={500}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => openModal(project)}
              >
                <Text style={styles.cardTitle}>{project.projectName}</Text>
                <Text style={styles.cardClient}>{project.clientName}</Text>
                <Text style={styles.cardDeadline}>
                  Deadline: {new Date(project.deadline).toDateString()}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]}>
          <View style={styles.modalContainer}>
            {selectedProject && (
              <>
                {isEditing ? (
                  <>
                    <Text style={styles.modalLabel}>Project Name</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editedProject.projectName}
                      onChangeText={(text) =>
                        setEditedProject({ ...editedProject, projectName: text })
                      }
                    />

                    <Text style={styles.modalLabel}>Client Name</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editedProject.clientName}
                      onChangeText={(text) =>
                        setEditedProject({ ...editedProject, clientName: text })
                      }
                    />

                    <Text style={styles.modalLabel}>Description</Text>
                    <TextInput
                      style={[styles.modalInput, { height: 80 }]}
                      multiline
                      value={editedProject.projectDescription}
                      onChangeText={(text) =>
                        setEditedProject({ ...editedProject, projectDescription: text })
                      }
                    />

                    <Text style={styles.modalLabel}>Features</Text>
                    <TextInput
                      style={[styles.modalInput, { height: 80 }]}
                      multiline
                      placeholder="e.g. login, dashboard"
                      value={featuresText}
                      onChangeText={setFeaturesText}
                    />

                    <Text style={styles.modalLabel}>Deadline</Text>
                    <DateTimePicker
                      value={
                        editedProject.deadline
                          ? new Date(editedProject.deadline)
                          : new Date()
                      }
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />

                    <View style={styles.modalButtons}>
                      

                      <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
                        <Text style={styles.buttonText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          setIsEditing(false);
                          setEditedProject({ ...selectedProject });
                          setFeaturesText((selectedProject.requestedFeatures || []).join(", "));
                        }}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalTitle}>{selectedProject.projectName}</Text>
                    <Text style={styles.modalClient}>Client: {selectedProject.clientName}</Text>
                    <Text style={styles.modalDescription}>{selectedProject.projectDescription}</Text>
                    <Text style={styles.modalDeadline}>
                      Deadline: {new Date(selectedProject.deadline).toDateString()}
                    </Text>
                    <Text style={styles.modalFeaturesTitle}>Features:</Text>
                    {selectedProject.requestedFeatures.map((feature: string, index: number) => (
                      <Text key={index} style={styles.featureItem}>• {feature}</Text>
                    ))}

                    <View style={styles.modalButtons}>
                      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                        <Text style={styles.buttonText}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteProject(selectedProject._id)}
                      >
                        <Text style={styles.buttonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
};

export default ProjectDashboard;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 70,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: "#9333ea",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  addButton: {
    padding: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  scrollContainer: {
    padding: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },

  card: {
    backgroundColor: "#f3e8ff",
    borderLeftWidth: 6,
    borderLeftColor: "#9333ea",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4c1d95",
  },
  cardClient: {
    fontSize: 16,
    marginTop: 5,
    color: "#6b21a8",
  },
  cardDeadline: {
    fontSize: 14,
    marginTop: 5,
    color: "#7c3aed",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalClient: {
    fontSize: 16,
    marginTop: 10,
  },
  modalDescription: {
    marginTop: 10,
    fontSize: 14,
  },
  modalDeadline: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
  },
  modalFeaturesTitle: {
    marginTop: 15,
    fontWeight: "bold",
    fontSize: 16,
  },
  featureItem: {
    fontSize: 14,
    marginLeft: 10,
    marginTop: 5,
  },
  modalLabel: {
    fontWeight: "bold",
    marginTop: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#9333ea",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  editButton: {
    backgroundColor: "#9333ea",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    gap: 10,
  },
  closeButton: {
    marginTop: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#9333ea",
    fontSize: 16,
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#f3e8ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#4c1d95",
  },
});
