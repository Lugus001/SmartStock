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

function SearchBrand({navigation}) {
  const [allBrandData, setAllBrandData] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Handlers for navigation
  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  async function getAllData() {
    try {
      const res = await axios.get('http://192.168.186.217:8083/get-all-brand');
      console.log(res.data);

      if (Array.isArray(res.data.data)) {
        setAllBrandData(res.data.data);
        setFilteredBrands(res.data.data); // Initialize with all data
      } else {
        console.error('Fetched data is not an array:', res.data.data);
      }
    } catch (error) {
      console.error('Error fetching brand data:', error);
    }
  }

  function handleChange(query) {
    setSearchQuery(query);
    if (Array.isArray(allBrandData)) {
      const filtered = allBrandData.filter(
        brand =>
          (brand.ingredient &&
            brand.ingredient.toLowerCase().includes(query.toLowerCase())) ||
          (brand.name &&
            brand.name.toLowerCase().includes(query.toLowerCase())) ||
          (brand.g && brand.g.toLowerCase().includes(query.toLowerCase())),
      );
      setFilteredBrands(filtered);
    } else {
      console.error('allBrandData is not an array:', allBrandData);
    }
  }

  useEffect(() => {
    getAllData();
  }, []);

  const handleBrandSelect = brand => {
    navigation.navigate('CreateIngredients', {selectedBrand: brand});
  };

  const BrandCard = ({data}) => (
    <TouchableOpacity onPress={() => handleBrandSelect(data)}>
      <View style={styles.card}>
        <View style={styles.cardDetails}>
          <Text style={styles.name}>{data.name}</Text>
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
              placeholder="Search Brand"
              placeholderTextColor={'#707070'}
              value={searchQuery}
              onChangeText={handleChange}
            />
          </View>
        </View>
        <Text>
          {searchQuery.length > 0
            ? `${filteredBrands.length} records found`
            : `Total Records ${allBrandData.length} `}
        </Text>
      </View>
      <FlatList
        data={searchQuery.length > 0 ? filteredBrands : allBrandData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => <BrandCard data={item} />}
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

export default SearchBrand;
