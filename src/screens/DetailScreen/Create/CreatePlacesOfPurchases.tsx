import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import NameIconBar from '../../../components/NameIconBar';
import {COLORS} from '../../../theme/theme';

import SaveButton from '../../../components/SaveButton';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Svg, {Image as SvgImage, Rect} from 'react-native-svg';

const CreatePlacesOfPurchase = () => {
  //set value for navigation
  const navigation = useNavigation();

  // Handlers for navigation
  const handleLeftIconPress = () => {
    navigation.goBack();
  };
  //set value for Save section
  const [PlacesOfPurchaseName, setPlacesOfPurchaseName] = useState('');
  const [leadTime, setLeadTime] = useState('');

  const handleSavePlacesOfPurchase = async () => {
    try {
      const response = await axios.post(
        'http://192.168.186.217:8083/placesOfPurchase',
        {
          where: PlacesOfPurchaseName,
          l: leadTime,
        },
      );
      if (response.status === 201) {
        Alert.alert('Ingredient saved successfully');
        setPlacesOfPurchaseName('');
      } else {
        Alert.alert('Failed to save ingredient');
      }
    } catch (error) {
      console.error('Axios error:', error.message);
      Alert.alert('Network Error', 'Unable to connect to the server.');
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <NameIconBar
            title="Create Places Of Purchase "
            onLeftIconPress={handleLeftIconPress}
          />

          <View style={styles.contentContainer}>
            {/* Name field set Places Of Purchase Name} */}
            <Text style={styles.label}>Places Of Purchase Name :</Text>
            {/* Input field inside the rectangle */}
            <TextInput
              style={[styles.input, {color: COLORS.primaryWhiteHex}]}
              value={PlacesOfPurchaseName}
              onChangeText={setPlacesOfPurchaseName}
              placeholder="Enter Places Of Purchase Name"
              placeholderTextColor={COLORS.primaryDarkGreyHex}
            />
            <Text style={styles.label02}>Lead Time (l)</Text>
            <TextInput
              style={[
                styles.orderNumInput,
                {color: COLORS.primaryWhiteHex, textAlign: 'center'},
              ]}
              value={leadTime.toString()}
              keyboardType="numeric"
              onChangeText={text => setLeadTime(Number(text))}
              placeholder="Enter Lead Time"
              placeholderTextColor={COLORS.primaryDarkGreyHex}
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

          <SaveButton onPress={handleSavePlacesOfPurchase} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const QuantityAdjuster = ({increment, decrement}) => (
  <View style={styles.orderNumContainer}>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  label: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    marginBottom: 10,
    marginRight: 100,
    marginTop: 20,
  },
  label02: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    marginBottom: 10,
    marginRight: 230,
    marginLeft: 20,
    marginTop: 30,
  },
  input: {
    width: 350,
    height: 45,
    backgroundColor: COLORS.darkSlateBlueHex,
    borderRadius: 5,
    paddingHorizontal: 25,
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
  orderNumInput: {
    flex: 1,
    backgroundColor: COLORS.darkSlateBlueHex,
    borderRadius: 10,
    height: 45,
    width: 350,
    fontSize: 20,
    marginBottom: 10,
  },
  orderNumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInputContainer: {
    margin: 20,
  },
});
export default CreatePlacesOfPurchase;
