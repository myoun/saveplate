import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screen/HomeScreen.tsx';
import SetUpScreen from '../screen/SetUpScreen.tsx';
import { useNavigation } from '@react-navigation/native';

const { Navigator, Screen } = createNativeStackNavigator();

const HomeNavigator = () => (
  <Navigator screenOptions={{ headerShown: false }} initialRouteName="main">
    <Screen name="main" component={HomeScreen} />
  </Navigator>
);

export type AppNavigatorParamList = {
  Home: undefined;
  SetUp: undefined;
};

export type AppNavigatorProps = {
  isFirst: boolean;
};

export const AppNavigator = (props: AppNavigatorProps) => {
  const { isFirst } = props;

  const navigation = useNavigation();

  if (!isFirst) {
    // @ts-ignore
    navigation.navigate('Home');
  }

  const initialRouteName = isFirst ? 'SetUp' : 'Home';

  return (
    <Navigator initialRouteName={initialRouteName}>
      <Screen
        name="Home"
        component={HomeNavigator}
        options={{ headerShown: false }}
      />
      <Screen
        name="SetUp"
        component={SetUpScreen}
        options={{ headerShown: false }}
      />
    </Navigator>
  );
};
