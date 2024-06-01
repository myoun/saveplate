import React, { useEffect, useState } from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {
  GestureHandlerRootView,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import converter from './autocomplete/converter';
import {
  AutocompleteHelper,
  AutocompleteProps,
  LayoutProps,
  ListStateProps,
  ThemeProps,
} from './autocomplete/types';

const themeColors: ThemeProps = {
  light: {
    text: '#000000',
    borderBottomColor: 'rgba(0, 0, 0, 0.4)',
    listBackgroundColor: '#ffffff',
  },
  dark: {
    text: '#ffffff',
    borderBottomColor: 'gray',
    listBackgroundColor: '#121212',
  },
};

const Autocomplete = (props: AutocompleteProps) => {
  const {
    completionKey,
    onChangeText,
    onRender,
    onCleanup,
    onSelectItem,
    zIndex,
    listContainerStyle,
    inputContainerStyle,
    inputStyle,
    containerStyle,
    listItemContainerStyle,
    listItemTextStyle,
    defaultValue,
    searchKeys,
    customItemRenderer,
    noResultComponent,
    theme = 'light',
  } = props;

  const colors = themeColors[theme];
  const borderBottomColor = colors.borderBottomColor;
  const textColor = colors.text;
  const listBackgroundColor = colors.listBackgroundColor;
  // const optionSearchKeys =
  //   searchKeys && searchKeys.length > 0 ? searchKeys : [valueKey];

  const [list, setList] = useState<string[]>([]);

  const [searchValue, setSearchValue] = useState('');
  const [listState, setListState] = useState<ListStateProps>({
    show: false,
    filteredList: [],
  });
  const [layout, setLayout] = useState<undefined | LayoutProps>(undefined);
  useEffect(() => {
    const helper: AutocompleteHelper = {
      key: completionKey,
      setList: setList,
    };
    onRender(helper);
  }, [completionKey, onRender, searchKeys]);

  useEffect(() => {
    if (list && list.length > 0) {
      setListState({ show: true, filteredList: list });
    }
  }, [list]);

  const onLayout = (e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  };

  const selectItem = (item: any) => () => {
    console.log(item);
    // setSearchValue(item[labelKey]);
    setListState(ls => ({ ...ls, show: false }));
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  const getTopPosition = (): number => {
    if (layout) {
      return layout.height;
    }
    return 0;
  };

  const onChangeSearch = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }
    setSearchValue(text);
    if (onSelectItem) {
      onSelectItem(undefined);
    }
    if (text.length === 0) {
      setListState({ show: false, filteredList: list });
    }
    if (text.length > 0) {
      setListState({
        show: true,
        filteredList: converter.convertFilteredList(list, [], text),
      });
    }
  };

  const itemRendererAndroid = (item: any, index: number) => (
    <View key={index} style={[styles.listItem, listItemContainerStyle]}>
      <TouchableNativeFeedback onPress={selectItem(item)}>
        {customItemRenderer ? (
          customItemRenderer(item, index)
        ) : (
          <Text style={[{ color: textColor }, listItemTextStyle]}>{item}</Text>
        )}
      </TouchableNativeFeedback>
    </View>
  );

  const itemRenderer = ({ item, index }: any) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={selectItem(item)}
        style={[styles.listItem, listItemContainerStyle]}>
        {customItemRenderer ? (
          customItemRenderer(item, index)
        ) : (
          <Text style={[{ color: textColor }, listItemTextStyle]}>{item}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return noResultComponent ? (
      noResultComponent
    ) : (
      <View>
        <Text style={{ color: textColor }}>No Results</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ width: '100%' }}>
      <View
        style={[
          styles.container,
          containerStyle,
          { zIndex: zIndex ? zIndex : 1 },
        ]}>
        <View
          style={[styles.inputContainer, inputContainerStyle]}
          onLayout={onLayout}>
          <TextInput
            value={searchValue}
            onChangeText={onChangeSearch}
            style={[
              styles.input,
              { borderBottomColor, color: textColor },
              inputStyle,
            ]}
          />
        </View>
        {Platform.OS === 'android' && listState.show && (
          <ScrollView
            style={[
              styles.listContainer,
              { backgroundColor: listBackgroundColor },
              listContainerStyle,
              { top: getTopPosition() },
            ]}>
            {listState.filteredList.length > 0 &&
              listState.filteredList.map(itemRendererAndroid)}
            {listState.filteredList.length === 0 && renderEmpty()}
          </ScrollView>
        )}
        {Platform.OS === 'ios' && listState.show && (
          <FlatList
            style={[
              styles.listContainer,
              { backgroundColor: listBackgroundColor },
              listContainerStyle,
              { top: getTopPosition() },
            ]}
            data={listState.filteredList}
            renderItem={itemRenderer}
            ListEmptyComponent={renderEmpty}
            keyExtractor={(_item: any, index: number) => index.toString()}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {},
  inputContainer: { width: '100%' },
  listContainer: {
    flexDirection: 'column',
    position: 'absolute',
    width: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    padding: 8,
    zIndex: 15,
  },
  listItem: {
    width: '100%',
    borderBottomColor: '#ebebeb',
    borderStyle: 'solid',
    borderBottomWidth: 1,
    padding: 8,
    paddingLeft: 0,
    zIndex: 1,
  },
  input: {
    paddingTop: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
  },
});

export default Autocomplete;
