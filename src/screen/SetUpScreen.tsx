import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, TouchableOpacity, View } from 'react-native';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Subject } from 'rxjs';
import React from 'react';
import { IngredientAutoComplete } from '../components/IngredientAutoComplete.tsx';
import { Autocomplete, Button, Text } from '@ui-kitten/components';

type SetUpStackParamList = {
  welcome: undefined;
  ingredient: undefined;
};

const SetUpStack = createNativeStackNavigator<SetUpStackParamList>();

export default function SetUpScreen(): React.JSX.Element {
  return (
    <>
      <SetUpStack.Navigator>
        <SetUpStack.Screen
          name="welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <SetUpStack.Screen
          name="ingredient"
          component={Ingredient}
          options={{ headerShown: false }}
        />
      </SetUpStack.Navigator>
    </>
  );
}

function Welcome(): React.JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<SetUpStackParamList>>();

  const nextStep = () => {
    navigation.navigate('ingredient');
  };

  return (
    <>
      <View style={styles.commonView}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.commonDescription}>
          당신의 냉장고를 구성하세요.
        </Text>
        <TouchableOpacity style={styles.setUpButton} onPress={nextStep}>
          <Text style={styles.setUpButtonText}>지금 시작하세요</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

type AutoCompletionRequest = {
  type: AutoCompletionType;
  data: string;
  origin: any;
};

type AutoCompletionResponse = {
  type: AutoCompletionType;
  data: string[];
  origin: any;
};

type AutoCompletionType = 'ingredient' | 'sauce';

const AutoCompletionRequestSubject$ = new Subject<AutoCompletionRequest>();
const AutoCompletionResponseSubject$ = new Subject<AutoCompletionResponse>();
const AutoCompletionService = {
  onRequest: AutoCompletionRequestSubject$.asObservable(),
  onResponse: AutoCompletionResponseSubject$.asObservable(),
  request(req: AutoCompletionRequest) {
    AutoCompletionRequestSubject$.next(req);
  },
  response(res: AutoCompletionResponse) {
    AutoCompletionResponseSubject$.next(res);
  },
};

// 재료 작성
function Ingredient(): React.JSX.Element {
  // @ts-ignore
  const [list, setList] = useState([
    <IngredientAutoComplete completionKey={0} key={0} />,
    <IngredientAutoComplete completionKey={1} key={1} />,
    <IngredientAutoComplete completionKey={2} key={2} />,
  ]);

  const addNewInput = () => {
    setList([
      ...list,
      <IngredientAutoComplete completionKey={list.length} key={list.length} />,
    ]);
  };

  return (
    <>
      <SafeAreaView style={styles.commonView}>
        <Text style={styles.commonTitle}>재료를 입력해주세요</Text>
        {list}
        <Button onPress={addNewInput}>ADD</Button>
        <Button>SUBMIT</Button>
      </SafeAreaView>
    </>
  );
}
