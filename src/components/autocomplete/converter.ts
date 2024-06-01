const convertFilteredList = (
  originalList: Array<any>,
  searchKeys: Array<string>,
  searchValue: string,
): Array<any> => {
  let filteredList: Array<any> = originalList;
  if (
    searchKeys &&
    searchKeys.length > 0 &&
    searchValue &&
    searchValue.length > 0
  ) {
    filteredList = [];
    originalList.forEach(obj => {
      searchKeys.forEach(searchKey => {
        if (isIncluded(obj, searchKey, searchValue)) {
          filteredList.push(obj);
        }
      });
    });
  }
  return filteredList;
};

const isIncluded = (obj: any, searchKey: string, searchValue: string) => {
  if (!obj) {
    return false;
  }
  const value: string = obj[searchKey];

  if (!value) {
    return false;
  }
  if (value.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
    return true;
  }
  return false;
};

export default { convertFilteredList };
