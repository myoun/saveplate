import AsyncStorage from '@react-native-async-storage/async-storage';

const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    throw e;
  }
};

const getItem = async (key: string): Promise<string | null> => {
  try {
    const res = await AsyncStorage.getItem(key);
    return res;
  } catch (e) {
    throw e;
  }
};

const getItemOrDefault = async (
  key: string,
  defaultValue: string,
): Promise<string> => {
  return (await getItem(key)) || defaultValue;
};

const reset = async (key: string) => {
  AsyncStorage.removeItem(key);
};

export const StorageManager = {
  getItem,
  getItemOrDefault,
  setItem,
  reset,
};
