import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SetUpScreen from './screen/SetUpScreen';

export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    
    // 저장값 확인을 위한 console.log
    console.log(`setItem... ${key} : ${value}`);
  } catch (e) {
    throw e;
  }
};

export const getItem = async (key: string) => {
  try {
    const res = await AsyncStorage.getItem(key);
    return res || '';
  } catch (e) {
    throw e;
  }
};

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [isFirst, setIsFirst] = useState(true)

  getItem("first-login").then((value) => {
    if (value != "") setIsFirst(false)
  })

  const initialRouteName = isFirst ? "SetUp" : "Home"

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SetUp"
          component={SetUpScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen(): React.JSX.Element {
  getItem("first-login")

  return (
    <></>
  );
}

export default App;
