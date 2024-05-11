import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen(): React.JSX.Element {
  return (
    <></>
  );
}

export default App;
