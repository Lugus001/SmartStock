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
import LeftIcon from '../../../components/LeftIcon';

function SearchIngredientBr({navigation}) {
  const [allIngredientData, setAllIngredientData] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  async function getAllData() {
    try {
      const res = await axios.get(
        'http://192.168.186.217:8083/get-all-ingredient',
      );
      console.log(res.data);

      if (Array.isArray(res.data.data)) {
        setAllIngredientData(res.data.data);
        setFilteredIngredients(res.data.data); // Initialize with all data
      } else {
        console.error('Fetched data is not an array:', res.data.data);
      }
    } catch (error) {
      console.error('Error fetching ingredient data:', error);
    }
  }

  function handleChange(query) {
    setSearchQuery(query);
    const filtered = allIngredientData.filter(
      ingredient =>
        ingredient.ingredient?.toLowerCase().includes(query.toLowerCase()) ||
        ingredient.brand?.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredIngredients(filtered);
  }

  useEffect(() => {
    getAllData();
  }, []);

  const handleIngredientSelect = ingredient => {
    navigation.navigate('CreateBrand', {
      selectedIngredient: ingredient,
    });
  };

  const IngredientCard = ({data}) => (
    <TouchableOpacity onPress={() => handleIngredientSelect(data)}>
      <View style={styles.card}>
        <View style={styles.cardDetails}>
          <Text style={styles.name}>{data.ingredient}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', paddingLeft: 10}}>
        <LeftIcon onLeftIconPress={handleLeftIconPress} />
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Image
              source={require('../../../assets/icon/bs.png')}
              style={styles.iconImage}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Ingredient"
              placeholderTextColor="#707070"
              value={searchQuery}
              onChangeText={handleChange}
            />
          </View>
        </View>
        <Text>
          {searchQuery.length > 0
            ? `${filteredIngredients.length} records found`
            : `Total Records ${allIngredientData.length}`}
        </Text>
      </View>
      <FlatList
        data={searchQuery.length > 0 ? filteredIngredients : allIngredientData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => <IngredientCard data={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    paddingLeft: 10,
    color: COLORS.primaryBlackHex,
    fontSize: 18,
    width: 230,
  },
  searchIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 10,
    color: 'black',
  },
  viewStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textStyle: {
    fontSize: 28,
    color: COLORS.primaryBlackHex,
  },
  headingStyle: {
    fontSize: 30,
    color: COLORS.primaryWhiteHex,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.primaryBlackHex,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryWhiteHex,
    padding: 15,
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
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlackHex,
    marginBottom: 5,
  },
  ingredients: {
    fontSize: 14,
    color: '#777777',
  },
  iconImage: {
    width: 18,
    height: 18,
  },
});

export default SearchIngredientBr;
