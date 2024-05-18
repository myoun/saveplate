import { Text, TextInput, TouchableOpacity } from "react-native"
import styles from "../styles"

export function TextField(): React.JSX.Element {
    return (
      <TextInput style={styles.textField}></TextInput>
    )
  }
  
export function TextFieldAppendButton(): React.JSX.Element {
  
    return (
      <TouchableOpacity>
        <Text>+</Text>
      </TouchableOpacity>
    )
}