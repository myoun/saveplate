import { Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles';

type TextFieldProps = {
  onChange: (data: string) => void;
};

export function TextField(props: TextFieldProps): React.JSX.Element {
  return <TextInput style={styles.textField} onChangeText={props.onChange} />;
}

export function TextFieldAppendButton(): React.JSX.Element {
  return (
    <TouchableOpacity>
      <Text>+</Text>
    </TouchableOpacity>
  );
}
