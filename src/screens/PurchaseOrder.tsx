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

const PurchaseOrder = ({navigation}) => {
  const [allPurchaseData, setAllPurchaseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  const handleLeftIconPress = () => {
    navigation.navigate('Home');
  };

  const handleRightIconPress = () => {
    navigation.navigate('CreatePurchasing');
  };

  const getAllData = async () => {
    try {
      const res = await axios.get(
        'http://192.168.186.217:8083/get-all-purchasing',
      );
      if (Array.isArray(res.data.data)) {
        setAllPurchaseData(res.data.data);
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

  useEffect(() => {
    getAllData();
  }, []);

  const handleCheckBoxToggle = itemId => {
    setCheckedItems(prevState => {
      const updatedCheckedItems = {
        ...prevState,
        [itemId]: !prevState[itemId],
      };

      return updatedCheckedItems;
    });
  };

  const handleClearButtonPress = async itemId => {
    try {
      await axios.delete(`http://192.168.186.217:8083/purchasings/${itemId}`);
      setAllPurchaseData(prevState =>
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
    const statusText = isChecked ? 'Purchased' : 'Purchasing . . .';

    // Ensure the brand is found and the value of g is used
    const brand = item.brand;
    const purchasingOrder = brand ? brand.g * 1 : 0; // Calculate Purchasing Order

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
            />
            <View style={styles.textContainer}>
              <View style={styles.rowDetails}>
                <Text style={styles.medium}>
                  {typeof item.ingredients === 'string'
                    ? item.ingredients
                    : 'No ingredients'}
                </Text>
                {item.brand && (
                  <Text style={styles.medium}>
                    [{brand?.name || item.brand}]
                  </Text>
                )}
              </View>
              <Text style={styles.normal}>Purchasing: {purchasingOrder}</Text>
              <Text style={styles.normal}>Lead Time: {item.l} Day</Text>
              <Text style={styles.normal}>
                Order Date: {format(parsedDate, 'MMMM dd, yyyy')}
              </Text>
            </View>
          </View>
        </View>
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
  const sortedData = allPurchaseData.slice().sort((a, b) => {
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
        title="OverView"
        onLeftIconPress={handleLeftIconPress}
        onRightIconPress={handleRightIconPress}
      />
      {allPurchaseData.length === 0 ? (
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

export default PurchaseOrder;

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
