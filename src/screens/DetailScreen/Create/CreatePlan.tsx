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

const CreatePlan = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [selectedRecipes, setSelectedRecipes] = useState('');
  const [selectedQP, setSelectedQP] = useState(''); //QP
  const [orderNum, setOrderNum] = useState(0); //QD
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.selectedRecipe) {
      const {name, qpro} = route.params.selectedRecipe;
      setSelectedRecipes(name);
      setSelectedQP(qpro ? qpro.toString() : '');
    }
  }, [route.params?.selectedRecipe]);

  const handleSavePlan = async () => {
    if (!isValid(date)) {
      Alert.alert('Error', 'Invalid date value');
      return;
    }

    const formattedDate = format(date, 'yyyy-MM-dd');
    const qpNumber = Number(selectedQP); // Convert to number

    if (selectedRecipes && !isNaN(qpNumber) && orderNum > 0 && formattedDate) {
      setLoading(true);
      try {
        await axios.post('http://192.168.186.217:8083/plan', {
          name: selectedRecipes,
          qp: qpNumber, // Use qpNumber instead of selectedQP
          qd: orderNum,
          date: formattedDate,
        });

        setSelectedRecipes('');
        setSelectedQP('');
        setOrderNum(0);
        setDate(new Date());
        Alert.alert('Success', 'Plan saved successfully');
      } catch (error) {
        console.error('Error saving Plan:', error.response?.data || error);
        Alert.alert(
          'Error',
          error.response?.data?.error || 'Error saving Plan',
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
          title="Create Plan"
          onLeftIconPress={() => navigation.goBack()}
        />
        <View style={styles.contentContainer}>
          <Label text="Choose Recipe" paddingRight={150} marginBottom={5} />
          <SearchField
            selectedItem={`${selectedRecipes} ${selectedQP}`}
            clearSelection={() => {
              setSelectedRecipes('');
              setSelectedQP('');
            }}
            onPressSearch={() => navigation.navigate('SearchPlan')}
          />
          <Label
            text=" Quantity to be Product"
            paddingRight={100}
            marginBottom={1}
          />
          <View style={styles.searchPlanContainer}>
            <TextInput
              style={[
                styles.orderNumInput,
                {color: COLORS.primaryWhiteHex, textAlign: 'center'},
              ]}
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

          <Label text="Date" paddingRight={275} marginBottom={20} />
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

          <View style={{marginTop: 30}}>
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primaryWhiteHex} />
            ) : (
              <SaveButton onPress={handleSavePlan} />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const Label = ({text, paddingRight, marginBottom}) => (
  <Text
    style={{
      color: COLORS.primaryWhiteHex,
      fontSize: 20,
      marginTop: 10,
      paddingRight,
      marginBottom,
    }}>
    {text}
  </Text>
);

const SearchField = ({selectedItem, clearSelection, onPressSearch}) => (
  <View style={styles.searchPlanContainer}>
    <View style={styles.selectedPlan}>
      {selectedItem ? (
        <Text style={styles.selectedPlanText}>{selectedItem}</Text>
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
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    margin: 20,
  },
  searchPlanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginRight: 15,
    marginBottom: 25,
  },
  selectedPlan: {
    backgroundColor: COLORS.darkSlateBlueHex,
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  selectedPlanText: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: COLORS.primaryWhiteHex,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    color: COLORS.primaryWhiteHex,
  },
  orderNumInput: {
    flex: 1,
    backgroundColor: COLORS.darkSlateBlueHex,
    borderRadius: 10,
    height: 50,
    fontSize: 20,
  },
  orderNumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    marginHorizontal: 5,
  },
});

export default CreatePlan;
