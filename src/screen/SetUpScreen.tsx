import { useState } from 'react';
import { TextField, TextFieldAppendButton } from '../components/TextField';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { debounce, debounceTime, groupBy, mergeMap, Subject } from 'rxjs';

type SetUpStackParamList = {
  One: undefined;
  Two: undefined;
};

const SetUpStack = createNativeStackNavigator<SetUpStackParamList>();

export default function SetUpScreen(): React.JSX.Element {
  return (
    <>
      <SetUpStack.Navigator>
        <SetUpStack.Screen
          name="One"
          component={SetUpOne}
          options={{ headerShown: false }}
        />
        <SetUpStack.Screen
          name="Two"
          component={SetUpTwo}
          options={{ headerShown: false }}
        />
      </SetUpStack.Navigator>
    </>
  );
}

function SetUpOne(): React.JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<SetUpStackParamList>>();

  const nextStep = () => {
    navigation.navigate('Two');
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

type AutoCompletionType = 'ingredient' | 'sauce';

const AutoCompletionSubject$ = new Subject<AutoCompletionRequest>();
const AutoCompletionService = {
  onRequest: AutoCompletionSubject$.asObservable(),
  request(req: AutoCompletionRequest) {
    AutoCompletionSubject$.next(req);
  },
};

// 재료 작성
function SetUpTwo(): React.JSX.Element {
  const onChangeFactory = (key: number) => {
    return (data: string) => {
      const req: AutoCompletionRequest = {
        type: 'ingredient',
        data: data,
        origin: key,
      };
      AutoCompletionService.request(req);
    };
  };

  const [list, setList] = useState([
    <TextField key={0} onChange={onChangeFactory(0)} />,
    <TextField key={1} onChange={onChangeFactory(1)} />,
    <TextField key={2} onChange={onChangeFactory(2)} />,
    <TextFieldAppendButton key={-1} />,
  ]);

  AutoCompletionService.onRequest
    .pipe(
      groupBy(req => `${req.type}-${req.origin}`),
      mergeMap(group$ => group$.pipe(debounceTime(400))),
    )
    .subscribe(p => console.log(`suggestion for ${list.at(p.origin)?.key}`));

  return (
    <>
      <SafeAreaView style={styles.commonView}>
        <Text style={styles.commonTitle}>재료를 입력해주세요</Text>
        {list}
      </SafeAreaView>
    </>
  );
}
