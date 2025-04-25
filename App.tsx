import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Components/Home"; // Import the landing page
import AuthPage from "./Components/AuthPage"; // Import the auth page
import AboutPage from "./Components/AboutPage";
import { SafeAreaProvider } from "react-native-safe-area-context"; 
import Dashboard from "./Components/Dashboard";
import ProfileSettings from "./Components/Settings";
import CreateProject from "./Components/CreateProject";
import ProjectDashboard from "./Components/ProjectDashboard";
import CreateClient from "./Components/CreateClient";
import { Provider as PaperProvider } from "react-native-paper";
import CreateTask from "./Components/CreateTask";

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ gestureEnabled: false, headerShown: false }}
            />
            <Stack.Screen
              name="AuthPage"
              component={AuthPage}
              options={{ gestureEnabled: false, headerShown: false }}
            />
            <Stack.Screen
              name="AboutPage"
              component={AboutPage}
              options={{ gestureEnabled: false, headerShown: false }}
            />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{ gestureEnabled: false, headerShown: false }}
            />
            <Stack.Screen
              name="settings"
              component={ProfileSettings}
              options={{ gestureEnabled: false, headerShown: false }}
            />
            <Stack.Screen
              name="CreateProject"
              component={CreateProject}
              options={{ gestureEnabled: false, headerShown: false }}
            />
            <Stack.Screen
              name="ProjectDashboard"
              component={ProjectDashboard}
              options={{ gestureEnabled: false, headerShown: false }}
            />
            <Stack.Screen
              name="CreateClient"
              component={CreateClient}
              options={{ gestureEnabled: false, headerShown: false }}
            />
            <Stack.Screen
              name="CreateTask"
              component={CreateTask}
              options={{ gestureEnabled: false, headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
};

export default App;
