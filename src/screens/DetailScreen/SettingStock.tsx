import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import NameIconBar from '../../components/NameIconBar';
import {COLORS} from '../../theme/theme';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import SaveButton from '../../components/SaveButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingStock = () => {
  const [percentage, setPercentage] = useState('');
  const [savedPercentage, setSavedPercentage] = useState(null);
  const [percentageId, setPercentageId] = useState(null);
  const navigation = useNavigation();

  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchSavedPercentage = async () => {
      try {
        const savedValue = await AsyncStorage.getItem('savedPercentage');
        const savedId = await AsyncStorage.getItem('percentageId');
        if (savedValue !== null && savedId !== null) {
          setSavedPercentage(savedValue);
          setPercentageId(savedId);
        }
      } catch (error) {
        console.error('Error fetching saved percentage:', error);
      }
    };
    fetchSavedPercentage();
  }, []);

  const handleSaveSettingStock = async () => {
    if (parseInt(percentage) > 100) {
      Alert.alert('Invalid Percentage', 'Percentage must be at most 100.');
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.186.217:8083/SettingStock',
        {percentage: percentage},
      );
      if (response.status === 201) {
        const {_id} = response.data;
        Alert.alert('Percentage saved successfully');
        setSavedPercentage(percentage);
        setPercentageId(_id);
        await AsyncStorage.setItem('savedPercentage', percentage);
        await AsyncStorage.setItem('percentageId', _id);
        setPercentage('');
      } else {
        Alert.alert('Failed to save Percentage');
      }
    } catch (error) {
      console.error('Axios error:', error.message);
      Alert.alert('Network Error', 'Unable to connect to the server.');
    }
  };

  const handlePercentageChange = text => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPercentage(numericText);
  };

  const handleDeletePercentage = async () => {
    if (!percentageId) {
      Alert.alert('Error', 'No percentage ID found.');
      return;
    }

    try {
      const response = await axios.delete(
        `http://192.168.186.217:8083/setting/${percentageId}`,
      );
      if (response.status === 200) {
        await AsyncStorage.removeItem('savedPercentage');
        await AsyncStorage.removeItem('percentageId');
        setSavedPercentage(null);
        setPercentageId(null);
        Alert.alert('Success', 'Percentage deleted successfully.');
      } else {
        Alert.alert('Error', 'Failed to delete percentage.');
      }
    } catch (error) {
      console.error('Error deleting percentage:', error.message);
      Alert.alert('Error', 'Failed to delete percentage.');
    }
  };

  const confirmDeletePercentage = () => {
    Alert.alert(
      'Delete Percentage',
      'Are you sure you want to delete this percentage?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: handleDeletePercentage},
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.container}>
      <NameIconBar
        title="Settings Stocks"
        onLeftIconPress={handleLeftIconPress}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.label}>Limit of stock:</Text>

        {savedPercentage !== null && (
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageText}>{savedPercentage}%</Text>
            <TouchableOpacity
              onPress={confirmDeletePercentage}
              style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          style={styles.input}
          value={percentage}
          onChangeText={handlePercentageChange}
          keyboardType="numeric"
          placeholder="100"
          placeholderTextColor={COLORS.primaryDarkGreyHex}
        />

        <Text style={styles.percen}>%</Text>
      </View>

      <SaveButton onPress={handleSaveSettingStock} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    padding: 35,
  },
  label: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    marginBottom: 10,
    marginRight: 50,
    marginTop: 10,
  },
  percen: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    marginBottom: 30,
    marginRight: 100,
    marginLeft: 30,
    marginTop: 10,
  },
  input: {
    width: 90,
    height: 45,
    backgroundColor: COLORS.darkSlateBlueHex,
    borderRadius: 5,
    paddingHorizontal: 25,
    color: COLORS.primaryWhiteHex,
    marginBottom: 20,
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  percentageText: {
    color: COLORS.primaryWhiteHex,
    fontSize: 20,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: COLORS.primaryRedHex,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deleteButtonText: {
    color: COLORS.primaryWhiteHex,
    fontSize: 14,
  },
});

export default SettingStock;
