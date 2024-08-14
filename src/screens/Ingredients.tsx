import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import HeaderBar from '../components/HeaderBar';
import SearchBar from '../components/SearchBar';
import {COLORS} from '../theme/theme';
import axios from 'axios';

const Ingredients = ({navigation}) => {
  const [selectedIngredient, setSelectedIngredients] = useState(null);
  const [allIngredientData, setAllIngredientData] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLeftIconPress = () => {
    navigation.navigate('Home');
  };

  const handleRightIconPress = () => {
    navigation.navigate('CreateIngredients');
  };

  async function getAllData() {
    try {
      const res = await axios.get(
        'http://192.168.186.217:8083/get-all-ingredient',
      );
      if (Array.isArray(res.data.data)) {
        setAllIngredientData(res.data.data);
        setFilteredIngredients(res.data.data);
      } else {
        console.error('Fetched data is not an array:', res.data.data);
      }
    } catch (error) {
      console.error('Error fetching ingredient data:', error);
    }
  }

  const handleChange = query => {
    setSearchQuery(query);
    if (Array.isArray(allIngredientData)) {
      const filtered = allIngredientData.filter(
        ingredients =>
          ingredients.ingredient?.toLowerCase().includes(query.toLowerCase()) ||
          ingredients.brand?.toLowerCase().includes(query.toLowerCase()) ||
          (ingredients.g && ingredients.g.toString().includes(query)) ||
          ingredients.where?.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredIngredients(filtered);
    } else {
      console.error('allIngredientData is not an array:', allIngredientData);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const handleIngredientSelect = brand => {
    setSelectedIngredients(brand);
    navigation.navigate('SelectedIngredients', {selectedIngredient: brand});
  };

  const IngredientCard = ({data}) => {
    const place = data.place[0]; // Accessing the first place in the array

    return (
      <TouchableOpacity onPress={() => handleIngredientSelect(data)}>
        <View style={styles.card}>
          <View style={styles.cardDetails}>
            <Text style={styles.ingredients}>
              Ingredient: {data.ingredient}
            </Text>
            <Text style={styles.name}>Brand: {data.brand}</Text>
            <Text style={styles.name}>{data.g} G</Text>
            {place ? (
              <>
                <Text style={styles.name}>
                  Places Of Purchase : {place.where}
                </Text>
                <Text style={styles.name}>Lead Time : {place.l}</Text>
              </>
            ) : (
              <Text style={styles.name}>No purchase details available</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Ingredients"
        onLeftIconPress={handleLeftIconPress}
        onRightIconPress={handleRightIconPress}
      />
      <View style={styles.searchContainer}>
        <SearchBar
          onSearch={handleChange}
          title="Search Ingredients..."
          textColor={COLORS.searchBlack}
        />
        <Text style={styles.recordCount}>
          {searchQuery.length > 0
            ? `${filteredIngredients.length} records found`
            : `Total Records ${allIngredientData.length}`}
        </Text>

        <FlatList
          data={
            searchQuery.length > 0 ? filteredIngredients : allIngredientData
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item._id.toString()}
          renderItem={({item}) => <IngredientCard data={item} />}
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

  name: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#777777',
    marginBottom: 5,
  },

  ingredients: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlackHex,
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

  cardDetails: {
    flex: 1,
  },

  recordCount: {
    fontSize: 14,
    color: COLORS.primaryBlackHex,
    marginVertical: 8,
  },
});

export default Ingredients;
