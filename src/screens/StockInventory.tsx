import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  TextInput,
} from 'react-native';
import {COLORS} from '../theme/theme';
import axios from 'axios';
import Svg, {Rect} from 'react-native-svg';
import {format} from 'date-fns';
import {useNavigation} from '@react-navigation/native';
import {debounce} from 'lodash';
import SettingBar from '../components/settiingStockBar';
import {Dimensions} from 'react-native';

const StockInventory = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [allStocksData, setAllStocksData] = useState([]);
  const [allRecipeData, setAllRecipeData] = useState([]);
  const [allPlanData, setAllPlanData] = useState([]);
  const [allIngredientsData, setAllIngredientsData] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [allPercentageData, setAllPercentageData] = useState([]);

  const navigation = useNavigation();

  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  const handleRightIconPress = () => {
    navigation.navigate('SettingStock');
  };

  const combineStocks = stocks => {
    const combinedStocks = stocks.reduce((acc, stock) => {
      const key = `${stock.ingredient}-${stock.brand}-${stock.date}`;
      if (acc[key]) {
        acc[key].g += stock.g;
      } else {
        acc[key] = {...stock};
      }
      return acc;
    }, {});
    return Object.values(combinedStocks);
  };

  const getAllData = async () => {
    try {
      const [stockRes, planRes, recipeRes, ingredientRes, settingRes] =
        await Promise.all([
          axios.get('http://192.168.186.217:8083/get-all-stock'),
          axios.get('http://192.168.186.217:8083/get-all-plan'),
          axios.get('http://192.168.186.217:8083/get-all-recipe'),
          axios.get('http://192.168.186.217:8083/get-all-ingredient'),
          axios.get('http://192.168.186.217:8083/get-all-setting'),
        ]);

      const combinedData = combineStocks(stockRes.data.data || []);
      setAllStocksData(combinedData);
      setFilteredStocks(combinedData);

      if (Array.isArray(recipeRes.data.data)) {
        console.log(
          'Fetched Recipe Data:',
          JSON.stringify(recipeRes.data.data, null, 2),
        );
        setAllRecipeData(recipeRes.data.data);
      } else {
        console.error(
          'Fetched recipe data is not an array:',
          recipeRes.data.data,
        );
      }

      if (Array.isArray(planRes.data.data)) {
        console.log(
          'Fetched Plan Data:',
          JSON.stringify(planRes.data.data, null, 2),
        );
        setAllPlanData(planRes.data.data);
      } else {
        console.error('Fetched plan data is not an array:', planRes.data.data);
      }

      if (Array.isArray(settingRes.data.data)) {
        console.log(
          'Fetched Setting Data:',
          JSON.stringify(settingRes.data.data, null, 2),
        );
        setAllPercentageData(settingRes.data.data);
      } else {
        console.error(
          'Fetched percentage data is not an array:',
          settingRes.data.data,
        );
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again later.');
    }
  };

  const handleChange = useCallback(
    debounce(query => {
      setSearchQuery(query);
      const filtered = allStocksData.filter(
        stock =>
          stock.ingredient?.toLowerCase().includes(query.toLowerCase()) ||
          stock.brand?.toLowerCase().includes(query.toLowerCase()) ||
          (stock.g && stock.g.toString().includes(query)) ||
          stock.date?.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredStocks(filtered);
    }, 300),
    [allStocksData],
  );

  useEffect(() => {
    getAllData();
  }, []);

  const handleStockSelect = stock => {
    setSelectedStock(stock);
    navigation.navigate('SelectedStocks', {selectedStock: stock});
  };

  const handleDeleteStock = async stockId => {
    try {
      await axios.delete(`http://192.168.186.217:8083/stock/${stockId}`);
      const updatedStocksData = allStocksData.filter(
        stock => stock._id !== stockId,
      );
      const updatedFilteredStocks = filteredStocks.filter(
        stock => stock._id !== stockId,
      );
      setAllStocksData(updatedStocksData);
      setFilteredStocks(updatedFilteredStocks);
      Alert.alert('Success', 'Stock item deleted successfully.');
    } catch (error) {
      console.error('Error deleting stock item:', error);
      Alert.alert('Error', 'Failed to delete stock item.');
    }
  };

  const confirmDeleteStock = stockId => {
    Alert.alert(
      'Delete Stock',
      'Are you sure you want to delete this stock item?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', onPress: () => handleDeleteStock(stockId)},
      ],
      {cancelable: true},
    );
  };

  const sortStocks = () => {
    const sorted = [...filteredStocks].sort((a, b) =>
      sortOrder === 'asc' ? a.g - b.g : b.g - a.g,
    );
    setFilteredStocks(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const StockCard = ({data}) => {
    const settingPercentage = allPercentageData.find(
      setting => setting.id === data.id,
    );

    const percentage = settingPercentage
      ? settingPercentage.percentage / 100
      : 1;

    const plan = allPlanData.find(plan => plan.id === data.id);
    const qd = plan ? parseFloat(plan.qd) : 0;

    const stock = allStocksData.find(
      stock => stock.ingredient === data.ingredient,
    );
    const g = stock ? parseFloat(stock.g) : 0;

    // Normalize the ingredient name for comparison
    const normalizedIngredient = data.ingredient.trim().toLowerCase();

    // Find the recipe that contains the ingredient, case insensitive and trimmed
    const recipe = allRecipeData.find(recipe => {
      const match = recipe.ingredients.some(
        ing => ing.ingredient.trim().toLowerCase() === normalizedIngredient,
      );
      return match;
    });

    // Extract the lg value, if the ingredient is found in the recipe
    const ingredientFromRecipe = recipe?.ingredients.find(
      ing => ing.ingredient.trim().toLowerCase() === normalizedIngredient,
    );

    const lg = ingredientFromRecipe?.lg || 1;

    // Calculate the new stock value using qd and lg
    const calculatedStock = g - qd * lg;

    // Find the ingredientData that contains the ingredient, case insensitive and trimmed
    const ingredientData = allIngredientsData.find(
      ingredientData =>
        ingredientData.ingredient?.trim().toLowerCase() ===
        normalizedIngredient,
    );

    let placeData;
    if (ingredientData && Array.isArray(ingredientData.place)) {
      placeData = ingredientData.place[0];
    } else {
    }

    const l = placeData?.l || 1;

    // Maximum Lead Time Calculation
    const safetyBuffer = 2;
    const maxLeadTime = l + safetyBuffer;

    // Minimum Quantity (Safety Stock) calculation
    const minQuantity = g * qd + percentage;

    // Max Daily Usage Calculation
    const maxDailyUsage = minQuantity * l + safetyBuffer; // Assuming g is total gram and qd is quantity demand

    // Reorder Point calculation
    const percentageGram = g + percentage;
    const maxQuantity = Math.round(maxDailyUsage * maxLeadTime * percentage); // Rounding to integer
    const reorderPoint = (maxQuantity - percentageGram) / l;

    // Determine if stock level is below reorder point
    const showWarning = g <= reorderPoint;

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => handleStockSelect(data)}
          style={styles.card}>
          <View style={styles.cardDetails}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.ingredients}>{data.ingredient}</Text>
              <Text style={styles.brand}>[{data.brand}]</Text>
            </View>
            <Text style={styles.g}>In Stock: {calculatedStock} g</Text>
            <Text style={styles.maxQuantity}>
              Max Quantity: {maxQuantity} g
            </Text>
            <Text style={styles.reorderPoint}>
              Reorder Point: {reorderPoint.toFixed(2)} g
            </Text>

            {showWarning && (
              <Text style={styles.warningText}>
                Warning: Stock at or below reorder point!
              </Text>
            )}

            <LineBar
              quantity={g}
              maxQuantity={maxDailyUsage * maxLeadTime * percentage}
              reorderWidth={reorderPoint}
              percentage={percentage}
            />
            <Text style={styles.date}>
              Last Update: {format(new Date(data.date), 'dd/MM/yyyy')}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => confirmDeleteStock(data._id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SettingBar
        title="Stock Inventory"
        onLeftIconPress={handleLeftIconPress}
        onRightIconPress={handleRightIconPress}
      />
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleChange}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={filteredStocks}
        renderItem={({item}) => <StockCard data={item} />}
        keyExtractor={item => item._id}
        style={styles.flatList}
      />
      <TouchableOpacity onPress={sortStocks} style={styles.sortButton}>
        <Text style={styles.sortButtonText}>
          Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const LineBar = ({quantity, maxQuantity, reorderWidth, reorderPoint}) => {
  const screenWidth = Dimensions.get('window').width * 0.8; // 80% of the screen width

  // Ensure valid numbers for calculation
  const validMaxQuantity =
    isFinite(maxQuantity) && maxQuantity > 0 ? maxQuantity : 1; // Avoid division by zero and Infinity
  const validReorderWidth = isFinite(reorderWidth) ? reorderWidth : 0; // Default to 0 if invalid

  const scaledQuantityWidth = (quantity / validMaxQuantity) * screenWidth;
  const validatedReorderWidth =
    (validReorderWidth / validMaxQuantity) * screenWidth;

  // Check if calculated values are valid
  if (!isFinite(scaledQuantityWidth) || !isFinite(validatedReorderWidth)) {
    console.error('Invalid value for LineBar calculations:', {
      scaledQuantityWidth,
      validatedReorderWidth,
      quantity,
      maxQuantity,
      reorderWidth,
      reorderPoint,
    });
    return null; // Exit rendering if values are invalid
  }

  return (
    <View style={styles.lineBarContainer}>
      <Svg height="20" width={screenWidth}>
        {/* Background bar */}
        <Rect x="0" y="5" width={screenWidth} height="10" fill="#e0e0e0" />

        {/* Filled bar */}
        <Rect
          x="0"
          y="5"
          width={Math.max(0, scaledQuantityWidth)}
          height="10"
          fill="#3b82f6"
        />

        {/* Reorder point indicator */}
        <Rect
          x={Math.max(0, validatedReorderWidth) - 1}
          y="5"
          width="2"
          height="10"
          fill="#ef4444"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  searchContainer: {
    marginBottom: 16,
    padding: 16,
  },
  searchInput: {
    backgroundColor: COLORS.primaryWhiteHex,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: COLORS.primaryBlackHex,
  },
  cardContainer: {
    marginBottom: 16,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.primaryWhiteHex,
    padding: 16,
    borderRadius: 8,
  },
  cardDetails: {
    flexDirection: 'column',
  },
  ingredients: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlackHex,
  },
  brand: {
    fontSize: 16,
    color: COLORS.primaryBlackHex,
  },
  g: {
    fontSize: 14,
    marginVertical: 4,
    color: COLORS.primaryBlackHex,
  },
  maxQuantity: {
    fontSize: 14,
    marginVertical: 4,
    color: COLORS.primaryBlackHex,
  },
  reorderPoint: {
    fontSize: 14,
    marginVertical: 4,
    color: COLORS.primaryBlackHex,
  },
  warningText: {
    fontSize: 14,
    color: COLORS.primaryRedHex,
    fontWeight: 'bold',
  },
  recipeInfo: {
    fontSize: 14,
    color: COLORS.primaryBlackHex,
    marginVertical: 4,
  },
  date: {
    fontSize: 12,
    color: COLORS.primaryBlackHex,
  },
  deleteButton: {
    backgroundColor: COLORS.primaryGreyHex,
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: COLORS.primaryRedHex,
    fontWeight: 'bold',
  },
  lineBarContainer: {
    marginVertical: 8,
  },
  sortButton: {
    backgroundColor: COLORS.primaryGreyHex,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  sortButtonText: {
    color: COLORS.primaryWhiteHex,
    fontWeight: 'bold',
  },
  flatList: {
    marginTop: 16,
  },
});

export default StockInventory;
