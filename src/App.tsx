import { NavigationContainer } from '@react-navigation/native';
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
import { StorageManager } from './storage.ts';

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

  StorageManager.getItem('first-login').then(value => {
    console.log(value);
    if (value !== null) {
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

export default App;
