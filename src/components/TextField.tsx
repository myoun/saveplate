import { Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles';
import Autocomplete from './Autocomplete.tsx';

export type TextFieldProps = {
  key: number;
  onRender: (props: TextFieldProps) => void;
  onChange: (data: string) => void;
};

export function TextField(props: { props: TextFieldProps }): React.JSX.Element {
  const realProps = props.props;
  return (
    <TextInput style={styles.textField} onChangeText={realProps.onChange} />
  );
}

export function TextFieldAppendButton(): React.JSX.Element {
  return (
    <TouchableOpacity>
      <Text>+</Text>
    </TouchableOpacity>
  );
}
