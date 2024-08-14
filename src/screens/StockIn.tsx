import React, {useEffect, useState, useCallback} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from '../theme/theme';
import NameIconBar from '../components/NameIconBar';
import axios from 'axios';
import Svg, {Rect, Image as SvgImage} from 'react-native-svg';
import {useRoute} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import SaveButton from '../components/SaveButton';
import {format, isValid} from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StockIn = ({navigation}) => {
  const route = useRoute();
  const [selectedIngredients, setSelectedIngredients] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [quantityNum, setQuantityNum] = useState(0); // g
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [baseStock, setBaseStock] = useState(0); // BaseStock

  const handleLeftIconPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    const fetchMaxQuantity = async () => {
      try {
        const savedPercentage = await AsyncStorage.getItem('savedPercentage');
        if (savedPercentage !== null) {
          const percentageValue = parseFloat(savedPercentage);
          setPercentage(percentageValue); // Set percentage
        }
      } catch (error) {
        console.error('Error fetching max quantity:', error);
      }
    };

    fetchMaxQuantity();

    if (route.params?.selectedIngredient) {
      const {ingredient, brand} = route.params.selectedIngredient;
      const quantity = route.params.selectedIngredient?.g || 0; // g
      setSelectedIngredients(ingredient);
      setSelectedBrand(brand);
      setQuantityNum(quantity);
    }
  }, [route.params?.selectedIngredient]);

  useEffect(() => {
    // Calculate BaseStock whenever quantityNum (g) or percentage changes
    const calculateBaseStock = () => {
      const baseStockValue = quantityNum * percentage;
      setBaseStock(baseStockValue);
      setMaxQuantity(baseStockValue);
    };

    calculateBaseStock();
  }, [quantityNum, percentage]);

  const navigateToSelectedIngredients = () => {
    navigation.navigate('SearchProduct');
  };

  const clearSelectedIngredients = () => {
    setSelectedIngredients('');
    setSelectedBrand('');
    setQuantityNum(0);
  };

  const incrementQuantity = () => {
    setQuantityNum(prevQuantity => {
      const newQuantity = prevQuantity + 1;
      return newQuantity > maxQuantity ? maxQuantity : newQuantity;
    });
  };

  const decrementQuantity = () => {
    setQuantityNum(prevQuantity => (prevQuantity > 0 ? prevQuantity - 1 : 0));
  };

  const handleSaveStockIn = async () => {
    if (!isValid(date)) {
      Alert.alert('Error', 'Invalid date value');
      return;
    }

    const formattedDate = format(date, 'yyyy-MM-dd');
    console.log('Formatted Date:', formattedDate);

    if (selectedIngredients && selectedBrand && quantityNum && formattedDate) {
      if (quantityNum > maxQuantity) {
        Alert.alert('Error', `Quantity exceeds maximum allowed: ${baseStock}`);
        return;
      }

      try {
        await axios.post('http://192.168.186.217:8083/stocks', {
          ingredient: selectedIngredients,
          brand: selectedBrand,
          g: quantityNum,
          date: formattedDate,
        });
        setSelectedIngredients('');
        setSelectedBrand('');
        setQuantityNum(0);
        setDate(new Date());
        Alert.alert('Success', 'StockIn saved successfully');
      } catch (error) {
        console.error('Error saving StockIn:', error);
        Alert.alert('Error', 'Error saving StockIn');
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <NameIconBar title="Stock In" onLeftIconPress={handleLeftIconPress} />
      <View style={styles.contentContainer}>
        <Text style={styles.inText}>Search Product </Text>
        <View style={styles.searchIngredientsContainer}>
          <View style={styles.ingredientInputContainer}>
            <Text style={styles.selectedIngredientText}>
              {selectedIngredients
                ? `${selectedIngredients} - ${selectedBrand}`
                : 'No ingredient selected'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={clearSelectedIngredients}
            style={styles.iconContainer}
            accessibilityLabel="Clear selected ingredient">
            <Svg width="30" height="50" viewBox="0 4 30 19">
              <Rect
                width="25"
                height="40"
                fill={COLORS.darkSlateBlueHex}
                ry="5"
                rx="5"
              />
              <SvgImage
                y="10"
                width="25"
                height="25"
                href={require('../assets/icon/delete.png')}
              />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigateToSelectedIngredients}
            style={styles.iconContainer}
            accessibilityLabel="Search ingredients">
            <Svg width="50" height="40">
              <Rect
                width="50"
                height="40"
                x="0"
                y="0"
                rx="15"
                ry="15"
                fill={COLORS.darkSlateBlueHex}
              />
              <SvgImage
                x="3"
                y="4"
                width="45"
                height="35"
                href={require('../assets/icon/search.png')}
              />
            </Svg>
          </TouchableOpacity>
        </View>

        <Text style={styles.QuantityText}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={decrementQuantity}
            accessibilityLabel="Decrease quantity">
            <Svg width="50" height="40">
              <Rect
                width="50"
                height="40"
                x="0"
                y="0"
                rx="15"
                ry="15"
                fill={COLORS.darkSlateBlueHex}
              />
              <SvgImage
                x="5"
                y="2"
                width="40"
                height="40"
                href={require('../assets/icon/minus.png')}
              />
            </Svg>
          </TouchableOpacity>
          <View style={styles.quantityInputContainer}>
            <TextInput
              style={styles.quantityInput}
              value={quantityNum.toString()}
              keyboardType="numeric"
              onChangeText={text => setQuantityNum(Number(text))}
              placeholder="Enter Quantity"
              placeholderTextColor={COLORS.primaryDarkGreyHex}
            />
          </View>
          <TouchableOpacity
            onPress={incrementQuantity}
            accessibilityLabel="Increase quantity">
            <Svg width="50" height="40">
              <Rect
                width="50"
                height="40"
                x="0"
                y="0"
                rx="15"
                ry="15"
                fill={COLORS.darkSlateBlueHex}
              />
              <SvgImage
                x="10"
                y="5"
                width="30"
                height="30"
                href={require('../assets/icon/plus.png')}
              />
            </Svg>
          </TouchableOpacity>
        </View>

        <Text style={styles.dateText}>Date :</Text>
        <TextInput
          style={styles.input}
          value={date.toLocaleDateString()}
          onFocus={() => setOpen(true)}
          placeholder="Select Date"
          placeholderTextColor={COLORS.primaryDarkGreyHex}
        />
        <DatePicker
          modal
          open={open}
          date={date}
          mode="date"
          onConfirm={date => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => setOpen(false)}
        />

        {/* Displaying BaseStock */}
        <Text style={styles.QuantityText}>
          BaseStock: {baseStock.toFixed(2)}
        </Text>

        <View style={styles.saveButtonContainer}>
          <SaveButton title="Save" onPress={handleSaveStockIn} />
        </View>
      </View>
    </View>
  );
};

export default StockIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  contentContainer: {
    flex: 1,
    padding: 26,
  },
  inText: {
    fontSize: 22,
    color: COLORS.primaryWhiteHex,
    marginBottom: 10,
  },
  searchIngredientsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primaryWhiteHex,
  },
  ingredientInputContainer: {
    flex: 1,
    marginRight: 10,
  },
  selectedIngredientText: {
    fontSize: 18,
    color: COLORS.primaryWhiteHex,
    marginLeft: 10,
  },
  iconContainer: {
    marginHorizontal: 5,
  },
  QuantityText: {
    fontSize: 18,
    color: COLORS.primaryWhiteHex,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  quantityInputContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  quantityInput: {
    fontSize: 18,
    color: COLORS.primaryWhiteHex,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primaryWhiteHex,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 18,
    color: COLORS.primaryWhiteHex,
    marginBottom: 10,
  },
  input: {
    fontSize: 18,
    color: COLORS.primaryWhiteHex,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primaryWhiteHex,
    marginBottom: 20,
  },
  saveButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
