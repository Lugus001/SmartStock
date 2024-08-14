import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import NameIconBar from '../../../components/NameIconBar';
import {COLORS} from '../../../theme/theme';
import {useNavigation, useRoute} from '@react-navigation/native';
import SaveButton from '../../../components/SaveButton';
import axios from 'axios';
import Svg, {Rect, Image as SvgImage} from 'react-native-svg';

function CreateIngredients() {
  const [ingredientName, setIngredientName] = useState('');
  const [quantityNum, setQuantityNum] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPlacesOfPurchase, setSelectedPlacesOfPurchase] =
    useState(null);

  const navigation = useNavigation();
  const route = useRoute();

  // Handlers for navigation
  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (route.params?.selectedBrand) {
      setSelectedBrand(route.params.selectedBrand.name); // Adjust as necessary
    }
  }, [route.params?.selectedBrand]);

  useEffect(() => {
    if (route.params?.selectedPlacesOfPurchase) {
      const {where, l} = route.params.selectedPlacesOfPurchase;
      setSelectedPlacesOfPurchase({where, l});
    }
  }, [route.params?.selectedPlacesOfPurchase]);

  const handleSaveIngredient = async () => {
    // Prepare the place array correctly
    const placeArray = selectedPlacesOfPurchase
      ? [{where: selectedPlacesOfPurchase.where, l: selectedPlacesOfPurchase.l}]
      : [];

    // Prepare the payload with the correct structure
    const payload = {
      ingredient: ingredientName,
      g: quantityNum,
      brand: selectedBrand,
      place: placeArray, // Ensure it's an array
    };

    console.log('Request Payload:', payload);

    try {
      const response = await axios.post(
        'http://192.168.186.217:8083/ingredients',
        payload,
      );

      if (response.status === 201) {
        Alert.alert('Ingredient saved successfully');
        setIngredientName('');
        setQuantityNum(0);
        setSelectedBrand('');
        setSelectedPlacesOfPurchase(null);
      } else {
        Alert.alert('Failed to save ingredient');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
        Alert.alert(
          'Server Error',
          `Error: ${error.response.data.error || error.response.status}`,
        );
      } else if (error.request) {
        console.error('Error request:', error.request);
        Alert.alert('Network Error', 'Unable to connect to the server.');
      } else {
        console.error('Error message:', error.message);
        Alert.alert('Error', error.message);
      }
    }
  };

  const navigateToSearchBrand = () => {
    navigation.navigate('SearchBrand');
  };

  const navigateToCreateBrand = () => {
    navigation.navigate('CreateBrand');
  };

  const navigateToSearchPlacesOfPurchase = () => {
    navigation.navigate('SearchPlace');
  };
  const navigateToCreatePlacesOfPurchase = () => {
    navigation.navigate('CreatePlacesOfPurchase');
  };

  const incrementQuantity = () => {
    setQuantityNum(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantityNum(prevQuantity => (prevQuantity > 0 ? prevQuantity - 1 : 0)); // Ensure quantity does not go below 0
  };

  const clearSelectedBrand = () => {
    setSelectedBrand('');
  };

  const clearSelectedPlacesOfPurchase = () => {
    setSelectedPlacesOfPurchase(null);
  };

  return (
    <View style={styles.container}>
      <NameIconBar
        title="CreateIngredients"
        onLeftIconPress={handleLeftIconPress}
      />
      <View style={styles.contentContainer}>
        {/* Name field set Ingredient Name */}
        <Text style={styles.label}>Name :</Text>

        {/* Input field inside the rectangle */}
        <TextInput
          style={[styles.input, {color: COLORS.primaryWhiteHex}]}
          value={ingredientName}
          onChangeText={setIngredientName}
          placeholder="Enter Ingredient Name"
          placeholderTextColor={COLORS.primaryDarkGreyHex}
        />
        {/* Search Brand section */}
        <Text style={styles.label}>Brand :</Text>
        <View style={styles.SearchBrandContainer}>
          <View
            style={{
              backgroundColor: COLORS.darkSlateBlueHex,
              width: 180,
              height: 42,
              paddingTop: 8,
              borderRadius: 5,
            }}>
            {selectedBrand ? (
              <Text
                style={{
                  color: COLORS.primaryWhiteHex,
                  fontSize: 15,
                  marginLeft: 25,
                }}>
                {selectedBrand}
              </Text>
            ) : null}
          </View>
          <View style={{paddingRight: 25, paddingBottom: 2, paddingLeft: 5}}>
            <TouchableOpacity onPress={clearSelectedBrand}>
              <Svg width="30" height="50" viewBox="0 4 30 19 ">
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
          </View>
          {/* Create SearchBrand button */}
          <TouchableOpacity
            onPress={navigateToSearchBrand}
            style={{marginRight: 10}}>
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
                href={require('../../../assets/icon/search.png')}
              />
            </Svg>
          </TouchableOpacity>

          {/* Create Brand button */}
          <TouchableOpacity onPress={navigateToCreateBrand}>
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
                x="6"
                y="5"
                width="40"
                height="30"
                href={require('../../../assets/icon/plus.png')}
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Quantity field set Quantity */}

        <Text
          style={{
            color: COLORS.primaryWhiteHex,
            fontSize: 20,
            marginRight: 270,
            marginTop: 20,
          }}>
          Quantity:
        </Text>

        {/* Input field inside the rectangle */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decrementQuantity}>
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
                href={require('../../../assets/icon/minus.png')}
              />
            </Svg>
          </TouchableOpacity>

          <View style={{marginLeft: 10, marginRight: 10, marginTop: 5}}>
            <TextInput
              style={[
                styles.quantityInput,
                {
                  color: COLORS.primaryWhiteHex,
                  marginTop: 0,
                  textAlign: 'center',
                },
              ]}
              value={quantityNum.toString()}
              keyboardType="numeric"
              onChangeText={text => setQuantityNum(Number(text))}
              placeholder="Enter Quantity"
              placeholderTextColor={COLORS.primaryDarkGreyHex}
            />
          </View>

          <TouchableOpacity onPress={incrementQuantity}>
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
                href={require('../../../assets/icon/plus.png')}
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Search  section */}
        <View style={{marginBottom: 50}}>
          <View style={{paddingLeft: 75, paddingBottom: 5}}>
            <Text
              style={{
                color: COLORS.primaryWhiteHex,
                fontSize: 20,
                marginLeft: 8,
                marginTop: 20,
              }}>
              Places of purchase:
            </Text>
          </View>

          <View style={styles.SearchBrandContainer}>
            <View
              style={{
                backgroundColor: COLORS.darkSlateBlueHex,
                borderRadius: 5,
                width: 180,
                height: 42,
                paddingTop: 8,
                marginRight: 2,
              }}>
              {selectedPlacesOfPurchase ? (
                <Text
                  style={{
                    color: COLORS.primaryWhiteHex,
                    fontSize: 15,
                    marginLeft: 25,
                  }}>
                  {selectedPlacesOfPurchase.where} -{' '}
                  {selectedPlacesOfPurchase.l}
                </Text>
              ) : null}
            </View>
            <View style={{paddingRight: 25, paddingBottom: 2, paddingLeft: 5}}>
              <TouchableOpacity onPress={clearSelectedPlacesOfPurchase}>
                <Svg width="30" height="50" viewBox="0 4 30 19 ">
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
            </View>
            {/*  Search Purchasing button */}

            <TouchableOpacity
              onPress={navigateToSearchPlacesOfPurchase}
              style={{marginRight: 10}}>
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
                  href={require('../../../assets/icon/search.png')}
                />
              </Svg>
            </TouchableOpacity>

            {/* Create Purchasing button */}
            <TouchableOpacity onPress={navigateToCreatePlacesOfPurchase}>
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
                  x="6"
                  y="5"
                  width="40"
                  height="30"
                  href={require('../../../assets/icon/plus.png')}
                />
              </Svg>
            </TouchableOpacity>
          </View>

          <View style={{width: 380, height: 40, marginTop: 5}}></View>
        </View>
        <View style={{marginBottom: 100}}>
          <SaveButton onPress={handleSaveIngredient} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  contentContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  label: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    marginBottom: 5,
    marginRight: 290,
    marginTop: 25,
  },
  brandContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    paddingHorizontal: 75,
  },
  createBrand: {
    marginLeft: 10, // Add some margin to separate the buttons
    marginRight: 20,
    backgroundColor: COLORS.darkSlateBlueHex,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
  },
  createBrandText: {
    color: COLORS.primaryWhiteHex,
  },
  input: {
    width: 350,
    height: 40,
    backgroundColor: COLORS.darkSlateBlueHex,
    borderRadius: 5,
    paddingHorizontal: 24,
  },
  searchResultItem: {
    backgroundColor: COLORS.darkSlateBlueHex,
    marginVertical: 5,
    borderRadius: 5,
  },
  searchResultText: {
    color: COLORS.primaryWhiteHex,
  },
  icon: {
    width: 40,
    height: 40,
    marginLeft: 60,
  },
  SearchBrandContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    paddingHorizontal: 80,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quantityInput: {
    width: 200,
    height: 40,
    backgroundColor: COLORS.darkSlateBlueHex,
    borderRadius: 5,
    paddingHorizontal: 24,
    margin: 10,
  },
});

export default CreateIngredients;
