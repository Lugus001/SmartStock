import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import NameIconBar from '../../../components/NameIconBar';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../../theme/theme';
import {format} from 'date-fns';

const SelectedStocks = ({route}) => {
  const {selectedStock} = route.params || {
    selectedStock: {ingredient: '', brand: '', g: ''},
  };

  // Handlers for navigation
  const navigation = useNavigation();
  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <NameIconBar title="Stocks" onLeftIconPress={handleLeftIconPress} />
      <View style={styles.contentContainer}>
        <Text style={styles.big}>{selectedStock.ingredient}</Text>
        <Text style={styles.small}>{selectedStock.brand}</Text>
        <Text style={styles.small}>{selectedStock.g} (g)</Text>

        <Text style={styles.small}>
          {format(new Date(selectedStock.date), 'MMMM dd, yyyy')}
        </Text>
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

export default SelectedStocks;
