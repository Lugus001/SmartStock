import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import NameIconBar from '../../../components/NameIconBar';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../../theme/theme';

const SelectedIngredients = ({route}) => {
  const {selectedIngredient} = route.params || {
    selectedIngredient: {
      ingredient: '',
      brand: '',
      g: '',
      place: [],
    },
  };

  // Destructure place if it's an array
  const placeArray = Array.isArray(selectedIngredient.place)
    ? selectedIngredient.place
    : [];
  const [where = '', l = ''] =
    placeArray.length > 0 ? [placeArray[0].where, placeArray[0].l] : [];

  // Handlers for navigation
  const navigation = useNavigation();
  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  console.log('Selected Ingredient:', selectedIngredient); // Log data for debugging

  return (
    <View style={styles.container}>
      <NameIconBar title="Ingredients" onLeftIconPress={handleLeftIconPress} />
      <View style={styles.contentContainer}>
        <Text style={styles.big}>
          Ingredient: {selectedIngredient.ingredient}
        </Text>

        <Text style={styles.small}>Brand: {selectedIngredient.brand}</Text>
        <Text style={styles.small}>
          Quantity: {selectedIngredient.g} / 1 pack
        </Text>
        <Text style={styles.small}>Where: {where}</Text>
        <Text style={styles.small}>Lead Time: {l}</Text>
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

export default SelectedIngredients;
