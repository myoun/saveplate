import { useEffect, useState } from 'react';
import {
  TextField,
  TextFieldAppendButton,
  TextFieldProps,
} from '../components/TextField';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles';
import { useNavigation } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {
  debounceTime,
  filter,
  groupBy,
  mergeMap,
  Subject,
  Subscription,
} from 'rxjs';
import Autocomplete from '../components/Autocomplete.tsx';
import React from 'react';
import {
  AutocompleteHelper,
  AutocompleteProps,
} from '../components/autocomplete/types.ts';

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
function SetUpTwo(): React.JSX.Element {
  const generateTextFieldProps = (key: number): AutocompleteProps => {
    let subs: Subscription | undefined;
    return {
      key: key,
      completionKey: key,
      onChangeText(data: string) {
        console.log(data);
        const req: AutoCompletionRequest = {
          type: 'ingredient',
          data: data,
          origin: key,
        };
        AutoCompletionService.request(req);
      },
      onRender(helper: AutocompleteHelper) {
        subs = AutoCompletionService.onResponse
          .pipe(
            filter(
              res => res.type === 'ingredient' && res.origin === helper.key,
            ),
          )
          .subscribe(res => {
            helper.setList(res.data);
          });
      },
      onCleanup() {
        if (subs) {
          subs.unsubscribe();
        }
      },
    };
  };
  // @ts-ignore
  const [list, setList] = useState([
    React.createElement(Autocomplete, generateTextFieldProps(0)),
    // React.createElement(Autocomplete, generateTextFieldProps(1)),
    // React.createElement(Autocomplete, generateTextFieldProps(2)),
    <TextFieldAppendButton key={-1} />,
  ]);

  useEffect(() => {
    AutoCompletionService.onRequest
      .pipe(
        groupBy(req => `${req.type}-${req.origin}`),
        mergeMap(group$ => group$.pipe(debounceTime(400))),
      )
      .subscribe(async req => {
        const acRequest = await fetch(
          `http://10.0.2.2:8000/autocompletion?type=${req.type}&data=${req.data}`,
          {
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        if (acRequest.status !== 200) {
          console.warn(acRequest.statusText);
          return;
        }

        const result = await acRequest.json();
        const response: AutoCompletionResponse = {
          type: req.type,
          data: result,
          origin: req.origin,
        };
        AutoCompletionService.response(response);
      });
  }, []);

  return (
    <>
      <SafeAreaView style={styles.commonView}>
        <Text style={styles.commonTitle}>재료를 입력해주세요</Text>
        {list}
      </SafeAreaView>
    </>
  );
}
