import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NameIconBar from '../../../components/NameIconBar';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../../theme/theme';

const SelectedRecipes = ({route}) => {
  const {selectedRecipe} = route.params || {
    selectedRecipe: {ingredients: [], name: ''},
  };

  // Handlers for navigation
  const navigation = useNavigation();
  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <NameIconBar
        title={selectedRecipe.name}
        onLeftIconPress={handleLeftIconPress}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.big}>Recipe Name : {selectedRecipe.name}</Text>
        <Text style={styles.small}>
          Quantity of Product : {selectedRecipe.qpro} piece
        </Text>

        {selectedRecipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.small}>
            {ingredient.ingredient} ({ingredient.brand}): {ingredient.lg}g
          </Text>
        ))}
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

export default SelectedRecipes;
