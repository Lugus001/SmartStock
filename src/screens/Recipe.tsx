import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {COLORS} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import SearchBar from '../components/SearchBar';
import axios from 'axios';
import Svg, {Rect, Image as SvgImage} from 'react-native-svg';

const Recipe = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipes] = useState(null);
  const [allRecipeData, setAllRecipeData] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // Handlers for navigation
  const handleLeftIconPress = () => {
    navigation.navigate('Home');
  };
  const handleRightIconPress = () => {
    navigation.navigate('CreateRecipe');
  };

  async function getAllData() {
    try {
      const res = await axios.get('http://192.168.186.217:8083/get-all-recipe');
      if (Array.isArray(res.data.data)) {
        setAllRecipeData(res.data.data);
        setFilteredRecipes(res.data.data);
      } else {
        console.error('Fetched data is not an array:', res.data.data);
      }
    } catch (error) {
      console.error('Error fetching Recipe data:', error);
    }
  }

  const handleChange = query => {
    setSearchQuery(query);
    if (Array.isArray(allRecipeData)) {
      const filtered = allRecipeData.filter(
        recipes =>
          recipes.name?.toLowerCase().includes(query.toLowerCase()) ||
          recipes.qpro?.toString().includes(query),
      );
      setFilteredRecipes(filtered);
    } else {
      console.error('allIngredientData is not an array:', allRecipeData);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const handleRecipeSelect = name => {
    setSelectedRecipes(name);
    navigation.navigate('SelectedRecipes', {selectedRecipe: name});
  };

  const handleDeleteButton = async itemId => {
    try {
      await axios.delete(`http://192.168.186.217:8083/recipe/${itemId}`);
      setAllRecipeData(prevState =>
        prevState.filter(item => item._id !== itemId),
      );
    } catch (error) {
      console.error('Delete error', error.message);
    }
  };

  const RecipeCard = ({data}) => (
    <TouchableOpacity onPress={() => handleRecipeSelect(data)}>
      <View style={styles.card}>
        <View style={styles.cardDetails}>
          <Text style={styles.name}>Recipe Name : {data.name}</Text>
          <Text style={styles.name}>{data.qpro} piece </Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteButton(data._id)}>
          <Svg width="25" height="25" viewBox="0 0 24 24">
            <Rect
              width="24"
              height="24"
              rx="12"
              fill={COLORS.darkSlateBlueHex}
            />
            <SvgImage
              x="4"
              y="4"
              width="16"
              height="16"
              href={require('../assets/icon/delete.png')}
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Recipe DashBoard"
        onLeftIconPress={handleLeftIconPress}
        onRightIconPress={handleRightIconPress}
      />
      <View style={styles.searchContainer}>
        <SearchBar
          onSearch={handleChange}
          title="Search Recipe..."
          textColor={COLORS.searchBlack}
        />
        <Text style={styles.recordCount}>
          {searchQuery.length > 0
            ? `${filteredRecipes.length} records found`
            : `Total Records ${allRecipeData.length}`}
        </Text>

        <FlatList
          data={searchQuery.length > 0 ? filteredRecipes : allRecipeData}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => <RecipeCard data={item} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  cardDetails: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryWhiteHex,
    padding: 18,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlackHex,
  },
  recordCount: {
    fontSize: 14,
    color: COLORS.primaryBlackHex,
    marginVertical: 8,
  },
});

export default Recipe;
