import { Autocomplete, AutocompleteItem } from '@ui-kitten/components';
import React, { useEffect, useRef } from 'react';
import {
  getAutoCompletionManager,
  IngredientAutoCompletion,
} from './AutoCompletionManager.ts';
import styles from '../styles.ts';

export type AutoCompletionProps = {
  completionKey: number;
};

export function IngredientAutoComplete(props: AutoCompletionProps) {
  const [data, setData] = React.useState<string[]>(['']);
  const [value, setValue] = React.useState<string>('');

  const autocompleteRef = useRef(null);

  const onSelect = (index: number) => {
    setValue(data[index]);
  };

  const onChangeText = (text: string) => {
    const manager = getAutoCompletionManager<IngredientAutoCompletion>();
    manager.request('ingredient', text, props.completionKey);
    setValue(text);
  };

  useEffect(() => {
    const manager = getAutoCompletionManager<IngredientAutoCompletion>();
    const subscription = manager.subscribe(
      'ingredient',
      origin => origin === props.completionKey,
      res => {
        const d = ['', ...res];
        setData(d);
      },
    );

    return () => subscription.unsubscribe();
  }, [props.completionKey]);

  const renderOption = (item: string, index: number): React.JSX.Element => {
    return (
      <AutocompleteItem
        key={index}
        title={item}
        style={[item === '' ? { display: 'none' } : {}]}
      />
    );
  };

  return (
    <Autocomplete
      style={styles.textField}
      onSelect={onSelect}
      onChangeText={onChangeText}
      placement="inner top"
      value={value !== null ? value : ''}
      ref={autocompleteRef}>
      {data.map(renderOption)}
    </Autocomplete>
  );
}
