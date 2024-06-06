import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from '@ui-kitten/components';
import { default as theme } from './theme.json';
import { AppNavigator } from './components/Navigator.tsx';

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
  useEffect(() => {
    const error = console.error;
    console.error = (...args: any) => {
      if (/defaultProps/.test(args[0])) {
        return;
      }
      error(...args);
    };
  }, []);

  const [isFirst, setIsFirst] = useState(true);

  getItem('first-login').then(value => {
    if (value !== '') {
      setIsFirst(false);
    }
  });

  return (
    <>
      <ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
        <NavigationContainer>
          <AppNavigator isFirst={isFirst} />
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}

function HomeScreen(): React.JSX.Element {
  getItem('first-login');

  return <></>;
}

export default App;
