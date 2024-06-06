import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  commonView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: {
    width: 300,
    height: 300,
    margin: 20,
  },
  commonDescription: {
    fontSize: 24,
    margin: 10,
  },
  commonTitle: {
    fontSize: 32,
    margin: 10,
    color: 'black',
  },
  setUpButton: {
    backgroundColor: 'royalblue',
    borderRadius: 5,
    padding: 10,
  },
  setUpButtonText: {
    fontSize: 24,
    color: 'white',
  },
  textField: {
    margin: 10,
    width: 300,
  },
});

export default styles;
