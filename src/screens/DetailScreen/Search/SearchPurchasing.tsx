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

function SearchPurchasing({navigation}) {
  const [allPurchasingData, setAllPurchasingData] = useState([]);
  const [filteredPurchasings, setFilteredPurchasings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Handlers for navigation
  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    getAllData();
  }, []);

  async function getAllData() {
    try {
      const res = await axios.get(
        'http://192.168.186.217:8083/get-all-purchasing',
      );
      console.log(res.data);

      if (Array.isArray(res.data.data)) {
        setAllPurchasingData(res.data.data);
        setFilteredPurchasings(res.data.data); // Initialize with all data
      } else {
        console.error('Fetched data is not an array:', res.data.data);
      }
    } catch (error) {
      console.error('Error fetching Purchasings data:', error);
    }
  }

  function handleChange(query) {
    setSearchQuery(query);
    const filtered = allPurchasingData.filter(
      purchasing =>
        (purchasing.ingredient &&
          purchasing.ingredient.toLowerCase().includes(query.toLowerCase())) ||
        (purchasing.brand &&
          purchasing.brand.toLowerCase().includes(query.toLowerCase())) ||
        (typeof purchasing.g === 'string' &&
          purchasing.g.toLowerCase().includes(query.toLowerCase())) ||
        (typeof purchasing.prize === 'string' &&
          purchasing.prize.toLowerCase().includes(query.toLowerCase())) ||
        (purchasing.where &&
          purchasing.where.toLowerCase().includes(query.toLowerCase())),
    );
    setFilteredPurchasings(filtered);
  }

  const handlePurchasingSelect = purchasing => {
    const navigateToCreatePurchasing = navigation.navigate('CreatePurchasing', {
      selectedPurchasing: purchasing.where,
    });
    const navigateToCreateIngredients = navigation.navigate(
      'CreateIngredients',
      {
        selectedPlacesOfPurchase: purchasing.where,
      },
    );
    Promise.all([navigateToCreatePurchasing, navigateToCreateIngredients])
      .then(() => console.log('Navigated to both screens'))
      .catch(error => console.error('Error navigating to screens:', error));
  };

  const PurchasingCard = ({data}) => (
    <TouchableOpacity onPress={() => handlePurchasingSelect(data)}>
      <View style={styles.card}>
        <View style={styles.cardDetails}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.name}>{data.ingredients}</Text>
            <Text style={styles.ingredients}> [{data.band}]</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.ingredients}>{data.g} (g)</Text>
            <Text style={styles.ingredients}>{data.prize} Bath</Text>
          </View>
          <Text style={styles.name}>Purchasing: {data.where}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View
        style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 10}}>
        <LeftIcon onLeftIconPress={handleLeftIconPress} />
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Image
              source={require('../../../assets/icon/bs.png')}
              style={styles.iconImage}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search ..."
              placeholderTextColor={'#707070'}
              value={searchQuery}
              onChangeText={handleChange}
            />
          </View>
          <Text style={{color: 'white'}}>
            {searchQuery.length > 0
              ? `${filteredPurchasings.length} records found`
              : `Total Records ${allPurchasingData.length} `}
          </Text>
        </View>
      </View>

      <FlatList
        data={searchQuery.length > 0 ? filteredPurchasings : allPurchasingData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => <PurchasingCard data={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.primaryBlackHex,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    paddingLeft: 10,
    color: '#707070',
    fontSize: 15,
  },
  searchIcon: {
    flexDirection: 'row',
    alignItems: 'center',
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
  cardDetails: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primaryBlackHex,
  },
  ingredients: {
    fontSize: 15,
    color: '#777777',
    marginLeft: 5,
  },
  iconImage: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
});

export default SearchPurchasing;
