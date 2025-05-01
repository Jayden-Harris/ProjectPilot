import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePicker from "@react-native-community/datetimepicker";
import Environment from "./env";

const Dashboard: React.FC = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const url = Environment.env === "dev" ? Environment.dev_url : Environment.prod_url;

  const statusOptions = [
    { key: "1", value: "Not Started" },
    { key: "2", value: "In Progress" },
    { key: "4", value: "On Hold" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const userObject = JSON.parse(user);
        setUserName(userObject.name);
      }
    };

    const fetchTasks = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${url}/api/tasks`, {
          headers: { Authorization: token },
        });
        const sortedTasks = response.data.tasks.sort(
          (a: any, b: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        setTasks(sortedTasks);
      } catch (err) {
        console.error("Failed to fetch tasks", err?.response?.data || err.message);
      }
    };

    fetchUserData();
    fetchTasks();
  }, []);

  const openModal = (task: any) => {
    setSelectedTask(task);
    setTaskName(task.taskName);
    setTaskDescription(task.taskDescription);
    setTaskDeadline(task.deadline);
    setTaskStatus(task.status || "Not Started");
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleCompleteTask = async () => {
    if (!selectedTask) return;

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${url}/api/tasks/delete`, {
        headers: { Authorization: token },
        data: { taskId: selectedTask._id },
      });

      const updatedTasks = tasks.filter((task) => task._id !== selectedTask._id);
      setTasks(updatedTasks);
      setModalVisible(false);
    } catch (err) {
      console.error("Failed to delete task", err?.response?.data || err.message);
    }
  };

  const handleEditTask = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedTask) return;

    const selectedStatusValue = statusOptions.find((opt) => opt.key === taskStatus)?.value || taskStatus;

    try {
      const token = await AsyncStorage.getItem("token");
      await axios.put(
        `${url}/api/tasks/edit`,
        {
          taskId: selectedTask._id,
          updates: {
            taskName,
            taskDescription,
            taskDeadline,
            status: selectedStatusValue,
          },
        },
        {
          headers: { Authorization: token },
        }
      );

      const updatedTasks = tasks.map((task) =>
        task._id === selectedTask._id
          ? { ...task, taskName, taskDescription, deadline: taskDeadline, status: selectedStatusValue }
          : task
      );
      setTasks(updatedTasks);
      setModalVisible(false);
    } catch (err) {
      console.error("Failed to update task", err?.response?.data || err.message);
    }
  };


  const renderTask = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.taskCard} onPress={() => openModal(item)}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskName}>{item.taskName}</Text>
        <Text style={styles.taskDeadline}>{new Date(item.deadline).toDateString()}</Text>
      </View>
      <View style={styles.taskRow}>
        <View style={styles.taskDescriptionWrapper}>
          <Text style={styles.taskDescription} numberOfLines={2}>{item.taskDescription}</Text>
        </View>
        <Text style={styles.taskStatus}>{item.status || "Pending"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => navigation.navigate("settings")}
        >
          <Image
            source={{ uri: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" }}
            style={styles.avatar}
          />
          <Text style={styles.headerTitle}>{userName || "User"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerSubtitle}>Manage your projects and tasks from your dashboard</Text>
      </View>

      <View style={styles.quickActionsContainer}>
        {[
          { label: "Create Project", screen: "CreateProject" },
          { label: "My Projects", screen: "ProjectDashboard" },
          { label: "Create Client", screen: "CreateClient" },
          { label: "Create Task", screen: "CreateTask" },
        ].map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickActionButton}
            onPress={() => navigation.navigate(action.screen)}
          >
            <Text style={styles.quickActionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tasksSection}>
        <Text style={styles.sectionTitle}>Current Tasks by Deadline</Text>
        {tasks.length === 0 ? (
          <Text style={styles.noTasks}>No tasks available.</Text>
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
          />
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {selectedTask && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedTask.taskName}</Text>
                  <Text style={styles.taskStatus}>{selectedTask.status || "Pending"}</Text>
                </View>
                <Text style={styles.modalDeadline}>Deadline: {new Date(selectedTask.deadline).toDateString()}</Text>
                {!isEditing ? (
                  <Text style={styles.modalDescription}>{selectedTask.taskDescription}</Text>
                ) : (
                  <View style={{ marginTop: 10 }}>
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Task Name</Text>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Task Name"
                        value={taskName}
                        onChangeText={setTaskName}
                      />
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Task Description</Text>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Task Description"
                        value={taskDescription}
                        onChangeText={setTaskDescription}
                        multiline
                      />
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Task Status</Text>
                      <SelectList
                        setSelected={(val) => setTaskStatus(val)} 
                        data={statusOptions}
                        defaultOption={statusOptions.find(option => option.value === taskStatus)}
                        boxStyles={styles.modalInput}
                        inputStyles={{ fontSize: 14,  }}
                        search={false}
                      />
                    </View>

                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Deadline</Text>
                      <DateTimePicker
                        value={taskDeadline ? new Date(taskDeadline) : new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          if (selectedDate) {
                            setTaskDeadline(selectedDate.toISOString());
                          }
                        }}
                      />
                    </View>
                  </View>
                )}

                <View style={isEditing ? styles.modalButtonsSmall : styles.modalButtons}>
                  {!isEditing ? (
                    <>
                      <TouchableOpacity style={styles.deleteButton} onPress={handleCompleteTask}>
                        <Text style={styles.buttonText}>Complete</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.editButton} onPress={handleEditTask}>
                        <Text style={styles.buttonText}>Edit</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                        <Text style={styles.buttonText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    backgroundColor: "#9333ea",
    paddingVertical: 65,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
    textAlign: "center",
  },
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  quickActionButton: {
    backgroundColor: "#9333ea",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  quickActionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  tasksSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4b5563",
    marginBottom: 15,
  },
  noTasks: {
    fontSize: 16,
    color: "#6b7280",
    fontStyle: "italic",
  },
  taskCard: {
    backgroundColor: "#f3e8ff",
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 8,
    borderLeftColor: "#9333ea",
    marginBottom: 15,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskName: {
    fontSize: 18,
    fontWeight: "600",
  },
  taskDeadline: {
    fontSize: 12,
    color: "#6b7280",
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  taskDescriptionWrapper: {
    flex: 1,
  },
  taskDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  taskStatus: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    maxWidth: 500,
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDeadline: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: "#6b7280",
  },
  fieldGroup: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#f3f4f6",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButtonsSmall: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: "#9333ea",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#9333ea",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#d1d5db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

