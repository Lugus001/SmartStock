import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import NameIconBar from '../../../components/NameIconBar';
import {COLORS} from '../../../theme/theme';
import Svg, {Image as SvgImage, Rect} from 'react-native-svg';
import SaveButton from '../../../components/SaveButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import {format, isValid} from 'date-fns';

const CreatePurchasing = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [selectedIngredients, setSelectedIngredients] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPlacesOfPurchase, setSelectedPlacesOfPurchase] = useState('');
  const [orderNum, setOrderNum] = useState(0);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leadTime, setLeadTime] = useState(0);

  useEffect(() => {
    if (route.params?.selectedIngredient) {
      const {ingredient, brand} = route.params.selectedIngredient;
      setSelectedIngredients(ingredient);
      setSelectedBrand(brand);
    }
  }, [route.params?.selectedIngredient]);

  useEffect(() => {
    if (route.params?.selectedPlacesOfPurchase) {
      setSelectedPlacesOfPurchase(route.params?.selectedPlacesOfPurchase.where);
    }
  }, [route.params?.selectedPlacesOfPurchase]);

  const handleSavePurchasing = async () => {
    if (!isValid(date)) {
      Alert.alert('Error', 'Invalid date value');
      return;
    }

    const formattedDate = format(date, 'yyyy-MM-dd');

    if (
      selectedIngredients &&
      selectedBrand &&
      selectedPlacesOfPurchase &&
      orderNum > 0 &&
      leadTime > 0 &&
      formattedDate
    ) {
      setLoading(true);
      try {
        await axios.post('http://192.168.186.217:8083/purchasings', {
          ingredients: selectedIngredients,
          brand: selectedBrand,
          p: orderNum,
          date: formattedDate,
          l: leadTime,
          where: selectedPlacesOfPurchase,
        });

        setSelectedIngredients('');
        setSelectedBrand('');
        setSelectedPlacesOfPurchase('');
        setOrderNum(0);
        setLeadTime(0);
        setDate(new Date());
        Alert.alert('Success', 'Purchasing saved successfully');
      } catch (error) {
        console.error(
          'Error saving purchasing:',
          error.response?.data || error,
        );
        Alert.alert(
          'Error',
          error.response?.data?.error || 'Error saving purchasing',
        );
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <NameIconBar
          title="Create Purchasing"
          onLeftIconPress={() => navigation.goBack()}
        />
        <View style={styles.contentContainer}>
          <Label text="Choose Products" />
          <SearchField
            selectedItem={`${selectedIngredients} ${selectedBrand}`}
            clearSelection={() => {
              setSelectedIngredients('');
              setSelectedBrand('');
            }}
            onPressSearch={() => navigation.navigate('SearchIngredientPur')}
          />
          <Label text="Purchasing Order (pack)" />
          <View style={styles.rowContainer}>
            <TextInput
              style={styles.orderNumInput}
              value={orderNum.toString()}
              keyboardType="numeric"
              onChangeText={text => setOrderNum(Number(text))}
              placeholder="Enter Quantity"
              placeholderTextColor={COLORS.primaryDarkGreyHex}
            />
            <QuantityAdjuster
              increment={() => setOrderNum(prevQuantity => prevQuantity + 1)}
              decrement={() =>
                setOrderNum(prevQuantity =>
                  prevQuantity > 0 ? prevQuantity - 1 : 0,
                )
              }
            />
          </View>
          <Label text="Places of Purchase" />
          <SearchField
            selectedItem={selectedPlacesOfPurchase}
            clearSelection={() => setSelectedPlacesOfPurchase('')}
            onPressSearch={() => navigation.navigate('SearchPlacesOfPurchase')}
          />
          <Label text="Lead Time (l)" />
          <View style={styles.rowContainer}>
            <TextInput
              style={styles.orderNumInput}
              value={leadTime.toString()}
              keyboardType="numeric"
              onChangeText={text => setLeadTime(Number(text))}
            />
            <QuantityAdjuster
              increment={() => setLeadTime(prevQuantity => prevQuantity + 1)}
              decrement={() =>
                setLeadTime(prevQuantity =>
                  prevQuantity > 0 ? prevQuantity - 1 : 0,
                )
              }
            />
          </View>
          <Label text="Date" />
          <TouchableOpacity
            onPress={() => setOpen(true)}
            style={styles.input}
            accessible
            accessibilityLabel="Select date"
            accessibilityHint="Opens a date picker">
            <Text style={styles.dateText}>{format(date, 'yyyy-MM-dd')}</Text>
          </TouchableOpacity>
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

          <View style={styles.saveButtonContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primaryWhiteHex} />
            ) : (
              <SaveButton onPress={handleSavePurchasing} />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Label = ({text}) => <Text style={styles.labelText}>{text}</Text>;

const SearchField = ({selectedItem, clearSelection, onPressSearch}) => (
  <View style={styles.searchIngredientsContainer}>
    <View style={styles.selectedIngredients}>
      {selectedItem ? (
        <Text style={styles.selectedIngredientsText}>{selectedItem}</Text>
      ) : null}
    </View>
    <TouchableOpacity onPress={clearSelection} style={styles.iconButton}>
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
          href={require('../../../assets/icon/delete.png')}
        />
      </Svg>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPressSearch} style={styles.iconButton}>
      <Svg width="50" height="40">
        <Rect
          width="50"
          height="40"
          rx="15"
          ry="15"
          fill={COLORS.darkSlateBlueHex}
        />
        <SvgImage
          x="3"
          y="4"
          width="45"
          height="35"
          href={require('../../../assets/icon/search.png')}
        />
      </Svg>
    </TouchableOpacity>
  </View>
);

const QuantityAdjuster = ({increment, decrement}) => (
  <View style={styles.quantityAdjusterContainer}>
    <TouchableOpacity onPress={decrement}>
      <Svg width="50" height="40">
        <Rect
          width="50"
          height="40"
          rx="15"
          ry="15"
          fill={COLORS.darkSlateBlueHex}
        />
        <SvgImage
          x="5"
          y="2"
          width="40"
          height="40"
          href={require('../../../assets/icon/minus.png')}
        />
      </Svg>
    </TouchableOpacity>
    <TouchableOpacity onPress={increment}>
      <Svg width="50" height="40">
        <Rect
          width="50"
          height="40"
          rx="15"
          ry="15"
          fill={COLORS.darkSlateBlueHex}
        />
        <SvgImage
          x="10"
          y="5"
          width="30"
          height="30"
          href={require('../../../assets/icon/plus.png')}
        />
      </Svg>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  labelText: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: COLORS.primaryGreyHex,
    borderRadius: 15,
    paddingHorizontal: 30,
    paddingVertical: 15,
    marginBottom: 20,
    width: '100%',
  },
  dateText: {
    fontSize: 16,
    color: COLORS.primaryWhiteHex,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  orderNumInput: {
    backgroundColor: COLORS.primaryGreyHex,
    borderRadius: 15,
    padding: 15,
    flex: 1,
    fontSize: 18,
    color: COLORS.primaryWhiteHex,
    marginRight: 10,
  },
  searchIngredientsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: COLORS.primaryGreyHex,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  selectedIngredients: {
    flex: 1,
  },
  selectedIngredientsText: {
    fontSize: 16,
    color: COLORS.primaryWhiteHex,
    marginLeft: 20,
  },
  iconButton: {
    marginLeft: 10,
  },
  quantityAdjusterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  saveButtonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default CreatePurchasing;
