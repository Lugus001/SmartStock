import React, {useState} from 'react';
import {
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import {COLORS, SPACING} from '../theme/theme';

import searchIcon from '../assets/icon/search.png'; // Import image for Icons

interface SearchProps {
  onSearch: (text: string) => void;
  title?: string;
  textColor?: string;
}

const SearchBar: React.FC<SearchProps> = ({onSearch, title, textColor}) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    onSearch(searchText);
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TextInput
        placeholder={title}
        value={searchText}
        onChangeText={setSearchText}
        style={[styles.SearchPad, {color: COLORS.primaryBlackHex}]}
        placeholderTextColor={'#707070'}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Image source={searchIcon} style={styles.SearchIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  SearchPad: {
    flex: 1,
    paddingHorizontal: SPACING.space_20,
    paddingVertical: SPACING.space_10,
    borderRadius: 10,
    borderColor: COLORS.primaryGreyHex,
    marginRight: 5,
    backgroundColor: COLORS.primaryWhiteHex,
  },

  SearchIcon: {
    width: 40,
    height: 40,
    marginLeft: 10,
    backgroundColor: COLORS.searchBlack,
  },
});
