import { TextInputProps, TextStyle, ViewStyle } from 'react-native';

export interface AutocompleteProps extends TextInputProps {
  key: number;
  completionKey: number;
  onRender: (helper: AutocompleteHelper) => void;
  onCleanup?: () => void;
  zIndex?: number;
  containerHeight?: number | string;
  containerStyle?: ViewStyle;
  listContainerStyle?: ViewStyle;
  inputContainerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  listItemContainerStyle?: ViewStyle;
  listItemTextStyle?: TextStyle;
  onSelectItem?: (item?: any) => void;
  searchKeys?: Array<string>;
  customItemRenderer?: (item: any, index: number) => React.ReactElement;
  noResultComponent?: React.ReactElement;
  theme?: 'light' | 'dark';
}

export interface AutocompleteHelper {
  key: number;
  setList: (list: string[]) => void;
}

export interface LayoutProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ListStateProps {
  show: boolean;
  filteredList: Array<any>;
}

export interface ThemeInfoProps {
  text: string;
  borderBottomColor: string;
  listBackgroundColor: string;
}
export interface ThemeProps {
  dark: ThemeInfoProps;
  light: ThemeInfoProps;
}
