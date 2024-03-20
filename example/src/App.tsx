import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from "./main-page"


const Stack = createStackNavigator();

export default function App() {
  return (

      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainPage">
          <Stack.Screen name="MainPage" component={MainPage} options={{ title: "Ttlock Demo" }} />
         
        </Stack.Navigator>
      </NavigationContainer>


  );
}