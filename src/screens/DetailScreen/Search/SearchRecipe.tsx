import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {COLORS} from '../../../theme/theme';
import searchIcon from '../../../assets/icon/search.png';

function SearchRecipe({navigation}) {
  const [allRecipeData, setAllRecipeData] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);

  async function getAllData() {
    try {
      const res = await axios.get('http://192.168.186.217:8083/get-all-recipe');
      console.log(res.data);

      if (Array.isArray(res.data.data)) {
        setAllRecipeData(res.data.data);
        setFilteredRecipes(res.data.data); // Initialize with all data
      } else {
        console.error('Fetched data is not an array:', res.data.data);
      }
    } catch (error) {
      console.error('Error fetching recipe data:', error);
    }
  }

  function handleChange(query) {
    setSearchQuery(query);
    if (Array.isArray(allRecipeData)) {
      const filtered = allRecipeData.filter(
        recipe =>
          (recipe.name &&
            recipe.name.toLowerCase().includes(query.toLowerCase())) ||
          (recipe.description &&
            recipe.description.toLowerCase().includes(query.toLowerCase())) ||
          (recipe.ingredients_per_quantity &&
            JSON.stringify(recipe.ingredients_per_quantity)
              .toLowerCase()
              .includes(query.toLowerCase())),
      );
      setFilteredRecipes(filtered);
    } else {
      console.error('allRecipeData is not an array:', allRecipeData);
    }
  }

  useEffect(() => {
    getAllData();
  }, []);

  const handleRecipeSelect = (recipe: any) => {
    setSelectedRecipe(recipe);
    navigation.navigate('Recipe', {selectedRecipe: recipe});
  };

  const RecipeCard = ({data}: {data: any}) => (
    <TouchableOpacity onPress={() => handleRecipeSelect(data)}>
      <View style={styles.card}>
        {/*<Image
          source={{
            uri:
              data.image == '' || data.image == null
                ? 'data:image/png;base64,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'
                : data.image,
          }}
          style={styles.image}
        />*/}
        <Text style={styles.cardText}>{data.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={styles.searchIcon}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for recipes..."
            placeholderTextColor={'#707070'}
            onChangeText={text => setSearchQuery(text)}
            value={searchQuery}
          />
        </View>

        <TouchableOpacity
          onPress={() => setSearchQuery(searchQuery)}
          style={styles.searchButton}>
          <Image source={searchIcon} style={styles.iconImage} />
        </TouchableOpacity>
      </View>
      <Text>
        {searchQuery.length > 0
          ? `${filteredRecipes.length} records found`
          : `Total Records ${allRecipeData.length} `}
      </Text>
      <FlatList
        data={searchQuery.length > 0 ? filteredRecipes : allRecipeData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => <RecipeCard data={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 9,
    paddingLeft: 16,
    paddingRight: 80,
    backgroundColor: COLORS.primaryBlackHex,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: COLORS.primaryWhiteHex,
  },
  searchInput: {
    flex: 1,
    color: 'black',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  iconImage: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.primaryGreyHex,
    marginLeft: 10,
  },
  searchButton: {
    marginLeft: 10,
  },
  searchIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: COLORS.primaryGreyHex,
    borderRadius: 8,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: COLORS.primaryGreyHex,
  },
  cardText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.primaryBlackHex,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default SearchRecipe;
function setSelectedRecipe(recipe: any) {
  throw new Error('Function not implemented.');
}
