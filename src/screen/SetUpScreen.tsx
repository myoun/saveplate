import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';
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
import { Button, Text } from '@ui-kitten/components';
import { StorageManager } from '../storage.ts';
import { AppNavigatorParamList } from '../components/Navigator.tsx';

type SetUpStackParamList = {
  welcome: undefined;
  ingredient: undefined;
  sauce: undefined;
};

type SetUpValueContext = {
  ingredients: string[];
  sauces: string[];
};

type SetUpActionsContext = {
  updateIngredients: (l: string[]) => void;
  updateSauces: (l: string[]) => void;
};

// @ts-ignore
const SetUpActionsContext = createContext<SetUpActionsContext>();
// @ts-ignore
const SetUpValueContext = createContext<SetUpValueContext>();

function useSetUpValue() {
  const value = useContext(SetUpValueContext);
  if (value === undefined) {
    throw new Error('useSetUpValue should be used within SetUpProvider');
  }
  return value;
}

function useSetUpActions() {
  const value = useContext(SetUpActionsContext);
  if (value === undefined) {
    throw new Error('useSetUpActions should be used within SetUpProvider');
  }
  return value;
}

function SetUpProvider(props: { children: any }) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [sauces, setSauces] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      ingredients,
      sauces,
    }),
    [ingredients, sauces],
  );

  const actions = useMemo<SetUpActionsContext>(
    () => ({
      updateIngredients: setIngredients,
      updateSauces: setSauces,
    }),
    [],
  );

  return (
    <SetUpActionsContext.Provider value={actions}>
      <SetUpValueContext.Provider value={value}>
        {props.children}
      </SetUpValueContext.Provider>
    </SetUpActionsContext.Provider>
  );
}

const SetUpStack = createNativeStackNavigator<SetUpStackParamList>();

export default function SetUpScreen(): React.JSX.Element {
  return (
    <>
      <SetUpProvider>
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
          <SetUpStack.Screen
            name="sauce"
            component={Sauce}
            options={{ headerShown: false }}
          />
        </SetUpStack.Navigator>
      </SetUpProvider>
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

type IngredientType = {
  [key: number]: string;
};

// 재료 작성
function Ingredient(): React.JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<SetUpStackParamList>>();

  const ingredientRef = useRef<IngredientType>({});

  const setIngredient = (key: number, value: string) => {
    ingredientRef.current = {
      ...ingredientRef.current,
      [key]: value,
    };
  };

  // @ts-ignore
  const [list, setList] = useState([
    <IngredientAutoComplete
      completionKey={0}
      key={0}
      setIngredient={setIngredient}
    />,
  ]);

  const addNewInput = () => {
    setList([
      ...list,
      <IngredientAutoComplete
        completionKey={list.length}
        key={list.length}
        setIngredient={setIngredient}
      />,
    ]);
  };

  const { updateIngredients } = useSetUpActions();

  const submit = () => {
    const ingredient = ingredientRef.current;
    const v = Object.values(ingredient);
    updateIngredients(v);
    navigation.navigate('sauce');
  };

  return (
    <>
      <SafeAreaView style={styles.commonView}>
        <Text style={styles.commonTitle}>재료를 입력해주세요</Text>
        {list}
        <Button onPress={addNewInput}>ADD</Button>
        <Button onPress={submit}>SUBMIT</Button>
      </SafeAreaView>
    </>
  );
}

function Sauce() {
  const navigation =
    useNavigation<NativeStackNavigationProp<SetUpStackParamList>>();
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<AppNavigatorParamList>>();

  const sauceRef = useRef<IngredientType>({});

  const setSauce = (key: number, value: string) => {
    sauceRef.current = {
      ...sauceRef.current,
      [key]: value,
    };
  };

  // @ts-ignore
  const [list, setList] = useState([
    <IngredientAutoComplete
      completionKey={0}
      key={0}
      setIngredient={setSauce}
    />,
  ]);

  const addNewInput = () => {
    setList([
      ...list,
      <IngredientAutoComplete
        completionKey={list.length}
        key={list.length}
        setIngredient={setSauce}
      />,
    ]);
  };

  const { updateSauces } = useSetUpActions();

  const submit = () => {
    const ingredient = sauceRef.current;
    const v = Object.values(ingredient);
    updateSauces(v);
    StorageManager.setItem('first-login', 'true');
    rootNavigation.navigate('Home');
  };

  return (
    <>
      <SafeAreaView style={styles.commonView}>
        <Text style={styles.commonTitle}>소스를 입력해주세요</Text>
        {list}
        <Button onPress={addNewInput}>ADD</Button>
        <Button onPress={submit}>SUBMIT</Button>
      </SafeAreaView>
    </>
  );
}
