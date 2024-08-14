import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import NameIconBar from '../../../components/NameIconBar';
import {COLORS} from '../../../theme/theme';
import Svg, {Rect, Image as SvgImage, Text as SvgText} from 'react-native-svg';
import {launchImageLibrary} from 'react-native-image-picker';
import SaveButton from '../../../components/SaveButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';

const CreateBrand = () => {
  //set value section
  const [brandName, setBrandName] = useState('');
  const [quantityNum, setQuantityNum] = useState(0);
  const [selectedIngredient, setSelectedIngredient] = useState('');

  //set value for navigation
  const navigation = useNavigation();
  const route = useRoute();

  const navigateToSearchIngredient = () => {
    navigation.navigate('SearchIngredientBr');
  };
  const navigateToCreateIngredient = () => {
    navigation.navigate('CreateIngredients');
  };

  const incrementQuantity = () => {
    setQuantityNum(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantityNum(prevQuantity => (prevQuantity > 0 ? prevQuantity - 1 : 0)); // Ensure quantity does not go below 0
  };

  const clearSelectedIngredient = () => {
    setSelectedIngredient('');
  };

  useEffect(() => {
    if (route.params?.selectedIngredient) {
      setSelectedIngredient(route.params.selectedIngredient.ingredient); // Adjust as necessary
    }
  }, [route.params?.selectedIngredient]);

  // Handlers for navigation
  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  const handleSaveBrand = async () => {
    if (!quantityNum || quantityNum <= 0) {
      Alert.alert('Error', 'Quantity field is required.');
      return;
    }
    if (!brandName || !brandName.trim()) {
      Alert.alert('Error', 'Name field is required.');
      return;
    }
    if (!selectedIngredient || !selectedIngredient.trim()) {
      Alert.alert('Error', 'Ingredients field is required.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.186.217:8083/brand', {
        g: quantityNum,
        name: brandName,
        ingredients: selectedIngredient,
      });

      if (response.status === 201) {
        Alert.alert('Brand saved successfully');

        setQuantityNum(0);
        setBrandName('');
        setSelectedIngredient('');
      } else {
        Alert.alert('Failed to save Brand');
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', `Server error: ${error.response.data.error}`);
      } else {
        Alert.alert('Network Error', 'Unable to connect to the server.');
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <NameIconBar
            title="Create Brand"
            onLeftIconPress={handleLeftIconPress}
          />
          <View style={styles.contentContainer}>
            <Text style={styles.label}>Name :</Text>
            <TextInput
              style={[styles.input, {color: COLORS.primaryWhiteHex}]}
              value={brandName}
              onChangeText={setBrandName}
              placeholder="Enter Brand Name"
              placeholderTextColor={COLORS.primaryDarkGreyHex}
            />

            <Text
              style={{
                color: COLORS.primaryWhiteHex,
                fontSize: 20,
                marginLeft: 1,
                marginRight: 230,
                marginTop: 20,
                marginBottom: 5,
              }}>
              Ingredients :
            </Text>
            <View style={styles.SearchIngredientContainer}>
              <View
                style={{
                  backgroundColor: COLORS.darkSlateBlueHex,
                  width: 180,
                  height: 42,
                  paddingTop: 8,
                  borderRadius: 5,
                }}>
                {selectedIngredient ? (
                  <Text
                    style={{
                      color: COLORS.primaryWhiteHex,
                      fontSize: 15,
                      marginLeft: 25,
                    }}>
                    {selectedIngredient}
                  </Text>
                ) : null}
              </View>

              <View
                style={{paddingRight: 25, paddingBottom: 2, paddingLeft: 5}}>
                <TouchableOpacity onPress={clearSelectedIngredient}>
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

              <TouchableOpacity
                onPress={navigateToSearchIngredient}
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

              <TouchableOpacity onPress={navigateToCreateIngredient}>
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

            <Text
              style={{
                color: COLORS.primaryWhiteHex,
                fontSize: 20,
                marginRight: 270,
                marginTop: 20,
              }}>
              Quantity:
            </Text>

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

            <SaveButton onPress={handleSaveBrand} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateBrand;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  SearchIngredientContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    paddingHorizontal: 80,
  },
  label: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    marginBottom: 5,
    marginRight: 290,
    marginTop: 20,
  },
  input: {
    width: 350,
    height: 40,
    backgroundColor: COLORS.darkSlateBlueHex,
    borderRadius: 5,
    paddingHorizontal: 24,
  },
  RecipeContainer: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center items vertically
    paddingHorizontal: 75,
  },
  PlusImage: {
    width: 30,
    height: 30,
    marginRight: 2,
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
