import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import NameIconBar from '../../../components/NameIconBar';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../../theme/theme';

const SelectedBrands = ({route}) => {
  const {selectedBrand} = route.params || {
    selectedBrand: {name: '', ingredient: '', g: ''},
  };

  // Handlers for navigation
  const navigation = useNavigation();
  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <NameIconBar title="Brands" onLeftIconPress={handleLeftIconPress} />
      <View style={styles.contentContainer}>
        <Image
          source={{uri: 'https://via.placeholder.com/150'}} // Replace with the actual image URL
          style={styles.image}
        />
        <Text style={styles.big}> Brand:{selectedBrand.name}</Text>

        <Text style={styles.small}>{selectedBrand.ingredients}</Text>
        <Text style={styles.small}>Quantity: {selectedBrand.g} / 1 pack</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  big: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primaryWhiteHex,
    marginBottom: 10,
  },
  small: {
    fontSize: 18,
    color: COLORS.primaryWhiteHex,
    marginBottom: 10,
  },
});

export default SelectedBrands;
