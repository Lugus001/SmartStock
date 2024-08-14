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

function SearchPlacesOfPurchase({navigation}) {
  const [allPlacesOfPurchaseData, setAllPlacesOfPurchaseData] = useState([]);
  const [filteredPlacesOfPurchases, setFilteredPlacesOfPurchases] = useState(
    [],
  );
  const [searchQuery, setSearchQuery] = useState('');

  const handleLeftIconPress = () => {
    navigation.goBack();
  };

  async function getAllData() {
    try {
      const res = await axios.get(
        'http://192.168.186.217:8083/get-all-SearchPlacesOfPurchase',
      );
      console.log(res.data);

      if (Array.isArray(res.data.data)) {
        setAllPlacesOfPurchaseData(res.data.data);
        setFilteredPlacesOfPurchases(res.data.data); // Initialize with all data
      } else {
        console.error('Fetched data is not an array:', res.data.data);
      }
    } catch (error) {
      console.error('Error fetching Purchasings data:', error);
    }
  }

  function handleChange(query) {
    setSearchQuery(query);
    const filtered = allPlacesOfPurchaseData.filter(
      place =>
        place.where && place.where.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredPlacesOfPurchases(filtered);
  }

  useEffect(() => {
    getAllData();
  }, []);

  const handlePlacesOfPurchaseSelect = place => {
    navigation.navigate('CreatePurchasing', {
      selectedPlacesOfPurchase: {where: place.where, l: place.l},
    });
  };

  const PlacesOfPurchasesCard = ({data}) => (
    <TouchableOpacity onPress={() => handlePlacesOfPurchaseSelect(data)}>
      <View style={styles.card}>
        <View style={styles.cardDetails}>
          <Text style={styles.where}>{data.where}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LeftIcon onLeftIconPress={handleLeftIconPress} />
        <View style={styles.searchBar}>
          <Image
            source={require('../../../assets/icon/bs.png')}
            style={styles.iconImage}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search place.."
            placeholderTextColor={COLORS.primaryBlackHex}
            value={searchQuery}
            onChangeText={handleChange}
          />
        </View>
        <Text>
          {searchQuery.length > 0
            ? `${filteredPlacesOfPurchases.length} records found`
            : `Total Records ${filteredPlacesOfPurchases.length}`}
        </Text>
      </View>

      <FlatList
        data={filteredPlacesOfPurchases}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id.toString()}
        renderItem={({item}) => <PlacesOfPurchasesCard data={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    paddingLeft: 5,
    color: COLORS.primaryBlackHex,
    fontSize: 18,
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
    marginBottom: 10,
    justifyContent: 'space-between',
    alignContent: 'center',
    backgroundColor: COLORS.primaryRedHex,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    paddingLeft: 15,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 20,
    backgroundColor: COLORS.primaryBlackHex,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryWhiteHex,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
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
  where: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primaryBlackHex,
  },
  iconImage: {
    width: 18,
    height: 18,
  },
});

export default SearchPlacesOfPurchase;
