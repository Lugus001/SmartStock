import {
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import searchIcon from '../assets/icon/search.png'; // Import image for Icons
import {COLORS, SPACING} from '../theme/theme';

interface SearchProps {
  value: string;
  onSearch: (text: string) => void;
  title?: string;
  textColor?: string;
}

const Search: React.FC<SearchProps> = ({value, onSearch, title, textColor}) => {
  const [searchText, setSearchText] = useState('value');

  useEffect(() => {
    setSearchText(value);
  }, [value]);
  const handleSearch = () => {
    onSearch(searchText);
  };
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TextInput
        placeholder={title}
        value={searchText}
        onChangeText={setSearchText}
        style={[styles.SearchPad, {color: COLORS.primaryWhiteHex}]}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Image source={searchIcon} style={styles.SearchIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  SearchPad: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: COLORS.primaryGreyHex,
    marginRight: 1,
    marginLeft: 15,
    backgroundColor: COLORS.darkSlateBlueHex,
    width: 100,
    height: 40,
  },

  SearchIcon: {
    width: 40,
    height: 40,
    marginLeft: 1,
    marginRight: 30,
    borderRadius: 5,
    backgroundColor: COLORS.darkSlateBlueHex,
  },
});
