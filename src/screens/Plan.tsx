import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import axios from 'axios';
import {format, isValid} from 'date-fns';
import Svg, {Text as SvgText} from 'react-native-svg';
import CheckBox from '../components/CheckBox';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Plan = ({navigation}) => {
  const [allPlanData, setAllPlanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const handleLeftIconPress = () => {
    navigation.navigate('Home');
  };

  const handleRightIconPress = () => {
    navigation.navigate('CreatePlan');
  };

  const getAllData = async () => {
    try {
      const res = await axios.get('http://192.168.186.217:8083/get-all-plan');
      if (Array.isArray(res.data.data)) {
        setAllPlanData(res.data.data);
      } else {
        setError('Fetched data is not an array.');
      }
    } catch (error) {
      console.error('Network error', error);
      setError(`Error fetching Purchase data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const storeCheckedItems = async items => {
    try {
      await AsyncStorage.setItem('checkedItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving checked items', error.message);
    }
  };

  const loadCheckedItems = async () => {
    try {
      const storedCheckedItems = await AsyncStorage.getItem('checkedItems');
      if (storedCheckedItems) {
        setCheckedItems(JSON.parse(storedCheckedItems));
      }
    } catch (error) {
      console.error('Error loading checked items', error.message);
    }
  };

  useEffect(() => {
    getAllData();
    loadCheckedItems();
  }, []);

  const handleCheckBoxToggle = async itemId => {
    try {
      const isChecked = !checkedItems[itemId];
      const updatedCheckedItems = {
        ...checkedItems,
        [itemId]: isChecked,
      };
      setCheckedItems(updatedCheckedItems);
      storeCheckedItems(updatedCheckedItems);

      // Fetch the selected plan's details
      const plan = allPlanData.find(item => item._id === itemId);
      if (plan && plan.recipeInfo) {
        for (let ingredient of plan.recipeInfo) {
          // Fetch the current stock for each ingredient
          const stockResponse = await axios.get(
            `http://192.168.186.217:8083/stocks/${ingredient.id}`,
          );
          const currentStock = stockResponse.data;

          // Calculate the new stock quantity
          let newStock;
          if (isChecked) {
            newStock = currentStock.g - ingredient.lg * plan.qd;
          } else {
            newStock = currentStock.g + ingredient.lg * plan.qd;
          }

          // Prevent stock from going below zero
          newStock = Math.max(newStock, 0);

          // Update the stock in the database
          await axios.put(
            `http://192.168.186.217:8083/stocks/${ingredient.id}`,
            {g: newStock},
          );
        }
      }
    } catch (error) {
      console.error('Error updating stock:', error.message);
      alert('Failed to update stock. Please try again.');
    }
  };

  const handleClearButtonPress = async itemId => {
    try {
      await axios.delete(`http://192.168.186.217:8083/plan/${itemId}`);
      setAllPlanData(prevState =>
        prevState.filter(item => item._id !== itemId),
      );
      setCheckedItems(prevState => {
        const updatedCheckedItems = {...prevState};
        delete updatedCheckedItems[itemId];
        return updatedCheckedItems;
      });
    } catch (error) {
      console.error('Delete error', error.message);
    }
  };

  const renderItem = ({item}) => {
    if (!item || !item.date) return null;

    const parsedDate = new Date(item.date);
    if (!isValid(parsedDate)) return null;

    const isChecked = !!checkedItems[item._id];
    const statusText = isChecked ? 'Planned' : 'Planning . . .';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.statusContainer}>
            <Text style={styles.head}>{statusText}</Text>
            {isChecked && (
              <TouchableOpacity
                onPress={() => handleClearButtonPress(item._id)}
                style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.separator} />
        <View style={styles.cardDetails}>
          <View style={styles.rowDetails}>
            <CheckBox
              isChecked={isChecked}
              onPress={() => handleCheckBoxToggle(item._id)}
              style={undefined}
            />
            <View style={styles.textContainer}>
              <Text style={styles.medium}>Product: {item.name}</Text>
              <Text style={styles.normal}>Quantity: {item.qd}</Text>
              <Text style={styles.normal}>
                Date: {format(parsedDate, 'MMMM dd, yyyy')}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ActivityReportPlan')}
          style={styles.svgButton}>
          <Svg width="300" height="20">
            <SvgText
              x="220"
              y="15"
              fill={COLORS.primaryYellowHex}
              fontSize="13"
              textAnchor="middle">
              Recipe Data
            </SvgText>
          </Svg>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryWhiteHex} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Sort the data so checked items are at the bottom
  const sortedData = allPlanData.slice().sort((a, b) => {
    if (checkedItems[a._id] && !checkedItems[b._id]) {
      return 1;
    }
    if (!checkedItems[a._id] && checkedItems[b._id]) {
      return -1;
    }
    return 0;
  });

  return (
    <View style={styles.container}>
      <HeaderBar
        title="   Production Planning"
        onLeftIconPress={handleLeftIconPress}
        onRightIconPress={handleRightIconPress}
      />
      {allPlanData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No purchase data available.</Text>
        </View>
      ) : (
        <FlatList
          data={sortedData}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default Plan;

const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Text
  errorText: {
    color: COLORS.primaryRedHex,
    fontSize: 16,
  },
  emptyText: {
    color: COLORS.primaryWhiteHex,
    fontSize: 16,
  },
  head: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryWhiteHex,
  },
  medium: {
    fontSize: 16,
    color: COLORS.primaryWhiteHex,
  },
  normal: {
    fontSize: 14,
    color: COLORS.primaryWhiteHex,
  },

  // Button
  clearButton: {
    backgroundColor: COLORS.primaryRedHex,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearButtonText: {
    color: COLORS.primaryWhiteHex,
    fontSize: 14,
  },
  svgButton: {
    marginTop: 16,
    alignItems: 'center',
  },

  // Layout
  card: {
    backgroundColor: COLORS.primaryGreyHex,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.primaryWhiteHex,
    marginVertical: 8,
  },
  cardDetails: {
    marginTop: 8,
  },
  rowDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 8,
  },
});
