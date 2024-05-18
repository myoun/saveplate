import { useState } from "react";
import { TextField, TextFieldAppendButton } from "../components/TextField";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";

type SetUpStackParamList = {
    One: undefined,
    Two: undefined
  }

const SetUpStack = createNativeStackNavigator<SetUpStackParamList>()

export default function SetUpScreen(): React.JSX.Element {
    return (
        <>
        <SetUpStack.Navigator>
            <SetUpStack.Screen 
            name="One"
            component={SetUpOne}
            options={{headerShown:false}}
            />
            <SetUpStack.Screen 
            name="Two"
            component={SetUpTwo}
            options={{headerShown:false}}
            />
        </SetUpStack.Navigator>
        </>
    );
}

function SetUpOne(): React.JSX.Element {
    const navigation = useNavigation<NativeStackNavigationProp<SetUpStackParamList>>();

    const nextStep = () => {
        navigation.navigate("Two")
    }

    return (
        <>
        <View style={styles.commonView}>
            <Image source={require("../assets/images/logo.png")} style={styles.logo}></Image>
            <Text style={styles.commonDescription}>당신의 냉장고를 구성하세요.</Text>
            <TouchableOpacity style={styles.setUpButton} onPress={nextStep}>
            <Text style={styles.setUpButtonText}>지금 시작하세요</Text>
            </TouchableOpacity>
        </View>
        </>
    );
}

// 재료 작성
function SetUpTwo(): React.JSX.Element {
    const [list, setList] = useState([
        <TextField key={0}/>,
        <TextField key={1}/>,
        <TextField key={2}/>,
        <TextFieldAppendButton key={-1}/>,
    ]);

    return (
        <>
        <SafeAreaView style={styles.commonView}>
            <Text style={styles.commonTitle}>재료를 입력해주세요</Text>
            {list}
        </SafeAreaView>
        </>
    );
}